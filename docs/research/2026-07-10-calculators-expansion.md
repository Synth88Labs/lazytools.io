# /calc/ Calculators Expansion — Market Research — 2026-07-10

## Executive summary

The everyday-consumer calculator category is entrenched and already client-side (calculator.net, omnicalculator, bankrate all run JS in-browser), so our usual differentiators — client-side/privacy — are **weak** here. Differentiation must lean on: clean single-purpose ad-free pages, formula/working shown, and honest maintenance flags for anything data-dependent. The "future driver" axis is also structurally weak for this category: demand is persistent/evergreen (life-events, financial decisions, fitness) rather than driven by a maturing API — so scores cluster in the 18–21 band and few clear the "no axis ≤2" purity bar (competition-gap is usually a 2–3). This scan is executed as an owner-directed **category-expansion** build (same posture as the /math/ push), so it returns a ranked build list rather than gating on the gap axis. Twelve tools are worth building; three are leads (TDEE/calorie, Mortgage+amortization, Pregnancy due date). Two finance items are hard **DO-NOT-BUILD** on maintenance-liability grounds (take-home/income-tax estimator; inflation/CPI), and one is a real **FOLD** (salary annual↔hourly↔monthly into the existing hourly-to-salary tool).

## Ranked build list (top 12)

Legend: **[S]** = drops into declarative fields→compute pattern · **[C]** = needs custom component (schedule/chart/repeatable rows) · **[D!]** = data-maintenance flag.

1. **TDEE / Calorie calculator** — `/calc/tdee-calculator/` — **[S]** — 21/25.
   Mifflin-St Jeor BMR → × activity factor → maintenance/cut/bulk goal calories. Sex, age, height, weight, activity select. Shows BMR + TDEE + goal-adjusted targets. Absorbs standalone "BMR calculator" and "calorie deficit" intents on one page.
2. **Pregnancy due date calculator** — `/calc/pregnancy-due-date-calculator/` — **[S]** — 21/25.
   Naegele's rule (LMP + 280 days) + conception-date and IVF-transfer modes; outputs EDD, current week, trimester. Date input + select. Mild privacy angle is genuinely real here (fertility data).
3. **Mortgage payment calculator + amortization** — `/calc/mortgage-calculator/` — **[C]** — 19/25 (demand=5).
   Core P&I is EMI math (already have the compute), but the *schedule table* + optional principal/interest split chart is the reason people pick a mortgage page over a generic loan page. **THE** highest-volume finance keyword. Custom component: paginated amortization table + CSV export.
4. **Auto / car loan calculator** — `/calc/auto-loan-calculator/` — **[S]** — 20/25.
   Same reducing-balance math, US car-buying framing: price, down payment, trade-in, sales-tax-on-price, term. Distinct query from EMI; single-shot result rows (monthly payment, total interest, loan amount).
5. **Markup & margin calculator** — `/calc/margin-calculator/` — **[S]** — 20/25.
   Cost/price/margin%/markup% — solve any from the others; show the margin-vs-markup gap (60→100 = 40% margin, 66.7% markup). Small-business evergreen; clean single-purpose page beats the ad-heavy incumbents.
6. **Body fat percentage (US Navy method)** — `/calc/body-fat-calculator/` — **[S]** — 19/25.
   Tape-measure log formulas (neck/waist/hip + height). Deterministic, distinct from BMI, high fitness demand.
7. **Ideal weight calculator** — `/calc/ideal-weight-calculator/` — **[S]** — 19/25.
   Devine/Robinson/Miller/Hamwi shown as a range (the differentiator vs single-number incumbents). Height + sex.
8. **Macro calculator** — `/calc/macro-calculator/` — **[S]** — 19/25.
   Splits goal calories into protein/carb/fat by preset ratios or g/kg protein target. Natural companion/cross-link to TDEE; reuses its BMR/TDEE compute.
9. **GPA calculator (+ final-grade-needed companion)** — `/calc/gpa-calculator/` — **[C-lite]** — 19/25.
   Repeatable course rows (grade + credits) → weighted GPA on 4.0 scale; needs a repeatable-field-group component (mild). Distinct from /math/ weighted-average (letter→points mapping, GPA scale). Ship "final grade needed" (`/calc/final-grade-calculator/`) as [S] companion.
10. **Sales tax calculator** — `/calc/sales-tax-calculator/` — **[S]** — 19/25.
    Rate-as-input (NOT a jurisdiction lookup — that would be a data-maintenance trap). Solve before-tax / tax / after-tax given any two. VAT/GST framing in FAQ. Zero maintenance because the user supplies the rate.
11. **Loan payoff / extra-payment calculator** — `/calc/loan-payoff-calculator/` — **[C]** — 19/25.
    "Pay $X extra/month → payoff N months sooner, save $Y interest." Needs schedule simulation. Strong distinct intent from EMI/mortgage; also serves the credit-card-payoff query in FAQ (or a sibling page later).
12. **Fuel cost / trip calculator** — `/calc/fuel-cost-calculator/` — **[S]** — 19/25.
    Distance ÷ efficiency × price. Supports mpg / L per 100km / km per L via a units select. Evergreen travel query.

**Next tranche (solid 18–19, ship after the 12):** Savings goal / how-long-to-save `[S]` 19 · Break-even `[S]` 19 · Unit price / cost-per-unit `[S]` 19 · One-rep max (Epley/Brzycki) `[S]` 19 · Ovulation calculator `[S]` 19 (fertility-privacy angle) · ROI `[S]` 18 · Down-payment `[S]` 18 · Debt-to-income `[S]` 18 · APR↔APY converter `[S]` 18 · Time-card hours `[C-lite]` 18 · Paint / flooring / concrete estimators `[S]` 17 each (bundle as a home-project mini-cluster) · Sleep calculator `[S]` 17.

