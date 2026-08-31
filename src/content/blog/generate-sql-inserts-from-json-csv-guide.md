---
title: "How to Generate SQL INSERTs from JSON or CSV (Safely)"
seoTitle: 'JSON & CSV to SQL INSERTs: Generate Them Safely'
description: "Convert JSON or CSV to SQL INSERTs correctly: type each value, escape single quotes by doubling, and parse CSV per RFC 4180, all in your browser."
pubDate: 2026-08-01
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/generate-sql-inserts-from-json-csv-guide.png
heroAlt: "JSON and CSV data converting to SQL INSERT statements with typed, escaped values"
tools: ["/dev/json-to-sql/", "/dev/csv-to-sql/", "/dev/sql-in-clause-generator/"]
keywords:
  - json to sql
  - csv to sql
  - generate sql insert
  - sql in clause generator
  - convert data to sql
  - sql escape single quote
  - bulk insert from csv
faqs:
  - q: "How do I generate SQL INSERT statements from JSON or CSV?"
    a: "Map the structure to columns and rows: for JSON, each object's keys are the columns and each object is a row; for CSV, the header row is the columns and each line is a row. Then type and escape each value, numbers and booleans as literals, empty/null as NULL, and strings single-quoted with embedded quotes doubled. The LazyTools JSON to SQL and CSV to SQL converters do this in your browser."
  - q: "How do I escape a single quote in a SQL string?"
    a: "Double it. A value like O'Brien becomes 'O''Brien', the two single quotes inside the literal represent one literal apostrophe. This is standard ANSI SQL and works in PostgreSQL, MySQL and SQLite. Getting it wrong is the most common cause of broken generated INSERTs (and of SQL injection when values aren't parameterised)."
  - q: "Should generated INSERTs be one multi-row statement or one per row?"
    a: "A single multi-row INSERT (INSERT ... VALUES (…),(…),(…);) is more efficient for bulk loading and is the default. One statement per row is easier to diff, comment out, or run selectively. Both are valid, the converters let you choose."
  - q: "How do I build a SQL IN clause from a list?"
    a: "Wrap the comma-joined values in parentheses: WHERE id IN (1, 2, 3) for numbers, or IN ('a', 'b') for strings with each value single-quoted. The LazyTools SQL IN Clause Generator takes a pasted list (one per line or comma-separated) and quotes numbers and strings correctly."
  - q: "Are generated INSERT statements safe from SQL injection?"
    a: "The converters escape single quotes so a stray apostrophe won't break or hijack the statement, which makes generated scripts safe to run on data you control. But for application code handling untrusted input, always use parameterised queries or prepared statements rather than building SQL by string concatenation, generation tools are for migrations, seeding and one-off imports, not runtime queries."
  - q: "Is my data uploaded when converting to SQL?"
    a: "Not with the LazyTools converters. JSON to SQL, CSV to SQL and the IN clause generator all run entirely in your browser, so database exports and dumps never leave your device, and they work offline."
draft: false
---

**Turning JSON or CSV into SQL `INSERT` statements is a mechanical mapping, object/row → row,
key/header → column, but two details decide whether the result runs or blows up: typing each value
correctly, and escaping single quotes in strings.** Get those right and you can bulk-load a JSON dump
or a spreadsheet in seconds. The [JSON to SQL](/dev/json-to-sql/) and [CSV to SQL](/dev/csv-to-sql/)
converters handle both in your browser, and the [SQL IN Clause Generator](/dev/sql-in-clause-generator/)
covers the related "paste a list into a `WHERE`" case.

<aside class="key-takeaways">

**Key takeaways**

- JSON keys (or CSV headers) become columns; each object (or CSV line) becomes a row, the mapping itself is trivial.
- The two rules that decide whether the script runs: type every value (numbers and booleans bare, empty/`null` as `NULL`, everything else single-quoted) and escape embedded single quotes by doubling them (`''`).
- CSV adds a parsing trap, commas and newlines *inside* quoted fields, so a correct converter follows RFC 4180 instead of naive `split(',')`.
- Generated `INSERT`s are for migrations, seeding, and one-off imports; for untrusted runtime input use parameterised queries, never string-built SQL.
- LazyTools' converters run entirely client-side, so pasted database dumps never leave your browser and work offline.

</aside>

