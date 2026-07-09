---
title: "0.1 + 0.2 ≠ 0.3: Why Most Calculators Quietly Round — and What Exact Arithmetic Looks Like"
description: "Every ordinary calculator computes in floating point, which silently rounds past ~15 digits, turns 1/3 + 2/3 into 0.9999999999999999, and overflows at 171!. How exact rational and big-integer arithmetic avoids all of it — and when the difference actually matters."
pubDate: 2026-07-09
updatedDate: 2026-07-09
archetype: explainer
tools: ["/math/fraction-calculator/", "/math/quadratic-equation-solver/", "/math/permutations-combinations/", "/math/decimal-to-fraction/", "/math/gcd-lcm-calculator/"]
keywords:
  - floating point error
  - 0.1 + 0.2
  - why does my calculator round
  - exact arithmetic
  - fraction calculator exact
  - big integer calculator
  - floating point vs exact
  - 0.9999999999 calculator
heroImage: /blog/exact-math-guide.png
heroAlt: "0.1 + 0.2 is not 0.3 in floating point — why calculators quietly round"
faqs:
  - q: "Why does 0.1 + 0.2 give 0.30000000000000004?"
    a: "Because computers store numbers in binary, and 0.1 and 0.2 have no finite binary representation — just as 1/3 has no finite decimal one. The computer stores the nearest representable values, and their sum lands a hair above 0.3. It isn't a bug in any one language; it's IEEE 754 floating point, the arithmetic almost everything uses."
  - q: "How many digits can a normal calculator actually hold?"
    a: "A 64-bit float (the 'double' used by JavaScript, spreadsheets and most calculators) carries about 15–17 significant decimal digits. Beyond that, digits are silently invented: 12345678901234567890 becomes 12345678901234567168 the moment it's stored."
  - q: "What is exact (arbitrary-precision) arithmetic?"
    a: "Arithmetic on numbers represented exactly: integers as big-integers that grow as needed, fractions as pairs of integers (5/2 instead of 2.5), radicals kept symbolic (6√2 instead of 8.485…). Operations then follow the school rules — common denominators, Euclid's algorithm — and no step ever rounds."
  - q: "When does the difference actually matter?"
    a: "Whenever the answer is the point rather than an estimate: homework where the next line needs the exact value, money and recipe scaling where drift compounds, combinatorics where 171! overflows floats entirely, number theory where a single wrong digit changes primality, and any comparison of results (0.9999999999999999 ≠ 1 to a computer)."
  - q: "Why do the LazyTools math calculators show their working?"
    a: "Because a bare answer is unverifiable. Showing the Euclidean steps, the common-denominator working or the discriminant computation makes the result checkable — and makes the tools usable for learning, not just answer-copying."
  - q: "Can't I just ask an AI chatbot to do the math?"
    a: "Language models generate plausible text, including plausible-looking numbers — they don't run algorithms unless paired with a calculator tool, and their confident wrong answers are indistinguishable from right ones. Deterministic tools compute; that's the whole difference."
draft: false
---

**Type `0.1 + 0.2` into a JavaScript console and you get `0.30000000000000004`. Sum three thirds
on most calculators and you get `0.9999999999999999`. Neither is a bug — it's floating point, the
arithmetic almost every calculator on earth uses, quietly rounding and hoping you don't need the
difference.** Sometimes you do — and then you want arithmetic that keeps fractions as fractions and
integers exact at any size, like the [fraction calculator](/math/fraction-calculator/) and the rest
of the [Mathematics tools](/math/).

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Floats are binary:</strong> 0.1 has no exact binary form, so errors are baked in before any math happens</li>
<li><strong>~15–17 significant digits</strong> is the ceiling — beyond it, digits are silently invented</li>
<li><strong>171! overflows floats entirely;</strong> exact BigInt arithmetic produces 1000! digit-perfect (2,568 digits)</li>
<li><strong>Exact arithmetic = rationals + big integers + symbolic radicals</strong> — 1/3 + 2/3 is exactly 1, √72 is 6√2</li>
<li><strong>Steps make answers checkable</strong> — Euclid, common denominators and the quadratic formula, shown with your numbers</li>
</ul>
</aside>

## The lie every calculator tells

