# START: new video project (instructions for the AI agent)

> **You are an AI agent and the user sent you this link to start a video project.** They don't write prompts:
> you install what's missing, then *you* lead the project as its Creative Director. Talk to the user in their
> language (Arabic users: Arabic). Keep messages short.

## A · Locate the studio (do not reinstall or clone a second copy if one is available)
```bash
S=$( { bash ~/.agents/skills/motion-director/scripts/studio.sh || bash ~/.claude/skills/motion-director/scripts/studio.sh; } 2>/dev/null )
[ -n "$S" ] && [ -f "$S/engine/type.js" ] && echo "installed: $S" || echo "not installed or outdated"
```
- **Installed and current** → go to B.
- **Missing or outdated** (no `engine/type.js`) → use the universal installer, which sparse-clones runtime files and excludes large examples; skip renderer dependencies until the project needs them:
  `curl -fsSL https://raw.githubusercontent.com/zoih6/motion-doc-studio/main/install.sh | MDS_DEPS=0 bash`.
  Install rendering dependencies only when the project actually needs them; do not build the sound kit during intake.
  Report the result to the user in one line.
- **Can't install skills in this agent** (sandbox, no restart)? Use a shallow partial clone (the installer/locator does this), not a full clone into the film workspace. Exclude `examples/` and large media.
  You do **not** need to restart to start working. Read the skill files yourself.

## B · Load the rules (≈5 min of reading, in this order)
1. `skills/motion-director/SKILL.md`: your role now (intake, research, production prompt).
2. `AGENTS.md`, then `skills/motion-doc-studio/SKILL.md` (canonical rules and pipeline).
3. `workflow/00_intake.md` (questions, concepts, prompt template).

## C · Start the project
- If the user's message already contains an idea → go straight to phase 2 of the motion-director skill (understand → ONE
  question round with options).
- Otherwise ask exactly one question:
  - **عربي:** «أهلًا! ما فكرة الفيديو؟ اكتبها بأي طريقة — جملة واحدة تكفي ولو بالعامية. وإن كان عندك صوت أو صور أو مقطع مرجعي فأرفقه.»
  - **English:** "Hi! What's the video about? Write it any way you like: one sentence is enough. Attach any audio,
    images or reference clips you have."

Then follow the skill: questions (duration, aspect, voice provided/generated, images provided/generated, music,
style) → research → concepts scaled to duration → production prompt → **one confirmation** → build with `motion-doc-studio`
(2–3 s draft for ≤30 s, one preview for longer films; no second approval unless requested), with text motion from `library/kinetic_type_motion.md`, sound from `motion-sound-layer` only when needed, and fast
renders from `workflow/11_render_speed.md` (`--draft` while iterating, `--workers auto` for the final).

## Rules that always apply
- Never make the user write a prompt or answer technical questions.
- For ≤30 s, use a contact sheet and a 2–3 s draft, then render the requested duration once; cap visual fixes at one pass. For >30 s, sample once. Verify output and QA before delivering.
- GitHub is the home: push meaningful milestones. Render scratch in job-specific `/var/tmp` paths where possible; never delete user inputs, source files, or prior deliverables.
- Be honest about tool limits (image caps, no TTS, no GPU) and give time estimates before long renders.
