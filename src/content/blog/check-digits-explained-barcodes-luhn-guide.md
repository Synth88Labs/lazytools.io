---
title: "Check Digits Explained: How Barcodes, ISBNs and Card Numbers Catch Typos"
description: "The last digit of a barcode, ISBN, credit card or IMEI isn't part of the ID — it's a check digit computed from the rest to catch typos. Here's how mod-10, mod-11 and Luhn work, and how to validate them in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-02
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
    a: "A check digit is an extra digit added to the end of an identifier — a barcode, ISBN, credit-card number or IMEI — that is calculated from all the other digits by a fixed formula. When the number is read back, the formula is re-run; if the recomputed check digit doesn't match, the number was mistyped or misread. It's built-in error detection, not part of the actual identity."
  - q: "How does the EAN-13 or UPC barcode check digit work?"
    a: "By the GS1 mod-10 method: starting from the right of the data digits, multiply alternately by 3 and 1, add them up, and choose the check digit that makes the total a multiple of 10. Scanners recompute this on every read and reject the scan if it doesn't match, which stops most misreads."
  - q: "What is the Luhn algorithm?"
    a: "The Luhn (mod-10) algorithm is the checksum behind credit-card numbers, IMEIs and many ID numbers. From the right, double every second digit (subtracting 9 if the result is over 9), sum all the digits, and a valid number totals a multiple of 10. It catches every single-digit error and almost all adjacent transpositions."
  - q: "Why do some ISBNs end in an X?"
    a: "ISBN-10 (and ISSN) use a mod-11 check, so the check value can come out as 10 — which is written as the single character X to keep it one character. ISBN-13, which is really an EAN-13 barcode, uses mod-10 instead, so its check digit is always a normal 0–9."
  - q: "Does a valid check digit mean the number is real?"
    a: "No. A passing check digit only proves the number is internally consistent — that it probably wasn't mistyped. It says nothing about whether the barcode maps to a real product, the ISBN to a real book, the card to an active account, or the IMEI to an existing phone. Only the issuing authority can confirm that."
  - q: "Can I validate these numbers privately?"
    a: "Yes — check-digit validation is pure arithmetic, so it needs no server. The LazyTools Barcode Validator and IMEI & Luhn Validator run entirely in your browser, so sensitive numbers like card numbers or IMEIs are never uploaded."
draft: false
---

**The last digit of a barcode, ISBN, credit-card number or IMEI usually isn't part of the ID at all —
it's a *check digit*, computed from all the other digits so a scanner or form can instantly tell if the
number was mistyped.** Change one digit and the check almost always fails. Here's how the common
schemes work, and how to validate them with the
[Barcode Validator](/dev/barcode-check-digit-validator/) and
[IMEI & Luhn Validator](/dev/imei-luhn-validator/).

## The idea: catch the typo before it costs you

Humans transpose and fat-finger digits constantly. A check digit is a cheap defence: append one digit
that's a mathematical function of the rest. When the number is entered or scanned again, re-run the
function — if the recomputed digit doesn't match the one on the end, something's wrong. It's the same
principle as a checksum on a file, shrunk to a single digit.

Well-designed check digits catch **every single-digit error** and **almost all "transpositions"**
(swapping two adjacent digits) — precisely the mistakes people make most.

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
  <text x="600" y="146" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#64748b">EAN-13 — twelve data digits + one check digit</text>

  <rect x="230" y="185" width="740" height="60" rx="12" fill="#ecfdf5" stroke="#10b981" stroke-width="2"/>
  <text x="600" y="222" text-anchor="middle" font-family="ui-monospace,monospace" font-size="19" fill="#047857">(3×3 + 1×9 + 3×3 + … ) mod 10 → check digit = 1  ✓ matches</text>

  <text x="600" y="300" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" fill="#b91c1c">4 0 0 6 3 8 <tspan font-weight="800">3</tspan> 1 3 3 3 9 3 1</text>
  <text x="600" y="332" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#dc2626">one digit swapped → recomputed check ≠ 1 → rejected as a misread</text>
</svg>
</figure>

## GS1 mod-10 (barcodes and ISBN-13)

Take an EAN-13 like `4006381333931`. Drop the last digit (the check, `1`) and, reading the remaining 12
from the right, multiply alternately by 3 and 1, add them, and the check digit is whatever makes the
total a multiple of 10. Scanners do this on every beep — it's why a smudged or mis-scanned barcode
simply won't register rather than ringing up the wrong item. The
[Barcode Validator](/dev/barcode-check-digit-validator/) runs it for EAN-13, UPC-A, EAN-8 and GTIN-14,
and can also fill in a missing check digit.

## Luhn (cards and IMEIs)

Credit-card numbers and phone IMEIs use the **Luhn** algorithm. From the right, double every second
digit (if that gives more than 9, subtract 9), add everything up, and a valid number's total is
divisible by 10. It's why a payment form can flag a mistyped card *before* contacting the bank, and why
`490154203237518` is a valid IMEI but `490154203237517` isn't. Check either with the
[IMEI & Luhn Validator](/dev/imei-luhn-validator/), which also splits an IMEI into its TAC (model code)
and serial.

## The big caveat: valid ≠ real

This is the point people miss. A passing check digit means the number is **internally consistent** —
it very likely wasn't mistyped. It does **not** mean:

- the barcode is registered to a real product,
- the ISBN belongs to a published book,
- the credit card is issued or has funds, or
- the IMEI matches an actual phone.

Only the issuing authority (GS1, a publisher, the card network, a carrier) can confirm existence. The
check digit is a spell-checker, not an identity check.

## Why validate in the browser

Some of these numbers are sensitive — a card number, an IMEI. Check-digit validation is pure
arithmetic, so it never needs a server. Both the
[Barcode Validator](/dev/barcode-check-digit-validator/) and the
[IMEI & Luhn Validator](/dev/imei-luhn-validator/) compute everything in your browser and upload
nothing.

## The bottom line

A check digit is one extra digit, computed from all the others, that catches the typos and swaps people
make most. Barcodes and ISBN-13 use GS1 mod-10; ISBN-10 and ISSN use mod-11 (hence the occasional X);
cards and IMEIs use Luhn. Validate any of them — privately — with the
[Barcode Validator](/dev/barcode-check-digit-validator/) and
[IMEI & Luhn Validator](/dev/imei-luhn-validator/), and remember a valid checksum proves *well-formed*,
not *real*.
