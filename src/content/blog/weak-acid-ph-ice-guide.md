---
title: "How to Find the pH of a Weak Acid (the ICE-Table Method)"
description: "A weak acid at 0.1 M isn't pH 1 — it's closer to 3, because it barely ionizes. Here's why −log of the concentration fails, how to set up the ICE table, and how to solve for pH exactly instead of guessing that 'x is small'."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/chemistry/weak-acid-base-ph-calculator/", "/chemistry/equilibrium-constant-calculator/", "/chemistry/ksp-solubility-calculator/"]
keywords:
  - how to find ph of weak acid
  - weak acid ph calculation
  - ice table
  - ph from ka
  - weak acid equilibrium
  - percent ionization
heroImage: /blog/weak-acid-ph-ice-guide.png
heroAlt: "An ICE table for a weak acid HA ionizing to H+ and A-, with the equilibrium expression Ka = x squared over (C minus x), solving to pH 2.87 for 0.1 M acetic acid"
faqs:
  - q: "How do I find the pH of a weak acid?"
    a: "Set up an ICE table for HA ⇌ H⁺ + A⁻, which gives Ka = x²/(C − x) with x = [H⁺]. Solve that quadratic for x, then pH = −log x. For 0.1 M acetic acid (Ka = 1.8×10⁻⁵), x ≈ 1.33×10⁻³ and pH ≈ 2.87."
  - q: "Why isn't the pH of a weak acid just −log of the concentration?"
    a: "That formula only works for strong acids, which ionize 100%. A weak acid ionizes only partially — often a percent or two — so the actual [H⁺] is far smaller than the acid concentration, giving a much higher pH than −log(C) would."
  - q: "What is an ICE table?"
    a: "A table of Initial, Change, and Equilibrium concentrations. For a weak acid: Initial is C, 0, 0; Change is −x, +x, +x; Equilibrium is C−x, x, x. The equilibrium row goes into the Ka expression to solve for x."
  - q: "Do I need the quadratic formula, or can I assume x is small?"
    a: "The 'x is small' shortcut (Ka ≈ x²/C) works when the acid is weak and reasonably concentrated, but it fails for stronger weak acids or dilute solutions. Solving the full quadratic x² + Ka·x − Ka·C = 0 is always correct — which is what the calculator does."
  - q: "What is percent ionization?"
    a: "The fraction of acid that actually dissociates: [H⁺] ÷ C × 100. For 0.1 M acetic acid it's about 1.3%. Percent ionization increases as the solution gets more dilute, even though the pH rises."
  - q: "How do I find the pH of a weak base?"
    a: "The same way with Kb: solve for x = [OH⁻] from Kb = x²/(C − x), take pOH = −log x, then pH = 14 − pOH at 25 °C. The calculator has a weak-base mode that does this."
draft: false
---

**Drop a strong acid like HCl to 0.1 M and the pH is 1. Do the same with acetic acid and the pH is about 2.87 — nearly a hundred times less acidic.** Same concentration, wildly different pH, because a weak acid barely comes apart in water. To find its pH you can't just take a logarithm; you have to solve an equilibrium. The tool for that is the ICE table.

<aside class="key-takeaways">

**Key takeaways**

- **A weak acid ionizes only partially**, so pH ≠ −log(concentration).
- **Set up an ICE table** for HA ⇌ H⁺ + A⁻ → Ka = x²/(C − x), with x = [H⁺].
- **Solve for x**, then **pH = −log x**.
- **0.1 M acetic acid** (Ka = 1.8×10⁻⁵) → x ≈ 1.33×10⁻³ → **pH ≈ 2.87**.
- **Solve the full quadratic** rather than assuming "x is small" — it's always right.

</aside>

