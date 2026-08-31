---
title: "Which Statistical Test Should I Use? A Decision Guide"
seoTitle: "Which Statistical Test Should I Use?"
description: "t-test, z-test, ANOVA, Mann-Whitney or chi-square? The right test depends on your data type, how many groups you have, and whether it's normal. Here's a simple decision path, with calculators that run in your browser."
pubDate: 2026-08-01
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/which-statistical-test-should-i-use-guide.png
heroAlt: "A decision tree for choosing a statistical test based on data type, number of groups and normality"
tools: ["/statistics/t-test-calculator/", "/statistics/anova-calculator/", "/statistics/mann-whitney-u-test-calculator/", "/statistics/z-test-calculator/", "/statistics/chi-square-test-calculator/", "/statistics/kruskal-wallis-test-calculator/", "/statistics/wilcoxon-signed-rank-test-calculator/"]
keywords:
  - which statistical test should i use
  - t-test vs anova
  - mann-whitney vs t-test
  - choosing a statistical test
  - parametric vs non-parametric
  - z-test vs t-test
  - statistical test decision tree
faqs:
  - q: "How do I choose the right statistical test?"
    a: "Start with three questions: what kind of data do you have (numbers or categories), how many groups are you comparing, and can you assume the data is roughly normal? Categorical counts point to a chi-square test; comparing two normal groups points to a t-test; three or more groups to ANOVA; and non-normal or ordinal data to a non-parametric test like Mann-Whitney. Each of these has a LazyTools calculator that runs in your browser."
  - q: "What's the difference between a t-test and ANOVA?"
    a: "A t-test compares the means of two groups; ANOVA compares three or more at once. You could run many t-tests instead, but each carries its own false-positive risk and running lots of them inflates the overall error rate, ANOVA tests all groups together at one significance level, which is why it's the correct tool for 3+ groups."
  - q: "When should I use a non-parametric test like Mann-Whitney?"
    a: "When the assumption that your data is roughly normal is doubtful, small samples, skewed distributions, ordinal ratings (like 1-5 scales), or data with strong outliers. The Mann-Whitney U test compares two groups using ranks instead of raw values, so it doesn't need normality. Its 3-plus-group counterpart is the Kruskal-Wallis test."
  - q: "What's the difference between a z-test and a t-test?"
    a: "Both compare means, but a z-test assumes the population standard deviation is known (or the sample is large enough that it's effectively known) and uses the normal distribution, while a t-test estimates the standard deviation from the sample and uses the t-distribution to account for that extra uncertainty. In practice, use a t-test unless you truly know the population SD or have proportion data (where a z-test applies)."
  - q: "Which test do I use for categorical data like yes/no or counts?"
    a: "A chi-square test. Use goodness-of-fit to compare observed counts against expected proportions, and the test of independence to check whether two categorical variables (rows and columns of a contingency table) are related. For two proportions specifically, like an A/B conversion test, a two-proportion z-test is the standard choice."
  - q: "Are these calculators private?"
    a: "Yes, every LazyTools statistics calculator runs entirely in your browser using JavaScript. Your data is never uploaded, and the tools work offline."
draft: false
---

