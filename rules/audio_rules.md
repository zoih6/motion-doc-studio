# Audio rules

1. **VO is king.** Nothing may mask it. Music (if any) sits ≈ −24 dB under VO and is side-chain ducked.
2. **SFX tell the motion:** every card landing = soft paper + thump; every transition = tear/whoosh;
   writing = pen scratch; dots/ticks = pops (pitch rising in a series); big reveal = swell + chime;
   stamps/judgements = stamp. SFX at 0.25–0.6 gain, panned to where the object is (−1 … +1).
3. **Derive cues from the code** (`tools/cues_auto.py`) so they stay in sync after re-timing, then add
   signature moments by hand (stamp on "never forgiven", chime on the crown…).
4. **Synth SFX** (`tools/sfx.mjs`) are deterministic and royalty-free. If you use library sounds, they
   must be licensed and credited.
5. **Mix chain:** SFX ×0.5 → sidechaincompress (VO key, threshold 0.05, ratio 3) → amix with VO
   (normalize=0) → loudnorm I=−14 LUFS, TP −1.5, LRA 11. Do **one global mix** for the final (per-part
   mixes are previews only; loudnorm per part causes level jumps).
6. **Verify:** `ffmpeg -i final.mp4 -af ebur128 -f null -` → Integrated −14 ±1. Listen to: the first 10 s,
   one dense section, the finale.
7. Keep the VO file untouched (no re-encode before the final mix; decode to 48 kHz stereo WAV once).
