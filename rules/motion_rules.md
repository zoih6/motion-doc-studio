# Motion rules

## 1. Physics, not tweens
- Use **damped springs** for every entrance (`sp(t, t0, preset)`), cubic in-out (`ease`) for camera
  moves, `easeOut` for write-ons. Linear only for continuous drifts (rays, breathing).
- Exactly **three presets** per film so the motion feels designed, e.g.
  `card: [150, 19]` (paper landing, slight overshoot) · `snap: [320, 28]` (dots, ticks, stamps) ·
  `soft: [60, 15]` (big reveals, crowns, heroes).
- Guard against overshoot artefacts: radii/scales → `Math.max(0, …)`; alpha → `clamp(k*3)`.
- Everything alive "breathes" a little (±1.6 px, ±0.15°) so the frame never freezes — including holds.

## 2. Pacing
- **Hook in the first 2 s** (an action, not a logo).
- **New idea every 2–4 s.** A shot may last longer only if something keeps evolving inside it.
- Enter on the word: element reaches 90 % of its spring 0.1–0.2 s *before* the word ends.
- Stagger lists at 0.18–0.35 s per item (RTL order for Arabic).
- Holds before big statements (0.3–0.6 s of stillness) make them land; follow with a "snap".

## 3. Camera
- Every shot has a slow drift (scale 1.00 → 1.03–1.08) or a motivated push towards the subject named in
  the VO. Never static, never fast zooms.
- `camOn(scale, focusX, focusY)` around a stage point; ease over the whole shot.
- Max one camera idea per shot (push OR pan OR tilt).

## 4. Transitions
- Between shots: a motivated physical transition — **paper tear RTL** (default in collage/manuscript
  styles), slide, push-through, match on shape. Hard cut only on a hard beat (stamp, "But…").
- The outgoing shot keeps animating during the transition (render both: `drawTear(..., () => prev.draw(t))`).
- Exits: elements leave in the reading direction (to the left in RTL) or fall down; never just vanish.

## 5. Write-on & reveal
- Text writes on RTL with a soft edge (`writeOn`), 0.4–0.9 s depending on length.
- Calligraphy/ink: reveal along a stroke-order map (geodesic distance from stroke start), not a wipe.
- Lines/geometry draw on along their path (`line`, `arc`), dots land with `snap` and a 1.8→1 scale.

## 6. Banned
- Everything fading in. Centered title on a gradient. Corner labels / lower-third bars. Frame borders.
  Glow/drop-shadow on UI text. Generic particles/bokeh. Lens flares. Spinning 3D text. Bounce on serious
  topics. Slideshow (photo + Ken Burns + crossfade). Random stock that doesn't match the sentence.
  Transitions from editing-software presets.

## 7. Determinism (render = f(t))
- Seeded RNG (`rng(seed)`, `hash(a,b)`); no `Math.random`, `Date.now`, `requestAnimationFrame`, CSS
  animation, `<video>`.
- Shot functions must not keep state between frames (except pure caches keyed by t/progress).
- Any frame can be rendered alone (chunked renders start mid-film).

## 8. Motion blur
- Render 2 sub-frames per frame and blend (`render.mjs --sub 2`) — cheap, removes strobing on fast springs.
