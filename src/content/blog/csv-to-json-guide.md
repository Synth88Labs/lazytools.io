---
title: "CSV to JSON Without the Traps: Quotes, Commas, Semicolons and Typed Values"
description: "Converting CSV to JSON fails in predictable ways: commas inside quoted fields, semicolon Excel exports, and numbers arriving as strings. How the conversion actually works, both directions, with fixes for every trap."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: how-to
tools: ["/file/csv-to-json/", "/file/json-to-csv/", "/file/csv-to-markdown-table/", "/file/json-formatter/"]
keywords:
  - csv to json
  - convert csv to json
  - csv semicolon delimiter excel
  - csv quoted fields commas
  - json to csv converter
  - csv parsing rfc 4180
  - csv one column problem
  - csv to json typed values
heroImage: /blog/csv-to-json-guide.png
heroAlt: "CSV to JSON conversion guide — quoted fields, delimiters and typed values"
faqs:
  - q: "Why does my CSV convert into one giant column?"
    a: "Wrong delimiter. European-locale Excel exports 'CSV' with semicolons (because the comma is the decimal separator there), so a comma-based parse sees one field per row. Auto-detect fixes it, or pick semicolon explicitly."
  - q: "How do commas inside values survive conversion?"
    a: "Via quoting, per the RFC 4180 convention: fields wrapped in double quotes may contain commas and even newlines, and a doubled quote (\"\") means one literal quote. \"Doe, Jane\" is one field, not two."
  - q: "Should numbers in CSV become JSON numbers or strings?"
    a: "Usually numbers — 42 should be 42, not \"42\" — and good converters type-coerce numbers, booleans and null. The exception: long digit strings like phone numbers and IDs (16+ digits) must stay strings, or floating-point precision silently corrupts them."
  - q: "How do I convert JSON back to CSV?"
    a: "The top level must be an array of objects (or arrays). Headers come from the union of all keys; nested objects embed as JSON strings rather than silently flattening. Pick the semicolon delimiter if the file must open in European Excel."
  - q: "What breaks when opening converted CSV in Excel?"
    a: "Two classics: accented characters garble when pasting (download the file instead — that preserves UTF-8), and everything lands in one column on European locales (use the semicolon delimiter)."
  - q: "Is there a row limit for these conversions?"
    a: "Not here — parsing is local, so large exports convert instantly. Several competing converters cap free use at 1 MB per day; local processing has no reason to."
draft: false
---

**CSV-to-JSON conversion fails in three predictable ways: commas hiding inside quoted fields,
semicolon-delimited "CSV" from European Excel, and numbers arriving as strings.** All three are solved
problems if the converter follows the rules — the [CSV to JSON converter](/file/csv-to-json/) does,
with delimiter auto-detect and typed output, entirely in your browser.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>Quoted fields are the law:</strong> "Doe, Jane" is one value — RFC 4180 quoting, not string-splitting</li>
<li><strong>One-giant-column output = wrong delimiter</strong> — European Excel exports use semicolons</li>
<li><strong>Types matter:</strong> 42 → 42 and true → true, but 16+ digit IDs must stay strings (precision!)</li>
<li><strong>JSON→CSV needs an array</strong> at the top level; headers = union of all keys</li>
<li>Local conversion = no upload, no size caps, no per-day limits</li>
</ul>
</aside>

## How the conversion actually works

CSV looks trivial — values separated by commas — but real CSV follows the **RFC 4180** conventions,
and naive `split(",")` code breaks on the first quoted field:

<figure>
<img src="/blog/infographic-csv-anatomy.svg" alt="Infographic: a CSV row converting to JSON — the header row name,role,active becomes the JSON keys; the quoted field 'Doe, Jane' stays one value because the comma inside quotes is data per RFC 4180; and the value true stays a boolean rather than the string 'true'" width="1200" height="620" loading="lazy" />
<figcaption>One row, three rules: headers become keys, quotes protect commas, values keep their types.</figcaption>
</figure>

