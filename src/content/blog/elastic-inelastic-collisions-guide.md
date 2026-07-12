---
title: "Elastic vs Inelastic Collisions: What's Conserved (and Why)"
description: "Momentum is conserved in every collision — but kinetic energy is only conserved in an elastic one. Here's the difference, the formulas for the final velocities, where the 'lost' energy goes, and the coefficient of restitution that ties it all together."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/physics/collision-calculator/", "/physics/momentum-calculator/", "/physics/kinetic-energy-calculator/"]
keywords:
  - elastic vs inelastic collision
  - is momentum conserved in inelastic collision
  - elastic collision formula
  - conservation of momentum
  - coefficient of restitution
  - final velocity collision
heroImage: /blog/elastic-inelastic-collisions-guide.png
heroAlt: "Elastic collision (objects bounce apart, momentum and kinetic energy conserved) versus perfectly inelastic (objects stick, only momentum conserved), with a worked 2 kg + 1 kg example"
faqs:
  - q: "Is momentum conserved in an inelastic collision?"
    a: "Yes. Momentum is conserved in every collision with no external forces — elastic or inelastic. What differs is kinetic energy: it's only conserved in an elastic collision. In an inelastic one, some kinetic energy becomes heat, sound and deformation."
  - q: "What is the difference between elastic and inelastic collisions?"
    a: "In an elastic collision both momentum and kinetic energy are conserved and the objects bounce apart. In an inelastic collision only momentum is conserved; a perfectly inelastic collision is the extreme where the objects stick together and the most kinetic energy is lost."
  - q: "How do I find the final velocities in an elastic collision?"
    a: "v₁ = ((m₁−m₂)u₁ + 2m₂u₂)/(m₁+m₂) and v₂ = ((m₂−m₁)u₂ + 2m₁u₁)/(m₁+m₂). These come from solving conservation of momentum and kinetic energy together."
  - q: "What is the coefficient of restitution?"
    a: "A number e from 0 to 1 for how bouncy a collision is: the relative speed after divided by the relative speed before. e = 1 is perfectly elastic, e = 0 is perfectly inelastic (objects stick), and real collisions fall in between."
  - q: "Where does the kinetic energy go in an inelastic collision?"
    a: "Into heat, sound, and permanent deformation of the objects. Momentum is still conserved because those processes don't exert a net external force, but the ordered kinetic energy is converted into disordered forms."
  - q: "What happens when two equal masses collide elastically?"
    a: "They exchange velocities. A moving ball striking an identical stationary one stops dead while the other moves off at the original speed — the classic Newton's-cradle behaviour."
draft: false
---

**Every collision conserves momentum. Only some conserve kinetic energy.** That one distinction — which quantity survives — is the whole story of elastic versus inelastic collisions, and it's what lets you predict what happens when two things hit.

<aside class="key-takeaways">

**Key takeaways**

- **Momentum is conserved in every collision** (no external forces): m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂.
- **Kinetic energy is conserved only in an *elastic* collision** (e = 1); the objects bounce apart.
- **A *perfectly inelastic* collision (e = 0)** loses the most kinetic energy — the objects stick together.
- **The coefficient of restitution e** (0 to 1) says where a real collision falls.
- **Equal masses, elastic** → they simply **swap velocities**.

</aside>

<figure>
<img src="/blog/infographic-elastic-inelastic-collisions.svg" alt="Two panels. Elastic (e=1): a 2 kg ball at 3 m/s hits a still 1 kg ball; afterward 1 m/s and 4 m/s, momentum 6 conserved, kinetic energy 9 J conserved, objects bounce apart. Perfectly inelastic (e=0): the two stick and move at 2 m/s together, momentum 6 conserved but kinetic energy drops 9 J to 6 J. Real collisions have 0 < e < 1." width="1200" height="640" loading="lazy" />
<figcaption>Same momentum on both sides — but the elastic collision keeps its kinetic energy while the inelastic one loses it.</figcaption>
</figure>

## The one law that always holds: momentum

In any collision with no outside forces, the total momentum before equals the total after:

```
m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
```

This is true whether the objects bounce, stick, shatter or explode. It's the anchor for every collision problem. But it's a single equation with two unknowns (v₁ and v₂), so momentum alone can't finish the job — you need a second condition. That condition is what separates elastic from inelastic.

## Elastic: kinetic energy survives too

In a **perfectly elastic** collision, kinetic energy is *also* conserved:

```
½m₁u₁² + ½m₂u₂² = ½m₁v₁² + ½m₂v₂²
```

Solving the two conservation laws together gives the final velocities:

```
v₁ = ((m₁ − m₂)u₁ + 2m₂u₂) / (m₁ + m₂)
v₂ = ((m₂ − m₁)u₂ + 2m₁u₁) / (m₁ + m₂)
```

Take a 2 kg ball at 3 m/s hitting a stationary 1 kg ball: v₁ = 1 m/s, v₂ = 4 m/s. Check it — momentum is 6 before (2×3) and 6 after (2×1 + 1×4), and kinetic energy is 9 J before and 9 J after. Both conserved; the balls bounce apart. Truly elastic collisions are an idealisation (billiard balls and atoms come close).

A neat special case: **equal masses swap velocities**. That's why a Newton's cradle passes the motion straight through.

## Inelastic: energy leaks away

In an **inelastic** collision, kinetic energy is *not* conserved — some is converted to heat, sound and deformation as the objects crumple. Momentum still holds (those processes exert no net external force), but the objects come apart slower, or don't come apart at all.

The extreme is a **perfectly inelastic** collision, where the objects **stick together** and move as one. Their common velocity is just the total momentum divided by the total mass:

```
v = (m₁u₁ + m₂u₂) / (m₁ + m₂)
```

For the same 2 kg + 1 kg example: v = 6 ÷ 3 = 2 m/s. Now the kinetic energy drops from 9 J to ½(3)(2²) = 6 J — **3 J vanished** into heat and sound. This is the most kinetic energy any collision of those two objects can lose while still conserving momentum.

## The dial between them: coefficient of restitution

Real collisions live between the two extremes, and the **coefficient of restitution e** measures where:

```
e = (relative speed after) / (relative speed before)
```

**e = 1** is perfectly elastic, **e = 0** is perfectly inelastic, and a dropped basketball (e ≈ 0.8) or a tennis ball (e ≈ 0.75) sits in between — which is exactly why they bounce back to less than their drop height. Give the collision calculator an e and it solves that in-between case directly.

## Solve any collision

The [collision calculator](/physics/collision-calculator/) takes the two masses and initial velocities and returns the final velocities for an elastic, perfectly inelastic, or custom-e collision — along with the momentum (to see it's conserved) and the kinetic energy before, after and lost. Pair it with the [momentum](/physics/momentum-calculator/) and [kinetic energy](/physics/kinetic-energy-calculator/) calculators to check each piece. Like every LazyTools tool, it runs entirely in your browser.

---

*These are the standard results for one-dimensional two-body collisions: momentum conserved always, kinetic energy conserved only when e = 1, with the coefficient of restitution interpolating between. Velocities are signed (negative = opposite direction). Source: standard introductory-mechanics treatment of collisions (e.g. Halliday/Resnick, Serway).*
