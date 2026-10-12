#!/usr/bin/env bash
# Scaffold a new film repo folder from this skill:  tools/new_film.sh /var/tmp/my-film
# → my-film/{film (engine copy), tools, docs (templates), assets/{real,gen}}
set -e; S="$(cd "$(dirname "$0")/.." && pwd)"; D=$1; [ -z "$D" ] && { echo "usage: $0 DEST"; exit 1; }
mkdir -p "$D"/{docs,assets/real,assets/gen,film/assets}
cp -r "$S/engine/." "$D/film/"; rm -rf "$D/film/tmp" "$D/film/segments" "$D/film/renders"
cp -r "$S/tools" "$D/"; cp "$S/package.json" "$S/.gitignore" "$D/"
cp "$S/templates/brief.md" "$S/templates/shotlist.md" "$S/templates/PROGRESS.md" "$D/docs/"
cp "$S/rules/qa_checklist.md" "$D/docs/QA.md"
cp "$S/templates/LISTEN.md" "$D/docs/LISTEN.md"; mkdir -p "$D/film/audio"; cp "$S/templates/sound.json" "$D/film/audio/sound.json"
mkdir -p "$D/vendor"; cp -r "$S/vendor/." "$D/vendor/"   # pinned sound-layer for offline setup (tools/sound_layer.sh)
cat > "$D/AGENTS.md" <<EOT
# Film project — built with Motion-Doc Studio
Follow the Motion-Doc Studio skill (skills/motion-doc-studio/SKILL.md of zoih6/motion-doc-studio) and, for sound,
skills/motion-sound-layer (workflow/10_sound_layer.md). Project memory: docs/PROGRESS.md.
Film page: film/index.html · scenes: film/scenes/*.js (sound cues: cue.* from film/cues.js) · tools: tools/ (run from film/)
Sound: cd film && ../tools/sound_layer.sh setup . && ../tools/sound_layer.sh kit . → PAGE=index.html node ../tools/export_cues.mjs
EOT
echo "scaffolded $D — next: cd $D && ./tools/setup.sh && git init -b main  (sound: cd film && ../tools/sound_layer.sh setup .)"
