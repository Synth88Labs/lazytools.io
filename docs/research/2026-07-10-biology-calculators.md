# Biology Calculators — New Category Market Research — 2026-07-10

## Executive summary

**Verdict: Biology clears the bar as a standalone category — QUALIFIED — and is a *better* fit for LazyTools than the everyday `/calc/` push was.** Two reasons the AI-resistance and privacy axes score higher here than in generic finance/health calculators:

1. **Sequence tools are genuinely AI-resistant and privacy-sensitive.** An LLM cannot reliably reverse-complement or translate a 2 kb sequence byte-exact in chat, and researchers *should not* paste unpublished/proprietary sequences into a chatbot or a random upload site. That is a real, defensible differentiator — stronger than anything in `/calc/`.
2. **The formula tools are staleness-proof by construction.** C₁V₁=C₂V₂, Hardy–Weinberg (p²+2pq+q²), molarity, doubling time (µ = ln(N₂/N₁)/Δt) never rot. This dodges the maintenance-liability trap that killed income-tax/inflation in the `/calc/` scan.

**But the competition gap is moderate (2–3), not open.** There is an active wave of new *client-side* aggregator sites doing exactly these tools (benchcalc.com, everydaybudd.com, monocalc.com, starlighttools.org, calculator.bio, sciencecodons.com, punnettsquares.com), alongside authoritative-but-brand-locked vendor tools (Promega, Thermo Fisher, NEB, GenScript, Sigma, IDT) and ad-heavy education aggregators (Omni, Pearson). So "client-side" is **not** the differentiator here — the differentiators are: clean single-purpose ad-free SEO pages, **working shown**, exact/deterministic output, cross-linking into our `/statistics/` χ² and `/math/` exactness stack, and the **sequence-privacy angle**. As with the `/calc/` scan, this is run as an **owner-directed category-expansion build**: it returns a ranked build list rather than hard-gating on the gap axis (structurally a 2–3 for the same reason `/calc/` was).

The category naturally splits into **two coherent clusters**, and I recommend framing it as **Biology & Lab**:
- **A. Molecular-biology lab bench** — sequence toolkit, GC/Tm, molecular weight & mass↔mole, dilution/serial dilution, molarity, doubling time, OD600. (The privacy + repeat-workflow cluster; researchers/biotech use these weekly.)
- **B. Genetics & population education** — Punnett squares, Hardy–Weinberg + allele frequency, population growth. (The student long-tail cluster; strong AI-resistance because LLMs botch exact grids/χ².)

Ten tools are worth building; five are leads. Hard **DO-NOT-BUILD**: the entire pet-drug-dosage / toxicity family from Omni's biology tree (Benadryl/Metacam dosing, chocolate/onion/raisin toxicity) — drug data rots **and** carries safety liability. pH/buffer (Henderson–Hasselbalch) is deferred to a **future Chemistry category** (boundary call). Overlaps with existing tools noted and folded (χ² ← `/statistics/`; animal gestation ↔ `/calc/` due-date).

Legend: **[S]** = declarative fields→compute registry · **[C]** = custom Preact island (sequence textarea, Punnett grid, repeatable serial-dilution rows, charts) · **[D!]** = data-maintenance flag.

## Ranked build list (top 10)

### Lead tier (build first)

**1. DNA/RNA sequence toolkit — reverse-complement · transcribe · translate — `/biology/reverse-complement/` (+ tabs) — [C] — 20/25**
- **Scores:** demand 5 · gap 3 · durability 4 · differentiation 5 · build 3.
- **Formula/algorithm:** complement map (A↔T/U, G↔C, IUPAC ambiguity codes N/R/Y/…); reverse-complement = reverse then complement, preserving 5'→3'; transcription DNA→mRNA (T→U on the template/coding convention shown explicitly); translation via the **standard genetic code table** (a fixed, non-rotting constant — the codon table has not changed) with reading-frame + start/stop handling; auto-clean input, strip whitespace/FASTA headers, report length + GC%.
- **Differentiation:** byte-exact on arbitrarily long sequences (LLMs drift); **privacy angle is real and marketable** — "your sequence never leaves the browser," which matters for unpublished/proprietary constructs. Clean tabbed page vs vendor upsell pages. Repeat-workflow (bookmarked by students + bench scientists).
- **Overlap/FOLD:** absorbs Omni's "DNA to mRNA Converter" (→ transcription tab). Reverse/complement/translate all one page, not three.

