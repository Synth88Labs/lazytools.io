---
title: "How to Read SMD Resistor Codes (103, 4700, 01C and R47)"
description: "Surface-mount resistors print a tiny number instead of color bands — and the rules aren't obvious. Here's how to decode 3-digit, 4-digit, EIA-96 and R-notation markings, why 470 means 47 ohms, and how to read the zero-ohm jumper."
pubDate: 2026-07-12
updatedDate: 2026-07-12
archetype: explainer
tools: ["/electronics/smd-resistor-code-calculator/", "/electronics/resistor-color-code-calculator/", "/electronics/lc-resonant-frequency-calculator/"]
keywords:
  - how to read smd resistor code
  - smd resistor code
  - what does 103 mean on a resistor
  - smd resistor 470
  - eia-96 code
  - 4 digit smd resistor code
  - r47 resistor
heroImage: /blog/how-to-read-smd-resistor-codes-guide.png
heroAlt: "Four ways an SMD resistor prints its value: 3-digit (103 = 10 kΩ), 4-digit 1% (1002 = 10 kΩ), R-notation (R47 = 0.47 Ω) and EIA-96 (01C = 10 kΩ)"
faqs:
  - q: "What does 103 mean on a resistor?"
    a: "10 kΩ. In a 3-digit SMD code the first two digits are significant figures and the third is the number of zeros, so 103 is 10 followed by three zeros = 10,000 Ω. Likewise 104 = 100 kΩ and 102 = 1 kΩ."
  - q: "Why is 470 equal to 47 ohms and not 470?"
    a: "Because the last digit is a multiplier (a count of zeros), not a value digit. 470 = 47 × 10⁰ = 47 Ω. To mark 470 Ω you'd print 471 (47 × 10¹). Misreading this is the single most common SMD-code mistake."
  - q: "How do I read a 4-digit SMD resistor code?"
    a: "Used on precise 1% resistors, it's three significant figures plus a multiplier: 1002 = 100 × 10² = 10 kΩ, and 4700 = 470 × 10⁰ = 470 Ω. The extra digit gives the finer resolution 1% parts need."
  - q: "What does an R in a resistor code mean?"
    a: "The R stands in for a decimal point, used for values below 10 Ω (and some precise parts). R47 = 0.47 Ω, 4R7 = 4.7 Ω, 47R0 = 47 Ω."
  - q: "What is the EIA-96 code on very small resistors?"
    a: "A compact 1% marking of two digits plus a letter. The two digits are a position in the standard E96 value table (01 = 100, 68 = 499…) and the letter is a power-of-ten multiplier (A = ×1, B = ×10, C = ×100, R = ×0.01, and so on). So 01C = 100 × 100 = 10 kΩ and 68X = 499 × 0.1 = 49.9 Ω."
  - q: "What is a 000 or 0 resistor for?"
    a: "It's a zero-ohm resistor — a wire link in the same package as a resistor, used as a jumper to route a track over others, or as a place to fit a real value later. It has essentially no resistance."
  - q: "How do I tell an EIA-96 code from R-notation?"
    a: "If the letter is anything other than an R sitting between digits, it's EIA-96 (the leading two digits are a lookup index). An R placed where a decimal point belongs — R47, 4R7 — is R-notation, and the digits are the value directly."
draft: false
---

**A surface-mount resistor is too small for color bands, so it prints a short number instead — and `103`, `4700`, `01C` and `R47` are all valid ways to write a resistance.** The rules aren't intuitive, and the most common mistake (reading `470` as 470 Ω when it means 47 Ω) can quietly break a circuit. Here's how each format works.

<aside class="key-takeaways">

**Key takeaways**

- **3-digit:** two figures + a zero-count. `103` = 10 k&#937;. So **`470` = 47 &#937;, not 470**.
- **4-digit (1%):** three figures + a zero-count. `1002` = 10 k&#937;.
- **R-notation:** the **R is the decimal point**. `R47` = 0.47 &#937;, `4R7` = 4.7 &#937;.
- **EIA-96:** two digits (a table lookup) + a letter multiplier. `01C` = 10 k&#937;.
- **`0` / `00` / `000`** is a **zero-ohm jumper**, not a resistor.

</aside>

