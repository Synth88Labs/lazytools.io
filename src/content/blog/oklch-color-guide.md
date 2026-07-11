---
title: "OKLCH: The Modern CSS Color Format (and How to Convert from HEX)"
description: "OKLCH is a perceptually uniform color format — oklch(L% C H) — now supported in ~95% of browsers and Tailwind CSS 4's default. Why it beats HEX and HSL for building shade ramps, how to convert HEX to OKLCH, and why you still keep a HEX fallback."
pubDate: 2026-07-11
updatedDate: 2026-07-11
archetype: explainer
tools: ["/color/oklch-color-picker/", "/color/hex-to-oklch/", "/color/color-harmony-generator/"]
keywords:
  - oklch
  - oklch color
  - hex to oklch
  - oklch vs hsl
  - css color 4
  - what is oklch
  - tailwind oklch
heroImage: /blog/oklch-color-guide.png
heroAlt: "OKLCH — the perceptually uniform CSS color format with lightness, chroma and hue"
faqs:
  - q: "What is OKLCH?"
    a: "OKLCH is a perceptually uniform color format written oklch(L% C H): L is lightness (0–100%), C is chroma (colorfulness, 0 to about 0.37), and H is hue in degrees (0–360). Equal numeric steps look like equal visual steps, which HSL and HEX do not guarantee. It is a CSS Color 4 function supported in roughly 95% of browsers."
  - q: "How do I convert HEX to OKLCH?"
    a: "Decode the HEX to sRGB, linearise it, and apply the OKLab matrices, then express the result in polar form. For example #1d87f1 becomes oklch(62.3% 0.183 253.6). A converter does this exactly — the same math the browser uses for the oklch() function."
  - q: "Is OKLCH better than HSL?"
    a: "For perceptual work, yes. In HSL, a 50%-lightness yellow looks far brighter than a 50%-lightness blue, so lightness ramps are uneven. OKLCH fixes this: lightness is perceptually uniform, so shade scales and hue rotations behave predictably. That is why design systems and Tailwind CSS 4 adopted it."
  - q: "Do all browsers support oklch()?"
    a: "The oklch() CSS function works in all current browsers — Chrome/Edge 111+, Safari 15.4+ and Firefox 113+ — which is about 93–95% of users. For the small remainder and for tools that expect HEX, provide a HEX fallback alongside the oklch() value."
  - q: "Why is my OKLCH color 'out of gamut'?"
    a: "OKLCH can describe colors more saturated than an sRGB screen can display. When that happens, the exact HEX does not exist, so a good converter reduces chroma (keeping lightness and hue) until the color fits and flags it. Wide-gamut (P3) displays can show more of these colors."
  - q: "What is chroma in OKLCH?"
    a: "Chroma (C) is colorfulness — how far the color is from grey. 0 is a neutral grey; higher values are more vivid. Unlike HSL saturation, OKLCH chroma is not capped at a fixed maximum, because the achievable chroma depends on the lightness and hue and on the display's gamut."
draft: false
---

**OKLCH is a way of writing colors — `oklch(L% C H)` — that matches how your eyes actually work.** L is
lightness, C is chroma (colorfulness), H is hue. It is a CSS Color 4 function supported in about 95% of
browsers and is Tailwind CSS 4's default color space. The headline benefit: equal number changes look
like equal visual changes, which HEX and HSL never guaranteed. `#1d87f1` is `oklch(62.3% 0.183 253.6)`.

<aside class="key-takeaways">

**Key takeaways**

- **OKLCH = Lightness, Chroma, Hue** — `oklch(62.3% 0.183 253.6)`, perceptually uniform.
- **Beats HSL** because lightness is even across hues — shade ramps and hue rotations behave predictably.
- **Ready today:** CSS Color 4, ~93–95% browser support, Tailwind CSS 4's default color space.
- **Convert HEX → OKLCH** by linearising sRGB and applying the OKLab matrices (Björn Ottosson).
- **Keep a HEX fallback** — OKLCH can describe colors too vivid for an sRGB screen (out of gamut).

</aside>

## The three parts

