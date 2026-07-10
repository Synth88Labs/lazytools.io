---
title: "Why Your First Mortgage Payment Is Almost All Interest"
description: "On a $300k loan at 6%, payment #1 is $1,500 interest and just $299 principal — because interest is charged on the balance you still owe, and early on you owe nearly everything. How amortization works, why total interest can exceed the loan, and how extra principal shortens it."
pubDate: 2026-07-10
updatedDate: 2026-07-10
archetype: explainer
tools: ["/calc/mortgage-calculator/", "/calc/auto-loan-calculator/"]
keywords:
  - mortgage amortization explained
  - why is my mortgage payment mostly interest
  - amortization schedule
  - how mortgage interest works
  - extra principal payments
  - total interest on a mortgage
  - loan payment formula
heroImage: /blog/mortgage-amortization-guide.png
heroAlt: "Amortization explained — why early mortgage payments are mostly interest and late ones mostly principal"
faqs:
  - q: "Why is my first mortgage payment almost all interest?"
    a: "Because interest each month is charged on the balance you still owe, and at the start you owe almost the entire loan. On a $300,000 loan at 6% APR, the monthly interest is $300,000 × (6%/12) = $1,500. Your fixed payment is about $1,799, so only ~$299 goes to principal that first month. The payment isn't unfair — the balance is simply still huge."
  - q: "What is an amortization schedule?"
    a: "A month-by-month table showing how each fixed payment splits between interest and principal, and the balance remaining. Every row: interest = current balance × monthly rate; principal = payment − interest; new balance = old balance − principal. The interest share shrinks each month as the balance falls, so principal grows — slowly at first, then faster."
  - q: "How is the monthly mortgage payment calculated?"
    a: "With the amortizing-loan formula M = P·r(1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the loan amount, r is the monthly rate (APR ÷ 12), and n is the number of months. For $300,000 at 6% over 30 years, that's about $1,799/month. The payment is fixed for the whole term; only the interest/principal split changes."
  - q: "How can total interest be more than the amount I borrowed?"
    a: "Because for years the balance barely drops, so you keep paying interest on a large sum. On a $300,000 loan at 6% over 30 years you pay roughly $347,500 in interest — more than the house price — for a total of about $647,500. A shorter term or lower rate cuts this dramatically; the mortgage calculator shows the totals side by side."
  - q: "Does paying extra principal really help?"
    a: "Yes, and more than most people expect — because every extra dollar of principal permanently removes all the future interest that dollar would have accrued. Paying a little extra each month can cut years off a 30-year loan and save tens of thousands in interest. The calculator's 'extra per month' field shows exactly how many months you'd save."
  - q: "Should I pick a 15-year or 30-year mortgage?"
    a: "A 15-year term has higher monthly payments but far less total interest, because you're borrowing the money for half as long and usually at a lower rate. A 30-year term is easier on monthly cash flow but costs much more overall. Run both in the calculator and compare the 'total interest' line — the difference is often six figures."
draft: false
---

**On a $300,000 mortgage at 6%, your very first payment is about $1,500 interest and only $299
principal — not because the bank is gouging you, but because interest is charged on the balance you
still owe, and in month one you still owe almost the whole loan.** As the balance falls, the split
flips: the last payment is nearly all principal. See the full month-by-month breakdown for your own
numbers in the [mortgage calculator](/calc/mortgage-calculator/); here's why it works this way.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Interest each month = balance × monthly rate</strong> — so it's largest when the balance is largest (the start)</li>
<li>The <strong>payment is fixed</strong>; only the interest/principal split moves over time</li>
<li>Payment #1 on a $300k / 6% / 30yr loan: <strong>$1,500 interest, $299 principal</strong></li>
<li>Total interest ≈ <strong>$347,500</strong> — more than the amount borrowed</li>
<li><strong>Extra principal early</strong> erases future interest and shortens the loan</li>
</ul>
</aside>

## The whole idea, in one picture

<figure>
<img src="/blog/infographic-amortization.svg" alt="Infographic showing three mortgage payments on a 300,000 dollar loan at 6 percent over 30 years with a fixed payment near 1799 dollars: payment 1 is 1500 dollars interest and 299 dollars principal, about 83 percent interest; payment 180 at the halfway point is a roughly even split; payment 360 is almost all principal with about 9 dollars interest. Because the balance barely drops early, total interest is about 347,500 dollars, more than the amount borrowed, and paying extra principal early shortens the loan" width="1200" height="640" loading="lazy" />
<figcaption>The payment never changes — but the red interest shrinks and the green principal grows every month.</figcaption>
</figure>

