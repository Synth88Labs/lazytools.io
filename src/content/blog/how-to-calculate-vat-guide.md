---
title: "How to Add and Remove VAT (Without Getting It Wrong)"
description: "To add VAT, multiply the net price by 1 plus the rate; to remove VAT, divide the gross price by 1 plus the rate — you divide, you don't subtract the percentage. Here's why, with worked examples, a country rate table, and the mistake almost everyone makes."
pubDate: 2026-07-27
updatedDate: 2026-07-27
archetype: explainer
heroImage: /blog/how-to-calculate-vat-guide.png
heroAlt: "Adding VAT multiplies the net price by 1 plus the rate; removing VAT divides the gross by the same figure."
tools: ["/calc/vat-gst-calculator/"]
keywords:
  - how to calculate vat
  - how to remove vat
  - how to add vat
  - reverse vat calculator
  - vat calculation formula
  - gst calculation
faqs:
  - q: "How do I add VAT to a price?"
    a: "Multiply the net (ex-VAT) price by 1 plus the rate as a decimal. At a 20% rate, multiply by 1.20 — so £50 excluding VAT becomes £50 x 1.20 = £60 including VAT."
  - q: "How do I remove VAT from a gross price?"
    a: "Divide the VAT-inclusive price by 1 plus the rate — you divide, you do not subtract the percentage. At 20%, £60 including VAT is £60 / 1.20 = £50 excluding VAT."
  - q: "Why can't I just subtract 20% to remove VAT?"
    a: "Because the 20% was originally added to the smaller net figure, not the larger gross figure. Subtracting 20% of £60 removes £12 (giving £48), but the real net is £50 — the £10 of VAT is 20% of £50 yet only 16.67% of the £60 gross."
  - q: "How do I work out the VAT amount contained in a price?"
    a: "When adding, the VAT is the net price times the rate (net x 0.20 at 20%). When removing, it is the gross minus the recovered net — for example £240 / 1.20 = £200, so the VAT was £240 - £200 = £40."
  - q: "Is GST calculated the same way as VAT?"
    a: "Yes. VAT and GST work identically as a percentage-based tax on the net price — only the name and the rate differ by country. The same add (multiply) and remove (divide) formulas apply."
  - q: "Which VAT rate should I use in the calculation?"
    a: "Use the current official rate for your country and product category, since rates and reduced-rate categories change over time. This guide's worked examples use 20%, but always confirm the applicable rate before relying on a figure."
draft: false
---

**To add VAT, multiply the price (excluding VAT) by 1 plus the rate as a decimal. To remove VAT, divide the price (including VAT) by that same figure — you divide, you do not subtract the percentage.** At a 20% rate, £50 excluding VAT becomes £50 × 1.20 = £60 including VAT; and £60 including VAT is £60 ÷ 1.20 = £50 excluding VAT. Subtracting 20% from £60 gives £48, which is wrong — and that single mistake is behind most VAT errors.

<aside class="key-takeaways">

**Key takeaways**

- **Add VAT:** gross = net × (1 + rate). At 20%, ×1.20.
- **Remove VAT:** net = gross ÷ (1 + rate). At 20%, ÷1.20.
- **The trap:** removing VAT is *division*, not subtracting the percentage — because the tax was added to the smaller net figure.
- **The VAT amount** is the difference between gross and net (or net × rate when adding).
- **VAT and GST** work identically — only the name and rate differ by country.
- Rates and reduced-rate categories change; always confirm the current official rate.

</aside>

<figure>
<img src="/blog/infographic-vat.svg" alt="Adding 20% VAT: £50 net × 1.20 = £60 gross (VAT £10). Removing 20% VAT: £60 gross ÷ 1.20 = £50 net — not £48, because subtracting 20% of the gross removes too much." width="1200" height="700" loading="lazy" />
<figcaption>Add by multiplying; remove by dividing. Subtracting the percentage from the gross is the common error.</figcaption>
</figure>

## Adding VAT to a net price

If you have a price *before* tax (the **net** or ex-VAT price) and want the total a customer pays (the **gross** or inc-VAT price), multiply by 1 plus the rate:

> gross = net × (1 + rate ÷ 100)

At 20%, that's net × 1.20. The VAT itself is the net price times the rate:

> VAT = net × (rate ÷ 100)

**Example:** a product priced at £200 excluding VAT, at 20%: VAT = £200 × 0.20 = £40, and the gross price = £200 × 1.20 = £240.