**The right [statistical test](https://en.wikipedia.org/wiki/Statistical_hypothesis_testing) comes down to three questions: is your data numeric or categorical, how
many groups are you comparing, and can you assume it's roughly normal?** Answer those three and the
choice, t-test, z-test, ANOVA, Mann-Whitney or chi-square, is almost automatic. This guide walks the
decision path, adds worked examples, and links a browser-based calculator for each, so nothing you
enter leaves your device.

<aside class="key-takeaways">

**Key takeaways**

- Three questions settle almost every choice: *data type* (numbers vs categories), *group count* (one, two, or three-plus), and *normality* (roughly bell-shaped or not).
- Counts and categories go to a chi-square test; two numeric groups go to a t-test; three or more go to ANOVA; anything skewed, ordinal, or tiny goes to a rank-based non-parametric test.
- Also ask whether your two samples are *paired* (same subjects measured twice), that switches you to a paired t-test or Wilcoxon signed-rank test.
- A p-value only says a difference is *detectable*; always report an effect size beside it so you also know whether the difference is *meaningful*.

</aside>

## The three questions

1. **What type of data?** *Measurements/numbers* (heights, times, revenue) vs *categories/counts*
   (yes/no, which-of-three, pass/fail).
2. **How many groups?** One group against a target, two groups, or three-plus.
3. **Is it roughly normal?** Symmetric and outlier-free → *parametric* tests are fine. Skewed,
   ordinal, tiny samples, or heavy outliers → reach for a *non-parametric* test.

<figure class="my-8">
<svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decision tree: categorical data uses chi-square; numeric data branches by group count and normality into t-test, z-test, ANOVA, or Mann-Whitney" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="34" font-weight="800" fill="#0f172a">Choosing a test</text>

  <!-- root -->
  <rect x="490" y="80" width="220" height="60" rx="12" fill="#0f172a"/>
  <text x="600" y="118" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#fff">What data?</text>

  <!-- categorical branch -->
  <line x1="540" y1="140" x2="240" y2="200" stroke="#94a3b8" stroke-width="2"/>
  <rect x="80" y="200" width="320" height="120" rx="12" fill="#f3e8ff" stroke="#9333ea" stroke-width="3"/>
  <text x="240" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#6b21a8">Categories / counts</text>
  <text x="240" y="272" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="800" fill="#6b21a8">chi-square</text>
  <text x="240" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#7e22ce">2 proportions → z-test</text>

  <!-- numeric branch -->
  <line x1="660" y1="140" x2="900" y2="200" stroke="#94a3b8" stroke-width="2"/>
  <rect x="740" y="200" width="380" height="60" rx="12" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
  <text x="930" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#075985">Numbers → how many groups?</text>

  <!-- two groups -->
  <line x1="820" y1="260" x2="720" y2="330" stroke="#94a3b8" stroke-width="2"/>
  <rect x="470" y="330" width="300" height="180" rx="12" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="620" y="366" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#047857">2 groups</text>
  <text x="620" y="404" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#065f46">normal → <tspan font-weight="800">t-test</tspan></text>
  <text x="620" y="438" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#065f46">σ known → <tspan font-weight="800">z-test</tspan></text>
  <text x="620" y="472" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#065f46">not normal → <tspan font-weight="800">Mann-Whitney</tspan></text>

  <!-- 3+ groups -->
  <line x1="1000" y1="260" x2="1000" y2="330" stroke="#94a3b8" stroke-width="2"/>
  <rect x="820" y="330" width="330" height="180" rx="12" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="985" y="366" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#b45309">3+ groups</text>
  <text x="985" y="404" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#92400e">normal → <tspan font-weight="800">ANOVA</tspan></text>
  <text x="985" y="438" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#92400e">not normal →</text>
  <text x="985" y="466" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="800" fill="#92400e">Kruskal-Wallis</text>
</svg>
</figure>

## Parametric or non-parametric? The normality question

The word *parametric* just means a test assumes your data follows a known distribution shape, usually
the normal (bell) curve, and works from summary parameters like the mean and standard deviation.
Parametric tests (t-test, z-test, ANOVA) are more powerful when that assumption holds: they can detect
a real difference with a smaller sample. When the assumption is shaky, they can mislead.

*Non-parametric* tests (Mann-Whitney, Wilcoxon, Kruskal-Wallis) make no bell-curve assumption. They
convert values to ranks and compare those, so a single wild outlier or a skewed tail can't drag the
result around. Reach for them when any of these is true:

- Your sample is small (say, fewer than ~15-20 per group) and you can't verify normality.
- The data is visibly skewed or has heavy outliers.
- The data is *ordinal*, ranks or ratings like a 1-5 satisfaction scale, where the gap between 4 and 5
  isn't guaranteed to equal the gap between 1 and 2.

A practical rule: if you're unsure and the sample is small, the non-parametric test is the safer
default. You lose a little power when the data really was normal, but you avoid a false conclusion when
it wasn't.

## Categorical data → chi-square

If you're counting things in categories, how many users chose A vs B vs C, or whether an outcome
relates to a group. You want a [chi-square test](/statistics/chi-square-test-calculator/).
Goodness-of-fit compares observed counts to expected proportions; the test of independence checks
whether two categorical variables are related.

**Worked example.** You survey 200 visitors and record which of three plans they picked: 90 Basic, 70
Pro, 40 Team. Are those preferences different from an even 1/3-each split? Goodness-of-fit compares the
observed counts (90, 70, 40) against the expected 66.7 each and returns a p-value. A small p-value says
the uneven split is unlikely to be chance. If instead you had a two-way table, say plan choice (rows)
by device type (columns), the test of independence tells you whether choice and device are linked.

The one special case: comparing exactly **two proportions** (an A/B conversion test) is cleaner with a
[two-proportion z-test](/statistics/ab-test-significance-calculator/).

## Two numeric groups → t-test (or z-test, or Mann-Whitney)

Comparing two groups of measurements:

- **Roughly normal, σ unknown** → the [t-test](/statistics/t-test-calculator/). This is the default for
  most real data, because you almost never know the true population standard deviation.
- **σ known or very large sample** → the [z-test](/statistics/z-test-calculator/).
- **Not normal, skewed, ordinal, small, or outlier-heavy** → the
  [Mann-Whitney U test](/statistics/mann-whitney-u-test-calculator/), which compares groups by rank and
  needs no normality assumption.

**Worked example.** Version A of a checkout takes, in seconds, 12, 14, 11, 13, 15 for five users;
version B takes 9, 10, 8, 11, 10. Both samples look roughly symmetric with no wild outliers, and you
don't know the true spread of load times, so a two-sample t-test is the right call. It compares the two
means (13.0 vs 9.6) relative to the variation within each group and reports whether that 3.4-second gap
is bigger than you'd expect from noise. Had one user in A taken 60 seconds (a stuck request), the
mean would lurch and normality would be doubtful, that's when you'd switch to Mann-Whitney.

## Paired data → paired t-test or Wilcoxon signed-rank

Before you settle on a two-group test, ask whether the two sets of numbers are *independent* or
*paired*. Paired means each value in one group is tied to a specific value in the other, the **same**
subjects measured twice (before vs after a change), or matched pairs. Blood pressure for 20 patients
before and after a drug is paired; heights of 20 men and 20 unrelated women are not.

Pairing is worth exploiting because it cancels out person-to-person differences and gives you more
power. For paired numeric data that's roughly normal, use a **paired t-test**; if it's non-normal or
ordinal, use the [Wilcoxon signed-rank test](/statistics/wilcoxon-signed-rank-test-calculator/), the
paired counterpart of Mann-Whitney. Using an unpaired test on paired data throws away that advantage
and can hide a real effect.

## Three or more groups → ANOVA (not many t-tests)

With 3+ groups, don't run a t-test on every pair, each comparison carries its own false-positive risk,
and doing many inflates the overall error rate. One-way [ANOVA](https://en.wikipedia.org/wiki/Analysis_of_variance) ([calculator](/statistics/anova-calculator/)) tests
all groups at once with a single F test. A significant result says the groups aren't all equal; a
follow-up **post-hoc test** (e.g. Tukey's HSD) tells you which ones differ. If the groups are clearly
non-normal, the rank-based [Kruskal-Wallis test](/statistics/kruskal-wallis-test-calculator/) is the
non-parametric counterpart.

**Worked example.** You test three landing-page headlines and measure time-on-page for visitors in
each. That's three numeric groups, so ANOVA is the tool, not three separate t-tests. If ANOVA returns
a significant F, a Tukey post-hoc test then pins down whether headline C beat both A and B, or only A.
If the time-on-page values were badly skewed (a common shape for durations), Kruskal-Wallis would
replace ANOVA.

## Quick reference

| Your situation | Test | Parametric? |
|---|---|---|
| Category counts, 1 variable vs expected | Chi-square goodness-of-fit |, |
| Two categorical variables related? | Chi-square independence |, |
| Two proportions (A/B) | Two-proportion z-test |, |
| Two independent numeric groups, normal | t-test | Yes |
| Two independent numeric groups, σ known | z-test | Yes |
| Two independent numeric groups, non-normal | Mann-Whitney U | No |
| Paired numeric (before/after), normal | Paired t-test | Yes |
| Paired numeric (before/after), non-normal | Wilcoxon signed-rank | No |
| 3+ independent numeric groups, normal | One-way ANOVA | Yes |
| 3+ independent numeric groups, non-normal | Kruskal-Wallis | No |

## Common mistakes to avoid

A few traps catch people far more often than picking the "wrong" family of test:

- **Running many t-tests instead of ANOVA.** Every extra pairwise test adds another chance of a false
  positive. Use ANOVA for 3+ groups, then a post-hoc test.
- **Ignoring pairing.** Treating before/after measurements as independent groups discards the biggest
  source of power you have. Match the test to the design.
- **Assuming normality on tiny samples.** With a handful of points you usually can't confirm the
  bell-curve shape, so a rank-based test is the honest choice.
- **Reading only the p-value.** Statistical significance is not the same as practical importance, which is the next section.

## Don't forget effect size

Effect size is the most common gap in reported results. A p-value answers "could this
be chance?" but says nothing about *magnitude*. With a large enough sample, a trivially small
difference becomes "significant." Pair every test with an [effect
size](/statistics/effect-size-calculator/), Cohen's d for mean differences, or the appropriate
measure for your test, so a reader can see whether a detectable difference is also a difference worth
acting on.

## The bottom line

Pick your test from **data type → group count → normality**: categories go to chi-square, two normal
groups to a t-test, three-plus to ANOVA, and anything non-normal to a rank-based test like
Mann-Whitney. Then read the p-value next to an effect size. Run any of them locally with the LazyTools
[statistics calculators](/statistics/), your data never leaves the browser.