## The one rule that explains everything

Every month, the lender charges interest on **the balance you still owe** — not on the original loan,
and not on what you've paid off. The monthly interest rate is the APR divided by 12:

> **Interest this month = current balance × (APR ÷ 12)**

At 6% APR that monthly rate is 0.5%. In month one you still owe the full $300,000, so:

- Interest = $300,000 × 0.5% = **$1,500**
- Your fixed payment is **$1,798.65**
- Principal = $1,798.65 − $1,500 = **$298.65**

So $1,500 of your first payment vanishes as interest and just under $300 chips away at the debt. It
feels lopsided because it *is* — but it's arithmetic, not a trick. You owe a lot, so you're charged a
lot of interest on it.

## Where the fixed payment comes from

The payment is set once, at the start, so that exactly `n` equal payments zero out the loan. That's
the amortizing-loan formula:

> **M = P · r(1 + r)ⁿ ⁄ ((1 + r)ⁿ − 1)**

where P is the loan ($300,000), r is the monthly rate (0.005), and n is the number of months (360).
Plug those in and M ≈ **$1,798.65**. The [mortgage calculator](/calc/mortgage-calculator/) computes
this and then walks the schedule forward month by month.

## Watching the split flip

Because principal reduces the balance, next month's interest is charged on a slightly smaller number,
so slightly less of the payment is interest and slightly more is principal. That feedback compounds:

| Payment | Interest | Principal | Balance after |
|---|---|---|---|
| 1 | $1,500.00 | $298.65 | $299,701.35 |
| 2 | $1,498.51 | $300.14 | $299,401.20 |
| 180 (halfway in time) | ≈ $860 | ≈ $939 | ≈ $172,000 |
| 360 (final) | ≈ $9 | ≈ $1,790 | $0 |

Notice the balance is still around **$172,000 at the halfway point in *time*** — you're not halfway
*paid off* until much later, because those early years barely touched the principal. This is the
single most surprising thing about a mortgage, and the reason the equity in a newly-bought home grows
so slowly at first.

## Why total interest can beat the loan itself

Add up all 360 interest columns and you get roughly **$347,500** — *more than the $300,000 you
borrowed*. Total paid: about $647,500 for a $300,000 loan. That's not unusual; it's what happens when
you borrow a large sum for 30 years. Two levers cut it hard:

- **A shorter term.** A 15-year loan borrows the money for half as long (usually at a lower rate too),
  slashing total interest — at the cost of a higher monthly payment.
- **A lower rate.** Even a fraction of a percent moves the total by tens of thousands over 30 years.

Compare them yourself by changing the term and rate in the calculator and watching the *total
interest* line — the same tool applies to a car loan too, via the
[auto loan calculator](/calc/auto-loan-calculator/).

## The payoff move: extra principal, early

Here's the lever most people miss. Because interest is charged on the balance, **every extra dollar of
principal you pay permanently deletes all the future interest that dollar would ever have generated.**
An extra $200 a month on our example loan doesn't just pay off $200 faster — it removes years of
compounding interest on that money, cutting the term by several years and saving tens of thousands.

And it's most powerful *early*, when the balance (and therefore the interest being charged) is
largest. The [mortgage calculator](/calc/mortgage-calculator/) has an **extra-per-month** field that
shows the exact new payoff date and how many months you'd save — and you can export the full schedule
to CSV to plan against it. Everything runs in your browser; none of your figures leave your device.

## Quick summary

Mortgage interest is charged on the balance you still owe, so when the balance is highest — at the
start — the interest portion of your fixed payment is highest too. On a $300k / 6% / 30-year loan that
means $1,500 interest and $299 principal in month one, an even split near the middle, and almost pure
principal at the end. The slow early paydown is why total interest (~$347,500) can exceed the loan, and
why extra principal paid early is the most effective way to shrink both the term and the total. See
your own numbers, schedule and payoff savings in the
[mortgage calculator](/calc/mortgage-calculator/).

*Sources: standard amortizing-loan mathematics ·
[Consumer Financial Protection Bureau — mortgage basics](https://www.consumerfinance.gov/owning-a-home/) ·
[Investopedia — Amortization](https://www.investopedia.com/terms/a/amortization.asp).
General educational information, not financial advice.*
