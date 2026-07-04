---
title: "How EMI Is Calculated: The Exact Formula Banks Use (With Worked Examples)"
description: "EMI = P·r·(1+r)ⁿ ÷ ((1+r)ⁿ−1). See the formula worked step by step, why early payments are mostly interest, the flat-rate trap, and how tenure changes total interest."
pubDate: 2026-07-04
updatedDate: 2026-07-04
archetype: explainer
tools: ["/calc/emi-calculator/", "/calc/compound-interest-calculator/", "/calc/simple-interest-calculator/"]
keywords:
  - how is emi calculated
  - emi formula
  - emi calculation with example
  - reducing balance vs flat rate
  - home loan emi
  - total interest on loan
  - loan amortization explained
  - prepayment emi effect
heroImage: /blog/emi-explained.png
heroAlt: "EMI formula explained — P times r times (1+r)^n over ((1+r)^n minus 1)"
faqs:
  - q: "What is the EMI formula?"
    a: "EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the principal, r the monthly interest rate (annual rate ÷ 12 ÷ 100) and n the number of monthly installments. It is the standard reducing-balance formula used by banks worldwide."
  - q: "Why does most of my early EMI go to interest?"
    a: "Interest each month is charged on the outstanding balance, which is largest at the start. On a 20-year loan at 9%, roughly 83% of the first EMI is interest; the split reverses over time as the balance falls."
  - q: "What is the difference between flat rate and reducing balance?"
    a: "A flat rate charges interest on the original principal for the whole tenure; reducing balance charges only on what you still owe. A 10% flat rate costs about the same as an 17–18% reducing-balance rate on a 5-year loan — always compare the reducing-balance equivalent (APR)."
  - q: "Does a longer tenure make a loan cheaper?"
    a: "It lowers the monthly EMI but raises total interest substantially. On 1,000,000 at 9%: 10 years costs ~520,000 in interest; 20 years costs ~1,159,000 — more than the principal itself."
  - q: "How does prepayment reduce interest?"
    a: "Every prepaid unit of principal stops accruing interest for the remaining tenure, so early prepayments save the most. Keeping the EMI constant and reducing tenure saves far more than reducing the EMI and keeping tenure."
  - q: "Is EMI simple or compound interest?"
    a: "Neither exactly: it is amortization. Interest compounds monthly on the outstanding balance, while your fixed payment simultaneously reduces that balance — the formula balances the two so the loan reaches zero on the last payment."
draft: false
---

**A bank computes your EMI with one formula: EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1)** — where P is the
loan amount, r the *monthly* interest rate, and n the number of months. Everything about loans that
surprises people (interest-heavy early years, the cost of long tenures, the flat-rate trick) falls out
of this one equation. Run your own numbers in the [EMI calculator](/calc/emi-calculator/) — it shows
this exact formula applied to your loan, entirely in your browser.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>The formula:</strong> EMI = P·r·(1+r)ⁿ ÷ ((1+r)ⁿ−1), with r = annual rate ÷ 12 ÷ 100</li>
<li><strong>Early EMIs are ~80% interest</strong> on long loans — the split flips only in the second half</li>
<li><strong>Tenure is the expensive lever:</strong> doubling it can more than double total interest</li>
<li><strong>Flat rate ≠ reducing rate:</strong> 10% flat ≈ 17–18% reducing on a 5-year loan</li>
<li><strong>Prepay early, shorten tenure</strong> — same money saves multiples more interest than trimming the EMI</li>
</ul>
</aside>

## The formula, worked step by step

Take a 1,000,000 loan at 9% per year for 20 years:

1. **Monthly rate:** r = 9 ÷ 12 ÷ 100 = 0.0075
2. **Months:** n = 20 × 12 = 240
3. **Growth factor:** (1 + 0.0075)²⁴⁰ = 6.0092
4. **EMI** = 1,000,000 × 0.0075 × 6.0092 ÷ (6.0092 − 1) = **8,997 per month**
5. **Total paid** = 8,997 × 240 = 2,159,342 → **interest = 1,159,342**

