---
title: "How to Solve a Triangle (Law of Sines & Law of Cosines)"
seoTitle: 'How to Solve a Triangle: Sines & Cosines'
description: "Solve a triangle: how to pick between the law of sines and law of cosines for each case (SSS, SAS, ASA, AAS), and why SSA is the ambiguous one."
pubDate: 2026-07-12
updatedDate: 2026-08-23
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
faqs:
  - q: "Which rule do I use, law of sines or law of cosines?"
    a: "Use the law of cosines when you know all three sides (SSS) or two sides and the angle between them (SAS). Use the law of sines when you know two angles and a side (ASA/AAS) or two sides and a non-included angle (SSA). A quick test: if your known angle sits between your two known sides, it's the law of cosines; otherwise it's usually the law of sines."
  - q: "Why is SSA called the ambiguous case?"
    a: "With two sides and an angle that isn't between them, the side opposite the known angle can sometimes swing to meet the base in two different places, giving two valid triangles. Depending on the numbers you can get two solutions, exactly one, or none at all, so the law of sines alone doesn't tell you how many triangles fit until you check the supplementary angle."
  - q: "Can I solve a triangle if I only know its three angles?"
    a: "No. Three angles fix the shape but not the size, every equilateral triangle has three 60° angles regardless of how big it is. You need at least one side length to lock down the scale. This is the AAA case, and it has infinitely many similar solutions."
  - q: "Do these formulas work for right triangles too?"
    a: "Yes. The law of cosines reduces to the Pythagorean theorem when the angle is 90° (because cos 90° = 0), and the law of sines still holds. For a right triangle you can also use plain SOHCAHTOA, but the general laws give the same answers."
  - q: "How do I find the area once I've solved the triangle?"
    a: "If you know two sides and the angle between them, area = ½·a·b·sin C. If you know all three sides, use Heron's formula. The triangle solver reports the area automatically no matter which three values you enter."
  - q: "What if my numbers give 'no triangle'?"
    a: "It means the measurements are geometrically impossible, for example, in SSS the longest side exceeds the sum of the other two (violating the triangle inequality), or in SSA the sine of the unknown angle comes out greater than 1. Double-check your inputs; real triangles can't be built from those values."
draft: false
---

**You know two sides and an angle, or two angles and a side, and you need the rest of the triangle.** The whole job comes down to one decision: which rule fits what you already know. Get that right and the missing sides and angles fall out in a line or two of algebra. Here's the decision, case by case.

<aside class="key-takeaways">

**Key takeaways**

- **Law of cosines** for **SSS** (three sides) and **SAS** (two sides + the angle between them).
- **Law of sines** for **ASA / AAS** (two angles + a side), find the third angle first.
- **SSA** (two sides + a non-included angle) is the **ambiguous case**: it can give **two triangles, one, or none**.
- You always need **at least one side**, three angles set the shape but not the size.
- Angles of any (flat) triangle sum to **180°**.

</aside>

<figure>
<img src="/blog/infographic-solve-triangle.svg" alt="If you know three sides (SSS) or two sides and the included angle (SAS), use the law of cosines c² = a² + b² − 2ab·cos C. If you know two angles and a side (ASA or AAS), use the angle sum then the law of sines a/sin A = b/sin B = c/sin C. If you know two sides and a non-included angle (SSA), use the law of sines, the ambiguous case that can give two triangles, one, or none. You always need at least one side." width="1200" height="640" loading="lazy" />
<figcaption>Match the rule to the three things you know.</figcaption>
</figure>

## The setup: sides, angles and how they pair

Label the sides **a, b, c** and the angle opposite each with the matching capital: **A** is opposite **a**, and so on. To pin down a triangle you need **three pieces of information, at least one of them a side**, because three angles alone fix the shape but leave the size free (all equilateral triangles have three 60° angles, whatever their size).

The names for each starting position come from the order the knowns go around the triangle, S for a side, A for an angle. **SAS** means side-angle-side, with the angle wedged between the two sides; **ASA** means angle-side-angle, with the side between the two angles; and so on. The four solvable combinations, plus the two that don't work on their own, look like this:

| You know | Case | Rule to start with | Notes |
| --- | --- | --- | --- |
| Three sides | SSS | Law of cosines | Always exactly one triangle (if the triangle inequality holds) |
| Two sides + included angle | SAS | Law of cosines | Always exactly one triangle |
| Two angles + a side | ASA / AAS | Law of sines | Find the third angle first; always one triangle |
| Two sides + non-included angle | SSA | Law of sines | **Ambiguous**, 0, 1, or 2 triangles |
| Three angles only | AAA |, | Shape only; infinitely many sizes |
| Two sides only, no angle | SS |, | Not enough information |

The rest of this guide walks each solvable case with real numbers.

## Law of cosines: SSS and SAS

