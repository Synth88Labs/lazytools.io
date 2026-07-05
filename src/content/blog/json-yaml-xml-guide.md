---
title: "JSON vs YAML vs XML: Which Data Format for Which Job"
description: "APIs speak JSON, humans edit YAML, legacy systems demand XML. How the three formats differ, when each wins, the Norway problem, and how to convert between them without losing data."
pubDate: 2026-07-05
updatedDate: 2026-07-05
archetype: explainer
tools: ["/file/json-formatter/", "/file/json-to-yaml/", "/file/yaml-to-json/", "/file/xml-to-json/", "/file/json-to-xml/", "/file/markdown-to-html/"]
keywords:
  - json vs yaml
  - yaml vs xml
  - data format comparison
  - when to use yaml
  - json to yaml conversion
  - xml to json mapping
  - yaml norway problem
  - config file formats
heroImage: /blog/json-yaml-xml-guide.png
heroAlt: "JSON vs YAML vs XML — which data format for which job"
faqs:
  - q: "When should I use JSON vs YAML?"
    a: "JSON for machine-to-machine exchange (APIs, storage) — strict, fast, universally parsed. YAML for files humans edit (CI pipelines, Kubernetes, docker-compose) — comments and clean indentation earn their keep there, and nowhere else."
  - q: "Is YAML a superset of JSON?"
    a: "Effectively yes — every JSON document parses as valid YAML, which is why JSON→YAML conversion is lossless. The reverse can drop YAML-only features: comments, anchors/aliases, and custom tags."
  - q: "What is the YAML Norway problem?"
    a: "Under YAML 1.1 conventions, unquoted yes/no/on/off parse as booleans — so a country-code list containing NO becomes false. Quote such values (\"NO\") in the source; converters faithfully reflect what the spec says the document means."
  - q: "Why does XML still exist?"
    a: "Billions of documents and thousands of enterprise systems: SOAP services, RSS/Atom feeds, Office and SVG file formats, banking and healthcare standards. XML's schemas, namespaces and attributes solve document problems JSON never aimed at."
  - q: "Why does XML→JSON conversion have 'conventions'?"
    a: "JSON has no attributes and no repeated keys, so mappings must choose: attributes become @-prefixed keys, and repeated sibling elements become arrays. That's the widely used convention our converter follows — but a single item converts to an object while two convert to an array, so consuming code should handle both."
  - q: "Do comments survive conversion?"
    a: "No — neither JSON nor the converted output has anywhere to put YAML/XML comments, making them the one reliably lossy element. Keep a commented master copy if comments carry meaning."
draft: false
---

**The rule of thumb is one sentence: APIs speak JSON, humans edit YAML, legacy systems demand XML.**
All three encode the same tree-shaped data — the differences are syntax, features and ecosystem. The
[format converters](/file/) move between all of them locally; here's how to choose, and what to watch
when converting.

<aside class="key-takeaways">
<p class="kt-title">⚡ Key takeaways</p>
<ul>
<li><strong>JSON</strong> — machine exchange: strict, no comments, every language parses it natively</li>
<li><strong>YAML</strong> — human-edited configs: comments + indentation; superset of JSON</li>
<li><strong>XML</strong> — documents & legacy: attributes, namespaces, schemas; verbose but rigorous</li>
<li><strong>JSON→YAML is lossless;</strong> YAML→JSON drops comments and anchors</li>
<li><strong>The Norway problem:</strong> unquoted no/yes/on/off in YAML are booleans — quote them</li>
</ul>
</aside>

## The same data, three ways

<figure>
<img src="/blog/infographic-data-formats.svg" alt="Infographic: the same deployment config in JSON (strict braces, for APIs), YAML (indentation and comments, for configs humans edit) and XML (tags with closing elements, for legacy and document systems) — with the note that every JSON document is valid YAML" width="1200" height="620" loading="lazy" />
<figcaption>One config, three dialects — pick by who reads it most: machines, humans, or 2004.</figcaption>
</figure>

