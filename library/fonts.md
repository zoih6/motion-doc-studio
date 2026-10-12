# Fonts — curated open-licence (OFL) library by role

Bundled in `engine/kit/fonts/` (all SIL Open Font License 1.1 — free for video, embedding allowed):
| file | family name to use | axes / weights | role |
|---|---|---|---|
| Amiri-Bold / -Regular | `Amiri` | 400, 700 | heritage display, naskh quotes |
| NotoKufiArabic[wght] | `Kufi` | 100–900 variable | **caption / UI** (default), weight morphs |
| ReadexPro[HEXP,wght] | `Readex` | 160–700 variable | modern caption / UI (Arabic + Latin) |
| Changa[wght] | `Changa` | 200–800 variable | condensed caption, sports/tech |
| ElMessiri[wght] | `ElMessiri` | 400–700 variable | elegant display, culture |
| Lalezar-Regular | `Lalezar` | 400 (very heavy) | posters, logos, punchy titles |
| ArefRuqaa-Bold | `Ruqaa` | 700 | **hand-lettered emphasis word** (ruq'ah) |
| Marhey[wght] | `Marhey` | 300–700 variable | playful hand-drawn emphasis |
| Rakkas-Regular | `Rakkas` | 400 | retro display, signage |
| IBMPlexMono-Medium | `Mono` | 500 | meta tags, glosses, code comments, data labels |

Declare with local `@font-face` in the film page (sandboxed previews have no network), list them in
`FILM.fonts` so `init()` waits for them, e.g.
```css
@font-face{font-family:Kufi;src:url("kit/fonts/NotoKufiArabic[wght].ttf");font-weight:100 900}
@font-face{font-family:Ruqaa;src:url(kit/fonts/ArefRuqaa-Bold.ttf);font-weight:700}
```

## Pairings that work (display / caption / emphasis / meta)
| style | display | caption | emphasis | meta |
|---|---|---|---|---|
| Sepia Manuscript | Amiri 700 | Kufi 600 | Amiri (gold) | — |
| Sticker-Pop | Lalezar | Kufi 800 | Ruqaa (accent) | Mono |
| Clean VOX | Kufi 900 | Readex 600 | marker sweep | Mono |
| Elegant culture | El Messiri 700 | Readex 400 | Amiri italic-like naskh | — |
| Retro / signage | Rakkas | Changa 600 | Marhey | Mono |

## More OFL Arabic families (download on demand)
Fetch from Google Fonts' GitHub: `curl -sfLO https://raw.githubusercontent.com/google/fonts/main/ofl/<dir>/<File>.ttf`
(variable files have `%5B…%5D` in the URL for `[…]`).
| family | dir | character |
|---|---|---|
| Cairo (variable) | cairo | neutral modern sans |
| Tajawal | tajawal | light geometric sans |
| Almarai | almarai | clean UI sans |
| IBM Plex Sans Arabic | ibmplexsansarabic | corporate, technical |
| Alexandria (variable) | alexandria | geometric, heavy weights |
| Noto Naskh Arabic (variable) | notonaskharabic | book text |
| Noto Nastaliq Urdu | notonastaliqurdu | Persian/Urdu calligraphic |
| Reem Kufi (variable) | reemkufi | Fatimid kufi display |
| Reem Kufi Ink / Fun | reemkufiink, reemkufifun | colour/playful kufi |
| Kufam (variable) | kufam | modern kufi |
| Blaka / Blaka Ink | blaka | blackletter-arabic fusion display |
| Lemonada (variable) | lemonada | round, friendly |
| Baloo Bhaijaan 2 (variable) | baloobhaijaan2 | chunky, kids |
| Gulzar | gulzar | nastaliq display |
| Mirza | mirza | classic naskh display |
| Katibeh | katibeh | calligraphic display |
| Harmattan | harmattan | Sahel-style naskh |
| Vibes | vibes | ruq'ah-ish hand |
| Qahiri | qahiri | square kufi display |
Latin companions: Inter / Inter Tight, Space Grotesk, Fraunces, Cormorant Garamond, JetBrains Mono.

## Rules
- Max 3 faces + 1 meta per film. One display, one caption; emphasis face only for single words.
- Check every face renders your exact text (some lack tashkeel, Persian letters or Arabic-Indic digits).
- Variable fonts: animate `weight` via `weightText()` (cached per 20 units) — never re-layout per frame.
- Credit fonts in `docs/CREDITS.md`; OFL forbids selling the font file alone, not using it in videos.
