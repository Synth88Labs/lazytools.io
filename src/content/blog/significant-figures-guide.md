---
title: "Significant Figures: The Rules, the Ambiguous Cases, and How to Round Correctly"
seoTitle: 'Significant Figures: Rules & How to Round'
description: "The four significant-figures rules explained digit by digit: which zeros count, why 1200 is ambiguous, and how to round to N sig figs (the 9.99 carry case)."
pubDate: 2026-07-10
updatedDate: 2026-08-23
archetype: explainer
tools: ["/math/significant-figures/", "/math/scientific-notation/", "/math/decimal-to-fraction/"]
keywords:
  - significant figures
  - sig figs rules
  - how many significant figures
  - significant figures examples
  - rounding to significant figures
  - trailing zeros significant
  - significant digits
heroImage: /blog/significant-figures-guide.png
heroAlt: "Significant figures rules, which digits count, explained digit by digit"
faqs:
  - q: "How many significant figures does 0.004560 have?"
    a: "Four. The leading zeros (0.00) are placeholders and don't count; counting starts at the first non-zero digit, 4. The digits 4, 5, 6 and the trailing 0 are all significant, a trailing zero after the decimal point is significant, because writing it was a choice that signals precision."
  - q: "What are the four significant figure rules?"
    a: "1) Non-zero digits always count. 2) Zeros between non-zero digits count ('trapped' zeros, like the 0 in 105). 3) Leading zeros never count. They only place the decimal point. 4) Trailing zeros count only when there's a decimal point; in a bare integer like 1200 they're ambiguous."
  - q: "Why is 1200 ambiguous?"
    a: "Because a bare integer doesn't reveal whether the trailing zeros were measured or are just placeholders. 1200 could be 2, 3 or 4 significant figures. To be explicit, use scientific notation: 1.2 × 10³ is two sig figs, 1.20 × 10³ is three, and 1.200 × 10³ is four."
  - q: "How do I round to a number of significant figures?"
    a: "Keep the first N significant digits and look at the next one: 5 or more rounds the last kept digit up, less than 5 leaves it. Watch the carry case, 9.99 to two significant figures becomes 10 (not 9.9), because rounding the second 9 up carries. The significant-figures tool handles carries exactly."
  - q: "Are trailing zeros significant?"
    a: "It depends on the decimal point. In 100.0 the trailing zeros are significant (four sig figs) because the point makes them meaningful. In the bare integer 1200 they're ambiguous. This is the single most confusing sig-fig rule, and the reason scientific notation exists."
  - q: "Why do significant figures matter?"
    a: "They encode how precisely something was measured. A length written as 2.0 cm claims more certainty than 2 cm. Calculations shouldn't imply more precision than their least-precise input, which is why lab reports and engineering carry sig figs through every step."
draft: false
---

**0.004560 has four significant figures, 105 has three, and 1200 is genuinely ambiguous, and once
you see the four rules applied digit by digit, none of it is mysterious.** Significant figures are
just a way of saying how much of a number you actually *know*. Count and round any number, with each
digit color-coded by rule, using the
[significant figures calculator](/math/significant-figures/); here's the reasoning behind it.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Non-zero digits</strong> always count</li>
<li><strong>Zeros between non-zeros</strong> count (the 0 in 105)</li>
<li><strong>Leading zeros</strong> never count. They only place the decimal point</li>
<li><strong>Trailing zeros</strong> count only with a decimal point; a bare integer like 1200 is ambiguous</li>
<li><strong>Rounding:</strong> watch the carry, 9.99 to 2 s.f. is 10, not 9.9</li>
</ul>
</aside>

## The four rules

Every significant-figures question reduces to four rules about which digits carry information versus
which are just holding the decimal point in place:

<figure>
<img src="/blog/infographic-sig-figs.svg" alt="Infographic: non-zero digits always count; zeros between non-zero digits count; leading zeros never count and only place the decimal point; trailing zeros count only when there is a decimal point, and 1200 as a bare integer is ambiguous; worked example of 0.004560 showing the leading zeros excluded and the digits 4, 5, 6, 0 counted for four significant figures; scientific notation resolves the ambiguity, 1.2 times ten cubed being two sig figs and 1.200 times ten cubed being four" width="1200" height="640" loading="lazy" />
<figcaption>Four rules, one worked example, and the notation that settles the ambiguous case.</figcaption>
</figure>

| Rule | Example | Sig figs |
|---|---|---|
| Non-zero digits always count | `42` | 2 |
| Zeros *between* non-zero digits count | `105`, `4008` | 3, 4 |
| Leading zeros never count | `0.0056` | 2 |
| Trailing zeros count only with a decimal point | `100.0` vs `1200` | 4 vs *ambiguous* |

Walk `0.004560` through them: the `0.00` at the front are leading zeros (rule 3, skip), counting
begins at `4`, and `4`, `5`, `6`, `0` all count, the final `0` is a **trailing zero after a decimal
point**, so rule 4 makes it significant. Four significant figures. The
[calculator](/math/significant-figures/) colours exactly these digits so the count is never a guess.

## The trailing-zero trap (and why scientific notation exists)

The hardest rule is trailing zeros, and it's worth dwelling on because it's where nearly all
confusion lives. Compare:

- `100.0`, **four** sig figs. The decimal point signals that every digit, zeros included, was
  measured and matters.
- `1200`, **ambiguous**. Was it measured to the nearest 1, 10, or 100? A bare integer can't say.

