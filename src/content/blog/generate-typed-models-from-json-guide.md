---
title: "Generate Typed Models from JSON: TypeScript, Go, Python, Rust & C#"
seoTitle: 'Generate Typed Models from JSON: 5 Languages'
description: "Turn a JSON sample into typed models — a TypeScript interface, Go struct, Python dataclass, Rust struct or C# class. How the mapping works, in your browser."
pubDate: 2026-08-01
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/generate-typed-models-from-json-guide.png
heroAlt: "One JSON sample mapping to typed models in TypeScript, Go, Python, Rust and C#"
tools: ["/dev/json-to-typescript/", "/dev/json-to-go/", "/dev/json-to-python/", "/dev/json-to-rust/", "/dev/json-to-csharp/"]
keywords:
  - json to typed model
  - json to struct
  - json to dataclass
  - json to interface
  - generate types from json
  - json to go python rust csharp
  - typed models from json
faqs:
  - q: "How do I generate typed models from a JSON sample?"
    a: "Paste a representative JSON example into a converter for your language: it infers each field's type, turns nested objects into their own types, and marks fields that aren't always present as optional. LazyTools has one for each language — TypeScript interfaces, Go structs, Python dataclasses, Rust serde structs, and C# classes — and each runs entirely in your browser."
  - q: "How are numbers typed when generating models from JSON?"
    a: "JSON has a single number type, so converters infer from the value: a whole number becomes an integer type (int, i64) and a number with a decimal point becomes a floating type (float, float64, f64, double). Because inference only sees your sample, widen the type by hand when a field can be fractional or exceed 32 bits."
  - q: "How do converters decide which fields are optional?"
    a: "For a single object, every key present is treated as required. For an array of objects, a field is optional if it's missing from any element — those become Optional[...] in Python, Option<...> in Rust, nullable/`?` in others. A field that's always present is required."
  - q: "Do the generated models keep the original JSON key names?"
    a: "Yes. Where a language renames a field to its own convention — Go and C# PascalCase, Rust snake_case — the converter adds a tag or attribute that preserves the original key: a Go json:\"key\" tag, a Rust #[serde(rename=\"key\")] attribute, or a C# [JsonPropertyName(\"key\")] attribute, so (de)serialization still matches the JSON."
  - q: "Are generated models ready to use as-is?"
    a: "They're a strong scaffold, not a final contract. Inference can't see string formats (dates, emails), numeric ranges, enums, or which fields are truly optional beyond your sample. Feed the converter a rich example covering optional fields, then tighten types, nullability and names by hand."
  - q: "Is my JSON uploaded to generate the models?"
    a: "Not with the LazyTools converters. Every one runs entirely in your browser using the File and JSON APIs, so your data — which is often a real API response — never leaves your device, and they work offline."
draft: false
---

