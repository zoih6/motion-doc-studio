// motion-doc-studio · render.mjs v2 — deterministic frame renderer (page must expose window.ready + window.seek(t))
//
//   PAGE=index.html node ../tools/render.mjs --from 0 --to 20.8 --out out/silent.mp4        (run from the film folder)
//   … --draft                 fast preview: 1 sub-frame, 960px wide, veryfast x264   (~6-10x faster than final)
//   … --workers 4|auto        split the range into parallel browser workers, then lossless concat (auto = by CPU + RAM)
//   env: RENDER_WORKERS=auto  RENDER_DRAFT=1  RENDER_GL=swiftshader  (also honoured through tools/render_seg.py)
//   … --sub 2                 sub-frames per output frame blended (tmix) → natural motion blur (final default 2)
//   … --gl auto|cpu|swiftshader   raster backend (auto = Chromium default; swiftshader = legacy, ~5x slower)
//   … --capture canvas|screenshot  canvas = read pixels straight from the page canvas (default, fastest)
//   … --overwrite             explicitly replace an existing output (otherwise the renderer fails safely)
//
// Why it used to be slow (measured, workflow/11_render_speed.md): the old launch flags forced *2D canvas* through
// SwiftShader (a software GPU emulator) → ~330 ms per sub-frame at 1080p. Chromium's normal CPU raster path draws
// the same frame in ~60 ms (PSNR 43-48 dB vs old = visually identical). Workers then scale with CPU cores.
import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync, mkdtempSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import * as os from 'node:os';

const argv = process.argv;
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i > 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const flag = (k) => argv.includes('--' + k);
const DRAFT = flag('draft') || process.env.RENDER_DRAFT === '1';
const FPS = +arg('fps', 30), FROM = +arg('from', 0), TO = +arg('to', 20.8);
const SUB = +arg('sub', DRAFT ? 1 : 2);
const CRF = arg('crf', DRAFT ? '24' : '18');
const PRESET = arg('preset', DRAFT ? 'veryfast' : 'medium');
const WIDTH = +arg('width', DRAFT ? 960 : 0);            // 0 = native page size
const OUT = arg('out', DRAFT ? 'out/draft.mp4' : 'out/silent.mp4');
const GL = arg('gl', 'auto'), CAPTURE = arg('capture', 'canvas');
const QUALITY = +arg('jpeg', DRAFT ? 85 : 95);
const VW = +arg('vw', 1920), VH = +arg('vh', 1080);
if (existsSync(resolve(OUT)) && !flag('overwrite')) {
  console.error(`render.mjs: refusing to overwrite existing output: ${resolve(OUT)}. Choose a new --out path or pass --overwrite only when replacement is intended.`);
  process.exit(2);
}
// Chromium + node + x264 need about 0.7–0.9 GB per worker. Respect cgroup limits:
// os.totalmem() may report the host's RAM rather than this container's actual budget.
const cgroupLimit = (paths) => {
  for (const p of paths) {
    try {
      const raw = readFileSync(p, 'utf8').trim();
      if (!raw || raw === 'max') continue;
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0 && n < os.totalmem() * 4) return n;
    } catch {}
  }
  return os.totalmem();
};
const cgroupCpuLimit = () => {
  try {
    const [quota, period] = readFileSync('/sys/fs/cgroup/cpu.max', 'utf8').trim().split(/\s+/);
    if (quota !== 'max' && +quota > 0 && +period > 0) return Math.max(1, Math.floor(+quota / +period));
  } catch {}
  try {
    const quota = +readFileSync('/sys/fs/cgroup/cpu/cpu.cfs_quota_us', 'utf8').trim();
    const period = +readFileSync('/sys/fs/cgroup/cpu/cpu.cfs_period_us', 'utf8').trim();
    if (quota > 0 && period > 0) return Math.max(1, Math.floor(quota / period));
  } catch {}
  return Infinity;
};
const cpuCount = Math.max(1, Math.min(os.availableParallelism ? os.availableParallelism() : os.cpus().length, cgroupCpuLimit()));
const memoryBytes = Math.min(os.totalmem(), cgroupLimit([
  '/sys/fs/cgroup/memory.max',
  '/sys/fs/cgroup/memory/memory.limit_in_bytes',
  '/sys/fs/cgroup/memory.limit_in_bytes',
]));
const ramWorkers = Math.max(1, Math.floor((memoryBytes / 2 ** 30 - 0.8) / 0.9));
const safeWorkers = Math.max(1, Math.min(cpuCount, ramWorkers));
const autoWorkers = Math.min(6, safeWorkers);
const wArg = arg('workers', process.env.RENDER_WORKERS || '1');
const requestedWorkers = wArg === 'auto' ? autoWorkers : Math.max(1, +wArg || 1);
const WORKERS = Math.min(requestedWorkers, safeWorkers);
if (WORKERS < requestedWorkers) console.warn(`render.mjs: capping requested ${requestedWorkers} workers to ${WORKERS} for the detected ${(memoryBytes / 2 ** 30).toFixed(1)} GiB / ${cpuCount} CPU budget`);
const THREADS = +arg('threads', process.env.RENDER_THREADS || 0);   // x264 threads (0 = ffmpeg auto); workers set it per child
const IS_CHILD = flag('child');
const PAGE = process.env.PAGE || 'index.html';
const TIMEOUT_SEC = Math.max(30, +(process.env.RENDER_TIMEOUT_SEC || Math.max(120, Math.ceil((TO - FROM) * 30))));
const validateOutput = (path) => {
  try {
    const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration', '-of', 'json', path], { encoding: 'utf8', timeout: 20000 });
    const m = JSON.parse(r.stdout || '{}'), duration = Number(m.format?.duration || 0);
    return r.status === 0 && m.streams?.some((s) => s.codec_type === 'video' && s.width > 0 && s.height > 0) && Math.abs(duration - (TO - FROM)) <= Math.max(0.25, 1 / FPS);
  } catch { return false; }
};

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const frames0 = Math.round(FROM * FPS), frames1 = Math.round(TO * FPS), nFrames = frames1 - frames0;
if (nFrames <= 0) { console.error('render.mjs: empty range'); process.exit(2); }

