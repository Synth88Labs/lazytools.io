---
title: "The SUVAT Equations: Solve Any Constant-Acceleration Problem"
description: "The five SUVAT kinematic equations link displacement, initial and final velocity, acceleration and time. Know any three and you can find the other two. How to pick the right equation, worked examples, and why they only work for constant acceleration."
pubDate: 2026-07-11
updatedDate: 2026-08-23
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

## A quick reference: which equation for which question

Once you internalise the "missing variable" idea, most textbook problems fall into a handful of shapes.
This table maps a common question to the variable you can ignore and the equation it points to:

| The question you're asked | Variable not involved | Equation to reach for |
|---|---|---|
| How far did it travel in a given time? | v (final velocity) | `s = ut + ½at²` |
| How fast is it going after a given time? | s (displacement) | `v = u + at` |
| How fast is it going after a given distance? | t (time) | `v² = u² + 2as` |
| How long to cover a distance at known start/end speeds? | a (acceleration) | `s = ½(u + v)t` |
| How far did it travel, knowing only the final speed? | u (initial velocity) | `s = vt − ½at²` |

The last row is the one students forget exists. If a problem hands you the *final* velocity but not the
initial one, `s = vt − ½at²` saves you from solving two equations at once.

## Two more worked examples

**Braking distance.** A cyclist travelling at `u = 8 m/s` brakes at `a = −2 m/s²` until stopping
(`v = 0`). How far do they travel while stopping?

- Known: u, v, a. Want: s. Not involved: **t**.
- The equation missing t is `v² = u² + 2as`.
- `0² = 8² + 2 × (−2) × s` → `0 = 64 − 4s` → `s = 16 m`.

**Two-stage journey.** A train starts from rest, accelerates at `a = 0.5 m/s²` for `t = 20 s`, then
holds that speed. What is its speed at the end of the acceleration phase, and how far has it gone?

- Speed: known u, a, t; want v; missing s → use `v = u + at` = `0 + 0.5 × 20 = 10 m/s`.
- Distance: known u, a, t; want s; missing v → use `s = ut + ½at²` = `0 + ½ × 0.5 × 20² = 100 m`.

Notice that both parts of the same problem used a different equation, each chosen by the missing-variable
rule. That's the pattern to trust.

## The square-root one to watch

`v² = u² + 2as` is the equation with no time in it — perfect for "how fast after this distance"
questions. But it hides a trap: solving for `v` (or `u`) needs a **square root**, and taking a root gives
**two answers**, `+` and `−`. Physically that's an object passing a point moving forwards or backwards.
Pick the sign that matches your chosen positive direction — the other root is often the object's velocity
at the same height on the *way up* versus the *way down*, which is a real answer, just not the one the
question asked for.

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

**Worked example — dropped stone.** You drop a stone into a well and it hits the water after `t = 2 s`.
How deep is the well (ignoring air resistance)? Take *down* as positive, so `u = 0`, `a = g ≈ 9.8 m/s²`,
`t = 2 s`, want s, missing v → `s = ut + ½at² = 0 + ½ × 9.8 × 2² ≈ 19.6 m`. The same setup with *up* as
positive gives `s ≈ −19.6 m` — the same depth, just signed to say "below the start point."

## Where the five equations come from

You don't have to memorise all five as unrelated facts. Two are definitions and the rest follow:

- `v = u + at` is just the definition of constant acceleration — velocity changes by `a` every second.
- `s = ½(u + v)t` is the average-velocity idea: with a straight-line velocity graph, the average speed is
  the midpoint `½(u + v)`, and distance is average speed times time.
- Substituting `v = u + at` into `s = ½(u + v)t` and simplifying gives `s = ut + ½at²`.
- Doing the same substitution the other way gives `s = vt − ½at²`.
- Eliminating `t` between the first two produces the time-free `v² = u² + 2as`.

Seeing them as one family — not five to rote-learn — makes it obvious why "know any three" is enough:
three independent values pin down the straight-line velocity graph completely, and everything else is read
off it.

## Common mistakes to avoid

| Mistake | Fix |
|---|---|
| Mixing up units (km with m, minutes with seconds) | Convert everything to SI (metres, seconds) before substituting. |
| Getting signs inconsistent | Pick one positive direction at the start and apply it to u, v, a and s throughout. |
| Using SUVAT when acceleration isn't constant | Check the scenario first; changing acceleration needs calculus. |
| Forgetting `a` is negative when decelerating | A slowing object has acceleration opposite to its motion. |
| Taking only the `+` square root automatically | Consider whether the `−` root is the physically relevant answer. |

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
