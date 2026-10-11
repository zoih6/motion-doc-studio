# 07 · Sample → full build → render → deliver

## Sample (always first)
- 20–60 s covering the hook + one rich section, in the *final* style, with VO + SFX.
- Render: `PAGE=index.html VO=tmp/vo.wav SFX=tmp/sfx.wav python3 ../tools/render_seg.py sample 0 <F1>`
- Upload to the `segments` release (`tools/gh.sh release <owner/repo> segments segments/sample.mp4`),
  send the link + 3–5 lines on what to look at. Wait for approval/feedback.
- Feedback → update the style bible + rules for this film, then continue. If the user changes style,
  redo the sample (v2, v3…) — don't patch the old look.

## Full build
- Build sections **in order**, critique each, push each.
- SFX: `python3 ../tools/cues_auto.py "scenes/*.js" extra_cues.json tmp/cues.json && node ../tools/sfx.mjs tmp/cues.json tmp/sfx.wav <dur+0.1>`

## Part renders (crash-safe, workspace-friendly)
- Split into parts of 30–60 s at integer frames (e.g. 0–2020, 2020–3104 …). Run as a background job
  that renders → keeps the silent copy outside the workspace → uploads the preview part → deletes local files.
  ```bash
  for s in "p1 0 2020" "p2 2020 3104"; do set -- $s
    PAGE=index.html VO=tmp/vo.wav SFX=tmp/sfx.wav python3 ../tools/render_seg.py $1 $2 $3
    cp renders/silent_$1.mp4 /var/tmp/silent/ && ../tools/gh.sh release <owner/repo> segments segments/$1.mp4 && rm segments/$1.mp4
  done
  ```
- Speed reference: ~55 s wall time per 6 s chunk at 1080p with 2 sub-frames on 2 vCPU → a 4-min film ≈ 35–40 min.
- Re-using an approved, unchanged part: extract its video stream (`ffmpeg -i part.mp4 -map 0:v -c copy`).

## Final assembly
```bash
cd /var/tmp/silent && for f in p*.mp4; do echo "file '$f'"; done > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy master_silent.mp4      # check nb frames == round(dur*30)
../film/tools/mix_final.sh master_silent.mp4 vo.wav sfx.wav <dur> final
```
Then: poster (`ffmpeg -ss <best moment> -frames:v 1 poster.jpg`), contact (`fps=1/10,scale=320:-1,tile=6x4`),
QA gates (rules/qa_checklist.md), release `vX.0` with final_1080p.mp4, final_720p.mp4, poster.jpg, contact.jpg.

## Report to the user (their language, short)
Links (1080p, 720p, release page) · what's in it (one line per section) · what was verified
(duration, loudness, sync, critique rounds) · housekeeping (pushed, cleaned) · next options / question.
Optionally drop the 720p file into the workspace and open it in the viewer so they can watch immediately.
