---
title: "Hijri, Hebrew, Persian and Julian: How the World's Calendars Actually Work"
description: "Why is the Islamic year 1447 while the Gregorian is 2026? A guide to the world's major calendar systems — lunar, solar and lunisolar — how they differ, and how to convert any date between them in your browser."
pubDate: 2026-07-06
updatedDate: 2026-07-06
archetype: explainer
tools: ["/calendar/calendar-converter/", "/calendar/hijri-date-converter/", "/calendar/persian-calendar-converter/", "/calendar/julian-date-converter/"]
keywords:
  - calendar systems
  - hijri vs gregorian
  - lunar vs solar calendar
  - islamic calendar explained
  - persian calendar
  - hebrew calendar
  - convert between calendars
  - what year is it in different calendars
heroImage: /blog/calendar-systems-guide.png
heroAlt: "How the world's calendars work — lunar, solar and lunisolar systems compared"
faqs:
  - q: "Why is the Islamic year 1448 while the Gregorian year is 2026?"
    a: "Both count from a starting point in the 7th century CE (the Hijra, in 622), but the Islamic calendar is lunar — about 354 days a year — so it gains years faster relative to the solar Gregorian calendar. Over the ~1,400 years since, the lunar calendar has accumulated roughly 44 more years, which is why its number is higher."
  - q: "What's the difference between a lunar, solar and lunisolar calendar?"
    a: "A lunar calendar (like the Islamic) follows the moon's phases — 12 months of ~29.5 days, about 354 days a year — so it drifts against the seasons. A solar calendar (Gregorian, Persian) tracks the sun and stays fixed to the seasons. A lunisolar calendar (Hebrew, Chinese) uses lunar months but adds a leap month periodically to stay aligned with the solar year."
  - q: "Why does Ramadan move earlier every year?"
    a: "Because the Islamic calendar is purely lunar and about 11 days shorter than the solar year. Each Gregorian year, Islamic months — including Ramadan — fall roughly 11 days earlier, cycling through all seasons over about 33 years."
  - q: "What is the Persian (Solar Hijri) calendar?"
    a: "The official calendar of Iran and Afghanistan. Like the Islamic calendar it counts from 622 CE, but it's solar — its year begins at the spring equinox (Nowruz) and stays fixed to the seasons — so its year number (around 1404) differs from the Islamic one (around 1447)."
  - q: "How far apart are the Julian and Gregorian calendars now?"
    a: "13 days. The Julian calendar adds a leap day every four years with no exception, gaining about three days every four centuries; the Gregorian reform of 1582 skips three of those leap days per 400 years to stay aligned with the sun."
  - q: "Are these calendar conversions accurate?"
    a: "The conversions here use the ICU/CLDR calendar database built into your browser — the same authoritative data operating systems use — so a Gregorian-to-Hijri or Persian conversion matches the civil standard. Note that religious dates fixed by moon sighting (Ramadan, Eid) can differ from the calculated civil date by a day."
  - q: "Can I convert a Hijri or Persian date back to a Gregorian one?"
    a: "Yes — the calendar converter and the dedicated Hijri and Persian tools work both directions. The lunisolar Hebrew and Chinese calendars, which insert leap months, are shown Gregorian-to-calendar for reliability."
draft: false
---

**In mid-2026 it's 2026 in the Gregorian calendar, 1448 in the Islamic, 1405 in the Persian, 5786 in
the Hebrew and 2569 in the Thai Buddhist — because the world's calendars count from different moments
and measure the year in different ways: by the moon, by the sun, or by both.** You can see any date
in all of them at once, and convert back, in the [calendar converter](/calendar/calendar-converter/).

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Lunar</strong> (Islamic): ~354 days, drifts ~11 days earlier a year against the seasons</li>
<li><strong>Solar</strong> (Gregorian, Persian): tracks the sun, seasons stay fixed</li>
<li><strong>Lunisolar</strong> (Hebrew, Chinese): lunar months + a leap month to re-align with the sun</li>
<li><strong>Different epochs:</strong> each calendar counts from a different starting event</li>
<li><strong>Julian vs Gregorian:</strong> 13 days apart today, from a leap-year rounding difference</li>
</ul>
</aside>

## Three ways to measure a year

Every calendar answers one hard question — how do you fit whole days into the 365.2422-day solar
year and the 29.53-day lunar month, when neither divides evenly? The answers fall into three families.

**Lunar calendars** follow the moon. Twelve lunar months of 29 or 30 days make about 354 days — some
11 days short of the solar year. The **Islamic (Hijri)** calendar is the main example: it makes no
attempt to track the seasons, so its months drift steadily earlier against the Gregorian calendar,
which is why Ramadan slowly migrates through winter, autumn, summer and spring over about 33 years.

**Solar calendars** follow the sun and keep the seasons fixed. The **Gregorian** calendar is one; so
is the **Persian (Solar Hijri)** calendar, whose year begins precisely at the spring equinox. Solar
calendars need leap days — an occasional extra day — to absorb that stray quarter-day per year.

**Lunisolar calendars** try to have it both ways: months follow the moon, but a whole **leap month**
is inserted every few years to drag the calendar back into step with the sun. The **Hebrew** calendar
adds a 13th month in 7 of every 19 years; the **Chinese** calendar works similarly. This keeps
lunar-defined festivals in their proper seasons.