**2. Dilution calculator — C₁V₁=C₂V₂ + serial dilution + dilution factor — `/biology/dilution-calculator/` — [C] — 19/25**
- **Scores:** demand 5 · gap 2 · durability 4 · differentiation 4 · build 4. *(gap=2 flagged; category-anchor exception applies, same as `/calc/` posture.)*
- **Formula:** solve C₁V₁ = C₂V₂ (= M₁V₁ = M₂V₂) for any one of four unknowns; serial-dilution planner (repeatable rows: fold-dilution → concentration per tube, transfer + diluent volumes, cumulative dilution factor); dilution factor = V_final / V_sample. Unit-agnostic (M, mg/mL, µg/mL, % w/v) so **user supplies units → zero maintenance**.
- **Differentiation:** the *serial-dilution pipetting plan with working shown* + clean ad-free page. Extremely high demand (every wet lab, every micro/cell-culture course).
- **Overlap/FOLD:** dilution factor + serial dilution are tabs of this one page, not separate slugs.

**3. Punnett square calculator — mono / di / trihybrid — `/biology/punnett-square/` — [C] — 19/25**
- **Scores:** demand 5 · gap 3 · durability 4 · differentiation 4 · build 3.
- **Algorithm:** gamete enumeration from parent genotypes → n×n grid → genotype + phenotype ratio tallies (3:1, 9:3:3:1, etc.); color-coded grid; PNG/copy export.
- **Differentiation:** **strong AI-resistance** — LLMs reliably mis-fill larger grids and mis-tally ratios; a deterministic grid is exactly the "zero-friction beats prompting" case. Process real allele input, repeat-workflow (weekly homework). Clean page vs ad-heavy incumbents.
- **Overlap:** none internal; cross-link to #4.

**4. Hardy–Weinberg equilibrium + allele/genotype frequency (+ χ² fit) — `/biology/hardy-weinberg/` — [C] — 19/25**
- **Scores:** demand 5 · gap 3 · durability 4 · differentiation 4 · build 3.
- **Formula:** allele freq p, q from genotype counts; expected genotype freq p² + 2pq + q² = 1; **χ² goodness-of-fit** (observed vs expected, df, critical value α=0.05, p-value, reject/fail-to-reject verdict) — **reuse the `/statistics/` chi-square + regularizedGammaP infrastructure** already designed. Multi-allele (up to ~5) as phase-2.
- **Differentiation:** the χ² teaching verdict with working shown, cross-linked to our stats stack; ad-free. Genuine AP-Bio / undergrad long-tail.
- **Overlap/FOLD:** absorbs standalone "allele frequency calculator" (→ input mode). Depends on `/statistics/` special functions being built first (or vendored).

**5. GC content + melting temperature (Tm) — `/biology/gc-content-tm/` — [C] — 19/25**
- **Scores:** demand 5 · gap 3 · durability 4 · differentiation 4 · build 3.
- **Formula:** GC% = (G+C)/length × 100 (byte-exact); **basic Tm** — Wallace rule Tm = 2(A+T) + 4(G+C) for short oligos (<14 nt), and the salt-adjusted GC% formula Tm = 64.9 + 41×(G+C−16.4)/length for longer. **Nearest-neighbor** thermodynamic Tm is the accurate method and uses fixed NN parameter tables (stable published constants, **not rotting** — flag as phase-2, not [D!] risk).
- **Differentiation:** pairs naturally with the sequence toolkit; show *which method and why* (most incumbents hide it). Primer-design long-tail.
- **Overlap:** GC% also surfaced inside sequence toolkit output; this page is the Tm-intent landing page. Cross-link, don't duplicate the compute needlessly.

### Solid tier (next tranche)

