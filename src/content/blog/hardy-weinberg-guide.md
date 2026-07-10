---
title: "Hardy–Weinberg Equilibrium: Allele Frequencies, p²+2pq+q², and the χ² Test"
description: "Hardy–Weinberg predicts genotype frequencies from allele frequencies: p²+2pq+q²=1. Find p and q from genotype counts (p = (2·AA+Aa)/2N), compute expected counts, and test for equilibrium with a chi-square goodness-of-fit — with a worked example."
pubDate: 2026-07-10
updatedDate: 2026-07-10
archetype: explainer
tools: ["/biology/hardy-weinberg/", "/biology/punnett-square/"]
keywords:
  - hardy weinberg
  - hardy weinberg equilibrium
  - allele frequency calculator
  - p2 2pq q2
  - chi square hardy weinberg
  - genotype frequency
  - population genetics
heroImage: /blog/hardy-weinberg-guide.png
heroAlt: "Hardy–Weinberg equilibrium — p²+2pq+q²=1, allele frequencies from counts, and the χ² test"
faqs:
  - q: "What is the Hardy–Weinberg equation?"
    a: "p² + 2pq + q² = 1, where p and q are the frequencies of two alleles (p + q = 1). p² is the expected frequency of homozygous dominant individuals, 2pq of heterozygotes, and q² of homozygous recessive. It predicts genotype frequencies in a population that is not evolving."
  - q: "How do you calculate allele frequency from genotype counts?"
    a: "p = (2 × AA + Aa) / (2 × N) and q = 1 − p, where AA, Aa and aa are the counts of each genotype and N is the total number of individuals. Each homozygote contributes two copies of its allele and each heterozygote one of each."
  - q: "How do you test for Hardy–Weinberg equilibrium?"
    a: "Compare the observed genotype counts to those expected from p², 2pq and q² using a chi-square goodness-of-fit test with 1 degree of freedom. If the p-value is above 0.05 the population is consistent with equilibrium; if it is 0.05 or below, there is a significant departure."
  - q: "Why is there 1 degree of freedom?"
    a: "There are three genotype classes, minus one for the fixed total, minus one for the allele frequency estimated from the data, leaving 3 − 1 − 1 = 1 degree of freedom for a locus with two alleles."
  - q: "What causes a departure from Hardy–Weinberg equilibrium?"
    a: "A significant departure means one of the model's assumptions is broken: natural selection, non-random mating (such as inbreeding), migration (gene flow), mutation, or genetic drift in a small population. The test flags that something is acting; it doesn't say which."
  - q: "What are the assumptions of Hardy–Weinberg?"
    a: "No selection, no mutation, no migration, an infinitely large population (no drift), and random mating. When all hold, allele and genotype frequencies stay constant across generations — the equilibrium state."
draft: false
---

**Hardy–Weinberg says that in a population that isn't evolving, genotype frequencies follow
`p² + 2pq + q² = 1` from the allele frequencies p and q.** Get p and q from the genotype counts
(`p = (2·AA + Aa) / 2N`), work out the expected counts, and a chi-square test tells you whether the
population is at equilibrium. Do all of it — allele frequencies, expected counts and the χ² verdict —
with the [Hardy–Weinberg calculator](/biology/hardy-weinberg/); here's the reasoning.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>p + q = 1</strong> (two allele frequencies); <strong>p² + 2pq + q² = 1</strong> (genotypes)</li>
<li><strong>From counts:</strong> p = (2·AA + Aa) / (2N), q = 1 − p</li>
<li><strong>Expected:</strong> p²·N homozygous dominant, 2pq·N heterozygous, q²·N homozygous recessive</li>
<li><strong>Test:</strong> χ² goodness-of-fit, 1 df — p &gt; 0.05 = at equilibrium</li>
<li>A departure means <strong>selection, non-random mating, migration, mutation or drift</strong></li>
</ul>
</aside>

## The idea in one picture

<figure>
<img src="/blog/infographic-hardy-weinberg.svg" alt="Infographic: two allele frequencies p and q add to 1; expected genotype frequencies are p² homozygous dominant, 2pq heterozygous, q² homozygous recessive, summing to 1; allele frequency from counts is p = (2·AA + Aa)/(2N) and q = 1 − p; test with a chi-square goodness-of-fit at 1 degree of freedom comparing observed to expected; p-value above 0.05 is consistent with equilibrium, at or below 0.05 is a significant departure caused by selection, non-random mating, migration, mutation or drift" width="1200" height="640" loading="lazy" />
<figcaption>Allele frequencies → expected genotypes → a χ² test against what you observed.</figcaption>
</figure>

## Step 1 — allele frequencies from genotype counts

Count the three genotypes and turn them into allele frequencies. Each homozygote carries two copies of
its allele, each heterozygote one of each:

> **p = (2·AA + Aa) / (2N)**   and   **q = 1 − p**

where N is the total number of individuals. For a classic textbook sample of 298 AA, 489 Aa and 213 aa
(N = 1000): p = (2×298 + 489) / 2000 = 1085 / 2000 = **0.5425**, so q = **0.4575**.

## Step 2 — expected genotype frequencies

If the population is at equilibrium, the genotype frequencies come straight from p and q:

- **p²** — homozygous dominant (AA)
- **2pq** — heterozygous (Aa)
- **q²** — homozygous recessive (aa)

These sum to 1 because (p + q)² = p² + 2pq + q² = 1. Multiply each by N to get *expected counts*. For our
example: p²·N ≈ 294, 2pq·N ≈ 496, q²·N ≈ 209.

## Step 3 — test with chi-square

Now compare what you *observed* to what's *expected* under Hardy–Weinberg with a chi-square
goodness-of-fit test:

> **χ² = Σ (observed − expected)² / expected**

with **1 degree of freedom** (three genotype classes, minus one for the total, minus one for the
estimated allele frequency). Our example gives a small χ² (≈ 0.22) and a p-value around 0.6 — well
above 0.05 — so the population is **consistent with Hardy–Weinberg equilibrium**. A p-value at or below
0.05 would signal a **significant departure**. The [Hardy–Weinberg calculator](/biology/hardy-weinberg/)
runs this test and gives the plain-English verdict.

## What a departure means

Hardy–Weinberg is a *null model*: it describes a population where nothing is changing the allele
frequencies. So when observed genotypes depart significantly from the expectation, it means one of the
model's assumptions is being violated:

- **Natural selection** — some genotypes survive or reproduce better.
- **Non-random mating** — for example inbreeding, which raises homozygotes.
- **Migration (gene flow)** — alleles entering or leaving the population.
- **Mutation** — new alleles appearing.
- **Genetic drift** — random change in a small population.

The test doesn't tell you *which* — it tells you that the simple no-evolution model doesn't fit, which
is the starting point for asking why.

## Quick summary

Hardy–Weinberg predicts genotype frequencies from allele frequencies: p + q = 1 and
p² + 2pq + q² = 1. Get p and q from counts with p = (2·AA + Aa)/2N, compute expected counts, and test
observed-versus-expected with a chi-square goodness-of-fit at 1 degree of freedom — p > 0.05 means the
population is consistent with equilibrium. Run the frequencies, expected counts and the χ² verdict with
the [Hardy–Weinberg calculator](/biology/hardy-weinberg/), and see where a single cross comes from with
the [Punnett square calculator](/biology/punnett-square/).

*Sources: Hardy (1908) and Weinberg (1908), the Hardy–Weinberg principle; standard population-genetics
texts. [NHGRI — genetics glossary](https://www.genome.gov/genetics-glossary). Educational information.*
