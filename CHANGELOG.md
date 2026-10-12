# Changelog

## v1.1.0 — pro layer (2026-10-12)
- **engine/fx.js** (new): Penner + cubic-bezier easings, named industry curves, keyframes `kf()`, spring
  library, motion personalities; seeded simplex noise, wiggle, handheld; OKLab/OKLCH colour mixing and WCAG
  contrast; 2.5D camera rig (`cam`, `layer`: dolly, truck, pedestal, roll, orbit, vertigo, rack focus,
  impact shake); image ops (tint, sticker outline, extrude, echo, RGB split, pixelate, polaroid); post FX
  (grain, vignette, bloom, halation, chromatic aberration, light leak, lift/gamma/gain + split-tone) and 8
  LOOKS; Arabic-safe kinetic typography (word layout with accent markup, 8 entrance modes, VO-synced
  karaoke, mask reveal, marker, blur swap, variable-weight morph); graphics (panels, hand-drawn circle,
  SVG path draw-on, burst, sparkles, bubbles, pill CTA, cursor + ripple, pixel sprites, phone mock,
  stickers, seeded scatter); 16 transitions in `TRANS`.
- **core.js**: pluggable transitions (`shot.tin` = any TRANS key, `shot.tdur`, `FILM.tin`) and finishing
  chain (`FILM.post`); default behaviour unchanged (tear + sepia grade).
- **library/**: easing_timing, camera_language, transitions, kinetic_typography, color_systems,
  compositing_fx, fonts, resources (2026 open-source ecosystem); style preset **F · Sticker-Pop Dialect Ad**.
- **rules/**: motion-language spec (direction first), 2026 craft rules, advanced colour/type/finishing rules.
- **workflow/09_reference_dna.md** + **tools/video_dna.py**: measure a reference video's DNA (cuts,
  transition frame counts, flashes, palette + OKLCH, loudness, onsets, sheets) without copying it.
- **examples/reference_dna/**: full DNA breakdown of a 20 s Arabic app ad.
- **fonts**: + Readex Pro, Changa, El Messiri, Lalezar, Aref Ruqaa, Marhey, Rakkas, IBM Plex Mono (OFL);
  `tools/fonts.sh` downloads more by name.
- **tools/mix_final.sh**: outputs tagged BT.709.

## v1.0.0 — first release
Rules, workflow 00–08, library, canvas engine, tools, Thuluth example film.