## The 3 lead tools

- **TDEE / Calorie calculator (21)** — biggest single health-calculator demand cluster (BMR + TDEE + calorie-goal all resolve to one page); Mifflin-St Jeor is the well-sourced default; pure `[S]`, zero maintenance, anchors a fitness sub-cluster (macro, body-fat, ideal-weight, one-rep-max cross-link off it).
- **Mortgage payment + amortization (19, demand 5)** — the flagship finance keyword; the amortization schedule + CSV export is the concrete reason to visit over a generic loan calc, and it discharges the watchlisted "amortization schedule" EMI-depth item. Only `[C]` of the three.
- **Pregnancy due date (21)** — enormous evergreen demand, genuinely privacy-adjacent input, pure date math `[S]`, strong FAQ/long-tail (week-by-week, trimester, conception vs LMP vs IVF).

## Fold / do-not-build calls

- **FOLD — Salary annual↔hourly↔monthly converter** → into existing `/calc/hourly-to-salary-calculator/`. Real overlap. Add a monthly output row + reverse (salary→hourly) mode rather than a new page (spam-gate: one canonical page for the intent).
- **FOLD — BMR standalone** → into the TDEE page (BMR shown as an output row). Optionally split a thin BMR landing page later only if Search Console shows the "bmr calculator" query underserved by the TDEE page.
- **FOLD — CD calculator** → into existing `/calc/compound-interest-calculator/` (add APY output + a "CD/term-deposit" FAQ framing). Not a separate page.
- **FOLD — Fuel economy (mpg / L per 100km)** → into the fuel-cost tool's units select, and/or `/units/`. Not its own /calc/ page.
- **DO-NOT-BUILD — Take-home / income-tax estimator** — jurisdiction-dependent brackets change yearly; this is exactly the LLM-pricing-style maintenance liability the memory warns against. Any accuracy claim rots. Defer indefinitely unless we commit to a dated, single-jurisdiction, verified-tables ritual.
- **DO-NOT-BUILD — Inflation calculator** — requires dated CPI series; same staleness/invented-facts liability. Skip.
- **DO-NOT-BUILD — Currency converter** — excluded by charter (live rates / CORS).
- **WATCHLIST — Retirement / 401k projection** — solid demand but `[C]` projection chart + assumption-heavy (returns, contribution growth); promote when we have the chart component from mortgage.
- **WATCHLIST — Rent-vs-buy** — feasibility low (many assumptions, opinionated model); easy to get "wrong" and hard to keep honest.
- **REJECT — Love / age-difference** — fun, low value, off-brand.
- **REJECT — Water intake, target heart rate, running pace** — thin and/or incumbent-owned (McMillan/Strava for pace); no durable driver. Target-heart-rate and pace already on the INDEX watchlist at 15/25; no change.

## Blog / SEO angles (strongest new calculators)

1. **"BMR vs TDEE: how many calories should you actually eat?"** — anchors the TDEE tool; explains Mifflin-St Jeor, activity multipliers, and why the deficit is a % of TDEE not a flat number. Cite AJCN/Mifflin-St Jeor accuracy.
2. **"Why your first mortgage payments are almost all interest"** — anchors the mortgage/amortization tool; use the schedule to show the principal/interest crossover, and the effect of one extra payment a year (cross-links the loan-payoff tool).
3. **"Markup vs margin: the pricing mistake that quietly eats your profit"** — anchors the margin tool for the small-business audience; the 40%-margin = 66.7%-markup worked example; when to use which.

## Lane notes

- **Competitor review:** calculator.net catalog confirmed comprehensive (mortgage, auto loan, amortization, retirement/401k, sales tax, income tax, inflation, BMR, TDEE, body-fat, ideal-weight, pregnancy, fuel-cost) but ad-heavy/dated and no working-shown/export; omnicalculator strong UX + breadth (3700+); bankrate/nerdwallet finance-only. Gap is UX/ad-free/SEO-long-tail, not client-side novelty — incumbents already run in-browser.
- **Demand signals:** TDEE/BMR/calorie, mortgage, pregnancy due date, GPA, fuel cost, sales tax, margin/markup all confirmed as high-volume, multi-incumbent categories via search (many dedicated single-purpose domains exist = proven demand).
- **Maintenance-risk scan:** flagged income-tax/take-home and inflation/CPI as data-staleness traps (DO-NOT-BUILD); sales-tax made safe by rate-as-input; everything else on the build list is formula-only, zero-maintenance.
- **Overlap/spam-gate scan:** salary-converter folds into hourly-to-salary; BMR into TDEE; CD into compound-interest; fuel-economy into fuel-cost/units. Distinct-query discipline preserved for the 12 builds.

## Sources

- https://www.calculator.net/financial-calculator.html
- https://www.calculator.net/sitemap.html
- https://www.calculator.net/tdee-calculator.html
- https://www.calculator.net/bmr-calculator.html
- https://www.calculator.net/sales-tax-calculator.html
- https://www.calculator.net/fuel-cost-calculator.html
- https://www.calculator.net/pregnancy-calculator.html
- https://www.calculator.net/fitness-and-health-calculator.html
- https://www.omnicalculator.com/finance
- https://www.omnicalculator.com/finance/margin-2-sets
- https://www.bankrate.com/calculators/
- https://www.nerdwallet.com/finance/calculators
- https://www.inchcalculator.com/mifflin-st-jeor-calculator/
- https://legionathletics.com/tdee-calculator/
- https://smallbusinesscalculators.com/
- https://www.margin-calculator.net/
