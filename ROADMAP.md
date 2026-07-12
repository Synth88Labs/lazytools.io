# LazyTools.io — Public Roadmap

**Status (updated 9 Jul 2026):** LazyTools soft-launched on [lazytools.io](https://lazytools.io) on
4 July 2026, and **all 18 tool categories are now live** — well ahead of the original three-week
plan. We build in the open with weekly Friday releases; the official **v1.0.0 public launch** is
targeted for **~25 July 2026** once the remaining launch-week items (search-console verification and
the legal review) are cleared.

## Shipped ✅

**Foundations** — Astro SSG + Preact islands, privacy-first client-side architecture, anonymous
ratings (PHP + SQLite), smart header search, sitemap, auto-generated `llms.txt`, GitHub Actions →
Namecheap FTPS deploy pipeline.

**All 32 categories live** (~706 pages, 590+ tools):

| Category | Highlights |
|---|---|
| Unit Converters | 100+ pairs across 11 quantities, exact NIST/BIPM factors |
| Calculators | percentage, EMI, tip, discount, interest, hourly⇄salary… + **finance**: mortgage (full amortization schedule, extra-principal payoff, CSV export), auto loan, markup vs margin, sales tax (with reverse), fuel cost · **health**: BMI, TDEE/BMR (Mifflin–St Jeor), body-fat (US Navy), ideal weight, macros, pregnancy due date · **academic**: GPA + grade-needed-on-final |
| Finance | **10 tools** — compound interest (FV = P(1+i)ⁿ + annuity contributions, with a growth chart), debt payoff (snowball smallest-balance vs avalanche highest-APR, constant-budget month-by-month simulation with freed minimums rolling to the focus debt, side-by-side interest + payoff-order table), savings goal (required monthly deposit), loan payoff (amortization PMT + extra-payment months/interest saved), credit-card payoff (time or fixed-payment modes), CAGR, ROI (+ annualized), rule of 72, break-even units, APR↔APY — Node-tested (18 assertions); educational, not advice; **no live rates/feeds**, all math in-browser |
| Mathematics | **exact arithmetic** — fraction calculator with steps, decimal⇄fraction (repeating decimals), GCD/LCM via Euclid, prime factorizer (Miller–Rabin + Pollard rho), ratio, quadratic solver with radical roots, statistics, Roman numerals, scientific notation, nCr/nPr (BigInt), long division with steps, radical simplifier, modular arithmetic (ext. Euclid + square-and-multiply), slope/line & distance/midpoint (exact), binomial expansion, significant figures, degrees⇄radians (exact π), completing the square, synthetic & polynomial division, percentile (3 named methods), divisibility rules, weighted average, exponent calculator (2^100 digit-exact), circle calculator (in terms of π), triangle area (Heron, exact radicals) — 26 tools |
| Biology & Lab | **14 tools** — DNA reverse-complement/translate (sequence never uploaded), C₁V₁=C₂V₂ dilution + serial planner, Punnett (mono/di/trihybrid), Hardy–Weinberg + χ², GC/Tm, DNA & protein molecular weight, molarity, hemocytometer, Michaelis–Menten, qPCR efficiency, OD600, doubling time, population growth — Node-tested |
| Statistics | **6 tools** — normal distribution (z↔p, shaded bell curve via exact erf), binomial probability (BigInt-exact coefficients), confidence intervals (mean z/t + proportion), sample size, p-value (z/t/χ²/F, one/two-tailed via incomplete gamma & beta), linear regression & correlation (least-squares + scatter plot, r, r²) — Node-tested |
| Physics | **29 tools** — SUVAT kinematic-equations solver (any 3 of u/v/a/s/t → the rest), projectile motion with trajectory SVG (range/height/flight/landing), free fall; Newton's 2nd law, momentum, friction; kinetic & potential energy, work (F·d·cosθ), power, Hooke's law; centripetal force; Newton's gravitation (F=Gm₁m₂/r²); wave speed (v=fλ), Snell's law + critical angle/TIR; Ohm's-law V/I/R/P wheel, series/parallel resistors & capacitors; wave/SHM visualizer (sine SVG), Doppler effect (sign-aware), lens/mirror equation (real/virtual verdict); torque, orbital velocity & period (Kepler); Carnot efficiency, thermal expansion; photon energy (E=hf), de Broglie, E=mc² — Node-tested SUVAT (15 assertions), pinned CODATA/SI constants; cross-links to /chemistry/ for q=mcΔT, PV=nRT, half-life |
| Chemistry & Lab | **31 tools** (incl. interactive periodic table, element comparison, oxidation-number solver, average atomic mass, electron config) — molar mass / molecular weight (recursive-descent formula parser: nested groups, hydrates like CuSO₄·5H₂O, greedy two-letter symbols) + percent composition; chemical equation balancer (exact rational BigInt Gaussian-elimination null-space → smallest integer coefficients, redox-correct); stoichiometry (limiting reagent + theoretical yield); empirical/molecular formula; mole↔grams↔particles; molarity; dilution; percent yield; density; ideal + combined gas law; specific heat; pH/pOH; Henderson–Hasselbalch; Beer–Lambert; half-life; **Gibbs free energy (ΔG=ΔH−TΔS); Nernst; Arrhenius (activation energy); freezing-point depression & boiling-point elevation; ppm; percent error** — Node-tested (33 assertions), IUPAC atomic weights |
| Size Converters | ring, shoe, bra, clothing, hat, kids' shoe |
| Home & DIY | **12 tools** — paint (wall area − openings × coats ÷ coverage), tile & flooring (area ÷ tile + waste %, boxes), concrete (L×W×thickness → m³/yd³ + pre-mix bags), mulch & soil (area × depth → m³/yd³/litres/bags), wallpaper (rolls from drops + pattern repeat) — metric or imperial, browser-verified |
| Weather & Atmosphere | **8 tools** — heat index (NWS Rothfusz regression, T+RH→feels-like, simple-first branching + low/high-RH adjustments, risk bands), wind chill (2001 NWS/EC WC = 35.74 + 0.6215T − 35.75V^0.16 + 0.4275T·V^0.16, frostbite times, valid ≤50°F/>3mph), dew point (Magnus/Alduchov–Eskridge a=17.625 b=243.04), relative humidity (from T+dew point), feels-like/apparent temp (heat index ≥80°F, wind chill ≤50°F), wet-bulb (Stull 2011, sea-level, valid −20–50°C/5–99%RH, 35°C survival limit), Beaufort scale (0–12 force+description, Force 12 open-ended ≥73mph), cloud base (pilot rule spread°F÷4.4×1000 ft ≈ 400 ft/°C) — °C/°F, all coefficients research-verified exact against NWS/NOAA/peer-reviewed, Node-tested (22 assertions incl. NWS reference values) |
| Music & Audio | **8 tools** — note frequency (equal temperament f = A4×2^((n−69)/12), note↔Hz↔MIDI, A4=440 ISO 16 adjustable to 432, cents-off readout), BPM→delay time (quarter = 60000/BPM ms, straight/dotted×1.5/triplet×⅔ + Hz for LFOs), tap tempo (60000/avg-interval), online metronome (sample-accurate Web Audio scheduling, adjustable tempo/time-sig, accented downbeat + visual), interval calculator (semitones = 12·log2(f2/f1), cents, ratio, interval name), chord/note transposer (shift semitones, keeps quality, capo hint), audio file size (PCM = rate×depth/8×channels×sec; CD ≈ 10 MB/min), bar/time-signature duration (bar = beats×4/denom×60/BPM) — pure musical-math identities, Node-tested (26 assertions) |
| Gardening & Plants | **8 tools** — plant spacing (square = area/spacing²; triangular offset = area/(spacing²×0.866), +15.5%), seed & row spacing (length/spacing +1, × rows), raised-bed soil volume (L×W×D → L/m³/ft³/yd³/bags), fertilizer N rate (lb product = target-lbN-per-1000ft² × area/1000 ÷ (%N/100)), garden watering (1 in over 1 ft² = 0.623 gal; 1 mm over 1 m² = 1 L; ~1 in/wk), planting dates from last spring frost (16 crops, start-indoors/transplant/direct-sow offsets), grow-light DLI (= PPFD × hrs × 3600/1e6 + targets), compost C:N (blend greens/browns → 25–35:1, Cornell values) — metric/imperial, extension-sourced (Cornell, Purdue/MSU, Penn State), research-verified, Node-tested (19 assertions) |
| Pets & Animals | **8 tools** — dog age (dog↔human years: 2020 epigenetic clock human=16×ln(age)+31 + traditional 15/+9/size-based; the ×7 rule is a myth), cat age (15, +9→24, then +4/yr + life stage), dog & cat food portions (RER = 70×kg^0.75, MER = RER × life-stage factor 1.0–3.0, → cups via label kcal/cup), pet gestation due dates (13 species: dog 63d, cat 65d, rabbit 31d, horse 340d… + normal windows), aquarium volume (L×W×H → litres/US-gal/UK-gal, −10% substrate), pet water intake (~50–60 ml/kg/day), dog crate size (AKC: dog length/height + 2–4 in) — vet-sourced (epigenetic study, AAHA/AAFP, RER/MER, Merck gestation), research-verified, Node-tested (23 assertions); not veterinary advice |
| Fitness & Exercise | **8 tools** — running pace (pace = time ÷ distance; any two → third; min/km + min/mile + speed; 5K/10K/half/marathon presets), pace converter (min/km ↔ min/mile ↔ km/h ↔ mph), one-rep max (Epley w×(1+reps/30) + Brzycki + Lombardi, averaged, %-of-1RM table), heart-rate zones (max HR via Tanaka 208−0.7·age / traditional / Gulati; 5 zones as %-max or Karvonen HR-reserve with resting HR), race time predictor (Riegel t2 = t1×(d2/d1)^1.06 across distances), VO2 max (Cooper 12-min test = (m−504.9)/44.73), calories burned (ACSM MET×3.5×kg/200, Compendium MET values), steps → distance (steps × stride ≈ 0.414×height) — published exercise-science formulas, research-verified, Node-tested (19 assertions); not medical advice |
| Automotive | **8 tools** — tire size calculator (decode metric code → overall diameter = rim + 2×sidewall, circumference, revs/mile), tire size comparison & speedometer error (true speed = indicated × new/old diameter, ±3% guidance), gear ratio & RPM (road speed ↔ engine RPM via gearbox × final-drive × tire circumference, both directions), engine displacement (π⁄4 × bore² × stroke × cylinders → L/cc/ci), compression ratio ((swept+clearance)/clearance), horsepower ↔ torque (HP = T×RPM/5252, + kW/N·m), fuel economy (US MPG ↔ UK MPG ↔ L/100km ↔ km/L via exact US 3.785 L / imperial 4.546 L gallons), wheel offset ↔ backspacing — all exact geometry/definitional, Node-tested (23 assertions) |
| Cooking & Kitchen | **10 tools** — grams↔cups ingredient-aware converter (King Arthur weights: flour 120 g, sugar 198 g, honey 336 g/cup + 24 more), cooking measurement converter (US/metric/imperial volume via exact NIST factors, flags US-vs-imperial gallon & 20 mL AU tbsp), butter (sticks↔cups↔g, 1 stick=113 g), oven temperature (°F↔°C↔UK gas mark + fan −20 °C, snapped to the conventional cooking table not raw maths), recipe scaler (servings/multiplier, fraction-aware), baking pan size converter (by floor area), baker's percentage/hydration, yeast (active dry↔instant 1:1↔fresh ×2.5, Red Star/King Arthur), coffee-to-water ratio, USDA meat safe-temp guide (FoodSafety.gov + steak doneness) — research-verified sources, Node-tested (25 assertions) |
| Photo Size Maker | **passport/visa/ID photos for 57 countries** — crop to exact official size, **on-device ML face check** (MediaPipe BlazeFace), background/exposure checks, DPI-correct export; every spec cited + date-verified |
| Text Tools | **19 tools** — "the invisible & exact layer of text": **invisible-character detector** (AI-watermark/zero-width), **homoglyph detector**, **text diff** (LCS), **readability** (Flesch/FK/Fog/SMOG/CLI/ARI), **Unicode inspector**, word frequency, text cleaner, Unicode normalizer, fancy-text decoder, strip-HTML, line tools, plus counters/case/sort/dedupe/find-replace |
| Color Tools | **26 tools** — HEX/RGB/HSL/CMYK, **OKLCH/OKLAB/LAB/LCH/HWB converter** (CSS Color 4, exact Ottosson matrices, gamut-mapped HEX fallback), WCAG contrast + **accessible-color fixer**, **APCA/WCAG-3 checker** (pinned 0.1.9), **contrast grid**, **color-blindness simulator** (Machado 2009, image + palette, on-device), **harmony generator**, **image color picker + palette extractor** (median-cut, EyeDropper API), **nearest color-name finder** (CIEDE2000), **Tailwind OKLCH scale generator**, shades, gradient, mixer, **brand color finder** (1,100+ palettes) |
| File & Data | CSV/JSON/XML/YAML, Markdown, JSON formatter, **e-invoicing cluster**: EN 16931 viewer + Factur-X (France) + **KSeF FA(3) viewer & pre-checker** (Poland) + Peppol BIS (Belgium) |
| Developer Tools | Base64, URL/HTML entities, SHA hashes, JWT, regex, number base, **LLM token counter & cost calculator** (exact o200k counts in-browser, dated pricing) |
| Generators | **12 tools** — password, **passphrase (EFF diceware)**, **UUID v4/v7 · ULID · NanoID + decoder**, QR, **WiFi/vCard/email QR** (encoded directly, no tracking redirect), **barcode** (EAN/UPC/Code128, mod-10 check digit), random number, lorem ipsum |
| Date & Time | timestamp, age, date-diff/add, ISO week, timezone converter, **19 timezone-pair pages** |
| Calendars | **multi-calendar converter** (Hijri/Hebrew/Persian/Indian/Julian…), Hijri, Persian, Hebrew & Julian converters, **Nepali BS⇄AD**, 4-5-4/4-4-5/5-4-4 retail calendar, leap-year checker |
| Codes & Ciphers | Morse (with audio), NATO phonetic alphabet, binary translator, Caesar, ROT13, Vigenère |
| Privacy & Security | EXIF remover, AES-256 file encryption, password strength, file hash |
| Image Tools | compressor, converter, resizer, Base64, **HEIC→JPG** (libheif wasm) |
| PDF Tools | merge, split, rotate, images→PDF — with **live page previews** (click-to-select pages, live rotation) — **unlock/protect** (qpdf wasm), **accessibility checker** (EAA), **redaction checker + rasterizing redactor** (draw boxes, flatten pages — destroy, don't cover) |
| Audio | trimmer, speed, volume, WAV converter (Web Audio) |
| Productivity | **Pomodoro timer**, countdown/stopwatch, meeting-cost meter, Eisenhower matrix, habit tracker, Kanban, mind map, Gantt, decision matrix, RICE, SWOT, pros/cons, flowchart, whiteboard, time-blocking, OKR, checklist, retro board, eye-rest — all saved locally, JSON export |
| Network & IT | **IPv4 & IPv6 subnet calculators** (exact 128-bit math), CIDR⇄range, IP format converter, IPv6 expand/compress (RFC 5952), chmod calculator, cron parser with next-run times, MAC formatter (EUI-64, link-local) |

**Content & growth engine** — 58 SEO/GEO blog guides (hero + custom SVG infographic, schema,
cited sources); a daily **market-research agent** that scans for browser-tool opportunities and
files scored findings to `docs/research/` — the Network & IT category and its IPv6 guide shipped
directly from its 7 Jul scan (IPv6 crossed 50% of Google traffic in Mar 2026).

## In progress — v1.0.0 launch week

- [x] Google Search Console + Bing Webmaster: verified + sitemap submitted ([#11](https://github.com/Synth88Labs/lazytools.io/issues/11)) — *done 9 Jul 2026*
- [x] Legal review pass: governing-law position set (no customer data held), analytics cookies disclosed honestly, [DRAFT] markers removed ([#12](https://github.com/Synth88Labs/lazytools.io/issues/12)) — *done 9 Jul 2026*
- [ ] `www.lazytools.io` SSL SAN coverage — handled by Namecheap AutoSSL
- [ ] **Release `v1.0.0` — official public launch** 🚀

## Post-launch (Aug 2026 →)

- **Quality-gated growth, not page counts.** Every new page must pass a simple gate before it
  ships: it answers a distinct user query no existing page answers, it contains real
  differentiated content (a working tool, exact data, worked examples, editorial notes — not a
  template with swapped variables), and it's human-reviewed. New pages land in small,
  demand-verified tranches tracked in Search Console (impressions/position at day 14/30/60)
  before the pattern is extended. Pages that don't earn engagement get improved or removed —
  never left thin.
- **Depth over breadth:** enrich the live pages first — per-pair editorial notes, use-case FAQs
  and worked examples on converter pages — before adding new ones.
- **Research-driven backlog:** build the highest-scoring opportunities the daily market-research
  agent surfaces (see [docs/research/INDEX.md](docs/research/INDEX.md)); already shipped from it —
  HEIC converter, PDF unlock/protect, e-invoice viewer.
- **Heavier tooling:** evaluate client-side video via ffmpeg.wasm (COOP/COEP routes) for the
  Audio & Video category.
- **Cadence:** weekly Friday releases.

---
*A [Synth88 Labs Inc.](https://synth88.com) project · MIT licensed · [lazytools.io](https://lazytools.io)*