**6. DNA/RNA/oligo molecular weight + mass↔mole (ng↔pmol) converter — `/biology/dna-molecular-weight/` — [C] — 18/25**
- **Formula:** MW from sequence (sum of per-nucleotide monophosphate masses − water for linkages; dsDNA = ×2 complement); mass↔mole via n = m/MW; the "1 pmol oligo ≈ 0.33 ng × length" rule; copy number = mol × 6.022×10²³. Constants are **fixed physical/biochemical values** (atomic masses, Avogadro) — staleness-proof.
- **Differentiation:** exact from pasted sequence; the ng↔pmol↔copies converter is a daily bench chore.
- **FOLD IN:** **Beer–Lambert / nucleic-acid quantitation** (A260 → ng/µL using dsDNA 50 / ssDNA 33 / RNA 40 conversion constants; A260/A280 purity ratio) belongs here as a "concentration from absorbance" tab rather than its own page (these constants are stable, not [D!] traps). This discharges the watchlisted Beer–Lambert item into this tool.

**7. Cell doubling time / growth rate — `/biology/doubling-time/` — [S] — 18/25**
- **Formula:** µ = ln(N₂/N₁)/(t₂−t₁); doubling time td = ln(2)/µ; number of generations = log₂(N₂/N₁); works from OD readings or cell counts. Pure formula, no species data → staleness-proof.
- **Overlap/FOLD:** Omni's "Generation Time Calculator" is the same thing → one page.

**8. Molarity calculator (mass ↔ molarity ↔ volume) — `/biology/molarity-calculator/` — [S] — 18/25**
- **Formula:** moles = mass/MW; molarity = moles/volume; solve any one from the others. **User supplies molar mass** (or MW comes from a compound the user types) → zero maintenance.
- **Boundary note:** this is arguably **Chemistry**, but it is a bench-biology staple (reagent/buffer prep) and every biology lab-calc suite includes it. Recommend placing it in Biology & Lab now; re-home to a future Chemistry category if one is built, or share the compute.

### Watchlist tier (build only with keyword-gap proof or after leads)

**9. OD600 → cell density — `/biology/od600-calculator/` — [S] — 17/25 — [D!-lite]**
- cells/mL = OD × organism factor × dilution. The organism factor (E. coli ~8×10⁸, S. cerevisiae ~3×10⁷ cells/mL/OD) is a **stable published constant, not rotting data**, and is made fully safe by letting the **user override the factor** (presets are a convenience, documented as approximate). Growth-rate mode overlaps #7 → cross-link, don't duplicate. Promote if the OD600 long-tail proves out.

**10. Population growth — exponential + logistic — `/biology/population-growth/` — [S] — 17/25**
- Exponential N(t) = N₀e^(rt); logistic N(t) = K/(1 + ((K−N₀)/N₀)e^(−rt)); doubling time ln2/r. Pure formula. Ecology/AP-Bio long-tail. Note the exponential math overlaps our compound-interest engine conceptually but the *framing/inputs* (carrying capacity K, intrinsic rate r) are distinct — separate page justified.

## FOLD (do not make separate pages)

