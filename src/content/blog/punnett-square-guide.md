---
title: "Punnett Squares: Monohybrid, Dihybrid, and Where the 9:3:3:1 Comes From"
seoTitle: 'Punnett Squares: 3:1, 9:3:3:1 & How to Fill Them'
description: "Punnett squares explained: a monohybrid Aa × Aa cross gives a 3:1 phenotype ratio and a dihybrid AaBb × AaBb gives 9:3:3:1. How to fill the grid."
pubDate: 2026-07-10
updatedDate: 2026-08-23
archetype: explainer
tools: ["/biology/punnett-square/", "/biology/hardy-weinberg/"]
keywords:
  - punnett square
  - how to do a punnett square
  - dihybrid cross
  - monohybrid cross
  - 9:3:3:1 ratio
  - genotype vs phenotype ratio
  - punnett square calculator
heroImage: /blog/punnett-square-guide.png
heroAlt: "Punnett square explained — monohybrid 1:2:1 and 3:1, dihybrid 9:3:3:1"
faqs:
  - q: "How do you make a Punnett square?"
    a: "List each parent's possible gametes along the top and side of a grid, then fill every box by combining the row allele with the column allele. For a monohybrid Aa × Aa cross you get a 2×2 grid with 1 AA, 2 Aa and 1 aa — a 3:1 dominant-to-recessive phenotype ratio."
  - q: "Where does the 9:3:3:1 ratio come from?"
    a: "From a dihybrid cross of two double heterozygotes, AaBb × AaBb. Each parent makes four gamete types (AB, Ab, aB, ab), so the grid is 4×4 = 16 boxes. Grouping the offspring by phenotype gives 9 showing both dominant traits, 3 and 3 showing one dominant and one recessive, and 1 showing both recessive — 9:3:3:1."
  - q: "What is the difference between genotype and phenotype ratio?"
    a: "The genotype ratio counts exact allele combinations (e.g. 1 AA : 2 Aa : 1 aa). The phenotype ratio counts observable traits (e.g. 3 dominant : 1 recessive), grouping together genotypes that look the same — AA and Aa both show the dominant trait."
  - q: "What do uppercase and lowercase letters mean?"
    a: "Uppercase is the dominant allele and lowercase the recessive. An organism shows the dominant trait if it has at least one dominant allele (AA or Aa) and the recessive trait only when both alleles are recessive (aa)."
  - q: "How big is a trihybrid Punnett square?"
    a: "Each parent in a trihybrid cross (e.g. AaBbCc) makes 2³ = 8 gamete types, so the grid is 8×8 = 64 boxes. That's impractical to fill by hand reliably, which is exactly where a calculator that fills and tallies the grid earns its keep."
  - q: "Why do people get Punnett squares wrong?"
    a: "Monohybrid crosses are easy, but dihybrid (16 boxes) and trihybrid (64 boxes) crosses involve enumerating gametes and tallying ratios — error-prone by hand, and something AI chatbots frequently get wrong. A deterministic grid removes the mistakes and shows every box."
draft: false
---

**A monohybrid `Aa × Aa` cross gives a 1:2:1 genotype ratio and a 3:1 phenotype ratio; a dihybrid
`AaBb × AaBb` cross gives the famous 9:3:3:1.** Both come from the same simple idea — list each
parent's gametes, fill the grid, count the boxes — and both are easy to get right once you see it.
Build any cross (mono-, di-, or trihybrid) with genotype and phenotype ratios in the
[Punnett square calculator](/biology/punnett-square/); here's how it works.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Gametes</strong> go along the top and side; each box combines a row + column allele</li>
<li><strong>Monohybrid Aa × Aa:</strong> genotype 1:2:1, phenotype <strong>3:1</strong></li>
<li><strong>Dihybrid AaBb × AaBb:</strong> 4×4 = 16 boxes → phenotype <strong>9:3:3:1</strong></li>
<li><strong>Uppercase</strong> = dominant, <strong>lowercase</strong> = recessive; recessive trait needs <code>aa</code></li>
<li>Larger grids (16, 64 boxes) are where hand-drawing — and chatbots — slip</li>
</ul>
</aside>

## The monohybrid cross, step by step

<figure>
<img src="/blog/infographic-punnett.svg" alt="Infographic: a Punnett square for Aa × Aa; each parent makes gametes A and a; the 2×2 grid fills to 1 AA, 2 Aa and 1 aa, a genotype ratio of 1:2:1; because A is dominant, three of four show the dominant trait, a phenotype ratio of 3:1; a dihybrid AaBb × AaBb cross uses a 4×4 grid of 16 boxes and gives 9:3:3:1" width="1200" height="640" loading="lazy" />
<figcaption>Gametes along the edges; fill the boxes; count the results.</figcaption>
</figure>

Take `Aa × Aa`. Each parent can pass on either allele, so the gametes are **A** and **a**. Put them
along the top and side of a 2×2 grid and fill each box:

|  | **A** | **a** |
|---|---|---|
| **A** | AA | Aa |
| **a** | Aa | aa |

Count them: **1 AA : 2 Aa : 1 aa** — the genotype ratio. Since `A` is dominant, AA and Aa both show
the dominant trait, so the **phenotype ratio is 3 dominant : 1 recessive**. That 3:1 is the signature
of a monohybrid cross between two heterozygotes.

## Genotype vs phenotype ratio

These are different questions:

- **Genotype ratio** counts the exact allele pairs: `1:2:1` for AA:Aa:aa.
- **Phenotype ratio** counts what you'd *see*: `3:1`, because AA and Aa look the same.

The tool always reports both, in the conventional dominant-first order, so you don't have to re-sort
them by hand.

## The test cross: a 1:1 shortcut

