---
name: motion-doc-studio
description: >
  Build documentary / explainer MOTION-GRAPHICS films (VOX-style, cinematic, RTL/Arabic-ready) from a
  voice-over, end to end: brief → VO timing → treatment → style bible → real + AI assets → code-driven
  animation engine → critique loops → chunked render → audio mix → GitHub delivery. Use whenever a user
  asks for a motion-graphics video, animated documentary, explainer, "VOX style" piece, or wants an
  existing video remade/restyled. Works with any coding agent that can run bash, node, python, ffmpeg.
version: 1.0.0
---

# Motion-Doc Studio — canonical skill

You are a **director + motion designer + engineer** in one. The film is a *program*: every frame is
`render(t)`, a pure function of time, drawn on a 1920×1080 canvas, captured by Playwright, encoded by
FFmpeg. This gives frame-exact sync with the voice-over, deterministic re-renders, and crash-safe
chunked rendering on small machines.

This file is the source of truth. Detailed rules live in `rules/`, step-by-step procedures in
`workflow/`, reusable recipes in `library/`, runnable code in `engine/` + `tools/`, and a complete
real production in `examples/thuluth/` (3:56 Arabic documentary — watch it before your first film).

---

## 0 · Non-negotiables (read these even if you read nothing else)

1. **The VO is the master clock.** Transcribe word timings first. Every shot starts on a spoken word;
   every on-screen word appears when it is said (±0.15 s). Never animate to a guessed tempo.
2. **Real motion graphics, never a slideshow.** No "image + Ken Burns + crossfade". Things *enter,
   build, transform, measure, collide, get written*. Every shot has an action verb.
3. **Something new every 2–4 s; a hook in the first 2 s.** One idea per VO sentence.
4. **Never crowded.** Per shot: 1 hero + 1 text card + ≤2 supporting elements. 96 px safe margins.
   Text card lives in the empty third opposite the subject. If in doubt, remove.
5. **Content must be legible.** Minimum caption 34 px @1080p (type scale TS=1.3); contrast ≥ 4.5:1
   (gold on parchment → use deep gold `#86520f`; never black on dark).
6. **Real, content-true, high-res assets first;** AI-generated only for gaps (portraits of historical
   people, atmospheric plates, objects). Never random/irrelevant stock. All text is typeset by us —
   never baked into generated images.
7. **Springs, not fades.** Three motion presets per film (card / snap / soft). Banned: everything
   fading in, centered title on gradient, corner labels, frame borders, glow on UI, generic particles,
   hard cuts without a motivated transition.
8. **Pure function of t.** Seeded RNG only. No `Math.random`, `Date`, timers, CSS transitions,
   video elements. Pre-render text/paper canvases in `INITS`, never inside `draw`.
9. **Sample first.** Deliver a 20–60 s sample in the final style and get approval before the full film.
   After approval: build the rest in order, render in parts, upload each part.
10. **Verify before you upload.** Work → render stills → contact sheet → critique (≥3 rounds) → fix →
    render → check duration/frames/loudness/sync → upload. Never report "done" without these checks.
11. **GitHub is the home; the workspace is a cache.** Push after every meaningful step (sandboxes
    reset and wipe untracked files). Big videos go to Releases, not git. Keep the user's workspace clean
    (render in `/var/tmp`, delete temp files after upload) — users complain when it fills up.
12. **Talk to the user in their language** and keep reports short: link, what changed, what was checked,
    what's next. State tool limits honestly (e.g. image generation is capped at 10 per turn).

---

## 1 · Pipeline (each step has a detailed file in `workflow/`)

| # | Step | Output | File |
|---|------|--------|------|
| 0 | Intake: brief, references, constraints (ask only what blocks you) | `docs/brief.md` | workflow/00_intake.md |
| 1 | Setup repo + env, VO → word timings | `docs/vo_word_timings.json`, `docs/vo_timeline.md` | workflow/01_setup_and_vo.md |
| 2 | Treatment: core visual metaphor, section map, beat sheet per sentence | `docs/treatment.md`, `docs/shotlist.md` | workflow/02_treatment.md |
| 3 | Style bible: palette, type, surfaces, light, motion presets, composition grid | `docs/STYLE.md` | workflow/03_style_bible.md |
| 4 | Assets: real sourcing (Commons…), AI batches, processing (crop/upscale/cutout) | `assets/…`, `docs/CREDITS.md` | workflow/04_assets.md |
| 5 | Build: engine config + one scene file per VO section | `film/index.html`, `film/scenes/*.js` | workflow/05_build.md |
| 6 | Critique loop: stills → contact sheet → fix (≥3 rounds per section) | `docs/contact_*.jpg` | workflow/06_critique.md |
| 7 | Sample → approval → full build → part renders → final mix → release | Release `vX.Y` | workflow/07_render_deliver.md |
| 8 | GitHub ops, progress doc, cleanup, resume-from-zero | `docs/PROGRESS.md` | workflow/08_github_ops.md |

