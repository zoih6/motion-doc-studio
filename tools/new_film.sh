#!/usr/bin/env bash
# Scaffold a new film repo folder from this skill:  tools/new_film.sh /var/tmp/my-film [--kinetic] [--aspect 16:9|9:16|1:1|4:5]
# → my-film/{film (engine copy), tools, docs (templates), assets/{real,gen}}
#   --kinetic   text-only / lyric film: film/kinetic.html (engine/type.js) is the page; scene template scenes/kt_demo.js
#   --aspect    sets the canvas size of index.html + kinetic.html (render.mjs/still.mjs read it automatically)
set -e; S="$(cd "$(dirname "$0")/.." && pwd)"; D=$1; [ -z "$D" ] && { echo "usage: $0 DEST [--kinetic] [--aspect 9:16]"; exit 1; }
for p in "$D/film" "$D/tools" "$D/vendor" "$D/AGENTS.md" "$D/package.json" "$D/.gitignore" \
         "$D/docs/brief.md" "$D/docs/shotlist.md" "$D/docs/PROGRESS.md" "$D/docs/QA.md" "$D/docs/LISTEN.md"; do
  if [ -e "$p" ]; then echo "refusing to overwrite existing path: $p" >&2; exit 2; fi
done
shift; KIN=0; ASP=""; while [ $# -gt 0 ]; do case "$1" in --kinetic) KIN=1 ;; --aspect) ASP=$2; shift ;; esac; shift; done
mkdir -p "$D"/{docs,assets/real,assets/gen,film/assets}
cp -r "$S/engine/." "$D/film/"
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
Sound (only if needed; kit optional): cd film && ../tools/sound_layer.sh setup .; build kit only after checking free disk.
EOT
case "$ASP" in 16:9) WH="1920 1080" ;; 9:16) WH="1080 1920" ;; 1:1) WH="1080 1080" ;; 4:5) WH="1080 1350" ;; "") WH="" ;; *) echo "unknown aspect $ASP"; exit 1 ;; esac
if [ -n "$WH" ]; then set -- $WH; for f in "$D/film/index.html" "$D/film/kinetic.html"; do
  sed -i.bak -E "s/<canvas id=\"c\" width=\"[0-9]+\" height=\"[0-9]+\">/<canvas id=\"c\" width=\"$1\" height=\"$2\">/" "$f" && rm -f "$f.bak"; done; fi
PAGE=index.html; [ $KIN = 1 ] && PAGE=kinetic.html
echo "PAGE=$PAGE" > "$D/film/.page"
[ $KIN = 1 ] && printf '\nKinetic text film: page film/kinetic.html (PAGE=kinetic.html) · grammar: library/kinetic_type_motion.md of the studio · engine: film/type.js (KT)\n' >> "$D/AGENTS.md"
echo "scaffolded $D  (page: film/$PAGE${ASP:+, aspect $ASP}) — run ./tools/setup.sh once before rendering; sound setup/kit only if needed. Existing destinations are never overwritten."
