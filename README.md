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
  <a href="ROADMAP.md"><img alt="Status: launching soon" src="https://img.shields.io/badge/status-launching%20~July%2025%2C%202026-yellow.svg"></a>
</p>

---

A project by **[Synth88 Labs Inc.](https://synth88.com)**

## Why this exists

Every day, millions of people upload private files — contracts, photos, IDs — to "free online tools"
websites, trusting a stranger's server in exchange for a simple conversion. That trade never made sense
to us. Modern browsers can do this work locally.

LazyTools is built on one non-negotiable principle: **privacy by architecture, not by policy.** There
are no processing servers. The tool code downloads to *your* device and runs there. You can verify it
yourself: open DevTools, watch the network tab, or switch off your connection mid-use — everything keeps
working.

## What's live

**Unit & Measurement Converters** — 123 conversion pages across 11 categories (length, weight,
temperature, volume/cooking, area, speed, time, data storage, pressure, energy, power):

- Exact, internationally defined factors (1 inch = 25.4 mm exactly; 1 lb = 0.45359237 kg exactly)
- Two-way instant conversion with a result explainer that shows the actual math
- Context-aware site search that understands queries like *"70 kg to lbs"* or *"how many pounds in a kilo"*
- Formula, worked example, conversion table, unit definitions and FAQ on every page

**Coming next** (see the [roadmap](ROADMAP.md)): calculators, developer tools, file converters, text
utilities, generators, date/time tools, color tools, and privacy/security tools — all client-side.

## Quick start

```bash
npm install
npm run dev      # dev server at localhost:4321
npm run build    # static site → dist/ (158 pages, ~8s)
```

Stack: [Astro](https://astro.build) (static output) · [Preact](https://preactjs.com) islands ·
[Tailwind CSS 4](https://tailwindcss.com) · TypeScript. No backend required — the build output is plain
static files deployable to any host.

## Use these tools in your own site

The code is MIT-licensed — reuse is the point:

- **Conversion engine**: [`src/data/units/`](src/data/units/) is a self-contained, dependency-free
  TypeScript library (unit definitions + exact factors + linear-transform conversion). Copy the folder
  and call `convert(value, fromUnit, toUnit)`.
- **Converter UI**: [`src/components/UnitConverter.tsx`](src/components/UnitConverter.tsx) is a single
  Preact component (~6KB) you can drop into any Preact/React project.
- **Smart search**: [`src/components/SearchBox.tsx`](src/components/SearchBox.tsx) +
  [`src/lib/search-data.ts`](src/lib/search-data.ts) implement the natural-language unit search.

Attribution is appreciated (a link to [lazytools.io](https://lazytools.io)) but not required by the license.

## Contributing

Tool requests and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: see
[SECURITY.md](SECURITY.md).

## License & contact

[MIT](LICENSE) © 2026 [Synth88 Labs Inc.](https://synth88.com) · Contact: synth88labs@gmail.com
