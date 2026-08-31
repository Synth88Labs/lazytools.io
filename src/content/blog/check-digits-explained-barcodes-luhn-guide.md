---
title: "Check Digits Explained: How Barcodes, ISBNs and Card Numbers Catch Typos"
seoTitle: 'Check Digits Explained: Barcodes, ISBNs & Luhn'
description: "A check digit is an extra digit computed from the rest of a barcode, ISBN or card number to catch typos, how mod-10, mod-11 and Luhn work."
pubDate: 2026-08-02
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/check-digits-explained-barcodes-luhn-guide.png
heroAlt: "How a check digit is computed from the other digits to catch typos in barcodes, ISBNs and card numbers"
tools: ["/dev/barcode-check-digit-validator/", "/dev/imei-luhn-validator/"]
keywords:
  - check digit
  - what is a check digit
  - luhn algorithm
  - ean-13 check digit
  - isbn check digit
  - how barcodes detect errors
  - imei check digit
faqs:
  - q: "What is a check digit?"
    a: "A check digit is an extra digit added to the end of an identifier, a barcode, ISBN, credit-card number or IMEI, that is calculated from all the other digits by a fixed formula. When the number is read back, the formula is re-run; if the recomputed check digit doesn't match, the number was mistyped or misread. It's built-in error detection, not part of the actual identity."
  - q: "How does the EAN-13 or UPC barcode check digit work?"
    a: "By the GS1 mod-10 method: starting from the right of the data digits, multiply alternately by 3 and 1, add them up, and choose the check digit that makes the total a multiple of 10. Scanners recompute this on every read and reject the scan if it doesn't match, which stops most misreads."
  - q: "What is the Luhn algorithm?"
    a: "The Luhn (mod-10) algorithm is the checksum behind credit-card numbers, IMEIs and many ID numbers. From the right, double every second digit (subtracting 9 if the result is over 9), sum all the digits, and a valid number totals a multiple of 10. It catches every single-digit error and almost all adjacent transpositions."
  - q: "Why do some ISBNs end in an X?"
    a: "ISBN-10 (and ISSN) use a mod-11 check, so the check value can come out as 10, which is written as the single character X to keep it one character. ISBN-13, which is really an EAN-13 barcode, uses mod-10 instead, so its check digit is always a normal 0-9."
  - q: "Does a valid check digit mean the number is real?"
    a: "No. A passing check digit only proves the number is internally consistent, that it probably wasn't mistyped. It says nothing about whether the barcode maps to a real product, the ISBN to a real book, the card to an active account, or the IMEI to an existing phone. Only the issuing authority can confirm that."
  - q: "Can I validate these numbers privately?"
    a: "Yes, check-digit validation is pure arithmetic, so it needs no server. The LazyTools Barcode Validator and IMEI & Luhn Validator run entirely in your browser, so sensitive numbers like card numbers or IMEIs are never uploaded."
draft: false
---

**The last digit of a barcode, ISBN, credit-card number or IMEI usually isn't part of the ID at all, it's a *check digit*, computed from all the other digits so a scanner or form can instantly tell if the
number was mistyped.** Change one digit and the check almost always fails. Here's how the common
schemes work, and how to validate them with the
[Barcode Validator](/dev/barcode-check-digit-validator/) and
[IMEI & Luhn Validator](/dev/imei-luhn-validator/).

<aside class="key-takeaways">

**Key takeaways**

- A check digit is one extra digit, computed from all the others by a fixed formula, that lets any reader instantly flag a mistyped or misread number.
- Three schemes cover almost everything you meet: GS1 mod-10 (barcodes, ISBN-13), mod-11 (ISBN-10, ISSN, the source of the "X"), and Luhn mod-10 (cards, IMEIs).
- These schemes catch every single-digit error and nearly every swap of two adjacent digits, the mistakes humans make most.
- A valid check digit only proves the number is *well-formed*, not that the product, book, card or phone actually exists.
- Validation is pure arithmetic, so it runs entirely in your browser with nothing uploaded.

</aside>

## The idea: catch the typo before it costs you

