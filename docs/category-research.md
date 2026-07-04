# LazyTools.io — Category Research & 5,000-Tool Master Plan (DRAFT — pending approval)

*Researched July 2026. Goal: ~5,000 tool pages within 12 months, rolled out slowly, quick-win categories first, tracked via GSC. Will be committed to project memory upon approval.*

---

## 1. The AI-replacement filter (applied to every category)

A tool earns a slot only if it passes the **AI-Resistance Test** — at least 3 of 5:

| # | Criterion | Why it protects us |
|---|---|---|
| 1 | **Deterministic, byte-exact output** | LLMs approximate; converters/hashes/encoders must be exact. Users can't trust a chatbot's "converted" file. |
| 2 | **Binary/file processing** | ChatGPT can't run ffmpeg on your 500MB video in-chat; uploading to AI services is slow, capped, and a privacy leak. |
| 3 | **Zero-friction beats prompting** | Type "184 lbs to kg" → instant widget wins over opening a chat, typing a prompt, waiting for tokens. |
| 4 | **Privacy-sensitive input** | People won't paste contracts, passports, medical files, prod JWTs into an AI. Our client-side story is strongest exactly here. |
| 5 | **Repeat/workflow use** | Daily-use utilities (devs, accountants, editors) get bookmarked; chat re-prompting doesn't. |

