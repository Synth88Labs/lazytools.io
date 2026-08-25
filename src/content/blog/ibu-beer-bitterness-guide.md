---
title: "IBU Explained: Why Your 60 IBU Beer Doesn't Taste Twice as Bitter as a 30"
seoTitle: 'IBU Explained: Beer Bitterness & BU:GU'
description: "IBU measures iso-alpha acids in mg/L, but perceived bitterness depends on malt too. How the Tinseth formula works and why BU:GU predicts balance."
pubDate: 2026-07-18
updatedDate: 2026-07-18
archetype: explainer
heroImage: /blog/ibu-beer-bitterness-guide.png
heroAlt: "A chart showing that bitterness units divided by gravity units gives beer balance, with under 0.5 malt-forward, 0.5 to 0.8 balanced and above 0.8 hop-forward."
tools: ["/brewing/ibu-calculator/", "/brewing/abv-calculator/", "/brewing/beer-color-srm-ebc-calculator/"]
keywords:
  - IBU explained
  - what is IBU in beer
  - tinseth formula
  - hop utilization
  - BU GU ratio
  - perceived bitterness beer
faqs:
  - q: "What does IBU actually measure?"
    a: "IBU (International Bitterness Units) measures the concentration of dissolved iso-alpha acids in finished beer, expressed in milligrams per litre. It is a chemical measurement, not a direct score of how bitter the beer tastes."
  - q: "Why doesn't a 60 IBU beer taste twice as bitter as a 30 IBU beer?"
    a: "Perceived bitterness depends on more than iso-alpha acid concentration. Malt sweetness pushes back against bitterness on the palate, so a high-gravity 60 IBU beer can taste sweeter and more balanced than a dry 30 IBU one."
  - q: "What is the BU:GU ratio and why does it matter?"
    a: "BU:GU is bitterness units divided by gravity units, and it predicts balance better than IBU alone. As a rough guide, below 0.5 is malt-forward, 0.5 to 0.8 is balanced, and above 0.8 is hop-forward."
  - q: "Why do late hop and dry-hop additions add so little bitterness?"
    a: "Bitterness comes from isomerising alpha acids into iso-alpha acids, which needs prolonged heat. Late boil, flameout and whirlpool additions contribute mostly aroma oils, and dry hopping adds essentially no IBU because there is no heat to drive isomerisation."
  - q: "Why does a high-gravity beer need more hops for the same IBU?"
    a: "Higher wort gravity lowers hop utilisation. In the Tinseth formula this is captured by the bigness factor, so a strong IPA converts a smaller fraction of its alpha acids and needs more hops to reach the same measured IBU."
  - q: "What is the Tinseth formula?"
    a: "Glenn Tinseth's 1997 model estimates IBU as utilisation times (alpha acid percent times grams times 1000) divided by (litres times 100), where utilisation combines a bigness factor for wort gravity and a boil-time factor. It is the homebrewing standard for predicting bitterness."
draft: false
---

**IBU (International Bitterness Units) measures the concentration of iso-alpha acids in your finished beer, in milligrams per litre.** It's a real chemical measurement — but it is a poor predictor of how bitter a beer *tastes*, because malt sweetness pushes back against bitterness on the palate. A 60 IBU barleywine can taste sweeter than a 30 IBU dry pilsner. The ratio that actually predicts balance is **BU:GU** — bitterness units divided by gravity units.

<aside class="key-takeaways">

**Key takeaways**

- **IBU = mg/L of iso-alpha acids.** A measurement, not a taste score.
- Hop bitterness comes from **isomerisation** during the boil — it needs time and heat.
- **Higher wort gravity → lower utilisation.** A big IPA needs more hops for the same IBU.
- **Late additions add flavour and aroma, not much bitterness.** A 5-minute hop contributes a fraction of a 60-minute one.
- **BU:GU** predicts balance: **<0.5** malt-forward, **0.5–0.8** balanced, **>0.8** hop-forward.
- Sulfate:chloride, final gravity, roast malt and carbonation all shift *perceived* bitterness.

</aside>

<figure>
<img src="/blog/infographic-ibu.svg" alt="Bitterness units divided by gravity units gives the BU to GU ratio: below 0.5 is malt-forward, 0.5 to 0.8 is balanced, and above 0.8 is hop-forward. Gravity units equal original gravity minus one times one thousand." width="1200" height="700" loading="lazy" />
<figcaption>The same IBU lands very differently depending on how much malt it's balancing against.</figcaption>
</figure>

