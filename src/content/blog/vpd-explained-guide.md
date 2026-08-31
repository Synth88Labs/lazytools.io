---
title: "What Is VPD? Vapor Pressure Deficit Explained (with Target Ranges)"
seoTitle: 'VPD Explained: Target Ranges by Growth Stage'
description: "VPD (vapor pressure deficit) is the number growers tune instead of humidity because it includes temperature. What it means and target ranges by stage."
pubDate: 2026-07-12
updatedDate: 2026-08-23
archetype: explainer
tools: ["/weather/vpd-calculator/", "/weather/dew-point-calculator/", "/weather/absolute-humidity-calculator/"]
keywords:
  - what is vpd
  - vapor pressure deficit
  - vpd chart
  - vpd for plants
  - grow room vpd
  - vpd target range
faqs:
  - q: "What is VPD in simple terms?"
    a: "VPD (vapour pressure deficit) is the difference between how much water vapour the air is holding and the most it could hold at leaf temperature. It's the air's drying power, a single kPa number that tells you how hard the environment is pulling moisture out of your plants' leaves."
  - q: "What is a good VPD range for plants?"
    a: "It depends on the growth stage: roughly 0.4-0.8 kPa for clones and seedlings, 0.8-1.2 kPa during vegetative growth, and 1.2-1.6 kPa in flower. Below about 0.4 kPa the air is too humid and mould-prone; above about 1.6 kPa it's too dry and plants close their stomata."
  - q: "How is VPD calculated?"
    a: "VPD = SVP(leaf temperature) − SVP(air temperature) × (RH ÷ 100), in kilopascals. SVP is the saturation vapour pressure from the Magnus equation. You compute the air's capacity at leaf temperature, subtract the vapour actually present, and the gap is the deficit."
  - q: "Is VPD better than humidity for a grow room?"
    a: "Yes, because relative humidity ignores temperature. 60% RH at 20 °C and 60% RH at 30 °C are very different growing conditions, since warm air's moisture capacity is far higher. VPD folds temperature and humidity into one figure that reflects what the plant actually experiences."
  - q: "Why do I need leaf temperature for VPD?"
    a: "Transpiration cools leaves, so a healthy leaf usually sits 1-3 °C below air temperature. Because VPD is anchored to the leaf's saturation pressure, a cooler leaf gives a lower VPD than the air-only figure. An IR thermometer measures it directly; if you can't, assuming leaves are about 2 °C cooler is a reasonable start."
  - q: "How do I lower or raise VPD?"
    a: "To lower VPD, raise humidity or lower temperature (a humidifier, or cooling the space). To raise VPD, drop humidity or warm the space (a dehumidifier, more airflow, or a higher setpoint). Because temperature and humidity interact, pick a target VPD for your stage and adjust both together until the calculator lands in the zone."
draft: false
---

**Your grow tent reads 60% humidity, but is that good?** The honest answer is "it depends on the temperature," and that's exactly the problem VPD solves. Vapor pressure deficit rolls temperature and humidity into one number that describes what the plant actually feels: how hard the air is pulling moisture out of its leaves.

<aside class="key-takeaways">

**Key takeaways**

- **VPD = the air's drying power**, the gap between the moisture the air holds and the most it *could* hold at leaf temperature.
- It's measured in **kilopascals (kPa)**; higher VPD = drier air = faster transpiration.
- **Target ranges:** clones/seedlings **0.4-0.8**, veg **0.8-1.2**, flower **1.2-1.6 kPa**.
- **Too low** (< 0.4) → weak transpiration, mould risk; **too high** (> 1.6) → stress, closed stomata.
- Because it includes temperature, VPD beats bare relative humidity as a control target.

</aside>

<figure>
<img src="/blog/infographic-vpd.svg" alt="VPD is the gap between the water vapour the air holds and the maximum it could hold at leaf temperature: VPD = SVP(leaf) − SVP(air) × RH/100, in kPa. Target ranges: below 0.4 too humid, 0.4-0.8 clones and seedlings, 0.8-1.2 vegetative, 1.2-1.6 flowering, above 1.6 too dry. Leaves run 1-3 °C cooler than air." width="1200" height="640" loading="lazy" />
<figcaption>One number that captures what humidity alone can't.</figcaption>
</figure>

## What VPD actually measures

Air has a maximum amount of water vapour it can hold, and that maximum rises steeply with temperature, warm air holds much more. **VPD is the difference between that maximum (at leaf temperature) and how much vapour the air is actually carrying.** A big deficit means thirsty air that pulls water out of leaves quickly; a small deficit means near-saturated air where transpiration stalls and condensation and mould set in.

That's why humidity alone misleads: **60% RH at 20 °C and 60% RH at 30 °C are completely different growing environments**, because the warmer air's "maximum" is so much higher. VPD captures the difference in a single figure.

## The formula

> VPD = SVP(leaf temp) − SVP(air temp) × (RH ÷ 100)