// ───────────────────────────── parallel orchestrator ─────────────────────────────
if (WORKERS > 1 && !IS_CHILD) {
  const n = Math.min(WORKERS, Math.max(1, Math.floor(nFrames / 15)));
  // Never reuse/delete a previous run's parts: isolate scratch and preserve it on failure.
  const tmp = mkdtempSync(join(os.tmpdir(), `mds-render-${basename(OUT, '.mp4')}-`));
  const self = fileURLToPath(import.meta.url), t0 = Date.now();
  const drop = ['--from', '--to', '--out', '--workers', '--threads'];
  const pass = argv.slice(2).filter((a, i, A) => !drop.includes(a) && !drop.includes(A[i - 1]));
  const thr = String(Math.max(1, Math.floor(cpuCount / n)));
  const jobs = [];
  for (let k = 0; k < n; k++) {
    const a = frames0 + Math.floor(nFrames * k / n), b = frames0 + Math.floor(nFrames * (k + 1) / n);
    const part = join(tmp, `p${String(k).padStart(2, '0')}.mp4`);
    jobs.push({ part, p: new Promise((ok, bad) => {
      const c = spawn(process.execPath, [self, ...pass, '--child', '--from', String(a / FPS), '--to', String(b / FPS), '--out', part, '--threads', thr, '--quiet'], { stdio: ['ignore', 'pipe', 'inherit'], env: process.env });
      c.stdout.on('data', (d) => { const s = String(d).trim(); if (s) console.log(`[w${k}] ${s}`); });
      c.on('error', bad);
      c.on('close', (code) => code === 0 ? ok() : bad(new Error(`worker ${k} exited ${code}`)));
    }) });
  }
  console.log(`render.mjs: ${nFrames} frames × ${SUB} sub → ${n} workers (${cpuCount} CPUs, ${(memoryBytes / 2 ** 30).toFixed(1)} GiB memory budget)`);
  const results = await Promise.allSettled(jobs.map((j) => j.p));
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length) {
    console.error(`render.mjs: ${failed.length} worker(s) failed; preserving scratch parts at ${tmp}`);
    throw failed[0].reason;
  }
  writeFileSync(join(tmp, 'list.txt'), jobs.map((j) => `file '${j.part}'`).join('\n'));
  await new Promise((ok, bad) => {
    const c = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'), '-c', 'copy', '-movflags', '+faststart', resolve(OUT)], { stdio: 'inherit' });
    c.on('error', bad); c.on('close', (code) => code === 0 ? ok() : bad(new Error(`concat failed (${code}); parts preserved at ${tmp}`)));
  });
  if (!existsSync(resolve(OUT)) || statSync(resolve(OUT)).size <= 1000 || !validateOutput(resolve(OUT))) throw new Error(`concat output missing, empty, or invalid; parts preserved at ${tmp}`);
  rmSync(tmp, { recursive: true, force: true });
  const secs = (Date.now() - t0) / 1000;
  console.log(`done -> ${OUT}  ${secs.toFixed(0)}s  (${(secs / (nFrames / FPS)).toFixed(1)}s per film-second, ${n} workers)`);
  process.exit(0);
}

