# INSTALL: instructions for the AI agent

> **You are an AI coding agent and the user asked you to install Motion-Doc Studio.** Follow these steps in
> order. Run the commands yourself. Ask the user only if a step needs a password or a choice you can't make.
> Talk to the user in their language. The whole install takes 2–5 minutes, plus ≈3–10 min if you also build the sound kit.

**What you are installing:** `zoih6/motion-doc-studio` v2.1. It has three Agent Skills:
- `motion-director`: **start here.** The Creative Director / prompt engineer turns the user's messy idea into a pro brief (one question round, research, 3 concepts, one confirmation).
- `motion-doc-studio`: makes documentary/explainer/reel motion-graphics films and kinetic-text/lyric films (`engine/type.js`) up to a GitHub release.
- `motion-sound-layer`: adds real CC0 SFX and music placed from the picture's timing, a −14 LUFS mix, and QA gates.

The studio files (engine, tools, rules, library, vendored sound-layer) live in one folder, by default
`~/.motion-doc-studio`. The skills find it on their own with `skills/*/scripts/studio.sh`.

---

## Step 1: Pick the method for the agent you are

| You are… | Run this (pick ONE row) |
|---|---|
| **Claude Code** | `claude plugin marketplace add zoih6/motion-doc-studio && claude plugin install motion-doc-studio@motion-doc-studio`, **then also** Step 2 with `MDS_AGENTS=agents` (installs ffmpeg/uv/Chromium and the studio home) |
| **Gemini CLI** | `gemini extensions install https://github.com/zoih6/motion-doc-studio`, then Step 2 |
| **Codex CLI** | `codex plugin marketplace add zoih6/motion-doc-studio && codex plugin add motion-doc-studio@motion-doc-studio`, then Step 2 with `MDS_AGENTS=agents` (dependencies + studio home) |
| **Cursor, Copilot, OpenCode, Windsurf, Cline, Amp, Kiro, Antigravity, any other agent with a shell** | Step 2 |
| **No bash (plain Windows)** | Use WSL or Git Bash and do Step 2. Otherwise run `npx skills add zoih6/motion-doc-studio -g -y`, then `git clone --depth 1 https://github.com/zoih6/motion-doc-studio %USERPROFILE%\.motion-doc-studio` and install ffmpeg, uv and Node ≥18 |

## Step 2: Run the universal installer
```bash
curl -fsSL https://raw.githubusercontent.com/zoih6/motion-doc-studio/main/install.sh | bash
```
It clones or updates `~/.motion-doc-studio` and installs **ffmpeg, uv, npm packages and Playwright Chromium**
(it may ask for `sudo` on Linux). It links all three skills into `~/.agents/skills` plus every agent folder that
exists (`~/.claude`, `~/.cursor`, `~/.copilot`, `~/.config/opencode`, `~/.windsurf`). Then it verifies the
install. Useful options (env vars, before `bash`):
- `MDS_KIT=1` also builds the CC0 sound library now (1,139 sounds, ≈220 MB). Use it if the user wants sound right away.
- `MDS_PROJECT=$PWD` also installs into this project (`.claude/skills`, `.agents/skills`).
- `MDS_AGENTS="claude cursor"` installs only into these agents. `MDS_DEPS=0` skips dependencies.
- `MDS_HOME=/path` puts the studio somewhere else. `MDS_UNINSTALL=1` removes the links.

Alternative (skills only, no dependencies): `npx skills add zoih6/motion-doc-studio -g -y`. The skills will
clone the studio the first time they run, and `tools/setup.sh` installs the dependencies.

## Step 3: Verify (don't skip it)
The installer must end with `✓ Motion-Doc Studio v2.x installed`. Confirm with:
```bash
bash ~/.agents/skills/motion-doc-studio/scripts/studio.sh          # prints the studio path
ls ~/.motion-doc-studio/skills                                       # motion-director  motion-doc-studio  motion-sound-layer
cd ~/.motion-doc-studio && node tools/selftest.mjs                   # "selftest OK" (needs the deps)
```
If something failed, fix that one item. For example, install ffmpeg with the OS package manager, uv with
`curl -LsSf https://astral.sh/uv/install.sh | sh`, or Node from nodejs.org. Re-run Step 2 after that; it is idempotent.

## Step 4: Tell the user (in their language), briefly, then START the project
- What was installed (three skills, the studio location, which agents got them) in 2–3 lines. Mention anything that failed and the fix.
- Skills load on the next session in some agents (Claude Code: new session; Gemini/Codex/Cursor: restart). **You don't need
  to wait:** read `~/.motion-doc-studio/skills/motion-director/SKILL.md` now and act as the Creative Director.
- **Then immediately start the intake** (`START.md` section C). If the user already wrote an idea, go to the
  questions. Otherwise ask one question: «ما فكرة الفيديو؟ اكتبها بأي طريقة — جملة واحدة تكفي». The user never
  writes prompts: you ask (duration, aspect, voice provided/generated, images provided/generated, music, style),
  research, rewrite their idea into a professional production prompt, confirm once, and build.

## Rules after installing
- `skills/motion-doc-studio/SKILL.md` is canonical. `AGENTS.md` gives the read order. Every new project starts with `skills/motion-director`.
- One link that installs **and** starts a project: `https://raw.githubusercontent.com/zoih6/motion-doc-studio/main/START.md`.
- Never edit `vendor/opus-sound-layer` or a film's `sound-layer/`, and never loosen a QA threshold.
- Updating = re-run Step 2 (Claude Code also: `claude plugin update motion-doc-studio@motion-doc-studio`).
