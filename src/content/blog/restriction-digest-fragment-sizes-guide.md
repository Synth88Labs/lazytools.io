---
title: "How to Predict Restriction Digest Fragment Sizes"
description: "A restriction digest cuts DNA into fragments — and you can predict their sizes from the sequence before you run the gel. Here's how cut positions become fragment sizes, why linear and circular DNA differ, and what the prediction can't tell you."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/biology/restriction-enzyme-digest/", "/biology/reverse-complement/", "/biology/protein-isoelectric-point/"]
keywords:
  - restriction digest fragment sizes
  - restriction enzyme digest calculator
  - how to predict restriction fragments
  - restriction map
  - linear vs circular digest
  - double digest fragments
heroImage: /blog/restriction-digest-fragment-sizes-guide.png
heroAlt: "Restriction cuts along a DNA molecule; fragment sizes are the distances between cuts — N cuts give N+1 fragments on linear DNA and N on a circular plasmid"
faqs:
  - q: "How do I predict restriction digest fragment sizes?"
    a: "Find every recognition site for your enzyme(s) in the sequence, note where each one cuts, then the fragment sizes are the distances between consecutive cut positions (plus the two ends for linear DNA, or wrapping around for a circular plasmid). A calculator does this automatically from the sequence."
  - q: "How many fragments will a digest produce?"
    a: "On a linear molecule, N cuts give N+1 fragments because the two ends are free. On a circular plasmid, N cuts give exactly N fragments because the molecule wraps around — so a single cut just linearises it into one fragment."
  - q: "What is the difference between a linear and circular digest?"
    a: "It's the fragment count. Linear DNA (like a PCR product or an isolated fragment) with N cuts gives N+1 pieces; a circular plasmid with N cuts gives N pieces. The same set of cut positions therefore predicts different gels depending on the DNA's topology."
  - q: "What are sticky ends and blunt ends?"
    a: "Many enzymes cut the two strands off-centre, leaving a short single-stranded overhang — a 'sticky end' (EcoRI leaves 5' AATT) that base-pairs with any fragment cut by the same enzyme. Others cut straight across, leaving a 'blunt end' (SmaI cuts CCC/GGG). Sticky ends make directional ligation easier."
  - q: "Why don't my real fragment sizes match the prediction?"
    a: "A sequence-only prediction assumes every site is cut completely and cleanly. In practice, Dam/Dcm methylation can block some sites, 'star activity' under non-ideal buffer or glycerol conditions can create extra cuts, partial digestion leaves uncut sites, and two enzymes in a double digest need a compatible buffer. Use the prediction as your expected pattern, then confirm on a gel."
  - q: "How do I do a double digest?"
    a: "Select both enzymes: the tool finds the sites of each, pools all the cut positions, and computes the fragments from the combined set. Just remember that in the lab a double digest needs a single buffer where both enzymes are active (or sequential digests with a clean-up step)."
  - q: "Can I map an unknown plasmid from its fragment sizes?"
    a: "Yes — that's restriction mapping. You digest with several enzymes singly and in combination, measure the fragment sizes on a gel, and work backwards to the arrangement of sites. Predicting the fragments from a candidate sequence and matching them to the gel is how you confirm a construct."
draft: false
---

**You've cloned something, and before you sequence it you run a quick restriction digest to check it's right.** The gel shows a ladder of bands — but are they the *right* bands? You don't have to guess: if you know the sequence, you can predict the exact fragment sizes ahead of time and just confirm the pattern. Here's how the prediction works.

<aside class="key-takeaways">

**Key takeaways**

- **Find the cuts, measure the gaps.** Fragment sizes are the distances between consecutive cut positions.
- **Linear DNA:** N cuts → **N+1 fragments** (the ends are free).
- **Circular plasmid:** N cuts → **N fragments** (it wraps around).
- **Sticky vs blunt** ends depend on whether the enzyme cuts off-centre (EcoRI) or straight across (SmaI).
- **Prediction ≠ reality:** methylation, star activity and partial cutting can change the real gel.

</aside>