Yes: on a standard 20-year loan at 9%, **total interest exceeds the principal**. That's not a scam —
it's what renting 1,000,000 for two decades costs at that rate. The
[calculator](/calc/emi-calculator/) reproduces every line above for your own numbers.

## Why your early payments barely touch the principal

Each month, interest is charged on the *outstanding balance*. In month 1 of the loan above, interest is
1,000,000 × 0.0075 = 7,500 — so of the 8,997 EMI, only 1,497 reduces the debt. By the final year the
proportions reverse:

| Point in loan | Interest share of EMI | Principal share |
|---|---|---|
| Month 1 | 83% | 17% |
| Year 5 | 76% | 24% |
| Year 10 | 63% | 37% |
| Year 15 | 42% | 58% |
| Final year | 5% | 95% |

This is also why selling a house after 5 years often surprises owners: the loan balance has barely
moved compared to what's been paid.

<div class="callout cite">
<p><span class="co-label">📌 Citable fact</span> On a 20-year loan at 9% (reducing balance), the first monthly payment is roughly 83% interest, and total interest (≈1.16× principal) exceeds the amount borrowed. Both follow directly from EMI = P·r·(1+r)ⁿ ÷ ((1+r)ⁿ−1).</p>
</div>

## Tenure: the lever that costs the most

Same 1,000,000 at 9%, different tenures:

| Tenure | EMI | Total interest | Interest as % of principal |
|---|---|---|---|
| 5 years | 20,758 | 245,501 | 25% |
| 10 years | 12,668 | 520,109 | 52% |
| 15 years | 10,143 | 825,678 | 83% |
| 20 years | 8,997 | 1,159,342 | 116% |
| 30 years | 8,046 | 1,896,752 | 190% |

Stretching from 20 to 30 years cuts the EMI by just 951 a month — but adds 737,000 of interest. The
honest way to choose: pick the *shortest tenure whose EMI you can safely afford*, not the longest one
the bank approves.

## The flat-rate trap

Some lenders (vehicle finance, consumer durables, informal lending) quote a **flat rate**: interest
computed on the *original* principal for the entire tenure, ignoring that you're paying it down.

A 5-year, 500,000 loan "at just 10% flat": interest = 500,000 × 10% × 5 = 250,000, EMI = 12,500. The
same EMI under honest reducing-balance math corresponds to roughly a **17.9% annual rate**. Rule of
thumb: a flat rate ≈ 1.8× its reducing-balance equivalent on mid-length loans. Always ask for the
reducing-balance rate or APR — and check any quote against the
[EMI calculator](/calc/emi-calculator/), which speaks only reducing-balance.

<div class="callout warn">
<p><span class="co-label">⚠️ Watch for</span> "Flat rate" or "on full amount" in loan quotes. 10% flat is not comparable to 10% reducing — it's nearly double the true cost. Regulated home loans are almost always reducing-balance; vehicle and appliance financing often isn't.</p>
</div>

## Prepayment: why early and tenure-first wins

Prepaying principal stops interest on that amount for every remaining month — so the earlier the
prepayment, the more months of interest it kills. On the 20-year loan above, a single 100,000
prepayment in year 2, keeping the EMI constant (so the *tenure* shortens), saves roughly **240,000**
of interest and ends the loan ~3 years early. The same 100,000 in year 15 saves only ~35,000.

Given the choice after prepaying, **reduce tenure, not EMI** — reducing the EMI feels nicer monthly but
gives most of the interest savings back to the bank.

## EMI vs the savings side of the same math

The identical compounding machinery works for you when you invest: the
[compound interest calculator](/calc/compound-interest-calculator/) is the mirror image of the EMI
formula (money growing instead of shrinking), and the
[simple interest calculator](/calc/simple-interest-calculator/) shows what lending *without*
compounding looks like. Comparing the two side by side is the fastest way to internalize why the bank
always seems to win: it borrows simple from you and lends compound to you.

*The [EMI calculator](/calc/emi-calculator/) runs the exact reducing-balance formula in your browser —
loan amounts are sensitive data, and here they never leave your device.*
