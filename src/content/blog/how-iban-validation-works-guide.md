---
title: "How IBAN Validation Works (the Mod-97 Check)"
seoTitle: 'How IBAN Validation Works: The Mod-97 Check'
description: "An IBAN is valid when its ISO 13616 mod-97 checksum leaves a remainder of exactly 1. How the check works, step by step, locally, never uploaded."
pubDate: 2026-07-28
updatedDate: 2026-07-28
archetype: explainer
heroImage: /blog/how-iban-validation-works-guide.png
heroAlt: "How IBAN validation works, the mod-97 check that turns an IBAN into a big number and confirms the remainder is 1"
tools: ["/dev/iban-validator/"]
keywords:
  - how IBAN validation works
  - iban validator
  - iban check digit
  - iban checksum
  - iban mod 97
  - validate iban
  - iban format
  - what is an iban
faqs:
  - q: "How is an IBAN validated?"
    a: "By the ISO 13616 mod-97 checksum. Move the first four characters (country code plus check digits) to the end, replace each letter with two digits (A=10, B=11 … Z=35), read the whole string as one big integer, and divide by 97. A valid IBAN leaves a remainder of exactly 1. Anything else means the IBAN is mistyped or malformed."
  - q: "What is the mod-97 check?"
    a: "It's the arithmetic behind IBAN validation, defined in ISO 7064. The rearranged, all-numeric IBAN is treated as a single large number and taken modulo 97; a well-formed IBAN is constructed so this remainder is 1. The two check digits after the country code are chosen precisely to make that true, which is why a single typo or a pair of swapped digits almost always breaks it."
  - q: "Does a valid IBAN mean the account exists?"
    a: "No. Validation only proves the IBAN is well-formed and not mistyped, correct length, correct country code, and a passing check digit. It cannot confirm the account is open, active, or owned by anyone in particular. Only the receiving bank can confirm that when a payment is actually made."
  - q: "Why is my IBAN the wrong length?"
    a: "Each country has a fixed IBAN length, and a mismatch usually means a missing or extra character, or stray formatting. Germany is 22 characters, the UK is 22, and France is 27, for example. If your IBAN doesn't match its country's expected length, the mod-97 check fails before the checksum is even meaningful."
  - q: "What does an IBAN's structure mean?"
    a: "Every IBAN begins with a 2-letter country code, then 2 check digits, then the country-specific BBAN (Basic Bank Account Number), which packs the bank identifier and the account number. The country code says which format to expect, the check digits guard against typos, and the BBAN routes to the actual account."
  - q: "Is my IBAN uploaded when I validate it?"
    a: "Not with the LazyTools IBAN validator. The mod-97 check runs entirely in your browser using JavaScript, your account number never leaves the page and is never sent to a server. That matters because an IBAN is sensitive financial data."
draft: false
---

**An IBAN is valid when it passes the ISO 13616 mod-97 checksum, rearrange it, turn every letter
into digits, read the result as one big integer, and a well-formed IBAN leaves a remainder of
exactly 1.** That's the whole of how IBAN validation works: a single division that catches typos and
transposed digits before a payment goes out. Run the check in the
[IBAN Validator &amp; Formatter](/dev/iban-validator/). It does the mod-97 math locally, so your
account number never leaves the browser.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Valid = remainder 1:</strong> the mod-97 check on the rearranged IBAN must equal 1</li>
<li><strong>Structure:</strong> 2-letter country code + 2 check digits + country-specific BBAN</li>
<li><strong>The check digits</strong> are chosen so the checksum works, one typo usually breaks it</li>
<li><strong>Structure only:</strong> a valid IBAN is well-formed, but it does <em>not</em> prove the account exists</li>
<li><strong>Fixed length per country</strong>, DE 22, GB 22, FR 27; spaces are ignored</li>
<li><strong>Local by design:</strong> LazyTools runs the check in your browser, nothing is uploaded</li>
</ul>
</aside>

<figure>
<img src="/blog/infographic-iban.svg" alt="The IBAN mod-97 check: move the first four characters to the end, replace letters with two digits (A=10 to Z=35), then take the big number modulo 97, a valid IBAN gives a remainder of 1" width="1200" height="700" loading="lazy" />
<figcaption>The mod-97 check in three steps: rearrange, letters to digits, then modulo 97 equals 1.</figcaption>
</figure>

## The structure of an IBAN

An IBAN is three parts read left to right: a country code, two check digits, then the BBAN. The
**country code** is two letters (`GB`, `DE`, `FR`) that identify which national format follows. The
**two check digits** come next, a number from 00 to 99 that acts as a built-in tripwire for typos.
Everything after that is the **BBAN** (Basic Bank Account Number), the country-specific block that
packs the bank identifier and the account number into a fixed layout.

Take the standard example `GB82 WEST 1234 5698 7654 32`:

- `GB`, the country code (United Kingdom)
- `82`, the two check digits
- `WEST 1234 5698 7654 32`, the BBAN: a bank code (`WEST`), a sort code (`123456`), and the account number

