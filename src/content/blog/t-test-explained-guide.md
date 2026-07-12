---
title: "The t-Test Explained: One-Sample, Two-Sample and Paired"
description: "A t-test answers one question: is a difference in means real, or could it be chance? Here's how the three types work, how to pick between Welch and pooled, what the p-value actually tells you, and the mistake almost everyone makes reading a non-significant result."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/statistics/t-test-calculator/", "/statistics/chi-square-test-calculator/", "/statistics/p-value-calculator/"]
keywords:
  - t-test explained
  - how to do a t-test
  - one sample vs two sample t test
  - paired t test
  - welch vs pooled t test
  - t test p value
heroImage: /blog/t-test-explained-guide.png
heroAlt: "The t-test: t equals the difference in means over the standard error, with three types (one-sample, two-sample, paired) and the p < alpha decision rule"
faqs:
  - q: "What does a t-test tell you?"
    a: "Whether a difference in means is likely real or could plausibly be chance. It produces a t statistic (the difference in means divided by its standard error) and a p-value; a small p-value means the difference is unlikely under the null hypothesis of no real difference."
  - q: "What is the difference between one-sample, two-sample and paired t-tests?"
    a: "One-sample compares a single group's mean to a fixed value. Two-sample compares the means of two independent groups. Paired compares two measurements on the same subjects (before/after) by testing whether their differences average to zero."
  - q: "Should I use Welch's or the pooled t-test?"
    a: "Use Welch's (unequal-variance) test by default — it's more reliable when the two groups have different sizes or spreads, and barely loses anything when they don't. Use the pooled (equal-variance) test only when equal variances are genuinely justified."
  - q: "What does the p-value mean in a t-test?"
    a: "The probability of seeing a difference at least this large if there were truly no difference (the null hypothesis). If it's below your significance level α (usually 0.05), you reject the null and call the result statistically significant."
  - q: "Does a non-significant t-test prove there's no difference?"
    a: "No — this is the most common mistake. 'Fail to reject the null' means there wasn't enough evidence of a difference, not that the difference is zero. A small sample can miss a real effect (low power)."
  - q: "When should I use one-tailed vs two-tailed?"
    a: "Two-tailed (the default) tests for a difference in either direction. Use one-tailed only when you have a specific directional hypothesis set in advance; it's more powerful in that direction but can't detect an effect the other way."
draft: false
---

**A t-test answers one deceptively simple question: is this difference in averages real, or could it just be chance?** Two groups almost never have identical means even when nothing is going on, so the t-test measures whether the gap you see is bigger than random noise would plausibly produce. Here's how to run the right one and read it correctly.

<aside class="key-takeaways">

**Key takeaways**

- **t = (difference in means) ÷ (standard error)**, converted to a p-value.
- **Three types:** one-sample (vs a fixed value), two-sample (two groups), paired (before/after).
- **Default to Welch's** two-sample test — it handles unequal variances safely.
- **p < α (usually 0.05)** → reject the null: the difference is statistically significant.
- **"Fail to reject" ≠ "no difference"** — it means insufficient evidence, not proof of zero.

</aside>

<figure>
<img src="/blog/infographic-t-test.svg" alt="t = difference in means ÷ standard error → p-value. One-sample: one group's mean vs a fixed value. Two-sample: two independent groups, Welch's by default. Paired: before and after on the same subjects. Decision: p < α reject the null (significant); p ≥ α fail to reject." width="1200" height="640" loading="lazy" />
<figcaption>Same formula, three setups — and one decision rule at the end.</figcaption>
</figure>

## The core idea

The **t statistic** is a signal-to-noise ratio:

```
t = (difference in means) / (standard error of that difference)
```

The numerator is the effect you're interested in; the denominator is how much the means would wobble from sampling alone. A big t means the difference is large relative to the noise. You then convert t (with its degrees of freedom) into a **p-value** using the t-distribution — the probability of a t this extreme if there were no real difference.

## Which t-test? Match it to your design

- **One-sample** — you have *one* group and a *fixed reference value*. "Is the mean fill weight really 500 g?" You test the sample mean against 500.
- **Two-sample (independent)** — *two separate groups*. "Do method A and method B differ?" You compare the two group means. This is the most common case.
- **Paired** — *two measurements on the same subjects*. "Did blood pressure change after the drug?" You don't compare group averages; you compute each person's *difference* and test whether those differences average to zero. Pairing removes person-to-person variation, making it far more powerful than treating before and after as independent groups.

Getting this choice right matters more than any other decision — a paired design analysed as two independent samples throws away its biggest advantage.

## Welch or pooled?

For the two-sample test there are two flavours:

- **Pooled (Student's)** assumes both groups have the *same variance*.
- **Welch's** does *not* — it allows unequal variances and adjusts the degrees of freedom.

**Default to Welch's.** It's more reliable when the groups have different sizes or spreads, and it costs almost nothing when they're similar. The old habit of running an equal-variance test is rarely worth it; reach for pooled only when equal variances are genuinely justified.

## Reading the result — and the big trap

Compare the p-value to your significance level **α** (conventionally 0.05):

- **p < α** → **reject the null hypothesis.** The difference is "statistically significant" — unlikely to be chance.
- **p ≥ α** → **fail to reject the null.**

Here's the mistake nearly everyone makes: *failing to reject is not proof there's no difference.* It means you didn't find enough evidence — which can happen simply because the sample was too small to detect a real effect (low statistical power). "Not significant" and "no effect" are different claims. And significance isn't importance: with a huge sample, a trivially small difference can be statistically significant yet practically meaningless, so always look at the size of the difference too.

## Run it

The [t-test calculator](/statistics/t-test-calculator/) does all three types from summary statistics (means, standard deviations and sample sizes), defaults to Welch's for two samples, handles one- or two-tailed hypotheses, and gives the exact t, degrees of freedom, p-value and a plain-English significance verdict. For categorical counts instead of means, use the [chi-square test](/statistics/chi-square-test-calculator/); to turn a test statistic you already have into a p-value, use the [p-value calculator](/statistics/p-value-calculator/). Everything runs in your browser — your data is never uploaded.

---

*The t-test assumes roughly normal data (or a large enough sample for the central limit theorem to apply) and, for the pooled version, equal variances. p-values come from the exact Student t-distribution. This is educational content; for high-stakes analysis, check the assumptions and consider effect size and power. Source: standard mathematical-statistics treatment of the t-test (e.g. Student 1908; Welch 1947).*
