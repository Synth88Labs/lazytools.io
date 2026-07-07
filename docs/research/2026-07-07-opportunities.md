# Browser-Tool Market Research — 2026-07-07

## Executive summary

Two opportunities cleared the ≥18/25 bar. The strongest is **Factur-X / French e-invoice depth** (22/25) — a sanctioned variant of the already-BUILT e-invoice viewer: France's B2B mandate requires **every French company to be able to receive e-invoices from 1 September 2026** (issuing: large companies Sept 2026, SMEs Sept 2027), a statutory driver that peaks exactly in our next two release cycles. Second is a **Networking & IT calculator cluster** (20/25, 8 tools: subnet/CIDR, IPv6, IP converters, chmod, cron) riding a dated structural driver — IPv6 crossed 50% of Google's measured traffic in March 2026 — with maximal AI-resistance (deterministic, zero-friction, weekly repeat workflow, privacy-sensitive internal network plans). Of the user-suggested candidates, math tools, fitness/pace calculators, text diff, and amortization scored 15–16 (watchlist: saturated incumbents, no named driver), and a typing test was rejected (Monkeytype-class dominance). Note: `percentage-change` and `compound-interest` from the candidate list are already BUILT.

## Opportunities

### 1. Factur-X / French e-invoice viewer depth — 22/25

- **Proposed category/slugs:** depth on the BUILT `/file/e-invoice-viewer/` — add `facturx-viewer` intent page (or in-tool profile surfacing), French-language UI toggle for the rendered invoice, Factur-X profile detection (MINIMUM/BASIC/EN16931/EXTENDED), and a companion blog post targeting French queries. This is an explicit *variant* of an existing tool, allowed under filter #4.
- **Scores:** Demand 4 · Feasibility 5 · Competition gap 3 · Durability 5 · Fit 5.
- **Future driver (regulatory, named, dated):** France's e-invoicing mandate — all companies must be able to **receive** electronic invoices from **1 Sept 2026**; issuing mandatory for large/mid-caps 1 Sept 2026 and for SMEs/micro-enterprises 1 Sept 2027. Accepted formats: Factur-X (hybrid PDF+XML, the ZUGFeRD sibling), UBL 2.1, CII — all of which our existing parser already handles or nearly handles. Combined with Germany (receive since 2025, issue 2027–2028), the Franco-German axis makes this driver strengthen through 2028.
- **Evidence:**
  - Official mandate timeline and formats: https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108885/eInvoicing+in+France ; https://entreprendre.service-public.gouv.fr/actualites/A15683?lang=en (observed: government source confirms Sept 2026 receive obligation).
  - Vendor-guide ecosystem confirming Factur-X/UBL/CII via PDP/PPF: https://www.cleartax.com/fr/en/e-invoicing-france ; https://www.vertexinc.com/resources/resource-library/frances-2026-e-invoicing-mandate-requirements-timeline-and-compliance-guide (observed: heavy compliance-vendor content; inference: SME-facing *viewer* tooling in English/French remains ERP lead-gen, same gap we exploited for XRechnung).
- **Feasibility notes:** Marginal cost is low — the existing viewer already extracts embedded XML from PDFs (pdf.js `getAttachments()`) and parses UBL + CII. Work = Factur-X profile detection from the XML `GuidelineSpecifiedDocumentContextParameter`, French field labels, and dedicated intent/blog pages. Pure client-side, no new wasm.
- **Suggested MVP tool set:** Factur-X profile detector + viewer polish inside e-invoice-viewer; one new intent page (`facturx-viewer` or French-market landing); blog post.
- **Blog/SEO angle:** "Facture électronique 2026: how to open a Factur-X invoice without accounting software"; long-tail: facture-x viewer, ouvrir facture-x, e-invoicing France septembre 2026, factur-x vs zugferd. Timed content: publish before the Sept 1 deadline for maximum capture.

### 2. Networking & IT calculator cluster — 20/25

