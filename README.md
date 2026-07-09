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

## What's live — 18 categories, 296+ tools, ~370 pages

| Category | Highlights |
|---|---|
| [Unit Converters](https://lazytools.io/units/) | 123 pages, exact NIST/BIPM factors, per-pair editorial notes |
| [Calculators](https://lazytools.io/calc/) | percentage, EMI, BMI, age, tip, discount, interest… |
| [Mathematics](https://lazytools.io/math/) | **exact arithmetic** — fractions with steps, primes (Miller–Rabin), quadratics with radical roots, statistics, Roman numerals, nCr/nPr at BigInt scale |
| [Size Converters](https://lazytools.io/size/) | ring, shoe, bra, clothing, hat sizes across systems |
| [Text Tools](https://lazytools.io/text/) | counters, case, sort, dedupe, find & replace |
| [Color Tools](https://lazytools.io/color/) | HEX/RGB/HSL/CMYK, WCAG contrast, **brand color finder (1,100+ palettes)** |
| [File & Data](https://lazytools.io/file/) | CSV/JSON/XML/YAML, Markdown, **e-invoicing viewers: Factur-X (FR), KSeF FA(3) (PL), Peppol BIS (BE), XRechnung/ZUGFeRD (DE)** |
| [Developer Tools](https://lazytools.io/dev/) | Base64, hashes, JWT, regex, **LLM token counter with exact o200k counts** |
| [Network & IT](https://lazytools.io/network/) | IPv4/IPv6 subnet calculators (exact 128-bit), CIDR, chmod, cron parser, MAC/EUI-64 |
| [Generators](https://lazytools.io/generate/) | password, UUID, QR, lorem ipsum |
| [Date & Time](https://lazytools.io/time/) | timestamps, date math, DST-aware timezone pairs |
| [Calendars](https://lazytools.io/calendar/) | Hijri/Hebrew/Persian/Julian, **Nepali BS⇄AD**, 4-5-4 retail |
| [Codes & Ciphers](https://lazytools.io/cipher/) | Morse (with audio), NATO, binary, Caesar, Vigenère |
| [Productivity](https://lazytools.io/productivity/) | Pomodoro, Kanban, mind map, Gantt, habit tracker — saved locally, JSON export |
| [Privacy & Security](https://lazytools.io/security/) | EXIF remover, AES-256 file encryption, file hash |
| [Image Tools](https://lazytools.io/image/) | compress, convert, resize, **HEIC→JPG** (libheif wasm) |
| [PDF Tools](https://lazytools.io/pdf/) | merge/split/rotate **with live page previews**, unlock/protect (qpdf wasm), **accessibility checker (EAA)**, **redaction checker + rasterizing redactor** |
| [Audio](https://lazytools.io/video/) | trim, speed, volume, WAV convert (Web Audio) |

Plus **35 in-depth guides** on the [blog](https://lazytools.io/blog/) — each with custom infographics,
FAQ schema and cited sources — and a research-driven build pipeline (see
[docs/research/](docs/research/)) that has shipped regulatory-deadline tools ahead of the French,
Polish and Belgian e-invoicing mandates.

## Quick start

```bash
npm install
npm run dev      # dev server at localhost:4321
npm run build    # static site → dist/ (~370 pages)
```

Stack: [Astro](https://astro.build) (static output) · [Preact](https://preactjs.com) islands ·
[Tailwind CSS 4](https://tailwindcss.com) · TypeScript. WASM where it earns it (qpdf, libheif,
pdf.js). No backend required — the build output is plain static files deployable to any host.

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

Attribution is appreciated (a link to [lazytools.io](https://lazytools.io)) but not required by the license.

## Contributing

Tool requests and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Blog posts are contributed
and editorially reviewed content — corrections and suggestions via the
[contact page](https://lazytools.io/contact/). Security reports: see [SECURITY.md](SECURITY.md).

## License & contact

[MIT](LICENSE) © 2026 [Synth88 Labs Inc.](https://synth88.com) · Contact: synth88labs@gmail.com
