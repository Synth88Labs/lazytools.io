---
title: "Unix Timestamps Explained: Seconds vs Milliseconds, UTC and the Year 2038"
description: "A Unix timestamp counts seconds since 1 January 1970 UTC. How to convert one to a date, tell seconds from milliseconds at a glance (10 vs 13 digits), avoid the 1970-bug, and what actually happens in January 2038."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/time/unix-timestamp-converter/", "/time/timezone-converter/", "/time/days-between-dates/"]
keywords:
  - unix timestamp explained
  - epoch time
  - unix time converter
  - timestamp to date
  - seconds vs milliseconds timestamp
  - year 2038 problem
  - epoch converter
  - utc timestamp
heroImage: /blog/unix-timestamps-guide.png
heroAlt: "Unix timestamps explained — seconds since 1 January 1970 UTC, 10 digits vs 13 digits"
faqs:
  - q: "What is a Unix timestamp?"
    a: "The number of seconds elapsed since 00:00:00 UTC on 1 January 1970 — a moment called the epoch. It's the near-universal machine format for points in time: one integer, no timezone ambiguity, trivially compared and subtracted."
  - q: "How do I tell seconds from milliseconds?"
    a: "Count digits: current Unix time is 10 digits in seconds (about 1.78 billion in mid-2026) and 13 digits in milliseconds. JavaScript's Date.now() returns milliseconds; most Unix tools, databases and APIs use seconds."
  - q: "Why does my timestamp render as January 1970?"
    a: "You passed seconds to something expecting milliseconds (so the value was ~1/1000th of what was intended, landing days after the epoch). The mirror-image bug — milliseconds where seconds were expected — throws the date roughly 50,000 years into the future."
  - q: "Is a Unix timestamp in my timezone?"
    a: "No — it has no timezone at all. It identifies an absolute instant, anchored to UTC. The same timestamp renders as different wall-clock times in different zones; the timezone only enters when you format it for display."
  - q: "What is the year 2038 problem?"
    a: "Systems storing Unix time as a signed 32-bit integer can count only up to 2,147,483,647 — which is 03:14:07 UTC on 19 January 2038. One second later the value overflows to a large negative number, i.e. December 1901. Modern 64-bit time handling is unaffected for billions of years."
  - q: "Does Unix time count leap seconds?"
    a: "No. Every Unix day is exactly 86,400 seconds by definition; when a leap second occurs, Unix time effectively repeats (or smears) a second rather than counting it. For civil purposes this almost never matters — it's a subtlety of precision timekeeping."
  - q: "Can a Unix timestamp be negative?"
    a: "Yes — negative values count backwards from 1970, so they represent earlier dates: −86400 is 31 December 1969. Systems vary in how well they handle negative timestamps, so test before relying on them for historical dates."
draft: false
---

**A Unix timestamp is the number of seconds since 00:00:00 UTC on 1 January 1970 — so `1783238400`
identifies one exact instant worldwide, and the only decoding step is knowing whether your value is
seconds (10 digits) or milliseconds (13 digits).** Paste either into the
[Unix timestamp converter](/time/unix-timestamp-converter/) and it detects the unit and shows the
moment in your local time, UTC and ISO 8601.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>One integer, one instant:</strong> seconds since 1 Jan 1970 UTC (the "epoch"), no timezone attached</li>
<li><strong>10 digits = seconds, 13 digits = milliseconds</strong> — JavaScript uses ms, most everything else uses s</li>
<li><strong>Renders as 1970?</strong> You passed seconds where ms were expected; year ~52,000 means the reverse</li>
<li><strong>Timezones are a display concern</strong> — convert at the edge, store UTC</li>
<li><strong>2038:</strong> signed 32-bit time overflows on 19 Jan 2038 at 03:14:07 UTC; 64-bit systems are fine</li>
</ul>
</aside>

## Why computers count seconds

Human date formats are ambiguous (is 04/07 April or July?), timezone-dependent, and awkward to do
arithmetic on. An integer count of seconds from a fixed starting point has none of those problems:
comparison is `<`, duration is subtraction, and the value means the same instant in Tokyo and Toronto.
The starting point — **the epoch, 00:00:00 UTC on 1 January 1970** — is arbitrary but universal; it
was simply a convenient round date when Unix was young.

Two properties trip people up, and both are features:

- **No timezone.** A timestamp is an absolute instant. "What date is 1783238400?" has no single
  answer until you pick a zone — 08:00 UTC on 5 July 2026 is 09:00 in London (BST) and 13:45 in
  Kathmandu, the same moment. Formatting for a zone is the *display* step, which the
  [timezone converter](/time/timezone-converter/) handles for meetings across regions.
- **No leap seconds.** Every Unix day is exactly 86,400 seconds by definition. Precision timekeeping
  handles leap seconds by repeating or "smearing" a second; ordinary applications never notice.