- **Proposed category/slugs:** either a new `/net/` category or a "Networking" sub-cluster of `/dev/`: `subnet-calculator` (IPv4 + VLSM), `ipv6-subnet-calculator`, `cidr-to-ip-range` (and reverse), `ip-address-converter` (dotted ↔ binary ↔ hex ↔ integer), `ipv6-expand-compress`, `chmod-calculator`, `cron-expression-parser` (parse + human-readable describe + next-run times), `mac-address-formatter`. 8 tools, each answering a distinct query — spam-update compliant (no thin variants).
- **Scores:** Demand 4 · Feasibility 5 · Competition gap 3 · Durability 4 · Fit 4.
- **Future driver (structural, dated):** IPv6 adoption crossed **50% of Google-measured traffic on 28 March 2026** (first time ever, 18 years after measurement began) — every year more engineers, CCNA/Network+ candidates and homelabbers must reason about prefix lengths and /64s, and IPv6 subnetting is conceptually different enough (prefix, not mask) that older IPv4-first calculators underserve it. Secondary driver: perennial certification cohorts (CCNA/Network+) regenerate demand annually.
- **Evidence:**
  - IPv6 50% milestone: https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/ ; https://pulse.internetsociety.org/en/blog/2026/04/18-years-later-ipv6-reaches-majority/ ; https://www.google.com/intl/en/ipv6/statistics.html (observed).
  - Active demand ecosystem — subnet calculators are first-class free-tool bait for monetized/lead-gen sites (SolarWinds requires a download+form; Site24x7, UptimeRobot, Vultr run them as lead-gen): https://www.solarwinds.com/free-tools/advanced-subnet-calculator ; https://www.site24x7.com/tools/ipv6-subnetcalculator.html ; https://uptimerobot.com/free-tools/ipv6-subnet-calculator/ (observed: incumbents monetize via lead-gen; inference: demand proven, ad-light client-side alternative has room).
  - CCNA prep sites treat subnet calculation as core recurring practice: https://subnettingpractice.com/ ; https://8gwifi.org/SubnetFunctions.jsp (observed: student demand is institutional and annual).
  - Cron: crontab.guru's dominance plus a clone ecosystem proves the intent volume (https://crontab.guru/ ; https://utilshed.com/blog/crontab-guru-alternatives/) — we include cron-parser as cluster support, not a primary SEO bet.