<figure>
<img src="/blog/infographic-oklch.svg" alt="Infographic: OKLCH has three parts — L lightness 0 to 100 percent, C chroma 0 to about 0.37 from grey to vivid, and H hue 0 to 360 degrees. oklch(62.3% 0.183 253.6) equals #1d87f1. Unlike HSL, OKLCH lightness is perceptually even, so ramps are predictable. It is CSS Color 4, supported in about 93 to 95 percent of browsers and Tailwind 4's default, with a HEX fallback for out-of-gamut colors." width="1200" height="640" loading="lazy" />
<figcaption>Lightness, chroma, hue — and a HEX fallback for colors too vivid for sRGB.</figcaption>
</figure>

- **L — Lightness** (`0%`–`100%`): how light the color is, from black to white. Crucially, this is
  *perceptual* lightness, so `50%` looks like a mid-grey regardless of hue.
- **C — Chroma**: colorfulness, from `0` (grey) upward (about `0.37` at the most vivid). There is no fixed
  maximum — how much chroma is achievable depends on the lightness, the hue, and the display.
- **H — Hue** (`0`–`360`): the angle on the color wheel — roughly `0` red, `150` green, `250` blue,
  `300` violet.

Paste any color into the [OKLCH color picker](/color/oklch-color-picker/) to see all three, alongside
OKLAB, LAB, LCH, HWB and the HEX/RGB forms.

## Why not just use HSL?

HSL has an *L* too, so why switch? Because HSL's lightness is a lie. A `hsl(60, 100%, 50%)` yellow is
blindingly bright, while `hsl(240, 100%, 50%)` blue is dark — same "50%", wildly different perceived
lightness. Build a UI's shade scale in HSL and the steps look uneven; rotate the hue and some colors
jump in brightness.

OKLCH is built on the **OKLab** color space, which was designed so that equal numeric distances match
equal perceived distances. Hold L and C constant, sweep the hue, and every color stays the same
lightness. That is exactly what you want for **design tokens**: a `500` shade that reads as the same
weight across your entire palette.

## How to convert HEX to OKLCH

The conversion is a fixed sequence of matrix operations — deterministic and exact:

1. **Decode** the HEX to sRGB channels (0–255).
2. **Linearise** each channel (undo the sRGB gamma curve).
3. Apply the **OKLab matrices** (Björn Ottosson's published constants): linear-sRGB → LMS → OKLab.
4. Convert OKLab's rectangular *a*/*b* to **polar** chroma and hue: `C = √(a² + b²)`, `H = atan2(b, a)`.

The result for `#1d87f1` is `oklch(62.3% 0.183 253.6)`. The [HEX to OKLCH converter](/color/hex-to-oklch/)
runs exactly this and shows OKLAB and LAB too — the same math the browser uses, so what you copy is what
renders. (A chatbot, by contrast, will confidently produce a *plausible* OKLCH that is subtly wrong,
because it can't run the matrices.)

## The one gotcha: gamut

OKLCH is more expressive than an sRGB screen. You can write an `oklch()` value whose chroma is higher
than any `#rrggbb` can show — it is **out of gamut**. Converting *back* to HEX then has no exact answer,
so a good tool reduces chroma (holding lightness and hue) until the color fits, and tells you it did.
This is why you still ship a **HEX fallback**: for the ~5% of browsers without `oklch()`, and for design
or email tools that only speak HEX. The [OKLCH to HEX converter](/color/oklch-to-hex/) flags out-of-gamut
input and always returns a displayable fallback.

```css
.button {
  background: #1d87f1;                 /* fallback first */
  background: oklch(62.3% 0.183 253.6); /* modern browsers override */
}
```

## Where it pays off

Once colors are in OKLCH, the perceptual evenness makes two everyday jobs easy: building lightness ramps
(step L in equal amounts for a clean `50`–`950` scale) and rotating hues for
[color harmonies](/color/color-harmony-generator/) that stay balanced. It is the reason Tailwind 4 moved
its default palette to OKLCH.

## Quick summary

OKLCH writes a color as lightness, chroma and hue in a perceptually uniform space, so equal steps look
equal — fixing HSL's uneven lightness. It is a CSS Color 4 function with ~95% browser support and is
Tailwind 4's default. Convert HEX to OKLCH by linearising sRGB and applying the OKLab matrices (e.g.
`#1d87f1` → `oklch(62.3% 0.183 253.6)`), and keep a HEX fallback for out-of-gamut colors and older
browsers. Try it on the [OKLCH color picker](/color/oklch-color-picker/).

*Sources: CSS Color Module Level 4 (W3C); Björn Ottosson, "A perceptual color space for image processing"
(OKLab); Tailwind CSS 4 color documentation; MDN oklch(). Educational information.*
