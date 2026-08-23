---
title: "Is Your A/B Test Result Real? Significance, p-values and Effect Size"
description: "A green 'winner' isn't enough — a real result needs a small p-value AND a meaningful effect size, from an honest test. Here's how the two-proportion z-test, p-values and Cohen's d fit together, with calculators that run in your browser."
pubDate: 2026-08-01
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/ab-test-significance-p-values-effect-size-guide.png
heroAlt: "How A/B test significance works — conversion rates, a z-test p-value, and effect size together"
tools: ["/statistics/ab-test-significance-calculator/", "/statistics/z-test-calculator/", "/statistics/effect-size-calculator/"]
keywords:
  - ab test significance
  - is my ab test significant
  - two proportion z test
  - p-value explained
  - effect size cohen's d
  - z-test vs t-test
  - statistical significance calculator
faqs:
  - q: "How do I know if my A/B test is statistically significant?"
    a: "Compare the two variants' conversion rates with a two-proportion z-test. It produces a p-value; if that p-value is below your significance level (commonly 0.05), the difference is unlikely to be due to chance and is called statistically significant. The LazyTools A/B Test Significance Calculator does this from your conversions and visitor counts, in your browser."
  - q: "What does the p-value actually mean?"
    a: "The p-value is the probability of seeing a difference at least as large as yours if there were truly no difference between the variants (the null hypothesis). A small p-value means such data would be unlikely under 'no effect,' so you reject that idea. It is NOT the probability that your variant is better, and not the size of the effect."
  - q: "What's the difference between a z-test and a t-test?"
    a: "Both test whether means or proportions differ. A z-test assumes the population standard deviation is known (or the sample is large enough that it's effectively known), and uses the normal distribution — which is why proportion-based A/B tests use a z-test. A t-test is for comparing means when the standard deviation is estimated from a smaller sample, using the t-distribution to account for that extra uncertainty."
  - q: "Why do I need effect size if I already have a p-value?"
    a: "Because a p-value only tells you whether a difference is detectable, not how big it is. With a large enough sample, a trivial difference becomes 'significant'; with a small sample, a large one can miss significance. Effect size (like Cohen's d for means) measures the magnitude, so you can judge whether a real difference is also a meaningful one."
  - q: "Why shouldn't I stop my A/B test as soon as it goes green?"
    a: "Repeatedly checking and stopping the instant p < 0.05 ('peeking') dramatically inflates false positives — you'll declare winners that aren't real. Decide the sample size before you start and evaluate once you reach it, or use a method built for sequential testing. Significance found by peeking is unreliable."
  - q: "Are these significance calculations done privately?"
    a: "Yes — the LazyTools A/B test, z-test and effect-size calculators run entirely in your browser using JavaScript. Your experiment data is never uploaded, and the tools work offline."
draft: false
---

**A green "winner" badge isn't proof: a trustworthy A/B result needs a small p-value (the difference
is unlikely to be chance) *and* an effect size big enough to matter — from a test you didn't stop the
moment it looked good.** Those are three separate questions, and conflating them is how teams ship
changes that don't actually help. Here's how significance, p-values and effect size fit together, with
the [A/B Test Significance Calculator](/statistics/ab-test-significance-calculator/),
[Z-Test Calculator](/statistics/z-test-calculator/) and
[Effect Size Calculator](/statistics/effect-size-calculator/) to run the numbers in your browser.

<aside class="key-takeaways">

**Key takeaways**

- Statistical significance answers one narrow question — "is this difference unlikely to be random?" — not "is this change worth shipping?"
- A trustworthy A/B result needs three things: a small p-value, an effect size big enough to matter commercially, and a test whose sample size was fixed in advance.
- The p-value is *not* the probability your variant is better and *not* the size of the lift — it is computed under the assumption that the variants are identical.
- Proportion-based A/B tests use a two-proportion z-test; comparing average values from smaller samples calls for a t-test instead.
- "Peeking" — stopping the moment the dashboard turns green — inflates false positives, so decide when you will look before you start.

</aside>

## Step 1: is the difference beyond chance? (the z-test)

An A/B test compares two conversion rates — say 20% for A and 30% for B. The question is whether that
10-point gap reflects a real difference or just the luck of which visitors landed where. The standard
answer is a **two-proportion z-test**: it pools the two rates, computes how many standard errors apart
they are (the **z statistic**), and converts that to a **p-value**.

> The p-value is the probability of a difference at least this large *if the two variants were truly
> identical.*

A small p-value (below your chosen threshold α, usually 0.05) means "this data would be surprising if
there were no real difference," so you reject the idea of no difference.

<figure class="my-8">
<svg viewBox="0 0 1200 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three checks for a real A/B result: rates and z-test, p-value below alpha, and a meaningful effect size" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="52" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#0f172a">Three checks for a real result</text>

  <rect x="50" y="100" width="350" height="320" rx="16" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="225" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26" font-weight="800" fill="#1e40af">1 · Difference</text>
  <text x="225" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#1e40af">two-proportion z-test</text>
  <text x="225" y="250" text-anchor="middle" font-family="ui-monospace,monospace" font-size="30" font-weight="800" fill="#1e3a8a">A 20% · B 30%</text>
  <text x="225" y="300" text-anchor="middle" font-family="ui-monospace,monospace" font-size="26" fill="#1e40af">z = −2.31</text>
  <text x="225" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#3b82f6">how far apart, in std errors</text>

  <rect x="425" y="100" width="350" height="320" rx="16" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="600" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26" font-weight="800" fill="#047857">2 · Chance?</text>
  <text x="600" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#047857">p-value vs α</text>
  <text x="600" y="255" text-anchor="middle" font-family="ui-monospace,monospace" font-size="30" font-weight="800" fill="#065f46">p = 0.021</text>
  <text x="600" y="300" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" fill="#047857">0.021 &lt; 0.05 ✓</text>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#10b981">unlikely to be chance</text>

  <rect x="800" y="100" width="350" height="320" rx="16" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="975" y="150" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26" font-weight="800" fill="#b45309">3 · Big enough?</text>
  <text x="975" y="188" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#b45309">effect size</text>
  <text x="975" y="255" text-anchor="middle" font-family="ui-monospace,monospace" font-size="28" font-weight="800" fill="#92400e">+10 points</text>
  <text x="975" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#b45309">worth shipping?</text>
  <text x="975" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#f59e0b">magnitude, not just p</text>