<figure>
<img src="/blog/infographic-restriction-digest.svg" alt="A restriction enzyme cuts at its recognition site (EcoRI cuts G/AATTC leaving a sticky AATT overhang; SmaI cuts CCC/GGG blunt). Fragment sizes are the distances between consecutive cut positions along the molecule. Linear DNA with N cuts gives N+1 fragments because the ends are free; a circular plasmid with N cuts gives N fragments because it wraps around." width="1200" height="640" loading="lazy" />
<figcaption>Cut positions become fragment sizes — and topology decides the count.</figcaption>
</figure>

## Step 1: find where the enzyme cuts

A restriction enzyme binds a specific short **recognition sequence** and cuts there. EcoRI recognises `GAATTC` and cuts between the G and the first A (written `G^AATTC`); SmaI recognises `CCCGGG` and cuts dead centre (`CCC^GGG`). To predict a digest you scan the sequence for every occurrence of the site and record the **cut position** — the base after which the top strand is broken.

Some enzymes have recognition sites with ambiguity: HinfI cuts `GANTC`, where `N` is any base. A good calculator expands those IUPAC codes so `GAATC`, `GACTC`, `GAGTC` and `GATTC` all count as sites.

## Step 2: the gaps between cuts are the fragments

Once you have the cut positions sorted along the sequence, the fragments are simply the **distances between consecutive cuts**. Take a 54 bp fragment cut at positions 1, 7, 13 and 43:

- start → 1 = **1 bp**
- 1 → 7 = **6 bp**
- 7 → 13 = **6 bp**
- 13 → 43 = **30 bp**
- 43 → end (54) = **11 bp**

That's five fragments — 30, 11, 6, 6 and 1 bp — and they add back up to 54. The [restriction digest calculator](/biology/restriction-enzyme-digest/) does exactly this for the enzymes you select, and shows each enzyme's site count so you can spot single-cutters at a glance.

## Step 3: linear or circular? It changes the count

This is the part people trip over. The **same cut positions** give a different number of fragments depending on the DNA's shape:

- **Linear DNA** (a PCR product, a gel-purified insert) has two free ends, so **N cuts give N+1 fragments**. Three cuts → four bands.
- **Circular plasmid** wraps around with no free ends, so **N cuts give exactly N fragments**. A single cut doesn't fragment it at all — it just **linearises** it into one band at the full plasmid length.

So a plasmid that shows one band after a digest has a single site for that enzyme — a handy way to linearise a vector. Toggle "circular" in the tool when your DNA is a plasmid.

## Sticky ends vs blunt ends

Whether an enzyme leaves a **sticky** or **blunt** end depends on *where* within the site it cuts each strand. EcoRI cuts off-centre and leaves a four-base 5′ `AATT` overhang; any two EcoRI fragments have complementary overhangs and can be ligated together, which is what makes sticky-end cloning directional and efficient. SmaI cuts straight across the middle and leaves a blunt end — ligatable to any other blunt end, but with no overhang to enforce orientation.

## What the prediction can't tell you

A sequence-only prediction assumes **every site is cut, completely and cleanly**. Real digests have wrinkles:

- **Methylation** — Dam (GATC) and Dcm (CCWGG) methylation in most lab *E. coli* strains blocks some enzymes from cutting overlapping sites.
- **Star activity** — under high glycerol, wrong buffer or too much enzyme, some enzymes cut relaxed or extra sites.
- **Partial digestion** — too little enzyme or time leaves some sites uncut, adding larger "partial" bands.
- **Double digests** — two enzymes need a shared buffer where both are active, or a sequential digest.

Treat the predicted fragments as your **expected pattern**, then confirm on the gel. For the reverse-complement strand or to check an insert's orientation, the [reverse complement tool](/biology/reverse-complement/) pairs well with this one — and everything runs in your browser, so an unpublished construct is never uploaded.

---

*Recognition sites and cut positions here follow standard NEB/REBASE values for 26 common enzymes. The tool predicts a digest from the DNA sequence alone; it does not model methylation, star activity, partial digestion or buffer compatibility. Confirm important results experimentally.*
