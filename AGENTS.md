# AGENTS.md — entry point for ANY coding agent

(Claude Code, Codex, Cursor, Gemini CLI, Copilot, Aider, Windsurf, custom agents… all read this file.)

You have been given **Motion-Doc Studio**, a complete production system for documentary motion-graphics
films. When the user asks for a motion-graphics / explainer / documentary / "VOX-style" video, or to
remake or restyle one, follow it.

## Read order (≈15 min, do not skip)
1. `skills/motion-doc-studio/SKILL.md` — canonical rules and pipeline (**source of truth**; if anything conflicts, it wins).
   Sound: `skills/motion-sound-layer/SKILL.md` (+ its verbatim `PROMPT.md`) → `workflow/10_sound_layer.md`.
2. `rules/design_rules.md`, `rules/motion_rules.md`, `rules/pitfalls.md`.
3. Watch/inspect `examples/thuluth/` (README + contact.jpg + code) — the quality bar.
4. Then the `workflow/` file of the step you are on, and the `library/` file of the decision you are making
   (easing_timing, camera_language, transitions, kinetic_typography, color_systems, compositing_fx, fonts).
   Look things up in the dictionaries instead of inventing: `library/style_catalog.md` (40 styles),
   `library/motion_recipes.md` (84 moves), `library/gl_transitions.md` (125 transitions), `library/effects_dictionary.md`,
   `library/glossary.md`, `library/shot_cards_index.md` (124 shot cards), `library/icons.md`, `library/patterns.md`.
   Vendored expert originals (offline, with licences): `resources/README.md`.
5. Reference video from the user? → `workflow/09_reference_dna.md` + `tools/video_dna.py` (learn the grammar, never copy).
6. Sound (SFX + music + final mix) → `workflow/10_sound_layer.md`: cues from `engine/cues.js`, real CC0 recordings,
   `vendor/opus-sound-layer` scripts **unmodified**, `qa.py` decides, the human ear checks `LISTEN.md`.

## Operating mode
- Plan → execute → verify. Use the workflow files as checklists.
- Ask the user only what blocks you (see `workflow/00_intake.md`), with options, in their language.
- Show a sample before the full build. Push to GitHub after every step. Render in parts.
- Never claim done without the QA gates in `rules/qa_checklist.md`.

## Environment assumptions
bash, node ≥18, python ≥3.10, ffmpeg, ~2 GB RAM is enough (chunked rendering). Network for asset
sourcing. Optional: an image-generation tool (for AI plates/portraits), faster-whisper, rembg.
If a tool is missing, adapt (e.g. no image generator → use only real assets + procedural drawing),
and tell the user.

## Installing / adapting to your agent
Not installed yet? Follow `INSTALL.md` (one procedure for every agent). Summary:
- **Claude Code:** `/plugin marketplace add zoih6/motion-doc-studio` → `/plugin install motion-doc-studio@motion-doc-studio`
  (skills `motion-doc-studio` + `motion-sound-layer`). Or `npx skills add zoih6/motion-doc-studio`.
- **Codex:** `codex plugin marketplace add zoih6/motion-doc-studio && codex plugin add motion-doc-studio@motion-doc-studio`, or the installer (`~/.agents/skills/`).
- **Gemini CLI:** `gemini extensions install https://github.com/zoih6/motion-doc-studio` (reads `GEMINI.md` + `skills/`).
- **Cursor / Copilot / OpenCode / Windsurf / Cline / others:** `npx skills add zoih6/motion-doc-studio`, or
  `curl -fsSL https://raw.githubusercontent.com/zoih6/motion-doc-studio/main/install.sh | bash`.
  Inside this repo, `.cursor/rules/motion-doc-studio.mdc` and `.github/copilot-instructions.md` point here.
- **Anything else:** clone the repo and read this file. The skills locate the studio themselves
  (`skills/*/scripts/studio.sh`, default home `~/.motion-doc-studio`, override with `$MDS_HOME`).
