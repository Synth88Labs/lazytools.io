---
title: "How to Read a Resistor Color Code (Bands to Ohms)"
description: "A resistor's colored bands are a compact code: the first two are digits, the next is a ×10ⁿ multiplier, and the last is tolerance. Learn the color values, how to tell which end to start from, and how 4, 5 and 6-band resistors differ — with a worked example."
pubDate: 2026-07-12
updatedDate: 2026-07-12
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

## Reading a 4-band resistor

The classic resistor has four bands. Reading from the grouped end:

1. **First band** — the first digit.
2. **Second band** — the second digit.
3. **Third band** — the multiplier (how many zeros to add).
4. **Fourth band** — the tolerance.

So **Brown-Black-Red-Gold** is: `1` (brown), `0` (black), `×100` (red) → **1000 Ω = 1 kΩ**, at **±5%** (gold). A 1 kΩ ±5% resistor is guaranteed to fall between 950 Ω and 1,050 Ω.

## Which end do I start from?

This is the one thing beginners get wrong. Read from the end where the bands are **grouped closest together**; the **tolerance band** is slightly separated and comes last. If you can't tell, the tolerance band is usually the odd one out — a gold or silver band, or the one with a visible gap before it. Read a resistor backwards and you'll get a wildly different (and wrong) value, so it's worth checking.

## 5-band and 6-band resistors

Precision resistors add bands. A **5-band** resistor has **three digit bands** before the multiplier, giving an extra significant figure (so a value like 4.7 kΩ can be marked exactly), usually at a tight ±1% tolerance. A **6-band** resistor adds one more: a **temperature coefficient**, in parts per million per °C, telling you how much the resistance drifts as it heats up — important for precision analog and measurement circuits.

## Just read it for me

Memorising the code is handy, but you don't have to. The [resistor color code calculator](/electronics/resistor-color-code-calculator/) lets you pick each band's color from a menu and shows the resistance, tolerance and range instantly — with a live picture of the resistor so you can match it to the part in your hand. It handles 4, 5 and 6-band resistors, and like every LazyTools tool it runs entirely in your browser. Building a circuit around it? The [LED resistor calculator](/electronics/led-resistor-calculator/) sizes the resistor an LED needs, and the [capacitor code calculator](/electronics/capacitor-code-calculator/) decodes the matching capacitor markings.

---

*Values follow the IEC 60062 resistor color code. Tolerance gives the guaranteed range around the nominal value; the ultra-tight tolerance-band colors (used on precision parts) vary slightly between references, so check the datasheet for critical applications.*
