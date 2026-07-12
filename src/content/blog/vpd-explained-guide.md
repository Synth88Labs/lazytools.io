---
title: "What Is VPD? Vapor Pressure Deficit Explained (with Target Ranges)"
description: "VPD — vapor pressure deficit — is the single number serious growers tune instead of humidity, because it accounts for temperature. Here's what it means, how it's calculated, and the target VPD ranges for each growth stage."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/weather/vpd-calculator/", "/weather/dew-point-calculator/", "/weather/absolute-humidity-calculator/"]
keywords:
  - what is vpd
  - vapor pressure deficit
  - vpd chart
  - vpd for plants
  - grow room vpd
  - vpd target range
draft: false
---

**Your grow tent reads 60% humidity — but is that good?** The honest answer is "it depends on the temperature," and that's exactly the problem VPD solves. Vapor pressure deficit rolls temperature and humidity into one number that describes what the plant actually feels: how hard the air is pulling moisture out of its leaves.

<aside class="key-takeaways">

**Key takeaways**

- **VPD = the air's drying power** — the gap between the moisture the air holds and the most it *could* hold at leaf temperature.
- It's measured in **kilopascals (kPa)**; higher VPD = drier air = faster transpiration.
- **Target ranges:** clones/seedlings **0.4–0.8**, veg **0.8–1.2**, flower **1.2–1.6 kPa**.
- **Too low** (< 0.4) → weak transpiration, mould risk; **too high** (> 1.6) → stress, closed stomata.
- Because it includes temperature, VPD beats bare relative humidity as a control target.

</aside>

<figure>
<img src="/blog/infographic-vpd.svg" alt="VPD is the gap between the water vapour the air holds and the maximum it could hold at leaf temperature: VPD = SVP(leaf) − SVP(air) × RH/100, in kPa. Target ranges: below 0.4 too humid, 0.4–0.8 clones and seedlings, 0.8–1.2 vegetative, 1.2–1.6 flowering, above 1.6 too dry. Leaves run 1–3 °C cooler than air." width="1200" height="640" loading="lazy" />
<figcaption>One number that captures what humidity alone can't.</figcaption>
</figure>

## What VPD actually measures

Air has a maximum amount of water vapour it can hold, and that maximum rises steeply with temperature — warm air holds much more. **VPD is the difference between that maximum (at leaf temperature) and how much vapour the air is actually carrying.** A big deficit means thirsty air that pulls water out of leaves quickly; a small deficit means near-saturated air where transpiration stalls and condensation and mould set in.

That's why humidity alone misleads: **60% RH at 20 °C and 60% RH at 30 °C are completely different growing environments**, because the warmer air's "maximum" is so much higher. VPD captures the difference in a single figure.

## The formula

> VPD = SVP(leaf temp) − SVP(air temp) × (RH ÷ 100)

where **SVP** is the saturation vapour pressure — the maximum vapour pressure at a given temperature, from the Magnus equation. In practice:

1. Compute SVP at the **leaf** temperature (the air's capacity right at the leaf surface).
2. Compute the **actual** vapour pressure = SVP(air) × RH.
3. Subtract. The result, in kPa, is the deficit.

The [VPD calculator](/weather/vpd-calculator/) does all three steps from your temperature and humidity, and lets you set a leaf-temperature offset.

## Why leaf temperature matters

Leaves aren't the same temperature as the air. Transpiration cools them, so a healthy leaf often runs **1–3 °C below air temperature** (under intense light it can be warmer). Since VPD is anchored to the leaf's saturation pressure, that offset shifts the result — a cooler leaf means a *lower* VPD than the air-only figure. Serious growers measure leaf temperature with an IR thermometer; if you can't, assuming leaves are ~2 °C cooler is a reasonable start.

## Target VPD by growth stage

VPD needs vary with how much root system and leaf area the plant has to support transpiration:

| Stage | VPD (kPa) | Why |
|---|---|---|
| Clones / seedlings | **0.4 – 0.8** | Few roots — keep the air gentle so they don't dry out |
| Vegetative | **0.8 – 1.2** | Growing fast — moderate transpiration drives nutrient uptake |
| Flowering / fruiting | **1.2 – 1.6** | Higher VPD keeps humidity down and discourages bud rot |

**Below ~0.4 kPa** the air is too humid: transpiration slows, calcium (which moves with water) lags, and mould and mildew thrive. **Above ~1.6 kPa** the air is too dry: the plant closes its stomata to conserve water, and growth stalls.

## Dialing it in

To *lower* VPD (raise humidity or lower temperature): add a humidifier, or cool the space. To *raise* VPD (drop humidity or warm the space): add a dehumidifier or more airflow, or nudge the temperature up. Because the two levers interact, it's easiest to pick a target VPD for your stage and adjust temperature and humidity together until the [calculator](/weather/vpd-calculator/) lands in the zone. If you also want the actual water content of the air, the [absolute humidity calculator](/weather/absolute-humidity-calculator/) gives it in g/m³.

---

*VPD here is computed from the Magnus saturation-vapour-pressure formula in your browser; nothing is uploaded. The target ranges are widely used horticultural guidelines, not hard rules — cultivar, light intensity and CO₂ all shift the ideal, so treat them as starting points and observe your plants.*
