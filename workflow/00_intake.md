# 00 · Intake — understand the job in one exchange

## What you need (check what the user already gave before asking)
| Item | Default if not given |
|---|---|
| Voice-over audio (or script to record/TTS) | **Blocking** — ask. If only a script: offer TTS or wait for VO. |
| Topic + audience + platform | From the VO; YouTube 16:9 1920×1080 30 fps |
| Style references (images/videos/links) | Pick a preset from `library/style_presets.md` matching the topic |
| Language of on-screen text | Same as the VO |
| Length | = VO length |
| Real assets the user owns (logos, photos) | None |
| Delivery (GitHub repo / folder) + token | Ask for a GitHub repo name and a PAT if they want GitHub delivery |
| Must-avoid list | Use `rules/motion_rules.md` banned list |

## Ask with options (one message, ≤4 questions, in the user's language)
Example (Arabic user):
1. الأسلوب البصري؟ ◦ سينمائي بني (مخطوطات/رقوق) ◦ كولاج ورقي ◦ إنفوجرافيك نظيف على طريقة VOX ◦ أرشيف داكن
2. هل نعرض عينة أولًا؟ ◦ نعم، أول 30–60 ثانية (أنصح به) ◦ لا، الفيلم كاملًا
3. أين نرفع العمل؟ ◦ مستودع GitHub جديد (أرسل رمز PAT) ◦ ملف في مساحة العمل فقط
4. أي أصول حقيقية عندك؟ (صور، شعارات، لقطات)

## Analyse references (when the user attaches images)
Write `docs/reference_analysis.md`: palette (sample hex), surfaces (paper/glass/flat), lighting (rays,
vignette, key direction), portrait treatment, typography mood, geometry/overlays, density, what to adopt
and what *not* to copy literally. The user wants the **style**, not a copy of the frames.

## Record the brief
`docs/brief.md`: goal, audience, VO length, style choice, deliverables, constraints, approvals needed.
Also list the user's explicit rules (e.g. "no slideshow", "keep workspace clean", "sample first") —
re-read them before every delivery.
