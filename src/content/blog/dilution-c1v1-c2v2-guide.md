---
title: "C1V1 = C2V2: How to Calculate Any Dilution (with Serial Dilutions)"
description: "The dilution equation C1V1 = C2V2 conserves solute, so the stock volume you need is V1 = C2V2/C1. To make 100 mL of 1× from a 10× stock: 10 mL stock + 90 mL diluent. How to solve for any unknown, plan a serial dilution, and why units cancel."
pubDate: 2026-07-10
updatedDate: 2026-07-10
archetype: explainer
tools: ["/biology/dilution-calculator/", "/biology/molarity-calculator/"]
keywords:
  - c1v1 c2v2
  - dilution calculator
  - how to make a dilution
  - serial dilution
  - m1v1 m2v2
  - dilution factor
  - stock solution dilution
heroImage: /blog/dilution-c1v1-c2v2-guide.png
heroAlt: "The dilution equation C1V1 = C2V2 explained, with a worked 10x-to-1x example"
faqs:
  - q: "What is the C1V1 = C2V2 formula?"
    a: "It is the dilution equation. The amount of solute doesn't change when you dilute, so the concentration times volume of the stock equals the concentration times volume of the final solution: C₁V₁ = C₂V₂. It is the same as M₁V₁ = M₂V₂ when the concentration is molarity."
  - q: "How do I calculate how much stock solution to use?"
    a: "Rearrange to V₁ = C₂V₂ / C₁. For example, to make 100 mL of a 1× solution from a 10× stock: V₁ = (1 × 100) / 10 = 10 mL of stock, then top up with 90 mL of diluent to reach 100 mL."
  - q: "Do the units matter in C1V1 = C2V2?"
    a: "Only that they are consistent. Use the same unit for both concentrations (M, mg/mL, %, whatever) and the same unit for both volumes. The units cancel, so the equation works for any concentration unit — that's why it needs no lookup tables and never goes out of date."
  - q: "What is a serial dilution?"
    a: "A stepwise dilution where each tube is diluted by the same factor from the previous one, producing an exponential concentration series such as 1:10, 1:100, 1:1000. It's used to reach very low concentrations accurately and to make standard curves. A serial-dilution planner gives the transfer and diluent volume for each tube."
  - q: "What is a dilution factor?"
    a: "The ratio of final volume to sample volume — how many times more dilute the result is. A dilution factor of 10 (a 1:10 dilution) means the sample ends up 10× less concentrated. Multiply the concentrations of each step to get the cumulative dilution factor of a serial dilution."
  - q: "Is C1V1 = C2V2 the same as M1V1 = M2V2?"
    a: "Yes — M₁V₁ = M₂V₂ is the same equation with molarity as the concentration. C₁V₁ = C₂V₂ is the general form for any concentration unit (molarity, mg/mL, % w/v, and so on)."
draft: false
---

**The dilution equation `C₁V₁ = C₂V₂` says the amount of solute stays the same when you dilute — so to
find how much stock you need, rearrange to `V₁ = C₂V₂ / C₁`.** To make 100 mL of a 1× solution from a
10× stock, that's `(1 × 100) / 10 = 10 mL` of stock plus 90 mL of diluent. Solve for any unknown, or
plan a full serial dilution, with the [dilution calculator](/biology/dilution-calculator/); here's how
it works.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>C₁V₁ = C₂V₂</strong> — solute is conserved, so stock (C×V) = final (C×V)</li>
<li><strong>Stock volume needed:</strong> V₁ = C₂V₂ / C₁</li>
<li><strong>10× → 1× in 100 mL:</strong> 10 mL stock + 90 mL diluent</li>
<li><strong>Units cancel</strong> — works for M, mg/mL, % — as long as they're consistent</li>
<li><strong>Serial dilution</strong> repeats a fold-step: 1:10 → 1:100 → 1:1000</li>
</ul>
</aside>

## The equation in one picture

<figure>
<img src="/blog/infographic-dilution.svg" alt="Infographic: C₁V₁ = C₂V₂ means stock concentration times stock volume equals final concentration times final volume, because solute is conserved; rearranged, V₁ = C₂V₂ / C₁; worked example to make 100 mL of 1× from a 10× stock gives V₁ = 1×100/10 = 10 mL stock plus 90 mL diluent = 100 mL of 1×; a serial dilution repeats a fixed fold-step for an exponential series 1:10, 1:100, 1:1000; use the same unit on both sides" width="1200" height="640" loading="lazy" />
<figcaption>Conserve the solute, rearrange for the unknown, keep the units consistent.</figcaption>
</figure>

## Why it works: solute is conserved

When you dilute a solution, you add solvent but not more solute — so the *amount* of solute (grams,
moles, whatever) is the same before and after. Amount = concentration × volume, so:

> **C₁ × V₁ = C₂ × V₂**

where 1 is the concentrated stock and 2 is the diluted final solution. That's the whole idea. To find
any one value, rearrange for it — most often you know the stock concentration (C₁), the concentration
you want (C₂) and the final volume (V₂), and you're solving for how much stock to use:

> **V₁ = C₂ × V₂ / C₁**

## A worked example

Make **100 mL of 1×** working solution from a **10× stock**:

- C₁ = 10×, C₂ = 1×, V₂ = 100 mL
- V₁ = (1 × 100) / 10 = **10 mL of stock**
- Diluent = 100 − 10 = **90 mL**

So: measure 10 mL of the 10× stock, add 90 mL of diluent, and you have 100 mL of 1×. The
[dilution calculator](/biology/dilution-calculator/) solves for whichever value you leave blank, so you
never have to rearrange by hand.

## Why the units don't matter (as long as they're consistent)

Because concentration appears on *both* sides, the units cancel. Use molarity, mg/mL, µg/mL or % — the
equation doesn't care, provided both concentrations share a unit and both volumes share a unit. That's
also why this is `M₁V₁ = M₂V₂` when the concentration happens to be molarity: same equation, one
specific unit. And it's why the tool needs no compound database and never goes stale — the maths is
exact for whatever units you use.

## Serial dilutions and the dilution factor

Sometimes one dilution can't reach the concentration you need accurately (pipetting 1 µL of stock into
10 L isn't practical). A **serial dilution** solves this by repeating a smaller, fixed fold-dilution
step by step:

- 1:10, then 1:10 again → 1:100, then again → 1:1000, and so on.

Each step's **dilution factor** is final volume ÷ sample volume, and the *cumulative* factor is the
product of the steps. The [dilution calculator's](/biology/dilution-calculator/) serial-dilution
planner lays out the transfer volume, diluent volume and cumulative fold-dilution for every tube — the
recipe you actually pipette. Once you have a target concentration, the
[molarity calculator](/biology/molarity-calculator/) tells you how much to weigh out for the stock in
the first place.

## Quick summary

C₁V₁ = C₂V₂ conserves solute, so V₁ = C₂V₂/C₁ tells you how much stock to use — 10 mL stock + 90 mL
diluent gives 100 mL of 1× from a 10× stock. Units cancel, so it works for any consistent
concentration unit (that's the same equation as M₁V₁ = M₂V₂). For very dilute targets, a serial
dilution repeats a fold-step for an exponential series. Solve any dilution, or plan a serial one
tube-by-tube, with the [dilution calculator](/biology/dilution-calculator/).

*Sources: conservation of mass (amount of solute = concentration × volume) — standard analytical
chemistry; general laboratory dilution practice. Educational information.*
