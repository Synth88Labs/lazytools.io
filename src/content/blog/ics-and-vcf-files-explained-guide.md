---
title: "How .ics and .vcf Files Work: Calendar Events and Contacts Explained"
seoTitle: 'How .ics and .vcf Files Work: Calendar & Contacts'
description: ".ics and .vcf files are the plain text behind calendar events and contacts — how iCalendar and vCard work, the all-day end-date gotcha, done in your browser."
pubDate: 2026-08-02
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/ics-and-vcf-files-explained-guide.png
heroAlt: "How an .ics calendar event and a .vcf contact file are structured, and how vCards convert to a CSV table"
tools: ["/generate/ics-calendar-event-generator/", "/file/vcf-to-csv/", "/file/csv-to-vcf/"]
keywords:
  - what is an ics file
  - how to create an ics file
  - add to calendar link
  - what is a vcf file
  - vcf to csv
  - csv to vcf
  - vcard file
faqs:
  - q: "What is an .ics file?"
    a: "An .ics file is a plain-text iCalendar file (defined by RFC 5545) that describes a calendar event — its title, start and end time, location, description and any repeat rule. It's the universal 'add to calendar' format that Apple Calendar, Google Calendar and Outlook all understand, and it's the attachment behind those 'Add to Calendar' buttons in event emails."
  - q: "How do I create an .ics file?"
    a: "Write the event fields into the iCalendar structure (BEGIN:VEVENT … END:VEVENT), escaping special characters and formatting the dates correctly, then save it with a .ics extension. The LazyTools ICS Calendar Event Generator does this from a simple form in your browser — fill in the details and download the .ics."
  - q: "What is a .vcf file?"
    a: "A .vcf file is a vCard (RFC 6350) — a plain-text contact card holding a person's name, emails, phone numbers, organization and more. It's the standard export/import format for address books, so iPhone, Android, Outlook and Google Contacts can all read each other's .vcf files. One .vcf can hold a single contact or hundreds."
  - q: "How do I convert a VCF file to CSV (or CSV to VCF)?"
    a: "To read contacts in a spreadsheet, convert the .vcf to CSV — each vCard becomes a row with name, email and phone columns. To import a spreadsheet into a phone, convert the CSV back to .vcf — each row becomes a vCard. The LazyTools VCF↔CSV converters do both in your browser, without uploading your address book."
  - q: "Why is the all-day event end date one day later than I expect in an .ics?"
    a: "Because iCalendar's all-day DTEND is exclusive — it marks the day after the event ends. A one-day event on June 25 is written as DTSTART 20250625 and DTEND 20250626. Forgetting this off-by-one is a classic .ics bug; a good generator adds the extra day for you."
  - q: "Are these calendar and contact files processed privately?"
    a: "With the LazyTools tools, yes — the .ics generator and the VCF↔CSV converters all run entirely in your browser. Event details (including private meeting links) and contact lists (other people's personal data) never leave your device, and the tools work offline."
draft: false
---

**Two plain-text formats sit behind everyday actions you never think about: `.ics` is the file behind
every "Add to Calendar" button, and `.vcf` (vCard) is the file behind every saved contact.** Both are
just text — but both have quirks that trip people up: escaping, line-folding, and iCalendar's
notorious *exclusive* all-day end date. Here's how each works, with a browser-based
[ICS generator](/generate/ics-calendar-event-generator/) and
[VCF↔CSV converters](/file/vcf-to-csv/) that keep your data on your device.

<aside class="key-takeaways">

**Key takeaways**

