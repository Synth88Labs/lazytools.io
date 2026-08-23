---
title: "Voltage Drop Explained (and How to Keep It Under 3%)"
description: "Voltage drop is the voltage lost to wire resistance over a run: 2 × current × resistance-per-metre × one-way length (√3 for three-phase). Here's how to calculate it, the 3% rule, and how to fix an excessive drop."
pubDate: 2026-07-28
updatedDate: 2026-08-23
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

## Wire resistance by gauge

The resistance-per-metre is the number that turns the formula into a real answer. In the American Wire Gauge (AWG) system, **a smaller number means a thicker wire**, and every 3-gauge step roughly doubles or halves the cross-sectional area — so it roughly halves or doubles the resistance. The values below are approximate DC resistances for solid, uncoated copper at around 20 °C; aluminium of the same gauge runs about 1.6× higher.

| Wire size (AWG) | Copper resistance (Ω per km) | Copper resistance (Ω per 1000 ft) | Typical use |
|---|---|---|---|
| 14 | ~8.3 | ~2.5 | 15 A lighting/receptacle circuits |
| 12 | ~5.2 | ~1.6 | 20 A general-purpose circuits |
| 10 | ~3.3 | ~1.0 | 30 A dryers, water heaters |
| 8 | ~2.1 | ~0.63 | 40–50 A ranges, sub-feeds |
| 6 | ~1.3 | ~0.40 | 55–65 A feeders, EV chargers |

Treat these as guide figures for estimating drop, not as ampacity ratings. The exact resistance shifts with temperature (hotter wire has more resistance), with stranding, and with tinned versus bare copper — which is why a good [voltage drop calculator](/electronics/voltage-drop-calculator/) and your local code tables are the right authority for a real install.

## The 3% rule

The National Electrical Code (NEC) recommends:

- **≤ 3%** voltage drop on a branch circuit, and
- **≤ 5%** total including the feeder.

Strictly speaking, these are **recommendations carried in the NEC's informational notes**, not hard rules the code enforces — but most designers and inspectors treat them as the practical target because they keep equipment inside its rated operating window. Many solar and low-voltage DC designers go tighter and target **2% or less**, because low-voltage systems feel a given voltage loss more (a 1 V drop is a big deal at 12 V, trivial at 240 V). Excess drop causes real problems: dim or flickering lights, motors and compressors that run hot and struggle to start, sensitive electronics misbehaving, and energy simply wasted as heat in the cable.

## A worked example

Suppose you run a **20 A, 120 V single-phase** circuit **30 m** (about 100 ft) one way in **10 AWG copper**. Using ~3.3 Ω/km, the resistance-per-metre is 0.0033 Ω/m:

> drop = 2 × 20 A × 0.0033 Ω/m × 30 m ≈ **3.9 V**

That is 3.9 V ÷ 120 V ≈ **3.3%** — just over the 3% target, and only 116 V actually reaches the load. Step up one common size to **8 AWG** (~2.1 Ω/km, 0.0021 Ω/m) and the same run drops to about **2.5 V, or 2.1%** — comfortably inside the limit. This is the single most common real-world fix: the current, length and voltage are fixed by the job, so you buy back margin with a thicker conductor.

For a **three-phase** contrast, take **30 A at 400 V** over **50 m** of 6 AWG copper (0.0013 Ω/m). Because three-phase uses the √3 factor:

> drop = 1.732 × 30 A × 0.0013 Ω/m × 50 m ≈ **3.4 V** (about **0.8%**)

Notice how much healthier three-phase looks: higher voltage plus the √3 factor keeps the percentage tiny even over a long run. That is why long, high-current distribution is so often done at higher voltages.

## How to reduce voltage drop

If your run exceeds the limit, you have four levers:

1. **Use a thicker wire** (a lower AWG number). Roughly doubling the cross-sectional area halves the drop — the most common fix.
2. **Shorten the run** where you can, or move the source closer to the load.
3. **Use copper instead of aluminium** — copper has ~1.6× less resistance for the same gauge.
4. **Raise the system voltage** if the design allows, since the same watts at a higher voltage means less current and less drop.

## Voltage drop is not the same as ampacity

A wire has two separate size limits, and it is easy to confuse them. **Ampacity** is how much current the conductor can carry before it overheats — a safety limit set by insulation temperature ratings. **Voltage drop** is a performance limit about how much voltage survives the trip. A conductor can be perfectly safe on ampacity yet still drop too much voltage on a long run, which is exactly why a 30 m branch circuit sometimes needs a wire larger than the breaker alone would suggest. Always size for the *stricter* of the two: pick the gauge that satisfies ampacity **and** keeps drop under your target.

The dropped voltage also has a real energy cost. The voltage lost across the cable, multiplied by the current, is power dissipated as heat (P = drop × current, equivalently I²R). In the first worked example above, 3.9 V across 20 A is roughly 78 W turned into heat in the wire — energy you pay for but never use. Cutting voltage drop cuts that waste at the same time.

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