The formats' own specifications live at [json.org](https://www.json.org/),
[yaml.org](https://yaml.org/spec/) and the [W3C XML recommendation](https://www.w3.org/TR/xml/):

| | JSON | YAML | XML |
|---|---|---|---|
| Born | 2001 (Crockford) | 2001 | 1998 (W3C) |
| Comments | ✗ | ✓ | ✓ |
| Attributes | ✗ | ✗ | ✓ |
| Structure via | braces/brackets | indentation | tags |
| Typical home | APIs, storage | CI, Kubernetes, compose | SOAP, RSS, Office files |
| Failure mode | trailing commas | invisible indentation bugs | verbosity |

## When JSON wins

Anything a *machine* consumes: API payloads, data storage, inter-service messages. Its strictness is
the feature — one canonical syntax, native parsers in every language, no ambiguity about what `no`
means. Its weaknesses are human ones: no comments, unforgiving punctuation. (When JSON misbehaves, the
[formatter/validator](/file/json-formatter/) pinpoints the line and column — trailing commas and
single quotes account for most failures.)

## When YAML wins

Anything a *human* edits repeatedly: CI pipelines, Kubernetes manifests, docker-compose. Comments
document intent next to the config, and indentation reads cleanly — which is exactly why the
cloud-native ecosystem standardized on it. The costs are real too: whitespace is structure (one
mis-indented line changes meaning silently), tabs are forbidden, and YAML 1.1's clever scalars bite —
the famous **Norway problem**, where an unquoted `NO` in a country list parses as `false`. Quote
anything that must stay a string.

Converting: [JSON → YAML](/file/json-to-yaml/) is **always lossless** (YAML is a superset);
[YAML → JSON](/file/yaml-to-json/) resolves anchors and drops comments — the two things JSON can't
represent.

## When XML wins (still)

XML is where the documents are: RSS/Atom feeds, SOAP enterprise services, SVG, Office formats
(a .docx is zipped XML), banking and healthcare interchange standards. It has machinery JSON never
aimed at — attributes, namespaces, schema validation (XSD) — which suits *document* problems more
than *data* problems.

Converting is convention-bound because JSON lacks two XML concepts. In
[XML → JSON](/file/xml-to-json/): attributes become `@`-prefixed keys and repeated sibling elements
become arrays — with the classic gotcha that **one `<item>` maps to an object but two map to an
array**, so feed-consuming code must handle both shapes. In [JSON → XML](/file/json-to-xml/),
everything becomes elements (JSON has no attributes to translate), with your choice of root element.

## Choosing in practice: four quick scenarios

1. **Building an API** → JSON, no debate — it's what clients expect and parse natively.
2. **A config teammates will edit monthly** → YAML with comments explaining each knob.
3. **Feeding a legacy SOAP endpoint or RSS reader** → XML, converted from your JSON source at the edge.
4. **A README table or docs page** → neither; that's [Markdown](/file/markdown-to-html/) territory,
   one converter over.

The pattern behind all four: store data in one source format, **convert at the boundaries** rather
than hand-maintaining parallel copies that drift.

## Common conversion mistakes

1. **Editing YAML with tabs** — forbidden by spec; the parser error names the line. Spaces only.
2. **Unquoted no/yes/on/off in YAML** — booleans by 1.1 rules. Quote country codes and literal strings.
3. **Assuming XML→JSON has one true mapping** — it has conventions; know yours (@attributes, arrays).
4. **Expecting comments to round-trip** — they don't; JSON has nowhere to put them.
5. **Hand-writing the second format** — parallel JSON and YAML copies of one config *will* diverge;
   generate one from the other.

## Quick summary

JSON for machines, YAML for humans, XML for legacy and documents — one tree-shaped data model in
three syntaxes. JSON→YAML converts losslessly; the reverse drops comments; XML crossings follow the
@-attribute and repeated-element conventions. All six directions run in
[the file converters](/file/), locally, with file open and download — configs and payloads never
leave your machine.

*Related: [JSON formatter](/file/json-formatter/) for validation ·
[CSV ↔ JSON](/file/csv-to-json/) for tabular data · [naming cases](/blog/naming-cases-guide/) for the
keys inside these files.*
