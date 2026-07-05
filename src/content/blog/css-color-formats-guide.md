---
title: "HEX, RGB, HSL and CMYK: CSS Color Formats Explained (With Conversion Math)"
description: "#1d87f1 = rgb(29, 135, 241) = hsl(210, 88%, 53%) — the same color in three dialects. How each format works, when to use which, the manual conversion math, and why CMYK never quite matches."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/color/color-converter/", "/color/hex-to-rgb/", "/color/rgb-to-hex/", "/color/css-gradient-generator/", "/color/color-mixer/"]
keywords:
  - hex vs rgb vs hsl
  - css color formats
  - hex to rgb conversion
  - what is hsl
  - rgb to cmyk difference
  - hex color code explained
  - css color best practices
  - 8 digit hex alpha
heroImage: /blog/css-color-formats-guide.png
heroAlt: "CSS color formats — the same blue as HEX #1d87f1, RGB and HSL"
faqs:
  - q: "Are HEX and RGB different colors?"
    a: "Never — they are two notations for the same three 0–255 channels. #1d87f1 is rgb(29, 135, 241): 1d is 29 in base-16, 87 is 135, f1 is 241."
  - q: "When should I use HSL instead of HEX?"
    a: "When deriving variants: HSL separates hue from saturation and lightness, so 'same color, 20% darker' is literally L − 20. Design tokens often store HEX but compute states in HSL."
  - q: "How do I convert HEX to RGB by hand?"
    a: "Split into pairs and convert each from base-16: first digit × 16 + second digit, with a–f meaning 10–15. f1 = 15 × 16 + 1 = 241."
  - q: "What is 8-digit HEX?"
    a: "HEX with an alpha pair appended: #1d87f180 is the same blue at 50% opacity (80 in base-16 = 128 of 255). Supported in all modern browsers, equivalent to rgba()."
  - q: "Why does my CMYK print not match the screen?"
    a: "Screens emit light (additive RGB); print reflects it through ink (subtractive CMYK) — the color spaces overlap imperfectly, and results depend on the printer's profile. Formula conversions like ours are the standard starting approximation; brand-critical print needs ICC-profile workflows."
  - q: "What is a 3-digit HEX like #09c?"
    a: "Shorthand where each digit doubles: #09c = #0099cc. Handy for quick prototyping; expanded form is clearer in shared code."
  - q: "Is uppercase or lowercase HEX correct?"
    a: "Both are identical to the browser (#1D87F1 = #1d87f1). Most style guides standardize on lowercase for consistency."
draft: false
---

**HEX, RGB and HSL are the same color wearing different clothes: #1d87f1 = rgb(29, 135, 241) =
hsl(210, 88%, 53%).** HEX is RGB written in base-16; HSL re-expresses the identical color as hue,
saturation and lightness; only CMYK — the print format — is genuinely different territory. Convert any
of them instantly in the [color converter](/color/color-converter/), or read the mechanics below.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>HEX = RGB in base-16:</strong> two digits per channel — #1d87f1 → 29, 135, 241</li>
<li><strong>HSL is for adjusting:</strong> darker = lower L, muted = lower S, different color = change H</li>
<li><strong>Alpha:</strong> rgba(29,135,241,0.5) or 8-digit HEX #1d87f180 — identical results</li>
<li><strong>CMYK is print:</strong> subtractive ink math; screen-to-print is an approximation, not an equation</li>
<li>Pick one format per codebase for tokens (usually HEX) and convert at the edges</li>
</ul>
</aside>

## The three screen formats, one color model

Everything on screen is additive RGB — three light channels, 0 to 255 each. The formats differ only in
how they *write* those numbers:

| Format | Example | Strength |
|---|---|---|
| HEX | `#1d87f1` | compact single token — brand guides, copy-paste, CSS variables |
| RGB | `rgb(29, 135, 241)` | numeric channels — alpha via `rgba()`, JS math |
| HSL | `hsl(210, 88%, 53%)` | human-meaningful — hue 0–360°, saturation, lightness |
| CMYK | `88%, 44%, 0%, 5%` | print ink mix — different world, see below |