This ambiguity is the entire reason **scientific notation** is used in science: it forces you to
state your precision. `1.2 × 10³` is unambiguously two sig figs; `1.20 × 10³` is three; `1.200 × 10³`
is four. If you ever need to communicate that a trailing zero *is* meaningful, write it in
[scientific notation](/math/scientific-notation/), that's what the format is for. (The
sig-fig calculator flags bare-integer trailing zeros as ambiguous rather than pretending to know.)

## Exact numbers have unlimited significant figures

One category sits outside the four rules entirely: **exact numbers**. These are quantities that
carry no measurement uncertainty at all, so they never limit the precision of a result.

- **Counted objects.** If you count 24 students in a room, that 24 is exact. There is no "24.0 give
  or take." It behaves as if it had infinitely many significant figures.
- **Defined conversion factors.** The relationships `1 m = 100 cm`, `1 in = 2.54 cm`, and
  `1 min = 60 s` are definitions, not measurements. The 100, the 2.54, and the 60 are exact.
- **Integers in formulas.** The `2` in `2πr` or the `4` in the area of a triangle formula is a pure
  mathematical constant, not a measured value.

The practical upshot: when you divide a measured mass by a counted number of items, the count does
not drag your answer down to fewer significant figures. Only the *measured* inputs set the limit.

## Rounding to N significant figures

Rounding to significant figures works like ordinary rounding, but you count from the first
significant digit rather than the decimal point:

1. Identify the first N significant digits.
2. Look at the next digit: **5 or more rounds up**, less than 5 stays.
3. Replace the rest with zeros (or drop them, past the decimal point).

Examples:

| Number | To 2 s.f. | To 3 s.f. |
|---|---|---|
| `0.004560` | `0.0046` | `0.00456` |
| `12345` | `12000` | `12300` |
| `9.99` | `10` | `9.99` |

That last row is the one people get wrong: rounding `9.99` to two significant figures rounds the
second `9` up, which **carries**, `9.9 → 10`, not `9.9`. Exact digit-string rounding (which the
[tool](/math/significant-figures/) uses) handles the carry correctly where naive float rounding can
drift.

There is one subtlety when the digit you drop is *exactly* 5 with nothing after it. Most schools
teach **round half up** (always round the 5 up), which is simple and predictable. Some scientific and
computing contexts prefer **round half to even** (also called banker's rounding): round to make the
kept digit even, so `2.5` and `3.5` both round to a nearest-even result. Round-half-to-even avoids a
slight upward bias when you round many values, which is why it is the IEEE-754 default for floating
point. For everyday work, round half up is fine, just pick one convention and apply it consistently.

## Why the rules exist

Significant figures aren't arbitrary bookkeeping. They encode **measurement precision**. A ruler
reading of `2.0 cm` claims you know the length to a tenth of a centimetre; `2 cm` claims only to the
nearest centimetre. When you calculate with measured values, the result can't be more precise than
its least-precise input: multiply a 3-sig-fig measurement by a 2-sig-fig one and the answer gets
2 sig figs, because that's all you actually know. This is why chemistry, physics and engineering
carry sig figs through every step and round at the end.

Two quick operational rules follow:
- **Multiplication/division:** the result keeps the *fewest significant figures* of any input.
- **Addition/subtraction:** the result keeps the *fewest decimal places* of any input (a different
  rule, it's about decimal position, not sig-fig count).

### A worked calculation

Say you measure a density: mass `4.50 g` (three sig figs) divided by volume `1.2 mL` (two sig figs).
The raw quotient is `3.75 g/mL`, but the multiplication/division rule caps the answer at the fewest
input sig figs, two, so you report **`3.8 g/mL`**. Carrying the full `3.75` through any further
steps and rounding only at the very end avoids compounding rounding error; you round the *final*
reported value, not every intermediate one.

Contrast that with addition. Add lengths `12.11 cm` (two decimal places) and `1.1 cm` (one decimal
place). The sum is `13.21 cm`, but the addition rule keeps the fewest decimal places, one, so you
report **`13.2 cm`**. Notice the two rules can give different answers on the same digits, which is
exactly why they are stated separately.

## Common mistakes at a glance

| Mistake | Wrong | Right | Why |
|---|---|---|---|
| Counting leading zeros | `0.0056` has 4 s.f. | 2 s.f. | Leading zeros only place the decimal |
| Dropping a significant trailing zero | `100.0` has 3 s.f. | 4 s.f. | The decimal point makes them count |
| Assuming `1200` is exact | `1200` has 4 s.f. | ambiguous | A bare integer can't say |
| Missing the rounding carry | `9.99` → `9.9` at 2 s.f. | `10` | The carry ripples left |
| Mixing the two operation rules | using sig-fig count for a sum | use decimal places | Addition tracks position, not count |

## Quick summary

Significant figures answer "how much of this number do I actually know?" Non-zero digits and trapped
zeros count; leading zeros never do; trailing zeros count only with a decimal point, which is why
`1200` is ambiguous and scientific notation exists to fix it. Round from the first significant digit
and mind the carry (`9.99` → `10` at two sig figs). Count, round, and see every digit classified by
rule with the [significant figures calculator](/math/significant-figures/), and reach for
[scientific notation](/math/scientific-notation/) whenever a trailing zero needs to speak.

*Sources: [NIST, Uncertainty of measurement results](https://physics.nist.gov/cuu/Uncertainty/) ·
[IUPAC Gold Book, significant figures](https://goldbook.iupac.org/) ·
standard analytical-chemistry conventions (Harris, *Quantitative Chemical Analysis*).*