## Where bitterness actually comes from

Raw hops aren't very bitter. The alpha acids in them are barely soluble in wort — they have to be **isomerised** into iso-alpha acids by prolonged heat before they dissolve and taste bitter.

That single fact drives everything about hopping:

- **Boil time matters most.** Isomerisation takes time, so a 60-minute addition converts far more alpha acid than a 10-minute one.
- **Late hops are for aroma.** A flameout or whirlpool addition contributes volatile oils — citrus, pine, tropical fruit — while adding comparatively little measurable bitterness.
- **Dry hopping adds essentially no IBU.** There's no heat, so no isomerisation. A heavily dry-hopped IPA can smell intensely hoppy while measuring modestly.

## The Tinseth formula

Glenn Tinseth's 1997 model is the homebrewing standard because it captures the two variables that matter:

> **IBU = utilisation × (alpha acid % × grams × 1000) ÷ (litres × 100)**

Where utilisation is the product of two factors:

- **Bigness factor** = 1.65 × 0.000125^(gravity − 1)
- **Boil time factor** = (1 − e^(−0.04 × minutes)) ÷ 4.15

Two behaviours fall out of that maths:

**1. Denser wort extracts less.** The bigness factor shrinks as gravity rises, so a 1.070 IPA gets meaningfully less bitterness from the same hops than a 1.040 bitter would. Strong beers need disproportionately more hops to hit a given IBU.

**2. Utilisation plateaus.** The boil-time factor is an exponential approach to a limit — most of the available bitterness is extracted in the first 45–60 minutes. Boiling for 90 minutes instead of 60 adds relatively little extra IBU, which is why 60 minutes is the conventional bittering addition.

The [IBU calculator](/brewing/ibu-calculator/) runs Tinseth across your whole hop schedule.

## What each addition actually does

| Addition time | Main contribution | Rough share of bitterness |
| --- | --- | --- |
| 60 min | Clean bittering | Most of the IBU |
| 30 min | Bittering + some flavour | Moderate |
| 15 min | Flavour | Modest |
| 5 min / flameout | Aroma | Small |
| Whirlpool (sub-boiling) | Aroma, some isomerisation | Small but not zero |
| Dry hop | Aroma only | Essentially none |

## BU:GU — the number that predicts balance

Bitterness is only half the equation. Residual malt sugar tastes sweet and directly counteracts perceived bitterness, so the useful measure is bitterness **relative to** malt.

> **Gravity units (GU) = (OG − 1) × 1000** → an OG of 1.055 gives 55 GU
> **BU:GU = IBU ÷ GU**

| BU:GU | Character | Typical styles |
| --- | --- | --- |
| **< 0.5** | Malt-forward, sweeter | Barleywine, Scotch ale, bock |
| **0.5 – 0.8** | Balanced | Pale ale, amber, many lagers |
| **> 0.8** | Hop-forward, bitter | IPA, double IPA |

This explains the headline. A 60 IBU barleywine at 1.100 (100 GU) has a BU:GU of 0.6 — balanced, even a touch malty. A 30 IBU pilsner at 1.045 (45 GU) sits at 0.67 and, with almost no residual sweetness, drinks noticeably crisp and bitter. The bigger IBU number is the *less* bitter-tasting beer.

Calculate your gravity figures with the [ABV calculator](/brewing/abv-calculator/).

## Why the measured number still misleads

Even BU:GU is an approximation. Perceived bitterness is also pushed around by:

- **Final gravity.** Two beers with the same OG but different attenuation taste very different; the drier one tastes more bitter.
- **Sulfate-to-chloride balance.** Sulfate accentuates and sharpens hop bitterness; chloride rounds and softens it, emphasising malt. Same recipe, different water, different perception.
- **Roasted malt.** Roast bitterness stacks with hop bitterness on the palate but contributes zero IBU.
- **Carbonation.** Higher carbonation makes bitterness read as sharper and more assertive.
- **Hop character and age.** Old or poorly stored hops lose alpha acid, so your calculated IBU may overstate reality.

There's also a practical ceiling: beer becomes saturated with iso-alpha acids somewhere in the region of 100 IBU, so a "1,000 IBU" claim on a can is marketing rather than a dissolved measurement — much of that hop matter never makes it into solution.
