---
title: "What Day of the Year Is It? Ordinal Dates and Leap Years Explained"
seoTitle: 'Day of the Year: Ordinal Dates & Leap Years'
description: "The day-of-year is the ordinal count from January 1: day 60 is March 1, day 61 in a leap year. How ordinal dates, leap years and business days work."
pubDate: 2026-08-01
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/day-of-year-ordinal-dates-guide.png
heroAlt: "How the day-of-year ordinal count works across a common year and a leap year"
tools: ["/time/day-of-year-calculator/", "/time/day-of-week-calculator/", "/time/add-business-days-calculator/"]
keywords:
  - day of the year
  - what day of the year is it
  - ordinal date
  - julian date
  - leap year rule
  - day of year calculator
  - business days calculator
faqs:
  - q: "What is the day of the year for a date?"
    a: "It's the ordinal count of days from January 1, which is day 1. So February 1 is day 32, and March 1 is day 60 in a common year or day 61 in a leap year (because February gains a 29th day). December 31 is day 365, or day 366 in a leap year. The LazyTools Day of the Year Calculator computes it for any date in your browser."
  - q: "Is the day-of-year the same as a Julian date?"
    a: "In everyday use — logistics, manufacturing lot codes, spreadsheets — 'Julian date' usually means exactly this: the ordinal day-of-year, often zero-padded like 045. It is NOT the astronomical Julian Day Number, which is a continuous count of days since 4713 BC used in astronomy. The two share a name but are completely different numbers."
  - q: "How does the leap year rule work?"
    a: "A year is a leap year if it's divisible by 4, except century years, which must also be divisible by 400. So 2004, 2008 and 2000 are leap years, but 1900, 2100 and 2200 are not. This keeps the calendar aligned with the solar year, which is about 365.2425 days. Leap years have 366 days; February gains a 29th."
  - q: "How do I count business days between or from a date?"
    a: "Business (working) days are Monday–Friday. To count them between two dates, tally the weekdays and exclude weekends; to add business days to a date, step forward day by day counting only weekdays. Neither excludes public holidays automatically — those vary by country, so subtract them separately. The LazyTools business-day tools handle the weekend math for you."
  - q: "What day of the week was I born?"
    a: "Enter your birth date into a day-of-the-week calculator and it returns the weekday using the Gregorian calendar. For example, January 1, 2000 was a Saturday. The LazyTools Day of the Week Calculator does this for any past or future date in your browser."
  - q: "Are these date calculations done privately?"
    a: "Yes — the LazyTools day-of-year, day-of-week and business-day calculators all run entirely in your browser using JavaScript's date functions. Nothing you enter is uploaded, and they work offline."
draft: false
---

**The day-of-year is simply the ordinal count of days from January 1 (day 1): March 1 is day 60 in a
common year and day 61 in a leap year, and December 31 is day 365 — or 366 when February has 29
days.** That one idea underlies a surprising amount of everyday date math: ordinal ("Julian") date
codes, leap-year handling, and working out weekdays and business-day deadlines. The
[Day of the Year Calculator](/time/day-of-year-calculator/),
[Day of the Week Calculator](/time/day-of-week-calculator/) and
[Add Business Days Calculator](/time/add-business-days-calculator/) do each of these in your browser.

<aside class="key-takeaways">

**Key takeaways**

- The day-of-year is the ordinal count from January 1 (day 1) to December 31 (day 365, or 366 in a leap year).
- From March onward, a leap year adds one to every date's number because February 29 sits ahead of it.
- The leap-year rule: divisible by 4, but century years must also be divisible by 400 — so 2000 counted, 1900 and 2100 do not.
- "Julian date" in business usually means the ordinal day-of-year, not the astronomer's Julian Day Number.
- Weekday lookups and business-day deadlines are the same date arithmetic in a different shape — and all of it runs in your browser.

</aside>

## Ordinal dates: counting from January 1

An [**ordinal date**](https://en.wikipedia.org/wiki/Ordinal_date) replaces "month and day" with a single number: how many days into the year you
are. January 1 is day 1; the count climbs to 365 (or 366) on December 31. The pivot is February:

| Date | Common year | Leap year |
|---|---|---|
| Jan 1 | 1 | 1 |
| Feb 1 | 32 | 32 |
| **Mar 1** | **60** | **61** |
| Jul 1 | 182 | 183 |
| Dec 31 | 365 | 366 |

Everything from March onward shifts by one day in a leap year, because February 29 slots in ahead of
it.

## A quick way to compute it by hand

You don't need to count 365 boxes. Add the number of days in every month *before* the one you're in,
then add the day of the month. The month offsets are just running totals, and they only change after
February in a leap year:

| Month | Days before it (common) | Days before it (leap) |
|---|---|---|
| January | 0 | 0 |
| February | 31 | 31 |
| March | 59 | 60 |
| April | 90 | 91 |
| May | 120 | 121 |
| June | 151 | 152 |
| July | 181 | 182 |
| August | 212 | 213 |
| September | 243 | 244 |
| October | 273 | 274 |
| November | 304 | 305 |
| December | 334 | 335 |

**Worked example.** What's the day-of-year for October 15, 2025? 2025 is a common year (not divisible
by 4), so use the common column: October's offset is 273, plus 15, which gives **day 288**. In the leap
year 2024 the same date would be 274 + 15 = **day 289**, one higher because February 29 came first.

**Reverse example.** Given day 100 of 2025, which date is it? Scan the common column for the largest
offset below 100 — that's March (59) versus April (90). April 90 fits, and 100 − 90 = 10, so day 100 is
**April 10**. In a leap year the same day-100 lands on April 9, because every March-onward offset is one
larger. The [Day of the Year Calculator](/time/day-of-year-calculator/) does both directions instantly,
but the table is handy when you want to sanity-check a lot code by eye.