<figure>
<img src="/blog/infographic-weak-acid-ph-ice.svg" alt="The equilibrium HA ⇌ H+ + A-, with an ICE table: Initial C, 0, 0; Change −x, +x, +x; Equilibrium C−x, x, x. The expression Ka = x²/(C − x) solves, for 0.1 M acetic acid with Ka 1.8×10⁻⁵, to x = 1.33×10⁻³ M and pH = 2.87 — versus pH 1 for a strong acid." width="1200" height="640" loading="lazy" />
<figcaption>Initial, Change, Equilibrium — the table feeds straight into the Ka expression.</figcaption>
</figure>

## Why −log(C) fails

For a **strong** acid, every molecule donates its proton, so [H⁺] equals the acid concentration and pH = −log(C). Simple.

A **weak** acid doesn't. Acetic acid in water sits mostly as intact CH₃COOH molecules, with only a small fraction broken into H⁺ and CH₃COO⁻ at any moment. That fraction — the **percent ionization** — is often just 1–2%. So the real [H⁺] is a fraction of the concentration, and the pH is much higher (less acidic) than −log(C) predicts.

How much ionizes is set by the acid's **Ka**, its ionization constant. A bigger Ka means a stronger weak acid; acetic acid's Ka is 1.8×10⁻⁵ (a pKa of 4.74).

## Setting up the ICE table

ICE stands for **Initial, Change, Equilibrium**. For a weak acid HA ⇌ H⁺ + A⁻ starting at concentration C:

| | HA | H⁺ | A⁻ |
|---|---|---|---|
| **Initial** | C | 0 | 0 |
| **Change** | −x | +x | +x |
| **Equilibrium** | C − x | x | x |

Here **x is the amount that ionizes**, which is exactly [H⁺] at equilibrium. Plug the equilibrium row into the Ka expression:

```
Ka = [H⁺][A⁻] / [HA] = (x)(x) / (C − x) = x² / (C − x)
```

## Solving for x

Rearranging gives a quadratic:

```
x² + Ka·x − Ka·C = 0
```

which solves (taking the positive root) to `x = (−Ka + √(Ka² + 4·Ka·C)) / 2`. For 0.1 M acetic acid:

`x = [H⁺] ≈ 1.33×10⁻³ M   →   pH = −log(1.33×10⁻³) ≈ 2.87`

And the percent ionization is `1.33×10⁻³ ÷ 0.1 × 100 ≈ 1.3%` — confirming that only a sliver of the acid came apart.

## The "x is small" shortcut — and when it breaks

Textbooks often skip the quadratic by assuming x is tiny compared to C, so C − x ≈ C and `Ka ≈ x²/C`, giving `x ≈ √(Ka·C)`. For acetic acid that shortcut gives 1.34×10⁻³ — close enough.

But it **fails when x isn't small**: for a stronger weak acid, or a dilute solution, x becomes a real chunk of C and dropping it introduces error. The safe move is to always solve the full quadratic, which is what the [weak acid & base pH calculator](/chemistry/weak-acid-base-ph-calculator/) does — no approximation, so it's accurate across the board.

## The same idea, everywhere in equilibrium

Once the ICE table clicks, the rest of equilibrium follows the same pattern. A [Ksp / solubility calculation](/chemistry/ksp-solubility-calculator/) is an ICE table for a dissolving salt; a general [Kc equilibrium problem](/chemistry/equilibrium-constant-calculator/) is an ICE table solved for the extent of reaction. Weak bases are identical with Kb and pOH. Learn it once and it powers the whole topic.

## Just solve it

Enter your Ka (or Kb) and concentration into the [weak acid & base pH calculator](/chemistry/weak-acid-base-ph-calculator/) and it returns the pH, pOH, ion concentration and percent ionization — solving the exact quadratic, with quick presets for common acids and bases. Like every LazyTools tool, it runs entirely in your browser, nothing uploaded.

---

*This uses the standard weak-acid equilibrium: Ka = x²/(C − x) solved exactly for x = [H⁺], with pH = −log x, for a monoprotic acid at 25 °C. Ka values are standard reference figures; enter the one from your data. Source: standard general-chemistry treatment of acid–base equilibria (e.g. IUPAC conventions, Zumdahl/Brown LeMay).*
