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

## What's live — 39 categories, 720+ tools, ~880 pages

| Category | Highlights |
|---|---|
| [Unit Converters](https://lazytools.io/units/) | **17 quantities** — length, weight, temperature, volume, area, speed, time, data storage, pressure, energy, power, **data-transfer-rate** (Mbps↔MB/s), **frequency** (Hz/RPM/rad·s), **torque** (N·m↔lbf·ft), **force** (N/lbf/kgf), **density**, **volumetric flow-rate** (L/min↔GPM) — exact NIST/BIPM factors (audited by verify-factors.ts), per-pair editorial notes |
| [Calculators](https://lazytools.io/calc/) | **24 tools** — percentage, EMI, BMI, age, tip, discount, interest, mortgage, sales tax, fuel cost, GPA, **test grade (EZ grader)**, **unit price** (price-per-unit comparison), **overtime pay**… |
| [Finance](https://lazytools.io/finance/) | **22 tools** — **NPV & IRR** (discounted cash flow, bisection IRR), **debt-to-income (DTI)** (front/back-end + lender bands), **inflation** (real value + purchasing-power loss), **compound interest** (FV with regular contributions + growth chart), **debt payoff** (snowball vs avalanche, month-by-month, payoff-order table), **savings goal**, **loan payoff** (amortization + extra-payment savings), **credit-card payoff** (time or payment), **CAGR**, **ROI** (+ annualized), **rule of 72**, **break-even units**, **APR↔APY**, plus **6 financial-ratio calculators** — **liquidity** (current/quick/cash/working capital), **leverage** (D/E, debt ratio, equity multiplier), **coverage** (interest coverage/TIE, DSCR, fixed-charge), **profitability** (gross/operating/net margin, ROA, ROE), **efficiency** (turnover, DSO/DPO, cash conversion cycle), **valuation** (P/E, P/B, P/S, dividend yield/payout, EV/EBITDA) — **each result interpreted in plain business terms** with healthy/caution/concern or compare-to-peers; benchmarks research-verified (CFI/Investopedia/lender norms) — plus **home affordability** (28/36 DTI rule), **retirement/FIRE** (projection + 4% rule) and **50/30/20 budget** — exact, private, educational (not advice); no live rates |
| [Mathematics](https://lazytools.io/math/) | **30 tools, exact arithmetic** — fractions with steps, primes (Miller–Rabin), quadratics with radical roots, statistics, Roman numerals, nCr/nPr at BigInt scale, **triangle solver** (law of sines/cosines, ambiguous SSA), **matrix calculator** (det/inverse/multiply), **logarithm** (any base + antilog) |
| [Biology & Lab](https://lazytools.io/biology/) | **16 tools** — DNA reverse-complement/translate (sequence never uploaded), **restriction-enzyme digest** (26 enzymes, fragment sizes, linear/circular), **protein pI & net charge** (titration curve), C₁V₁=C₂V₂ dilution + serial planner, Punnett (mono/di/trihybrid), Hardy–Weinberg + χ², GC/Tm, DNA & protein molecular weight, molarity, hemocytometer, Michaelis–Menten, qPCR efficiency, doubling time |
| [Chemistry & Lab](https://lazytools.io/chemistry/) | **40 tools** — **titration** (unknown conc. from equivalence point), **Raoult's law** (vapour-pressure lowering), **molality** (mol/kg), **mass percent** (w/w), **osmotic pressure** (π=iMRT), **interactive periodic table** (all 118 elements, click for full details, colour by category/phase/block/electronegativity, full-screen), **electron configuration**, **element comparison**, **oxidation-number solver**, **average atomic mass**, **molar mass / molecular weight** (parses hydrates like CuSO₄·5H₂O + nested groups) with percent composition, **chemical equation balancer** (exact integer coefficients via BigInt null-space — correct on redox), **stoichiometry** (limiting reagent + theoretical yield), **empirical/molecular formula**, **mole ↔ grams ↔ particles**, **molarity**, **dilution** (C₁V₁=C₂V₂), **percent yield**, **density**, **ideal / combined gas law**, **specific heat**, **pH**, **weak-acid/base pH** (exact ICE quadratic from Ka/Kb), **Ksp ↔ molar solubility** (+ common-ion effect), **equilibrium constant Kc** (ICE solver + reaction quotient), **Hess's law** (ΔH°rxn from formation enthalpies), **Henderson–Hasselbalch**, **Beer–Lambert**, **half-life**, **Gibbs free energy**, **Nernst**, **Arrhenius**, **freezing-point depression / boiling-point elevation**, **ppm**, **percent error** |
| [Statistics](https://lazytools.io/statistics/) | **11 tools** — **normal distribution** (z↔p, shaded bell curve via exact erf), **binomial probability** (BigInt-exact coefficients), **confidence intervals** (mean z/t + proportion), **sample size**, **p-value** (z/t/χ²/F, one/two-tailed), **linear regression & correlation** (least-squares + scatter plot, r, r²), **t-test** (one-sample/two-sample Welch or pooled/paired, exact p + significance verdict), **Poisson distribution** (P(X=k)/cumulative, mean=variance=λ), **chi-square test** (goodness-of-fit + independence, expected counts) |
| [Physics](https://lazytools.io/physics/) | **39 tools** — **terminal velocity** (√(2mg/ρACd)), **magnetic force** (Lorentz qvB / wire BIL), **pressure** (P=F/A), **buoyancy** (Archimedes, float/sink), **escape velocity** (√(2GM/r), Solar-System presets), **latent heat** (Q=mL), **SUVAT kinematic-equations solver** (enter any 3 of u/v/a/s/t), **projectile motion** with trajectory graph, free fall, **Newton's 2nd law**, momentum, **1D collisions** (elastic/inelastic + restitution), friction, **kinetic/potential energy**, work, power, Hooke's law, **centripetal force**, **Newton's gravitation**, **Coulomb's law**, **wave speed** (v=fλ), **standing-wave harmonics** (string/open/closed pipe), **Snell's law** (critical angle + TIR), **Ohm's-law V/I/R/P wheel**, **series/parallel resistors & capacitors**, **wave/SHM visualizer**, **Doppler effect**, **lens & mirror equation**, **torque**, **orbital velocity**, **Carnot efficiency**, **thermal expansion**, **photon energy** (E=hf), **de Broglie**, **special relativity** (Lorentz γ, time dilation, length contraction), **E=mc²** |
| [Size Converters](https://lazytools.io/size/) | ring, shoe, bra, clothing, hat sizes across systems |
| [Home & DIY](https://lazytools.io/home/) | **15 tools** — **stair calculator** (rise/run/stringer + IRC limits), **wall stud calculator** (16/24″ OC + plates), **BTU / AC sizing** (ENERGY STAR), — **paint**, **tile & flooring**, **concrete** (+ pre-mix bags), **mulch & soil**, **wallpaper**, **gravel & aggregate** (volume + tonnes), **drywall/plasterboard** (sheets), **roofing** (squares + shingle bundles via pitch), **sod & grass seed**, **fence** (posts/panels/rails), **deck boards**, **board-foot** lumber — metric or imperial |
| [Electronics & Circuits](https://lazytools.io/electronics/) | **13 tools** — **resistor color code** (4/5/6-band, live visual resistor, IEC 60062), **SMD resistor code** (3/4-digit, EIA-96, R-notation, 0-ohm), **LED resistor** (series R + nearest E12 + power), **voltage divider**, **capacitor code** (104 → 100 nF), **wire gauge** (AWG diameter/area/resistance/ampacity), **RC time constant** & −3 dB cutoff, **LC resonant frequency** (tank + √(L/C)), **555 timer** (astable/monostable), **battery life** — standard formulas + IEC/AWG/EIA data, Node-tested |
| [Photography](https://lazytools.io/photography/) | **10 tools** — **depth of field** (near/far limits by sensor+lens+aperture), **field of view** (angle + frame size), **crop factor** (equivalent focal length/aperture), **exposure value** (EV + equivalent exposures), **hyperfocal distance**, **time-lapse** planner, **print size/DPI**, **Sunny 16** exposure — standard optics formulas, verified sensor data, Node-tested vs DOFMaster |
| [Travel & Trips](https://lazytools.io/travel/) | **8 tools** — **flight distance** (great-circle via haversine, distance/bearing/rough time on a live world map), **flight time** (distance ÷ cruise + overhead), **layover & connection** checker (vs typical minimum connection time), **jet lag** (days to adjust, east vs west), **tip-by-country** (customary rates for 14 countries + bill split), **road-trip time** (distance/speed/breaks → arrival), **travel budget** (per-day/per-person split), **luggage size** (litres + linear vs cabin/checked limits) — exact geometry, research-verified real-world data with caveats, Node-tested |
| [3D Printing](https://lazytools.io/3d-printing/) | **8 tools** — **filament weight & length** (cylinder geometry × density, 1kg PLA ≈ 335 m), **filament cost** (grams → price), **print electricity cost** (W × time × rate), **model scale** (linear vs cube-rule volume, + fit-to-bed), **E-steps** calibration (100 mm test), **flow / extrusion multiplier** (single-wall method), **volumetric flow** (mm³/s vs hotend limit), **resin cost** (mL + waste) — exact geometry + standard calibration formulas, cited densities (Simplify3D/Prusa/Formlabs), Node-tested |
| [Solar & Energy](https://lazytools.io/solar/) | **10 tools** — **solar panel output** (kWh/day/month/year from peak sun hours × derate), **off-grid load** (editable appliance table → daily Wh), **battery bank sizing** (Ah from load, autonomy, DoD, voltage), **inverter size** (running + surge), **appliance energy cost** (W × h × rate), **solar payback** (net cost ÷ savings), **DC voltage drop** (2·L·I·ρ/A vs NEC 3% / solar 2%), **battery charge time** (Ah/A + C-rate) — industry-standard formulas, values verified vs NREL/PVWatts + battery refs, Node-tested |
| [Homebrewing](https://lazytools.io/brewing/) | **8 tools** — **ABV** ((OG−FG)×131.25 + Hall's accurate formula, attenuation, calories), **IBU** (Tinseth model, editable hop-additions table), **priming sugar** (CO₂ stoichiometry, bottle carbonation), **Brix↔SG**, **hydrometer temperature correction**, **strike water** (Palmer, metric/imperial), **gravity dilution**, **refractometer FG** (Sean Terrill cubic + WCF) — established brewing formulas verified vs Palmer/Tinseth/Terrill, Node-tested |
| [Astronomy & Space](https://lazytools.io/astronomy/) | **13 tools** — **moon phase** (synodic-month, phase/illumination/age), **sunrise & sunset** (NOAA solar algorithm, ±1 min), **golden hour & blue hour** (twilight windows by sun-elevation, reuses the NOAA solar algo), **weight on other planets** (NASA gravity ratios), **age on other planets** (orbital periods), **light travel time** (km↔AU↔ly↔parsec), **angular size** (small-angle), **star magnitude & distance** (distance modulus, Pogson brightness), **telescope** optics (magnification/f-ratio/Dawes/Rayleigh), **stellar parallax** (parsecs↔ly), **redshift** (z↔velocity, wavelength shift, Hubble distance, relativistic) — sourced constants, Node-tested vs NASA/NOAA |
| [Weather & Atmosphere](https://lazytools.io/weather/) | **15 tools** — **density altitude** (aviation, pressure alt + temp), **snow load** (roof, lb/ft²/kPa), **absolute humidity** (g/m³, Magnus), **VPD** (vapour pressure deficit, kPa, grow-stage zones), **rainwater collection** (roof harvest, L/gal), **heat index** (NWS Rothfusz, temp+humidity→feels-like + risk), **wind chill** (2001 NWS + frostbite times), **dew point** (Magnus/Alduchov–Eskridge), **relative humidity** (from temp+dew point), **feels-like** (heat index/wind chill by regime), **wet-bulb** (Stull 2011, 35°C survival limit), **Beaufort scale** (0–12), **cloud base** (dew-point-spread rule) — °C/°F, verified against NWS values, Node-tested |
| [Music & Audio](https://lazytools.io/music/) | **11 tools** — **note frequency** (note↔Hz↔MIDI, equal temperament, adjustable A=432), **chord & scale finder** (build from a root or identify from notes, piano diagram), **BPM→delay time** (straight/dotted/triplet + Hz), **tap tempo** BPM counter, **online metronome** (sample-accurate Web Audio, accented downbeat), **interval calculator** (semitones/cents/ratio), **chord transposer** (+capo), **audio file size** (PCM), **bar/time-signature** duration — exact music maths, Node-tested |
| [Gardening & Plants](https://lazytools.io/garden/) | **11 tools** — **growing degree days (GDD)**, **pond volume & liner**, **spray/pesticide mix** (oz-gal / mL-L), — **plant spacing** (square grid + triangular offset which fits ~15.5% more), **seed & row spacing**, **raised-bed soil** volume (L/ft³/yd³/bags), **fertilizer** nitrogen rate (from N-P-K + area), **garden watering** (~1 in/wk, 0.623 gal/ft²/in), **planting dates** from your last frost (16 crops), **grow-light DLI** (PPFD × hours), **compost C:N** ratio (greens + browns → 25–35:1) — metric/imperial, extension-sourced, Node-tested |
| [Pets & Animals](https://lazytools.io/pets/) | **9 tools** — **dog age** (dog↔human years via the 2020 epigenetic formula 16×ln(age)+31 + size-based chart — busts the ×7 myth), **cat age** (15/+9/+4 chart + life stage), **dog & cat food** portions (RER 70×kg^0.75 × MER life-stage factor → cups), **pet gestation** due dates (13 species), **aquarium volume** (L/US-gal/UK-gal), **pet water intake** (~50–60 ml/kg), **dog crate size** (AKC +2–4 in) — vet-sourced formulas, Node-tested |
| [Fitness & Exercise](https://lazytools.io/fitness/) | **10 tools** — **running pace** (pace/time/distance, min/km + min/mile, race presets), **pace converter** (min/km ↔ min/mile ↔ km/h ↔ mph), **one-rep max** (Epley/Brzycki/Lombardi + %-of-1RM table), **heart-rate zones** (Tanaka/Karvonen/Gulati), **race time predictor** (Riegel), **VO2 max** (Cooper test), **calories burned** (ACSM MET, Compendium values), **steps → distance** — sourced formulas, Node-tested |
| [Automotive](https://lazytools.io/automotive/) | **13 tools** — **EV charging time** (battery/SoC/charger kW), **power-to-weight** (hp/tonne, W/kg), **stopping distance** (reaction + v²/2μg, grip presets), **tire size calculator** (decode 225/45R17 → overall diameter, sidewall, circumference, revs/mile), **tire comparison & speedometer error** (true speed = indicated × new/old diameter), **gear ratio & RPM** (road speed ↔ engine RPM via gear × final drive × tire), **engine displacement** (π⁄4 × bore² × stroke × cylinders → L/cc/ci), **compression ratio**, **horsepower ↔ torque** (HP = T×RPM/5252 + kW/N·m), **fuel economy** (US↔UK MPG↔L/100km↔km/L, handles the different gallons), **wheel offset ↔ backspacing** — exact geometry, Node-tested |
| [Cooking & Kitchen](https://lazytools.io/cooking/) | **13 tools** — **brine calculator** (salt % by weight), **air-fryer conversion** (−25°F, −20% time), **roast cooking time** (min/lb by cut + USDA temps), — **grams ↔ cups** (ingredient-aware: flour 120 g, sugar 198 g, honey 336 g per cup — King Arthur weights), **cooking measurement converter** (US/metric/imperial volume, exact NIST factors, flags US-vs-imperial gallon & 20 mL Australian tbsp), **butter** (sticks↔cups↔grams), **oven temperature** (°F↔°C↔gas mark + fan, snapped to the standard cooking table), **recipe scaler** (fractions), **baking pan** size (by area), **baker's percentage / hydration**, **yeast** (active dry↔instant↔fresh), **coffee-to-water ratio**, **USDA meat temperatures** — sourced, private |
| [Text Tools](https://lazytools.io/text/) | **26 tools** — **number to words** (+ cheque "amount in words"), **upside-down text** generator, **random line picker** (raffle/winner, crypto-random), — "the invisible & exact layer of text": **invisible-character detector** (AI-watermark / zero-width), **homoglyph/lookalike detector**, **text diff** (LCS), **readability** (Flesch/FK/Fog/SMOG/CLI/ARI), **Unicode inspector**, word frequency, text cleaner (em-dash/smart-quote), Unicode normalizer, plus counters, case, sort, dedupe, find & replace |
| [Color Tools](https://lazytools.io/color/) | HEX/RGB/HSL/CMYK, **HSV/HSB converter**, **Delta-E** (CIEDE2000 + CIE76 color difference), **Kelvin→RGB** (color temperature), **OKLCH/OKLAB/LAB converter** (CSS Color 4 + gamut-mapped HEX fallback), WCAG contrast + **accessible-color fixer**, **APCA (WCAG 3) checker**, **contrast grid**, **color-blindness simulator** (Machado 2009, image + palette), **harmony generator**, **image color picker + palette extractor** (median-cut, EyeDropper API), **nearest color-name finder** (CIEDE2000), **Tailwind OKLCH scale generator**, **brand color finder (1,100+ palettes)** |
| [File & Data](https://lazytools.io/file/) | CSV/JSON/XML/YAML, Markdown, **e-invoicing viewers: Factur-X (FR), KSeF FA(3) (PL), Peppol BIS (BE), XRechnung/ZUGFeRD (DE)** |
| [Developer Tools](https://lazytools.io/dev/) | Base64, hashes, JWT, regex, **LLM token counter (exact o200k)**, **Ethereum unit converter** (BigInt-exact wei⇄ether), **Keccak-256/SHA-3 + function selector**, **EIP-55 address checksum** |
| [Network & IT](https://lazytools.io/network/) | IPv4/IPv6 subnet calculators (exact 128-bit), CIDR, chmod, cron parser, MAC/EUI-64, **download-time & bandwidth (Mbps↔MB/s) converters** |
| [Generators](https://lazytools.io/generate/) | **15 tools** — **dice roller & coin flip** (crypto-random), **MAC address** generator, **test credit-card** numbers (Luhn-valid, clearly test-only), password, **passphrase (EFF diceware)**, **UUID v4/v7 · ULID · NanoID + decoder**, QR, **WiFi/vCard/email QR**, **barcode (EAN/UPC/Code128, check-digit)**, random number, lorem ipsum |
| [Date & Time](https://lazytools.io/time/) | timestamps, date math, DST-aware timezone pairs |
| [Calendars](https://lazytools.io/calendar/) | Hijri/Hebrew/Persian/Julian, **Nepali BS⇄AD**, 4-5-4 retail |
| [Codes & Ciphers](https://lazytools.io/cipher/) | Morse (with audio), NATO, binary, Caesar, Vigenère |
| [Productivity](https://lazytools.io/productivity/) | Pomodoro, Kanban, mind map, **interactive Gantt** (drag bars to reschedule/resize, zoom, full-screen), habit tracker — saved locally, JSON export |
| [Privacy & Security](https://lazytools.io/security/) | EXIF remover, AES-256 file encryption, file hash, **PII redactor** (mask emails/phones/SSNs/cards[Luhn]/IPs/IBANs in text before pasting into AI — 100% client-side) |
| [Image Tools](https://lazytools.io/image/) | compress, convert, resize, **HEIC→JPG** (libheif wasm) |
| [Photo Size Maker](https://lazytools.io/photo/) | **passport / visa / ID photos** for multiple countries — crop to exact official size, **on-device face-position check (MediaPipe BlazeFace)**, background & exposure checks, DPI-correct export; every spec cited + date-verified |
| [PDF Tools](https://lazytools.io/pdf/) | merge/split/rotate **with live page previews**, JPG↔PDF (**PDF→JPG/PNG** rendered in-browser via pdf.js, + **images→PDF**), unlock/protect (qpdf wasm), **accessibility checker (EAA)**, **redaction checker + rasterizing redactor** |
| [Audio](https://lazytools.io/video/) | trim, speed, volume, WAV convert (Web Audio) |

Plus **72 in-depth guides** on the [blog](https://lazytools.io/blog/) — each with custom infographics,
FAQ schema and cited sources — and a research-driven build pipeline (see
[docs/research/](docs/research/)) that has shipped regulatory-deadline tools ahead of the French,
Polish and Belgian e-invoicing mandates.

## Quick start

```bash
npm install
npm run dev      # dev server at localhost:4321
npm run build    # static site → dist/ (~810 pages)
```

## Tech & models

**Framework.** [Astro](https://astro.build) with 100% static output (`output: 'static'`), interactive
[Preact](https://preactjs.com) islands hydrated per-tool, [Tailwind CSS 4](https://tailwindcss.com) and
TypeScript throughout. Pages are generated from typed registries under [`src/data/`](src/data/), so a
new tool is a data entry plus (where needed) one island. The build is plain static files — deployable
to any host, no SSR, no serverless, no backend.

**The privacy model.** There are no processing servers. Every computation — parsing, encoding,
cryptography, image and PDF manipulation, **and machine-learning inference** — happens on the user's
device. Anything heavy is loaded lazily on first use and **self-hosted** under
[`public/vendor/`](public/vendor/) so nothing is fetched from a third-party CDN. **Tool content — the files
you open and the values you type — is never uploaded**, and that promise is architectural, not a policy.
Site *usage* is measured with **Google Analytics (GA4)** — but only after a **cookie-consent banner** (Google
Consent Mode v2; `analytics_storage` denied by default, so no cookies/data until the visitor accepts). It records
page visits and engagement (see the [privacy policy](https://lazytools.io/privacy/) and [cookie statement](https://lazytools.io/cookies/), with an [opt-out](https://lazytools.io/privacy/#optout)); it only ever sees *that a page was visited*, never the content processed on it. The other network call
after page load is an **optional star rating**: a tiny PHP endpoint ([`api/rate.php`](api/rate.php)) that
fires only when a user clicks to rate a tool and stores just the tool name, star value and a timestamp —
no IP address, no cookie, no user agent, no identifiers. (Standard host access logs apply, as with any site.)

**On-device models & engines** — what does the heavy lifting, and where:

| Engine / model | Used for | How it runs |
|---|---|---|
| **[MediaPipe](https://ai.google.dev/edge/mediapipe) BlazeFace (short-range)** | Photo Size Maker — detects the face and derives head-height %, eye line, centering and tilt for the passport/visa compliance check | Google's face-detection model (`blaze_face_short_range.tflite`, ~230 KB) + the Tasks-Vision WASM runtime, **self-hosted** at `/vendor/mediapipe/`, lazy-loaded on first "Check photo". Falls back to the native [Shape Detection API](https://developer.mozilla.org/docs/Web/API/FaceDetector), then to manual guides |
| **Canvas 2D API** | Photo crop/resize/matte + export (with JFIF **DPI patched** into the file), image compress/convert/resize, PDF page rasterizing | Native browser image codecs — decode, resample, re-encode JPEG/PNG/WebP |
| **[libheif](https://github.com/strukturag/libheif) (WASM)** | HEIC/HEIF → JPG/PNG decoding | ~1.2 MB WASM decoder, loaded only when converting |
| **[qpdf](https://qpdf.sourceforge.io/) (WASM)** | PDF unlock / password-protect | WASM build at `/vendor/qpdf.wasm` |
| **[pdf.js](https://mozilla.github.io/pdf.js/)** | PDF page previews, accessibility (tag-tree) checker, redaction text-layer extraction | Mozilla's PDF engine + its worker |
| **[gpt-tokenizer](https://github.com/niieani/gpt-tokenizer)** | LLM token counter — exact `o200k_base`/`cl100k_base` counts | Pure-JS BPE tokenizer, runs in-browser |
| **[qrcode](https://github.com/soldair/node-qrcode) + [JsBarcode](https://github.com/lindell/JsBarcode)** | QR codes (URL/WiFi/vCard/email) and 1-D barcodes (EAN/UPC/Code128) with mod-10 check digits | Client-side canvas/SVG render, PNG/SVG export |
| **Text-forensics + readability libs** | Invisible-character & homoglyph detection, exact LCS text diff, Flesch/FK/Fog/SMOG/CLI/ARI readability | Pure TS (`textscan`, `textdiff`, `readability`), Node-tested |
| **Web Crypto API** | AES-256-GCM file encryption, SHA-2 file hashing, PBKDF2 key derivation, secure password generation | Native browser cryptography |
| **Web Audio API** | Audio trim / speed / volume / WAV conversion | Native, decodes to `AudioBuffer` |
| **`Intl.DateTimeFormat` (ICU)** | World-calendar conversions (Hijri, Hebrew, Persian, Coptic, Ethiopic, Buddhist, Julian…) | The browser's bundled ICU calendar data; reverse conversion by binary search over the day number |
| **BigInt / rational arithmetic** | Exact math (primes via Miller–Rabin + Pollard rho, fractions, nCr/nPr), IPv4/IPv6 (128-bit) subnetting | Plain TypeScript, no floating-point rounding |

Self-hosting the WASM/model assets means the strict "no third-party requests" promise holds even for
the ML features — you can verify it in DevTools' network tab.

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
- **Passport-photo engine**: [`src/components/photo/PhotoMaker.tsx`](src/components/photo/PhotoMaker.tsx)
  (crop + guide overlay + DPI-correct export) with the compliance checks in
  [`src/lib/photo-checks.ts`](src/lib/photo-checks.ts) and the self-hosted MediaPipe face detector in
  [`src/lib/face-model.ts`](src/lib/face-model.ts); country specs (each source-cited) live in
  [`src/data/photo/`](src/data/photo/).

Attribution is appreciated (a link to [lazytools.io](https://lazytools.io)) but not required by the license.

## Contributing

Tool requests and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Blog posts are contributed
and editorially reviewed content — corrections and suggestions via the
[contact page](https://lazytools.io/contact/). Security reports: see [SECURITY.md](SECURITY.md).

## License & contact

[MIT](LICENSE) © 2026 [Synth88 Labs Inc.](https://synth88.com) · Contact: synth88labs@gmail.com