Humans transpose and fat-finger digits constantly. A check digit is a cheap defence: append one digit
that's a mathematical function of the rest. When the number is entered or scanned again, re-run the
function, if the recomputed digit doesn't match the one on the end, something's wrong. It's the same
principle as a checksum on a file, shrunk to a single digit.

Well-designed check digits catch **every single-digit error** and **almost all "transpositions"**
(swapping two adjacent digits), precisely the mistakes people make most.

## Three schemes you meet every day

| Scheme | Used by | Method |
|---|---|---|
| **GS1 mod-10** | EAN-13, UPC-A, EAN-8, GTIN-14, ISBN-13 | Weight data digits 3,1,3,1… from the right; check makes the sum a multiple of 10 |
| **mod-11** | ISBN-10, ISSN | Weighted sum mod 11; check can be 10, written **X** |
| **Luhn (mod-10)** | Credit cards, IMEIs, many IDs | Double every 2nd digit from the right (−9 if >9); sum is a multiple of 10 |

<figure class="my-8">
<svg viewBox="0 0 1200 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A check digit is computed from the other digits; re-running the formula detects a typo" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="30" font-weight="800" fill="#0f172a">The last digit checks the rest</text>

  <text x="600" y="112" text-anchor="middle" font-family="ui-monospace,monospace" font-size="30" fill="#1e293b">4 0 0 6 3 8 1 3 3 3 9 3 <tspan fill="#059669" font-weight="800">1</tspan></text>
  <text x="600" y="146" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#64748b">EAN-13, twelve data digits + one check digit</text>

  <rect x="230" y="185" width="740" height="60" rx="12" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="600" y="222" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" fill="#047857">(3×3 + 1×9 + 3×3 + … ) mod 10 → check digit = 1  ✓ matches</text>

  <text x="600" y="300" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" fill="#b91c1c">4 0 0 6 3 8 <tspan font-weight="800">3</tspan> 1 3 3 3 9 3 1</text>
  <text x="600" y="332" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#dc2626">one digit swapped → recomputed check ≠ 1 → rejected as a misread</text>
</svg>
</figure>

## GS1 mod-10 (barcodes and ISBN-13)

