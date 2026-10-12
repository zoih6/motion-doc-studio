# Changelog

## v1.2.0: embedded dictionaries & resource packs (2026-10-12)
Everything is vendored into the repo (offline, licences preserved). Nothing is link-only any more.
- **Fonts:** 31 new OFL families, **41 in total** (Cairo, Tajawal, Almarai, IBM Plex Sans Arabic, Alexandria, Noto Naskh,
  Scheherazade New, Lateef, Markazi, Mirza, Aref Ruqaa Ink (colour), Noto Nastaliq, Gulzar, Qahiri, Reem Kufi / Fun / Ink,
  Kufam, Blaka, Lemonada, Baloo Bhaijaan 2, Jomhuria, Katibeh, Vibes, Harmattan, Mada, Handjet, Inter, Space Grotesk,
  Fraunces, JetBrains Mono). Generated `fonts.css`, `fonts.js` registry (`FONT_REGISTRY`, `fontsBy`, `fontLoads`) and licence
  table (`tools/build_fonts.py`); `library/fonts.md` rewritten (roles, 17 pairings, Arabic motion-type rules).
- **engine/gl.js + kit/data/gl_transitions.js:** 125 gl-transitions shaders (MIT/BSD, authors kept) registered as
  `TRANS['gl:<Name>']` with `shot.glParams`; procedural luma/displacement maps; `library/gl_transitions.md`.
- **engine/moves.js:** `MOVES` dictionary of 84 named moves (34 entrances, 18 exits, 21 emphasis, 11 loops), plus
  `move()`, `seqMove()`, `staggerMove()` (rtl/ltr/center/random). Original implementations. `library/motion_recipes.md`.
- **engine/assets.js:** palettes (`palette`, `paletteRoles`, `applyPalette`, `palettesBy`, `oc`, 20 original `HERITAGE`
  palettes), icons (`icon` with exact draw-on, `iconSearch`), 13 procedural patterns (`star8`, `rosette`, `star6`, `star12`,
  `girihNet`, `mashrabiya`, `dots`, `halftone`, `grid`, `lines`, `waves`, `iso`, `topo`).
- **kit/data:** `palettes.js` (1000 nice-color-palettes + Open Color, MIT), `icons_lucide.js` (1877 Lucide icons, ISC,
  per-element path + measured length).
- **library/ dictionaries (new):** `glossary.md` (bilingual, ≈170 terms → code), `style_catalog.md` (40 styles → engine
  values), `effects_dictionary.md`, `shot_cards_index.md` (124 cards, English), `icons.md`, `patterns.md`, `gl_transitions.md`,
  `motion_recipes.md`; `library/specimens/*.jpg` visual sheets.
- **resources/ (new):** vendored skills with their licences: LottieFiles motion-design, iart motion-design-skills (9),
  Emil Kowalski (animation-vocabulary, review, improve, animate, performance), GSAP skills (8), video-shotcraft shot cards
  (124 + sequences + aesthetic/beat/sound/review docs), anidoodle (22 style sheets, motion grammar, camera, craft bar), orca
  motion, collage-broll, html-animation. Plus `resources/README.md`, `resources/NOTICE.md`, `resources/licenses/`.
- **tools:** `build_data.mjs`, `build_fonts.py`, `build_docs.mjs`, `specimens.mjs`, `selftest.mjs`; render/still launch Chromium
  with SwiftShader WebGL. `engine/index.html` loads all packs; `engine/specimens.html` is a visual browser.

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