One special monohybrid case is worth knowing because breeders use it constantly. A **test cross** pairs
an individual showing the dominant trait — but of unknown genotype — with a known recessive, `aa`. The
recessive parent contributes only `a` gametes, so the offspring reveal the mystery parent directly:

|  | **a** | **a** |
|---|---|---|
| **A** | Aa | Aa |
| **a** | aa | aa |

If the unknown parent is `AA`, every child shows the dominant trait. If it is `Aa`, you get a **1:1**
mix of dominant and recessive offspring. That 1:1 split is the fingerprint of a heterozygote, which is
why a test cross is the classic way to distinguish `AA` from `Aa` when they look identical.

## Where 9:3:3:1 comes from

A **dihybrid** cross follows two genes at once: `AaBb × AaBb`. By the law of independent assortment the
two genes sort into gametes independently, so each parent makes **four** equally likely gamete types —
**AB, Ab, aB, ab** — and the grid is **4×4 = 16 boxes**. Group the 16 offspring by phenotype and you get:

- **9** showing both dominant traits (A_ B_)
- **3** dominant for the first gene, recessive for the second (A_ bb)
- **3** recessive for the first, dominant for the second (aa B_)
- **1** recessive for both (aabb)

That's the classic **9:3:3:1** — and it falls straight out of filling the grid, no memorisation needed.
Underneath that phenotype pattern sits a richer genotype ratio of `1:2:1:2:4:2:1:2:1` across nine
distinct genotypes, which is exactly the sort of tally that is tedious to do reliably by hand.

## The multiplication shortcut

You don't actually need a 16-box grid to predict a dihybrid ratio — and seeing why makes the whole
topic click. Because the two genes assort independently, you can treat each gene as its own monohybrid
cross and **multiply the probabilities**. For `AaBb × AaBb`:

- Gene A alone: `Aa × Aa` → 3/4 dominant, 1/4 recessive.
- Gene B alone: `Bb × Bb` → 3/4 dominant, 1/4 recessive.

Multiply the independent outcomes: `3/4 × 3/4 = 9/16` both dominant, `3/4 × 1/4 = 3/16` and
`1/4 × 3/4 = 3/16` for the mixed classes, and `1/4 × 1/4 = 1/16` both recessive — the same 9:3:3:1,
reached by arithmetic instead of a grid. This "forked-line" or product rule is also the only sane way
to answer a targeted question like *"what fraction of offspring are `aabb`?"* without drawing anything.

## How the numbers scale

Every heterozygous gene you add multiplies the work. For `n` genes where both parents are heterozygous,
each parent makes `2ⁿ` gamete types, the grid holds `4ⁿ` boxes, there are `2ⁿ` phenotype classes, and
the phenotype ratio is the expansion of `(3:1)ⁿ`:

| Cross | Example | Gametes per parent | Grid boxes | Phenotype classes | Phenotype ratio |
|---|---|---|---|---|---|
| Monohybrid | Aa × Aa | 2 | 4 | 2 | 3:1 |
| Dihybrid | AaBb × AaBb | 4 | 16 | 4 | 9:3:3:1 |
| Trihybrid | AaBbCc × AaBbCc | 8 | 64 | 8 | 27:9:9:9:3:3:3:1 |

By the trihybrid row the grid has **64 boxes** and eight phenotype classes — well past the point where
hand-drawing stays reliable. This is also why the multiplication shortcut matters: a trihybrid is just
three `3:1` crosses multiplied together, and `27:9:9:9:3:3:3:1` is simply `(3:1) × (3:1) × (3:1)`.

## When the classic ratios don't apply

The 3:1 and 9:3:3:1 ratios assume complete dominance, two alleles per gene, independent assortment, and
a large enough sample for probability to average out. Several common situations bend those rules:

- **Incomplete dominance** (e.g. red × white snapdragons → pink heterozygotes) makes each genotype
  visibly distinct, so the phenotype ratio *equals* the genotype ratio — `1:2:1` rather than `3:1`.
- **Codominance** (e.g. the AB blood group) likewise gives heterozygotes their own phenotype.
- **Linked genes** sit close together on the same chromosome and do *not* assort independently, so a
  dihybrid cross departs from 9:3:3:1 in proportion to how tightly they are linked.
- **Small samples.** A ratio is a probability, not a guarantee — four offspring from an `Aa × Aa` cross
  will not always land as a tidy 3:1.

A Punnett square still models the first two cases perfectly well; you simply read the boxes as three
phenotypes instead of two. It is only linkage and small-sample noise that a single grid can't capture.

## Why a tool beats drawing (and beats a chatbot)

For a 2×2 monohybrid, drawing it is quick. But 16- and 64-box grids require carefully enumerating
gametes and tallying ratios — and that's exactly the kind of mechanical bookkeeping that goes wrong by
hand, and that **AI chatbots reliably botch** (they mis-fill cells and miscount the ratios). A
deterministic grid fills every box and counts them exactly. The
[Punnett square calculator](/biology/punnett-square/) does mono-, di- and trihybrid crosses with both
ratios shown — and pairs naturally with the [Hardy–Weinberg calculator](/biology/hardy-weinberg/) when
you move from a single cross to allele frequencies across a whole population.

## Quick summary

List each parent's gametes, fill the grid, count the boxes. `Aa × Aa` → genotype 1:2:1, phenotype 3:1.
`AaBb × AaBb` → 16 boxes → 9:3:3:1. Uppercase alleles are dominant, and the recessive trait appears
only when both alleles are recessive. For anything past a monohybrid cross, let the
[Punnett square calculator](/biology/punnett-square/) fill and tally the grid — it's exact where hand-
drawing and chatbots are not.

*Sources: standard Mendelian genetics (law of segregation, law of independent assortment) ·
[NHGRI — genetics glossary](https://www.genome.gov/genetics-glossary). General educational information.*