<figure>
<img src="/blog/infographic-smd-resistor-codes.svg" alt="3-digit codes are two significant figures plus a zero-count (103 = 10 kΩ, so 470 = 47 Ω not 470). 4-digit 1% codes use three figures (1002 = 10 kΩ). R-notation puts the R where the decimal point goes (R47 = 0.47 Ω, 4R7 = 4.7 Ω). EIA-96 is two digits that index the 1% value table plus a letter multiplier (01C = 10 kΩ). A code of 0, 00 or 000 is a zero-ohm jumper." width="1200" height="660" loading="lazy" />
<figcaption>Four ways a chip resistor prints its value — and the mistake to avoid.</figcaption>
</figure>

## The 3-digit code (the common one)

Most chip resistors carry a **3-digit** code that works exactly like the old resistor color bands: the **first two digits are significant figures**, and the **third is the number of zeros** to add (a ×10&#8319; multiplier). The result is in ohms.

- `103` &#8594; `10` + 3 zeros = **10,000 &#937; = 10 k&#937;**
- `472` &#8594; `47` + 2 zeros = **4,700 &#937; = 4.7 k&#937;**
- `220` &#8594; `22` + 0 zeros = **22 &#937;**

That last one is the trap. **`470` is not 470 &#937;** — it's `47` with zero extra zeros = **47 &#937;**. If you actually want 470 &#937;, the code is `471` (47 &times; 10&#185;). When a value looks "off by a decade," this is almost always why.

## The 4-digit code (1% parts)

Precision **1% resistors** need more resolution than two figures allow, so they use a **4-digit** code: the **first three digits are significant figures** and the **fourth is the zero-count**.

- `1002` &#8594; `100` + 2 zeros = **10 k&#937;**
- `4700` &#8594; `470` + 0 zeros = **470 &#937;**
- `1000` &#8594; `100` + 0 zeros = **100 &#937;**

Same idea as the 3-digit code, one more figure of precision.

## R-notation for small values

For resistances **below 10 &#937;**, zeros-and-multipliers don't help, so the code uses an **`R` in place of the decimal point**:

- `R47` = **0.47 &#937;**
- `4R7` = **4.7 &#937;**
- `47R0` = **47 &#937;**

Wherever you see the `R`, put a decimal point and read the digits straight off.

## EIA-96: two digits and a letter

The tiniest 1% resistors use the compact **EIA-96** code: **two digits + one letter**. The two digits aren't the value — they're a **position (01&#8211;96) in the standard E96 1% value table**, and the **letter is a power-of-ten multiplier**.

| Code digits &#8594; value | | Letter &#8594; multiplier | |
|---|---|---|---|
| `01` = 100 | `30` = 200 | `A` = &times;1 | `D` = &times;1000 |
| `47` = 301 | `68` = 499 | `B` = &times;10 | `E` = &times;10000 |
| `96` = 976 | &hellip; | `C` = &times;100 | `R` = &times;0.01 |

So `01C` = 100 &times; 100 = **10 k&#937;**, and `68X` = 499 &times; 0.1 = **49.9 &#937;** (`X` = &times;0.1). The [SMD resistor code calculator](/electronics/smd-resistor-code-calculator/) has the full table built in — type the code and it detects the format for you.

## The zero-ohm jumper

A code of **`0`, `00` or `000`** isn't a resistance at all — it's a **zero-ohm resistor**, a wire link in resistor form. Boards use them to hop one track over another, or to leave a spot where a real value can be fitted later.

## Reading it without the arithmetic

The formats overlap enough to be genuinely confusing at a glance, so the [SMD resistor code calculator](/electronics/smd-resistor-code-calculator/) decodes any of them and tells you which format it recognised — all in your browser, nothing uploaded. For through-hole parts with colored stripes instead, use the [resistor color code calculator](/electronics/resistor-color-code-calculator/); and if those resistors are feeding a tuned circuit, the [LC resonant frequency calculator](/electronics/lc-resonant-frequency-calculator/) covers the L&#8211;C side.

---

*The SMD codes here follow the standard IEC/EIA marking conventions, including the E96 value table used by EIA-96. Values are decoded exactly in your browser. This is general reference information; always confirm a critical value against the manufacturer's datasheet or by measurement.*
