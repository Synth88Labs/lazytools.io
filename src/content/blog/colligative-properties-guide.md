---
title: "Colligative Properties: Why Salt Melts Ice and Antifreeze Works"
description: "Colligative properties depend on the number of dissolved particles, not their identity. Freezing-point depression (ΔTf = i·Kf·m) and boiling-point elevation (ΔTb = i·Kb·m), the van't Hoff factor, and why 1 molal NaCl drops water's freezing point by 3.72 °C."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/chemistry/freezing-point-depression-calculator/", "/chemistry/boiling-point-elevation-calculator/", "/chemistry/molarity-calculator/"]
keywords:
  - colligative properties
  - freezing point depression
  - boiling point elevation
  - vant hoff factor
  - why salt melts ice
  - delta tf = i kf m
heroImage: /blog/colligative-properties-guide.png
heroAlt: "Colligative properties: freezing-point depression and boiling-point elevation"
faqs:
  - q: "What are colligative properties?"
    a: "Properties of a solution that depend only on the number of dissolved solute particles, not on what the solute is. The main ones are freezing-point depression, boiling-point elevation, vapour-pressure lowering and osmotic pressure. Two solutions with the same particle concentration show the same effect."
  - q: "How do you calculate freezing point depression?"
    a: "ΔTf = i·Kf·m, where i is the van't Hoff factor (particles per formula unit), Kf the cryoscopic constant (1.86 °C·kg/mol for water) and m the molality. For 1 molal NaCl (i ≈ 2), ΔTf = 2 × 1.86 × 1 = 3.72 °C, so water freezes at −3.72 °C."
  - q: "What is the van't Hoff factor?"
    a: "The number of particles a solute produces per formula unit when it dissolves. NaCl gives i ≈ 2 (Na⁺ + Cl⁻), CaCl₂ ≈ 3, and molecular solutes like sugar give i = 1. A larger i means a bigger colligative effect."
  - q: "Why does salt melt ice?"
    a: "Dissolved salt lowers water's freezing point below the surrounding temperature (freezing-point depression), so the ice melts. The more particles dissolved (higher i·m), the larger the depression — which is why salt and calcium chloride are used to de-ice roads."
  - q: "How does antifreeze work?"
    a: "Ethylene glycol dissolved in an engine's water lowers the freezing point (so the coolant doesn't freeze and crack the block) and raises the boiling point (so it doesn't boil over) — both colligative effects from the same equations."
  - q: "Why is boiling-point elevation smaller than freezing-point depression?"
    a: "Because for water the ebullioscopic constant Kb (0.512) is much smaller than the cryoscopic constant Kf (1.86). The same molality raises the boiling point about 3.6× less than it lowers the freezing point."
draft: false
---

**Colligative properties are the ones that only care *how many* particles you dissolve, not *what* they
are.** Dissolve anything in water and you lower its freezing point (`ΔTf = i·Kf·m`) and raise its boiling
point (`ΔTb = i·Kb·m`). That single idea explains salted roads, antifreeze, and why pasta water with salt
boils a hair hotter.

<aside class="key-takeaways">

**Key takeaways**

- **Colligative = depends on particle count**, not the solute's identity.
- **Freezing-point depression:** `ΔTf = i·Kf·m` (water Kf = 1.86 °C·kg/mol).
- **Boiling-point elevation:** `ΔTb = i·Kb·m` (water Kb = 0.512 °C·kg/mol).
- **van't Hoff factor i** = particles per formula unit: NaCl ≈ 2, CaCl₂ ≈ 3, sugar = 1.
- **1 molal NaCl** drops water's freezing point by **3.72 °C** and raises boiling by 1.02 °C.

</aside>

## The two equations

<figure>
<img src="/blog/infographic-colligative-properties.svg" alt="Infographic: freezing-point depression ΔTf = i·Kf·m lowers the freezing point (why salt melts ice; water Kf = 1.86), and boiling-point elevation ΔTb = i·Kb·m raises the boiling point (water Kb = 0.512). The van't Hoff factor i is particles per formula unit: sugar 1, NaCl 2, CaCl₂ 3. 1 molal NaCl with i = 2 drops water's freezing point by 3.72 °C." width="1200" height="640" loading="lazy" />
<figcaption>Same structure, opposite direction — both scale with i·(constant)·molality.</figcaption>
</figure>

Both effects have the identical shape:

- **Freezing-point depression:** `ΔTf = i · Kf · m` — subtract ΔTf from the pure freezing point.
- **Boiling-point elevation:** `ΔTb = i · Kb · m` — add ΔTb to the pure boiling point.

Three quantities feed both, computed by the
[freezing-point](/chemistry/freezing-point-depression-calculator/) and
[boiling-point](/chemistry/boiling-point-elevation-calculator/) calculators.

## The van't Hoff factor (i)

This is the piece students most often forget. **i is the number of particles a solute breaks into.** A
colligative property counts particles, so an ionic compound that splits into ions has a bigger effect
than its formula-unit count suggests:

- Sugar (glucose) — stays as one molecule → **i = 1**
- NaCl → Na⁺ + Cl⁻ → **i = 2**
- CaCl₂ → Ca²⁺ + 2 Cl⁻ → **i = 3**

So 1 molal CaCl₂ depresses freezing about three times as much as 1 molal sugar, even though it's "one
solute." (Real ionic solutions fall a little short of the ideal i because of ion pairing, but the whole
number is the working value.)

## Kf and Kb are solvent constants

Kf (cryoscopic) and Kb (ebullioscopic) depend only on the **solvent**. For water:

| Constant | Value | Direction |
|---|---|---|
| Kf | 1.86 °C·kg/mol | freezing point down |
| Kb | 0.512 °C·kg/mol | boiling point up |

Because Kf is ~3.6× larger than Kb, dissolving something drops the freezing point far more than it raises
the boiling point — which is why de-icing is dramatic but "salt makes water boil hotter" is a barely
measurable ~1 °C at kitchen concentrations.

## Molality, not molarity

Colligative equations use **molality** (m = moles of solute per **kilogram of solvent**), not molarity
(per litre of solution). Molality is used because it doesn't change with temperature — and these
calculations span from freezing to boiling. Convert to molality first (the
[molarity calculator](/chemistry/molarity-calculator/) helps with the mole count).

## Worked example: salted water

1 mole of NaCl in 1 kg of water — how much does the freezing point drop?

> ΔTf = i · Kf · m = 2 × 1.86 × 1 = **3.72 °C**

So the water now freezes at **−3.72 °C** instead of 0 °C. The same solution boils at 100 + (2 × 0.512 × 1)
= **101.02 °C**. That asymmetry — a big freezing drop, a small boiling rise — is colligative behaviour in
one sentence.

## Quick summary

Colligative properties depend on the number of dissolved particles. Freezing point falls by
`ΔTf = i·Kf·m` and boiling point rises by `ΔTb = i·Kb·m`, where i (the van't Hoff factor) counts particles
per formula unit and Kf/Kb are solvent constants (1.86 and 0.512 for water). This is why salt melts ice
and antifreeze protects an engine at both ends. Work it out with the
[freezing-point depression](/chemistry/freezing-point-depression-calculator/) and
[boiling-point elevation](/chemistry/boiling-point-elevation-calculator/) calculators.

*Sources: standard general-chemistry treatment of colligative properties; cryoscopic and ebullioscopic
constants for water. Educational information.*
