# /statistics/ Category Design — 2026-07-10

## Verdict: GO (qualified)

A standalone **/statistics/** category is warranted. It is coherent (extends the exact-arithmetic
/math/ into *applied / inferential* statistics), SEO-rich (every candidate is a distinct high-volume
long-tail query → spam-gate compliant), and strongly AI-resistant (LLMs produce plausible-but-wrong
p-values, z-scores and regression coefficients; a deterministic calculator does not). It does **not**
duplicate the /math/ descriptive-stats calculator (mean/median/SD/quartiles/z-score) or perm-comb.

The qualifier: the "only client-side option" thesis is **false** and must not be the pitch. Full-suite
client-side interpreters already exist — statskingdom, datatab, numiqo, statisty all run in-browser,
paste data, chart, and interpret; Aback Tools already markets "runs 100% locally, never leaves your
device" for a normal-distribution calc. So the competition gap is **moderate, not open**. Our
differentiation is a *bundle*, not a single moat:

1. **Single-purpose SEO pages** (the SPSS-clones rank poorly for "binomial probability calculator",
   "z score to p value", "confidence interval calculator"; the single-purpose incumbents that DO rank —
   socscistatistics, calculator.net, omni, easycalculation, ncalculators — are ad-dense, often have no
   data-table paste, no PNG/CSV export, and thin interpretation).
2. **Exactness where it's genuinely exact** (binomial via BigInt coefficients — on brand with /math/).
3. **Plain-English interpretation + working shown** on every test.
4. **Paste-data-table input + exportable SVG chart (PNG) + CSV results** — the four-way UX bundle,
   clean and ad-free, that no single incumbent nails all of.

Treat this as a quality-gated build (post-June-2026 Google): ship in small verified tranches, each page
a distinct query with a unique editorial note + FAQs, exactness/precision stated honestly.

## Scoring summary (25-pt rubric; Demand / Feasibility / Gap / Durability / Fit)

| Tool | D | F | G | Dur | Fit | Total |
|---|---|---|---|---|---|---|
| Normal distribution (z↔p, tails, between, bell-curve PNG) | 5 | 4 | 4 | 4 | 5 | **22** |
| Linear regression + correlation (scatter+line PNG, residuals) | 5 | 4 | 4 | 4 | 5 | **22** |
| Confidence interval (mean σ known/unknown, proportion, diff) | 5 | 4 | 4 | 4 | 4 | **21** |
| Binomial probability (BigInt-exact PMF/CDF) | 5 | 5 | 4 | 3 | 5 | **22** |
| Hypothesis-test suite (1/2-sample t, z, proportion, paired) | 4 | 4 | 4 | 4 | 4 | **20** |
| Sample size (mean, proportion, margin of error) | 5 | 5 | 3 | 4 | 4 | **21** |
| Chi-square test (GoF + independence / contingency table) | 4 | 4 | 4 | 4 | 4 | **20** |
| t / chi-square / F distribution → p-value (+ critical values) | 5 | 4 | 3 | 4 | 4 | **20** |
| Poisson probability | 4 | 5 | 3 | 3 | 4 | **19** |
| One-way ANOVA (from groups) | 4 | 4 | 4 | 3 | 4 | **19** |
| p-value from test statistic (z/t/χ²/F, one/two-tailed) | 4 | 4 | 4 | 4 | 4 | **20** |
| Descriptive stats + charts (box plot + histogram, CSV/PNG) | 4 | 4 | 3 | 3 | 3 | **17** ⚠ overlap-gated |
| Geometric / exponential probability | 3 | 5 | 3 | 3 | 3 | **17** watch |
| Z-score↔percentile↔probability (standalone) | — | — | — | — | — | **FOLD** into normal-dist |

## Recommended tool list (ranked; one-line spec · special-function need)

1. **Normal Distribution Calculator** — mean/SD in; P(X<x), P(X>x), P(a<X<b), two-tailed; z↔p both
   ways; inverse (percentile→x); shaded bell-curve SVG → PNG. · needs **normalCDF (erf)** + **normalInv**.
2. **Linear Regression & Correlation** — paste paired (x,y); slope/intercept, equation, r, r², SE,
   residuals table, predict-ŷ; scatter + fitted line SVG → PNG; CSV export. · none beyond basic algebra
   (optional t-based slope p-value reuses incompleteBeta).
3. **Confidence Interval Calculator** — CI for a mean (σ known → z; σ unknown → t), a proportion, and
   difference of two means/proportions; from summary stats OR pasted data. · needs **normalInv** + **t
   critical (inverse incompleteBeta)**.
4. **Binomial Probability Calculator** — n, p, k → P(X=k), P(≤k), P(≥k), mean/variance; **BigInt-exact**
   coefficients and exact rational CDF up to ~n=1000, normal-approx fallback beyond (stated). · exact
   BigInt; optional **regularizedBeta** for large-n CDF.
5. **Sample Size Calculator** — for a mean (from σ, margin, confidence) and for a proportion (with
   finite-population correction); margin-of-error mode folded in. · needs **normalInv** only.
6. **Hypothesis Test Suite** — one/two-sample t-test (pooled + Welch), one/two-sample z-test, one/two
   proportion z-test, paired t; from summary stats OR pasted columns; outputs statistic, df, p-value,
   decision at α, **plain-English sentence**. · needs **t CDF (incompleteBeta)** + **normalCDF**.
7. **Chi-Square Test** — goodness-of-fit (observed vs expected) + independence (r×c contingency **data
   table** input); χ², df, p, expected-counts table, Cramér's V. · needs **χ² CDF (regularizedGammaP)**.
8. **p-value from Test Statistic** — z / t / χ² / F + df → one- or two-tailed p; critical-value lookup
   companion (replaces printed t/z/χ²/F tables). · needs normalCDF, incompleteBeta, regularizedGammaP.
9. **Poisson Probability Calculator** — λ, k → P(X=k), P(≤k), P(≥k), mean/var. · **regularizedGammaQ**
   (or exact term sum for small λ).
10. **One-Way ANOVA** — paste ≥2 groups; SS/df/MS table, F, p, η²; group means; optional box plots. ·
    needs **F CDF (incompleteBeta)**.

Phase-2 / lower priority: **Descriptive Statistics + Charts** (box plot + histogram + 5-number summary,
CSV/PNG export) — see overlap gate below; **Geometric / Exponential probability** (bundle with binomial/
Poisson as a "discrete/continuous distribution" mini-cluster if long-tail proves out).

That is **10 core + 2 phase-2 = 12 tools**, inside the requested 8–14 and enough to justify the category.

## Lead tools to build first (2–3)

- **Normal Distribution Calculator** — the anchor. Highest demand, and it forces the two most-reused
  special functions (normalCDF, normalInv) plus the bell-curve chart → PNG pipeline. Also absorbs the
  z-score↔percentile overlap, so build it before touching that fold.
- **Confidence Interval Calculator** — huge demand, cheap: reuses normalInv, introduces the t critical
  value (drives the incompleteBeta work that unlocks t/F/hypothesis tools), minimal chart complexity,
  strongest clean "interpretation sentence" showcase.
- **Linear Regression & Correlation** — the visual differentiator: scatter + fitted line PNG + data-table
  paste + CSV export is the single clearest "we do what the ad-heavy incumbents don't" page, and demand
  for "linear regression calculator" is very high.

Sequencing: build the shared **statdist.ts** lib + **DataTable** + **StatChart** first (all three leads
need them), ship Normal Distribution to validate the lib + PNG pipeline, then CI, then Regression. The
incompleteBeta/Gamma work done for CI unlocks tranche 2 (hypothesis suite, chi-square, t/F/p-value, ANOVA).

## Shared library & UX components to build

- **`src/lib/statdist.ts`** — special-function core (pure JS, no server):
  - `erf/erfc`, `normalCDF`, `normalInv` (Acklam), `lnGamma`,
  - `regularizedGammaP/Q` (incomplete gamma; Lentz continued fraction / series) → χ², Poisson,
  - `regularizedBeta` + `invRegularizedBeta` (incomplete beta; Newton) → t, F, binomial-CDF,
  - distribution wrappers: `tCDF`, `chi2CDF`, `fCDF`, `binomPMF/CDF` (BigInt-exact), `poissonPMF/CDF`,
    `geomPMF/CDF`, `expCDF`, plus inverse/critical-value helpers.
  - **Ship with a Node test suite** (like the mathx 53-case suite) checking against published table
    values (z, t, χ², F tables; known p-values). **Precision honesty**: state ≈1e-8–1e-10 relative
    accuracy; note extreme-tail degradation and that BigInt binomial is *exact* while continuous
    p-values are numerical approximations.
- **`DataTable` input component** — paste CSV/TSV/whitespace, auto-split columns, modes: single-column,
  two-column (paired), multi-group, and r×c contingency; per-cell edit, clear, "load sample data".
  Reuse across regression, hypothesis suite, chi-square, ANOVA, descriptive.
- **`StatChart` component** — inline **SVG** renderers: shaded bell curve, scatter+regression line, box
  plot, histogram; each with **Download PNG** (serialize SVG → canvas → `toBlob`, following the existing
  WhiteboardTool/QrTool/ImageTool PNG pattern). No chart library dependency needed.
- **CSV results export util** — results/residuals table → CSV download (small shared helper).
- **Interpretation pattern** — a standard `<ResultVerdict>` block: *statistic → p-value → decision at α →
  one-sentence plain-English conclusion* (e.g. "p = 0.032 < α = 0.05, so we reject H₀: there is
  statistically significant evidence that the two group means differ."). Template per test family;
  this is the category's signature feature and must appear on every inferential page.

## DO-NOT-BUILD / FOLD calls

- **Z-score ↔ percentile ↔ probability (standalone): FOLD.** Covered by the Normal Distribution
  calculator (z↔p↔percentile) plus the existing /math/ statistics-calc z-score panel (raw↔z). Cross-link
  both; do not make a third page. (Matches INDEX line: "normal-distribution tables remain unbuilt" — this
  discharges it.)
- **Descriptive statistics numbers (mean/median/SD/quartiles) in /statistics/: DO NOT duplicate** the
  live /math/statistics-calculator. Only build the /statistics/ "Descriptive + Charts" page if it leads
  with **box plot + histogram + CSV/PNG export** (a distinct viz/export intent), and cross-link the two;
  otherwise skip. Scored 17 for exactly this cannibalization risk.
- **Standard error / margin of error standalone: FOLD** into the CI and Sample-Size pages (mode/FAQ), not
  thin separate pages (spam-gate).
- **Dice / coin / combinations probability: DO NOT rebuild.** perm-comb (/math/, BuILT) covers
  combinatorics; the "exact dice/coin probability" item stays watchlist (INDEX line 43) — gaming
  incumbents adequate.
- **Geometric mean / harmonic mean: already folded** to /math/ statistics-calc (INDEX line 69). Do not
  resurface in /statistics/.
- **Full SPSS-clone / multi-test workspace: DO NOT build.** statskingdom/datatab/numiqo/statisty own that
  and it fails the single-purpose-SEO + clean-page strategy. We win on focused pages, not a workbench.

## Competitor weaknesses mined (the wedge)

- **socscistatistics.com** — 40+ tests, but ad-supported, dated UI, minimal charts, interpretation thin,
  no PNG/CSV export.
- **calculator.net/statistics** — only basic descriptive (mean/SD); **no** normal/CI/hypothesis/sample-
  size/distribution tools at all — a wide-open long-tail for us.
- **omnicalculator.com/statistics** — 195 calculators, strong coverage, but ad/upsell-heavy, weak data-
  table paste, decimal-only, no chart PNG export, interpretation is generic.
- **graphpad quickcalcs** — focused and trusted but sparse, no data-table UX, no export, gated feel.
- **statskingdom / datatab / numiqo / statisty** — the real competition: client-side, chart, interpret,
  export code. But they are dense multi-test *workbenches* that rank poorly for single-intent queries and
  intimidate casual/student users. Our single-purpose, clean, ad-free pages are the differentiation.
- **Aback Tools / easycalculation / ncalculators / mathportal** — single-purpose and some privacy-
  marketed, but ad-dense, no CSV/PNG export, no interpretation, no data-table paste.

## Spam-gate / compliance

Every listed page targets a distinct query ("normal distribution calculator", "confidence interval
calculator", "binomial probability calculator", "chi square test calculator", "linear regression
calculator", "sample size calculator", "one way anova calculator", "p value calculator" …). No page-count
target; ship verified tranches; unique editorial note + 5–8 FAQs per page; state precision limits and
exact-vs-approx honestly; cite quartile/method conventions as the /math/ stats calc already does.

## Sources

- https://www.socscistatistics.com/tests/
- https://www.omnicalculator.com/statistics
- https://www.statskingdom.com/
- https://www.calculator.net/statistics-calculator.html
- https://www.statskingdom.com/normal-distribution-calculator.html
- https://abacktools.com/tools/math/calculators/normal-distribution-calculator
- https://www.mathportal.org/calculators/statistics-calculator/normal-distribution-calculator.php
- https://datatab.net/
- https://numiqo.com/statistics-calculator/hypothesis-test/chi-square_test_calculator
- https://statisty.app/
- https://teststatisticcalculator.com/
- https://www.graphpad.com/quickcalcs/chisquared1/
