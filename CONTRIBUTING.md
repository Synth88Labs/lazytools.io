# Contributing to LazyTools

Thanks for your interest! LazyTools is MIT-licensed and contributions are welcome — from typo fixes to
whole new tools.

## Ground rules

1. **Privacy is non-negotiable.** Every tool must process data entirely client-side. PRs that add
   server-side processing, third-party CDN calls at runtime, tracking, or fingerprinting will be
   declined regardless of features.
2. **Deterministic tools only.** We build tools with exact, verifiable outputs (converters, encoders,
   calculators) — no AI-generation features (see `docs/category-research.md` for the reasoning).
3. **Accuracy over cleverness.** Conversion factors and formulas must cite an authoritative definition
   (BIPM SI brochure, NIST Handbook 44, national standards).

## Running locally

```bash
npm install
npm run dev    # localhost:4321
npm run build  # full static build — must pass before a PR
```

## Adding a unit or conversion pair

Everything is registry-driven. To add a unit: edit the relevant file in `src/data/units/` (e.g.
`length.ts`) — add the unit with its exact factor and a 1–2 sentence sourced definition. To add a pair
page: append `[fromId, toId]` to that quantity's `popularPairs`. The page, sitemap entry, search index,
hub links and structured data all generate automatically.

## Proposing a new tool

Open an issue titled `Tool request: <name>` describing the job-to-be-done and why client-side
processing is feasible. The AI-resistance and privacy filters in `docs/category-research.md` are the
acceptance criteria.

## Commit style

Conventional commits, please: `feat(units): add nautical league`, `fix(search): knot alias collision`,
`docs: update roadmap`.

## Questions

synth88labs@gmail.com — or open a discussion.
