# Browser-Tool Market Research — 2026-07-09 (Math category expansion deep-scan)

Owner-directed scan: additional /math/ calculators where LazyTools' exact-arithmetic + steps angle wins. Baseline: 10 tools live in /math/, percentage tools in /calc/, base converter in /dev/.

## Executive summary

Math calculators are contested everywhere — every candidate has multiple free incumbents, so competition-gap is the deciding axis, not demand. The two verifiable structural weaknesses in the space: (1) the biggest brands (Symbolab, Mathway) paywall full step-by-step solutions at ~$9.99/month, and (2) almost no incumbent computes in exact arithmetic — BigInt long division, simplified surds, exact rational coordinates are genuinely rare even where "steps" are free. Five candidates clear the bar: **long division with steps (21/25)**, **radical/surd simplifier (20)**, **modular arithmetic suite (20)**, **coordinate geometry with exact fractions & radicals (20)**, and **binomial expansion with exact BigInt coefficients (19)**. High-demand candidates like factoring quadratics, 3×3 systems and sequence calculators score 18–20 on total but are blocked by competition-gap = 2 (excellent free steps incumbents: MathPapa, matrixcalc.org, mathportal, Pearson's new calculator channel) — watchlisted. Several requested candidates (percent-of word problems, proportion/unit rate, percent error, z-score) are thin variants of live tools and should be folded, not built.

Cross-cutting AI-resistance note (observed): LLM arithmetic unreliability for exact computation (modular exponentiation, long division layouts, surd simplification) remains a documented, recurring complaint — deterministic verification is the durable driver for this whole category, alongside the steps-paywall trend.

## Opportunities

### 1. Long Division Calculator with Steps — 21/25
- **Category/slug:** /math/long-division/
- **Scores:** demand 5 · feasibility 5 · gap 3 · durability 3 · fit 5
- **Future driver:** homework-verification demand in the AI era (LLMs produce unreliable arithmetic and cannot render the worked long-division layout); steps-paywall trend at Symbolab/Mathway pushes students to free tools. Perennial education demand (driver older but permanently active).
- **Evidence:** dedicated single-purpose domains exist and rank — longdivision-calculator.com, calculatorlongdivision.com — which is proof of standalone demand; the term is served by every major calculator brand (calculator.net, calculatorsoup, omnicalculator, inchcalculator, madformath, vedantu), i.e., heavily monetized head term. URLs: https://longdivision-calculator.com/ · https://www.calculator.net/long-division-calculator.html · https://www.calculatorsoup.com/calculators/math/longdivision.php
- **Gap:** incumbents show steps but virtually all compute in floats (precision dies ~15–16 digits) and none connect the decimal phase to repetend detection. Our angle: BigInt dividend/divisor of any size, the full bring-down worked layout, decimal expansion with the repeating part identified in parentheses — directly reusing the cycle-detection engine from the live decimal⇄fraction tool.
- **Feasibility:** pure BigInt string arithmetic; zero new dependencies; renders as a monospace/SVG worked layout.
- **MVP:** integer ÷ integer (quotient + remainder, full steps), decimal mode with repetend, "express as mixed number / fraction" cross-links to fraction tools.
- **SEO angle:** "long division calculator with steps" + "long division with remainders" + "long division with decimals"; blog: how long division reveals repeating decimals.

### 2. Radical Simplifier & Surd Calculator — 20/25
- **Category/slug:** /math/radical-simplifier/ (simplify √180 = 6√5, nth roots, rationalize denominators, surd add/multiply)
- **Scores:** demand 4 · feasibility 5 · gap 3 · durability 3 · fit 5
- **Future driver:** steps-paywall trend — Symbolab's rationalize-denominator and simplify tools gate full steps behind Pro (verified pricing complaints; Mathway $9.99/mo for steps); exact symbolic output is the strongest LLM-resistance case in algebra (models routinely mis-simplify surds).
- **Evidence:** Symbolab, mathportal, miniwebtool, quickmath all serve the query family; rationalize-denominator is a distinct sub-intent with its own calculators. URLs: https://miniwebtool.com/radical-simplifier/ · https://www.mathportal.org/calculators/radical-expressions/rationalize-radical-denominator.php · https://www.symbolab.com/solver/rationalize-denominator-calculator · https://www.myengineeringbuddy.com/blog/symbolab-math-solver-reviews-alternatives-pricing/ (paywall tiers)
- **Gap:** free incumbents do single-radical simplification; almost none do exact surd *arithmetic* (a√b ± c√d, products, conjugate rationalization) with prime-factorization steps shown free. We already own the engine — the quadratic solver's surd extractor + the prime factorizer.
- **MVP:** simplify √n and ⁿ√m via prime factorization (steps), rationalize 1/√n and 1/(a+√b) via conjugate (steps), combine like surds.
- **SEO angle:** "simplify square root of 180" long-tail family (one tool page + examples, not doorway pages, per spam gate); blog: why 6√5 is the answer and 13.416 isn't.

### 3. Modular Arithmetic Suite — 20/25
- **Category/slug:** /math/modular-arithmetic/ (a^b mod n with square-and-multiply trace; modular inverse via extended Euclid table; optional CRT solver)
- **Scores:** demand 3 · feasibility 5 · gap 3 · durability 4 · fit 5
- **Future driver:** CS-education growth (discrete math, cryptography courses, competitive programming) — modular exponentiation is textbook RSA material; this is also the single worst LLM failure mode in the candidate list (models confidently produce wrong power-mod results), making deterministic BigInt verification durable.
- **Evidence:** dedicated domain extendedeuclideanalgorithm.com exists solely for this (demand proof); dcode.fr, planetcalc, boxentriq all serve power-mod; university course pages link out to calculators (math.wichita.edu). URLs: https://extendedeuclideanalgorithm.com/calculator.php · https://www.dcode.fr/modular-exponentiation · https://www.boxentriq.com/math/modular-exponentiation · https://www.math.wichita.edu/discrete-book/section-numtheory-modularexp.html
- **Gap:** incumbents are fragmented (one page per operation, scattered across ad-heavy sites); no clean single suite with full step tables (square-and-multiply binary trace + extended-Euclid tableau + Bézout coefficients). Caveat observed: getzenquery.com already markets a "privacy-first, runs locally" modular inverse — the privacy angle alone is not unique here; the steps-completeness + BigInt + one-suite angle is.
- **Feasibility:** BigInt only; extends the live GCD/Euclid code directly.
- **MVP:** power-mod with trace, mod inverse with extended-Euclid table, plain a mod n / congruence checker; CRT as phase 2.
- **SEO angle:** "modular exponentiation calculator", "modular inverse calculator", "extended euclidean algorithm calculator with steps"; blog: RSA-by-hand walkthrough using the tools.

### 4. Coordinate Geometry Pair: Slope/Line-Equation + Distance/Midpoint (exact) — 20/25
- **Category/slugs:** /math/slope-calculator/ (slope + line equation from two points, exact fractions: m = 3/7, y = 3/7·x − 5/7) and /math/distance-midpoint/ (distance in simplified radical form: √52 = 2√13; midpoint as exact fractions). Two slugs — distinct query intents ("slope calculator" vs "distance formula calculator / midpoint calculator") — but shared engine; do NOT split further (no separate y-intercept/point-slope pages — spam-gate fold).
- **Scores:** demand 4 · feasibility 5 · gap 3 · durability 3 · fit 5
- **Future driver:** same steps-paywall + deterministic-verification driver; algebra/geometry coursework perennial.
- **Evidence:** head terms served by calculatorsoup, omnicalculator, dedicated domain slopecalculator.io (demand proof), mathportal distance/midpoint. URLs: https://www.calculatorsoup.com/calculators/geometry-plane/slope-calculator.php · https://www.slopecalculator.io/ · https://www.omnicalculator.com/math/slope · https://www.mathportal.org/calculators/analytic-geometry/distance-and-midpoint-calculator.php
- **Gap:** incumbents output decimals; exact-fraction slope/intercept and *simplified-radical* distance (the form homework actually requires: 2√13, not 7.211) is genuinely rare. Reuses rational + surd engines wholesale.
- **MVP:** two points in (fractions/decimals accepted) → slope, line equation in slope-intercept + point-slope + standard form (all exact), parallel/perpendicular slopes; distance with Pythagoras working + simplified radical; midpoint.
- **SEO angle:** "slope calculator fraction", "distance formula calculator radical form", "midpoint calculator fractions"; blog: exact coordinate geometry answers.

### 5. Binomial Expansion Calculator (exact BigInt coefficients) — 19/25
- **Category/slug:** /math/binomial-expansion/
- **Scores:** demand 3 · feasibility 5 · gap 3 · durability 3 · fit 5
- **Future driver:** steps-paywall (Symbolab gates full expansion steps); BigInt exactness where incumbents degrade — coefficients of (x+2y)^30 overflow floats; A-level/IB "first four terms" homework is perennial.
- **Evidence:** query family served by Symbolab, eMathHelp, miniwebtool, testbook, snapxam. URLs: https://www.symbolab.com/solver/binomial-expansion-calculator · https://miniwebtool.com/binomial-theorem-expansion-calculator/ · https://www.emathhelp.net/calculators/algebra-2/binomial-expansion-calculator/
- **Gap:** moderate — free steps exist; our edge is exact BigInt coefficients at any n, rational/negative coefficients handled exactly, Pascal-row + general-term (T_{r+1}) formula shown. Direct extension of the live permutations/combinations engine.
- **MVP:** (ax + by)^n full expansion with steps, specific-term finder ("coefficient of x^k"), Pascal's triangle row.
- **SEO angle:** "binomial expansion calculator with steps", "coefficient of x^k in expansion"; folds Pascal's-triangle intent into the same page.

## Watchlist

- **Factoring quadratics / polynomial factor-expand** — 20/25 but gap = 2 blocks (MathPapa, freemathhelp, mathportal, omni all free with AC-method steps; huge head term is a red-ocean SEO bet). Interim: add a "factored form" line to the live quadratic solver (rational roots → (2x−3)(x+5), else "prime over the integers" with discriminant proof) — near-zero cost, captures the intent without a new page. Promote standalone only with keyword-gap proof on long-tail ("factor by grouping calculator" etc.).
- **Systems of linear equations 2×2/3×3 (exact fractions, elimination steps)** — 18/25, gap = 2 blocks (matrixcalc.org, mathportal, cowpi, Pearson all free with exact steps). Promote if a distinct underserved intent emerges (e.g., word-problem setup, parametric/infinite-solutions explanation quality).
- **Matrix calculator (determinant/inverse/multiply, exact rationals)** — 17/25 (matrixcalc.org and matrixmath.io already do exact fractions + steps free and are entrenched).
- **Sequence calculator (arithmetic/geometric nth term + sum)** — 17/25, gap 2–3 (Pearson explicitly markets exact fractions + steps; mathportal free steps). Promote with long-tail gap proof ("sum of first n terms exact fraction" style).
- **Geometry "in terms of π" exact solver (circle/sector/volume as 25π, symbolic)** — 16/25. Real homework phrase ("leave your answer in terms of π", owlcation guide exists; omni partially supports). Promote with evidence the symbolic-π intent has standalone search volume.
- **Exact probability calculator (dice/coins/cards, answers as fractions: P = 5/36, complement "at least one" rule shown)** — 15/25. Demand real (omni coin-flip, gigacalculator dice, many gaming-niche sites) but incumbents adequately serve the gaming intent with decimals; the exact-fraction homework intent overlaps the live permutations/combinations tool. Promote with evidence "probability calculator fraction" style queries are underserved; natural extension of the perm-comb engine if so.
- **Logarithm calculator (exact log rules, perfect-power detection)** — 15/25; exactness only bites for perfect powers, differentiation thin. Change-of-base steps might rescue it; needs demand evidence.
- **Base-N arithmetic (add/multiply in binary/hex with carry steps)** — 14/25; adjacent to /dev/ base converter; promote with CS-education demand evidence.
- **Z-score / normal distribution** — fold: add z-score line to the live statistics calculator (deterministic erf approximation is fine, but standalone page is a me-too against omni/calculator.net). 14/25 standalone.

## Rejected today

- **Percentage-of-number word problems** — thin variant of live /calc/percentage-calculator (it already answers what-percent-of forms); spam-gate fold.
- **Proportion / unit-rate calculator** — live ratio calculator already solves a:b = c:x; unit-rate is a one-division FAQ, not a page.
- **Percent error calculator** — trivial variant of percentage-change; fold as a mode/FAQ if ever.
- **Triangle solver (law of sines/cosines)** — inherently floating-point trig, no exact angle, omni-class incumbents dominate; the exact-radical right-triangle case is covered by the distance/midpoint tool.
- **Generic area/volume calculators** — pure float me-too, no differentiation (except the π-symbolic variant, watchlisted separately).
- **Continued fractions** — genuinely exact and cheap to build, but demand is niche/academic with no growth driver; revisit only bundled inside decimal⇄fraction as a "best rational approximation" feature.
- **Interest/growth solve-for-time (log-based)** — belongs to /calc/ finance cluster (compound-interest tool exists); not a math-category bet.

## Lane notes

- **Platform & API signals:** nothing new needed — all candidates are pure JS/BigInt, no wasm; lane trivially clear.
- **Format & ecosystem shifts:** n/a for math; the relevant "ecosystem" shift is education-tool paywalling (Symbolab/Mathway steps tiers, verified via pricing review) and Photomath remaining mobile-only under Google (checked: NOT discontinued — no desktop steps competitor from that direction).
- **Demand & pain signals:** dedicated single-purpose domains (longdivision-calculator.com, slopecalculator.io, extendedeuclideanalgorithm.com) used as demand proxies; recurring LLM-arithmetic-unreliability complaints observed qualitatively (no fabricated volumes). No fresh Reddit thread evidence gathered for individual calculators — head-term SERP saturation itself is the demand evidence here.
- **Competitor & gap scan:** notable new-generation entrants (Pearson calculator channel, miniwebtool, goldsupplier, tutorioo, matrixmath.io) now explicitly market "exact fractions + steps" — our former unique angle is being adopted; gap axis scored strictly because of this. Privacy angle is weak in math (inputs aren't sensitive); exactness + steps-completeness + no-paywall is the differentiator.
- **Regulatory & institutional drivers:** none applicable to math tools; lane clear.

## Sources

- https://longdivision-calculator.com/
- https://www.calculator.net/long-division-calculator.html
- https://www.calculatorsoup.com/calculators/math/longdivision.php
- https://www.omnicalculator.com/math/long-division
- https://madformath.com/calculators/basic-math/basic-operations/long-division-calculator-with-steps/long-division-calculator-with-steps
- https://miniwebtool.com/radical-simplifier/
- https://www.mathportal.org/calculators/radical-expressions/rationalize-radical-denominator.php
- https://www.symbolab.com/solver/rationalize-denominator-calculator
- https://quickmath.com/webMathematica3/quickmath/algebra/simplify/basic.jsp
- https://www.myengineeringbuddy.com/blog/symbolab-math-solver-reviews-alternatives-pricing/
- https://extendedeuclideanalgorithm.com/calculator.php
- https://www.dcode.fr/modular-exponentiation
- https://www.dcode.fr/modular-inverse
- https://www.boxentriq.com/math/modular-exponentiation
- https://planetcalc.com/8979/
- https://www.math.wichita.edu/discrete-book/section-numtheory-modularexp.html
- https://www.getzenquery.com/tools/modular-inverse-calculator/
- https://calcdomain.com/modular-inverse
- https://www.calculatorsoup.com/calculators/geometry-plane/slope-calculator.php
- https://www.slopecalculator.io/
- https://www.omnicalculator.com/math/slope
- https://www.mathportal.org/calculators/analytic-geometry/distance-and-midpoint-calculator.php
- https://www.mathcelebrity.com/slope.php
- https://www.symbolab.com/solver/binomial-expansion-calculator
- https://miniwebtool.com/binomial-theorem-expansion-calculator/
- https://www.emathhelp.net/calculators/algebra-2/binomial-expansion-calculator/
- https://www.mathpapa.com/factoring-calculator/
- https://www.freemathhelp.com/factoring-calculator/
- https://www.mathportal.org/calculators/quadratic-equation/factoring-trinomials-calculator.php
- https://www.omnicalculator.com/math/factoring-trinomials
- https://www.symbolab.com/solver/factor-calculator
- https://matrixcalc.org/ and https://matrixcalc.org/slu.html
- https://matrixmath.io/
- https://miniwebtool.com/matrix-inverse-calculator/
- https://www.pearson.com/channels/calculators/system-of-linear-equations-calculator
- https://www.pearson.com/channels/calculators/matrix-calculator
- https://www.pearson.com/channels/calculators/geometric-sequence-series-calculator
- https://www.mathportal.org/calculators/system-of-equations-solver/system-3x3.php
- https://math.cowpi.com/systemsolver/3x3.html
- https://www.mathportal.org/calculators/sequences-calculators/geometric-sequences-calculator.php
- https://calcbe.com/en/calculators/arithmetic-geometric-sequences/
- https://www.omnicalculator.com/statistics/coin-flip-probability
- https://www.gigacalculator.com/calculators/dice-probability-calculator.php
- https://www.omnicalculator.com/math/area-of-a-circle
- https://owlcation.com/stem/how-to-calculate-the-area-of-circle-giving-your-answer-in-terms-of-pi
- https://en.wikipedia.org/wiki/Photomath
- https://www.maketecheasier.com/web-tools-solve-math-problems/
