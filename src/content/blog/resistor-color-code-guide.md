---
title: "How to Read a Resistor Color Code (Bands to Ohms)"
description: "A resistor's colored bands are a compact code: the first two are digits, the next is a ×10ⁿ multiplier, and the last is tolerance. Learn the color values, how to tell which end to start from, and how 4, 5 and 6-band resistors differ — with a worked example."
pubDate: 2026-07-12
updatedDate: 2026-08-23
archetype: explainer
tools: ["/electronics/resistor-color-code-calculator/", "/electronics/led-resistor-calculator/", "/electronics/capacitor-code-calculator/"]
keywords:
  - how to read a resistor
  - resistor color code
  - resistor color code chart
  - 4 band resistor color code
  - resistor bands explained
  - read resistor value
heroImage: /blog/resistor-color-code-guide.png
heroAlt: "Reading a 4-band resistor: two digit bands, a multiplier band, and a tolerance band, with the color values"
faqs:
  - q: "How do I read a resistor color code?"
    a: "Read the bands from the end where they're grouped together. On a 4-band resistor the first two are digits, the third is the multiplier (number of zeros), and the fourth is tolerance. Brown-Black-Red-Gold is 1, 0, ×100 = 1,000 Ω (1 kΩ) at ±5%."
  - q: "What are the resistor color code values?"
    a: "As digits: Black 0, Brown 1, Red 2, Orange 3, Yellow 4, Green 5, Blue 6, Violet 7, Grey 8, White 9. The same colors work as ×10ⁿ multipliers, with Gold ×0.1 and Silver ×0.01 for small values."
  - q: "Which end of the resistor do I start reading from?"
    a: "From the end where the bands are grouped closest together, leaving the slightly-separated tolerance band (often gold or silver) last. If it's unclear, the tolerance band is usually the odd one out — gold, silver, or with a wider gap before it."
  - q: "What do the gold and silver bands mean?"
    a: "As the tolerance band, gold is ±5% and silver ±10% — the two most common. As a multiplier band (third position), gold means ×0.1 and silver ×0.01, used for resistors below 10 ohms."
  - q: "What is the difference between 4, 5 and 6-band resistors?"
    a: "4-band has two digit bands and a looser tolerance; 5-band adds a third digit for a more precise value (typically ±1%); 6-band adds a temperature-coefficient band showing how much the resistance drifts with temperature (in ppm per °C)."
  - q: "What does a resistor with no fourth band mean?"
    a: "A missing tolerance band means ±20% — the loosest, and now rare. Most modern resistors have at least a gold (±5%) or brown (±1%) tolerance band."
  - q: "How accurate do I need to be about the tolerance?"
    a: "For most hobby circuits ±5% (gold) is fine; precision analog or timing circuits may need ±1% (brown) or better. The tolerance tells you the guaranteed range — a 1 kΩ ±5% resistor is somewhere between 950 Ω and 1,050 Ω."
draft: false
---

**A resistor is too small to print a number on, so its value is written in colored bands** — a code that looks cryptic until you know the trick. Once you do, you can read any resistor at a glance: the first bands are digits, the next multiplies them, and the last tells you how precise it is.

<aside class="key-takeaways">

**Key takeaways**

- **First two bands = digits; next band = ×10ⁿ multiplier; last band = tolerance.**
- **Colors as digits:** Black 0, Brown 1, Red 2, Orange 3, Yellow 4, Green 5, Blue 6, Violet 7, Grey 8, White 9.
- **Read from the grouped end** — the tolerance band (often gold/silver) goes last.
- **Gold = ±5%, Silver = ±10%** tolerance (or ×0.1 / ×0.01 as a multiplier).
- **5-band** adds a third digit for precision; **6-band** adds a temperature coefficient.

</aside>

<figure>
<img src="/blog/infographic-resistor-color-code.svg" alt="A 4-band resistor labeled digit 1, digit 2, multiplier and tolerance, with the color-to-value table: Black 0 through White 9, Gold ×0.1 / ±5%, Silver ×0.01 / ±10%, and the worked example Brown-Black-Red-Gold = 1000 Ω = 1 kΩ ±5%." width="1200" height="640" loading="lazy" />
<figcaption>Two digits, a multiplier, a tolerance — that's the whole code.</figcaption>
</figure>

## The color-to-number table

The heart of it is a single mapping from color to digit, easy to remember once and use forever:

| Color | Digit | As multiplier |
|---|---|---|
| Black | 0 | ×1 |
| Brown | 1 | ×10 |
| Red | 2 | ×100 |
| Orange | 3 | ×1 k |
| Yellow | 4 | ×10 k |
| Green | 5 | ×100 k |
| Blue | 6 | ×1 M |
| Violet | 7 | ×10 M |
| Grey | 8 | — |
| White | 9 | — |

Plus two fractional multipliers for small resistors: **Gold ×0.1** and **Silver ×0.01**.

A quick way to lock the sequence into memory is to notice that after black (0) the colors follow the order of a rainbow — red, orange, yellow, green, blue, violet — bracketed by brown at the bottom and grey then white at the top. Many people learn it with a mnemonic; the exact wording matters less than reciting it until the color-to-digit jump is automatic. Once it is, the whole reading process is just "digit, digit, count the zeros, check the tolerance."

## Reading a 4-band resistor

The classic resistor has four bands. Reading from the grouped end:

1. **First band** — the first digit.
2. **Second band** — the second digit.
3. **Third band** — the multiplier (how many zeros to add).
4. **Fourth band** — the tolerance.

So **Brown-Black-Red-Gold** is: `1` (brown), `0` (black), `×100` (red) → **1000 Ω = 1 kΩ**, at **±5%** (gold). A 1 kΩ ±5% resistor is guaranteed to fall between 950 Ω and 1,050 Ω.

