# LazyTools.io — Public Roadmap

**Status (updated 9 Jul 2026):** LazyTools soft-launched on [lazytools.io](https://lazytools.io) on
4 July 2026, and **all 18 tool categories are now live** — well ahead of the original three-week
plan. We build in the open with weekly Friday releases; the official **v1.0.0 public launch** is
targeted for **~25 July 2026** once the remaining launch-week items (search-console verification and
the legal review) are cleared.

## Shipped ✅

**Foundations** — Astro SSG + Preact islands, privacy-first client-side architecture, anonymous
ratings (PHP + SQLite), smart header search, sitemap, auto-generated `llms.txt`, GitHub Actions →
Namecheap FTPS deploy pipeline.

**All 18 categories live** (~376 pages, 302+ tools):

| Category | Highlights |
|---|---|
| Unit Converters | 100+ pairs across 11 quantities, exact NIST/BIPM factors |
| Calculators | percentage, EMI, BMI, age, tip, discount, interest… |
| Mathematics | **exact arithmetic** — fraction calculator with steps, decimal⇄fraction (repeating decimals), GCD/LCM via Euclid, prime factorizer (Miller–Rabin + Pollard rho), ratio, quadratic solver with radical roots, statistics, Roman numerals, scientific notation, nCr/nPr (BigInt), long division with steps, radical simplifier, modular arithmetic (ext. Euclid + square-and-multiply), slope/line & distance/midpoint (exact), binomial expansion |
| Size Converters | ring, shoe, bra, clothing, hat, kids' shoe |
| Text Tools | counters, case, sort, dedupe, find-and-replace, slugify |
| Color Tools | HEX/RGB/HSL/CMYK, WCAG contrast, shades, gradient, mixer, **brand color finder** (1,100+ brand palettes, name + reverse-hex search) |
| File & Data | CSV/JSON/XML/YAML, Markdown, JSON formatter, **e-invoicing cluster**: EN 16931 viewer + Factur-X (France) + **KSeF FA(3) viewer & pre-checker** (Poland) + Peppol BIS (Belgium) |
| Developer Tools | Base64, URL/HTML entities, SHA hashes, JWT, regex, number base, **LLM token counter & cost calculator** (exact o200k counts in-browser, dated pricing) |
| Generators | password, UUID, QR, random number, lorem ipsum |
| Date & Time | timestamp, age, date-diff/add, ISO week, timezone converter, **19 timezone-pair pages** |
| Calendars | **multi-calendar converter** (Hijri/Hebrew/Persian/Indian/Julian…), Hijri, Persian, Hebrew & Julian converters, **Nepali BS⇄AD**, 4-5-4/4-4-5/5-4-4 retail calendar, leap-year checker |
| Codes & Ciphers | Morse (with audio), NATO phonetic alphabet, binary translator, Caesar, ROT13, Vigenère |
| Privacy & Security | EXIF remover, AES-256 file encryption, password strength, file hash |
| Image Tools | compressor, converter, resizer, Base64, **HEIC→JPG** (libheif wasm) |
| PDF Tools | merge, split, rotate, images→PDF — with **live page previews** (click-to-select pages, live rotation) — **unlock/protect** (qpdf wasm), **accessibility checker** (EAA), **redaction checker + rasterizing redactor** (draw boxes, flatten pages — destroy, don't cover) |
| Audio | trimmer, speed, volume, WAV converter (Web Audio) |
| Productivity | **Pomodoro timer**, countdown/stopwatch, meeting-cost meter, Eisenhower matrix, habit tracker, Kanban, mind map, Gantt, decision matrix, RICE, SWOT, pros/cons, flowchart, whiteboard, time-blocking, OKR, checklist, retro board, eye-rest — all saved locally, JSON export |
| Network & IT | **IPv4 & IPv6 subnet calculators** (exact 128-bit math), CIDR⇄range, IP format converter, IPv6 expand/compress (RFC 5952), chmod calculator, cron parser with next-run times, MAC formatter (EUI-64, link-local) |

**Content & growth engine** — 35 SEO/GEO blog guides (hero + custom SVG infographic, schema,
cited sources); a daily **market-research agent** that scans for browser-tool opportunities and
files scored findings to `docs/research/` — the Network & IT category and its IPv6 guide shipped
directly from its 7 Jul scan (IPv6 crossed 50% of Google traffic in Mar 2026).

## In progress — v1.0.0 launch week

- [x] Google Search Console + Bing Webmaster: verified + sitemap submitted ([#11](https://github.com/Synth88Labs/lazytools.io/issues/11)) — *done 9 Jul 2026*
- [x] Legal review pass: governing-law position set (no customer data held), analytics cookies disclosed honestly, [DRAFT] markers removed ([#12](https://github.com/Synth88Labs/lazytools.io/issues/12)) — *done 9 Jul 2026*
- [ ] `www.lazytools.io` SSL SAN coverage — handled by Namecheap AutoSSL
- [ ] **Release `v1.0.0` — official public launch** 🚀

## Post-launch (Aug 2026 →)

- **Quality-gated growth, not page counts.** Every new page must pass a simple gate before it
  ships: it answers a distinct user query no existing page answers, it contains real
  differentiated content (a working tool, exact data, worked examples, editorial notes — not a
  template with swapped variables), and it's human-reviewed. New pages land in small,
  demand-verified tranches tracked in Search Console (impressions/position at day 14/30/60)
  before the pattern is extended. Pages that don't earn engagement get improved or removed —
  never left thin.
- **Depth over breadth:** enrich the live pages first — per-pair editorial notes, use-case FAQs
  and worked examples on converter pages — before adding new ones.
- **Research-driven backlog:** build the highest-scoring opportunities the daily market-research
  agent surfaces (see [docs/research/INDEX.md](docs/research/INDEX.md)); already shipped from it —
  HEIC converter, PDF unlock/protect, e-invoice viewer.
- **Heavier tooling:** evaluate client-side video via ffmpeg.wasm (COOP/COEP routes) for the
  Audio & Video category.
- **Cadence:** weekly Friday releases.

---
*A [Synth88 Labs Inc.](https://synth88.com) project · MIT licensed · [lazytools.io](https://lazytools.io)*
