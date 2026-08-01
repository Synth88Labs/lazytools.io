/** File/data-converter registry: one entry drives page, widget config, search index and schema. */

export interface FileToolOption {
  id: string;
  label: string;
  type: 'select' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  defaultValue?: string;
  placeholder?: string;
}

export interface FileToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  /** custom widget instead of the generic text-convert UI */
  widget?: 'einvoice' | 'ksef-viewer' | 'ksef-validator' | 'excel-to-csv' | 'excel-to-json' | 'csv-to-excel' | 'html-md';
  computeId?: string;
  options?: FileToolOption[];
  /** sample input preloaded so the tool demonstrates itself */
  sample?: string;
  /** accept attribute for the "open file" button */
  accept?: string;
  /** download filename for the output */
  downloadName?: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

const CSV_SAMPLE = 'name,role,active\n"Doe, Jane",Engineer,true\nRaj Patel,Designer,false';
const JSON_SAMPLE = '[\n  { "name": "Doe, Jane", "role": "Engineer", "active": true },\n  { "name": "Raj Patel", "role": "Designer", "active": false }\n]';

const DELIM_OPTION: FileToolOption = {
  id: 'delimiter', label: 'Delimiter', type: 'select', defaultValue: 'auto',
  options: [
    { value: 'auto', label: 'Auto-detect' },
    { value: ',', label: 'Comma (,)' },
    { value: ';', label: 'Semicolon (;) — Excel in Europe' },
    { value: 'tab', label: 'Tab (TSV)' },
    { value: '|', label: 'Pipe (|)' },
  ],
};

