---
title: "The SUVAT Equations: Solve Any Constant-Acceleration Problem"
description: "The five SUVAT kinematic equations link displacement, initial and final velocity, acceleration and time. Know any three and you can find the other two. How to pick the right equation, worked examples, and why they only work for constant acceleration."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/physics/kinematic-equations-calculator/", "/physics/projectile-motion-calculator/", "/physics/free-fall-calculator/"]
keywords:
  - suvat equations
  - kinematic equations
  - equations of motion
  - constant acceleration
  - v = u + at
  - how to use suvat
heroImage: /blog/suvat-equations-guide.png
heroAlt: "The five SUVAT equations for constant-acceleration motion"
faqs:
  - q: "What are the SUVAT equations?"
    a: "The five kinematic equations for motion with constant acceleration: v = u + at; s = ½(u+v)t; v² = u² + 2as; s = ut + ½at²; and s = vt − ½at². SUVAT stands for the five variables — s (displacement), u (initial velocity), v (final velocity), a (acceleration) and t (time)."
  - q: "How do I know which SUVAT equation to use?"
    a: "List the three quantities you know and the one you want to find — that's four variables. Each equation leaves out exactly one variable, so choose the equation that leaves out the fifth (the one you neither know nor need). For example, if you don't know time, use v² = u² + 2as."
  - q: "How many variables do I need to solve a SUVAT problem?"
    a: "Three. With any three of the five known, the other two are fully determined for constant acceleration. A calculator can pick the equations for you once you enter three values."
  - q: "Do the SUVAT equations work for falling objects?"
    a: "Yes — vertical motion under gravity has constant acceleration g (about 9.8 m/s²), so free fall and the vertical part of projectile motion are SUVAT problems. Set a = g (or −g if up is positive)."
  - q: "When do the SUVAT equations not apply?"
    a: "Only when acceleration is constant. If the acceleration changes with time (air resistance, a varying force), SUVAT is invalid and you need calculus instead."
  - q: "Why does v² = u² + 2as sometimes give two answers?"
    a: "Taking the square root gives a positive and a negative value, corresponding to the object moving in either direction as it passes a point. Choose the sign that matches your defined positive direction."
draft: false
---

**Almost every motion problem in introductory physics is a SUVAT problem.** If acceleration is constant,
five variables — displacement `s`, initial velocity `u`, final velocity `v`, acceleration `a` and time
`t` — are tied together by five equations. **Know any three, and the other two are fixed.** The only skill
is picking the right equation, and there's a simple trick for that.

<aside class="key-takeaways">

**Key takeaways**

- **SUVAT = s, u, v, a, t** — the five variables of constant-acceleration motion.
- The five equations: `v = u+at` · `s = ½(u+v)t` · `v² = u²+2as` · `s = ut+½at²` · `s = vt−½at²`.
- **Each equation leaves out one variable** — pick the one missing what you neither know nor want.
- Know **any three** variables → solve the other two.
- Valid **only for constant acceleration** (including gravity); not for changing acceleration.

</aside>

## The five equations

<figure>
<img src="/blog/infographic-suvat.svg" alt="Infographic: the five SUVAT equations for constant acceleration. v = u + at (leaves out s); s = ½(u+v)t (leaves out a); v² = u² + 2as (leaves out t); s = ut + ½at² (leaves out v); s = vt − ½at² (leaves out u). Know any three of s, u, v, a, t and solve the other two." width="1200" height="640" loading="lazy" />
<figcaption>Five equations, each deliberately missing one variable.</figcaption>
</figure>

Here they are, with the variable each one *doesn't* contain:

| Equation | Missing variable |
|---|---|
| `v = u + at` | s |
| `s = ½(u + v)t` | a |
| `v² = u² + 2as` | t |
| `s = ut + ½at²` | v |
| `s = vt − ½at²` | u |

That "missing variable" column is the whole trick.

## How to pick the right equation

The reliable method:

1. **Write down the three values you know** and mark **the one you want to find** — that's four of the
   five variables.
2. **The fifth variable** is the one you neither know nor need.
3. **Choose the equation that leaves out that fifth variable.**

**Example.** A car accelerates from `u = 0` at `a = 2 m/s²` for `t = 5 s`. How far does it travel?

- Known: u, a, t. Want: s. Not involved: **v**.
- The equation missing v is `s = ut + ½at²`.
- `s = 0 × 5 + ½ × 2 × 5² = 25 m`.

No guessing — the missing-variable rule points straight to the equation. The
[SUVAT calculator](/physics/kinematic-equations-calculator/) does this selection for you: enter any three
values and it solves the rest.

## The square-root one to watch

`v² = u² + 2as` is the equation with no time in it — perfect for "how fast after this distance"
questions. But it hides a trap: solving for `v` (or `u`) needs a **square root**, and taking a root gives
**two answers**, `+` and `−`. Physically that's an object passing a point moving forwards or backwards.
Pick the sign that matches your chosen positive direction. (This is also exactly the algebra that
AI chatbots are documented to get wrong — a deterministic solver won't.)

## SUVAT and gravity

Vertical motion under gravity is a SUVAT problem because gravity gives a **constant** acceleration
`g ≈ 9.8 m/s²`. So:

- **Free fall** — drop something and use `a = g`. The [free-fall calculator](/physics/free-fall-calculator/)
  is SUVAT with u = 0.
- **Projectile motion** — the vertical component is SUVAT with `a = −g`; the horizontal component has
  a = 0 (constant velocity). The [projectile calculator](/physics/projectile-motion-calculator/) runs
  both and plots the path.

Just be consistent with signs: if you call *up* positive, then `g` is `−9.8` and downward displacement is
negative.

## When SUVAT doesn't work

The one hard rule: **acceleration must be constant.** If it changes — air resistance that grows with
speed, a varying applied force, circular motion — SUVAT is invalid, and you need calculus (integrating the
acceleration) instead. For the constant-acceleration world of most exam questions, though, the five
equations cover everything.

## Quick summary

The SUVAT equations describe constant-acceleration motion with five linked variables (s, u, v, a, t).
Know any three and solve the other two by choosing the equation that omits the variable you neither know
nor need. Watch the ± from the square root in `v² = u² + 2as`, use `a = g` for gravity, and remember it
only holds when acceleration is constant. Solve one instantly with the
[SUVAT calculator](/physics/kinematic-equations-calculator/).

*Sources: standard kinematics (equations of motion for uniform acceleration) as taught in
GCSE/A-Level/AP/IB physics. Educational information.*
