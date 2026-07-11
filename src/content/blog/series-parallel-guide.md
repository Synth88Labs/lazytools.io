---
title: "Series vs Parallel: Resistors and Capacitors (and Why They're Opposite)"
description: "Resistors in series add; in parallel their reciprocals add (total below the smallest). Capacitors do the exact reverse. The rules, the reason, a memory aid, and worked examples — so you never mix them up again."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/physics/series-parallel-resistor-calculator/", "/physics/capacitor-calculator/", "/physics/ohms-law-calculator/"]
keywords:
  - resistors in series and parallel
  - capacitors in series and parallel
  - parallel resistance formula
  - total resistance calculator
  - series parallel rules
  - equivalent resistance
heroImage: /blog/series-parallel-guide.png
heroAlt: "Series and parallel rules for resistors and capacitors, side by side"
faqs:
  - q: "How do resistors combine in series and parallel?"
    a: "In series they add: R_total = R₁ + R₂ + …. In parallel, their reciprocals add: 1/R_total = 1/R₁ + 1/R₂ + …, so the total is always less than the smallest resistor. For 100, 220 and 330 Ω: series = 650 Ω, parallel ≈ 58.2 Ω."
  - q: "How do capacitors combine in series and parallel?"
    a: "The opposite of resistors. In parallel capacitors add: C_total = C₁ + C₂ + …. In series their reciprocals add: 1/C_total = 1/C₁ + 1/C₂ + …, giving a total smaller than the smallest capacitor."
  - q: "Why are capacitor rules the reverse of resistor rules?"
    a: "Resistance opposes current, so more resistors in a line (series) means more opposition. Capacitance stores charge per volt; connecting capacitors in parallel effectively enlarges the plate area (more capacitance), while series increases the effective plate spacing (less capacitance) — the reverse behaviour."
  - q: "Why is parallel resistance always smaller than the smallest resistor?"
    a: "Parallel branches give current extra paths to flow through, which reduces the overall opposition. Adding any parallel path can only lower the total resistance, so it ends up below the smallest branch."
  - q: "How do I handle a mixed series-parallel circuit?"
    a: "Break it into sub-groups: combine the purely series parts and purely parallel parts separately, replace each with its equivalent value, and repeat until one value remains. A calculator handles each group."
  - q: "What is the memory trick for series and parallel?"
    a: "Whatever a resistor does in series, a capacitor does in parallel (and vice-versa). If you remember the resistor rules, flip them for capacitors."
draft: false
---

**Two components, two arrangements, and one reversal that trips everyone up.** Resistors in *series* add;
in *parallel* their reciprocals add (so the total drops below the smallest). Capacitors do the **exact
opposite**. Get the pattern once and you never have to re-derive it.

<aside class="key-takeaways">

**Key takeaways**

- **Resistors — series:** `R = R₁ + R₂ + …` (bigger). **Parallel:** `1/R = 1/R₁ + 1/R₂ + …` (below the smallest).
- **Capacitors — parallel:** `C = C₁ + C₂ + …` (bigger). **Series:** `1/C = 1/C₁ + 1/C₂ + …` (below the smallest).
- **They're mirror images:** what a resistor does in series, a capacitor does in parallel.
- Parallel resistance is **always less than the smallest** resistor — extra paths for current.
- For mixed circuits, **combine sub-groups** step by step.

</aside>

## The rules side by side

<figure>
<img src="/blog/infographic-series-parallel.svg" alt="Infographic: resistors in series add (R = R₁ + R₂), in parallel reciprocals add (1/R = 1/R₁ + 1/R₂, below the smallest). Capacitors are reversed: parallel add (C = C₁ + C₂), series reciprocals add. Memory aid: whatever a resistor does in series, a capacitor does in parallel. Example resistors 100, 220, 330 Ω: series 650 Ω, parallel 58.2 Ω." width="1200" height="640" loading="lazy" />
<figcaption>The reciprocal rule shows up in both — just swapped between series and parallel.</figcaption>
</figure>

## Resistors

**In series**, current flows through each resistor in turn, so their oppositions stack up:

> `R_total = R₁ + R₂ + R₃ + …`

Three resistors of 100, 220 and 330 Ω in series give **650 Ω**.

**In parallel**, current splits between branches, giving it more ways through, so the total *drops*:

> `1/R_total = 1/R₁ + 1/R₂ + 1/R₃ + …`

The same three resistors in parallel give about **58.2 Ω** — less than the 100 Ω smallest. That's the
tell-tale sign of a parallel combination: **the total is always below the smallest resistor.** The
[series & parallel resistor calculator](/physics/series-parallel-resistor-calculator/) adds up as many
as you like.

## Capacitors — the reverse

Capacitors flip both rules. **In parallel** they simply add (like series resistors):

> `C_total = C₁ + C₂ + …`

**In series** their reciprocals add (like parallel resistors), so the total is smaller than the smallest:

> `1/C_total = 1/C₁ + 1/C₂ + …`

The [capacitor calculator](/physics/capacitor-calculator/) uses these reversed rules.

## Why the reversal?

It comes down to what each component *is*:

- A **resistor** opposes current. Line more up in series and you add opposition; give current parallel
  detours and you reduce it.
- A **capacitor** stores charge per volt (`C = Q/V`). Wiring capacitors **in parallel** is like widening
  the plates — more area, more capacitance, so they add. Wiring them **in series** is like increasing the
  gap between plates — less capacitance, so the reciprocals add.

Same maths (add values, or add reciprocals), opposite pairing. Hence the memory aid: **whatever a resistor
does in series, a capacitor does in parallel.**

## Mixed circuits

Real circuits mix both. The method is always the same:

1. Find a group that is purely series **or** purely parallel.
2. Replace it with its single equivalent value.
3. Repeat until one value is left.

Compute each group with the calculator and combine step by step. (For the voltage, current and power
around those resistors, the [Ohm's-law wheel](/physics/ohms-law-calculator/) finishes the job.)

## Quick summary

Resistors add in series and combine as reciprocals in parallel (total below the smallest); capacitors do
the exact reverse — add in parallel, reciprocals in series. The reversal comes from resistance opposing
current while capacitance stores charge. Remember "resistor-series = capacitor-parallel," break mixed
circuits into groups, and let the [resistor](/physics/series-parallel-resistor-calculator/) and
[capacitor](/physics/capacitor-calculator/) calculators do the arithmetic.

*Sources: standard circuit theory (series and parallel combinations of resistors and capacitors) as
taught in physics and electronics. Educational information.*