## The mapping

Both formats describe rows of data; only the column source differs:

| | Columns come from | Each row is |
|---|---|---|
| **JSON** | the union of the objects' keys | one object in the array |
| **CSV** | the header (first) row | each subsequent line |

So `[{"id":1,"name":"Ada"}]` and `id,name` + `1,Ada` both become:

```sql
INSERT INTO my_table (id, name) VALUES
(1, 'Ada');
```

## Where it actually breaks: typing and escaping

The mapping is the easy part. These two rules are what a naive converter gets wrong.

**1. Type each value.** SQL literals aren't all quoted:

- Numbers → bare: `42`, `3.5`
- Booleans → `TRUE` / `FALSE`
- Empty / null → `NULL`
- Everything else → a single-quoted string

**2. Escape single quotes by doubling them.** This is the one that bites everyone:

```sql
-- WRONG, the apostrophe ends the string early, breaking the statement:
INSERT INTO t (name) VALUES ('O'Brien');

-- RIGHT, double the quote inside the literal:
INSERT INTO t (name) VALUES ('O''Brien');
```

That doubling (`''` = one literal `'`) is standard ANSI SQL and works in PostgreSQL, MySQL and SQLite.
It's also the difference between a script that imports cleanly and one that fails halfway, or, with
untrusted input, a SQL injection.

Here is the full typing decision, from source value to the literal that lands in the statement:

| Source value | SQL literal | Note |
|---|---|---|
| `42`, `3.5`, `-7` | `42`, `3.5`, `-7` | Numeric, no quotes |
| `true` / `false` (JSON boolean) | `TRUE` / `FALSE` | Postgres native; MySQL maps to `1`/`0` |
| `null` (JSON) or empty CSV cell | `NULL` | Not the string `'NULL'` and not `''` |
| `"Ada"` | `'Ada'` | Ordinary string, single-quoted |
| `"O'Brien"` | `'O''Brien'` | Embedded quote doubled |
| `"line1\nline2"` | `'line1\nline2'` | Newline kept inside the literal |

Two subtleties worth calling out. First, `NULL` and the empty string `''` are *not* the same in SQL:
a genuinely missing value should become `NULL`, while a deliberately blank text field stays `''`. If
your source can't distinguish them, decide the rule up front. Second, boolean handling is dialect
dependent, PostgreSQL accepts `TRUE`/`FALSE` literally, whereas older MySQL treats them as aliases for
`1`/`0`, so the safest portable output for a boolean column is often just `1` or `0`.

<figure class="my-8">
<svg viewBox="0 0 1200 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JSON and CSV both map to INSERT statements; values are typed and single quotes are doubled" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="54" text-anchor="middle" font-family="system-ui,sans-serif" font-size="36" font-weight="800" fill="#0f172a">Data → typed, escaped INSERT</text>

  <rect x="60" y="100" width="300" height="120" rx="14" fill="#eff6ff" stroke="#2563eb" stroke-width="3"/>
  <text x="210" y="150" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" font-weight="800" fill="#1e40af">JSON objects</text>
  <text x="210" y="186" text-anchor="middle" font-family="ui-monospace,monospace" font-size="20" fill="#1e40af">keys → columns</text>

  <rect x="60" y="260" width="300" height="120" rx="14" fill="#f0fdf4" stroke="#16a34a" stroke-width="3"/>
  <text x="210" y="310" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" font-weight="800" fill="#15803d">CSV rows</text>
  <text x="210" y="346" text-anchor="middle" font-family="ui-monospace,monospace" font-size="20" fill="#15803d">header → columns</text>

  <text x="405" y="245" text-anchor="middle" font-family="system-ui,sans-serif" font-size="40" fill="#94a3b8">→</text>

  <rect x="470" y="120" width="670" height="240" rx="16" fill="#0f172a"/>
  <text x="500" y="170" font-family="ui-monospace,monospace" font-size="22" fill="#e2e8f0">INSERT INTO t (id, name, active)</text>
  <text x="500" y="205" font-family="ui-monospace,monospace" font-size="22" fill="#e2e8f0">VALUES</text>
  <text x="520" y="245" font-family="ui-monospace,monospace" font-size="22" fill="#7dd3fc">(1, 'Ada', TRUE),</text>
  <text x="520" y="285" font-family="ui-monospace,monospace" font-size="22" fill="#7dd3fc">(2, 'O''Brien', FALSE);</text>
  <text x="500" y="330" font-family="ui-monospace,monospace" font-size="18" fill="#fca5a5">numbers bare · bool TRUE/FALSE · '' escapes the quote</text>