<figure>
<img src="/blog/infographic-unix-time.svg" alt="Infographic: Unix time as a number line from the 1970 epoch through 1 billion (2001), 1.75 billion (2026, marked as now) to 2,147,483,647 — the signed 32-bit overflow on 19 January 2038; plus the digit-count rule that 10 digits are seconds and 13 digits are milliseconds" width="1200" height="620" loading="lazy" />
<figcaption>One number line from 1970 to the 32-bit cliff — and the digit-count rule that prevents most timestamp bugs.</figcaption>
</figure>

## Seconds vs milliseconds: the 10/13 rule

The single most common timestamp bug is a unit mismatch, and you can catch it by eye:

| Value | Digits | Unit | Meaning |
|---|---|---|---|
| `1783238400` | 10 | seconds | 5 July 2026, 08:00 UTC |
| `1783238400000` | 13 | milliseconds | the same instant |
| `1783238400` fed to a ms API | — | misread | 21 January 1970 — the "1970 bug" |
| `1783238400000` fed to a s API | — | misread | around the year 58,000 |

**JavaScript** (`Date.now()`, `new Date(n)`) speaks milliseconds; **Unix tools, databases, and most
APIs** speak seconds. When a date renders as January 1970, you divided by 1000 implicitly; when it
renders tens of thousands of years out, you multiplied. The
[converter](/time/unix-timestamp-converter/) auto-detects the unit (values above 10¹¹ are treated as
milliseconds — 10¹¹ seconds wouldn't occur until the year 5138) and *tells you which it assumed*, so
the mismatch is visible immediately.

## Converting in both directions

**Timestamp → date:** paste the number; read local time, UTC and ISO 8601. Sanity-check against the
rough decade table: 1.0 billion was 2001, 1.5 billion was 2017, 2.0 billion will be 2033.

**Date → timestamp:** pick the date and time in the converter's second panel; it returns seconds and
milliseconds. In code, the usual sources are `date +%s` (shell), `time.time()` (Python, seconds as a
float) and `Date.now()` (JavaScript, milliseconds).

**Durations:** because timestamps subtract cleanly, "how long between these two events" is one
subtraction — but for *calendar* gaps (working days until a deadline, someone's exact age) calendar
arithmetic is the right tool, not seconds: the
[days between dates calculator](/time/days-between-dates/) and
[age calculator](/time/age-calculator/) do that walk correctly across leap years.

## The year 2038, precisely

Early systems stored Unix time in a **signed 32-bit integer**, whose maximum is 2,147,483,647. That
count of seconds runs out at **03:14:07 UTC on 19 January 2038**; one second later the value wraps
negative, which naive code interprets as 13 December 1901.

The fix has long existed — store time in 64 bits, good for ~292 billion years — and modern operating
systems, languages and databases use it. The residual risk lives in embedded devices, old file
formats and 32-bit fields in legacy protocols. It's the same genre of problem as Y2K: boring where
maintained, sharp where forgotten. (JavaScript, incidentally, was never at risk: its millisecond
count is an IEEE double, exact for ±285,000 years around 1970.)

## Storage advice that prevents whole bug classes

- **Store UTC, display local.** A stored local time changes meaning when DST rules or the user's
  zone change; a stored instant never does. Convert at the display edge — the
  [timezone converter](/time/timezone-converter/) applies each zone's current DST rules from the
  browser's own IANA database.
- **Name the unit in the field.** `created_at_ms` prevents more incidents than any code review.
- **Prefer integers in transit.** ISO 8601 strings are great for humans and logs; timestamps are
  great for math. Pick one per interface and convert deliberately.

## Common timestamp mistakes

1. **Unit mismatch** — the 1970/52,000 bug pair. Count digits: 10 vs 13.
2. **Treating a timestamp as local time** — it's UTC-anchored; the zone belongs to formatting.
3. **Doing calendar math in seconds** — "30 days = 2,592,000 s" breaks on DST boundaries and month
   lengths; use calendar tools for calendar questions.
4. **Comparing timestamps from clocks that disagree** — server A and server B can differ by
   seconds; don't infer event order across machines from raw timestamps alone.
5. **Storing future events as timestamps when the wall-clock matters** — "9:00 local on 1 March"
   should stay a zoned wall-clock time until the moment is fixed; DST rule changes between now and
   then can shift the instant.

## Quick summary

Unix time = seconds since 1 January 1970 UTC: one integer, one instant, no timezone. Ten digits
means seconds, thirteen means milliseconds — mismatching them produces the famous 1970 (or year
52,000) rendering bug. Store UTC and convert for display; do calendar math with calendar tools; and
know that 19 January 2038 only bites systems still counting in signed 32 bits. For any value in
front of you right now, the [Unix timestamp converter](/time/unix-timestamp-converter/) decodes it
locally — nothing you paste leaves your browser.

*Related tools: [date add/subtract](/time/date-add-subtract/) ·
[week number calculator](/time/week-number/) · [age calculator](/time/age-calculator/). Timezone
rules come from the [IANA time zone database](https://www.iana.org/time-zones), which ships inside
every modern browser and OS.*