where **SVP** is the [saturation vapour pressure](https://en.wikipedia.org/wiki/Vapour_pressure_of_water), the maximum vapour pressure at a given temperature, from the Magnus equation. In practice:

1. Compute SVP at the **leaf** temperature (the air's capacity right at the leaf surface).
2. Compute the **actual** vapour pressure = SVP(air) × RH.
3. Subtract. The result, in kPa, is the deficit.

The [VPD calculator](/weather/vpd-calculator/) does all three steps from your temperature and humidity, and lets you set a leaf-temperature offset.

The **SVP** comes from the Magnus formula, a well-established approximation used across meteorology and horticulture:

> SVP(T) = 0.6108 × exp( 17.27 × T ÷ (T + 237.3) ) , result in kPa, with T in °C

That exponential term is why temperature matters so much: SVP roughly doubles for every 10 °C or so. The table below shows how quickly the air's capacity climbs, which is the whole reason a fixed humidity reading means different things at different temperatures.

| Air temp (°C) | SVP (kPa) |
|---|---|
| 15 | ~1.71 |
| 20 | ~2.34 |
| 25 | ~3.17 |
| 30 | ~4.24 |

## A worked example

Say your tent reads **25 °C and 60% RH**, and you estimate the leaves are running **2 °C cooler, at 23 °C**. Work through the three steps:

1. **SVP at the leaf (23 °C):** about **2.81 kPa**, the air's moisture capacity right at the leaf surface.
2. **Actual vapour pressure:** SVP(air at 25 °C) × RH = 3.17 × 0.60 ≈ **1.90 kPa**, the vapour the room air is genuinely holding.
3. **Subtract:** 2.81 − 1.90 ≈ **0.91 kPa**.

That 0.91 kPa sits comfortably in the vegetative zone. Notice what the leaf offset did: if you ignored it and used air temperature for both terms, you'd get 3.17 − 1.90 ≈ **1.27 kPa**, a full flowering-stage reading from the *same* thermostat and hygrometer. Same room, two different answers, and only the leaf-anchored one reflects what the plant feels.

## Why leaf temperature matters

Leaves aren't the same temperature as the air. Transpiration cools them, so a healthy leaf often runs **1-3 °C below air temperature** (under intense light it can be warmer). Since VPD is anchored to the leaf's saturation pressure, that offset shifts the result, a cooler leaf means a *lower* VPD than the air-only figure. Serious growers measure leaf temperature with an IR thermometer; if you can't, assuming leaves are ~2 °C cooler is a reasonable start.

## Target VPD by growth stage

VPD needs vary with how much root system and leaf area the plant has to support transpiration:

| Stage | VPD (kPa) | Why |
|---|---|---|
| Clones / seedlings | **0.4-0.8** | Few roots, keep the air gentle so they don't dry out |
| Vegetative | **0.8-1.2** | Growing fast, moderate transpiration drives nutrient uptake |
| Flowering / fruiting | **1.2-1.6** | Higher VPD keeps humidity down and discourages bud rot |

**Below ~0.4 kPa** the air is too humid: transpiration slows, calcium (which moves with the transpiration stream) lags, and mould and mildew thrive. **Above ~1.6 kPa** the air is too dry: the plant closes its stomata to conserve water, and growth stalls.

These ranges are widely-cited horticultural guidelines rather than hard physical constants, the exact figures vary between sources and cultivars, so treat the numbers as a target band, not a pass/fail line. Light intensity, CO₂ enrichment and the specific plant all shift the sweet spot; heavily fed, high-light plants often tolerate the upper end better.

## What too-low and too-high VPD do

The failure modes at each end are different, so it helps to know the symptoms:

| Condition | VPD | What happens |
|---|---|---|
| Too humid | below ~0.4 kPa | Transpiration nearly stops; guttation and condensation on leaves; calcium and other water-carried nutrients lag; ideal conditions for powdery mildew and bud rot |
| In range | ~0.8-1.6 kPa | Steady transpiration pulls water and nutrients up from the roots; stomata stay open; healthy, even growth |
| Too dry | above ~1.6 kPa | Stomata close to limit water loss; photosynthesis and growth slow; leaf curling, tip burn and wilting under load |

## Common mistakes

A few things trip growers up when they first switch to VPD as their control target:

- **Ignoring leaf temperature entirely.** Using air temperature for both terms overstates VPD, as the worked example shows. If you can't measure leaf temperature, at least apply a sensible offset.
- **Measuring at one spot.** A tent has gradients, near the canopy under the light is warmer and often drier than the corners. Read where the plants are.
- **Chasing a number instead of a band.** VPD naturally drifts across the day/night cycle as temperature and humidity swing. Aim to stay inside the stage's band, not to pin a single decimal.
- **Forgetting the two levers interact.** Dropping temperature to cool the room also *lowers* VPD by shrinking the deficit, sometimes the opposite of what you wanted.

## Dialing it in

To *lower* VPD (raise humidity or lower temperature): add a humidifier, or cool the space. To *raise* VPD (drop humidity or warm the space): add a dehumidifier or more airflow, or nudge the temperature up. Because the two levers interact, it's easiest to pick a target VPD for your stage and adjust temperature and humidity together until the [calculator](/weather/vpd-calculator/) lands in the zone. If you also want the actual water content of the air, the [absolute humidity calculator](/weather/absolute-humidity-calculator/) gives it in g/m³.

---

*VPD here is computed from the Magnus saturation-vapour-pressure formula in your browser; nothing is uploaded. The target ranges are widely used horticultural guidelines, not hard rules, cultivar, light intensity and CO₂ all shift the ideal, so treat them as starting points and observe your plants.*