</svg>
</figure>

## CSV has an extra trap: parsing

A spreadsheet value like `"Bo, Jr"` contains a comma *inside* a field. Splitting on every comma shifts
all your columns and corrupts the import. A correct converter uses an [RFC 4180](https://datatracker.ietf.org/doc/html/rfc4180) parser that respects
quoted fields, escaped quotes (`""`), and even newlines inside quotes, so `"Bo, Jr"` stays one value.
That's why [CSV to SQL](/dev/csv-to-sql/) parses properly rather than `split(',')`, and why it also
lets you pick a delimiter for semicolon (European) or tab-separated data.

## A worked example, end to end

Take this small JSON export, which deliberately hits every tricky case, a number, a boolean, an
apostrophe, a genuine null, and a blank string:

```json
[
  {"id": 1, "name": "Ada",     "active": true,  "notes": "founder"},
  {"id": 2, "name": "O'Brien", "active": false, "notes": null},
  {"id": 3, "name": "Bo, Jr",  "active": true,  "notes": ""}
]
```

Applying the mapping and the two rules produces:

```sql
INSERT INTO users (id, name, active, notes) VALUES
(1, 'Ada', TRUE, 'founder'),
(2, 'O''Brien', FALSE, NULL),
(3, 'Bo, Jr', TRUE, '');
```

Notice what each row demonstrates: row 1 quotes strings but leaves the number and boolean bare; row 2
doubles the apostrophe in `O''Brien` and turns JSON `null` into the keyword `NULL` (unquoted); row 3
keeps the comma inside `'Bo, Jr'` as data and preserves the empty string as `''` rather than collapsing
it to `NULL`. Feed the identical data in CSV form (`id,name,active,notes` as the header) and you get the
same statement, only the column source changes.

## One row per statement, or one big INSERT?

Two valid shapes, and it's a real choice:

- **Multi-row** (`VALUES (…),(…),(…);`), fewer statements, faster bulk loads. The default.
- **One INSERT per row**, easier to diff in version control, comment out, or run selectively.

For very large loads there is a practical ceiling: a single multi-row statement can bump into engine
limits, MySQL's `max_allowed_packet`, for instance, so tens of thousands of rows are usually split
into batches of a few hundred to a few thousand rows each. That keeps every statement well under the
limit while still avoiding the per-statement overhead of one `INSERT` per row. If you are loading
millions of rows, a purpose-built path such as PostgreSQL's `COPY` or MySQL's `LOAD DATA` will beat any
generated `INSERT` script; the converters here are aimed at the small-to-medium seed, migration, and
fixture files that make up the vast majority of day-to-day jobs.

## The related case: a SQL IN clause

Sometimes you don't need INSERTs. You have a *list* and need `WHERE col IN (...)`. Same escaping
rules apply: numbers stay bare, strings get quoted. Pasting a column of IDs from a spreadsheet and
hand-adding quotes and commas is exactly the tedious, error-prone job the
[SQL IN Clause Generator](/dev/sql-in-clause-generator/) removes. It auto-detects numbers vs strings
and builds the parenthesised list for you.

## A word on safety

Escaping quotes makes these generated scripts safe to run on data *you control*, migrations, seed
data, one-off imports. It is **not** a substitute for parameterised queries in application code: when
you're handling untrusted user input at runtime, use prepared statements, not string-built SQL. These
converters are build-time tools, and, because they run entirely in your browser, the database dumps
and exports you paste never leave your device.

## The bottom line

Generating SQL from JSON or CSV is a mapping plus two rules: type every value (numbers and booleans
bare, empty as `NULL`, the rest quoted) and escape single quotes by doubling them. Parse CSV properly
so commas inside fields don't shift columns, pick multi-row or per-row to taste, and reach for an IN
clause generator when you just need a list, all locally, with the
[JSON to SQL](/dev/json-to-sql/), [CSV to SQL](/dev/csv-to-sql/) and
[IN clause](/dev/sql-in-clause-generator/) tools.
