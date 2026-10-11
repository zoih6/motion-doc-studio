# Progress — <film>
## Resume from zero
```bash
printf '%s' '<PAT>' > /tmp/.ghtok           # never commit
cd /var/tmp && git clone https://github.com/<user>/<repo>.git film && cd film && ./tools/setup.sh
mkdir -p film/tmp && ffmpeg -v error -y -i assets/vo.mp3 -ar 48000 -ac 2 film/tmp/vo.wav
cd film && python3 ../tools/cues_auto.py "scenes/*.js" ../docs/extra_cues.json tmp/cues.json && node ../tools/sfx.mjs tmp/cues.json tmp/sfx.wav <dur>
PAGE=index.html ../tools/cs.sh check 4 1 5 9 13
```
## Sections / parts
| part | frames | time | status | release asset |
|---|---|---|---|---|
## Critique log
## Open issues / next steps
## User's standing instructions