<figure>
<img src="/blog/infographic-color-formats.svg" alt="Infographic: one blue swatch labeled four ways — HEX #1d87f1 for tokens, rgb(29, 135, 241) with alpha via rgba, hsl(210, 88%, 53%) where lowering L darkens, and CMYK 88/44/0/5 as the print approximation — plus the hex-pair mapping 1d=29, 87=135, f1=241" width="1200" height="620" loading="lazy" />
<figcaption>Same pixels, four notations — and the base-16 mapping that ties HEX to RGB.</figcaption>
</figure>

## HEX ↔ RGB: the base-16 mechanics

A HEX code is three two-digit base-16 numbers glued together. Converting by hand:

1. Split `#1d87f1` into pairs: `1d`, `87`, `f1`.
2. Each pair: first digit × 16 + second digit, where a–f mean 10–15.
3. `1d` = 1×16 + 13 = **29** · `87` = 8×16 + 7 = **135** · `f1` = 15×16 + 1 = **241**.

Going the other way, divide each channel by 16 — quotient then remainder — and **pad values under 16
with a leading zero**: rgb(0, 10, 200) is `#000ac8`, not `#0ac8` (the most common manual mistake). The
[HEX to RGB](/color/hex-to-rgb/) and [RGB to HEX](/color/rgb-to-hex/) tools do both directions with a
live swatch.

**Transparency** works in both dialects: `rgba(29, 135, 241, 0.5)` or the 8-digit HEX `#1d87f180`
(80₁₆ = 128, half of 255) — identical results, universal browser support.

## HSL: the format you adjust in

HSL maps the same color onto three human-meaningful axes: **hue** (position on the color wheel,
0–360°), **saturation** (gray → vivid) and **lightness** (black → white). Its superpower is
*derivation*:

- Hover state: `hsl(210, 88%, 43%)` — same blue, L −10.
- Muted variant: `hsl(210, 40%, 53%)` — same blue, S −48.
- Complementary accent: `hsl(30, 88%, 53%)` — H +180.

That's why design systems compute state colors in HSL even when tokens are stored as HEX — and it's
the logic behind the [shades & tints generator](/color/color-shades-generator/), which walks lightness
for you. For blending two arbitrary colors instead, the [color mixer](/color/color-mixer/) interpolates
the RGB channels — with the counterintuitive footnote that screen-mixing blue + yellow gives gray, not
green (light is additive; paint is subtractive).

## CMYK: why print never quite matches

CMYK describes **ink**, not light: cyan, magenta, yellow and black percentages that *absorb* color from
white paper. Two consequences: the conversion is a formula-based approximation (the standard math the
[converter](/color/color-converter/) uses), and the final result depends on the actual printer, paper
and ICC profile. Treat converted CMYK as the starting point for a proof, and never spec a brand color
for print from screen values alone — that's what Pantone matching and ICC workflows exist for.

## Which format where: the practical rules

1. **Tokens and brand docs → HEX** — one compact string that survives every copy-paste.
2. **Needs opacity → rgba() or 8-digit HEX** — pick per codebase and stay consistent.
3. **Deriving hover/disabled/dark variants → HSL** — adjust L and S, keep H.
4. **Gradients → HEX endpoints** in `linear-gradient()` — the
   [gradient generator](/color/css-gradient-generator/) emits copy-ready CSS.
5. **Print → CMYK via proofs**, never via screen conversion alone.

## Common color-format mistakes

1. **Dropping leading zeros** in HEX (`#0ac8` for `#000ac8`) — malformed and misrendered.
2. **Adjusting colors in HEX** by nudging digits — you're editing base-16 blind; convert to HSL,
   adjust, convert back.
3. **Expecting CMYK fidelity from a formula** — the gamuts differ; proofs decide.
4. **Mixing alpha conventions** in one codebase — rgba() here, 8-digit HEX there makes review harder;
   standardize.
5. **Assuming hsl() values transfer between color pickers** — some tools show HSB/HSV, which is *not*
   HSL despite the similar name; the B/V axis behaves differently from L.

## Quick summary

HEX, RGB and HSL are one color model in three notations — HEX for storing, RGB for alpha and math,
HSL for adjusting — while CMYK is a print approximation to verify on paper. The conversions are exact
and mechanical (each HEX pair is one channel in base-16), and the
[color converter](/color/color-converter/) moves between all four with a live swatch, entirely in your
browser.

*Related: [contrast checker](/color/contrast-checker/) to validate the colors you pick ·
[shades generator](/color/color-shades-generator/) · [gradient generator](/color/css-gradient-generator/).*
