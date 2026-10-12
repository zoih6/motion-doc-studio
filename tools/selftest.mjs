// Smoke-test the engine + every resource pack inside the real film page (no rendering to video).
//   node tools/selftest.mjs        (run from repo root)  → exit 1 on any failure
import { chromium } from 'playwright';
import { resolve } from 'node:path'; import { pathToFileURL } from 'node:url';
const b = await chromium.launch({ args: ['--allow-file-access-from-files', '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); const errs = [];
p.on('pageerror', e => errs.push('pageerror ' + e.message));
await p.goto(pathToFileURL(resolve('engine/index.html')).href);
await p.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
const r = await p.evaluate(async () => {
  const out = { fail: [] }, F = (k, e) => out.fail.push(k + ': ' + (e && e.message || e));
  out.counts = { fonts: FONT_REGISTRY.length, palettes: NICE_PALETTES.length, icons: Object.keys(LUCIDE).length, gl: GLT.list().length, moves: Object.keys(MOVES).length, trans: Object.keys(TRANS).length, patterns: PATTERN_KINDS.length, heritage: Object.keys(HERITAGE).length };
  // fonts actually load
  for (const f of FONT_REGISTRY) { const w = f.weights[0].split(' ').pop(); try { await document.fonts.load(`${w} 40px "${f.family}"`, 'أب'); if (!document.fonts.check(`${w} 40px "${f.family}"`, 'أب')) F('font ' + f.family, 'not loaded'); } catch (e) { F('font ' + f.family, e); } }
  // every move at several progress values
  const box = { x: 960, y: 540, w: 300, h: 120 };
  for (const n of Object.keys(MOVES)) for (const t of [0, .1, .4, .8, 1.2, 3]) { try { move(n, t, 0, box, () => { g.fillRect(-150, -60, 300, 120); }); } catch (e) { F('move ' + n, e); } }
  try { seqMove([['dropIn', 0], ['tada', 1], ['fadeOutUp', 2.5]], 1.5, box, () => {}); staggerMove('fadeInRight', 1, 0, [box, { ...box, x: 500 }], () => {}, { order: 'rtl' }); } catch (e) { F('seq/stagger', e); }
  // icons, patterns, palettes
  for (const n of Object.keys(LUCIDE)) { try { iconPath(n); } catch (e) { F('icon ' + n, e); } }
  try { icon('landmark', 960, 540, 200, { k: .5 }); if (!iconSearch('time').length) F('iconSearch', 'empty'); } catch (e) { F('icon draw', e); }
  for (const k of PATTERN_KINDS) { try { pattern(k, 1.3, { x: 0, y: 0, w: 400, h: 300, k: .7 }); } catch (e) { F('pattern ' + k, e); } }
  try { const roles = paletteRoles(palette(7)); if (!roles.bg || !roles.accent) F('paletteRoles', JSON.stringify(roles)); out.darkPalettes = palettesBy({ dark: true }).length; heritage('mamlukGold'); oc('teal', 6); } catch (e) { F('palettes', e); }
  // every TRANS key (canvas + GL) at mid progress, inside a real render
  const s1 = SHOTS[1], keep = [s1.tin, s1.tdur];
  for (const k of Object.keys(TRANS)) { try { s1.tin = k; s1.tdur = 1; render(s1.a + .5); } catch (e) { F('trans ' + k, e); } }
  [s1.tin, s1.tdur] = keep; render(1.5);
  const d = g.getImageData(960, 540, 1, 1).data; out.pixel = [...d];
  return out; });
await b.close();
console.log(JSON.stringify(r.counts), 'darkPalettes', r.darkPalettes);
const fails = [...errs, ...r.fail];
if (fails.length) { console.log('FAIL', fails.length); console.log(fails.slice(0, 40).join('\n')); process.exit(1); }
console.log('selftest OK');
