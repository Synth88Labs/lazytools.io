---
title: "How to Calculate ABV: Original Gravity, Final Gravity and Alcohol"
seoTitle: 'How to Calculate ABV from Gravity Readings'
description: "Calculate ABV from two hydrometer readings: ABV = (OG − FG) × 131.25. What original and final gravity mean, the formula, and when to use the accurate one."
pubDate: 2026-07-12
updatedDate: 2026-08-23
archetype: explainer
tools: ["/brewing/abv-calculator/", "/brewing/hydrometer-temperature-correction/", "/brewing/refractometer-calculator/"]
keywords:
  - how to calculate abv
  - abv formula
  - original gravity final gravity
  - abv from gravity
  - homebrew alcohol calculation
  - what is abv in brewing
heroImage: /blog/how-to-calculate-abv-guide.png
heroAlt: "Original gravity 1.050 before fermentation and final gravity 1.010 after, giving 5.25% ABV via the formula (OG − FG) × 131.25"
faqs:
  - q: "How do I calculate ABV?"
    a: "Take a gravity reading before fermentation (original gravity, OG) and after (final gravity, FG), then ABV = (OG − FG) × 131.25. For OG 1.050 and FG 1.010 that's (0.040) × 131.25 ≈ 5.25% ABV."
  - q: "What are original gravity and final gravity?"
    a: "Original gravity (OG) is the density of the wort before fermentation, when it's full of sugar. Final gravity (FG) is the density after, once the yeast has turned most of that sugar into alcohol. Both are measured with a hydrometer or refractometer."
  - q: "What is the 131.25 in the ABV formula?"
    a: "A conversion constant that turns the gravity drop into a percentage of alcohol by volume. It's the widely accepted homebrew value (some round to 131 or 132); it works because the amount of alcohol produced is proportional to how much the gravity fell."
  - q: "Which ABV formula is more accurate?"
    a: "For beers below about 1.070 OG, the simple (OG − FG) × 131.25 is fine. For strong beers it reads low, so use Michael Hall's formula: ABV = [76.08 × (OG − FG) / (1.775 − OG)] × (FG / 0.794). The calculator shows both."
  - q: "Why is my ABV reading wrong?"
    a: "Usually a gravity-measurement error: readings taken at the wrong temperature (correct for it), a refractometer used after fermentation (alcohol skews it — use the correction tool), or not letting fermentation fully finish before taking FG."
  - q: "Do I need both readings to get ABV?"
    a: "Yes — ABV comes from the difference between them, so you must measure OG before pitching yeast and FG when fermentation is done. If you forgot the OG, you can only estimate it from the recipe, which makes the ABV a guess."
draft: false
---

**Your beer's alcohol content is the gap between two numbers.** Measure the wort's density before the yeast goes in, measure it again when fermentation is done, and the drop tells you how much sugar became alcohol. One subtraction and one multiplication, and you have the ABV.

<aside class="key-takeaways">

**Key takeaways**

- **ABV = (OG − FG) × 131.25** — the drop in gravity, scaled to a percentage.
- **OG** (original gravity) is measured *before* fermentation; **FG** (final gravity) *after*.
- **Example:** (1.050 − 1.010) × 131.25 ≈ **5.25% ABV**.
- **For strong beers (OG > ~1.070)**, use the more accurate formula — the simple one reads low.
- **Measure at the right temperature**, and don't use a refractometer for FG without correcting for alcohol.

</aside>

<figure>
<img src="/blog/infographic-how-to-calculate-abv.svg" alt="Before fermentation the original gravity is 1.050 (lots of sugar, denser); yeast eats the sugar and makes alcohol and CO2; after fermentation the final gravity is 1.010 (lighter). ABV = (OG − FG) × 131.25, and the worked example (1.050 − 1.010) × 131.25 = 5.25% ABV, with a note that strong beers above 1.070 need a more accurate formula." width="1200" height="640" loading="lazy" />
<figcaption>Two readings and a constant — the gravity drop is the alcohol.</figcaption>
</figure>

## What gravity is measuring

"Gravity" here is **specific gravity** — how dense the liquid is compared to water (which is 1.000). Sugar dissolved in water makes it denser, so sugary wort reads well above 1.000, around 1.040–1.060 for a typical beer.

When yeast ferments, it eats that sugar and produces alcohol and CO₂. Alcohol is *less* dense than water, and the sugar is disappearing, so the liquid gets lighter and the gravity falls. That fall is the fingerprint of fermentation — and the bigger the fall, the more alcohol was made.

## The two readings

- **Original Gravity (OG)** — taken *before* you pitch the yeast, when the wort is full of sugar. This is your starting point.
- **Final Gravity (FG)** — taken *after* fermentation finishes, when the yeast has converted most of the sugar. A typical beer lands around 1.008–1.014.

You need both, because ABV comes from the *difference*. Forget the OG and you're left estimating from the recipe.

A quick reality check on what these numbers look like for a healthy ferment: OG sits well above 1.000 because the wort is loaded with sugar, and FG lands only a little above 1.000 once the yeast has done its work. If your FG is still close to your OG after a couple of weeks, fermentation stalled — that's a yeast or temperature problem, not a maths one.