<figure>
<img src="/blog/infographic-calendar-systems.svg" alt="Infographic comparing lunar, solar and lunisolar calendars: a lunar Islamic year of about 354 days drifting earlier against the seasons, a solar Gregorian/Persian year fixed to the seasons, and a lunisolar Hebrew year that adds a leap month; alongside, the current year number in each system — Gregorian 2026, Islamic 1447, Persian 1404, Hebrew 5786, Buddhist 2569 — showing they count from different epochs" width="1200" height="640" loading="lazy" />
<figcaption>Same instant, five different year numbers — because of how each calendar counts and measures.</figcaption>
</figure>

## Why the year numbers differ so much

Two calendars can start from almost the same event and still show wildly different years. The Islamic
and Persian calendars both count from the **Hijra** — the Prophet Muhammad's migration to Medina in
**622 CE** — yet in mid-2026 one reads ~1448 and the other ~1405. The reason is purely arithmetic: the
Islamic calendar's 354-day lunar years accumulate faster than the Persian calendar's 365-day solar
years, so over ~1,400 years the lunar count has pulled ~44 years ahead.

Other calendars simply start elsewhere:

| Calendar | Type | Counts from | Year in mid-2026 CE |
|---|---|---|---|
| Gregorian | Solar | 1 CE (Christian era) | 2026 |
| Islamic (Hijri) | Lunar | 622 CE (the Hijra) | ~1448 AH |
| Persian (Solar Hijri) | Solar | 622 CE (the Hijra) | ~1405 AP |
| Hebrew | Lunisolar | Traditional creation | ~5786 AM |
| Buddhist (Thai) | Solar | 543 BCE (Buddha's death) | 2569 BE |
| Minguo (Taiwan) | Solar | 1912 CE (ROC founding) | 115 |

Note the two that run *behind* Gregorian for a different reason — Buddhist (Thai) adds 543 because it
counts from earlier, and Minguo subtracts 1911 because it counts from later.

## The Julian calendar: a 13-day ghost

One calendar difference is subtler and still causes confusion in historical dates. The **Julian
calendar**, used across the West until 1582, made every fourth year a leap year — no exceptions. That
slightly overcounts: it adds three leap days too many every 400 years. By 1582 the calendar had
drifted ten days out of step with the seasons, so the **Gregorian reform** skipped ten days outright
(Thursday 4 October 1582 was followed by Friday 15 October) and added the rule that century years are
leap years only if divisible by 400.

Because not every country adopted the reform at once — Britain waited until 1752, by which point the
gap was eleven days — historical dates are genuinely ambiguous. A letter "dated 1 March 1700" means
different actual days depending on whether the writer used the Julian or Gregorian calendar. Today the
two are **13 days apart**, and the [Julian converter](/calendar/julian-date-converter/) handles both
the calendar and the separate astronomical *Julian Day Number*.

## Converting between them — accurately, and privately

Calendar conversion is deterministic maths, but it's fiddly maths that's easy to get wrong by hand —
leap months, variable month lengths, drifting epochs. The good news is that your browser already
contains the authoritative answer: modern browsers ship the **ICU/CLDR calendar database**, the same
data operating systems use, covering all these systems. The tools in the
[Calendars category](/calendar/) read that data directly, so:

- The [calendar converter](/calendar/calendar-converter/) shows any Gregorian date across every
  system at once, and converts the fixed-month calendars back.
- The [Hijri converter](/calendar/hijri-date-converter/) and
  [Persian converter](/calendar/persian-calendar-converter/) do both directions for those calendars.
- Everything runs **on your device** — no date you enter is uploaded, and it all works offline.

One honest caveat for the Islamic calendar: the tools give the **Umm al-Qura** civil date, calculated
in advance. Religious dates — Ramadan, the two Eids — are traditionally fixed by the actual sighting
of the crescent moon and can fall a day either side of the civil date, varying by country. Use the
converter for civil and administrative dates, and defer to local announcements for observances.

## Common calendar-conversion mistakes

1. **Confusing the Islamic and Persian calendars** — both count from 622 CE, but one is lunar
   (~1447) and one solar (~1404); they are not the same calendar.
2. **Treating a calculated Hijri date as the religious date** — Ramadan and Eid depend on moon
   sighting and can differ by a day.
3. **Reading old dates without checking the calendar** — pre-1918 Russian or pre-1752 British dates
   may be Julian, 11–13 days off the Gregorian equivalent.
4. **Assuming leap rules transfer** — the Gregorian century-year exception doesn't exist in the
   Julian calendar, which is why they disagree on 1700, 1800 and 1900.
5. **Expecting a Hebrew or Chinese month to be a simple number** — their leap months make month
   numbering vary year to year.

## Quick summary

The world's calendars differ on two axes: **what they count from** (each has its own epoch) and **how
they measure the year** (lunar, solar or lunisolar). That's why the same day is 2026, 1447, 1404,
5786 and 2569 at once. Lunar calendars like the Islamic one drift against the seasons; solar ones
like the Persian and Gregorian stay fixed; lunisolar ones like the Hebrew add leap months to bridge
the two. Convert any date across all of them — and back — in the
[calendar converter](/calendar/calendar-converter/), computed locally from your browser's own
calendar data.

*Related tools: [Hijri converter](/calendar/hijri-date-converter/) ·
[Persian converter](/calendar/persian-calendar-converter/) ·
[Hebrew converter](/calendar/hebrew-calendar-converter/) ·
[leap year calculator](/calendar/leap-year-calculator/). Conversions use the
[Unicode CLDR](https://cldr.unicode.org/) calendar data built into modern browsers.*
