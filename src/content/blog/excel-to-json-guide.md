---
title: "How to Convert Excel to JSON (in Your Browser)"
seoTitle: 'Convert Excel to JSON (in Your Browser)'
description: "To convert Excel to JSON, the first row becomes the field names and each row becomes an object, an array of objects. Done locally, never uploaded."
pubDate: 2026-07-28
updatedDate: 2026-07-28
archetype: how-to
tools: ["/file/excel-to-json/"]
keywords:
  - how to convert Excel to JSON
  - excel to json
  - xlsx to json
  - convert spreadsheet to json
  - excel to json converter
  - xls to json
heroImage: /blog/excel-to-json-guide.png
heroAlt: "How to convert an Excel spreadsheet to a JSON array of objects in the browser"
faqs:
  - q: "How do I convert Excel to JSON?"
    a: "Open your .xlsx or .xls file in the Excel to JSON converter, pick the sheet you want, and it reads the first row as field names and turns every following row into a JSON object, giving you an array of objects. It runs in your browser using SheetJS, so nothing is uploaded."
  - q: "How are the JSON keys chosen?"
    a: "From the first row of the sheet you select. Each header cell becomes a key, and each later row becomes one object mapping those keys to its cell values. That is why a clear header row like name, age produces readable keys."
  - q: "Do numbers stay numbers?"
    a: "Yes. Where the spreadsheet stored a cell as a number or a boolean, it is emitted as a JSON number or boolean, not a quoted string. Text cells become JSON strings. So 36 stays 36 and TRUE stays true."
  - q: "What about multiple sheets?"
    a: "If the workbook has several sheets you choose which one to convert, because a JSON result is a single array. Convert one sheet, then switch and convert another if you need each as its own array."
  - q: "What if there is no header row?"
    a: "Then the first data row is treated as the field names, so your keys will be actual values instead of labels. Add a header row at the top of the sheet first to get meaningful field names."
  - q: "Is my file uploaded?"
    a: "No. Parsing happens entirely in your browser with SheetJS, so an internal or customer spreadsheet never touches a server. You can even use it offline once the page has loaded."
draft: false
---

**To convert Excel to JSON, treat the first row of your sheet as the field names and turn every following row into an object, the result is an array of objects.** The [Excel to JSON converter](/file/excel-to-json/) does exactly this in your browser: it reads your `.xlsx` or `.xls` with SheetJS, uses row one as the keys, and maps each later row's cells to those keys. JSON is what most APIs, config files and JavaScript expect, so turning a spreadsheet of data into a JSON array is one of the most common developer chores, and here it happens locally, so the file is never uploaded.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>First row = keys.</strong> Each following row becomes one JSON object → an array of objects</li>
<li><strong>Types are kept:</strong> numbers stay numbers, booleans stay booleans, text becomes strings</li>
<li><strong>Multiple sheets?</strong> You pick which one to convert, JSON output is a single array</li>
<li><strong>No header row</strong> means your first data row becomes the keys, so add one</li>
<li><strong>Nothing is uploaded</strong>, SheetJS parses the workbook in your browser</li>
</ul>
</aside>

<figure>
<img src="/blog/infographic-excel-json.svg" alt="Infographic showing a two-column spreadsheet with a highlighted header row of name and age converting into a JSON array of two objects, one for Ada aged 36 and one for Grace aged 45" width="1200" height="700" loading="lazy" />
<figcaption>The whole idea in one picture: the header row becomes the keys, each row becomes an object.</figcaption>
</figure>

## How Excel maps to JSON

The mental model is simple. Take a tiny two-column sheet:

| name  | age |
|-------|-----|
| Ada   | 36  |
| Grace | 45  |

Row one holds the field names `name` and `age`. Each of the two data rows becomes one object, mapping those names to its cell values. The converter emits an array containing those objects:

```json
[
  { "name": "Ada", "age": 36 },
  { "name": "Grace", "age": 45 }
]
```