**A JSON sample describes a *shape*, and that one shape maps to a typed model in any language: an
object becomes a struct/class/interface, each key becomes a typed field, nested objects become their
own types, and arrays become typed lists.** Once you see the mapping, generating a TypeScript
interface, a Go struct, a Python dataclass, a Rust serde struct, or a C# class from JSON is the same
job with different syntax. Paste your JSON into the converter for your language —
[TypeScript](/dev/json-to-typescript/), [Go](/dev/json-to-go/), [Python](/dev/json-to-python/),
[Rust](/dev/json-to-rust/) or [C#](/dev/json-to-csharp/) — and it runs entirely in your browser.

<aside class="key-takeaways">

**Key takeaways**

- One JSON shape maps to a typed model in every language: object → type, key → typed field, nested object → nested type, array → typed list.
- Because JSON has a single number type, converters guess `int` from whole numbers and a float type from decimals — widen these by hand when the data can exceed the guess.
- A field is only marked optional when your sample proves it can be absent, so feed the tool a representative example that actually includes the optional fields.
- Go, Rust and C# rename fields to their own casing but attach a tag/attribute (`json:"…"`, `#[serde(rename=…)]`, `[JsonPropertyName("…")]`) so serialization still round-trips.
- Inference can't see dates, emails, enums or numeric ranges — treat the output as a scaffold and tighten it afterward.

</aside>

## The same shape, five languages

Take one JSON object:

```json
{ "id": 42, "user_name": "ada", "is_active": true, "scores": [10, 20] }
```

Here's the field-type mapping each converter applies:

| JSON value | TypeScript | Go | Python | Rust | C# |
|---|---|---|---|---|---|
| `42` (whole) | `number` | `int` | `int` | `i64` | `int` |
| `1.5` (decimal) | `number` | `float64` | `float` | `f64` | `double` |
| `"ada"` | `string` | `string` | `str` | `String` | `string` |
| `true` | `boolean` | `bool` | `bool` | `bool` | `bool` |
| `[10, 20]` | `number[]` | `[]int` | `List[int]` | `Vec<i64>` | `List<int>` |
| `{ … }` | nested `interface` | nested `struct` | nested `@dataclass` | nested `struct` | nested `class` |
| `null` | `null` | `interface{}` | `Optional[Any]` | `Option<Value>` | `object` |

Same shape in, idiomatic types out.

<figure class="my-8">
<svg viewBox="0 0 1200 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One JSON object maps to a TypeScript interface, Go struct, Python dataclass, Rust struct and C# class" style="width:100%;height:auto;background:#f8fafc;border-radius:16px">
  <text x="600" y="56" text-anchor="middle" font-family="system-ui,sans-serif" font-size="38" font-weight="800" fill="#0f172a">One JSON shape → five typed models</text>

  <!-- center JSON -->
  <rect x="470" y="100" width="260" height="110" rx="16" fill="#eef2ff" stroke="#6366f1" stroke-width="3"/>
  <text x="600" y="150" text-anchor="middle" font-family="ui-monospace,monospace" font-size="24" font-weight="800" fill="#4338ca">JSON sample</text>
  <text x="600" y="184" text-anchor="middle" font-family="ui-monospace,monospace" font-size="20" fill="#4338ca">{ id, name, … }</text>

  <!-- five targets -->
  <g font-family="system-ui,sans-serif" font-size="23" font-weight="700">
    <rect x="60"  y="320" width="200" height="150" rx="14" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
    <text x="160" y="378" text-anchor="middle" fill="#075985">TypeScript</text>
    <text x="160" y="412" text-anchor="middle" font-size="19" fill="#075985">interface</text>

    <rect x="290" y="320" width="200" height="150" rx="14" fill="#cffafe" stroke="#0891b2" stroke-width="3"/>
    <text x="390" y="378" text-anchor="middle" fill="#155e75">Go</text>
    <text x="390" y="412" text-anchor="middle" font-size="19" fill="#155e75">struct + tags</text>

    <rect x="520" y="320" width="200" height="150" rx="14" fill="#fef9c3" stroke="#ca8a04" stroke-width="3"/>
    <text x="620" y="378" text-anchor="middle" fill="#854d0e">Python</text>
    <text x="620" y="412" text-anchor="middle" font-size="19" fill="#854d0e">@dataclass</text>

    <rect x="750" y="320" width="200" height="150" rx="14" fill="#ffedd5" stroke="#ea580c" stroke-width="3"/>
    <text x="850" y="378" text-anchor="middle" fill="#9a3412">Rust</text>
    <text x="850" y="412" text-anchor="middle" font-size="19" fill="#9a3412">serde struct</text>

    <rect x="980" y="320" width="160" height="150" rx="14" fill="#f3e8ff" stroke="#9333ea" stroke-width="3"/>
    <text x="1060" y="378" text-anchor="middle" fill="#6b21a8">C#</text>
    <text x="1060" y="412" text-anchor="middle" font-size="19" fill="#6b21a8">class</text>
  </g>

  <!-- connectors -->
  <g stroke="#94a3b8" stroke-width="2" fill="none">
    <path d="M540 210 C 400 260, 220 270, 160 320"/>
    <path d="M565 210 C 480 260, 420 280, 390 320"/>
    <path d="M600 210 L 620 320"/>
    <path d="M635 210 C 720 260, 800 280, 850 320"/>
    <path d="M660 210 C 820 260, 1000 270, 1060 320"/>
  </g>

  <text x="600" y="515" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#64748b">Field names keep their JSON key via tags / rename / JsonPropertyName attributes</text>
</svg>
</figure>

## A worked example, side by side

Take the same object again:

```json
{ "id": 42, "user_name": "ada", "is_active": true, "scores": [10, 20] }
```

Here is what each converter emits. The syntax differs, but the *shape* — four fields, one of them a
list of integers — is identical everywhere.

**TypeScript**

```ts
interface Root {
  id: number;
  user_name: string;
  is_active: boolean;
  scores: number[];
}
```

**Go** (note the tags preserving the snake_case keys):

```go
type Root struct {
    ID       int    `json:"id"`
    UserName string `json:"user_name"`
    IsActive bool   `json:"is_active"`
    Scores   []int  `json:"scores"`
}
```

**Python**

```python
from dataclasses import dataclass
from typing import List

@dataclass
class Root:
    id: int
    user_name: str
    is_active: bool
    scores: List[int]
```

**Rust** (serde derives so it can (de)serialize):

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Root {
    id: i64,
    user_name: String,
    is_active: bool,
    scores: Vec<i64>,
}
```

**C#** (with `System.Text.Json`, add `[JsonPropertyName]` where the property casing diverges from the key):

```csharp
using System.Collections.Generic;
using System.Text.Json.Serialization;

public class Root
{
    [JsonPropertyName("id")]        public int Id { get; set; }
    [JsonPropertyName("user_name")] public string UserName { get; set; }
    [JsonPropertyName("is_active")] public bool IsActive { get; set; }
    [JsonPropertyName("scores")]    public List<int> Scores { get; set; }
}
```

Five files, one mental model. Once you internalise the mapping, switching languages is a change of
syntax, not of thinking.

## Naming: keeping the JSON key

Languages disagree on casing. Go and C# want `PascalCase` fields; Rust wants `snake_case`. When the
generated field name differs from the JSON key, a good converter preserves the original key so
serialization still round-trips:

- **Go** — a struct tag: `UserName string \`json:"user_name"\``
- **Rust** — an attribute: `#[serde(rename = "userName")]`
- **C#** — an attribute: `[JsonPropertyName("user_name")]`
- **Python / TypeScript** — the key is usually a valid identifier already, so it's kept as-is.

That detail is easy to forget by hand and is exactly where mismatches (a field that silently
deserializes to its default) come from.

## Optional vs required

With a single object, every key present is required. The interesting case is an **array of objects**
where the elements don't all share the same keys:

```json
[ { "id": 1, "nickname": "a" }, { "id": 2 } ]
```

Here `id` is in every element (required) but `nickname` is not (optional). Converters express that as
`Optional[...]` in Python, `Option<...>` in Rust, and nullable/`?` fields elsewhere. Feeding the
converter a **representative** sample — one that includes the optional fields — is what makes this
accurate.

Each language spells "this might be absent" differently. When you review the output, this is the
column to sanity-check:

| Language | Optional field | Idiomatic default handling |
|---|---|---|
| TypeScript | `nickname?: string` | `undefined` when the key is missing |
| Go | `Nickname *string` + `json:"nickname,omitempty"` | `nil` pointer distinguishes absent from empty |
| Python | `nickname: Optional[str] = None` | dataclass default of `None` |
| Rust | `nickname: Option<String>` | serde reads a missing key as `None` automatically |
| C# | `string? Nickname` | `null` reference (nullable reference types enabled) |

A subtle point: in JSON, "the key is missing" and "the key is present but `null`" are two different
states. Go pointers and Rust's `Option` can tell them apart; a plain nullable often cannot. If that
distinction matters to your API, decide it deliberately rather than accepting the inferred default.

## Where to refine the output

Type inference is a scaffold, not a spec. Plan to adjust:

- **Number width** — a whole number becomes `int`/`i64`; widen to `long`/`u64`/`float` where the data
  demands.
- **String formats** — a date or email is just `string`; the JSON gives no hint. Add validation
  separately.
- **Nullability & defaults** — decide which optional fields need a default value versus a nullable type.
- **Enums** — a field that's really one of a fixed set is inferred as `string`; promote it to an enum.

## Why generate them in the browser

The JSON you paste is usually a **real API response** — sometimes from an internal or authenticated
endpoint. A generator that uploads it to a server has seen that payload. Every LazyTools converter —
[TypeScript](/dev/json-to-typescript/), [Go](/dev/json-to-go/), [Python](/dev/json-to-python/),
[Rust](/dev/json-to-rust/), [C#](/dev/json-to-csharp/) — parses and generates entirely in your
browser, so nothing leaves your device and it all works offline.

## The bottom line

Generating typed models from JSON is one mapping — object → type, key → typed field, nested → nested
type, array → typed list, "missing sometimes" → optional — expressed in whichever language you're
working in. Start from a representative sample, let the converter write the boilerplate, and spend
your time on the parts inference can't see: formats, ranges, enums and true nullability.
