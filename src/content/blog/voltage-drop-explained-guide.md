---
title: "Voltage Drop Explained (and How to Keep It Under 3%)"
description: "Voltage drop is the voltage lost to wire resistance over a run: 2 × current × resistance-per-metre × one-way length (√3 for three-phase). Here's how to calculate it, the 3% rule, and how to fix an excessive drop."
pubDate: 2026-07-28
updatedDate: 2026-07-28
archetype: explainer
heroImage: /blog/voltage-drop-explained-guide.png
heroAlt: "Voltage drop = factor × current × resistance-per-metre × one-way length."
tools: ["/electronics/voltage-drop-calculator/"]
keywords:
  - voltage drop
  - voltage drop calculator
  - voltage drop formula
  - wire size voltage drop
  - nec voltage drop
draft: false
---

**Voltage drop is the voltage lost to a wire's resistance over the run, and it equals the current times the wire's resistance times the total conductor length — for DC and single-phase that's 2 × current × resistance-per-metre × the one-way length (use √3 instead of 2 for three-phase).** The US National Electrical Code recommends keeping it **under 3%** on a branch circuit. Excess drop dims lights, slows motors and wastes energy as heat.

<aside class="key-takeaways">

**Key takeaways**

- **Formula:** drop = factor × current × (resistance per metre) × one-way length. **factor = 2** for DC/single-phase (out and back), **√3** for three-phase.
- Aim for **under 3%** on a branch circuit (5% total including the feeder); solar often targets 2%.
- **Reduce drop** with a thicker wire (lower AWG), a shorter run, copper instead of aluminium, or a higher voltage.
- **Aluminium** has about 1.6× the resistance of copper for the same gauge, so it drops more.
- Long runs and high current are the two things that push voltage drop up fastest.

</aside>

<figure>
<img src="/blog/infographic-voltage-drop.svg" alt="drop = factor × current × resistance-per-metre × one-way length; factor 2 for DC/single-phase, √3 for three-phase. Keep under 3% (NEC); reduce with thicker wire, shorter run, copper, or higher voltage." width="1200" height="700" loading="lazy" />
<figcaption>Voltage drop rises with current and length — and with thinner or aluminium wire.</figcaption>
</figure>

## Why voltage drops

No conductor is perfect: every wire has a small resistance, and pushing current through a resistance loses some voltage (Ohm's law, V = I × R). Over a short run it's negligible, but over a **long cable carrying significant current**, the loss adds up — and it's paid twice, because the current has to travel out to the load *and* back.

That's the factor of **2** in the single-phase and DC formula (out and back along both conductors). Three-phase systems share the return across phases, so they use **√3** instead.

> **drop (V) = factor × current (A) × resistance-per-metre (Ω/m) × one-way length (m)**

The resistance-per-metre depends on the **wire gauge** (thicker wire = lower resistance) and the **material** (aluminium is worse than copper). The [voltage drop calculator](/electronics/voltage-drop-calculator/) looks up the resistance for your AWG, applies the right factor for DC, single- or three-phase, and shows the drop in volts, as a percentage, and the voltage that actually reaches the load.

## The 3% rule

The National Electrical Code (NEC) recommends:

- **≤ 3%** voltage drop on a branch circuit, and
- **≤ 5%** total including the feeder.

Many solar and low-voltage DC designers target **2% or less**, because low-voltage systems feel a given voltage loss more (a 1 V drop is a big deal at 12 V, trivial at 240 V). Excess drop causes real problems: dim or flickering lights, motors and compressors that run hot and struggle to start, sensitive electronics misbehaving, and energy simply wasted as heat in the cable.

## How to reduce voltage drop

If your run exceeds the limit, you have four levers:

1. **Use a thicker wire** (a lower AWG number). Roughly doubling the cross-sectional area halves the drop — the most common fix.
2. **Shorten the run** where you can, or move the source closer to the load.
3. **Use copper instead of aluminium** — copper has ~1.6× less resistance for the same gauge.
4. **Raise the system voltage** if the design allows, since the same watts at a higher voltage means less current and less drop.

*This is a design aid. Always follow your local electrical code and use a licensed electrician for real installations.*

## FAQ

**How do I calculate voltage drop?**
Multiply the current by the wire's resistance and by the total conductor length. For DC or single-phase: 2 × current × resistance-per-metre × one-way length; for three-phase, use √3 instead of 2. The [calculator](/electronics/voltage-drop-calculator/) does it from the AWG, length, current and material.

**What is an acceptable voltage drop?**
The NEC recommends under 3% on a branch circuit and 5% total. Solar and low-voltage designers often aim for 2% or less because low-voltage systems are more sensitive to loss.

**How do I reduce voltage drop?**
Use a thicker (lower-AWG) wire, shorten the cable run, switch from aluminium to copper, or run at a higher voltage. Increasing the wire size is usually the simplest fix.

**Does aluminium wire drop more voltage than copper?**
Yes — aluminium has about 1.6 times the resistance of copper for the same gauge, so it drops proportionally more. You typically go up a couple of gauge sizes to match copper's performance.

**Why does a long cable run matter so much?**
Because voltage drop is proportional to length: double the run, double the drop. Long runs, especially at high current or low voltage, are where voltage drop becomes a real design constraint.

**Is voltage drop the same as power loss?**
They're related — the dropped voltage times the current is the power lost as heat in the cable. Keeping voltage drop low also keeps that wasted energy low.