## The formula

Once you have both:

```
ABV% = (OG − FG) × 131.25
```

For our example, OG 1.050 and FG 1.010:

`(1.050 − 1.010) × 131.25 = 0.040 × 131.25 = 5.25% ABV`

The **131.25** is a conversion constant (you'll see 131 or 132 in some places) that turns the gravity drop into a percentage. It works because the alcohol produced is closely proportional to how far the gravity fell.

## When the simple formula isn't enough

That linear formula is accurate for everyday beers, but for **strong beers — above roughly 1.070 OG — it reads a little low**. For those, use Michael Hall's more accurate equation:

```
ABV = [76.08 × (OG − FG) / (1.775 − OG)] × (FG / 0.794)
```

It accounts for the non-linear relationship at high gravity. The [ABV calculator](/brewing/abv-calculator/) shows both side by side, so you can see how much they diverge for your beer (they agree closely for session beers and separate for big ones).

## How the two formulas compare across styles

The table below runs a handful of common beer strengths through both equations. The figures are illustrative gravities for each style, not fixed values — your recipe will differ — but they show the pattern clearly: the two formulas track each other for light beers and drift apart as gravity climbs.

| Style (illustrative) | OG | FG | Simple × 131.25 | Michael Hall |
|---|---|---|---|---|
| Session lager | 1.035 | 1.008 | 3.5% | 3.5% |
| Standard pale ale | 1.050 | 1.012 | 5.0% | 5.1% |
| IPA | 1.065 | 1.012 | 7.0% | 7.2% |
| Imperial stout | 1.090 | 1.022 | 8.9% | 9.7% |

For the pale ale the gap is a rounding error; for the imperial stout it's nearly a full percentage point. That's why the simple formula is fine for everyday brewing but worth double-checking on anything big — an extra 0.8% ABV is the difference between what your label says and what your guests actually feel.

## Attenuation: the other number in the gravity drop

The same two readings tell you how *far* the yeast fermented, which brewers call **apparent attenuation**:

```
Apparent attenuation % = (OG − FG) / (OG − 1) × 100
```

For OG 1.050 and FG 1.010 that's 0.040 / 0.050 = **80%**. Most ale yeasts finish somewhere in the 70–80% range, so 80% is a clean, complete ferment. A low number (say 60%) is a red flag that fermentation stalled or the wort was full of unfermentable sugars — either way, your ABV will come in below what the recipe promised. It's called *apparent* attenuation because the alcohol in the finished beer skews the hydrometer slightly; the true figure is a touch lower, but apparent attenuation is what brewers track day to day.

## ABV vs ABW, and the Plato scale

Two conversions trip people up:

- **ABV vs ABW.** Alcohol by volume is the standard on beer labels. Alcohol by weight (ABW) is smaller for the same beer because ethanol is lighter than water — as a rough rule, ABW is about four-fifths of ABV. A 5.0% ABV beer is roughly 4% ABW. If a number looks surprisingly low, check which one you're reading.
- **Plato / Brix instead of gravity.** Some brewers and most of the commercial world measure sugar in degrees Plato (°P) or Brix rather than specific gravity. They describe the same wort; a rough conversion is that four gravity "points" (e.g. 1.048 → 48 points) is close to one degree Plato near normal beer strengths, though the relationship isn't perfectly linear. Convert to specific gravity first, then apply the ABV formula — don't feed Plato numbers straight into it.

## The mistakes that throw it off

The formula is simple; the measurement is where it goes wrong:

- **Temperature.** Hydrometers are calibrated at one temperature — commonly 20 °C / 68 °F, though some older instruments use 15.6 °C / 60 °F, so check yours. A warm sample is less dense and reads low; a cold sample reads high. Either bring the sample to the calibration temperature or use a [temperature correction](/brewing/hydrometer-temperature-correction/). The error is small when you're a few degrees off, but grows fast if you read a hot sample straight off the boil.
- **Using a refractometer for FG.** Alcohol bends light differently from sugar, so a refractometer reads final gravity too high once fermentation has started. You must apply a [refractometer correction](/brewing/refractometer-calculator/).
- **Reading FG too early.** If fermentation hasn't finished, FG is still falling and your ABV will be understated. Confirm with two stable readings a few days apart.

## Let the tool do the arithmetic

Pop your two gravities into the [ABV calculator](/brewing/abv-calculator/) and it returns the ABV (both formulas), the attenuation and the calories per serving — no mental maths on brew day. Like every LazyTools tool, it runs entirely in your browser, nothing uploaded, and works offline in the brewhouse.

---

*ABV from gravity uses the standard homebrew formula (OG − FG) × 131.25, with Michael Hall's equation for higher-gravity beers. Both are estimates dependent on accurate, temperature-corrected gravity readings. Sources: [Brewer's Friend ABV Calculator](https://www.brewersfriend.com/abv-calculator/), Michael Hall, "Brew by the Numbers," Zymurgy (1995).*
