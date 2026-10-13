# 11 · Render speed and resource budget

## Choose the smallest adequate path

- **Up to 30 s:** one contact sheet, one 2–3 s draft preview, one final render. Do not render a 20–60 s sample, repeat the whole film as a sample, or run three critique rounds. Allow one focused visual fix pass; re-render only affected stills before the single final.
- **Over 30 s:** render one representative 20–30 s sample (or the first requested section), get the one approval already defined in the brief, then render the remaining film in resumable parts.
- **Sound:** use provided audio or already-available licensed assets by default. The complete sound kit is about 220 MB; build/download it only when the brief needs it and storage is checked. Do not build it at intake or on every run.
- **Install:** check for existing Node, FFmpeg, Playwright/Chromium, and Python tools first. Never reinstall dependencies just because a new session started. Prefer the studio's installed/sparse checkout; do not copy the examples tree into each film.
- **Transcription:** install `faster-whisper` only when a voice track needs transcription and no suitable local tool exists. Start with model `base`; do not download `medium` by default. Keep model caches outside each film repo and use a bounded command timeout.

## Preflight before downloads or rendering

1. Run `df -h <scratch-path>` and inspect memory/cgroup limits. Prefer a unique job directory under `/var/tmp/motion-doc-studio/`; fall back to a project-local ignored temp directory only when `/var/tmp` is unavailable.
2. Check source duration, output resolution, frame rate, and whether the request actually needs full sound. Keep the original inputs and prior outputs untouched.
3. Estimate frames: `duration × fps`; work estimate: `frames × subframes × measured ms/frame ÷ 1000 ÷ workers`. Use a 2–3 s draft to measure the actual scene rather than relying on the demo benchmark.
4. If free space is less than 2× the estimated final output plus intermediates, lower resolution/CRF or render sequentially in chunks; do not start a large download. Never exceed available storage silently.

## Why a render may take time

Each output frame is drawn in a headless browser. Two motion-blur subframes double the draw count. On the measured 2-vCPU demo, 1080p took about 6.1 s per film-second at final settings and 2.6 s/s in draft. This is a reference, not a guarantee: expensive scene code, full-frame effects, large images, and a constrained container can be slower. A simple 20 s render taking over an hour is abnormal; stop and diagnose rather than launching more retries.

The old SwiftShader 2D path was roughly 5× slower than Chromium's default raster path. Use `--gl auto` (default); only select another backend after measuring the page. `--capture canvas` is faster than screenshots when the film is drawn entirely on canvas.

## Working commands

| Stage | Command | Use |
|---|---|---|
| Composition | `PAGE=… ../tools/cs.sh shot 4 t1 t2 …` | Still/contact sheet, fastest |
| Motion preview | `node ../tools/render.mjs --from A --to B --draft --workers 1 --out /var/tmp/mds-job/preview.mp4` | 2–3 s only; 960 px, one subframe |
| Short final | `node ../tools/render.mjs --from 0 --to D --sub 1 --workers 1 --out /var/tmp/mds-job/final.mp4` | One render; full frame rate, no oversubscription |
| Longer final | `node ../tools/render.mjs --from 0 --to D --workers auto --out /var/tmp/mds-job/silent.mp4` | Only after container-aware RAM/disk check |
| Long film parts | `RENDER_CHUNK_SECONDS=10 RENDER_WORKERS=auto python3 ../tools/render_seg.py name F0 F1` | Resumable chunks; keep progress/status |

`--draft` means one subframe, 960 px, CRF 24, `veryfast`. The final default is 2 subframes and CRF 18; for a short turnaround deliverable, `--sub 1` is an explicit, visually reasonable speed trade-off. For vertical video, pick an output width suited to the requested resolution (e.g. 720 or 1080), not the 1920-wide landscape default.

## Bound retries and diagnose stalls

- Never run an unbounded render loop. Allow **one retry** only after checking the error and confirming that the prior process has exited and there is room for another attempt.
- Set a per-render timeout based on the measured draft/final estimate; for a 20 s simple clip, stop if it exceeds 2× the estimate or has no progress for 2 minutes. Save logs and preserve partial output for diagnosis.
- Do not start a second renderer while the first is active. Report elapsed time, current progress, remaining estimate, and the actual blocker.
- Parallel workers must respect the container/cgroup memory cap; do not infer available RAM from host `totalmem()` alone. A safe default is one worker, increasing only when measured resources allow it.

## Scene-level bottlenecks

- Avoid `ctx.filter = 'blur()'` on large images every frame; pre-blur/cache in `INITS`.
- Avoid `shadowBlur` on large paths; bake shadows into cached canvases.
- Use at most one full-frame post-FX stack.
- Never create canvases, text, or gradients inside `draw()`; create/cache once in `INITS`.
- Downscale source images to at most 2× their display size; cull off-screen and inactive objects.
- If the 2 s draft is unexpectedly slow, profile/fix the scene before a full encode.

## Completion and file safety

Verify the final exists, is non-empty, has the requested duration/resolution/frame rate, and passes the applicable audio/video QA before delivery. Keep originals, approved previews, and previous finals. Only clean scratch files created by this run after validating the replacement and confirming the exact paths are inside this job's temp folder; otherwise retain them and report the storage trade-off.
