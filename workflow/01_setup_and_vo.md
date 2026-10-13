# 01 · Setup & voice-over timing

## Project layout (one repo per film)
```
<film-repo>/
  film/index.html            (copy of engine/index.html, edit window.FILM)
  film/core.js helpers.js    (copy the exact runtime files used by the film, freeze a version)
  film/kit/{fonts,textures}/ (only fonts/textures referenced by this film)
  film/scenes/s01.js …       (one file per VO section)
  film/assets/{real,gen,cut}/ processed assets used by the film
  assets/vo.mp3              original VO (never re-encoded)
  docs/ brief.md treatment.md STYLE.md shotlist.md vo_word_timings.json vo_timeline.md CREDITS.md PROGRESS.md
  tools/ (only scripts needed to build/render this film)
```
Use the installed studio as the shared engine/tool source. Do not clone the studio into the film repo, copy `examples/`, or copy all fonts/tools by default. Render work happens in a unique `/var/tmp/motion-doc-studio/<job-id>/` folder where available; keep the user's source files and existing deliverables unchanged.

## Commands
```bash
cd /var/tmp/motion-doc-studio/<job-id>   # create a unique scratch folder; work in the user's film repo only when requested
# Use the existing film repo if provided; do not clone the studio repo as the film repo.
# Resolve the installed studio with skills/motion-director/scripts/studio.sh; copy only runtime files actually imported.
<studio>/tools/setup.sh                  # once only, after checking installed dependencies
command -v faster-whisper >/dev/null 2>&1 || python3 -c 'import faster_whisper' 2>/dev/null || python3 -m pip install faster-whisper  # only if VO exists and no transcription tool is already installed
timeout 10m python3 tools/transcribe.py assets/vo.mp3 docs/vo_word_timings.json ar base  # use small/medium only when accuracy requires it and resources allow
python3 tools/find_word.py docs/vo_word_timings.json التاج الثلث     # anchors for shots
mkdir -p tmp && ffmpeg -v error -y -i assets/vo.mp3 -ar 48000 -ac 2 tmp/vo.wav
```

## Section map
From `docs/vo_timeline.md`, cut the VO into **sections** at topic changes (typically 10–60 s each) and
record exact boundaries (seconds, 2 decimals). Each section → one scene file → one render part
(parts may group small sections; part boundaries must be integer frames: `F = round(t × 30)`).
Write the map in `docs/treatment.md` as a table: `section | start | end | VO summary | visual idea`.