- An `.ics` file is an [iCalendar](https://en.wikipedia.org/wiki/ICalendar) event (RFC 5545); a `.vcf` file is a [vCard](https://en.wikipedia.org/wiki/VCard) contact (RFC 6350). Both are plain UTF-8 text that every major calendar and address-book app can read.
- Three things break hand-written `.ics` files: unescaped special characters, lines longer than 75 octets that aren't folded, and the all-day `DTEND` being *exclusive* (the day after the event ends).
- vCards and CSVs carry the same contact fields in different layouts, so converting between them is the standard way to move address books between phones, spreadsheets and CRMs.
- Because both formats hold private data — meeting links, home addresses, other people's phone numbers — generating and converting them in your browser keeps that data off anyone else's server.

</aside>

## The .ics calendar file

Open one and you'll see a nested, line-based structure:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LazyTools//ICS Generator//EN
BEGIN:VEVENT
UID:abc123@lazytools.io
DTSTAMP:20240101T000000Z
DTSTART:20240603T093000
DTEND:20240603T103000
SUMMARY:Team Sync
LOCATION:Room 4
RRULE:FREQ=WEEKLY;COUNT=5
END:VEVENT
END:VCALENDAR
```

An event is a `VEVENT` block with a start (`DTSTART`), usually an end (`DTEND`), a `SUMMARY` (the
title), and optional `LOCATION`, `DESCRIPTION` and a repeat rule (`RRULE`). Save that as `.ics` and any
calendar app offers to add it. The wrapping `VCALENDAR` container carries the `VERSION` (always `2.0`
for iCalendar) and a `PRODID` that names the software that wrote the file.

Here are the fields you'll meet most often:

| Property  | What it holds                          | Example                          |
|-----------|----------------------------------------|----------------------------------|
| `UID`     | A unique ID so updates replace, not duplicate | `abc123@lazytools.io`     |
| `DTSTAMP` | When the file was created (UTC)        | `20240101T000000Z`               |
| `DTSTART` | Event start                            | `20240603T093000`                |
| `DTEND`   | Event end (exclusive for all-day)      | `20240603T103000`                |
| `SUMMARY` | The event title                        | `Team Sync`                      |
| `LOCATION`| Where it happens                       | `Room 4`                         |
| `RRULE`   | Repeat pattern                         | `FREQ=WEEKLY;COUNT=5`            |

A few subtleties are worth knowing. A time like `20240603T093000` with no trailing `Z` is *floating*
local time — it happens at 9:30 on whatever clock the viewer's device shows. Append `Z`
(`20240603T093000Z`) and it's fixed to UTC; add a `TZID` parameter and it's pinned to a named zone.
The `RRULE` in the example above (`FREQ=WEEKLY;COUNT=5`) produces five weekly occurrences; swap `COUNT`
for `UNTIL=20240930T000000Z` to repeat until a date instead.

### The three things hand-writing gets wrong

- **Text escaping.** Commas, semicolons and backslashes are structural in iCalendar, so a title like
  `Lunch, then demo` must be written `Lunch\, then demo`. Line breaks become `\n`.
- **Line folding.** Lines longer than 75 octets must be wrapped onto continuation lines that start with
  a space. Skip this and strict parsers reject the file.
- **The exclusive all-day end.** For an all-day event, `DTEND` is the day *after* it ends. A single day
  on June 25 is `DTSTART;VALUE=DATE:20250625` and `DTEND;VALUE=DATE:20250626`. This off-by-one is the
  single most common `.ics` bug.

The [ICS generator](/generate/ics-calendar-event-generator/) handles all three automatically.

<figure class="my-8">
<svg viewBox="0 0 1200 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An ICS VEVENT block and a vCard, with vCards converting to a CSV table" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="32" font-weight="800" fill="#0f172a">The two files behind “add to calendar” &amp; “save contact”</text>

  <!-- ICS -->
  <rect x="60" y="80" width="510" height="350" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="315" y="118" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" font-weight="800" fill="#1e40af">.ics — calendar event</text>
  <text x="90" y="162" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">BEGIN:VEVENT</text>
  <text x="90" y="192" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">DTSTART:20240603T093000</text>
  <text x="90" y="222" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">SUMMARY:Lunch\, then demo</text>
  <text x="90" y="252" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">RRULE:FREQ=WEEKLY;COUNT=5</text>
  <text x="90" y="282" font-family="ui-monospace,monospace" font-size="19" fill="#1e3a8a">END:VEVENT</text>
  <text x="90" y="345" font-family="system-ui,sans-serif" font-size="17" fill="#3b82f6">escape , ; \  ·  fold &gt;75 chars</text>
  <text x="90" y="375" font-family="system-ui,sans-serif" font-size="17" fill="#3b82f6">all-day DTEND = next day (exclusive)</text>

  <!-- vCard + CSV -->
  <rect x="630" y="80" width="510" height="165" rx="14" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
  <text x="885" y="118" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" font-weight="800" fill="#047857">.vcf — contact card</text>
  <text x="660" y="158" font-family="ui-monospace,monospace" font-size="19" fill="#065f46">BEGIN:VCARD</text>
  <text x="660" y="186" font-family="ui-monospace,monospace" font-size="19" fill="#065f46">FN:Ada Lovelace</text>
  <text x="660" y="214" font-family="ui-monospace,monospace" font-size="19" fill="#065f46">EMAIL:ada@example.com</text>

  <text x="885" y="288" text-anchor="middle" font-family="system-ui,sans-serif" font-size="26" fill="#94a3b8">↕ convert</text>

  <rect x="630" y="310" width="510" height="120" rx="14" fill="#fff7ed" stroke="#f59e0b" stroke-width="3"/>
  <text x="885" y="346" text-anchor="middle" font-family="ui-monospace,monospace" font-size="22" font-weight="800" fill="#b45309">.csv — spreadsheet</text>
  <text x="660" y="384" font-family="ui-monospace,monospace" font-size="18" fill="#92400e">Full Name,Email,Phone</text>
  <text x="660" y="410" font-family="ui-monospace,monospace" font-size="18" fill="#92400e">Ada Lovelace,ada@example.com,…</text>
</svg>
</figure>

## The .vcf contact file

A vCard is even simpler — a `BEGIN:VCARD … END:VCARD` block per person:

```
BEGIN:VCARD
VERSION:3.0
FN:Ada Lovelace
N:Lovelace;Ada;;;
EMAIL;TYPE=INTERNET:ada@example.com
TEL;TYPE=CELL:+1-555-0100
END:VCARD
```

`FN` is the display name; `N` is the *structured* name (`Last;First;Middle;Prefix;Suffix`); `EMAIL` and
`TEL` can repeat with type parameters. One `.vcf` file can hold one contact or your entire address
book, stacked block after block.

Two version numbers dominate in the wild. vCard 3.0 (RFC 2426) is what most phones export today and is
the safest for broad compatibility; vCard 4.0 (RFC 6350) is the current standard and adds cleaner
handling of things like time zones and multiple addresses. The `TYPE` parameter labels each value —
`TEL;TYPE=CELL`, `EMAIL;TYPE=WORK`, `ADR;TYPE=HOME` — so an app knows which number is the mobile and
which address is home. Common properties beyond name and contact details include `ORG` (organization),
`TITLE` (job title), `ADR` (a structured postal address), `BDAY` (birthday), `URL` and `NOTE`.

The two formats are close cousins — both descend from the same 1990s vCard/vCalendar lineage, so they
share the escaping and line-folding rules while describing very different things:

| Aspect        | `.ics` (iCalendar)              | `.vcf` (vCard)                   |
|---------------|---------------------------------|----------------------------------|
| Standard      | RFC 5545                        | RFC 6350 (v4), RFC 2426 (v3)     |
| Describes     | Calendar events, to-dos        | People and organizations         |
| Top container | `BEGIN:VCALENDAR`               | `BEGIN:VCARD`                    |
| Repeats as    | `VEVENT` blocks                 | `VCARD` blocks                   |
| Common apps   | Apple/Google Calendar, Outlook  | iPhone, Android, Google Contacts |
| Classic gotcha| Exclusive all-day `DTEND`       | `FN` vs structured `N` mismatch  |

### VCF ↔ CSV: contact migration

Phones and address books speak `.vcf`; spreadsheets and many CRMs speak CSV. Moving between them is the
core of contact migration:

- **[VCF → CSV](/file/vcf-to-csv/)** turns each vCard into a spreadsheet row (name, email, phone,
  organization) — for editing, deduping or importing into a CRM.
- **[CSV → VCF](/file/csv-to-vcf/)** turns each row back into a vCard — to load a spreadsheet of
  contacts onto a phone or into Outlook/Google Contacts.

The conversion has to unfold wrapped lines, decode vCard escaping, and quote CSV values with commas —
the same class of details as the `.ics` format.

## Why do this in the browser

Both file types are *personal*. An `.ics` can contain a private meeting link or your home address; a
`.vcf` contains other people's names, numbers and emails — data you have a duty to handle carefully.
Uploading either to a random converter hands that data to a stranger. Every LazyTools tool here builds
and converts the files **in your browser**, so they never leave your device and work offline.

## The bottom line

`.ics` and `.vcf` are simple text formats with sharp edges: escape the special characters, fold long
lines, and remember the all-day end date is exclusive. Generate calendar events with the
[ICS generator](/generate/ics-calendar-event-generator/) and migrate contacts with the
[VCF→CSV](/file/vcf-to-csv/) and [CSV→VCF](/file/csv-to-vcf/) converters — all locally, because event
and contact data is exactly the kind you shouldn't hand to someone else's server.