The three rules in play:

1. **Headers → keys.** The first row names the fields; every following row becomes one JSON object.
2. **Quotes protect structure.** A field wrapped in `"…"` may contain commas, newlines, and doubled
   quotes (`""` = one literal `"`).
3. **Values keep types.** `42`, `true`, `null` become real JSON numbers, booleans and null — with one
   deliberate exception below.

## Trap 1 — the one-giant-column problem (semicolons)

Paste a "CSV" and get one column? Your file is **semicolon-delimited**. In locales where the comma is
the decimal separator (Germany, France, Spain, Brazil…), Excel writes `1,5` for one-and-a-half — so
its "CSV" export separates fields with `;` instead. The
[converter](/file/csv-to-json/) auto-detects by sampling the first lines; the delimiter dropdown
overrides it for stubborn files (tabs and pipes included — spreadsheet copy-paste arrives
tab-separated).

## Trap 2 — quoted fields and embedded commas

`"Doe, Jane",Engineer,true` is a three-field row. Splitting on commas yields four broken fields — the
signature bug of quick homemade parsers, visible as names bleeding into the wrong columns. Any
converter (or code) touching real-world CSV must implement the quoting rules; the sample data in the
tool demonstrates the case on load.

## Trap 3 — types, and the long-number exception

`"42"` and `42` are different JSON values, and downstream code cares. Good conversion coerces
numbers, `true`/`false` and `null` into real types. **The exception is deliberate:** digit strings of
16+ characters (credit cards, phone numbers, snowflake IDs) stay strings, because JSON numbers ride on
64-bit floats — `9007199254740993` would silently round. If your IDs come back altered by any tool,
this is why.

## Going the other way: JSON → CSV

The [JSON to CSV converter](/file/json-to-csv/) needs an **array** at the top level:

1. `[{...}, {...}]` → header row from the **union of all keys** (records missing a key get empty cells).
2. Values containing the delimiter, quotes or newlines get quoted and escaped automatically.
3. **Nested objects embed as JSON strings** — lossless and reversible. True flattening
   (`address.city` → its own column) changes the data's shape, so it's a decision, not a default.
4. Shipping to European Excel? Choose the semicolon delimiter and **download** the file (downloading
   preserves UTF-8; copy-paste through the clipboard is where accents get garbled).

**Worked example:** a 3-record API response with keys `{id, name, meta:{...}}` converts to a 4-column
CSV (`id, name, meta` + one row each), with `meta` as a JSON string cell — paste it back through
CSV-to-JSON and the structure round-trips.

## The quick-check habit

Before shipping converted data anywhere, two one-click sanity checks: run the JSON through the
[JSON formatter](/file/json-formatter/) (validation with line/column errors), or render the CSV as a
[Markdown table](/file/csv-to-markdown-table/) for a human-readable eyeball of columns landing where
they should.

## Common CSV↔JSON mistakes

1. **Splitting on commas in code** — works until the first `"Doe, Jane"`. Use a real parser.
2. **Ignoring the delimiter question** — semicolon files read as comma produce the one-column mess.
3. **Letting IDs become numbers** — 16-digit IDs corrupt silently; verify they stayed strings.
4. **Expecting automatic flattening** — nested JSON in CSV cells is correct behavior, not a bug.
5. **Copy-pasting into Excel** — accents survive the file route, not always the clipboard route.

## Quick summary

CSV-to-JSON is mechanical once three rules hold: quote-aware parsing (RFC 4180), the right delimiter
(watch for European semicolons), and type coercion with the long-ID exception. The
[CSV to JSON](/file/csv-to-json/) and [JSON to CSV](/file/json-to-csv/) converters implement all of it
with file open/download and no size limits — locally, because business exports shouldn't tour other
people's servers.

*Related: [JSON formatter](/file/json-formatter/) · [CSV to Markdown table](/file/csv-to-markdown-table/) ·
[remove duplicate lines](/text/remove-duplicate-lines/) for pre-cleaning exports.*
