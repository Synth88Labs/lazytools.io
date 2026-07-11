# /physics/ Category Research — Physics Calculators — 2026-07-11

## Verdict: GO (qualified) — owner-directed ranked expansion, NOT gap-gated

`/physics/` is the natural STEM-education sibling that completes the site's most productive
vein: **/math/ → /statistics/ → /biology/ → /chemistry/ → /physics/**. It clears the house
filters the same way chemistry did, and for the same reasons:

- **Deterministic, staleness-proof formula math.** Every tool is a published equation with
  published constants (g, G, c, h, k_B, ε₀, μ₀, e, N_A). No curated data that rots — the same
  reason /chemistry/ and the SolverTool /calc/ health tools passed. Constants are CODATA/SI
  fixed values that change on decade timescales at most (the 2019 SI redefinition fixed c, h,
  e, k_B, N_A as exact).
- **Documented AI-resistance (strengthening driver).** Peer-reviewed studies show ChatGPT/GPT-4
  makes **calculation errors on 25 of 51 numerical physics problems**, scores **62.5% on
  well-specified vs 8.3% on under-specified** engineering-physics problems, gets **~48% on
  trajectory-motion + friction/incline** problems, and has **persistent failures manipulating
  square roots** — which appear in nearly every kinematics/energy equation (v = √(2gh),
  t = √(2h/g), v² = u² + 2as). A deterministic solver that shows the rearrangement is exactly
  what a distrusted-arithmetic chatbot can't reliably replace. Frontiers 2023; arXiv 2301.12127.
- **Perennial, structural demand.** AP Physics 1/2/C, GCSE/IGCSE/A-Level, IB, NEET/JEE, and
  intro college physics generate constant, non-fad search for the standard syllabus. This is
  evergreen education, not an API/format trend — durability is structural, not driver-fragile.
- **Cheap to build.** ~70% of the syllabus is single-equation "solve-for-X," which the existing
  generic **SolverTool** ([S]) renders for near-zero cost. A handful of **[C]** custom islands
  (trajectory SVG, Ohm's-law wheel, wave/Doppler visualizer, resistor-network rows) carry the
  flagship differentiation.

**Competition posture (same as /chemistry/, /calc/, /color/):** the gap is structurally **2–3**
across the whole category. Omni/CalcTool, Pearson's physics-calculator "channel" (now with
step-by-step + mini-charts — the same competitor-research expansion signal we saw in chemistry),
calculator-online.net, physicsclassroom, amesweb, voovers, PlanetCalc, physicscatalyst, and
dedicated single-topic sites (resistancecalculator.online, 8gwifi Ohm's-law solver,
allaboutcircuits, resistorcolorcodes.org) already run client-side. **"We don't upload" wins
nothing here.** Therefore run this as an **owner-directed ranked build list** (identical posture
to /calc/, /biology/, /generate/, /web3/, /color/, /chemistry/), NOT a gap gate. The edge is:
exact working shown + clean single-purpose ad-free SEO pages + honest sign-convention/unit
handling + cross-links to /units/, /chemistry/, /math/.

**Do NOT rebuild what exists.** q = mcΔT (specific heat), PV = nRT (ideal gas), ρ = m/V
(density), and radioactive half-life N = N₀(½)^(t/t½) are **already live in /chemistry/** —
cross-link, do not duplicate. Force/energy/power/pressure/frequency **unit conversions** belong
in **/units/** (already has energy, power, pressure, speed). See FOLD list.

---

## Scoring rubric

x/25 across **demand · competition-gap · durability · on-brand-differentiation · build-cost**
(5 = cheapest to build). Tags: **[S]** = declarative SolverTool (fields → solve-for-X);
**[C]** = custom island (SVG/visual/repeatable-rows); **[C-lite]** = small custom component
(sign-convention logic, multi-equation picker) but not a full visual.

Because gap is a structural 2–3 everywhere, per the owner-directed posture these are ranked to
build, not gated on gap. Shared cores to build once: **`constants.ts`** (CODATA g/G/c/h/k_B/
ε₀/μ₀/e/N_A with SI variants) and the **trajectory/wave SVG** components for the flagships.

---

## Ranked build list

### Kinematics (SUVAT · projectile · free fall)

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 1 | **SUVAT / kinematic equations solver** · `kinematic-equations-calculator` | [C-lite] | **20** | LEAD. Enter any 3 of {u, v, a, s, t}; picks the right pair of the five SUVAT equations and solves the other two. v = u+at; s = ut+½at²; v² = u²+2as; s = ½(u+v)t; s = vt−½at². AI-resistant: the √ in v² = u²+2as is exactly ChatGPT's documented weak spot. Shows which equation was used. Demand 5 · gap 3 · dur 4 · diff 4 · build 4 |
| 2 | **Projectile motion calculator** · `projectile-motion-calculator` | **[C] FLAGSHIP** | **19** | Trajectory SVG (parabola, apex, range markers). Inputs u, θ, h₀, g → range R = u²sin2θ/g (h₀=0), max height H = u²sin²θ/(2g), time of flight, vₓ/v_y components, landing speed/angle. No air resistance (stated). The visual + multi-output is the differentiator vs bare formulas. Demand 5 · gap 3 · dur 4 · diff 4 · build 2 |
| 3 | **Free fall calculator** · `free-fall-calculator` | [S] | **18** | v = gt, h = ½gt², v = √(2gh); solve for any of h/t/v with g selectable (Earth 9.80665, Moon, Mars as stable constants). Distinct "drop height / time / impact speed" intent. Demand 4 · gap 2 · dur 4 · diff 3 · build 5 |
| 4 | **Average velocity / acceleration calculator** · `average-velocity-calculator` | [S] | **17** | v_avg = Δx/Δt; a = Δv/Δt. Cheap, high intent. Watch for cannibalising SUVAT — differentiate on "average vs instantaneous" framing. Demand 4 · gap 2 · dur 4 · diff 3 · build 5 |

### Dynamics (Newton · friction · momentum/impulse)

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 5 | **Newton's second law (F = ma)** · `newtons-second-law-calculator` | [S] | **18** | Solve F/m/a. Anchors the dynamics cluster; FOLD weight W = mg as a mode. Demand 4 · gap 2 · dur 4 · diff 3 · build 5 |
| 6 | **Momentum & impulse calculator** · `momentum-calculator` | [S] | **18** | p = mv; impulse J = FΔt = Δp = m(v−u). Solve any variable; two tabs (momentum / impulse). Demand 4 · gap 3 · dur 4 · diff 3 · build 4 |
| 7 | **Friction calculator (f = μN)** · `friction-calculator` | [S] | **18** | f = μN; N = mg (flat) or mg·cosθ (incline mode). Static vs kinetic μ user-supplied (no rotting coefficient table). Demand 4 · gap 3 · dur 4 · diff 3 · build 4 |

### Energy · Work · Power

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 8 | **Kinetic energy calculator (KE = ½mv²)** · `kinetic-energy-calculator` | [S] | **18** | Solve KE/m/v; v = √(2·KE/m) (the √ AI-resistance angle again). Demand 4 · gap 2 · dur 4 · diff 3 · build 5 |
| 9 | **Potential energy calculator (PE = mgh)** · `gravitational-potential-energy-calculator` | [S] | **18** | Solve PE/m/h with selectable g. Demand 4 · gap 2 · dur 4 · diff 3 · build 5 |
| 10 | **Work calculator (W = Fd·cosθ)** · `work-calculator` | [S] | **17** | Angle term is where students/chatbots slip; show cosθ factor explicitly. Demand 4 · gap 2 · dur 4 · diff 3 · build 4 |
| 11 | **Power calculator (P = W/t, P = Fv)** · `power-calculator` | [S] | **18** | Two modes: work/time and force×velocity. Cross-link /units/ watts↔hp. Demand 4 · gap 2 · dur 4 · diff 3 · build 5 |
| 12 | **Hooke's law / spring calculator** · `hookes-law-calculator` | [S] | **18** | F = kx and elastic PE = ½kx²; solve k/x/F/energy. Good gap (fewer clean dedicated pages). Demand 3 · gap 3 · dur 4 · diff 3 · build 5 |

### Circular & Rotational

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 13 | **Centripetal force & acceleration** · `centripetal-force-calculator` | [S] | **18** | a_c = v²/r (= ω²r); F_c = mv²/r. Solve any variable; ω/v toggle. Demand 4 · gap 3 · dur 4 · diff 3 · build 4 |
| 14 | **Torque calculator (τ = rF·sinθ)** · `torque-calculator` | [S] | **17** | sinθ lever-arm factor shown. Angular-motion cluster anchor. Demand 3 · gap 3 · dur 4 · diff 3 · build 4 |
| 15 | **Angular velocity / rotational motion** · `angular-velocity-calculator` | [S] | **16** | ω = 2π/T = 2πf = v/r; rotational KE = ½Iω². Slightly thin/fragmented SEO; bundle carefully. Demand 3 · gap 3 · dur 4 · diff 2 · build 4 → WATCHLIST |

### Gravitation

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 16 | **Newton's law of gravitation** · `gravitational-force-calculator` | [S] | **19** | F = G·m₁m₂/r²; G = 6.67430×10⁻¹¹ (CODATA, fixed). Solve any variable. High demand, decent gap, staleness-proof. Demand 4 · gap 3 · dur 4 · diff 3 · build 5 |
| 17 | **Orbital velocity / period (Kepler)** · `orbital-velocity-calculator` | [S] | **17** | v = √(GM/r); T = 2π√(r³/GM). M user-supplied or Earth/Sun as stable constants. Demand 3 · gap 3 · dur 4 · diff 3 · build 4 |

### Waves & Sound

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 18 | **Wave speed / frequency / wavelength (v = fλ)** · `wavelength-calculator` | [S] | **19** | Solve v/f/λ; FOLD period T = 1/f and speed-of-light preset for EM waves. Highest-demand wave page. Demand 4 · gap 3 · dur 4 · diff 3 · build 5 |
| 19 | **Doppler effect calculator** · `doppler-effect-calculator` | [C-lite] | **18** | f' = f·(v ± v_observer)/(v ∓ v_source). The **sign convention** is precisely what students and LLMs botch — a UI that picks approaching/receding and shows the signed formula is the differentiator + AI-resistance. Demand 4 · gap 3 · dur 4 · diff 4 · build 3 |
| 20 | **Wave / simple-harmonic-motion visualizer** · `wave-calculator` | **[C] FLAGSHIP** | **18** | Animated/plotted sine y = A·sin(2π(x/λ − ft)); reads out A, λ, f, T, ω, v, k. Zero-friction visual beats prompting; strong repeat-workflow. Also SHM pendulum/spring period T = 2π√(L/g), T = 2π√(m/k) as a tab. Demand 4 · gap 3 · dur 4 · diff 4 · build 2 |

### Optics

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 21 | **Lens / mirror equation calculator** · `lens-mirror-equation-calculator` | [S] | **19** | 1/f = 1/d_o + 1/d_i; magnification m = −d_i/d_o = h_i/h_o. **Sign conventions** (converging/diverging, real/virtual) = AI-resistance + differentiation; report real-vs-virtual, upright-vs-inverted verdict. Demand 4 · gap 3 · dur 4 · diff 4 · build 4 |
| 22 | **Snell's law calculator** · `snells-law-calculator` | [S] | **19** | n₁sinθ₁ = n₂sinθ₂; solve any variable + **critical angle** θ_c = arcsin(n₂/n₁) + total-internal-reflection verdict. Refractive index user-supplied (or small stable list: vacuum 1, water 1.33, glass 1.5, diamond 2.42 — physical constants, overridable). TIR detection is AI-resistant. Demand 4 · gap 3 · dur 4 · diff 4 · build 4 |

### Electricity

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 23 | **Ohm's law wheel calculator** · `ohms-law-calculator` | **[C] FLAGSHIP** | **19** | V/I/R/P wheel: enter any 2 of {V, I, R, P}, get the other two via the 12 wheel relations (V=IR, P=VI=I²R=V²/R). Wheel graphic. Very high demand; the visual/all-four-outputs is the wedge over bare V=IR. FOLD standalone electrical-power page here. Demand 5 · gap 2 · dur 4 · diff 4 · build 3 |
| 24 | **Resistors in series & parallel** · `series-parallel-resistor-calculator` | [C] | **18** | Repeatable rows (like /calc/ GPA/mortgage): series ΣR; parallel 1/R_total = Σ1/Rᵢ; shows total + equivalent working. Same island reused for capacitors (rules inverted). Demand 5 · gap 2 · dur 4 · diff 3 · build 4 |
| 25 | **Capacitor calculator** · `capacitor-calculator` | [C-lite] | **17** | Q = CV; energy E = ½CV² = ½Q²/C; series/parallel (rules opposite to resistors — reuse #24 island). Demand 3 · gap 3 · dur 4 · diff 3 · build 4 |
| 26 | **Resistor color-code decoder** · `resistor-color-code-calculator` | [C] | **14** | 4/5/6-band → ohms + tolerance (and reverse). Bands are a fixed IEC 60062 standard (staleness-proof) BUT niche is saturated (resistorcolorcodes.org, calculator.net, vedantu) and it's decode-not-compute. Demand 5 · gap 1 · dur 3 · diff 2 · build 3 → WATCHLIST |

### Thermodynamics

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 27 | **Heat-engine / Carnot efficiency** · `carnot-efficiency-calculator` | [S] | **18** | η = 1 − T_c/T_h (Carnot) and η = W/Q_h (real); kelvin enforced. Clean, distinct. Demand 3 · gap 3 · dur 4 · diff 4 · build 5 |
| 28 | **Thermal expansion calculator** · `thermal-expansion-calculator` | [S] | **17** | Linear ΔL = αL₀ΔT; area/volume modes (2α, 3α). α user-supplied (or small stable material list, overridable — no rotting table). Demand 3 · gap 3 · dur 4 · diff 3 · build 4 |
| — | Specific heat q = mcΔT · Ideal gas PV = nRT | — | — | **ALREADY LIVE in /chemistry/** — cross-link, do not rebuild. Add a "for physics students" cross-link block. |

### Modern physics

| # | Tool · slug | Tag | Score | Notes |
|---|---|---|---|---|
| 29 | **Photon energy calculator (E = hf = hc/λ)** · `photon-energy-calculator` | [S] | **19** | h = 6.62607015×10⁻³⁴ (exact, SI 2019); solve E/f/λ with J↔eV output toggle (unit juggling is the AI-resistance angle). Demand 4 · gap 3 · dur 4 · diff 4 · build 4 |
| 30 | **E = mc² mass–energy calculator** · `mass-energy-calculator` | [S] | **18** | c = 299792458 exact; solve E/m; J↔eV↔MeV. High curiosity + syllabus demand. Demand 4 · gap 3 · dur 4 · diff 3 · build 5 |
| 31 | **de Broglie wavelength (λ = h/p)** · `de-broglie-wavelength-calculator` | [S] | **18** | λ = h/(mv); electron/proton mass presets (fixed constants). Demand 3 · gap 3 · dur 4 · diff 3 · build 5 |
| — | Radioactive half-life N = N₀(½)^(t/t½) | — | — | **ALREADY LIVE in /chemistry/** (`half-life-calculator`) — cross-link from a modern-physics hub, do not rebuild. |

---

## Flagship [C] visual tools (the 3 that deserve custom islands)

1. **Projectile motion** (`projectile-motion-calculator`) — parabola trajectory SVG with apex,
   range and impact markers, component vectors. The single most-searched physics-visual intent;
   the SVG + multi-output solver is the clearest differentiator vs bare-formula incumbents.
2. **Ohm's-law wheel** (`ohms-law-calculator`) — the classic V/I/R/P wheel graphic; enter any 2,
   get all 4 with the chosen relation highlighted. Highest-demand electricity intent; absorbs
   the electrical-power page.
3. **Wave / Doppler visualizer** (`wave-calculator` + `doppler-effect-calculator`) — plotted
   sine wave reading out A/λ/f/T/ω/v/k, plus the sign-aware Doppler component. Zero-friction
   visual + the sign-convention correctness that chatbots miss.

(The **SUVAT solver** and **resistor-network rows** are [C-lite]/[C] but non-visual; strong but
not "flagship visual." Build SUVAT early regardless — it's the kinematics LEAD.)

---

## Build order

1. **Shared core first:** `constants.ts` (CODATA/SI: g, G, c, h, k_B, e, ε₀, μ₀, N_A, masses of
   e⁻/p⁺, plus g for Moon/Mars) + a reusable trajectory/wave SVG primitive.
2. **Kinematics anchor:** SUVAT solver (#1) → projectile flagship (#2) → free fall (#3).
3. **Dynamics + energy [S] tranche** (cheapest, high demand): Newton (#5), momentum (#6),
   friction (#7), KE (#8), PE (#9), power (#11), Hooke (#12), work (#10).
4. **Electricity flagship + network:** Ohm's-law wheel (#23) → series/parallel resistors (#24)
   → capacitor (#25 reuses the island).
5. **Waves/optics tranche:** wave speed (#18), wave visualizer flagship (#20), Doppler (#19),
   lens/mirror (#21), Snell + TIR (#22).
6. **Gravitation + modern + thermo tail:** gravitation (#16), photon energy (#29), E=mc² (#30),
   Carnot (#27), then de Broglie (#31), centripetal (#13), torque (#14), orbital (#17),
   thermal expansion (#28).
7. **Watchlist promote later:** angular velocity (#15), resistor color code (#26) — only with
   long-tail keyword-gap proof.

Every page ships with cited formula + constant source, worked rearrangement shown, 5–8 FAQs,
and cross-links to /units/, /chemistry/, /math/ per the blog/quality standard. No page-count
target; small verified tranches (Friday cadence).

---

## FOLD list (into existing categories — do NOT build in /physics/)

- **Force / energy / power / pressure / frequency / speed unit conversions** → **/units/**
  (already has energy, power, pressure, speed). Add newton, joule↔eV, watt↔hp, hertz as
  quantities/pairs there if missing; physics tools cross-link to them.
- **Specific heat q = mcΔT, ideal gas PV = nRT, density ρ = m/V, combined gas law, radioactive
  half-life** → **already live in /chemistry/**. Cross-link; do not duplicate.
- **Weight W = mg** → FOLD as a mode of Newton's second law (#5), not a standalone page.
- **Electrical power P = VI = I²R = V²/R** → FOLD into the Ohm's-law wheel (#23).
- **Period ↔ frequency (T = 1/f)** → FOLD into wave-speed (#18) and Ohm's-law/wave visualizer.
- **Kelvin ↔ Celsius ↔ Fahrenheit** → already in /units/ temperature; physics thermo tools
  enforce kelvin internally and link out.

## DO-NOT-BUILD list (with reasons)

- **Interactive periodic-table / material-property reference tables (density, μ, α, refractive
  index, specific heat of many substances as a lookup)** — [D!] curated reference data that
  rots + authority surface; same reason as chemistry solubility tables and pet-drug tables. Keep
  material values as *optional, user-overridable presets* inside a tool, never as a reference page.
- **Free-body-diagram / circuit drawer / ray-diagram builder** — graphical, heuristic edge cases,
  not cleanly deterministic, off-brand (same reason Lewis-structure drawer was rejected in chem).
  A single fixed ray diagram *rendered from the lens solver's numbers* is fine; a general drawer isn't.
- **"Explain this physics concept / derive this" text tools** — AI-writing charter exclusion.
- **Relativity time-dilation "calculators" that overreach into paradox narration** — the plain
  γ = 1/√(1−v²/c²) Lorentz-factor / time-dilation solver is a fine future [S] (staleness-proof);
  parked below the launch set only on demand priority, not excluded.
- **Live/experimental-data anything** (real-time g by location, live weather-adjusted air
  density, sensor feeds) — needs a feed/CORS; off-charter.
- **Air-resistance / drag projectile with bundled C_d tables** — [D!] drag-coefficient reference
  data + numerical ODE integration; the no-air-resistance analytic projectile is the launch tool.
- **Nuclear binding-energy with a bundled isotope mass table** — [D!] curated nuclide masses; a
  user-supplies-mass-defect ΔE = Δm·c² mode inside E=mc² is the deterministic slice instead.

## [D!] data-staleness risks (all manageable)

- **Physical constants** (g, G, c, h, k_B, e, ε₀, μ₀, N_A, particle masses): CODATA/SI values.
  c, h, e, k_B, N_A are **exact by definition** since the 2019 SI redefinition (zero staleness).
  G and particle masses revise on multi-year CODATA cycles at the last digits — pin a stated
  CODATA year in `constants.ts`, negligible impact. **[D!-lite].**
- **Material presets** (μ, α, refractive index, specific heat, densities): ship only as
  **user-overridable defaults**, never authoritative tables — no maintenance liability.
- **Standard gravity** g = 9.80665 m/s² is a defined constant; Moon/Mars values are stated
  approximations flagged as such.

---

## Overlap audit (flag & resolve)

| Existing | Physics overlap | Resolution |
|---|---|---|
| /chemistry/ specific-heat (q=mcΔT) | thermodynamics | Cross-link, don't rebuild |
| /chemistry/ ideal-gas (PV=nRT), combined-gas-law | thermodynamics | Cross-link, don't rebuild |
| /chemistry/ density (ρ=m/V) | mechanics | Cross-link, don't rebuild |
| /chemistry/ half-life | modern/nuclear | Cross-link from modern-physics hub |
| /units/ energy·power·pressure·speed·temperature | all unit conversions | FOLD conversions to /units/; physics tools link out |
| /calc/ basic calculators | none material | No conflict |
| /math/ | trig used in projectile/Snell/torque | Reuse, cross-link |

---

## Sources

- ChatGPT physics-error evidence: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2023.1330486/full
- Intro-physics AI performance (calc errors, square-root failures): https://arxiv.org/pdf/2301.12127
- Physics-visual-representation LLM weakness (E&M): https://arxiv.org/pdf/2412.10019
- Competition (projectile): https://www.omnicalculator.com/physics/projectile-motion · https://calculator-online.net/projectile-motion-calculator/ · https://www.pearson.com/channels/physics/calculators
- Competition (Ohm's law / resistors): https://www.calculator.net/resistor-calculator.html · https://resistancecalculator.online/ · https://8gwifi.org/ohms-law-calculator.jsp · https://www.allaboutcircuits.com/tools/parallel-resistance-calculator/ · https://www.resistorcolorcodes.org/series-parallel
- Pearson physics-calculator expansion (competitor-research signal): https://www.pearson.com/channels/physics/calculators
- Omni physics index: https://www.omnicalculator.com/physics