## Removing VAT from a gross price

This is the one people get wrong. If you have the **VAT-inclusive** price and want the net price (or the VAT contained in it), you **divide** by 1 plus the rate:

> net = gross ÷ (1 + rate ÷ 100)

At 20%, that's gross ÷ 1.20. The VAT contained in the price is then the gross minus the net:

> VAT = gross − net

**Example:** a receipt total of £240 including 20% VAT: net = £240 ÷ 1.20 = £200, so the VAT was £40.

## Why you divide instead of subtracting 20%

The instinct is to take 20% off the gross price. That's wrong because **the 20% was originally added to the smaller net figure, not the larger gross figure.**

Walk it through with £60 including 20% VAT:

- Subtracting 20% of £60 removes £12 → £48. Too low.
- The real net is £50, because £50 × 1.20 = £60. The VAT is £10, which is 20% of £50 — but only **16.67%** of £60.

So to strip VAT from a gross price you divide by 1.20 (or multiply by 0.8333), never subtract 0.20. This is why a "reverse VAT" calculation is a distinct operation from adding it.

| You have | You want | Do this (20%) |
| --- | --- | --- |
| Net (ex-VAT) | Gross (inc-VAT) | × 1.20 |
| Net (ex-VAT) | VAT amount | × 0.20 |
| Gross (inc-VAT) | Net (ex-VAT) | ÷ 1.20 |
| Gross (inc-VAT) | VAT amount | − (gross ÷ 1.20) |

## VAT and GST rates around the world

VAT (value-added tax) and GST (goods and services tax) are the same kind of tax — a percentage added at the point of sale — just under different names and rates. The arithmetic above works for any of them; only the rate changes.

| Country | Name | Standard rate |
| --- | --- | --- |
| United Kingdom | VAT | 20% |
| Germany | VAT (MwSt) | 19% |
| France | VAT (TVA) | 20% |
| Ireland | VAT | 23% |
| Australia | GST | 10% |
| New Zealand | GST | 15% |
| India | GST | commonly 18% |
| Singapore | GST | 9% |

These are standard rates; many countries apply **reduced or zero rates** to categories like food, books, children's goods and medicine. Rates also change over time. Treat this table as a starting point and confirm the current official rate for your country and product before relying on a figure — for authoritative rates see your national tax authority (e.g. [HMRC](https://www.gov.uk/vat-rates) in the UK or the [European Commission VAT rates database](https://taxation-customs.ec.europa.eu/)).

## Calculate it instantly

The [VAT / GST calculator](/calc/vat-gst-calculator/) does both directions at any rate: enter a price, pick "add" or "remove", and it returns the net, the VAT, and the gross. It runs entirely in your browser — your figures are never uploaded — and works for VAT, GST, or any percentage sales tax.

## FAQ

**How do I remove VAT from a price?**
Divide the VAT-inclusive price by 1 plus the rate as a decimal. To remove 20% VAT from £60: £60 ÷ 1.20 = £50 net, so the VAT was £10. Don't subtract 20% of the gross — that removes too much.

**How do I add VAT to a price?**
Multiply the net (ex-VAT) price by 1 plus the rate. At 20%: net × 1.20. The VAT amount alone is net × 0.20.

**Why isn't the VAT in a gross price just 20% of it?**
Because the 20% was applied to the net price, which is smaller. In a £60 gross price at 20%, the £10 of VAT is 20% of the £50 net but only 16.67% of the £60 gross. That's why you divide by 1.20 to reverse it.

**What's the difference between VAT and GST?**
None mathematically — both are percentage consumption taxes added to a price. "VAT" is used in the UK, EU and many countries; "GST" is the name in Australia, New Zealand, India, Singapore and Canada. Use the same add/remove formulas with the local rate.

**What VAT rate should I use?**
Your country's current standard rate, unless the item qualifies for a reduced or zero rate. Because rates and categories change, verify the official current rate rather than relying on a remembered figure.

**How do I find the VAT included in a total?**
Divide the total by 1 plus the rate to get the net, then subtract that from the total. For £240 at 20%: net = £240 ÷ 1.20 = £200, so VAT = £40.

**Is the VAT calculator private?**
Yes — it computes entirely in your browser and uploads nothing, so you can price-check invoices and quotes without sending figures to a server. It also works offline once loaded.