- **DNA → mRNA converter** → transcription tab of the sequence toolkit (#1).
- **Allele frequency calculator** → input mode of Hardy–Weinberg (#4).
- **Dilution factor + serial dilution** → tabs of the dilution calculator (#2).
- **Generation time calculator** → same page as doubling time (#7).
- **Beer–Lambert / A260 nucleic-acid concentration + A260/A280 purity** → "concentration from absorbance" tab of the molecular-weight tool (#6). Discharges the standalone Beer–Lambert watchlist item.
- **Nucleic-acid molar/mass/copy-number converter** → the mass↔mole part of #6.
- **χ² goodness-of-fit for Hardy–Weinberg** → reuse `/statistics/` chi-square special functions; do not re-implement.

## DO-NOT-BUILD (with reasons)

- **Pet-drug dosage + toxicity calculators** (Benadryl/Metacam/cephalexin/tramadol dosing for dogs & cats; chocolate/onion/raisin toxicity) — **HARD REJECT.** Drug-dose and toxicity thresholds are curated reference data that rots (formulations, guidelines change) *and* carries direct medical/safety liability. Exactly the class the staleness filter forbids. Omni monetizes these heavily; we should not touch them.
- **Species / breed / dog-age / life-expectancy reference tables** — reject: curated reference data we'd have to maintain (staleness filter). "Dog age in human years," "life expectancy" etc. are lookup tables, not deterministic formulas.
- **Gardening / crops / forestry / livestock cluster** (fertilizer, mulch, soil, seed, tree height/value, feed-conversion, cattle-per-acre) — out of scope: agronomy/landscaping, not biology education or lab science; many need regional/agronomic reference data. Not a Biology-category fit.
- **Henderson–Hasselbalch pH / buffer calculator** — **DEFER to a future Chemistry category** (boundary call). Pure formula (pH = pKa + log([A⁻]/[HA])) and staleness-proof, so it's a valid tool — but it reads as chemistry, and molarity/molar-mass/Beer–Lambert would anchor a Chemistry cluster better. Note for a future Chemistry scan.
- **qPCR efficiency (standard-curve slope)** — WATCHLIST not build: E = 10^(−1/slope) − 1 is a clean formula, but demand is narrower (qPCR practitioners) and it wants a small regression UI. Revisit if the lab cluster proves out. ~15/25.
- **Hemocytometer / cell-counting calculator** — WATCHLIST ~17/25: cells/mL = avg count/square × dilution × 10⁴ is pure formula and a real daily chore; hold as a fast follow to the dilution/OD600 lab cluster.
- **Enzyme kinetics (Michaelis–Menten Vmax/Km)** — WATCHLIST ~16/25: single-point v = Vmax[S]/(Km+[S]) is trivial [S], but the valuable version is **data-fit** (nonlinear regression + Lineweaver–Burk/Eadie–Hofstee), which is a heavier [C] with a crowded incumbent set (starlighttools, everydaybudd, D2D-CURE, Omni). Promote only if a keyword gap appears.
- **Animal gestation / pregnancy cluster** (dog/cat/cow/mare/goat/sheep/swine…) — WATCHLIST ~15/25 [D!-lite]: per-species gestation length is a **stable biological constant** (not rotting), so not a hard reject, but each page is thin Omni-filler and the SEO is fragmented across species. It also overlaps our `/calc/` due-date (Naegele) engine conceptually. If ever built, do it as one multi-species [S] page (species select → constant), not one page per animal. Low priority.

## Next tranche / watchlist tail (scored)

- [watchlist] Hemocytometer / cell-count calculator — 17/25 [S] (fast-follow to lab cluster)
- [watchlist] Enzyme kinetics Michaelis–Menten (single-point + data-fit) — 16/25 [C]
- [watchlist] qPCR efficiency from standard-curve slope — 15/25 [S]
- [watchlist] Animal gestation multi-species (one page) — 15/25 [S][D!-lite]
- [watchlist] Ligation / molar insert:vector ratio calculator — 15/25 [S] (Omni + NEB have it; molecular cloning niche; pure formula)
- [note] Protein molecular weight / pI — deferred: pI needs pKa constant tables (stable but table-heavy); MW from amino-acid sequence is a clean [C] companion to #1/#6 — revisit as a "protein" sibling if the DNA sequence toolkit performs.

## Build-order recommendation

Ship the **sequence toolkit (#1)** and **dilution calculator (#2)** first — they anchor the two clusters, carry the privacy and repeat-workflow angles, and force the two reusable islands (sequence textarea + repeatable-rows). Then **Punnett (#3)** and **Hardy–Weinberg (#4)** for the education long-tail (HW after `/statistics/` χ² lands). **GC/Tm (#5)** and **molecular weight (#6)** complete the primer/oligo bench trio. `/statistics/` special-function work (χ², normalCDF) is a shared dependency — sequence #4 with HW; sequencing that build after statistics is efficient.

## Lane notes

- **Omni /biology reference review:** genuinely-searched core = lab (dilution, doubling/generation time, DNA concentration, annealing/Tm, protein/DNA MW) + genetics (allele frequency, Punnett mono/di/tri, Hardy–Weinberg, DNA→mRNA). The rest of Omni's tree is **filler or off-limits**: a very large pet-drug-dosage/toxicity family (reject — staleness + liability), pet age/breed/size lookups (reject — reference data), and a huge gardening/forestry/livestock agronomy section (out of scope). Do **not** copy the list wholesale.
- **Demand signals (observed):** every target lab/genetics tool returns multiple independent live calculators, including authoritative vendor tools (Promega, Thermo Fisher, NEB, GenScript, Sigma, IDT) — their investment is itself a demand proxy. Tm/oligo, dilution/serial dilution, Hardy–Weinberg, Punnett, reverse-complement, DNA MW, doubling-time/OD600 all confirmed high-competition = proven demand.
- **Competition-gap scan:** gap is **moderate, not open.** Two incumbent types: (a) brand-locked vendor tools (dated UI, product upsell, sometimes registration); (b) a fresh wave of client-side aggregators (benchcalc, everydaybudd, monocalc, starlighttools, calculator.bio, sciencecodons, punnettsquares) already doing these client-side. Differentiation must be UX/ad-free/SEO-long-tail + working-shown + exactness + **sequence privacy**, not "client-side" per se.
- **Staleness scan:** the formula tools (dilution, molarity, Hardy–Weinberg, doubling time, population growth, sequence ops, GC%, basic Tm, MW) are staleness-proof. Borderline constants (OD600 organism factor, A260 conversion 50/33/40, NN Tm params, codon table, gestation lengths) are **stable published constants that don't rot** — made safe by user-override where organism-specific. Hard staleness/liability rejects isolated to the pet-drug-dosage/toxicity + species-lookup families.
- **Category-boundary scan:** molarity, Beer–Lambert, Henderson–Hasselbalch straddle Chemistry. Recommendation: keep molarity + A260 quantitation in Biology & Lab now (bench-bio staples); defer Henderson–Hasselbalch pH/buffer to a future Chemistry category. Flag molarity for possible re-home / shared compute.
- **Cross-link/reuse scan:** Hardy–Weinberg χ² reuses `/statistics/` chi-square (regularizedGammaP); population-growth exponential math is adjacent to compound-interest but distinct framing; animal gestation overlaps `/calc/` due-date. No new source built here — research only.

## Sources

- https://www.omnicalculator.com/biology
- https://www.omnicalculator.com/biology/allele-frequency
- https://www.omnicalculator.com/biology/cell-doubling-time
- https://www.omnicalculator.com/chemistry/michaelis-menten-equation
- https://thebiologybro.com/top-biology-research-calculators-every-researcher-needs
- https://labcalc.org/
- https://calcbee.com/calculators/biology/
- https://www.pearson.com/channels/calculators
- https://www.pearson.com/channels/calculators/allele-frequency-calculator
- https://www.thermofisher.com/us/en/home/brands/thermo-scientific/molecular-biology/molecular-biology-learning-center/molecular-biology-resource-library/thermo-scientific-web-tools/tm-calculator.html
- https://tmcalculator.neb.com/
- https://www.genscript.com/tools/oligo-primer-calculation
- https://www.promega.com/resources/tools/biomath/tm-calculator/
- https://www.promega.com/resources/tools/biomath/
- https://www.calculator.bio/gc-content-tm/
- https://mcb.berkeley.edu/labs/krantz/tools/oligocalc.html
- https://sciencecodons.com/tools/reverse-complement-converter/
- https://www.bioinformatics.org/sms/rev_comp.html
- https://reverse-complement.com/
- https://punnettsquare.org/hardy-weinberg-equilibrium-calculator/
- https://www.punnettsquares.com/
- https://livephysics.com/tools/punnett-square/
- https://calcbe.com/en/calculators/hardy-weinberg/
- https://www.mathcelebrity.com/hardy_weinberg.php
- https://www.physiologyweb.com/calculators/dilution_calculator_molarity_percent.html
- https://www.sigmaaldrich.com/US/en/support/calculators-and-apps/solution-dilution-calculator
- https://www.tocris.com/resources/dilution-calculator
- https://www.everydaybudd.com/tools/chemistry/dilution
- https://www.benchcalc.com/dilution-calculator/
- https://monocalc.com/tool/chemistry/dilution_calculator
- https://calculatorskit.net/calculators/dilution-calculator
- https://dilutionscalculator.com/od600-calculator/
- https://conductscience.com/tools/doubling-time-calculator
- https://punnettsquare.org/bacterial-growth-calculator/
- https://nebiocalculator.neb.com/#!/dsdnaamt
- https://molbiotools.com/dnacalculator.php
- https://oligopool.com/molecular-weight-calculator
- https://www.westlab.com/nucleic-acid-concentration-molar-converter
- https://starlighttools.org/science/enzyme-kinetics-calculator
- https://www.everydaybudd.com/tools/bio-lab/enzyme-kinetics
- https://pharmacyfreak.com/michaelis-menten-enzyme-kinetics-calculator/
</content>
</invoke>
