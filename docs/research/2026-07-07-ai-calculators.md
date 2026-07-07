# Research: AI/LLM Usage Calculators (token counter, API cost calculator) — 2026-07-07

Owner-submitted idea evaluated against the 25-point rubric. Focus: token counter, API cost calculator, context-fit checker, tokens-to-words, self-hosting break-even.

## Executive summary

Demand is real and growing, feasibility is trivial, and the AI-resistance filter passes 4/5 — but the niche is **saturated in 2026 with client-side, privacy-marketed competitors**, so "privacy-first" is not a differentiator here the way it is for file tools. Competition-gap axis scores 2 for the token counter and 1 for the cost calculator, which blocks OPPORTUNITY status under the rubric. Verdict: **token counter = AMBER** (justifiable as a cheap Developer Tools utility with honest accuracy labeling, not as an SEO bet); **cost calculator = AMBER as an embedded panel only, RED as a standalone page** (live-pricing maintenance liability — prices demonstrably changed twice in the past week); **context-fit checker and tokens-to-words = features on the counter page, RED as separate pages** (thin-variant risk post-June-2026 spam update); **self-hosting break-even = RED** (stale GPU-cost assumptions = invented-facts liability).

## Verdicts per tool

### 1. LLM token counter — AMBER

Score: Demand 4 · Feasibility 5 · **Gap 2** · Durability 4 · Fit 4 = **19/25, gap axis ≤2 → not OPPORTUNITY; conditional build**

- **Demand (observed):** Dozens of token-counter tools launched/maintained through 2025–2026 (tokencost.app, tokencalculator.com, gptforwork.com/tools/tokenizer, ecorpit, zalt.me, miniwebtool, tokencounter.org, runcell.dev, hcodx…). Tool proliferation itself is demand evidence; no verified search-volume numbers obtained (inference: high, sustained).
- **Gap (the blocker):** Many incumbents already market exactly our angle — "runs 100% in your browser, text never leaves your device, no signup" (ecorpit, llm-calculator.com, zalt.me all say this verbatim). OpenAI's own tokenizer page and tiktokenizer.vercel.app also exist. Privacy is commodity in this niche.
- **AI-resistance:** passes 4/5 — deterministic (exact BPE counts for OpenAI), zero-friction, privacy-sensitive input (confidential prompts/docs), repeat workflow. Chat LLMs genuinely cannot count tokens reliably.
- **Feasibility (honest accuracy picture):**
  - **OpenAI: EXACT.** `gpt-tokenizer` (niieani) or `js-tiktoken/lite` + `o200k_base`/`cl100k_base` ranks; per-encoding lazy chunk keeps bundle reasonable (~200 KB-class rank data per encoding; lazy-load, not in initial bundle).
  - **Claude: APPROXIMATION ONLY.** No public tokenizer; count-tokens API is the only ground truth. Worse: Anthropic's own pricing docs state Opus 4.7+, Sonnet 5, Fable 5, Mythos 5 use a **new tokenizer producing ~30% more tokens** than earlier models — so the common "cl100k × 1.1" heuristic is now wrong for current models. Any Claude number must be labeled "estimate".
  - **Gemini: APPROXIMATION ONLY.** No public Gemini tokenizer; Gemma SentencePiece via transformers.js is a proxy at wasm-bundle cost — probably not worth it; heuristic + label is more honest.
  - **Llama/open models: EXACT-ish** via transformers.js tokenizers if we accept the dependency (optional, later).
