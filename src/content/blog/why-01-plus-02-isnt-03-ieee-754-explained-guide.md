---
title: "Why 0.1 + 0.2 Isn't 0.3: IEEE 754 Floating-Point Explained"
description: "Type 0.1 + 0.2 into almost any programming language and you get 0.30000000000000004. Here's why — how IEEE 754 stores numbers as sign, exponent and mantissa, why most decimals can't be exact, and how to see the bits yourself."
pubDate: 2026-08-03
updatedDate: 2026-08-03
archetype: explainer
heroImage: /blog/why-01-plus-02-isnt-03-ieee-754-explained-guide.png
heroAlt: "A decimal number stored as IEEE 754 sign, exponent and mantissa bits, showing the tiny rounding error"
tools: ["/dev/ieee-754-converter/"]
keywords:
  - why 0.1 + 0.2 is not 0.3
  - ieee 754 explained
  - floating point rounding error
  - float sign exponent mantissa
  - float to hex
  - double precision
faqs:
  - q: "Why does 0.1 + 0.2 equal 0.30000000000000004?"
    a: "Because 0.1 and 0.2 can't be represented exactly in binary floating point. Like 1/3 in decimal, they're infinitely repeating in binary, so each is rounded to the nearest value a 64-bit double can store. Those stored values are very slightly larger than 0.1 and 0.2, and when you add them the tiny errors combine into a value just above 0.3 — which prints as 0.30000000000000004."
  - q: "How does IEEE 754 store a number?"
    a: "In three bit-fields: a sign bit, a biased exponent, and a mantissa (the fraction). The value is roughly sign × 1.mantissa × 2^(exponent − bias). Single precision uses 1 + 8 + 23 bits (32 total), double uses 1 + 11 + 52 bits (64 total), and half uses 1 + 5 + 10 bits (16 total)."
  - q: "What is the mantissa in a float?"
    a: "The mantissa (also called the significand or fraction) holds the significant digits of the number in binary. For a normal number there's an implicit leading 1, so a 23-bit single-precision mantissa actually carries 24 bits of precision. The exponent then shifts the binary point to scale it."
  - q: "Is floating-point error a bug?"
    a: "No — it's an inherent, predictable consequence of representing infinitely many real numbers in a fixed number of bits. Every value is rounded to the nearest representable one. It only becomes a bug when code assumes exactness, for example comparing floats with == or using them for money. Use a tolerance for comparisons, and integers or a decimal type for currency."
  - q: "How can I avoid floating-point errors?"
    a: "Don't compare floats for exact equality — check that the difference is within a small epsilon. For money, use integer cents or a decimal/BigDecimal type instead of floats. And when you need to know exactly what's stored, inspect the bits: a converter shows the exact stored value and the rounding error."
  - q: "What's the difference between single and double precision?"
    a: "Double precision (64-bit) has an 11-bit exponent and 52-bit mantissa, giving about 15–17 significant decimal digits and a huge range; single precision (32-bit) has an 8-bit exponent and 23-bit mantissa, giving about 7 digits. Double is the default in most languages (including JavaScript); single is common in graphics, ML and embedded code where memory and speed matter more than precision."
draft: false
---

**Type `0.1 + 0.2` into JavaScript, Python, Java or almost any language and you get
`0.30000000000000004`.** It's not a bug in the language — it's how computers store fractional numbers.
Here's the reason, and how to see it for yourself with the
[IEEE 754 Converter](/dev/ieee-754-converter/).

## Computers store numbers in binary fractions

We write `0.1` in decimal, but a computer stores it in **binary**. Some decimal fractions convert cleanly
— `0.5` is `0.1` in binary, `0.25` is `0.01` — but most don't. `0.1` in binary is:

```
0.0001100110011001100110011… (repeating forever)
```

Just like `1/3 = 0.333…` never terminates in decimal, `0.1` never terminates in binary. A float only has
a fixed number of bits, so it stores the **nearest value it can** and drops the rest. That stored value
is a hair larger than 0.1 — and that hair is the whole story.

## How a float is built: sign, exponent, mantissa

IEEE 754 packs a number into three fields:

| Field | Single (32-bit) | Double (64-bit) | Role |
|---|---|---|---|
| **Sign** | 1 bit | 1 bit | positive or negative |
| **Exponent** | 8 bits | 11 bits | scales by a power of two |
| **Mantissa** | 23 bits | 52 bits | the significant fraction bits |

The value is approximately:

> (−1)^sign × 1.mantissa × 2^(exponent − bias)

The **bias** (127 for single, 1023 for double) lets the exponent represent negative powers without its own
sign. The mantissa has an implicit leading `1`, so single precision really carries 24 bits (~7 decimal
digits) and double carries 53 bits (~15–17 digits).

## Watching the error happen

Store `0.1` as a double and you don't get exactly 0.1 — you get:

```
0.1  → 0.1000000000000000055511151231257827021181583404541015625
```

That trailing `…0555…` is the rounding error. Do the same with `0.2` (also rounded up a touch), add the
two stored values, and the sum lands just above 0.3 — at the nearest double to that sum, which displays as
`0.30000000000000004`. Nothing went wrong; each step just used the closest representable number.

The [IEEE 754 Converter](/dev/ieee-754-converter/) shows this directly: enter `0.1` and it displays the
exact stored value and the **error** field — the gap between what you typed and what the bits actually
represent.

## This is a feature, not a bug

Floating point trades exactness for range and speed: with 64 bits you can represent numbers from tiny
subnormals to ~10^308, at the cost of most values being *approximations*. It only bites when code assumes
exactness:

- **Don't** compare floats with `==`. Check `Math.abs(a - b) < epsilon` instead.
- **Don't** use floats for money. Use integer cents, or a decimal/BigDecimal type.
- **Do** expect ~7 significant digits from single precision, ~15–17 from double.

## See the bits yourself

The fastest way to build intuition is to look at the encoding. The
[IEEE 754 Converter](/dev/ieee-754-converter/) turns any number into its half, single and double bit
patterns — sign, exponent and mantissa broken out, in binary and hex — and shows the exact stored value
and rounding error. You can also paste a raw bit pattern to decode it the other way. It runs entirely in
your browser, and it makes "0.1 isn't 0.1" go from mysterious to obvious.