The country code tells any validator which length and layout to expect, and the check digits let it
confirm nothing was mistyped, without ever contacting a bank.

This layered design is what makes an IBAN self-checking. The country code narrows the problem (now
the validator knows exactly how many characters to expect and where the bank and account fields
sit), and the check digits then guard the whole string. Nothing in the number is decorative: every
character is either identifying an institution, addressing an account, or protecting the rest against
transcription errors.

## The mod-97 check, step by step

Validation is one calculation, defined by [ISO 13616](https://en.wikipedia.org/wiki/International_Bank_Account_Number) and [ISO 7064](https://en.wikipedia.org/wiki/ISO_7064), in three moves. Using
`GB82 WEST 1234 5698 7654 32`:

1. **Move the first four characters to the end.** Take the country code and check digits (`GB82`)
   off the front and append them to the back:
   `WEST 1234 5698 7654 32` becomes the head, with `GB82` now trailing → `WEST12345698765432GB82`.
2. **Replace each letter with two digits.** Every letter maps to a number: `A=10, B=11 … Z=35`. So
   `W=32, E=14, S=28, T=29`, and the trailing `G=16, B=11`. After substitution the whole string is
   one long run of digits.
3. **Take the whole thing modulo 97.** Read that giant digit string as a single integer and divide
   by 97. For a valid IBAN the remainder is **exactly 1**. `GB82 WEST 1234 5698 7654 32` gives
   remainder 1, so it passes.

The two check digits (`82` here) were originally computed to force that remainder to 1. That's why
the test is so sensitive: change one digit, or swap two adjacent digits, and the remainder almost
never stays at 1, the error is caught instantly.

## What validation does and doesn't prove

Validation proves structure, not existence. A passing mod-97 check confirms the IBAN is
**well-formed**: the country code is real, the length matches, and the check digits are consistent
with the rest of the number. That is genuinely useful. It stops most fat-finger mistakes before a
transfer leaves your account.

What it **cannot** do is confirm the account is real, open, or owned by the person you think. The
checksum is pure arithmetic; it has no connection to any bank's records. A perfectly valid-looking
IBAN might belong to a closed account, or to no account at all. Only the receiving bank can confirm
the account during an actual payment. So treat a green checkmark as "not mistyped," never as
"money will arrive."

The practical upshot is that IBAN validation is a first line of defence, not the last word. It's
ideal for catching the honest mistakes that happen when someone reads a number off an invoice or
retypes it into a form, a dropped digit, a swapped pair, a wrong country prefix. For confirming that
a beneficiary is who they claim to be, banks increasingly run a separate name-and-account check at
payment time. Validation and that confirmation solve different problems: one guards the format, the
other guards the destination.

## Country lengths and formatting

Each country fixes its IBAN to a single length, and the validator checks that first. Germany is 22
characters, the United Kingdom is 22, and France is 27, and every other country has its own fixed
number too. Because the length is part of the specification, a wrong length is caught before the
mod-97 math even runs.

Formatting, on the other hand, is cosmetic. IBANs are conventionally printed in **groups of four
characters** for readability, `GB82 WEST 1234 5698 7654 32`, but those spaces carry no meaning.
Validators strip them before doing anything, so `GB82WEST12345698765432` and the spaced version are
identical as far as the checksum is concerned. When you store or transmit an IBAN, the spaces are
optional; when you print it for a human, the groups of four make it far easier to read back.

## Common mistakes

A few misreadings trip people up again and again:

- **Assuming valid means the account exists.** The single most common error. Validation checks
  spelling, not reality, the account behind a valid IBAN could be closed or fictional.
- **A missing or extra digit.** Drop or add one character and the length is wrong, or the checksum
  fails. This is exactly what the check is designed to catch, so trust the failure and re-check the
  source.
- **The wrong country length.** Pasting a 20-character string as a German IBAN (which must be 22)
  fails immediately, the length gate rejects it before the checksum.
- **Treating spaces as significant.** They aren't. Spaces are for humans; a validator ignores them.
  Don't assume two IBANs differ just because one has groups of four and the other doesn't.
- **Trusting a lookalike.** Two swapped digits usually break the mod-97 remainder, which is the
  whole point, but always copy IBANs from an authoritative source rather than retyping them.

## Check an IBAN privately

To validate or tidy up an IBAN, paste it into the
[IBAN Validator &amp; Formatter](/dev/iban-validator/). It runs the mod-97 check in your browser,
confirms the length and structure, and formats the number into readable groups of four, all
locally, so the account number never leaves your device. Because an IBAN is sensitive financial
data, that local-only handling matters: nothing is uploaded, logged, or sent anywhere.

For other checksum-based identifiers, the same idea powers the
[ISBN converter](/dev/isbn-converter/), which uses a check digit to catch mistyped book numbers. And
if you need to share a document that contains account numbers, run it through the
[PII redactor](/security/pii-redactor/) first to mask the sensitive digits, also entirely in your
browser.
