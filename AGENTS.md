# AGENTS.md — entry point for ANY coding agent

(Claude Code, Codex, Cursor, Gemini CLI, Copilot, Aider, Windsurf, custom agents… all read this file.)

You have been given **Motion-Doc Studio**, a complete production system for documentary motion-graphics
films. When the user asks for a motion-graphics / explainer / documentary / "VOX-style" video, or to
remake or restyle one, follow it.

## Read order (≈15 min, do not skip)
1. `SKILL.md` — canonical rules and pipeline (**source of truth**; if anything conflicts, SKILL.md wins).
2. `rules/design_rules.md`, `rules/motion_rules.md`, `rules/pitfalls.md`.
3. Watch/inspect `examples/thuluth/` (README + contact.jpg + code) — the quality bar.
4. Then the `workflow/` file of the step you are on, and the `library/` file of the decision you are making
   (easing_timing, camera_language, transitions, kinetic_typography, color_systems, compositing_fx, fonts).
5. Reference video from the user? → `workflow/09_reference_dna.md` + `tools/video_dna.py` (learn the grammar, never copy).

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

## Adapting to your agent
- Claude Code / Claude skills: this folder is a valid skill (`SKILL.md` has frontmatter). Copy it to
  `~/.claude/skills/motion-doc-studio/`.
- Codex / generic: keep the folder in the project root; this AGENTS.md is auto-read.
- Cursor: `.cursor/rules/motion-doc-studio.mdc` points here. Gemini CLI: `GEMINI.md` points here.
- Copilot: `.github/copilot-instructions.md` points here.
