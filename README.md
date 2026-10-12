# Motion-Doc Studio 🎬

**نظام متكامل لصناعة أفلام الموشن جرافيك الوثائقية — يعمل مع أي وكيل ذكاء اصطناعي.**
**A complete, agent-agnostic system for documentary motion-graphics films.**

<p align="center"><img src="examples/thuluth/poster.jpg" width="720"></p>

▶️ مثال كامل (فيلم «خط الثلث» 3:56): [`examples/thuluth/thuluth_final_720p.mp4`](examples/thuluth/thuluth_final_720p.mp4) ·
[1080p](https://github.com/zoih6/thuluth-motion-film/releases/tag/v3.0)

---

## بالعربية

### ما هذا؟
خبرة إنتاج فيلم كامل، من التعليق الصوتي إلى الفيديو النهائي على GitHub، محوّلة إلى نظام (skill) يقرؤه أي وكيل
ذكاء اصطناعي فيعرف فورًا القواعد والمنهجية والأدوات والكود الجاهز، دون أن تحتاج إلى توجيهه في كل خطوة.

### كيف أستخدمه في محادثة جديدة؟
1. أعطِ الوكيل هذا المستودع: الرابط، أو المجلد، أو ملف ZIP منه.
2. الصق رسالة البداية من [`templates/kickoff_prompt.md`](templates/kickoff_prompt.md) وعدّل الموضوع والأسلوب، وأرفق التعليق الصوتي.
3. سيقرأ الوكيل `AGENTS.md` ثم `SKILL.md`، ثم يتبع هذا المسار:
   - يسألك أسئلة قليلة وضرورية.
   - يحلل الصوت ويستخرج توقيت كل كلمة.
   - يكتب المعالجة البصرية (treatment) ودليل الأسلوب.
   - يجهز الأصول، الحقيقية أولًا ثم المولّدة.
   - يعرض عليك عينة.
   - بعد موافقتك يبني الفيلم كاملًا ويراجعه بصور مصغّرة لكل مشهد.
   - يرندر على أجزاء ويرفعها إلى GitHub، ثم ينظف مساحة العمل.

### ماذا يحتوي؟
| المجلد | المحتوى |
|---|---|
| `SKILL.md` | المرجع الأساسي: القواعد الإلزامية، ومراحل العمل، ومتى يُعتبر الفيلم منتهيًا |
| `rules/` | قواعد التكوين والتأطير والطباعة والألوان، وقواعد الحركة، والعربية وRTL، والصوت، وقائمة الفحص، والأخطاء المعروفة وحلولها |
| `workflow/` | خطوات العمل من 00 إلى 08: الاستلام، الصوت، المعالجة البصرية، الأسلوب، الأصول، البناء، المراجعة، الرندر والتسليم، GitHub |
| `library/` | قاموس الحركة (أكثر من 30 تقنية مع الكود)، وأساليب جاهزة، وقوالب أوامر توليد الصور، ومصادر الأصول الحقيقية، وملاحظات العملاء |
| `engine/` | محرك الرسوم (canvas) وفيلم تجريبي مدته 16 ثانية |
| `tools/` | أدوات: التفريغ الصوتي، اللقطات الثابتة، الصور المصغّرة، الرندر المجزأ، المؤثرات، المكساج النهائي، البحث في Commons، قص الخلفية، GitHub |
| `templates/` | البريف، وقائمة اللقطات، وملف المتابعة، ورسالة البداية |
| `engine/fx.js` | **الطبقة الاحترافية (v1.1):** منحنيات الحركة (Penner وbezier وspring)، كاميرا 2.5D (دولي، أوربت، فيرتيغو، تغيير البؤرة، اهتزاز)، طباعة حركية عربية كلمة بكلمة متزامنة مع الصوت، تأثيرات (حبيبات، Bloom، Halation، زيغ لوني، تسرّب ضوء، تدريج لوني) و8 «لوكات» جاهزة، و16 انتقالًا (whip، zoom، flash، iris، clock، luma، glitch، smear…) |
| `library/` (جديد) | أدلة احترافية: التوقيت والمنحنيات، لغة الكاميرا، قاموس الانتقالات، الطباعة الحركية، أنظمة الألوان (OKLCH)، الدمج والتأثيرات، الخطوط، وموارد 2026 مفتوحة المصدر |
| `library/` قواميس v1.2 | **قاموس مصطلحات** عربي–إنجليزي (≈170 مصطلحًا) · **قاموس 84 حركة** مسمّاة · **كتالوج 40 أسلوبًا** مربوطة بقيم المحرك · **قاموس المؤثرات** · **125 انتقالًا GPU** · فهرس **124 بطاقة لقطة** · دليل الأيقونات والنقوش · لوحات صور مرجعية في `library/specimens/` |
| `engine/kit/fonts/` | **41 عائلة خطوط مفتوحة (OFL)**: نسخ، رقعة، نستعليق، كوفي قاهري مربّع، كوفي فاطمي، خطوط ملوّنة، خطوط عرض حديثة، ولاتينية، مع سجلّ برمجي وجدول تراخيص |
| `engine/kit/data/` | حزم بيانات مضمّنة: **1000 لوحة ألوان** + Open Color، **1877 أيقونة Lucide** برسم تدريجي دقيق، **125 انتقال GLSL** |
| `engine/moves.js` · `assets.js` · `gl.js` | قاموس الحركات البرمجي، والألوان (20 لوحة تراثية أصلية: صنعاء، إزنيق، المماليك، الأندلس…)، والأيقونات، و13 نقشًا إجرائيًا (نجمة ثمانية، شمسة، اثنا عشرية، كريه، مشربية…)، ومشغّل الانتقالات |
| `resources/` | **مواد خبراء مضمّنة بتراخيصها الأصلية** (تعمل دون إنترنت): LottieFiles وiart (9 مهارات) وEmil Kowalski وGSAP وvideo-shotcraft (124 بطاقة لقطة) وanidoodle (22 أسلوب رسم) وorca وcollage-broll |
| `examples/reference_dna/` | تحليل «DNA» لفيديو مرجعي (إعلان عربي 20 ث): الإيقاع، الألوان، الخطوط، الحركة، الانتقالات — مع أداة `tools/video_dna.py` لتحليل أي فيديو |
| `examples/thuluth/` | الفيلم الحقيقي كاملًا: الفيديو، وكود المشاهد، ودليل الأسلوب، والتوقيتات، والدروس |

---

## English

### What is it?
Everything learned producing a full film (voice-over → GitHub release), packaged so any coding agent can make
VOX-style documentary motion graphics without hand-holding: rules, methodology, tools, a deterministic canvas
engine, and a complete real example.

### Use it in a new conversation
1. Give the agent this repo (URL, folder or zip). 2. Paste [`templates/kickoff_prompt.md`](templates/kickoff_prompt.md)
and attach the VO. 3. The agent reads `AGENTS.md` → `SKILL.md` and follows `workflow/00…08`.

Works with Claude Code (it's a valid skill folder — copy it to `~/.claude/skills/motion-doc-studio/`), Codex
(AGENTS.md), Cursor (`.cursor/rules`), Gemini CLI (`GEMINI.md`), Copilot (`.github/copilot-instructions.md`), or any
agent that can run bash + node + python + ffmpeg.

### Quick test
```bash
./tools/setup.sh                          # ffmpeg + playwright/chromium
cd engine && PAGE=index.html ../tools/cs.sh demo 4 1.5 6.9 10.6 14.5   # → engine/tmp/cs_demo.png
PAGE=index.html python3 ../tools/render_seg.py demo 0 480               # → engine/segments/demo.mp4
```
Start a film: `tools/new_film.sh /var/tmp/my-film`.

### v1.1 — pro layer
`engine/fx.js` (easings, springs, personas, 2.5D camera rig, Arabic-safe kinetic type, post FX & LOOKS, 16
transitions), eight new `library/` guides (timing, camera, transitions, kinetic type, colour/OKLCH,
compositing, fonts, 2026 resources), 8 extra OFL fonts, `tools/video_dna.py` (measure a reference video's
style DNA), `tools/fonts.sh`, preset **F · Sticker-Pop Dialect Ad**, and `examples/reference_dna/`.

### v1.2: embedded dictionaries & resource packs
Everything is **in the repo**, offline, licence-preserved: 41 OFL font families (`engine/kit/fonts`, registry + licence table),
1000 palettes + Open Color + 20 original heritage palettes, 1877 Lucide icons with exact draw-on, 125 GLSL transitions
(`tin:'gl:<Name>'`), the 84-move `MOVES` dictionary, 13 procedural patterns (Islamic geometry + textures), and new
dictionaries in `library/` (bilingual glossary, 40-style catalogue, effects, GL catalogue, 124 shot-card index, icons,
patterns) with visual sheets in `library/specimens/`. Vendored expert skills (LottieFiles, iart, Emil Kowalski, GSAP,
video-shotcraft, anidoodle, orca…) live in `resources/` with their licences ([resources/README.md](resources/README.md)).
Smoke test: `node tools/selftest.mjs`.

### How it works
Each frame is `render(t)` on a 1920×1080 canvas (pure function of time, seeded RNG). Playwright captures frames
(2 sub-frames → motion blur), FFmpeg encodes 6-second chunks in fresh browsers (crash-safe on 2 GB RAM),
parts are uploaded to GitHub Releases, and one global audio mix (VO + synthesised SFX, ducked, −14 LUFS)
produces the final 1080p/720p.

### Licence
Code: MIT. Fonts: SIL OFL 1.1 (41 families, see `engine/kit/fonts/README.md`). Vendored third-party material keeps its
own licence (MIT / Apache-2.0 / ISC / BSD). See [`resources/NOTICE.md`](resources/NOTICE.md). Example film assets: see the production repo's credits
(public-domain/CC artefacts + AI-generated plates/portraits).