export const FILE_TOOLS: FileToolDef[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    icon: '{ }',
    description:
      'Format, minify and validate JSON with exact error locations (line and column). Open files, download results — 100% in your browser, no size limits.',
    lead: 'Paste or open any JSON — get it pretty-printed or minified, with validation errors pinpointed to the exact line and column.',
    computeId: 'jsonFormat',
    options: [
      {
        id: 'mode', label: 'Mode', type: 'select', defaultValue: 'format',
        options: [
          { value: 'format', label: 'Format (pretty-print)' },
          { value: 'minify', label: 'Minify' },
        ],
      },
      {
        id: 'indent', label: 'Indentation', type: 'select', defaultValue: '2',
        options: [
          { value: '2', label: '2 spaces' },
          { value: '4', label: '4 spaces' },
          { value: 'tab', label: 'Tabs' },
        ],
      },
    ],
    sample: '{"name":"Doe, Jane","tags":["admin","dev"],"active":true,"meta":{"logins":42}}',
    accept: '.json,.txt,application/json',
    downloadName: 'formatted.json',
    how: 'The input is parsed with the browser’s native JSON parser — the same engine your applications use — so validation verdicts match reality exactly. Errors are reported with the line and column of the first problem. Formatting re-serializes with your chosen indentation; minifying strips all insignificant whitespace (typically 20–40% smaller for config-style JSON).',
    note: 'The classic use is debugging: an API response or config file that "should work" gets pasted here, and the line/column error message finds the trailing comma or unquoted key in seconds. JSON is often confidential — payloads, configs, credentials — which is why this formatter never transmits a byte.',
    faqs: [
      { q: 'Why is my JSON invalid?', a: 'The usual suspects: trailing commas (allowed in JavaScript, forbidden in JSON), single quotes instead of double, unquoted keys, and comments (JSON has none). The error message points at the first offending line and column.' },
      { q: 'Does minifying change my data?', a: 'No — only whitespace between tokens is removed. Values, key order and structure are byte-identical when parsed.' },
      { q: 'Is there a file-size limit?', a: 'No hard limit — parsing is local, so multi-megabyte files work without upload caps or paid tiers.' },
      { q: 'Can I validate without reformatting?', a: 'Yes — the verdict ("valid JSON ✓" or the error) appears regardless; just ignore the output pane if you only needed validation.' },
      { q: 'Is my JSON kept private?', a: 'Completely — parsing runs in your browser and the page works offline. API payloads and configs never touch a server here.' },
    ],
    keywords: ['json formatter', 'json validator', 'json beautifier', 'json minify', 'pretty print json', 'json lint online'],
  },
  {
    slug: 'csv-to-json',
    name: 'CSV to JSON Converter',
    icon: '📊',
    description:
      'Convert CSV to JSON with delimiter auto-detect (comma, semicolon, tab), quoted-field handling and typed values. Open files, download results — no size limits, no upload.',
    lead: 'Paste or open a CSV and get JSON records instantly — headers become keys, numbers and booleans stay typed, and the delimiter is auto-detected.',
    computeId: 'csvToJson',
    options: [
      DELIM_OPTION,
      { id: 'headers', label: 'First row is headers', type: 'checkbox', defaultValue: 'true' },
      {
        id: 'shape', label: 'Output shape', type: 'select', defaultValue: 'objects',
        options: [
          { value: 'objects', label: 'Array of objects (keys from headers)' },
          { value: 'arrays', label: 'Array of arrays (raw rows)' },
        ],
      },
    ],
    sample: CSV_SAMPLE,
    accept: '.csv,.tsv,.txt,text/csv',
    downloadName: 'data.json',
    how: 'The parser follows the RFC 4180 conventions: fields may be quoted, quoted fields may contain commas, newlines and doubled quotes ("" means one quote character). With headers on, each subsequent row becomes an object keyed by the header names; values that look like numbers, booleans or null are emitted as real JSON types rather than strings. Auto-detect samples the first lines to pick comma, semicolon, tab or pipe.',
    note: 'The two classic CSV traps are both handled: quoted fields containing commas ("Doe, Jane" stays one field), and European Excel exports, which use semicolons because the comma is the decimal separator in those locales. If a conversion ever looks like one giant column, that is the delimiter — switch it manually.',
    faqs: [
      { q: 'Why does my CSV come out as one column?', a: 'Wrong delimiter — most often a semicolon-delimited Excel export (standard in European locales) read as comma. Auto-detect handles it; the delimiter dropdown overrides it explicitly.' },
      { q: 'How are commas inside values handled?', a: 'Per RFC 4180: fields wrapped in double quotes may contain commas and even newlines; a doubled quote ("") inside means a literal quote. The sample data demonstrates it.' },
      { q: 'Do numbers stay numbers?', a: 'Yes — values that parse as numbers, true/false or null become real JSON types. Long digit strings (IDs, phone numbers) above 15 digits stay strings to avoid precision loss.' },
      { q: 'What if my CSV has no header row?', a: 'Untick "first row is headers" — you get an array of arrays, or objects with column_1, column_2… if you keep the objects shape.' },
      { q: 'Is there a size limit or upload?', a: 'Neither — conversion is local and instant even for large exports. Business data never leaves your machine.' },
    ],
    keywords: ['csv to json', 'convert csv to json online', 'csv to json array', 'semicolon csv', 'csv parser online'],
  },
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    icon: '📋',
    description:
      'Convert a JSON array to CSV/TSV — union of keys as headers, proper quoting, nested values preserved. Open files, download results, no upload.',
    lead: 'Paste a JSON array of objects and get spreadsheet-ready CSV — headers from the union of all keys, quoting handled correctly.',
    computeId: 'jsonToCsv',
    options: [
      {
        id: 'delimiter', label: 'Delimiter', type: 'select', defaultValue: ',',
        options: [
          { value: ',', label: 'Comma (,)' },
          { value: ';', label: 'Semicolon (;) — for European Excel' },
          { value: 'tab', label: 'Tab (TSV)' },
        ],
      },
    ],
    sample: JSON_SAMPLE,
    accept: '.json,application/json',
    downloadName: 'data.csv',
    how: 'The top-level JSON must be an array. For arrays of objects, the header row is the union of every key that appears in any record (missing values become empty cells); for arrays of arrays, rows convert directly. Values containing the delimiter, quotes or newlines are wrapped and escaped per RFC 4180, and nested objects/arrays are embedded as JSON strings rather than silently flattened.',
    note: 'Choosing the semicolon delimiter makes files that open correctly in Excel on European locale systems — the mirror image of the usual import problem. For a quick visual check before download, the CSV-to-Markdown tool renders the same data as a readable table.',
    faqs: [
      { q: 'Why do I get an error about a JSON array?', a: 'CSV is tabular, so the input must be a list: [{...}, {...}] or [[...], [...]]. A single object can be wrapped in brackets to convert as one row.' },
      { q: 'What happens to nested objects?', a: 'They are embedded as JSON strings in their cell — lossless and reversible. True flattening (address.city → its own column) changes the data shape, so it is deliberate, not automatic.' },
      { q: 'My records have different keys — what happens?', a: 'The header row is the union of all keys; records missing a key get an empty cell. Order follows first appearance.' },
      { q: 'How do I open the result in Excel without breaking accents?', a: 'Download the file rather than copy-pasting (the file route preserves UTF-8), and on European-locale Excel choose the semicolon delimiter.' },
      { q: 'Is my data uploaded?', a: 'No — conversion is local, unlimited and works offline.' },
    ],
    keywords: ['json to csv', 'convert json to csv online', 'json array to spreadsheet', 'json to excel csv', 'json to tsv'],
  },
  {
    slug: 'json-to-yaml',
    name: 'JSON to YAML Converter',
    icon: '📝',
    description:
      'Convert JSON to clean YAML — for Kubernetes manifests, CI configs and docker-compose. Validated input, downloadable output, no upload.',
    lead: 'Paste JSON, get equivalent YAML — the format Kubernetes, GitHub Actions and docker-compose expect.',
    computeId: 'jsonToYaml',
    sample: '{\n  "service": "api",\n  "replicas": 3,\n  "env": ["prod", "staging"],\n  "resources": { "cpu": "500m", "memory": "256Mi" }\n}',
    accept: '.json,application/json',
    downloadName: 'config.yaml',
    how: 'The JSON is parsed (with line/column errors if invalid), then serialized by js-yaml — the de-facto standard YAML library — producing block-style YAML with sensible quoting. Every JSON document is valid YAML semantically, so the conversion is lossless.',
    note: 'The everyday use is configuration: an API response or JSON config that needs to become a Kubernetes manifest, GitHub Actions step or docker-compose fragment. Since YAML relies on indentation, converted output is also a quick way to get canonically indented config from messy hand-written JSON.',
    faqs: [
      { q: 'Is JSON to YAML always lossless?', a: 'Yes — YAML is a superset of JSON, so every JSON value has an exact YAML representation. The reverse direction can be lossy only for YAML-exclusive features (anchors, comments).' },
      { q: 'Why are some strings quoted in the output and others not?', a: 'js-yaml quotes only where YAML requires it — strings that would otherwise parse as numbers, booleans (yes/no/on/off) or contain special characters. Unquoted output is safe.' },
      { q: 'Does it handle deep nesting?', a: 'Yes — nesting converts to indentation levels without depth limits. Very wide values wrap at 100 characters for readability.' },
      { q: 'Can I convert a whole file?', a: 'Use the open-file button, convert, then download — no size caps, all local.' },
      { q: 'Is my config data private?', a: 'Yes — configs often contain hostnames and secrets, which is exactly why this runs entirely in your browser.' },
    ],
    keywords: ['json to yaml', 'convert json to yaml', 'kubernetes yaml from json', 'json to yml online', 'config converter'],
  },
  {
    slug: 'yaml-to-json',
    name: 'YAML to JSON Converter',
    icon: '🧾',
    description:
      'Convert YAML to JSON with real YAML parsing (anchors, multi-line strings) and clear error messages. Open files, download results, no upload.',
    lead: 'Paste YAML — a Kubernetes manifest, CI config, front-matter — and get exact JSON, with YAML errors explained.',
    computeId: 'yamlToJson',
    options: [{ id: 'minify', label: 'Minify output', type: 'checkbox' }],
    sample: 'service: api\nreplicas: 3\nenv:\n  - prod\n  - staging\nresources:\n  cpu: 500m\n  memory: 256Mi',
    accept: '.yaml,.yml,.txt',
    downloadName: 'data.json',
    how: 'Parsing uses js-yaml, a full YAML implementation — indentation rules, anchors and aliases, multi-line strings and type tags all behave to spec, and syntax errors report the offending line. The parsed structure is then emitted as standard JSON (pretty-printed or minified).',
    note: 'One YAML behavior worth knowing: unquoted values like yes, no, on and off parse as booleans under YAML 1.1 conventions — the famous "Norway problem," where the country code NO becomes false. If a value must stay a string, quote it in the YAML source.',
    faqs: [
      { q: 'Why did my value "no" become false?', a: 'YAML 1.1 treats yes/no/on/off as booleans — the "Norway problem." Quote the value in the source ("no") to keep it a string; the converter faithfully reflects what the YAML spec says your document means.' },
      { q: 'Are anchors and aliases supported?', a: 'Yes — &anchor definitions and *alias references resolve during parsing, so the JSON contains the expanded values.' },
      { q: 'What about comments?', a: 'YAML comments have no JSON equivalent and are dropped — the one inherently lossy part of this direction.' },
      { q: 'Why does my YAML fail with an indentation error?', a: 'YAML forbids tabs for indentation and requires consistent spaces. The error message names the line; converting tabs to spaces fixes the majority of cases.' },
      { q: 'Is my file uploaded?', a: 'No — parsing is local and offline-capable; manifests and configs stay on your machine.' },
    ],
    keywords: ['yaml to json', 'convert yaml to json online', 'yml to json', 'kubernetes manifest to json', 'yaml parser'],
  },
  {
    slug: 'xml-to-json',
    name: 'XML to JSON Converter',
    icon: '🗂️',
    description:
      'Convert XML to JSON using the browser’s native parser — attributes preserved with @ prefixes, repeated elements become arrays. No upload.',
    lead: 'Paste XML and get JSON — attributes keep an @ prefix, repeated sibling elements become arrays, and parse errors are reported plainly.',
    computeId: 'xmlToJson',
    sample: '<catalog>\n  <book id="1"><title>Dune</title><year>1965</year></book>\n  <book id="2"><title>Foundation</title><year>1951</year></book>\n</catalog>',
    accept: '.xml,text/xml',
    downloadName: 'data.json',
    how: 'Parsing uses the browser’s native DOMParser — the same engine that renders XML in web pages — so well-formedness rules are enforced exactly. The mapping convention: element attributes become "@name" keys, text content of mixed elements becomes "#text", and repeated sibling elements (like the two <book> entries in the sample) collapse into a JSON array.',
    note: 'XML-to-JSON has no single canonical mapping — attributes and repeated elements force conventions. Ours matches the common "@/#text" style used by most tooling, and keeps values typed (the year 1965 arrives as a number). Feeds (RSS), SOAP payloads and legacy exports are the usual customers.',
    faqs: [
      { q: 'How are attributes represented?', a: 'As keys prefixed with @: <book id="1"> becomes {"@id": 1, ...} — the widely used convention that keeps attributes distinguishable from child elements.' },
      { q: 'Why is one <item> an object but two <item>s an array?', a: 'JSON has no repeated keys, so single children map to objects and repeated siblings to arrays. Code consuming varying feeds should handle both shapes — or normalize afterward.' },
      { q: 'Why does my XML fail to parse?', a: 'DOMParser enforces well-formedness: every tag closed, one root element, & escaped as &amp;. The error message quotes the parser’s reason, usually with a line reference.' },
      { q: 'Are namespaces supported?', a: 'Tags keep their prefixed names (ns:tag) as-is — namespace semantics beyond naming are not interpreted, which suits most conversion needs.' },
      { q: 'Is my XML kept local?', a: 'Yes — parsing happens in your browser with nothing transmitted.' },
    ],
    keywords: ['xml to json', 'convert xml to json online', 'xml parser', 'rss to json', 'xml attributes json'],
  },
  {
    slug: 'json-to-xml',
    name: 'JSON to XML Converter',
    icon: '🏷️',
    description:
      'Convert JSON to well-formed XML with a custom root element — keys become tags, arrays repeat elements. Downloadable, no upload.',
    lead: 'Paste JSON and get well-formed XML — object keys become elements, arrays repeat their tag, and you choose the root name.',
    computeId: 'jsonToXml',
    options: [{ id: 'root', label: 'Root element name', type: 'text', defaultValue: 'root', placeholder: 'root' }],
    sample: JSON_SAMPLE,
    accept: '.json,application/json',
    downloadName: 'data.xml',
    how: 'Each object key becomes an element of that name; array items repeat the parent tag; primitive values become text content with &, < and > escaped. Keys that are not valid XML names fall back to <item>. The output opens with a standard XML declaration and nests with two-space indentation.',
    note: 'This direction serves legacy integrations — systems and endpoints that still speak XML while your data lives as JSON. Note that the conversion generates elements only: if a target schema requires specific attributes, they need manual placement, since JSON has no attribute concept to translate from.',
    faqs: [
      { q: 'How are arrays converted?', a: 'By repeating the element: {"book": [a, b]} produces two <book> elements in sequence — the standard XML idiom for lists.' },
      { q: 'Can the converter produce attributes?', a: 'No — JSON has no attributes, so everything becomes elements. Schemas requiring attributes need a post-edit or a mapping convention agreed with the consumer.' },
      { q: 'What happens to special characters?', a: '&, < and > are escaped to their entities in text content, keeping the output well-formed regardless of the data.' },
      { q: 'What if my JSON keys contain spaces?', a: 'Invalid XML names are replaced with <item> to keep the document well-formed — rename keys beforehand if the tag names matter (the find & replace tool works on JSON text too).' },
      { q: 'Local processing?', a: 'Yes — no upload, no limits, offline-capable.' },
    ],
    keywords: ['json to xml', 'convert json to xml online', 'json to xml with root', 'data to xml', 'xml generator'],
  },
  {
    slug: 'csv-to-markdown-table',
    name: 'CSV to Markdown Table',
    icon: '📑',
    description:
      'Convert CSV or TSV into a Markdown table for GitHub READMEs, docs and wikis — delimiter auto-detect, pipe escaping. No upload.',
    lead: 'Paste CSV, copy a Markdown table — ready for GitHub READMEs, pull requests, and any docs that speak Markdown.',
    computeId: 'csvToMarkdown',
    options: [
      DELIM_OPTION,
      { id: 'headers', label: 'First row is headers', type: 'checkbox', defaultValue: 'true' },
    ],
    sample: CSV_SAMPLE,
    accept: '.csv,.tsv,.txt,text/csv',
    downloadName: 'table.md',
    how: 'The CSV is parsed with the same RFC 4180 quote-aware parser as the JSON converter, then rendered as a GitHub-flavored Markdown table: a header row, a --- separator line, and one pipe-delimited row per record. Pipe characters inside values are escaped (\\|) and embedded newlines become spaces so the table stays intact.',
    note: 'The fastest route from spreadsheet to documentation: copy cells from Excel or Google Sheets (which copies as tab-separated text), paste here with auto-detect, and the tab delimiter is recognized — one paste, one copy, done.',
    faqs: [
      { q: 'Can I paste directly from Excel or Google Sheets?', a: 'Yes — spreadsheet copies are tab-separated, which auto-detect recognizes. Paste, copy the Markdown, drop it in your README.' },
      { q: 'What if my data contains the | character?', a: 'It is escaped as \\| automatically, so the table structure survives values like "a|b".' },
      { q: 'Does Markdown support column alignment?', a: 'Yes, via colons in the separator row (:--- left, :---: center, ---: right). The tool emits plain --- separators; add colons where you want alignment.' },
      { q: 'How do wide tables render?', a: 'Markdown tables do not wrap — very wide tables scroll horizontally on GitHub. Consider trimming columns before converting.' },
      { q: 'Is anything uploaded?', a: 'No — conversion is local and instant.' },
    ],
    keywords: ['csv to markdown table', 'markdown table generator', 'excel to markdown', 'github table from csv', 'tsv to markdown'],
  },
  {
    slug: 'markdown-to-html',
    name: 'Markdown to HTML Converter',
    icon: '📰',
    description:
      'Convert Markdown to clean HTML with GitHub-flavored parsing (tables, code blocks) via marked. Copy or download — no upload.',
    lead: 'Paste Markdown, get the HTML it renders to — headings, lists, links, tables and code blocks included.',
    computeId: 'markdownToHtml',
    sample: '# Release notes\n\n**Highlights** of `v2.0`:\n\n- Faster startup\n- New [docs](https://example.com)\n\n| Metric | Change |\n| --- | --- |\n| Startup | −40% |',
    accept: '.md,.markdown,.txt',
    downloadName: 'output.html',
    how: 'Conversion uses marked, one of the standard Markdown parsers in the JavaScript ecosystem, with GitHub-flavored extensions — tables, fenced code blocks and autolinks behave the way GitHub renders them. The output is an HTML fragment ready to paste into a page, CMS field or email template.',
    note: 'The output is a fragment by design — no <html> or <body> wrapper — because the common destinations (CMS bodies, email builders, static-site partials) want exactly that. If pasting into an email tool, remember most of them strip <style>; inline styling has to come from the destination side.',
    faqs: [
      { q: 'Which Markdown flavor is supported?', a: 'GitHub-flavored Markdown via marked: standard CommonMark plus tables, fenced code blocks, strikethrough and autolinks — matching what GitHub, GitLab and most docs tools render.' },
      { q: 'Why is there no <html> or <head> in the output?', a: 'Deliberately — a fragment pastes cleanly into CMS fields, templates and partials. Wrap it yourself only when creating a standalone file.' },
      { q: 'Is the HTML sanitized?', a: 'Raw HTML inside your Markdown passes through, per Markdown spec. Only convert trusted input if the output will be rendered on a site — the same rule as any Markdown pipeline.' },
      { q: 'Do code blocks keep their language?', a: 'Fenced blocks emit <code class="language-x"> — highlight.js/Prism pick that up on the destination page for syntax coloring.' },
      { q: 'Is my content uploaded?', a: 'No — parsing is local; drafts stay on your machine.' },
    ],
    keywords: ['markdown to html', 'convert md to html online', 'github markdown converter', 'markdown parser', 'md file to html'],
  },
  {
    slug: 'e-invoice-viewer',
    name: 'E-Invoice Viewer (XRechnung / ZUGFeRD)',
    icon: '🧾',
    description:
      'Open and read XRechnung, ZUGFeRD and Factur-X e-invoices — XML or hybrid PDF — as a clean human-readable summary. Parsed locally; invoice data never leaves your browser.',
    lead: 'Received an XML invoice you can\'t read? See the seller, amounts, line items and payment details instantly — parsed on your device, because invoices are exactly the data not to upload.',
    widget: 'einvoice',
    how: 'European e-invoices come in two technical syntaxes — UBL and UN/CEFACT CII — both defined by the EN 16931 standard that Germany\'s XRechnung and the ZUGFeRD/Factur-X profiles implement. This viewer parses either XML directly, and for ZUGFeRD/Factur-X hybrid PDFs it extracts the machine-readable XML embedded inside the PDF and reads that. The output is what the XML actually says: invoice number, dates, parties, VAT breakdown, line items, totals and payment details — displayed, not interpreted.',
    note: 'Why this exists: since January 2025, German B2B businesses must be able to receive e-invoices, with mandatory issuing phasing in through 2027–2028 — so freelancers and small businesses increasingly receive a machine-readable XML where they expect a document. Most "viewers" are lead-generation for ERP suites and want the invoice uploaded. An invoice names your clients, prices and bank details; reading it should happen on your machine.',
    faqs: [
      { q: 'What are XRechnung and ZUGFeRD?', a: 'Both implement the European e-invoice standard EN 16931. XRechnung is Germany\'s pure-XML profile (required for invoicing German public authorities); ZUGFeRD/Factur-X is a hybrid: a normal-looking PDF with the machine-readable XML embedded inside, readable by humans and software alike.' },
      { q: 'Why did I receive an invoice as an XML file?', a: 'Germany\'s Growth Opportunities Act makes e-invoices the B2B default: since January 2025 businesses must be able to receive them, and issuing becomes mandatory in phases through 2027–2028. Similar mandates exist or are coming in other EU countries. The XML is the legally authoritative invoice — this viewer makes it readable.' },
      { q: 'My ZUGFeRD PDF opens fine — why use a viewer?', a: 'The PDF layer is a courtesy image; the embedded XML is the authoritative data your accounting must process. The viewer shows what the XML actually says — worth checking, since in a conflict between the two, the XML governs.' },
      { q: 'Which formats and syntaxes does it read?', a: 'XRechnung in both UBL and UN/CEFACT CII syntax, ZUGFeRD 2.x / Factur-X hybrid PDFs (the embedded XML is extracted automatically), and generally any EN 16931-shaped UBL or CII invoice, including Peppol BIS billing.' },
      { q: 'Is my invoice uploaded to be parsed?', a: 'No — XML parsing and PDF attachment extraction run entirely in your browser; the tool works offline. Client names, amounts and IBANs never leave your device, which is the point.' },
      { q: 'Does it validate the invoice against the standard?', a: 'No — it displays the content faithfully but does not run EN 16931/XRechnung schema validation rules. For formal compliance checks (e.g. before submitting to an authority), use an official validator; for "what does this invoice say", use this.' },
    ],
    keywords: ['xrechnung viewer', 'zugferd viewer', 'open xrechnung xml', 'e-invoice reader', 'read xml invoice', 'e-rechnung anzeigen'],
  },
  {
    slug: 'facturx-viewer',
    name: 'Factur-X Viewer (French E-Invoice)',
    icon: '🇫🇷',
    description:
      'Open a Factur-X invoice — France\'s hybrid PDF e-invoice format — and read the embedded structured data: profile, parties, VAT, line items, totals. Parsed locally, nothing uploaded.',
    lead: 'France\'s e-invoicing mandate starts 1 September 2026, and Factur-X is its flagship format: a normal-looking PDF with the legal invoice data embedded as XML inside. This viewer extracts and shows that data — including which Factur-X profile the invoice uses — without your invoice leaving the browser.',
    widget: 'einvoice',
    how: 'A Factur-X invoice (the French-German standard, identical to ZUGFeRD 2.x) is a PDF/A-3 file with a machine-readable XML invoice — UN/CEFACT Cross-Industry Invoice syntax — embedded as an attachment. The viewer extracts that XML from the PDF (or reads a bare XML directly), detects the Factur-X profile from its guideline URN, and displays the structured content: seller and buyer, SIREN/VAT identifiers, dates, line items, VAT breakdown by rate, totals and payment details. Profiles matter under the French reform: MINIMUM and BASIC WL carry only header data — the viewer flags this — while BASIC, EN 16931 and EXTENDED contain the full line-level detail.',
    note: 'The timeline driving this: from 1 September 2026, every French company regardless of size must be able to receive electronic invoices, and large and mid-size companies (grandes entreprises, ETI) must issue them; SMEs and micro-enterprises follow on 1 September 2027. Invoices flow through certified platforms (plateformes agréées, formerly PDP), with Factur-X, UBL and CII as the core formats. If a supplier\'s invoice now arrives as a "PDF that my accounting software wants as XML", it is almost certainly Factur-X — and the XML inside, not the visual layer, is the authoritative document.',
    faqs: [
      { q: 'What is a Factur-X invoice?', a: 'A hybrid e-invoice standard developed jointly by France (FNFE-MPE) and Germany (where it is called ZUGFeRD): a human-readable PDF/A-3 with the structured invoice data embedded inside as UN/CEFACT CII XML. Humans read the PDF; software reads the XML; legally, the structured data is the invoice.' },
      { q: 'When does e-invoicing become mandatory in France?', a: 'From 1 September 2026 all French companies must be able to receive e-invoices, and large and mid-size companies must issue them. Small and micro-enterprises must issue from 1 September 2027. The obligation covers domestic B2B transactions, with invoices exchanged via certified platforms.' },
      { q: 'What are the Factur-X profiles?', a: 'Five levels of structured detail: MINIMUM and BASIC WL (header data only — flagged by this viewer, since they omit line items), BASIC (full invoice with lines), EN 16931 / Comfort (the full European semantic standard), and EXTENDED (additional French-German business fields). The profile is declared in the XML\'s guideline URN, which this viewer reads and displays.' },
      { q: 'How is Factur-X different from a normal PDF invoice?', a: 'Visually, not at all — that is the design. The difference is the embedded XML attachment carrying every amount, date and party as structured data. A scanned or ordinary PDF has no such attachment; this viewer will tell you if the PDF you load is not actually a Factur-X hybrid.' },
      { q: 'Is my invoice uploaded to be read?', a: 'No — the PDF attachment extraction and XML parsing run entirely in your browser and work offline. A Factur-X invoice names your suppliers, amounts and bank details (IBAN); that is exactly the data not to feed into a random online viewer that logs uploads.' },
      { q: 'Does this validate compliance with the French mandate?', a: 'No — it faithfully displays what the invoice contains, including the declared profile, but does not run EN 16931 or Factur-X schematron validation. For formal conformance testing, use an official validator; for "what does this invoice actually say", use this.' },
    ],
    keywords: ['factur-x viewer', 'facture électronique 2026', 'ouvrir facture factur-x', 'factur x lecteur', 'french e-invoice', 'facture electronique format', 'factur-x profile', 'lire facture xml'],
  },
  {
    slug: 'ksef-viewer',
    name: 'KSeF Invoice Viewer (Poland FA(3))',
    icon: '🇵🇱',
    description:
      'Open a Polish KSeF structured invoice — FA(3) or FA(2) XML — and read it as a normal invoice: parties with NIP, line items, VAT summary, totals and payment details. Parsed locally, nothing uploaded.',
    lead: 'Read a faktura ustrukturyzowana without any software — since April 2026 every VAT-registered business in Poland invoices through KSeF, and what lands in your systems is FA(3) XML. This viewer turns it back into a readable invoice, entirely in your browser.',
    widget: 'ksef-viewer',
    how: 'A KSeF invoice is an XML document following Poland\'s FA logical structure — currently FA(3), mandatory since 1 February 2026 — with a <Faktura> root containing the header (Naglowek), the seller and buyer (Podmiot1/Podmiot2 with their NIP identifiers), and the invoice body (Fa) whose positional fields carry the data: P_1 issue date, P_2 invoice number, P_15 total due, FaWiersz line items, P_13/P_14 VAT sums per rate group. The viewer parses those fields and lays them out as the invoice a human expects — parties, dates, line table, VAT summary, payment account — and detects whether the file is FA(3) or the older FA(2). There\'s a print/save-as-PDF button for filing. Everything happens in your browser: a KSeF file names your counterparties, amounts and bank account, which is exactly the data not to upload to a random website.',
    note: 'The timeline that makes this an everyday need: large taxpayers have invoiced through KSeF since 1 February 2026, all VAT-registered businesses since 1 April 2026, and the smallest micro-entrepreneurs join by 1 January 2027 — after which penalties (up to 100% of the invoice\'s VAT) become enforceable. Receiving structured invoices has been mandatory for everyone since February 2026, so "a supplier sent me an XML" is now the normal case in Poland, not the exception. The XML in KSeF is the legally binding invoice; any PDF or paper copy is just a visualisation of it.',
    faqs: [
      { q: 'What is KSeF and what is an FA(3) file?', a: 'KSeF (Krajowy System e-Faktur) is Poland\'s national e-invoicing clearance system: invoices are submitted to it as XML and legally exist once KSeF accepts them and assigns a KSeF number. FA(3) is the current XML structure those invoices follow — mandatory since 1 February 2026, replacing FA(2).' },
      { q: 'Who has to use KSeF, and from when?', a: 'Issuing became mandatory for large taxpayers (over PLN 200M turnover) on 1 February 2026 and for all other VAT-registered businesses on 1 April 2026; micro-entrepreneurs with small invoice volumes have until 1 January 2027. Receiving via KSeF has been mandatory for everyone since February 2026. 2026 is a grace period — from January 2027, penalties apply.' },
      { q: 'How do I open an FA(3) XML file I received?', a: 'Load it into this viewer — it parses the structure locally and displays the parties, dates, line items, VAT breakdown and payment details as a normal invoice, which you can print or save as PDF. No accounting software or KSeF login is needed to simply read the file.' },
      { q: 'Is the XML or the PDF the real invoice?', a: 'The XML. In the KSeF regime the structured file accepted by the system is the legally binding invoice; PDFs or printouts are visualisations. If they disagree, the XML governs — which is a good reason to check what it actually says.' },
      { q: 'Does this viewer work with FA(2) files too?', a: 'Yes — it auto-detects the variant from the header and reads both, flagging FA(2) files as the older structure. XRechnung, Factur-X and Peppol invoices use different standards; the general e-invoice viewer handles those.' },
      { q: 'Is my invoice uploaded to be read?', a: 'No — the XML is parsed by your browser\'s own engine and the page works offline. Counterparty names, NIPs, amounts and bank account numbers never leave your device.' },
    ],
    keywords: ['ksef viewer', 'ksef xml viewer', 'fa(3) viewer', 'open ksef invoice', 'faktura ustrukturyzowana', 'ksef invoice reader', 'fa3 xml', 'jak otworzyć fakturę ksef', 'ksef 2026'],
  },
  {
    slug: 'ksef-validator',
    name: 'KSeF Invoice Pre-Checker (FA(3))',
    icon: '🧐',
    description:
      'Pre-check a KSeF FA(3)/FA(2) invoice XML before submission: structure, required fields, dates, currency and NIP mod-11 checksums — an unofficial early-warning check that runs entirely in your browser.',
    lead: 'Catch the obvious rejections before KSeF does — structure, required fields and NIP check digits, verified locally in seconds. Unofficial by design: only KSeF acceptance is legal validation.',
    widget: 'ksef-validator',
    how: 'KSeF is a clearance system: an invoice that fails validation is rejected and legally doesn\'t exist, so errors surface at the worst moment — submission. This pre-checker runs the cheap checks early: the XML is well-formed; the root and required elements (Naglowek, Podmiot1, Podmiot2, Fa) are present; the schema variant is the current FA(3); the issue date, invoice number, currency code and total are present and sane; line items exist; the net totals are self-consistent; and — the classic silent killer — the seller\'s and buyer\'s NIP numbers pass Poland\'s mod-11 checksum, which catches most typos in a tax ID. Each check reports pass, warn or fail with a plain explanation.',
    note: 'Honest scope: this is a rule-based pre-check, not the Ministry of Finance\'s XSD-schema validation and not KSeF\'s business rules — an invoice can pass here and still be rejected, and only KSeF\'s acceptance (with a KSeF number) has legal effect. What it will catch is the mundane majority of failures: a mistyped NIP, a missing required field, a malformed date, an FA(2) file where FA(3) is required. From January 2027 the stakes rise — the penalty grace period ends — so a ten-second local pre-check before submission is cheap insurance.',
    faqs: [
      { q: 'Is this an official KSeF validation?', a: 'No — explicitly not. It\'s an unofficial structural pre-check. Legal validation happens only when KSeF itself accepts the invoice and assigns a KSeF number. Use this to catch obvious problems earlier and cheaper.' },
      { q: 'What does it actually check?', a: 'Well-formed XML; required elements (Naglowek, Podmiot1/2, Fa); FA(3) vs FA(2) variant; P_1 date format, P_2 number, ISO currency code, numeric P_15 total; presence of FaWiersz line items; consistency between line nets and the P_13 VAT-group sums; and mod-11 checksum validity of both NIPs.' },
      { q: 'How does the NIP checksum work?', a: 'A Polish NIP\'s tenth digit is a check digit: multiply the first nine digits by the weights 6,5,7,2,3,4,5,6,7, take the sum modulo 11, and it must equal the last digit. It catches most single-digit typos and swaps — the most common reason an otherwise-fine invoice carries a wrong tax ID.' },
      { q: 'Why would an invoice pass here but fail in KSeF?', a: 'KSeF validates against the full FA(3) XSD schema plus business rules (field interdependencies, code lists, correction-invoice logic) that go far beyond structural checks. This tool covers the frequent, cheap-to-catch failures, not the long tail.' },
      { q: 'Is the invoice I check uploaded anywhere?', a: 'No — all checks run in your browser and the page works offline. Pre-submission invoices are confidential business data; that\'s precisely why this doesn\'t have a server side.' },
    ],
    keywords: ['ksef validator', 'fa(3) validation', 'ksef pre-check', 'nip checksum', 'validate ksef xml', 'ksef rejection', 'sprawdzenie faktury ksef', 'fa3 walidacja'],
  },
  {
    slug: 'peppol-bis-viewer',
    name: 'Peppol BIS Invoice Viewer (Belgium)',
    icon: '🇧🇪',
    description:
      'Open a Peppol BIS 3.0 e-invoice — the UBL format of Belgium\'s 2026 B2B mandate — and read parties, VAT, line items and payment details. Parsed locally, nothing uploaded.',
    lead: 'Belgium\'s B2B e-invoicing mandate has been live since 1 January 2026, exchanged over the Peppol network as UBL XML. This viewer reads those files as a normal invoice — entirely in your browser.',
    widget: 'einvoice',
    how: 'Since 1 January 2026, structured electronic invoicing is mandatory for domestic B2B transactions between Belgian VAT-registered businesses, with the Peppol BIS Billing 3.0 format — a UBL 3-syntax profile of the European EN 16931 standard — as the default, and penalties enforceable since April 2026. What arrives through the Peppol network is an XML document; this viewer parses the UBL structure locally and shows what it says: seller and buyer with VAT numbers, issue and due dates, line items, the VAT breakdown by rate, totals and the payment account. It\'s the same EN 16931 engine that reads German XRechnung and French Factur-X files, pointed at the Belgian flavour — the CustomizationID identifying a Peppol BIS invoice is detected and shown.',
    note: 'Belgium\'s reform has a second phase worth knowing about: near-real-time e-reporting of invoice data to the tax authority is planned on top of the Peppol flow from 2028, so structured invoices are becoming the permanent norm, not a one-off compliance task. As everywhere in e-invoicing: the XML is the invoice; a PDF copy is a courtesy. And an invoice names your clients, amounts and IBAN — read it locally rather than uploading it to a converter site.',
    faqs: [
      { q: 'What does Belgium\'s 2026 mandate actually require?', a: 'Since 1 January 2026, Belgian VAT-registered businesses must issue and receive structured electronic invoices for domestic B2B transactions — a PDF by email no longer counts. The standard route is the Peppol network carrying Peppol BIS Billing 3.0 (UBL) documents; sanctions for non-compliance are enforceable since April 2026.' },
      { q: 'What is Peppol BIS Billing 3.0?', a: 'A profile of the European e-invoice standard EN 16931 in UBL syntax, exchanged over the Peppol network — the delivery infrastructure originally built for public procurement, now the backbone of Belgian (and increasingly European) B2B invoicing.' },
      { q: 'How do I read a Peppol invoice I received?', a: 'Load the XML here — the viewer parses the UBL structure in your browser and shows parties, VAT numbers, dates, line items, VAT breakdown and payment details. Nothing is uploaded, and the page works offline.' },
      { q: 'Does this also read XRechnung, Factur-X or KSeF files?', a: 'XRechnung (UBL or CII) and Factur-X hybrid PDFs: yes — see the general e-invoice viewer and the Factur-X viewer, which share this engine. Polish KSeF FA(3) files follow a different national schema and have their own dedicated viewer.' },
      { q: 'Is my invoice uploaded?', a: 'No — parsing is local and the tool works offline. Client names, amounts and IBANs stay on your device.' },
    ],
    keywords: ['peppol viewer', 'peppol bis 3.0 viewer', 'belgium e-invoicing 2026', 'open peppol invoice', 'ubl invoice viewer', 'peppol xml reader', 'facturation électronique belgique', 'e-invoicing belgië'],
  },
  {
    slug: 'excel-to-csv',
    name: 'Excel to CSV Converter',
    icon: '📊',
    description:
      'Convert an Excel spreadsheet (.xlsx/.xls) to CSV in your browser — pick the sheet, copy or download. Never uploaded.',
    lead: 'Turn an .xlsx or .xls workbook into plain CSV — choose the sheet and download, all on your device.',
    widget: 'excel-to-csv',
    accept: '.xlsx,.xls,.csv',
    how: 'The workbook is parsed in the browser with SheetJS. If it has multiple sheets you pick which one to export; the chosen sheet\'s cells are written out as comma-separated values with quoting where needed, ready to copy or download as a .csv. Formulas are exported as their computed values.',
    note: 'CSV is the universal format for importing data into databases, analytics tools and scripts — but spreadsheets often live as .xlsx. Converting locally matters because spreadsheets routinely hold financial, HR or customer data you shouldn\'t hand to a random web converter. Only the values are kept — formatting, charts and formulas-as-formulas are dropped, which is expected for CSV.',
    faqs: [
      { q: 'How do I convert Excel to CSV?', a: 'Open your .xlsx or .xls file, pick the sheet if there\'s more than one, and copy or download the CSV. It all happens in your browser.' },
      { q: 'What happens to multiple sheets?', a: 'CSV holds one table, so you choose which sheet to export. Run the tool again for each sheet you need.' },
      { q: 'Are formulas exported?', a: 'As their calculated values, not the formula text — which is what CSV supports. Formatting, colours and charts are not part of CSV and are dropped.' },
      { q: 'Is my spreadsheet uploaded?', a: 'No — SheetJS parses it in your browser. Financial and personal data in the file never leaves your device, and it works offline.' },
    ],
    keywords: ['excel to csv', 'convert xlsx to csv', 'xlsx to csv', 'excel to csv converter', 'spreadsheet to csv', 'xls to csv'],
  },
  {
    slug: 'excel-to-json',
    name: 'Excel to JSON Converter',
    icon: '🧾',
    description:
      'Convert an Excel spreadsheet (.xlsx/.xls) to JSON — the first row becomes the keys — in your browser, never uploaded.',
    lead: 'Turn a spreadsheet into an array of JSON objects, keyed by the header row — pick the sheet, copy or download, locally.',
    widget: 'excel-to-json',
    accept: '.xlsx,.xls,.csv',
    how: 'The workbook is parsed with SheetJS in the browser. The first row of the chosen sheet is treated as the field names, and each subsequent row becomes a JSON object mapping those names to its cell values — producing an array of objects, formatted and ready to copy or download. Numbers and booleans keep their types where the spreadsheet stored them as such.',
    note: 'JSON is what most APIs, config files and JavaScript code expect, so turning a spreadsheet of data into a JSON array is a common developer task. Doing it in the browser means an internal or customer dataset never touches a third-party server. If your sheet has no header row, the keys will be the first data row — add a header first for meaningful field names.',
    faqs: [
      { q: 'How do I convert Excel to JSON?', a: 'Load the .xlsx/.xls file, choose the sheet, and the tool outputs an array of JSON objects keyed by the header row. Copy it or download a .json file.' },
      { q: 'How are the JSON keys chosen?', a: 'From the first row of the sheet — treat it as your header. Each following row becomes one object mapping those headers to its values.' },
      { q: 'Do numbers stay numbers?', a: 'Yes where the spreadsheet stored them as numbers or booleans — they\'re emitted as JSON numbers/booleans, not strings. Text cells become strings.' },
      { q: 'Is my file uploaded?', a: 'No — parsing runs locally with SheetJS. Your data stays in the browser and the tool works offline.' },
    ],
    keywords: ['excel to json', 'convert xlsx to json', 'xlsx to json', 'excel to json converter', 'spreadsheet to json', 'xls to json'],
  },
  {
    slug: 'csv-to-excel',
    name: 'CSV to Excel Converter',
    icon: '📈',
    description:
      'Convert CSV data into a real Excel .xlsx workbook — paste or load a file — in your browser, never uploaded.',
    lead: 'Turn CSV text or a .csv file into a proper .xlsx spreadsheet that opens cleanly in Excel — all on your device.',
    widget: 'csv-to-excel',
    accept: '.csv,text/csv',
    how: 'The tool parses your CSV (from a file or pasted text) into rows and columns with SheetJS and writes a genuine .xlsx workbook, which downloads ready to open in Excel, Google Sheets or LibreOffice. Unlike simply renaming a .csv to .xlsx, this produces a real spreadsheet file with proper cells and types.',
    note: 'Opening a raw CSV in Excel can mangle things — leading zeros stripped from IDs, long numbers shown in scientific notation, dates reformatted. Converting to a true .xlsx gives you a clean spreadsheet to work from. It runs entirely in your browser, so the data in the CSV never leaves your device.',
    faqs: [
      { q: 'How do I convert CSV to Excel?', a: 'Paste your CSV or load a .csv file, and download a real .xlsx workbook. It opens directly in Excel, Google Sheets or LibreOffice.' },
      { q: 'Why not just rename the .csv to .xlsx?', a: 'That doesn\'t create a real spreadsheet — Excel would still parse it as text and may mangle IDs, big numbers or dates. This writes a genuine .xlsx file with proper cells.' },
      { q: 'Does it detect the delimiter?', a: 'It parses standard comma-separated values, including quoted fields containing commas. For other delimiters, convert to commas first or use the CSV tools.' },
      { q: 'Is my CSV uploaded?', a: 'No — the workbook is built in your browser with SheetJS. The data stays on your device and it works offline.' },
    ],
    keywords: ['csv to excel', 'convert csv to xlsx', 'csv to xlsx', 'csv to excel converter', 'csv to spreadsheet', 'make xlsx from csv'],
  },
  {
    slug: 'toml-to-json',
    name: 'TOML to JSON Converter',
    icon: '🧩',
    description: 'Convert TOML configuration to JSON in your browser — parsed with @iarna/toml (TOML v1.0.0). Never uploaded.',
    lead: 'Paste TOML (like a Cargo.toml or pyproject.toml) and get equivalent JSON — parsed locally on your device.',
    widget: undefined,
    computeId: 'tomlToJson',
    options: [{ id: 'minify', label: 'Minify (no indentation)', type: 'checkbox' }],
    sample: 'title = "LazyTools"\n\n[owner]\nname = "Ada"\nreleased = 2026\n\n[deps]\nnames = ["preact", "astro"]',
    accept: '.toml,text/plain',
    downloadName: 'data.json',
    how: 'TOML (Tom\'s Obvious Minimal Language) is a config format built for humans, used by Rust\'s Cargo.toml, Python\'s pyproject.toml and many tools. The converter parses it with the standards-compliant @iarna/toml parser (TOML v1.0.0) into a data structure and serialises that as JSON — tables become objects, arrays stay arrays, and dates and numbers keep their types.',
    note: 'JSON is what most programs and APIs consume, so converting a TOML config to JSON is handy for tooling and inspection. The conversion runs entirely in your browser, so a config file — which can hold internal names, tokens or paths — never leaves your device.',
    faqs: [
      { q: 'How do I convert TOML to JSON?', a: 'Paste your TOML or load a .toml file and the tool outputs equivalent JSON you can copy or download. Tables become objects and arrays stay arrays.' },
      { q: 'Which TOML version is supported?', a: 'TOML v1.0.0, via the @iarna/toml parser — including tables, arrays of tables, inline tables, and typed values like integers, floats, booleans and dates.' },
      { q: 'What if my TOML has a syntax error?', a: 'The tool shows the parser\'s error message so you can find and fix the offending line before converting.' },
      { q: 'Is my config uploaded?', a: 'No — parsing runs locally in your browser, so config contents stay on your device and it works offline.' },
    ],
    keywords: ['toml to json', 'convert toml to json', 'toml to json converter', 'parse toml', 'cargo.toml to json', 'pyproject.toml to json'],
  },
  {
    slug: 'json-to-toml',
    name: 'JSON to TOML Converter',
    icon: '🧷',
    description: 'Convert JSON to TOML configuration in your browser — serialised with @iarna/toml. Never uploaded.',
    lead: 'Paste JSON and get equivalent TOML for a config file — serialised locally, nothing uploaded.',
    widget: undefined,
    computeId: 'jsonToToml',
    sample: '{\n  "title": "LazyTools",\n  "owner": { "name": "Ada", "released": 2026 },\n  "deps": { "names": ["preact", "astro"] }\n}',
    accept: '.json,application/json',
    downloadName: 'data.toml',
    how: 'The tool parses your JSON and serialises it as TOML with the @iarna/toml writer: top-level objects become tables, nested objects become sub-tables, and arrays are written as TOML arrays. The JSON must be an object at the top level, because a TOML document is always a set of key/value pairs.',
    note: 'TOML is easier for people to read and edit than JSON for configuration, which is why tools are adopting it. Note that TOML has no null value and every key needs a value, so JSON containing null (or a top-level array or string) can\'t be represented — the tool tells you when that happens. It runs entirely in your browser.',
    faqs: [
      { q: 'How do I convert JSON to TOML?', a: 'Paste a JSON object or load a .json file and the tool outputs TOML you can copy or download. Objects become tables and arrays become TOML arrays.' },
      { q: 'Why must the JSON be an object?', a: 'A TOML document is a collection of key/value pairs, so it needs an object at the top level. A top-level array, string or number has no TOML representation.' },
      { q: 'What about null values?', a: 'TOML has no null and requires every key to have a value, so JSON with null can\'t be converted. Remove or replace null values first; the tool flags this.' },
      { q: 'Is my JSON uploaded?', a: 'No — the conversion runs locally in your browser and nothing is transmitted.' },
    ],
    keywords: ['json to toml', 'convert json to toml', 'json to toml converter', 'make toml from json', 'json to config'],
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter & Minifier',
    icon: '📐',
    description: 'Pretty-print or minify XML in your browser — indent by nesting depth or strip whitespace. Never uploaded.',
    lead: 'Paste messy or minified XML to format it with clean indentation — or minify it — all on your device.',
    widget: undefined,
    computeId: 'xmlFormat',
    options: [
      {
        id: 'indent', label: 'Indent', type: 'select', defaultValue: '2',
        options: [
          { value: '2', label: '2 spaces' },
          { value: '4', label: '4 spaces' },
        ],
      },
      { id: 'minify', label: 'Minify instead (remove whitespace between tags)', type: 'checkbox' },
    ],
    sample: '<catalog><book id="1"><title>XML Basics</title><author>Ada</author></book><book id="2"><title>Astro</title></book></catalog>',
    accept: '.xml,text/xml,application/xml',
    downloadName: 'formatted.xml',
    how: 'The formatter walks the XML tag by tag, indenting each element by its nesting depth and placing short text nodes inline with their element (<title>XML Basics</title>). Minify mode does the opposite — it removes the whitespace between tags to produce the smallest valid XML, while leaving text content untouched. It works on any well-formed XML, including SVG, RSS, sitemaps and config files.',
    note: 'This is a formatter, not a converter — the structure and content are unchanged, only the whitespace differs. Pretty-printing makes machine-generated or minified XML readable for debugging; minifying trims transfer size. Everything runs in your browser, so the document never leaves your device.',
    faqs: [
      { q: 'How do I format (beautify) XML?', a: 'Paste the XML or load a file and it\'s indented by nesting depth automatically. Choose a 2- or 4-space indent, then copy or download the result.' },
      { q: 'Can it minify XML too?', a: 'Yes — tick "Minify" and it removes the whitespace between tags to produce the smallest valid XML, without altering any text content.' },
      { q: 'Does it work on SVG and RSS?', a: 'Yes — SVG, RSS, Atom, sitemaps and config files are all XML, so the formatter handles them like any other well-formed XML document.' },
      { q: 'Does formatting change my data?', a: 'No — only the whitespace between elements changes. The elements, attributes and text content are preserved exactly.' },
      { q: 'Is my XML uploaded?', a: 'No — formatting runs entirely in your browser and nothing is transmitted.' },
    ],
    keywords: ['xml formatter', 'format xml', 'xml beautifier', 'xml minifier', 'pretty print xml', 'xml formatter online'],
  },
  {
    slug: 'html-to-markdown',
    name: 'HTML to Markdown Converter',
    icon: '📝',
    description: 'Convert HTML into clean Markdown in your browser (the reverse of Markdown-to-HTML), using Turndown. Never uploaded.',
    lead: 'Paste HTML and get clean Markdown — headings, links, lists, bold and code all converted, locally.',
    widget: 'html-md',
    accept: '.html,.htm,text/html',
    downloadName: 'output.md',
    how: 'The tool converts HTML to Markdown with Turndown, a well-established client-side library: headings become #, links become [text](url), <strong>/<em> become ** / _, lists become - or numbered items, and <pre>/<code> become fenced code blocks. It\'s the inverse of the Markdown-to-HTML converter — useful for turning web content, rich-text output or pasted HTML into clean Markdown for docs, wikis or READMEs.',
    note: 'Markdown is far easier to edit and version-control than HTML, so converting pasted or generated HTML back to Markdown is a common writing and documentation task. Turndown keeps the structure and drops presentational cruft. Everything runs in your browser — the HTML, which might be internal content, never leaves your device.',
    faqs: [
      { q: 'How do I convert HTML to Markdown?', a: 'Paste your HTML or load a .html file and the tool outputs Markdown you can copy or download. Headings, links, lists, emphasis and code are all converted.' },
      { q: 'Is this the reverse of the Markdown-to-HTML tool?', a: 'Yes — it takes HTML and produces Markdown, the opposite direction. Round-tripping isn\'t always byte-identical because HTML can express things Markdown can\'t, but structure and content carry over cleanly.' },
      { q: 'What happens to complex HTML like tables or styles?', a: 'Standard elements convert well; inline styles and non-semantic markup are dropped, since Markdown has no equivalent. Tables convert to Markdown (GitHub-flavoured) where the structure allows.' },
      { q: 'Is my HTML uploaded?', a: 'No — the conversion runs entirely in your browser with Turndown, so the content stays on your device and it works offline.' },
    ],
    keywords: ['html to markdown', 'convert html to markdown', 'html to md', 'html to markdown converter', 'turndown', 'webpage to markdown'],
  },
  {
    slug: 'jsonl-to-json',
    name: 'JSONL to JSON Converter',
    icon: '📄',
    description:
      'Convert JSONL / NDJSON (one JSON object per line) into a single JSON array, with exact line-numbered error reporting. In your browser, never uploaded.',
    lead: 'JSONL puts one JSON value per line — this wraps those lines into a single JSON array you can use anywhere, reporting the exact line of any parse error.',
    computeId: 'jsonlToJson',
    options: [
      { id: 'minify', label: 'Minify (single line, no indentation)', type: 'checkbox' },
    ],
    sample: '{"name": "Ada", "role": "Engineer"}\n{"name": "Raj", "role": "Designer"}\n{"name": "Mai", "role": "PM"}',
    accept: '.jsonl,.ndjson,.txt,application/json',
    downloadName: 'data.json',
    how: 'JSONL (also called NDJSON — newline-delimited JSON) stores one independent JSON value per line, which is ideal for streaming and log files but isn\'t itself a valid JSON document. The converter parses each non-empty line on its own, and if a line is malformed it tells you exactly which line number failed, then assembles all the parsed values into a single JSON array — pretty-printed with 2-space indentation, or minified to one line if you choose.',
    note: 'JSONL is the native format of many data pipelines and machine-learning datasets — OpenAI fine-tuning files, BigQuery exports and log shippers all use it — because you can append and stream records without rewriting the whole file. But most tools and APIs expect a single JSON array, so converting between the two is a routine chore. This runs entirely in your browser, so even sensitive datasets never leave your device.',
    faqs: [
      { q: 'What is the difference between JSONL and JSON?', a: 'JSONL (NDJSON) has one JSON value per line with no enclosing brackets or commas, so it streams and appends easily. Regular JSON is a single document — here, an array wrapping all those values. This tool converts JSONL into that array.' },
      { q: 'What happens if one line is invalid?', a: 'The converter reports the exact line number that failed to parse, so you can fix that record rather than hunting through the whole file.' },
      { q: 'Does it skip blank lines?', a: 'Yes — empty lines (common at the end of a file) are ignored, so a trailing newline won\'t cause an error.' },
      { q: 'Can I get minified output?', a: 'Yes — tick "Minify" for a single-line array, or leave it unticked for readable 2-space-indented JSON.' },
      { q: 'Is my data uploaded?', a: 'No — the conversion runs entirely in your browser and works offline, so even private datasets stay on your device.' },
    ],
    keywords: ['jsonl to json', 'ndjson to json', 'jsonl to json array', 'convert jsonl', 'jsonlines to json', 'jsonl converter'],
  },
  {
    slug: 'json-to-jsonl',
    name: 'JSON to JSONL Converter',
    icon: '📃',
    description:
      'Convert a JSON array into JSONL / NDJSON — one compact JSON object per line — ready for streaming, fine-tuning and log pipelines. In your browser.',
    lead: 'Turn a JSON array into JSONL: each element becomes one line of compact JSON, the format streaming tools and ML pipelines expect.',
    computeId: 'jsonToJsonl',
    sample: '[\n  { "name": "Ada", "role": "Engineer" },\n  { "name": "Raj", "role": "Designer" },\n  { "name": "Mai", "role": "PM" }\n]',
    accept: '.json,application/json',
    downloadName: 'data.jsonl',
    how: 'The converter parses your input as JSON, checks that the top level is an array, and writes each element as its own line of compact (single-line) JSON separated by newlines — the JSONL / NDJSON format. It is the exact inverse of the JSONL-to-JSON tool: an array of N objects becomes N lines. If the input isn\'t a JSON array (for example a single object), it tells you, because JSONL is a list of records by definition.',
    note: 'JSONL is what many systems want for bulk work: OpenAI and other LLM fine-tuning endpoints take JSONL training files, and data-warehouse loaders and log shippers stream it line by line. Producing it from a normal JSON array is a frequent last step before uploading a dataset. Because everything runs in your browser, training data and exports never leave your device.',
    faqs: [
      { q: 'How do I convert a JSON array to JSONL?', a: 'Paste or load a JSON array and the tool writes each element on its own line as compact JSON — that newline-delimited output is JSONL (NDJSON). Copy or download the result.' },
      { q: 'Why does it require an array?', a: 'JSONL is a sequence of records, so the converter needs a top-level array to know where each record begins and ends. A single object isn\'t a list, so it reports that instead of guessing.' },
      { q: 'What is JSONL used for?', a: 'Streaming and bulk data: LLM fine-tuning files (OpenAI and others), BigQuery and warehouse loads, and log pipelines all use one-record-per-line JSON so records can be appended and processed independently.' },
      { q: 'Is the output minified?', a: 'Each line is compact single-line JSON (that\'s the JSONL convention), while the lines themselves are separated by newlines so each record stays on its own row.' },
      { q: 'Is anything uploaded?', a: 'No — the conversion runs locally in your browser and works offline, so datasets stay private.' },
    ],
    keywords: ['json to jsonl', 'json to ndjson', 'json array to jsonl', 'convert json to jsonl', 'make jsonl file', 'jsonl for fine-tuning'],
  },
];

export function getFileTool(slug: string): FileToolDef | undefined {
  return FILE_TOOLS.find((t) => t.slug === slug);
}