</svg>
</figure>

### A worked example you can check by hand

Suppose each variant gets **200 visitors**. Variant A converts **40** of them (20%) and variant B
converts **60** (30%). To run the two-proportion z-test:

1. **Pool the rates.** Combined conversion is (40 + 60) / (200 + 200) = 100 / 400 = **0.25**.
2. **Standard error.** SE = √[ 0.25 × 0.75 × (1/200 + 1/200) ] = √0.001875 ≈ **0.0433**.
3. **z statistic.** z = (0.30 − 0.20) / 0.0433 ≈ **2.31** — the two rates sit about 2.3 standard
   errors apart.
4. **p-value.** A z of 2.31 corresponds to a two-sided **p ≈ 0.021**, comfortably below the usual
   α = 0.05.

So this test *is* statistically significant: a 10-point gap this large would show up only about 2% of
the time if the variants were truly identical. Halve the traffic to 100 visitors per side and the same
20%-vs-30% split gives z ≈ 1.63 and p ≈ 0.10 — the identical lift is no longer significant, purely
because the sample is smaller. That sensitivity to sample size is exactly why the next two steps
matter. The [A/B Test Significance Calculator](/statistics/ab-test-significance-calculator/) does all
four steps for you.

## Step 2: what the p-value is *not*

Two misreadings cause most bad decisions:

- **A p-value is not the chance your variant is better.** It's computed *assuming no difference*. `p =
  0.02` means "data this extreme is 2% likely if the variants are identical" — not "98% chance B wins."
- **A p-value is not the size of the effect.** It blends the effect and the sample size. Which leads
  straight to the third check.

## Step 3: is it big enough to matter? (effect size)

Significance scales with sample size. Feed a million visitors into a test and a **0.1-point** lift can
be "highly significant" — and commercially pointless. Run 50 visitors and a **10-point** lift can miss
significance entirely. That's why significance alone is a trap.

**Effect size** measures magnitude independent of n. For two means, [Cohen's
d](/statistics/effect-size-calculator/) expresses the gap in pooled-standard-deviation units (≈0.2
small, 0.5 medium, 0.8 large). For an A/B test, the plain **percentage-point lift** is the effect that
matters — read it next to the p-value, never instead of it.

Cohen's original benchmarks are rules of thumb, not laws; a "small" effect can be hugely valuable at
scale, and a "large" one can be irrelevant if it moves a metric nobody cares about. Use them as a
starting sense of magnitude, then judge against your own context:

| Cohen's d | Conventional label | Rough overlap of the two groups |
|---|---|---|
| ~0.2 | small | distributions overlap heavily |
| ~0.5 | medium | a difference visible to the naked eye |
| ~0.8 | large | clearly separated distributions |

The practical habit is to pair every p-value with the effect it came from. "Significant, +0.1 points"
and "significant, +10 points" are wildly different business decisions even though both cleared α.

## z-test vs t-test: which one?

They answer the same shape of question but under different assumptions:

| | z-test | t-test |
|---|---|---|
| **Population SD** | known (or large n) | estimated from the sample |
| **Distribution** | normal | Student's t |
| **Typical use** | proportions (A/B tests), large samples | comparing means, smaller samples |

Because proportions have a known variance formula, A/B tests use the [z-test](/statistics/z-test-calculator/).
Comparing two average order values from modest samples? That's a [t-test](/statistics/t-test-calculator/).

## The cardinal sin: peeking

The fastest way to fake a significant result is to watch the dashboard and stop the moment it turns
green. Every extra peek is another chance for random noise to cross the line, and "stop at first p <
0.05" can inflate your false-positive rate several-fold. **Decide the sample size before you start**,
run to it, then evaluate once.

## Putting it together

A result you can trust clears all three bars:

1. **A z-test p-value below α** — the difference is unlikely to be chance.
2. **A meaningful effect** — the lift is big enough to be worth it.
3. **An honest test** — pre-set sample size, no peeking.

Because significance and effect size are independent, a finished test lands in one of four places —
and only one of them is a clear ship:

| | Effect is large | Effect is trivial |
|---|---|---|
| **p < α (significant)** | Ship it — real *and* worthwhile | Real but likely not worth the cost of the change |
| **p ≥ α (not significant)** | Promising — you may be underpowered; gather more data | No evidence of a useful difference |

The bottom-right and top-right cells are where teams waste the most effort: shipping changes that are
"significant" but move nothing, or chasing a flat result that was never going to pay off. Reading
p-value and effect size together keeps you out of both traps.

Run each check locally with the [A/B Test Significance
Calculator](/statistics/ab-test-significance-calculator/), the
[Z-Test Calculator](/statistics/z-test-calculator/) and the
[Effect Size Calculator](/statistics/effect-size-calculator/) — your experiment data never leaves your
browser.
