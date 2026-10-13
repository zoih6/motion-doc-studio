#!/usr/bin/env python3
"""Crash-safe chunked render of one film part (run from the film folder):
   PAGE=index.html VO=tmp/vo.wav SFX=tmp/sfx.wav python3 ../tools/render_seg.py NAME F0 F1
   F0/F1 are frame numbers at FPS (default 30). Renders bounded chunks in fresh browsers (one retry by default),
   validates resumable chunks, concatenates by stream copy →
renders/silent_NAME.mp4, then muxes a preview mix (VO + SFX ducked, -14 LUFS) → segments/NAME.mp4"""
import sys, subprocess, os, json, signal, re
here = os.path.dirname(os.path.abspath(__file__))
name, f0, f1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
FPS = int(os.environ.get('FPS', 30))
if FPS <= 0 or f0 < 0 or f1 <= f0 or not re.fullmatch(r'[A-Za-z0-9_-]{1,80}', name):
    sys.exit('invalid NAME/FPS/frame range')
CH = FPS * max(1, int(os.environ.get('RENDER_CHUNK_SECONDS', 6)))
RETRIES = max(0, int(os.environ.get('RENDER_RETRIES', 1)))
TIMEOUT = max(60, int(os.environ.get('RENDER_TIMEOUT_SEC', max(300, 90 * CH // FPS))))
VO, SFX = os.environ.get('VO', 'tmp/vo.wav'), os.environ.get('SFX', 'tmp/sfx.wav')
for d in ('tmp/chunks', 'segments', 'renders'): os.makedirs(d, exist_ok=True)
sil = f'renders/silent_{name}.mp4'
seg = f'segments/{name}.mp4'
if os.environ.get('RENDER_OVERWRITE') != '1' and (os.path.exists(sil) or os.path.exists(seg)):
    sys.exit(f'refusing to overwrite existing output ({sil} or {seg}); choose a new name or set RENDER_OVERWRITE=1 intentionally')
parts = []
created_parts = []

def valid_video(path, expected_seconds):
    if not os.path.exists(path) or os.path.getsize(path) <= 1000:
        return False
    try:
        r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type:format=duration',
                            '-of', 'json', path], capture_output=True, text=True, timeout=20)
        data = json.loads(r.stdout)
        duration = float(data.get('format', {}).get('duration', 0))
        return r.returncode == 0 and any(s.get('codec_type') == 'video' for s in data.get('streams', [])) and duration >= expected_seconds - 0.25
    except (OSError, ValueError, subprocess.TimeoutExpired, json.JSONDecodeError):
        return False

def run_bounded(cmd, timeout):
    p = subprocess.Popen(cmd, start_new_session=True)
    try:
        return p.wait(timeout=timeout)
    except subprocess.TimeoutExpired:
        print(f'timeout after {timeout}s; stopping render process group {p.pid}', flush=True)
        try:
            os.killpg(p.pid, signal.SIGTERM)
            p.wait(timeout=10)
        except (ProcessLookupError, subprocess.TimeoutExpired):
            try: os.killpg(p.pid, signal.SIGKILL)
            except ProcessLookupError: pass
            p.wait()
        return 124

for a in range(f0, f1, CH):
    b = min(a + CH, f1); out = f'tmp/chunks/{name}_{a:05d}.mp4'; parts.append(out)
    expected = (b - a) / FPS
    if valid_video(out, expected):
        print('resume: verified existing chunk', out, flush=True); continue
    for attempt in range(RETRIES + 1):
        candidate = out + f'.run{os.getpid()}.{attempt}.part.mp4'
        r = run_bounded(['node', f'{here}/render.mjs', '--fps', str(FPS), '--from', f'{a/FPS:.6f}', '--to', f'{b/FPS:.6f}', '--sub', '2', '--crf', '20', '--out', candidate], TIMEOUT)
        if r == 0 and valid_video(candidate, expected): os.replace(candidate, out); created_parts.append(out); break
        print(f'render failed/invalid: {out}, attempt {attempt + 1}/{RETRIES + 1}, exit={r}; preserving artifacts for diagnosis', flush=True)
    else: sys.exit('chunk failed ' + out)
listfile = f'tmp/chunks/{name}_{os.getpid()}.concat.txt'
with open(listfile, 'x') as f: f.writelines(f"file '{os.path.basename(p)}'\n" for p in parts)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listfile, '-c', 'copy', sil], check=True, timeout=int(os.environ.get('RENDER_MUX_TIMEOUT_SEC', 900)))
A, D = f0 / FPS, (f1 - f0) / FPS
if os.path.exists(VO):
    ins = ['-i', sil, '-ss', f'{A}', '-t', f'{D}', '-i', VO]
    if os.path.exists(SFX):
        ins += ['-ss', f'{A}', '-t', f'{D}', '-i', SFX]
        fc = '[2:a]volume=0.5[s];[s][1:a]sidechaincompress=threshold=0.05:ratio=3[sc];[1:a][sc]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]'
    else: fc = '[1:a]loudnorm=I=-14:TP=-1.5[a]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', seg], check=True, timeout=int(os.environ.get('RENDER_MUX_TIMEOUT_SEC', 900)))
else:
    subprocess.run(['cp', sil, seg], check=True, timeout=int(os.environ.get('RENDER_MUX_TIMEOUT_SEC', 900)))
if not valid_video(sil, (f1 - f0) / FPS) or not valid_video(seg, (f1 - f0) / FPS):
    sys.exit(f'final validation failed; preserving chunks and outputs for diagnosis: {sil}, {seg}')
if os.environ.get('RENDER_KEEP_CHUNKS') != '1':
    # Only discard exact chunk files created by this successful run, never recovered/user files.
    for p in created_parts:
        if os.path.commonpath([os.path.abspath(p), os.path.abspath('tmp/chunks')]) == os.path.abspath('tmp/chunks') and os.path.exists(p): os.remove(p)
os.remove(listfile)
print('DONE', name, f'segments/{name}.mp4', flush=True)