- **AI-resistance check:** deterministic/byte-exact (LLMs miscompute subnet boundaries), zero-friction beats prompting (paste a CIDR, done), privacy-sensitive (internal addressing plans shouldn't go into chatbots), repeat-workflow (bookmarked by sysadmins). 4 of 5 — passes.
- **Feasibility notes:** Pure JS, no wasm, no data feeds. IPv4/IPv6 math via BigInt; cron parsing via a small self-written parser or `cron-parser`-class library (bundle, no network). MAC *vendor lookup* deliberately excluded from MVP — the IEEE OUI database is a multi-MB static payload of debatable value; formatter/validator only. Everything fits Namecheap static hosting.
- **Suggested MVP tool set (build order):** subnet-calculator → ipv6-subnet-calculator → cidr-to-ip-range → ip-address-converter → ipv6-expand-compress → chmod-calculator → cron-expression-parser → mac-address-formatter.
- **Blog/SEO angle:** "IPv6 just passed 50% — subnetting cheat sheet for the dual-stack era" (news-hook + evergreen); "CIDR notation explained with a visual calculator"; long-tail: subnet calculator ipv6, /64 subnet how many addresses, cidr to ip range, chmod 755 meaning, cron every 5 minutes.

## Watchlist

- **Text diff / compare tool** — 16/25 (Demand 4, Feasibility 5, Gap 2, Durability 2, Fit 3). The privacy gap is already filled: multiple explicitly client-side diff tools exist and market our exact angle (https://www.privacydiff.com/ , https://diffchecker.dev/ , https://www.diffchecker.net/). **Promote if:** we find recurring pain around *file-level* or side-by-side rich diffs (Word/PDF/CSV diff) that the text-only incumbents don't do client-side — a CSV-diff or PDF-text-diff variant could clear the gap axis.
- **Amortization schedule (EMI calculator depth)** — 15/25. No observed pain threads; incumbents (calculator.net, bank sites) saturate the head term. But marginal cost is near-zero as an *enhancement* to the BUILT `emi-calculator` (full month-by-month table + CSV export + prepayment what-if). **Promote if:** treated as a depth enhancement rather than a page bet, or if prepayment/extra-payment long-tail evidence surfaces.
- **Math tools category (fraction, GCD/LCM, prime factorizer, ratio, mean/median/std-dev, quadratic)** — 15/25 (Gap 1: CalculatorSoup, OmniCalculator, Symbolab, RapidTables, plus AI homework tools all serve this; no named future driver). **Promote if:** keyword-gap analysis identifies specific winnable long-tail intents with weak SERPs post-June-2026 spam update; otherwise the spam-update preference for fewer, stronger pages argues against it. Note `percentage-change-calculator` already BUILT.
- **Fitness/pace calculators (running pace, target heart rate)** — 15/25 (Gap 2: McMillan, Strava, Omni, Active own the space; Durability 2: no driver). **Promote if:** evidence of privacy-sensitive fitness-data pain or an underserved sub-intent (e.g., treadmill incline-adjusted pace) with weak SERPs.
- **JPEG XL / AVIF converter** — carried at 17/25, trigger unchanged but nearer: Chrome 145 still flag-gated as of today; default-on expected H2 2026 with Edge following (https://mochify.app/guides/chrome-145-jpeg-xl-default , https://fastedit.net/blog/jpeg-xl-browser-support-2026). **Promote when** default-on ships; consider pre-building 4–6 weeks ahead to own the SERP at the news moment.
- **WebCodecs video toolkit** — 20/25, unchanged from 2026-07-06 (competition-gap axis 2 blocks promotion). No new evidence gathered today.
- **Subtitle converter SRT↔VTT** — 16/25, unchanged; no new pain threads found.
- **SQLite database viewer** — 15/25, unchanged; no demand evidence gathered today.

## Rejected today

- **Typing test** — 13/25: Monkeytype/typing.com-class dominance (gap 1), no future driver, weak AI-resistance rationale beyond determinism.
- **Cron expression parser (as standalone SEO bet)** — crontab.guru's entrenchment makes the head term unwinnable; folded into the networking cluster as supporting tool instead.
- **MAC vendor lookup** — multi-MB static OUI database for marginal value on static hosting; formatter/validator suffices.
- **Currency-anything / live-rate tools** — permanent filter #1 exclusion (re-noting so future runs skip).

## Lane notes

1. **Platform & API signals:** JXL still flag-gated in Chrome 145 (default-on expected H2 2026 — watchlist trigger intact). Temporal API reached Chrome stable (143/144) — implementation convenience for our date tools, not a category unlocker. Nothing else new.
2. **Format & ecosystem shifts:** IPv6 crossed 50% of Google traffic (March 2026) — promoted to driver for opportunity #2. No new file-format shifts beyond the JXL watch.
3. **Demand & pain signals:** No fresh Reddit pain threads surfaced for subnet/amortization queries via available search; demand for networking tools inferred from the size of the lead-gen tool ecosystem and certification-prep sites instead (noted as observation vs inference in scoring). Diff-checker privacy demand is real but already served.
4. **Competitor & gap scan:** TinyWow remains a generalist (200+ tools, AI-heavy); no notable deterministic-tool additions found at TinyWow/iLovePDF this period. SolarWinds/Site24x7/UptimeRobot run subnet calculators as lead-gen — validates demand, and their form-gating/download requirements are our differentiator. Client-side diff tools (PrivacyDiff, diffchecker.dev/.net) show the privacy angle being commoditized in text tools — a caution for text-category bets.
5. **Regulatory & institutional drivers:** France e-invoicing receive-mandate lands 1 Sept 2026 (issuing 2026/2027) — the single most actionable dated driver found; promoted to opportunity #1 as depth on the BUILT viewer. No new EAA developments checked into today beyond prior run.

## Sources

- https://blog.apnic.net/2026/04/28/google-hits-50-ipv6/
- https://pulse.internetsociety.org/en/blog/2026/04/18-years-later-ipv6-reaches-majority/
- https://www.google.com/intl/en/ipv6/statistics.html
- https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108885/eInvoicing+in+France
- https://entreprendre.service-public.gouv.fr/actualites/A15683?lang=en
- https://www.cleartax.com/fr/en/e-invoicing-france
- https://www.vertexinc.com/resources/resource-library/frances-2026-e-invoicing-mandate-requirements-timeline-and-compliance-guide
- https://www.truecommerce.com/blog/e-invoicing-in-france-a-guide-to-the-french-mandate/
- https://www.solarwinds.com/free-tools/advanced-subnet-calculator
- https://www.site24x7.com/tools/ipv6-subnetcalculator.html
- https://uptimerobot.com/free-tools/ipv6-subnet-calculator/
- https://www.vultr.com/resources/subnet-calculator-ipv6/
- https://www.subnetcalculator.dev/ipv6-subnet-calculator/
- https://subnettingpractice.com/
- https://8gwifi.org/SubnetFunctions.jsp
- https://www.calculator.net/ip-subnet-calculator.html
- https://crontab.guru/
- https://utilshed.com/blog/crontab-guru-alternatives/
- https://www.saashub.com/crontab-guru
- https://www.privacydiff.com/
- https://diffchecker.dev/
- https://www.diffchecker.net/
- https://github.com/technikhil314/offline-diff-viewer
- https://www.calculatorsoup.com/calculators/math/gcf.php
- https://www.omnicalculator.com/math/greatest-common-denominator
- https://www.symbolab.com/solver/gcd-calculator
- https://www.rapidtables.com/calc/math/gcf-calculator.html
- https://www.mcmillanrunning.com/
- https://www.strava.com/running-pace-calculator
- https://www.calculator.net/pace-calculator.html
- https://www.omnicalculator.com/sports/training-pace
- https://mochify.app/guides/chrome-145-jpeg-xl-default
- https://fastedit.net/blog/jpeg-xl-browser-support-2026
- https://www.phoronix.com/news/JPEG-XL-Returns-Chrome-Chromium
- https://developer.chrome.com/release-notes/144
- https://developer.chrome.com/release-notes/143
- https://tinywow.com/tools