Computers store numbers in binary. In decimal, 1/3 has no finite representation (0.3333…); in
binary the same fate befalls 1/10 and 2/10 — so the moment you type `0.1`, the machine actually
stores the nearest value a 64-bit float can hold, which is
0.1000000000000000055511151231257827…. Add the similarly-off 0.2 and the result lands at
`0.30000000000000004`. The IEEE 754 standard behind this powers JavaScript, Python floats, Excel
and virtually every pocket and phone calculator — with roughly **15–17 significant decimal digits**
of headroom. Inside that budget errors hide behind display rounding; outside it, they surface:

| You compute | Floating point says | Exactly |
|---|---|---|
| 0.1 + 0.2 | 0.30000000000000004 | 3/10 |
| 1/3 + 2/3 | 0.9999999999999999 | 1 |
| 12345678901234567890 | 12345678901234567168 | itself |
| 171! | Infinity (overflow) | a 309-digit integer |
| √72 | 8.48528137423857 | 6√2 |

<figure>
<img src="/blog/infographic-exact-math.svg" alt="Infographic comparing floating point and exact arithmetic: floating point turns 0.1 plus 0.2 into 0.30000000000000004, one third plus two thirds into 0.9999999999999999, overflows at 171 factorial and loses digits past 17; exact arithmetic keeps numbers as integer fractions, uses big integers of any size, and keeps radicals symbolic like root 72 equals 6 root 2 — with the working shown step by step" width="1200" height="640" loading="lazy" />
<figcaption>Same inputs, two philosophies — close-and-silent versus exact-and-shown.</figcaption>
</figure>

## What exact arithmetic does differently

Three representation choices remove the rounding entirely:

1. **Rationals instead of decimals.** Every number is stored as a pair of integers — 2.5 is 5/2,
   0.1 is 1/10 — and arithmetic follows the school rules (common denominators for addition,
   straight-across for multiplication). 1/3 + 2/3 is exactly 1 because thirds were never
   approximated in the first place. The [fraction calculator](/math/fraction-calculator/) and
   [decimal⇄fraction converter](/math/decimal-to-fraction/) work this way — the latter even converts
   repeating decimals exactly, so 0.(142857) comes back as precisely 1/7.
2. **Integers that grow.** Arbitrary-precision integers (BigInt) have no 15-digit ceiling: the
   [GCD/LCM calculator](/math/gcd-lcm-calculator/) runs Euclid on 100-digit inputs, and the
   [combinations calculator](/math/permutations-combinations/) produces 1000! digit-perfect —
   2,568 digits — where floats gave up at 171!.
3. **Radicals kept symbolic.** When x² − 3x − 20 = 0, the answer *is* (3 ± √89)/2; the decimal
   6.216991 is a shadow of it. The [quadratic solver](/math/quadratic-equation-solver/) extracts
   square factors (√72 → 6√2) and reduces the whole expression, handing you the exact form your
   homework's next line actually needs — decimals alongside for practical use.

## When it matters (and when it doesn't)

Floating point is *fine* for measurements — a length you know to three digits gains nothing from
fifty exact ones. The difference bites when the answer is the point:

- **Schoolwork:** teachers mark (3 + √89)/2, not 6.216990566…; and the steps — which these tools
  show — are usually worth more than the result.
- **Anything that compounds:** scale a recipe by thirds four times in floats and the drift is real;
  in rationals it's zero.
- **Comparisons:** to a computer, 0.9999999999999999 ≠ 1 — a classic source of "impossible" bugs
  and false spreadsheet mismatches.
- **Combinatorics and number theory:** factorials, binomial coefficients, primality — domains
  where a float answer isn't imprecise, it's *wrong* or *Infinity*.

One more honest note: exactness constrains scope. These tools do arithmetic, algebra and number
theory exactly; they don't do calculus or symbolic manipulation beyond what's shown. What they
answer, they answer completely — computed in your browser, offline, with nothing typed ever
leaving your device.

## Quick summary

Ordinary calculators compute in binary floating point: ~15–17 significant digits, silent rounding,
overflow at 171!, and famous artifacts like 0.30000000000000004. Exact arithmetic — true rationals,
arbitrary-precision integers, symbolic radicals — eliminates the entire error class, and showing
the working makes every answer checkable. That's the design of the
[LazyTools Mathematics tools](/math/): fractions with steps, Euclid line by line, quadratic roots
in simplified radical form, and factorials at any size — exact, local and free.

*Sources: [IEEE 754 floating-point standard](https://en.wikipedia.org/wiki/IEEE_754) ·
[0.30000000000000004.com](https://0.30000000000000004.com/) (the classic cross-language demonstration) ·
[MDN — Number precision in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON)*