<figure class="my-8">
<svg viewBox="0 0 1200 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The day-of-year count shifts by one from March onward in a leap year" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="52" text-anchor="middle" font-family="system-ui,sans-serif" font-size="36" font-weight="800" fill="#0f172a">Day-of-year: Jan 1 = 1 … Dec 31 = 365 / 366</text>

  <!-- common year bar -->
  <text x="60" y="132" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#0369a1">Common year (365)</text>
  <rect x="60" y="150" width="1080" height="50" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <line x1="150" y1="150" x2="150" y2="200" stroke="#0284c7" stroke-width="2"/>
  <text x="150" y="230" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#075985">Feb 1 = 32</text>
  <line x1="238" y1="150" x2="238" y2="200" stroke="#dc2626" stroke-width="3"/>
  <text x="238" y="230" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" font-weight="700" fill="#b91c1c">Mar 1 = 60</text>

  <!-- leap year bar -->
  <text x="60" y="302" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#15803d">Leap year (366)</text>
  <rect x="60" y="320" width="1080" height="50" rx="8" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
  <line x1="150" y1="320" x2="150" y2="370" stroke="#16a34a" stroke-width="2"/>
  <text x="150" y="400" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" fill="#166534">Feb 1 = 32</text>
  <line x1="246" y1="320" x2="246" y2="370" stroke="#dc2626" stroke-width="3"/>
  <text x="252" y="400" text-anchor="middle" font-family="ui-monospace,monospace" font-size="18" font-weight="700" fill="#b91c1c">Mar 1 = 61 (+1)</text>
</svg>
</figure>

## "Julian date" — two very different things

Watch out for a naming clash:

- **Ordinal day-of-year** — the day 1–366 number above, often zero-padded (`2024045` = day 45 of
  2024). This is what a warehouse or a spreadsheet usually means by "Julian date," and it's what the
  [Day of the Year Calculator](/time/day-of-year-calculator/) gives you.
- **[Astronomical Julian Day Number](https://en.wikipedia.org/wiki/Julian_day)** — a continuous count of days since January 1, 4713 BC, used in
  astronomy (today is around 2.46 million). Completely different number, same word.

If someone hands you a 5- or 7-digit "Julian date" for a product lot, they almost always mean the
ordinal one.

## The leap-year rule in full

A year has 366 days when:

> It's divisible by **4**, **except** century years, which must also be divisible by **400**.

So 2000 was a leap year (divisible by 400) but 1900 and 2100 are not (divisible by 100, not 400). The
rule exists because the solar year is ~365.2425 days: adding a day every 4 years slightly overshoots,
and skipping 3 leap days every 400 years corrects it.

## Weekdays and business days

Two related questions fall out of the same date arithmetic:

- **What weekday is a date?** Every date maps to one of seven weekdays. The ISO convention numbers them
  Monday = 1 … Sunday = 7 (spreadsheets and most code use this), which differs from the US habit of
  starting the week on Sunday. The [Day of the Week Calculator](/time/day-of-week-calculator/) also
  tells you if it's a weekend and how far it is from today.
- **What date is N working days away?** Business days are Monday–Friday. Adding, say, 10 business days
  to a date means stepping forward and counting only weekdays — the basis of SLAs, net-terms payments
  and delivery estimates. The [Add Business Days Calculator](/time/add-business-days-calculator/) does
  this (it skips weekends; subtract public holidays yourself, since those vary by country).

**Worked example.** A contract says payment is due "10 business days after invoice," and the invoice is
dated Friday, October 3, 2025. Counting only weekdays: the following Monday (Oct 6) is business day 1,
and stepping forward through two full work weeks lands day 10 on **Friday, October 17** — a plain
14-calendar-day gap that happens to contain two weekends. Note the convention question: does the start
date count as day 0 or day 1? Most "add N business days" logic treats the start date as day 0 and begins
counting the next working day, which is what the calculator assumes. If a public holiday falls inside
that window, the true due date slides one working day later, so always cross-check against the relevant
holiday calendar.

## Where ordinal dates actually show up

The day-of-year isn't just a curiosity. A few places it turns up in practice:

- **Manufacturing and food lot codes.** A stamp like `5288` often reads as year digit 5, day-of-year
  288 — mid-October — letting a line print a compact date without a full calendar.
- **Spreadsheets and data pipelines.** Grouping records by ordinal day makes year-over-year comparisons
  line up cleanly, and many systems store or export a padded day-of-year field.
- **Aviation and logistics.** Ordinal "Julian" dates are common on shipping labels and flight paperwork
  because they sort numerically and avoid month-name ambiguity between regions.
- **Scientific and agricultural records.** Day-of-year is a natural x-axis for seasonal data such as
  growing-degree days or daily observations.

In every case the underlying number is the same ordinal count — which is why one small idea covers so
much ground.

## Why do this in the browser?

None of this needs a server — it's arithmetic on a date. Doing it locally means the dates you're
planning around (deadlines, birthdays, ship dates) never leave your device, and the tools keep working
offline. All three LazyTools date calculators run entirely client-side.

## The bottom line

The day-of-year is the ordinal count from January 1, leap years insert February 29 (shifting every
later day by one), and "Julian date" usually means that ordinal number — not the astronomer's. Weekday
and business-day questions are the same date math in a different shape. Reach for the
[day-of-year](/time/day-of-year-calculator/), [weekday](/time/day-of-week-calculator/) and
[business-day](/time/add-business-days-calculator/) calculators and let them handle the leap years and
weekends for you.