### A few more worked examples

Working through several codes makes the pattern stick. In each case, read the first two colors as digits, treat the third as the number of zeros to append, and the fourth as the tolerance.

| Bands | Digits | Multiplier | Value | Tolerance |
|---|---|---|---|---|
| Yellow-Violet-Brown-Gold | 4, 7 | ×10 | 470 Ω | ±5% |
| Brown-Black-Orange-Gold | 1, 0 | ×1 k | 10 kΩ | ±5% |
| Red-Red-Red-Silver | 2, 2 | ×100 | 2.2 kΩ | ±10% |
| Green-Blue-Yellow-Gold | 5, 6 | ×10 k | 560 kΩ | ±5% |
| Brown-Black-Gold-Gold | 1, 0 | ×0.1 | 1.0 Ω | ±5% |

The last row shows the fractional multiplier in action: a gold third band means "multiply by 0.1," so brown-black gives `10`, then `10 × 0.1 = 1.0 Ω`. That example is worth pausing on, because a gold or silver band in the *third* position is easy to misread as tolerance. Position, not just color, decides what a band means.

## Which end do I start from?

This is the one thing beginners get wrong. Read from the end where the bands are **grouped closest together**; the **tolerance band** is slightly separated and comes last. If you can't tell, the tolerance band is usually the odd one out — a gold or silver band, or the one with a visible gap before it. Read a resistor backwards and you'll get a wildly different (and wrong) value, so it's worth checking.

Two quick sanity checks help when a resistor is genuinely ambiguous. First, a resistor's first digit band is never black, because a value can't start with a leading zero — so if one end starts with black, you're reading from the wrong end. Second, if you get a value that isn't a standard part (see the common-values note below), you've probably reversed it. When both ends look plausible, measure it with a multimeter and let the number settle the argument.

## What the tolerance band tells you

Tolerance is the manufacturer's promise about how close the real resistance is to the printed value. It does not mean the part is "off" — it means any resistor in that batch could sit anywhere inside the guaranteed window. The tighter the tolerance, the more the manufacturer sorted and tested, and the more you pay.

| Tolerance color | Tolerance | Typical use |
|---|---|---|
| Silver | ±10% | Non-critical, older parts |
| Gold | ±5% | General-purpose hobby and consumer |
| Brown | ±1% | Precision, most modern 5-band parts |
| Red | ±2% | Precision |
| Green | ±0.5% | High precision |
| Blue | ±0.25% | High precision |
| Violet | ±0.1% | Reference / measurement |
| (no band) | ±20% | Legacy, now rare |

For a **1 kΩ** resistor, that spread is concrete: at ±5% the true value lives between **950 Ω and 1,050 Ω**, but at ±1% it is pinned to **990 Ω to 1,010 Ω**. For most digital, lighting, and pull-up work the wider tolerance is invisible. For voltage dividers, filters, and timing networks, the tighter band earns its cost.

## 5-band and 6-band resistors

Precision resistors add bands. A **5-band** resistor has **three digit bands** before the multiplier, giving an extra significant figure (so a value like 4.7 kΩ can be marked exactly), usually at a tight ±1% tolerance. A **6-band** resistor adds one more: a **temperature coefficient**, in parts per million per °C, telling you how much the resistance drifts as it heats up — important for precision analog and measurement circuits.

Reading a 5-band part is the same routine with one extra digit. **Brown-Green-Black-Red-Brown** is `1`, `5`, `0` for the digits, `×100` for the multiplier, so `150 × 100 = 15,000 Ω = 15 kΩ`, at ±1% (brown). Note how the same physical value can appear as either a 4-band or 5-band part — the 5-band version just carries the extra significant figure the tighter tolerance implies.

The band-count differences line up like this:

| Bands | Layout | Typical tolerance | Extra info |
|---|---|---|---|
| 4-band | digit, digit, multiplier, tolerance | ±5% / ±10% | — |
| 5-band | digit, digit, digit, multiplier, tolerance | ±1% | Extra significant figure |
| 6-band | digit, digit, digit, multiplier, tolerance, tempco | ±1% or tighter | Temperature coefficient (ppm/°C) |

## Common values you'll actually meet

Resistors aren't made in every possible value — they come in standardized "E-series" steps chosen so that, allowing for tolerance, the ranges tile the number line without big gaps. The ±5% E24 series and ±10% E12 series cover most hobby needs. That's why values like 220 Ω, 330 Ω, 470 Ω, 1 kΩ, 2.2 kΩ, 4.7 kΩ and 10 kΩ turn up again and again: they're standard steps, repeated across every decade by shifting the multiplier band. If you decode a resistor and land on an oddball number like 1.37 kΩ from a 4-band part, it's a strong hint you read the bands in the wrong order.

## Just read it for me

Memorising the code is handy, but you don't have to. The [resistor color code calculator](/electronics/resistor-color-code-calculator/) lets you pick each band's color from a menu and shows the resistance, tolerance and range instantly — with a live picture of the resistor so you can match it to the part in your hand. It handles 4, 5 and 6-band resistors, and like every LazyTools tool it runs entirely in your browser. Building a circuit around it? The [LED resistor calculator](/electronics/led-resistor-calculator/) sizes the resistor an LED needs, and the [capacitor code calculator](/electronics/capacitor-code-calculator/) decodes the matching capacitor markings.

---

*Values follow the IEC 60062 resistor color code. Tolerance gives the guaranteed range around the nominal value; the ultra-tight tolerance-band colors (used on precision parts) vary slightly between references, so check the datasheet for critical applications.*
