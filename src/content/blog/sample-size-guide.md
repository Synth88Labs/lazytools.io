---
title: "How Many People Do You Need to Survey? Sample Size Explained"
description: "The sample size for a proportion is n = z²·p(1−p) / E². At 95% confidence with a ±5% margin you need 385 responses — whether your population is 20,000 or 20 million. Why p = 0.5 is the safe choice, why halving the margin quadruples n, and when population size matters."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/statistics/sample-size-calculator/", "/statistics/confidence-interval-calculator/", "/statistics/normal-distribution-calculator/"]
keywords:
  - sample size calculator
  - survey sample size
  - how many people to survey
  - sample size formula
  - margin of error sample size
  - statistically significant sample size
heroImage: /blog/sample-size-guide.png
heroAlt: "How to calculate survey sample size from confidence level and margin of error"
faqs:
  - q: "How many people do I need to survey?"
    a: "Use n = z²·p(1−p) / E². For the usual 95% confidence, a ±5% margin of error and the conservative p = 0.5, you need about 385 responses. Tighten the margin to ±3% and it rises to about 1,068; loosen it to ±10% and it falls to about 97."
  - q: "Why is 385 the magic survey number?"
    a: "It is n = 1.96² × 0.5 × 0.5 / 0.05² = 384.16, rounded up. That combination — 95% confidence, ±5% margin, and the worst-case proportion of 0.5 — is the default for a general-population survey, which is why 385 (often quoted as ~400) appears so often."
  - q: "What proportion (p) should I use if I don't know it?"
    a: "Use 0.5. The term p(1−p) is largest at p = 0.5, so it produces the biggest — most conservative — sample size. That guarantees your margin of error will be no worse than planned, whatever the true proportion turns out to be. If you have a reliable prior estimate far from 0.5, a smaller sample suffices."
  - q: "Does the size of my population matter?"
    a: "Surprisingly little for large populations. A 95%/±5% survey needs about 385 responses whether the population is 20,000 or 20 million. Population size only matters, via the finite-population correction, when your sample is a large fraction of a small population."
  - q: "How does the margin of error change the sample size?"
    a: "The sample size grows with the inverse square of the margin: n ∝ 1/E². Halving the margin of error (say from ±5% to ±2.5%) roughly quadruples the number of responses you need. That is why very tight margins get expensive fast."
  - q: "Is a bigger sample always more statistically significant?"
    a: "A bigger sample narrows the margin of error and makes estimates more precise, but 'significance' is about a specific hypothesis test, not sample size alone. Past the point where your margin is tight enough for the decision at hand, extra responses add little — which is exactly what the sample-size formula tells you."
draft: false
---

**For a survey, the sample size you need is `n = z²·p(1−p) / E²`.** Plug in the standard 95% confidence
(z = 1.96), the conservative proportion p = 0.5, and a ±5% margin of error, and you get **385 responses**
— the number behind almost every "we surveyed ~400 people" you have ever read. Remarkably, that figure
barely changes whether your population is a town of 20,000 or a country of 20 million.

<aside class="key-takeaways">

**Key takeaways**

- Sample size for a proportion: **n = z²·p(1−p) / E²**.
- **95% confidence + ±5% margin + p = 0.5 → 385** respondents.
- Use **p = 0.5 when the proportion is unknown** — it gives the largest, safest sample.
- **Halving the margin of error ≈ quadruples** the sample (n ∝ 1/E²).
- **Population size barely matters** for large groups; the finite-population correction only helps for small ones.

</aside>

## The formula and a worked example

<figure>
<img src="/blog/infographic-sample-size.svg" alt="Infographic: survey sample size formula n equals z squared times p times one minus p divided by E squared, where z is the critical value, p the expected proportion (use 0.5 if unknown), and E the margin of error. Worked example at 95 percent confidence with z 1.96, p 0.5 and E 0.05 gives n 385. Table of sample sizes at 95 percent confidence: margin of 10 percent needs 97, 5 percent needs 385, 3 percent needs 1068, 2 percent needs 2401, 1 percent needs 9604. Halving the margin roughly quadruples n." width="1200" height="640" loading="lazy" />
<figcaption>Three inputs — confidence, expected proportion, margin — set the sample size.</figcaption>
</figure>

Three quantities go in:

- **z** — the critical value for your confidence level (1.96 for 95%, from the
  [normal distribution](/statistics/normal-distribution-calculator/)).
- **p** — the proportion you expect to find (the share who say "yes"). Use **0.5** if you have no idea.
- **E** — the margin of error you can live with (the ± band around your result).

At 95% confidence with p = 0.5 and E = 0.05:

> n = 1.96² × 0.5 × 0.5 / 0.05² = 0.9604 / 0.0025 = **384.16 → 385**

Always round **up** — you cannot survey a fraction of a person, and rounding down would widen your margin.

## Why 0.5 is the safe default

The only place your unknown answer enters the formula is the term **p(1 − p)**, and that product is
*largest* when p = 0.5 (it equals 0.25). Any other value — 0.3, 0.8 — makes it smaller and so demands
*fewer* respondents. By assuming 0.5 you compute the **worst case**, guaranteeing your realised margin of
error will be no *worse* than you planned no matter how the responses actually split. If you have solid
prior data (say a previous poll found 15%), you can plug that in and justify a smaller sample.

## How the margin of error drives the cost

Because E is squared in the denominator, **precision is expensive**:

| Margin of error (95% conf.) | Responses needed |
|---|---|
| ±10% | 97 |
| ±5% | 385 |
| ±3% | 1,068 |
| ±2% | 2,401 |
| ±1% | 9,604 |

Halving the margin — from ±5% to ±2.5% — roughly **quadruples** the sample. This is the single most
important intuition to carry into planning: a modestly tighter estimate can cost several times as many
responses. The [sample-size calculator](/statistics/sample-size-calculator/) lets you slide the margin
and watch n move before you commit a budget.

## The counter-intuitive part: population size

Most people assume surveying a country needs a far bigger sample than surveying a company. It doesn't.
The basic formula has **no population term at all** — 385 responses give a ±5% margin whether you are
sampling 20,000 people or 20 million. Population size only enters through the **finite-population
correction**, which *reduces* the required sample when it would otherwise be a large fraction of a small
group. Surveying 500 people about a 600-member club? The correction meaningfully lowers n. Surveying a
city? It changes nothing worth noting.

## From sample size to confidence interval

Sample size and confidence interval are the same calculation run in opposite directions. Sample size
asks *"how many responses for this margin?"*; a [confidence interval](/statistics/confidence-interval-calculator/)
asks *"given the responses I collected, what is the margin?"* Plan with one, report with the other — and
both rest on the same critical z from the normal distribution.

## Quick summary

Survey sample size for a proportion is `n = z²·p(1−p) / E²`. For the everyday case — 95% confidence, ±5%
margin, unknown proportion — that is **385 respondents**, and it holds across almost any large population.
Use p = 0.5 when unsure, remember that halving the margin quadruples the sample, and only worry about
population size for small groups. Work out your own number with the
[sample-size calculator](/statistics/sample-size-calculator/).

*Sources: the standard sample-size formula for estimating a proportion (Cochran's formula) and the
finite-population correction, as taught in introductory statistics and survey methodology. Educational
information — not a substitute for a statistician on a high-stakes study.*
