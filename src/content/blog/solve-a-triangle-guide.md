---
title: "How to Solve a Triangle (Law of Sines & Law of Cosines)"
description: "Given a few sides and angles of a triangle, you can find all the rest — if you know which rule to use. Here's how to pick between the law of sines and the law of cosines for each case (SSS, SAS, ASA, AAS), and why SSA is the tricky one."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/math/triangle-solver/", "/math/triangle-area/", "/math/logarithm-calculator/"]
keywords:
  - how to solve a triangle
  - law of sines
  - law of cosines
  - triangle calculator
  - ambiguous case ssa
  - find missing side of a triangle
  - sss sas asa aas
draft: false
---

**You know two sides and an angle, or two angles and a side, and you need the rest of the triangle.** The whole job comes down to one decision: which rule fits what you already know. Get that right and the missing sides and angles fall out in a line or two of algebra. Here's the decision, case by case.

<aside class="key-takeaways">

**Key takeaways**

- **Law of cosines** for **SSS** (three sides) and **SAS** (two sides + the angle between them).
- **Law of sines** for **ASA / AAS** (two angles + a side) — find the third angle first.
- **SSA** (two sides + a non-included angle) is the **ambiguous case**: it can give **two triangles, one, or none**.
- You always need **at least one side** — three angles set the shape but not the size.
- Angles of any (flat) triangle sum to **180°**.

</aside>

<figure>
<img src="/blog/infographic-solve-triangle.svg" alt="If you know three sides (SSS) or two sides and the included angle (SAS), use the law of cosines c² = a² + b² − 2ab·cos C. If you know two angles and a side (ASA or AAS), use the angle sum then the law of sines a/sin A = b/sin B = c/sin C. If you know two sides and a non-included angle (SSA), use the law of sines — the ambiguous case that can give two triangles, one, or none. You always need at least one side." width="1200" height="640" loading="lazy" />
<figcaption>Match the rule to the three things you know.</figcaption>
</figure>

## The setup: sides, angles and how they pair

Label the sides **a, b, c** and the angle opposite each with the matching capital: **A** is opposite **a**, and so on. To pin down a triangle you need **three pieces of information, at least one of them a side** — because three angles alone fix the shape but leave the size free (all equilateral triangles have three 60° angles, whatever their size).

## Law of cosines: SSS and SAS

The **law of cosines** generalises Pythagoras to any triangle:

> c² = a² + b² − 2ab·cos C

- **SSS (three sides):** rearrange it to find each angle, e.g. cos C = (a² + b² − c²) / (2ab). Do it twice and the third angle is 180° minus the other two.
- **SAS (two sides + the included angle):** the angle sits *between* the two known sides, so plug straight in to get the opposite (third) side, then switch to finding the remaining angles.

Use the law of cosines whenever the known angle is **between** your two known sides, or when you know **all three sides**.

## Law of sines: ASA and AAS

The **law of sines** says each side is proportional to the sine of its opposite angle:

> a / sin A = b / sin B = c / sin C

If you know **two angles and any side** (ASA = side between the angles, AAS = side outside them), first get the third angle from **180° − (A + B)**. Now you know all three angles and one side, so the shared ratio gives the other two sides directly.

## The ambiguous case: SSA

**SSA** — two sides and an angle *not* between them — is the one that trips people up. You'd reach for the law of sines, but there's a catch: the known side opposite the known angle might be long enough to close the triangle in **two different ways**, in **one** way, or **not at all**.

- Compute sin of the unknown angle from the law of sines.
- If that value is **greater than 1**, no triangle exists (the side is too short to reach).
- If it's **less than 1**, there are usually **two** candidate angles (an acute one and its obtuse supplement) — check each against the 180° rule; sometimes only one survives.

That's why a careful solver reports **every** triangle that fits, rather than silently picking one. The [triangle solver](/math/triangle-solver/) does exactly this: enter any three values and it detects the case, applies the right law, and shows both answers when SSA is ambiguous — along with the area and a scaled diagram.

## Getting the area too

Once you have two sides and the angle between them, the area is **½·a·b·sin C**. From three sides, use [Heron's formula](/math/triangle-area/) instead. The triangle solver reports the area whichever way you entered the triangle.

---

*The relationships here — the laws of sines and cosines and the 180° angle sum — are exact identities of Euclidean (flat-plane) geometry. The triangle solver computes them in your browser with standard floating-point trigonometry; nothing is uploaded.*