The **[law of cosines](https://en.wikipedia.org/wiki/Law_of_cosines)** generalises Pythagoras to any triangle:

> c² = a² + b² − 2ab·cos C

Notice that when C = 90°, cos C = 0 and the formula collapses to plain c² = a² + b², Pythagoras is just the right-angle special case.

- **SSS (three sides):** rearrange it to find each angle, e.g. cos C = (a² + b² − c²) / (2ab). Do it twice and the third angle is 180° minus the other two.
- **SAS (two sides + the included angle):** the angle sits *between* the two known sides, so plug straight in to get the opposite (third) side, then switch to finding the remaining angles.

Use the law of cosines whenever the known angle is **between** your two known sides, or when you know **all three sides**.

**Worked SAS example.** Say a = 8, b = 5, and the included angle C = 60°. The opposite side is

> c² = 8² + 5² − 2·8·5·cos 60° = 64 + 25 − 80·0.5 = 49, so c = 7.

Now switch to the law of sines to finish: sin A = a·sin C / c = 8·sin 60° / 7 ≈ 0.9897, so A ≈ 81.8°, and B = 180° − 60° − 81.8° ≈ 38.2°. A useful habit is to solve for the *smaller* remaining angle first with the law of sines, because a small angle is always acute, that sidesteps the sign ambiguity that bites in the SSA case below.

**Worked SSS example.** With a = 7, b = 8, c = 9:

> cos C = (49 + 64 − 81) / (2·7·8) = 32 / 112 ≈ 0.2857, so C ≈ 73.4°.

Repeat for A: cos A = (64 + 81 − 49) / (2·8·9) = 96 / 144 = 0.6667, so A ≈ 48.2°. Then B = 180° − 73.4° − 48.2° ≈ 58.4°. Because every angle came from an inverse cosine, which returns a unique value between 0° and 180°, there's no ambiguity to worry about, SSS always yields one triangle.

## Law of sines: ASA and AAS

The **law of sines** says each side is proportional to the sine of its opposite angle:

> a / sin A = b / sin B = c / sin C

If you know **two angles and any side** (ASA = side between the angles, AAS = side outside them), first get the third angle from **180° − (A + B)**. Now you know all three angles and one side, so the shared ratio gives the other two sides directly.

**Worked ASA/AAS example.** Suppose A = 40°, B = 60°, and the side a = 10 (opposite A). The third angle is C = 180° − 40° − 60° = 80°. The common ratio is a / sin A = 10 / sin 40° ≈ 15.56, so

> b = 15.56 · sin 60° ≈ 13.5 and c = 15.56 · sin 80° ≈ 15.3.

Whether you were handed the side between the two angles or off to one side doesn't change the procedure, once you know all three angles and any one side, the ratio does the rest.

## The ambiguous case: SSA

**SSA**, two sides and an angle *not* between them, is the one that trips people up. You'd reach for the law of sines, but there's a catch: the known side opposite the known angle might be long enough to close the triangle in **two different ways**, in **one** way, or **not at all**.

- Compute sin of the unknown angle from the law of sines.
- If that value is **greater than 1**, no triangle exists (the side is too short to reach).
- If it's **less than 1**, there are usually **two** candidate angles (an acute one and its obtuse supplement), check each against the 180° rule; sometimes only one survives.

**Worked SSA example.** Take a = 6, b = 8, and A = 30° (the angle opposite the shorter known side a). From the law of sines, sin B = b·sin A / a = 8·sin 30° / 6 = 4/6 ≈ 0.6667. Because sine is positive for both acute and obtuse angles, B could be about **41.8°** *or* its supplement **138.2°**. Test each against the angle sum:

- If B ≈ 41.8°, then C = 180° − 30° − 41.8° = 108.2°, valid.
- If B ≈ 138.2°, then C = 180° − 30° − 138.2° = 11.8°, also valid.

Both survive, so this SSA setup genuinely has **two** triangles. Contrast that with a = 10, b = 8, A = 30°: now sin B = 8·sin 30° / 10 = 0.4, giving B ≈ 23.6°; the obtuse alternative 156.4° would push the angle sum past 180°, so only **one** triangle exists. And if the opposite side were far too short, say sin B worked out above 1, you'd get **no** triangle at all.

That's why a careful solver reports **every** triangle that fits, rather than silently picking one. The [triangle solver](/math/triangle-solver/) does exactly this: enter any three values and it detects the case, applies the right law, and shows both answers when SSA is ambiguous, along with the area and a scaled diagram.

## Getting the area too

Once you have two sides and the angle between them, the area is **½·a·b·sin C**. From three sides, use [Heron's formula](/math/triangle-area/): with s = (a + b + c)/2 (the semi-perimeter), the area is √[s(s−a)(s−b)(s−c)]. For the SSS example above (a = 7, b = 8, c = 9), s = 12 and the area is √(12·5·4·3) = √720 ≈ 26.8 square units. The [triangle solver](/math/triangle-solver/) reports the area whichever way you entered the triangle, so you never have to pick the formula yourself.

## A quick decision checklist

When you sit down with three known values, run this order:

1. **Count your sides and angles**, and note whether the known angle is between the known sides.
2. **Three sides or a wedged-in angle?** Reach for the law of cosines.
3. **Two angles?** Subtract from 180° for the third, then use the law of sines.
4. **Two sides and a stray angle (SSA)?** Use the law of sines but check the supplement, expect the possibility of two answers.
5. **Only angles, or only two sides with no angle?** You can't solve it; you need one more measurement.

Keep degrees and radians consistent throughout, carry a few extra decimal places in intermediate steps to avoid rounding drift, and round only your final answers.

---

*The relationships here, the laws of sines and cosines and the 180° angle sum, are exact identities of Euclidean (flat-plane) geometry. The triangle solver computes them in your browser with standard floating-point trigonometry; nothing is uploaded.*
