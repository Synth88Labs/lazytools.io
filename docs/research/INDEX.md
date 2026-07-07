# Research Index

One line per item ever surfaced. Format: `- [status] name — date first seen, latest score`. Update statuses in place; do not duplicate rows. Mark BUILT when a tool ships.

- [BUILT] HEIC to JPG/PNG converter — 2026-07-06, 21/25 — shipped /image/heic-to-jpg/ (heic-to/libheif wasm) + blog heic-to-jpg-guide
- [BUILT] E-invoice viewer: XRechnung / ZUGFeRD / Factur-X — 2026-07-06, 20/25 — shipped /file/e-invoice-viewer/ (UBL+CII parser, PDF-embedded XML extraction) + blog e-invoice-guide
- [BUILT] PDF unlock & protect (qpdf-wasm) — 2026-07-06, 20/25 — shipped /pdf/unlock-pdf/ + /pdf/protect-pdf/ (qpdf wasm) + blog pdf-password-guide
- [BUILT] Factur-X / French e-invoice viewer depth (variant of BUILT e-invoice viewer) — 2026-07-07, 22/25 — shipped /file/facturx-viewer/ + profile detection in viewer + blog facturx-france-2026-guide (before 1 Sept 2026 mandate)
- [BUILT] Networking & IT calculator cluster (subnet/CIDR v4+v6, IP converters, chmod, cron, MAC formatter) — 2026-07-07, 20/25 — shipped /network/ (8 tools, v0.5.0) + blog ipv6-subnetting-guide
- [watchlist] WebCodecs video toolkit (trim/compress/convert) — 2026-07-06, 20/25 (competition-gap axis 2 blocks promotion; revisit for underserved long-tail intents)
- [watchlist] JPEG XL / AVIF converter (modern-format image expansion) — 2026-07-06, 17/25 (Chrome 145 still flag-gated as of 2026-07-07; promote when default-on ships, expected H2 2026; consider pre-building 4–6 weeks ahead)
- [watchlist] Subtitle converter SRT↔VTT + timing shift — 2026-07-06, 16/25 (need observed user-pain threads, not listicles)
- [watchlist] SQLite database viewer (sqlite-wasm) — 2026-07-06, 15/25 (no demand evidence gathered yet)
- [watchlist] Text diff / compare tool — 2026-07-07, 16/25 (client-side privacy diff tools already commoditized; promote via file-level diff variant: CSV/PDF-text diff)
- [watchlist] Amortization schedule (EMI calculator depth + CSV export + prepayment what-if) — 2026-07-07, 15/25 (build as cheap enhancement to BUILT emi-calculator, not a page bet)
- [watchlist] Math tools category (fraction, GCD/LCM, prime factorizer, ratio, stats, quadratic) — 2026-07-07, 15/25 (gap axis 1: CalculatorSoup/Omni/Symbolab saturation, no driver; promote only with keyword-gap proof of winnable long-tail)
- [watchlist] Fitness/pace calculators (running pace, target heart rate) — 2026-07-07, 15/25 (McMillan/Strava/Omni own the space; no driver)
- [BUILT] LLM token counter (exact OpenAI via gpt-tokenizer; labeled estimates for Claude/Gemini) — 2026-07-07, 19/25 — shipped /dev/llm-token-counter/ per AMBER conditions (exact-vs-estimate badges, context-fit bar, /dev/ utility not SEO bet) + blog llm-tokens-cost-guide
- [BUILT] LLM API cost calculator — 2026-07-07, 15/25 — shipped ONLY as embedded panel on the token counter per RED-standalone verdict; dated pricing in src/data/dev/llm-pricing.ts (PRICES_VERIFIED=2026-07-07); MAINTENANCE RITUAL: re-verify monthly + per launch; Sonnet 5 reprice due 2026-09-01
- [rejected] Website accessibility scanner (EAA-driven) — 2026-07-06 (fails browser-feasibility: cross-origin URL fetching)
- [rejected] AI-adjacent image tools (upscaling, background removal) — 2026-07-06 (AI-exclusion filter / model weights impractical on static hosting)
- [rejected] Typing test — 2026-07-07, 13/25 (Monkeytype-class dominance, no driver)
- [rejected] Cron expression parser as standalone SEO bet — 2026-07-07 (crontab.guru entrenched; folded into networking cluster as supporting tool)
- [rejected] MAC vendor lookup — 2026-07-07 (multi-MB OUI database on static hosting for marginal value; formatter/validator only)
- [rejected] Context-window fit checker / tokens-to-words as standalone pages — 2026-07-07 (thin variants of token counter; June-2026 spam-update risk; fold into counter page as features)
- [rejected] Self-hosting vs API LLM break-even calculator — 2026-07-07 (GPU-cost/throughput assumptions go stale; invented-facts liability)
