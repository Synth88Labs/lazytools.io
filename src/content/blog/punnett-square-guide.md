---
title: "Punnett Squares: Monohybrid, Dihybrid, and Where the 9:3:3:1 Comes From"
description: "A monohybrid Aa × Aa cross gives 1:2:1 genotypes and a 3:1 phenotype ratio; a dihybrid AaBb × AaBb gives 9:3:3:1. How to fill the grid, read the ratios, and why larger crosses are so easy to get wrong by hand."
pubDate: 2026-07-10
updatedDate: 2026-07-10
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

## Where 9:3:3:1 comes from

A **dihybrid** cross follows two genes at once: `AaBb × AaBb`. Now each parent makes **four** kinds of
gamete — AB, Ab, aB, ab — so the grid is **4×4 = 16 boxes**. Group the 16 offspring by phenotype and
you get:

- **9** showing both dominant traits (A_ B_)
- **3** dominant for the first gene, recessive for the second (A_ bb)
- **3** recessive for the first, dominant for the second (aa B_)
- **1** recessive for both (aabb)

That's the classic **9:3:3:1** — and it falls straight out of filling the grid, no memorisation needed.
A **trihybrid** cross (`AaBbCc`) pushes it to **8×8 = 64 boxes**, which is where doing it by hand stops
being realistic.

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