- **If built:** one page `/dev/llm-token-counter/`, model dropdown with an explicit **"exact" vs "estimated" badge per model**, char/word/token panel, context-window fit bar (see #3), file drop (txt/md) for counting documents locally — the file-drop + privacy framing is the only mild differentiation available.

### 2. LLM API cost calculator — RED standalone / AMBER as embedded panel

Score (standalone): Demand 4 · Feasibility 5 · **Gap 1** · **Durability 2** · Fit 3 = 15/25 → watchlist at best

- **Gap 1:** pricepertoken.com (300+ models, "updated daily"), BenchLM, yourgpt.ai, morphllm, costgoat, iternal, digiqt and more. Incumbents compete on freshness — a static site structurally cannot win that race.
- **Durability 2 — the maintenance liability, quantified:** observed price changes **2026-07-02**: OpenAI cut o3 from $10/$40 to $2/$8 and repriced GPT-5.1; Anthropic has a **scheduled** change: Claude Sonnet 5 intro $2/$10 expires **2026-08-31** → $3/$15 from Sept 1. Prices change within any given month. This is exactly the class of live-fact dependence that excluded currency conversion. Mitigation is possible but creates LazyTools' first recurring editorial obligation: a versioned `pricing.json` with a mandatory visible "Prices last verified: <date> — source: official pricing pages" badge, updated **monthly minimum plus on every major model launch**. Stale prices without the badge = wrong-facts violation of the blog/editorial standard.
- **Recommendation:** do not build a standalone cost-calculator page. If the token counter ships, add a small cost panel (tokens × a short curated table of ~10 flagship models) on the same page, with the dated badge. If the monthly update ritual ever lapses, remove the panel.

### 3. Context-window fit checker / tokens-to-words converter — RED as pages, GREEN as features

Distinct standalone pages would be thin variants of the counter (same input, same computation, restyled output) — precisely the post-June-2026 Google spam-update pattern to avoid. Fold both into the counter page: context bar showing % of 128k/200k/1M windows; words↔tokens rough table in the FAQ.

### 4. Self-hosting vs API break-even calculator — RED

Requires GPU rental/electricity/throughput assumptions that are opinionated and go stale faster than API prices; every output is an invented-fact risk. One-line reject.

## Current pricing data gathered (verified 2026-07-07, official pages fetched)

**OpenAI** — https://developers.openai.com/api/docs/pricing (per 1M tokens, standard):

| Model | Input | Cached input | Output |
|---|---|---|---|
| gpt-5.5 | $5.00 | $0.50 | $30.00 |
| gpt-5.5-pro | $30.00 | — | $180.00 |
| gpt-5.4 | $2.50 | $0.25 | $15.00 |
| gpt-5.4-mini | $0.75 | $0.075 | $4.50 |
| gpt-5.4-nano | $0.20 | $0.02 | $1.25 |

**Anthropic** — https://platform.claude.com/docs/en/about-claude/pricing (per MTok, base input / output):

| Model | Input | Output |
|---|---|---|
| Claude Fable 5 / Mythos 5 | $10 | $50 |
| Claude Opus 4.8 / 4.7 / 4.6 / 4.5 | $5 | $25 |
| Claude Sonnet 5 (intro, through 2026-08-31) | $2 | $10 |
| Claude Sonnet 5 (from 2026-09-01) / Sonnet 4.6 / 4.5 | $3 | $15 |
| Claude Haiku 4.5 | $1 | $5 |

Note: Opus 4.7+, Sonnet 5, Fable/Mythos 5 use a newer tokenizer, ~30% more tokens for the same text (per the same page).

**Google Gemini** — https://ai.google.dev/gemini-api/docs/pricing (per 1M tokens, standard, text input):

| Model | Input | Output |
|---|---|---|
| Gemini 3.5 Flash | $1.50 | $9.00 |
| Gemini 3.1 Pro Preview | $2.00 (≤200k) / $4.00 | $12.00 / $18.00 |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 |
| Gemini 2.5 Pro | $1.25 (≤200k) / $2.50 | $10.00 / $15.00 |
| Gemini 2.5 Flash | $0.30 | $2.50 |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 |

**Volatility observed:** OpenAI repriced two models on 2026-07-02 (per pricepertoken change log); Anthropic pre-announced a Sept 1 change. → monthly verification cadence is the minimum credible standard.

## Blog angle (if the counter ships)

"How LLM tokens actually work (and why Claude and Gemini counts are always estimates)" — direct answer up top: 1 token ≈ 4 chars / 0.75 English words for OpenAI models, but per-model tokenizers differ and Anthropic's newest tokenizer yields ~30% more tokens; exact-vs-estimate table; FAQ on why chatbots can't count their own tokens; privacy note on pasting confidential prompts into random counters. Deterministic, source-cited, evergreen apart from the model list.

## Lane notes

- Platform/API: `gpt-tokenizer` / `js-tiktoken` mature, browser-ready, o200k_base supported — no blocker.
- Format/ecosystem: Anthropic tokenizer change (~30% more tokens, Opus 4.7+) is a genuine new fact competitors mostly haven't surfaced — best content hook found.
- Demand: strong indirect evidence (tool proliferation, billing-surprise content); no first-party Reddit/HN pain threads captured in this run's searches.
- Competitor scan: saturated; multiple incumbents already client-side + privacy-marketed; pricepertoken updates daily.
- Regulatory: none applicable.

## Sources

- https://developers.openai.com/api/docs/pricing (fetched 2026-07-07)
- https://platform.claude.com/docs/en/about-claude/pricing (fetched 2026-07-07)
- https://ai.google.dev/gemini-api/docs/pricing (fetched 2026-07-07)
- https://pricepertoken.com/ and https://pricepertoken.com/pricing-page/provider/openai (change log: 2026-07-02 o3 cut $10/$40→$2/$8; GPT-5.1 repriced)
- https://www.npmjs.com/package/gpt-tokenizer · https://github.com/niieani/gpt-tokenizer
- https://www.npmjs.com/package/js-tiktoken (lite ranks import; ~200KB-class encodings; CDN rank JSON option)
- https://platform.claude.com/docs/en/build-with-claude/token-counting (count-tokens API is only Claude ground truth)
- https://github.com/javirandor/anthropic-tokenizer (Claude tokenizer approximation-only status)
- Competitor set observed: https://tokencost.app/ · https://llm-calculator.com/ · https://ecorpit.com/llm-token-counter-2026/ · https://tokencalculator.com/ · https://gptforwork.com/tools/tokenizer · https://zalt.me/tools/tokens-counter · https://pricepertoken.com/token-counter · https://tokencounter.org/ · https://benchlm.ai/llm-pricing · https://yourgpt.ai/tools/openai-and-other-llm-api-pricing-calculator · https://www.morphllm.com/llm-cost-calculator · https://tiktokenizer.vercel.app/?model=o200k_base