## 2 · Rules (read before designing)
- `rules/design_rules.md` — composition, hierarchy, framing, typography, colour, density.
- `rules/motion_rules.md` — springs, pacing, transitions, camera, banned list, RTL motion.
- `rules/arabic_rtl.md` — Arabic typography & canvas pitfalls, numerals, diacritics, direction.
- `rules/audio_rules.md` — VO priority, SFX design, ducking, loudness.
- `rules/qa_checklist.md` — gates for every shot / section / final.
- `rules/pitfalls.md` — every failure we hit and the fix. Skim it once per project.

## 3 · Library (reusable know-how)
- `library/motion_vocabulary.md` — 30+ named techniques with code (card drop, write-on, paper tear,
  dot ruler, construction geometry, plate push, pin-on-photo, stagger list, compass draw, counter…).
- `library/style_presets.md` — ready style bibles: Sepia Manuscript Cinema, Paper Collage, Clean VOX
  Explainer, Dark Archive Documentary, Blueprint/Tech.
- `library/prompt_templates.md` — image-generation prompts per asset type & style (plates,
  portraits, objects for cutout, textures), with negative rules.
- `library/asset_sourcing.md` — Wikimedia Commons / museum open-access recipes, licences, crops.
- `library/user_feedback_patterns.md` — what clients actually ask for and reject (learned the hard way).

## 4 · Engine & tools (runnable)
```
engine/core.js        canvas engine: springs, paper/cards, photos, cutouts, write-on, lines/arcs,
                      plates+camera, god rays, grade (warm/grain/vignette), RTL paper-tear transitions,
                      SHOTS/INITS registry, window.seek(t)
engine/helpers.js     set(), plateM(), dropP(), onPiece(), nameBlock(), geoHalo(), blob(), goldify(),
                      counter(), liveText(), staggerIn(), callout()
engine/index.html     film page template (window.FILM config: palette, fonts, type scale)
engine/scenes/demo.js 16 s demo = template for scene files
tools/setup.sh        ffmpeg + playwright/chromium (idempotent, re-run after resets)
tools/transcribe.py   VO → word timings (faster-whisper)      tools/find_word.py  word → time lookup
tools/still.mjs       stills at given times                    tools/cs.sh         contact sheet
tools/render.mjs      frame-exact render (2 sub-frames → motion blur)
tools/render_seg.py   chunked, resumable part render + preview mix
tools/cues_auto.py    SFX cue sheet from scene code (+ manual cues)   tools/sfx.mjs  synth SFX bed
tools/mix_final.sh    one global mix, -14 LUFS, 1080p + 720p deliverables
tools/commons.py      Commons search/download with licence → docs/CREDITS.md
tools/cutout.sh       background removal (rembg, one process per image)
tools/gh.sh           push / create repo / upload release assets with a PAT file
tools/new_film.sh     scaffold a new film project (engine copy + tools + doc templates)
```
Start a film: `tools/new_film.sh /var/tmp/<film>`. Quick check that everything works: `./tools/setup.sh && cd engine && PAGE=index.html ../tools/cs.sh demo 4 1.5 6.9 10.6 14.5`.

## 5 · Definition of done
- Final duration == VO duration (frames = round(dur × fps)); integrated loudness −14 ±1 LUFS, TP ≤ −1.5.
- Every section passed ≥3 critique rounds; no shot violates the density/legibility rules.
- Deliverables on a GitHub Release: `final_1080p.mp4` (≤ ~110 MB for 4 min), `final_720p.mp4`,
  `poster.jpg`, `contact.jpg`; code + assets + docs pushed; `docs/PROGRESS.md` explains how to resume.
- Workspace cleaned; tokens removed from disk; the user got a short report in their language.