// ───────────────────────────── single worker ─────────────────────────────
const glArgs = { auto: [], cpu: ['--disable-gpu', '--disable-accelerated-2d-canvas'],
  swiftshader: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] }[GL] || [];
const browser = await chromium.launch({ args: ['--allow-file-access-from-files', '--disable-dev-shm-usage', ...glArgs] });
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto(pathToFileURL(resolve(PAGE)).href);
await page.waitForFunction(() => window.ready === true, null, { timeout: 180000 });
const cvs = await page.evaluate(() => { const c = document.querySelector('canvas'); return c ? [c.width, c.height] : null; });
let useCanvas = CAPTURE === 'canvas' && !!cvs && cvs[0] > 0;
if (!useCanvas && cvs && (cvs[0] !== VW || cvs[1] !== VH)) await page.setViewportSize({ width: cvs[0], height: cvs[1] });   // screenshot mode: match the canvas (9:16, 1:1 …)
const filters = [];
if (SUB > 1) filters.push(`tmix=frames=${SUB}`, `select='eq(mod(n\\,${SUB})\\,${SUB - 1})'`, `setpts=N/${FPS}/TB`);
if (WIDTH > 0) filters.push(`scale=${WIDTH}:-2:flags=lanczos`);
filters.push('scale=in_range=pc:out_range=tv', 'format=yuv420p');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS * SUB), '-i', '-',
  '-vf', filters.join(','), '-r', String(FPS), '-c:v', 'libx264', '-preset', PRESET, '-crf', CRF, '-color_range', 'tv',
  ...(THREADS ? ['-threads', String(THREADS), '-filter_threads', '1', '-x264-params', 'rc-lookahead=15'] : []), '-movflags', '+faststart', resolve(OUT)],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const ffClosed = new Promise((r) => ff.once('close', r));
let ffError;
ff.on('error', (e) => { ffError = e; });
ff.stdin.on('error', (e) => { ffError ||= e; });
const grab = async (t) => {
  if (useCanvas) {
    const b64 = await page.evaluate(([t, q]) => { window.seek(t); return document.querySelector('canvas').toDataURL('image/jpeg', q).slice(23); }, [t, QUALITY / 100]);
    return Buffer.from(b64, 'base64');
  }
  await page.evaluate((t) => window.seek(t), t);
  return page.screenshot({ type: 'jpeg', quality: QUALITY });
};
const total = nFrames * SUB, t0 = Date.now(), quiet = flag('quiet');
let timedOut = false, renderError;
const timeout = setTimeout(() => {
  timedOut = true;
  console.error(`render.mjs: timed out after ${TIMEOUT_SEC}s; stopping browser and encoder, preserving partial output at ${resolve(OUT)}`);
  browser.close().catch(() => {});
  if (!ff.stdin.destroyed) ff.stdin.end();
}, TIMEOUT_SEC * 1000);
timeout.unref();
try {
  for (let i = 0; i < total; i++) {
    if (timedOut) break;
    // sub-frames are centred inside each output frame → symmetric motion blur
    const t = frames0 / FPS + (i + 0.5) / (FPS * SUB) - 0.5 / FPS;
    const jpg = await grab(Math.max(0, t));
    if (timedOut) break;
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % (FPS * SUB * 2) === 0 && i > 0) {
      const el = (Date.now() - t0) / 1000, eta = el / i * (total - i);
      console.log(`${quiet ? '' : OUT + ': '}${(frames0 / FPS + i / (FPS * SUB)).toFixed(1)}s  ${(100 * i / total).toFixed(0)}%  elapsed ${el.toFixed(0)}s  eta ${eta.toFixed(0)}s`);
    }
  }
} catch (e) { renderError = e; }
clearTimeout(timeout);
if (!ff.stdin.destroyed) ff.stdin.end();
const closeTimer = setTimeout(() => ff.kill('SIGKILL'), 30000);
closeTimer.unref();
await ffClosed;
clearTimeout(closeTimer);
let browserCloseTimer;
const browserCloseDeadline = new Promise((r) => { browserCloseTimer = setTimeout(r, 10000); browserCloseTimer.unref(); });
await Promise.race([browser.close().catch(() => {}), browserCloseDeadline]);
clearTimeout(browserCloseTimer);
if (timedOut) process.exit(124);
if (renderError) throw renderError;
if (ffError) throw ffError;
const secs = (Date.now() - t0) / 1000;
if (!quiet) console.log(`done -> ${OUT}  ${secs.toFixed(0)}s  (${(secs / (nFrames / FPS)).toFixed(1)}s per film-second)`);
if (!existsSync(resolve(OUT)) || !validateOutput(resolve(OUT))) {
  console.error(`render.mjs: output failed duration/video validation; preserving it for diagnosis: ${resolve(OUT)}`);
  process.exit(1);
}