**Categories explicitly EXCLUDED (AI is eating them now):**
- ✗ AI writing/paraphrasing/summarizing/grammar (TinyWow's "Write" category — being absorbed by ChatGPT/Claude directly)
- ✗ Translation
- ✗ Content/idea/name generators (creative output = LLM home turf)
- ✗ Code generation/explanation tools
- ✗ SEO *checkers* that fetch external URLs (CORS blocks client-side fetching; needs server → off-architecture)
- ✗ Currency conversion (needs live-rates API → breaks offline/privacy story; Wise/Google own it)
- ✗ AI image generation (API costs, not private, saturated)

---

## 2. Approved category set (12 categories, 3 phases)

Scoring: Quick-Win (build effort × competition × time-to-rank), AI-Resistance (test above), Scale (realistic page count incl. programmatic variants).

### Phase 1 — Quick wins (months 1–3): pure JS/TS, no heavy WASM, ships in days, longest long-tail

| # | Category | URL | Quick-Win | AI-Resist | Scale | Rationale |
|---|---|---|---|---|---|---|
| 1 | **Unit & Measurement Converters** | `/units/` | ★★★★★ | ★★★★☆ | **2,000–2,500** | The proven programmatic-SEO play (solo devs rank 2,600-page unit sites; convertunits.com serves 2,100 units/70 categories). Pure data + one component = thousands of unique-intent pages (`/units/kg-to-lbs/`). Evergreen forever; instant widget beats AI prompt on speed & trust. Biggest single contributor to 5,000. |
| 2 | **Calculators** | `/calc/` | ★★★★★ | ★★★★☆ | **800–1,200** | Omni Calculator built a whole company on 3,000+ calculators. Finance (EMI, loan, mortgage, GST, tip), health (BMI, BMR, calorie), math (percentage, ratio), everyday (age, fuel). People do NOT trust LLM arithmetic for money/health — deterministic widget + formula shown = trust + citability. Massive long-tail (`/calc/percentage-increase/`). |
| 3 | **Developer Tools** | `/dev/` | ★★★★★ | ★★★★★ | **200–300** | it-tools' GitHub popularity proves demand. JSON/XML/SQL formatters, Base64, URL encode, JWT decoder, hash generators, regex tester, UUID, cron parser, diff. Killer privacy fit: devs will not paste prod tokens/payloads into ChatGPT — client-side is a *requirement* for them, not a preference. Devs also write blogs/link — backlink engine. |
| 4 | **File & Data Converters** | `/file/` | ★★★★★ | ★★★★★ | **250–400** | CSV↔JSON↔XML↔YAML↔Excel↔Markdown↔HTML-table matrix. Byte-exact requirement = AI-proof; business data = privacy-sensitive. Each format pair is its own ranked page. |
| 5 | **Text Utilities (mechanical only)** | `/text/` | ★★★★★ | ★★★☆☆ | **120–180** | ONLY deterministic ops: word/char counter (huge volume), case converters (each case = a page), sort/dedupe lines, find & replace, diff, reverse, whitespace cleaner, text-to-slug. Zero-friction repeat use. Explicitly NO generative text features. |
| 6 | **Generators (deterministic)** | `/generate/` | ★★★★★ | ★★★★☆ | **150–250** | QR codes (enormous stable volume; AI can't emit a scannable QR reliably), barcodes (each symbology = a page), passwords/passphrases, UUIDs v1–v7, favicons, placeholder images, checksums, WiFi-QR, vCard-QR. Deterministic = AI-resistant. |
| 7 | **Date & Time Tools** | `/time/` | ★★★★★ | ★★★★☆ | **300–500** | Epoch converter, days-between-dates, add/subtract days, week numbers, age calculator, countdowns, cron next-runs, timezone converter (city-pair pages = programmatic matrix: `/time/ist-to-est/`). High-volume question queries AI Overviews cite. |
| 8 | **Color & Design Tools** | `/color/` | ★★★★☆ | ★★★★☆ | **150–250** | HEX↔RGB↔HSL↔CMYK pair pages, WCAG contrast checker (accessibility regulation = growing demand), CSS gradient generator, palette extractor from image (client-side!), shades/tints, color blindness simulator. Designer/dev audience overlaps with /dev/. |
| 9 | **Security & Privacy Tools** | `/security/` | ★★★★☆ | ★★★★★ | **60–100** | THE flagship brand category, low competition. EXIF/metadata stripper (photos leak GPS!), document metadata cleaner, client-side file encryptor (crypto.subtle), password strength auditor, hash verifier, secure random, token generator, redaction tool. By definition these inputs are what users refuse to upload anywhere — unbeatable fit, and every privacy blog post links here. |

### Phase 2 — High-value head terms (months 3–6): WASM, bigger builds, bigger prizes

| # | Category | URL | Quick-Win | AI-Resist | Scale | Rationale |
|---|---|---|---|---|---|---|
| 10 | **Image Tools** | `/image/` | ★★★☆☆ | ★★★★★ | **400–700** | Compress/convert/resize/crop/rotate + format-pair matrix (HEIC→JPG alone is a huge keyword; ~30 formats = hundreds of pair pages). Photos are personal = privacy resonates (Squoosh proved client-side works; VERT proved demand). Competitive head terms, but variants are winnable early. |
| 11 | **PDF & Document Tools** | `/pdf/` | ★★★☆☆ | ★★★★★ | **200–350** | Highest commercial value in the space (Smallpdf/iLovePDF built businesses on it). Contracts/IDs/financials = THE most privacy-sensitive files → our strongest "never uploaded" pitch. Merge, split, compress, rotate, page ops, PDF↔image, watermark, page numbers, unlock/protect, flatten. Competitive: enter via long-tail variants first. |

### Phase 3 — Heavy compute (months 6–12): ffmpeg.wasm, COOP/COEP routes

| # | Category | URL | Quick-Win | AI-Resist | Scale | Rationale |
|---|---|---|---|---|---|---|
| 12 | **Audio & Video Tools** | `/audio/`, `/video/` | ★★☆☆☆ | ★★★★★ | **300–500** | Trim, compress, convert (format matrices), mute, extract audio, GIF↔video, speed change, volume normalize, merge. 123apps/Clideo dominate but ALL upload files — personal recordings are privacy-gold. Heavy WASM = why it's last; browser-memory limits cap file sizes (be honest on-page about limits). |

### Scale math to 5,000

| Phase | Pages (cumulative) |
|---|---|
| Phase 1 (mo 1–3) | ~1,200 published slowly from a possible 4,000 |
| Phase 2 (mo 3–6) | ~2,800 |
| Phase 3 + long-tail expansion of winners (mo 6–12) | ~5,000 |

**"Slow slow" rollout rule:** publish in weekly tranches (50–150 pages), each tranche indexed & GSC-verified before the next; a category earns expansion only when its pilot pages show impressions/rankings. Never dump thousands of pages at once (thin-content/spam risk — Google's scaled-content policies punish it). Every page must pass: real search intent exists + genuinely differentiated content (per-page facts, formulas, FAQs — not just a swapped number).

---

## 3. Representative tools per category (starter lists — expand per keyword research)

**/units/** — kg↔lbs, cm↔inches, miles↔km, °C↔°F, m²↔ft², liters↔gallons, mm↔inches, feet↔meters, mph↔kmh, oz↔grams, acres↔hectares, PSI↔bar, kW↔hp, cups↔ml … (× every meaningful pair across ~25 quantity types: length, mass, temp, area, volume, speed, pressure, energy, power, data size, fuel economy, cooking, angle, force, torque, frequency, illuminance…)

**/calc/** — percentage, percentage increase/decrease, EMI, loan repayment, mortgage, compound interest, simple interest, GST/VAT (per-rate pages), tip, discount, BMI, BMR, calorie needs, body fat, age, date-of-birth, GPA, average/median, ratio, fraction↔decimal, square footage, paint needed, fuel cost, salary hourly↔annual, break-even, margin vs markup, rule of three…

**/dev/** — JSON formatter/validator/minifier, JSON↔string escape, XML formatter, SQL formatter, HTML/CSS/JS beautify+minify, Base64 encode/decode (+file), URL encode/decode, JWT decoder, hash (MD5/SHA-1/SHA-256/SHA-512/CRC32), HMAC, regex tester, UUID/ULID/NanoID, cron expression parser+builder, timestamp↔date, text diff, lorem ipsum, HTTP status reference, MIME lookup, chmod calculator, htpasswd, QR for devs (env/config), user-agent parser, JSON path tester…

**/file/** — CSV→JSON, JSON→CSV, CSV→Excel, Excel→CSV, JSON→YAML, YAML→JSON, XML→JSON, JSON→XML, CSV→XML, Markdown→HTML, HTML→Markdown, CSV↔TSV, JSON→TypeScript types, CSV column extractor, CSV merger, Excel→JSON, vCard→CSV, ZIP extract/create…

**/text/** — word counter, character counter, sentence/paragraph counter, UPPERCASE/lowercase/Title/Sentence/camelCase/snake_case/kebab-case converters (each a page), remove duplicate lines, sort lines (A–Z, length, random), find & replace (+regex), remove extra spaces/line breaks, text reverser, add prefix/suffix to lines, extract emails/URLs/numbers from text, text→slug, big text splitter, letter frequency…

**/generate/** — QR (URL, text, WiFi, vCard, email, SMS, location — each a page), barcode (EAN-13, Code128, UPC-A, ISBN…), password, passphrase, PIN, UUID v4/v7, random number/letter/name-picker (deterministic draw), favicon from image/text/emoji, placeholder image, checksum file verifier, MAC address, IBAN test numbers, hash from text…

**/time/** — Unix epoch↔date, days between dates, add/subtract days-weeks-months, age calculator, week number, day-of-week finder, countdown to date, working days between dates, timezone pair converters (IST↔EST, GMT↔PST… top ~100 pairs), meeting planner, cron next runs, stopwatch/timer, time duration calculator, sunrise/sunset (client-side astronomy)…

**/color/** — HEX→RGB, RGB→HEX, HEX→HSL, RGB→CMYK (all pairs), contrast checker (WCAG AA/AAA), gradient generator, palette from image, shades/tints/tones generator, color mixer, blindness simulator, named CSS colors, Tailwind palette matcher, random color…

**/security/** — EXIF viewer+stripper, image GPS remover, PDF metadata cleaner, Office doc metadata cleaner, file encryptor/decryptor (AES-GCM), password strength checker, password generator, hash a file (verify downloads), secure text encrypt (share via password), token/secret generator, data-URL inspector, certificate decoder (PEM), random seed phrase…

**/image/** — compress (per-format pages: PNG/JPG/WebP/GIF), convert matrix (HEIC→JPG, WebP→PNG, PNG→JPG, AVIF↔WebP, SVG→PNG…), resize (by px/percent/preset: Instagram/passport/YouTube-thumbnail — each preset a page), crop, rotate/flip, image→Base64, color picker from image, watermark, meme text, ICO converter, bulk resize…

**/pdf/** — merge, split, compress, PDF→JPG/PNG (+ reverse), rotate pages, delete/extract/reorder pages, page numbers, watermark, unlock (with password), protect, images→PDF, flatten, crop, header/footer, PDF page counter, grayscale…

**/audio/,/video/** — audio cutter, audio joiner, MP3↔WAV/OGG/M4A/FLAC pairs, volume changer, speed changer, audio normalizer, tone/silence generator, voice recorder (local), video trim, video compress, MP4↔WebM/MOV pairs, mute video, extract audio (video→MP3), video→GIF, GIF→video, screen recorder (local), thumbnail extractor, video speed…

---

## 4. Tracking & kill criteria (the "track the results" system)

- Per-tranche GSC dashboard: impressions, position, CTR at day 14/30/60.
- **Expand rule:** category pilot (10–20 pages) reaches page-2+ rankings on ≥30% of pages within 60 days → fund next tranche.
- **Kill/pause rule:** <5% of pilot pages get any impressions in 60 days → stop expanding, investigate (intent mismatch? cannibalization? competition?).
- Ratings + tool-usage events (privacy-safe counters) identify which tools deserve variant expansion and content clusters.
- Quarterly AI-citation audit (Phase-3 methodology from content-engine.md) per flagship tool.
