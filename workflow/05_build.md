# 05 · Build — scene files

## Engine contract
- `core.js` defines the world; `helpers.js` the building blocks; scenes only **register shots**:
```js
(() => {                                   // one IIFE per section file, private P{}
  const P = {};
  INITS.push(async () => {                 // load + pre-render ONCE
    await Promise.all([loadImg('pl_desk', 'assets/plate_desk.jpg'), loadImg('por_x', 'assets/por_x.jpg')]);
    P.card = card([{ t: 'ابن مقلة', size: 96, color: PAL.cream }], { seed: 31, dark: true });
    P.por = photo(A.por_x, 560, { seed: 32, rough: 7 });
  });
  SHOTS.push({ a: 49.10, b: 53.52, draw: (t) => {     // a/b = VO seconds; tin:'cut' to skip the tear
    set(A.pl_desk, t, 49.1, 53.6);                     // plate + rays
    geoHalo(t, 49.3, 1400, 520, 360);
    dropP(P.por, t, 49.2, 1400, 520, .02, 7);           // hero, right third
    drawCard(P.card, t, 49.9, 600, 520);               // card, opposite third, lands on the name
  } });
})();
```
- Times are **absolute VO seconds** copied from `find_word.py`, so re-timing = editing numbers.
- `render(t)` picks the shot containing t, draws it, tears in from the previous shot (0.62 s), then grades.

## Workflow per section
1. Write the scene file from the shot list (all shots of the section).
2. `node --check film/scenes/sNN.js`.
3. `cd film && PAGE=index.html ../tools/cs.sh sNN 4 <3 times per shot>` → inspect `tmp/cs_sNN.png`.
4. Critique & fix (workflow/06). Push.

## Patterns that work
- **Plate + one hero + one card** is the default shot. Variation comes from the action, not more stuff.
- **Pin-on-photo:** `const M = plateM(img, t, a, b, {...}); const [x, y] = M.map(px, py);` → draw rulers,
  circles, callouts glued to a feature while the camera pushes.
- **Measure/explain:** dots stack (`nuqta` + `snap`), lines draw (`line`), arcs sweep (`arc`), a compass
  draws a circle, a counter counts (`counter`).
- **Lists:** `staggerIn` or cards dropping one per word; remove previous items before a 5th.
- **Portrait beats:** portrait right, `nameBlock` (name + divider + role + dates) left, `geoHalo` behind.
- **Finale:** gather the motif, `goldify` the hero word, slow push, rays from above, everything else leaves.

## Performance
- Pre-render cards/paper/text in INITS (each `paper()` costs ms). Cache per-progress canvases (ink reveal).
- Keep plates ≤ 2560 px wide; huge images slow every frame.
- A still should render in < 300 ms; if not, find the per-frame allocation.
