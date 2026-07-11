<p align="center">
  <img src="public/logo.svg" alt="LazyTools logo" width="96" height="96">
</p>

<h1 align="center">LazyTools.io</h1>

<p align="center">
  <strong>Free online tools that never upload your data.</strong><br>
  Every tool runs 100% in the browser — no processing servers, no sign-up, works offline.
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="Built with Astro" src="https://img.shields.io/badge/built%20with-Astro-ff5d01.svg">
  <img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg">
  <a href="https://lazytools.io"><img alt="Status: live" src="https://img.shields.io/badge/status-live%20at%20lazytools.io-brightgreen.svg"></a>
</p>

---

A project by **[Synth88 Labs Inc.](https://synth88.com)** · **Live at [lazytools.io](https://lazytools.io)** since July 4, 2026.

## Why this exists

Every day, millions of people upload private files — contracts, photos, IDs — to "free online tools"
websites, trusting a stranger's server in exchange for a simple conversion. That trade never made sense
to us. Modern browsers can do this work locally.

LazyTools is built on one non-negotiable principle: **privacy by architecture, not by policy.** There
are no processing servers. The tool code downloads to *your* device and runs there. You can verify it
yourself: open DevTools, watch the network tab, or switch off your connection mid-use — everything keeps
working.

## What's live — 20 categories, 410+ tools, ~505 pages

| Category | Highlights |
|---|---|
| [Unit Converters](https://lazytools.io/units/) | 123 pages, exact NIST/BIPM factors, per-pair editorial notes |
| [Calculators](https://lazytools.io/calc/) | percentage, EMI, BMI, age, tip, discount, interest… |
| [Mathematics](https://lazytools.io/math/) | **exact arithmetic** — fractions with steps, primes (Miller–Rabin), quadratics with radical roots, statistics, Roman numerals, nCr/nPr at BigInt scale |
| [Biology & Lab](https://lazytools.io/biology/) | **14 tools** — DNA reverse-complement/translate (sequence never uploaded), C₁V₁=C₂V₂ dilution + serial planner, Punnett (mono/di/trihybrid), Hardy–Weinberg + χ², GC/Tm, DNA & protein molecular weight, molarity, hemocytometer, Michaelis–Menten, qPCR efficiency, doubling time |
| [Size Converters](https://lazytools.io/size/) | ring, shoe, bra, clothing, hat sizes across systems |
| [Text Tools](https://lazytools.io/text/) | **19 tools** — "the invisible & exact layer of text": **invisible-character detector** (AI-watermark / zero-width), **homoglyph/lookalike detector**, **text diff** (LCS), **readability** (Flesch/FK/Fog/SMOG/CLI/ARI), **Unicode inspector**, word frequency, text cleaner (em-dash/smart-quote), Unicode normalizer, plus counters, case, sort, dedupe, find & replace |
| [Color Tools](https://lazytools.io/color/) | HEX/RGB/HSL/CMYK, WCAG contrast, **brand color finder (1,100+ palettes)** |
| [File & Data](https://lazytools.io/file/) | CSV/JSON/XML/YAML, Markdown, **e-invoicing viewers: Factur-X (FR), KSeF FA(3) (PL), Peppol BIS (BE), XRechnung/ZUGFeRD (DE)** |
| [Developer Tools](https://lazytools.io/dev/) | Base64, hashes, JWT, regex, **LLM token counter (exact o200k)**, **Ethereum unit converter** (BigInt-exact wei⇄ether), **Keccak-256/SHA-3 + function selector**, **EIP-55 address checksum** |
| [Network & IT](https://lazytools.io/network/) | IPv4/IPv6 subnet calculators (exact 128-bit), CIDR, chmod, cron parser, MAC/EUI-64 |
| [Generators](https://lazytools.io/generate/) | **12 tools** — password, **passphrase (EFF diceware)**, **UUID v4/v7 · ULID · NanoID + decoder**, QR, **WiFi/vCard/email QR**, **barcode (EAN/UPC/Code128, check-digit)**, random number, lorem ipsum |
| [Date & Time](https://lazytools.io/time/) | timestamps, date math, DST-aware timezone pairs |
| [Calendars](https://lazytools.io/calendar/) | Hijri/Hebrew/Persian/Julian, **Nepali BS⇄AD**, 4-5-4 retail |
| [Codes & Ciphers](https://lazytools.io/cipher/) | Morse (with audio), NATO, binary, Caesar, Vigenère |
| [Productivity](https://lazytools.io/productivity/) | Pomodoro, Kanban, mind map, Gantt, habit tracker — saved locally, JSON export |
| [Privacy & Security](https://lazytools.io/security/) | EXIF remover, AES-256 file encryption, file hash |
| [Image Tools](https://lazytools.io/image/) | compress, convert, resize, **HEIC→JPG** (libheif wasm) |
| [Photo Size Maker](https://lazytools.io/photo/) | **passport / visa / ID photos** for multiple countries — crop to exact official size, **on-device face-position check (MediaPipe BlazeFace)**, background & exposure checks, DPI-correct export; every spec cited + date-verified |
| [PDF Tools](https://lazytools.io/pdf/) | merge/split/rotate **with live page previews**, unlock/protect (qpdf wasm), **accessibility checker (EAA)**, **redaction checker + rasterizing redactor** |
| [Audio](https://lazytools.io/video/) | trim, speed, volume, WAV convert (Web Audio) |

Plus **58 in-depth guides** on the [blog](https://lazytools.io/blog/) — each with custom infographics,
FAQ schema and cited sources — and a research-driven build pipeline (see
[docs/research/](docs/research/)) that has shipped regulatory-deadline tools ahead of the French,
Polish and Belgian e-invoicing mandates.

## Quick start

```bash
npm install
npm run dev      # dev server at localhost:4321
npm run build    # static site → dist/ (~505 pages)
```

## Tech & models

**Framework.** [Astro](https://astro.build) with 100% static output (`output: 'static'`), interactive
[Preact](https://preactjs.com) islands hydrated per-tool, [Tailwind CSS 4](https://tailwindcss.com) and
TypeScript throughout. Pages are generated from typed registries under [`src/data/`](src/data/), so a
new tool is a data entry plus (where needed) one island. The build is plain static files — deployable
to any host, no SSR, no serverless, no backend.

**The privacy model.** There are no processing servers. Every computation — parsing, encoding,
cryptography, image and PDF manipulation, **and machine-learning inference** — happens on the user's
device. Anything heavy is loaded lazily on first use and **self-hosted** under
[`public/vendor/`](public/vendor/) so nothing is fetched from a third-party CDN. The only network calls
after page load are an anonymous page-hit counter and an optional star rating (a tiny PHP endpoint that
stores no personal data).

**On-device models & engines** — what does the heavy lifting, and where:

| Engine / model | Used for | How it runs |
|---|---|---|
| **[MediaPipe](https://ai.google.dev/edge/mediapipe) BlazeFace (short-range)** | Photo Size Maker — detects the face and derives head-height %, eye line, centering and tilt for the passport/visa compliance check | Google's face-detection model (`blaze_face_short_range.tflite`, ~230 KB) + the Tasks-Vision WASM runtime, **self-hosted** at `/vendor/mediapipe/`, lazy-loaded on first "Check photo". Falls back to the native [Shape Detection API](https://developer.mozilla.org/docs/Web/API/FaceDetector), then to manual guides |
| **Canvas 2D API** | Photo crop/resize/matte + export (with JFIF **DPI patched** into the file), image compress/convert/resize, PDF page rasterizing | Native browser image codecs — decode, resample, re-encode JPEG/PNG/WebP |
| **[libheif](https://github.com/strukturag/libheif) (WASM)** | HEIC/HEIF → JPG/PNG decoding | ~1.2 MB WASM decoder, loaded only when converting |
| **[qpdf](https://qpdf.sourceforge.io/) (WASM)** | PDF unlock / password-protect | WASM build at `/vendor/qpdf.wasm` |
| **[pdf.js](https://mozilla.github.io/pdf.js/)** | PDF page previews, accessibility (tag-tree) checker, redaction text-layer extraction | Mozilla's PDF engine + its worker |
| **[gpt-tokenizer](https://github.com/niieani/gpt-tokenizer)** | LLM token counter — exact `o200k_base`/`cl100k_base` counts | Pure-JS BPE tokenizer, runs in-browser |
| **[qrcode](https://github.com/soldair/node-qrcode) + [JsBarcode](https://github.com/lindell/JsBarcode)** | QR codes (URL/WiFi/vCard/email) and 1-D barcodes (EAN/UPC/Code128) with mod-10 check digits | Client-side canvas/SVG render, PNG/SVG export |
| **Text-forensics + readability libs** | Invisible-character & homoglyph detection, exact LCS text diff, Flesch/FK/Fog/SMOG/CLI/ARI readability | Pure TS (`textscan`, `textdiff`, `readability`), Node-tested |
| **Web Crypto API** | AES-256-GCM file encryption, SHA-2 file hashing, PBKDF2 key derivation, secure password generation | Native browser cryptography |
| **Web Audio API** | Audio trim / speed / volume / WAV conversion | Native, decodes to `AudioBuffer` |
| **`Intl.DateTimeFormat` (ICU)** | World-calendar conversions (Hijri, Hebrew, Persian, Coptic, Ethiopic, Buddhist, Julian…) | The browser's bundled ICU calendar data; reverse conversion by binary search over the day number |
| **BigInt / rational arithmetic** | Exact math (primes via Miller–Rabin + Pollard rho, fractions, nCr/nPr), IPv4/IPv6 (128-bit) subnetting | Plain TypeScript, no floating-point rounding |

Self-hosting the WASM/model assets means the strict "no third-party requests" promise holds even for
the ML features — you can verify it in DevTools' network tab.

## Use these tools in your own site

The code is MIT-licensed — reuse is the point:

- **Conversion engine**: [`src/data/units/`](src/data/units/) — self-contained, dependency-free
  TypeScript (exact factors, linear transforms). Copy the folder and call `convert(value, from, to)`.
- **Exact math**: [`src/lib/mathx.ts`](src/lib/mathx.ts) — rational arithmetic, Miller–Rabin,
  Pollard rho, Euclid with steps; [`src/lib/quadratic.ts`](src/lib/quadratic.ts) — exact quadratic
  solver with simplified radicals. Node-tested.
- **Network math**: [`src/lib/net.ts`](src/lib/net.ts) — IPv4/IPv6 (BigInt) subnetting, CIDR sets,
  cron parsing, EUI-64.
- **E-invoice parsing**: [`src/lib/ksef.ts`](src/lib/ksef.ts) + the EN 16931 UBL/CII parser in
  [`src/components/file/EInvoiceTool.tsx`](src/components/file/EInvoiceTool.tsx).
- **Converter UI**: [`src/components/UnitConverter.tsx`](src/components/UnitConverter.tsx) — a single
  Preact component you can drop into any Preact/React project.
- **Passport-photo engine**: [`src/components/photo/PhotoMaker.tsx`](src/components/photo/PhotoMaker.tsx)
  (crop + guide overlay + DPI-correct export) with the compliance checks in
  [`src/lib/photo-checks.ts`](src/lib/photo-checks.ts) and the self-hosted MediaPipe face detector in
  [`src/lib/face-model.ts`](src/lib/face-model.ts); country specs (each source-cited) live in
  [`src/data/photo/`](src/data/photo/).

Attribution is appreciated (a link to [lazytools.io](https://lazytools.io)) but not required by the license.

## Contributing

Tool requests and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Blog posts are contributed
and editorially reviewed content — corrections and suggestions via the
[contact page](https://lazytools.io/contact/). Security reports: see [SECURITY.md](SECURITY.md).

## License & contact

[MIT](LICENSE) © 2026 [Synth88 Labs Inc.](https://synth88.com) · Contact: synth88labs@gmail.com