The barcodes on retail products are administered by [GS1](https://www.gs1.org/services/check-digit-calculator), the standards body
behind EAN and UPC. Take an EAN-13 like `4006381333931`. Drop the last digit (the check, `1`) and, reading the remaining 12
from the right, multiply alternately by 3 and 1, add them, and the check digit is whatever makes the
total a multiple of 10. Scanners do this on every beep, it's why a smudged or mis-scanned barcode
simply won't register rather than ringing up the wrong item. The
[Barcode Validator](/dev/barcode-check-digit-validator/) runs it for EAN-13, UPC-A, EAN-8 and GTIN-14,
and can also fill in a missing check digit.

### Worked example: computing the EAN-13 check

Here are the 12 data digits of `4006381333931`, weighted by position (counting from the left, odd
positions get weight 1 and even positions get weight 3, the same as alternating 3,1 from the right):

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Digit | 4 | 0 | 0 | 6 | 3 | 8 | 1 | 3 | 3 | 3 | 9 | 3 |
| Weight | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 | 1 | 3 |
| Product | 4 | 0 | 0 | 18 | 3 | 24 | 1 | 9 | 3 | 9 | 9 | 9 |

The products sum to **89**. The check digit is whatever brings the running total up to the next multiple
of 10: `(10 − (89 mod 10)) mod 10 = 10 − 9 = 1`. That matches the printed check digit `1`, so the
barcode is well-formed. Swap any single digit and the sum shifts, the check no longer resolves to `1`,
and the scan is rejected.

## Luhn (cards and IMEIs)

Credit-card numbers and phone IMEIs use the **[Luhn](https://en.wikipedia.org/wiki/Luhn_algorithm)**
algorithm. From the right, double every second
digit (if that gives more than 9, subtract 9), add everything up, and a valid number's total is
divisible by 10. It's why a payment form can flag a mistyped card *before* contacting the bank, and why
`490154203237518` is a valid IMEI but `490154203237517` isn't. Check either with the
[IMEI & Luhn Validator](/dev/imei-luhn-validator/), which also splits an IMEI into its TAC (model code)
and serial.

### Worked example: verifying a Luhn number

Take the number `79927398713`. Reading right to left, leave the odd positions alone and double every
second (even-position) digit, subtracting 9 whenever the doubled value exceeds 9:

- Untouched digits (positions 1, 3, 5, …): `3 + 7 + 9 + 7 + 9 + 7 = 42`
- Doubled digits (positions 2, 4, 6, …): `1→2`, `8→16→7`, `3→6`, `2→4`, `9→18→9`, summing to `2 + 7 + 6 + 4 + 9 = 28`

The grand total is `42 + 28 = 70`, which is divisible by 10, so `79927398713` passes Luhn. Change the
final digit to `4` and the total becomes 71, not a multiple of 10, and the number is rejected. The
same routine validates a 16-digit card or a 15-digit IMEI; only the length changes.

## mod-11 and the mysterious X (ISBN-10, ISSN)

Older 10-digit ISBNs and all ISSNs use a **mod-11** weighting. For an ISBN-10, multiply the ten digits
by descending weights 10, 9, 8, … 1 and require the weighted sum to be divisible by 11. Because the
remainder can be any value from 0 to 10, the check "digit" occasionally needs to represent **ten**, and
since that won't fit in a single 0-9 slot, it's written as the letter **X**.

Worked quickly for the classic ISBN-10 `0306406152`:
`0×10 + 3×9 + 0×8 + 6×7 + 4×6 + 0×5 + 6×4 + 1×3 + 5×2 + 2×1 = 132`, and `132 = 11 × 12`, so it's valid.
When a book's computed check comes out as 10, you'll see an ISBN ending in X such as `0-8044-2957-X`.
ISBN-13 dropped this quirk by switching to GS1 mod-10, so every ISBN-13 check digit is an ordinary 0-9.

## How much protection do you actually get?

Not every scheme catches the same mistakes. Mod-11 is mathematically the strongest of the three because
11 is prime, but it needs the awkward X; the mod-10 schemes trade a little coverage for a check that's
always a clean digit. Here's the practical picture:

| Error type | GS1 mod-10 | Luhn (mod-10) | mod-11 |
|---|---|---|---|
| Any single wrong digit | Caught | Caught | Caught |
| Swap of two adjacent digits | Most (misses swaps differing by 5) | Most (misses `09`↔`90`) | All |
| Twin errors (e.g. `22`→`55`) | Some | Some | Most |
| Check value fits in 0-9 | Always | Always | Not always (may be X) |

The headline is that all three reliably catch the single most common human error, one fat-fingered
digit, plus the large majority of adjacent transpositions. None of them is a cryptographic guarantee;
they're tuned against *accidental* mistakes, not deliberate forgery.

## The big caveat: valid ≠ real

This is the point people miss. A passing check digit means the number is **internally consistent**. It very likely wasn't mistyped. It does **not** mean:

- the barcode is registered to a real product,
- the ISBN belongs to a published book,
- the credit card is issued or has funds, or
- the IMEI matches an actual phone.

Only the issuing authority (GS1, a publisher, the card network, a carrier) can confirm existence. The
check digit is a spell-checker, not an identity check.

## Why validate in the browser

Some of these numbers are sensitive, a card number, an IMEI. Check-digit validation is pure
arithmetic, so it never needs a server. Both the
[Barcode Validator](/dev/barcode-check-digit-validator/) and the
[IMEI & Luhn Validator](/dev/imei-luhn-validator/) compute everything in your browser and upload
nothing.

## The bottom line

A check digit is one extra digit, computed from all the others, that catches the typos and swaps people
make most. Barcodes and ISBN-13 use GS1 mod-10; ISBN-10 and ISSN use mod-11 (hence the occasional X);
cards and IMEIs use Luhn. Validate any of them, privately, with the
[Barcode Validator](/dev/barcode-check-digit-validator/) and
[IMEI & Luhn Validator](/dev/imei-luhn-validator/), and remember a valid checksum proves *well-formed*,
not *real*.