That is the entire transformation. Two data rows in, two objects out, wrapped in an array. Ten thousand rows work the same way, one object per row, every object sharing the keys from row one. Because the field names come straight from your header cells, a well-labelled top row is the single biggest thing you control: `first_name` produces `"first_name"`, `Col1` produces `"Col1"`.

## Types: numbers, booleans and text

JSON distinguishes `36` (a number) from `"36"` (a string), and downstream code cares about the difference. You can add numbers but not numeric strings, and `if (row.active)` behaves differently for `false` versus `"false"`.

The converter respects what the spreadsheet stored. Where a cell holds a genuine number or a boolean, it is emitted as a JSON number or boolean rather than a quoted string; text cells become strings. So in the example above `age` comes out as `36`, not `"36"`. A `TRUE`/`FALSE` cell that Excel treats as a boolean lands as `true`/`false`.

The catch is that "looks like a number" is not the same as "stored as a number." A value typed into a cell formatted as **Text**, or a code with a leading zero like `007`, is stored as text, so it stays a string. If you need a column typed a certain way, set the cell type in Excel before converting rather than expecting the converter to guess.

## Multiple sheets and missing headers

A JSON document here is one array, so when a workbook has several sheets you choose which one to convert. Need three sheets as three arrays? Convert them one at a time, switching the sheet selection between runs. There is no silent merge of tabs. You always know which sheet produced the output.

The other thing to check is the header row. The converter always takes the **first row of the chosen sheet** as the keys. If your sheet jumps straight into data with no labels, that first data row is consumed as the field names, and you end up with keys like `"Ada"` and `"36"` instead of `"name"` and `"age"`. The fix is to insert a proper header row at the top of the sheet before converting.

## When to use JSON vs CSV

JSON and CSV both carry tabular data, but they suit different destinations:

- **Reach for JSON** when the data feeds an API request or response, a config file, a JavaScript or TypeScript app, or anything with nesting and real types. Objects are self-describing, each value sits next to its key.
- **Reach for CSV** when the target is a spreadsheet, a database bulk-import, or a colleague who lives in Excel. CSV is lighter and universally openable, but it is flat and everything is text until something parses it.

If CSV is what you actually need from the same workbook, use the [Excel to CSV converter](/file/excel-to-csv/) instead. And if your data already lives in a `.csv` file rather than a workbook, [CSV to JSON](/file/csv-to-json/) is the more direct route.

## Common mistakes

A few recurring snags, all easy to avoid once you know them:

1. **No header row.** The first row is always the keys. Without labels, your data's first row becomes the keys, add a header row.
2. **Expecting formulas or formatting to carry over.** JSON stores values, not spreadsheet machinery. A formula contributes its computed result; cell colours, fonts, currency symbols and conditional formatting do not travel.
3. **Merged cells.** A merged block holds its value in one underlying cell and leaves the others empty, so merged headers or labels rarely map cleanly. Unmerge before converting.
4. **Assuming every value is a string.** Numbers and booleans come out typed. If you were counting on `"36"` and got `36`, that is by design, convert on your side if you truly want strings.
5. **Blank rows and stray columns.** Empty rows below your data, or a stray note in a far-off column, can widen the shape unexpectedly. Trim the sheet to just the table you mean to export.

## Convert your spreadsheet, privately

Converting Excel to JSON is mechanical once the rule is clear: row one names the fields, every row after it becomes an object, and types survive the trip. The [Excel to JSON converter](/file/excel-to-json/) applies all of that with SheetJS running entirely in your browser, pick a sheet, get a clean array of objects, and copy or download the result. Because the parsing is local, an internal report or a customer dataset stays on your machine and never touches a server.

*Related: [Excel to CSV](/file/excel-to-csv/) for the same workbook as CSV · [CSV to JSON](/file/csv-to-json/) if your data is already CSV.*
