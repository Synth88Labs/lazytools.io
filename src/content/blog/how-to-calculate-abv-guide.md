---
title: "How to Calculate ABV: Original Gravity, Final Gravity and Alcohol"
description: "Your beer's alcohol content is hiding in two hydrometer readings. Here's what original and final gravity mean, the simple formula that turns them into ABV, when to reach for the more accurate one, and the mistakes that throw the number off."
pubDate: 2026-07-12
updatedDate: 2026-07-12
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

## The mistakes that throw it off

The formula is simple; the measurement is where it goes wrong:

- **Temperature.** Hydrometers are calibrated at one temperature (often 20 °C / 68 °F). A warm sample reads low. Either cool the sample or use a [temperature correction](/brewing/hydrometer-temperature-correction/).
- **Using a refractometer for FG.** Alcohol bends light differently from sugar, so a refractometer reads final gravity too high once fermentation has started. You must apply a [refractometer correction](/brewing/refractometer-calculator/).
- **Reading FG too early.** If fermentation hasn't finished, FG is still falling and your ABV will be understated. Confirm with two stable readings a few days apart.

## Let the tool do the arithmetic

Pop your two gravities into the [ABV calculator](/brewing/abv-calculator/) and it returns the ABV (both formulas), the attenuation and the calories per serving — no mental maths on brew day. Like every LazyTools tool, it runs entirely in your browser, nothing uploaded, and works offline in the brewhouse.

---

*ABV from gravity uses the standard homebrew formula (OG − FG) × 131.25, with Michael Hall's equation for higher-gravity beers. Both are estimates dependent on accurate, temperature-corrected gravity readings. Sources: [Brewer's Friend ABV Calculator](https://www.brewersfriend.com/abv-calculator/), Michael Hall, "Brew by the Numbers," Zymurgy (1995).*
