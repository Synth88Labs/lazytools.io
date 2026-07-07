# LazyTools.io — Public Roadmap

**Status (updated 6 Jul 2026):** LazyTools soft-launched on [lazytools.io](https://lazytools.io) on
4 July 2026, and **all 14 tool categories are now live** — well ahead of the original three-week
plan. We build in the open with weekly Friday releases; the official **v1.0.0 public launch** is
targeted for **~25 July 2026** once the remaining launch-week items (search-console verification and
the legal review) are cleared.

## Shipped ✅

**Foundations** — Astro SSG + Preact islands, privacy-first client-side architecture, anonymous
ratings (PHP + SQLite), smart header search, sitemap, auto-generated `llms.txt`, GitHub Actions →
Namecheap FTPS deploy pipeline.

**All 14 categories live** (~295 pages, 235+ tools):

| Category | Highlights |
|---|---|
| Unit Converters | 100+ pairs across 11 quantities, exact NIST/BIPM factors |
| Calculators | percentage, EMI, BMI, age, tip, discount, interest… |
| Size Converters | ring, shoe, bra, clothing, hat, kids' shoe |
| Text Tools | counters, case, sort, dedupe, find-and-replace, slugify |
| Color Tools | HEX/RGB/HSL/CMYK, WCAG contrast, shades, gradient, mixer |
| File & Data | CSV/JSON/XML/YAML, Markdown, JSON formatter, **e-invoice viewer** |
| Developer Tools | Base64, URL/HTML entities, SHA hashes, JWT, regex, number base |
| Generators | password, UUID, QR, random number, lorem ipsum |
| Date & Time | timestamp, age, date-diff/add, ISO week, timezone converter, **19 timezone-pair pages** |
| Calendars | **multi-calendar converter** (Hijri/Hebrew/Persian/Indian/Julian…), Hijri, Persian, Hebrew & Julian converters, 4-5-4 retail calendar, leap-year checker |
| Privacy & Security | EXIF remover, AES-256 file encryption, password strength, file hash |
| Image Tools | compressor, converter, resizer, Base64, **HEIC→JPG** (libheif wasm) |
| PDF Tools | merge, split, rotate, images→PDF, **unlock/protect** (qpdf wasm) |
| Audio | trimmer, speed, volume, WAV converter (Web Audio) |

**Content & growth engine** — 26 SEO/GEO blog guides (hero + custom SVG infographic, schema,
cited sources); a daily **market-research agent** that scans for browser-tool opportunities and
files scored findings to `docs/research/`.

## In progress — v1.0.0 launch week

- [ ] Google Search Console + Bing Webmaster: verify + submit sitemap ([#11](https://github.com/Synth88Labs/lazytools.io/issues/11)) — *owner action*
- [ ] Final legal review pass: governing law, analytics naming, clear [DRAFT] markers ([#12](https://github.com/Synth88Labs/lazytools.io/issues/12)) — *owner action*
- [ ] `www.lazytools.io` SSL SAN coverage — handled by Namecheap AutoSSL
- [ ] **Release `v1.0.0` — official public launch** 🚀

## Post-launch (Aug 2026 →)

- **Depth over breadth:** expand each live category with long-tail tool/variant pages, tracked in
  Search Console (impressions/position at day 14/30/60) before scaling.
- **Research-driven backlog:** build the highest-scoring opportunities the daily market-research
  agent surfaces (see [docs/research/INDEX.md](docs/research/INDEX.md)); already shipped from it —
  HEIC converter, PDF unlock/protect, e-invoice viewer.
- **Heavier tooling:** evaluate client-side video via ffmpeg.wasm (COOP/COEP routes) for the
  Audio & Video category.
- **Cadence:** weekly Friday releases; ~5,000 tool pages targeted within 12 months.

---
*A [Synth88 Labs Inc.](https://synth88.com) project · MIT licensed · [lazytools.io](https://lazytools.io)*
