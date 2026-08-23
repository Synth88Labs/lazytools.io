---
title: "How to Convert JSON to TypeScript Interfaces"
description: "To turn JSON into TypeScript, map each value to a type — strings to string, numbers to number, nested objects to their own interface, and keys missing from some array items to optional. Here's how inference works and how to do it instantly."
pubDate: 2026-07-28
updatedDate: 2026-08-23
archetype: explainer
heroImage: /blog/json-to-typescript-guide.png
heroAlt: "JSON values mapped to TypeScript interface fields, with nested objects becoming their own interface."
tools: ["/dev/json-to-typescript/"]
keywords:
  - json to typescript
  - json to interface
  - generate typescript types from json
  - json to ts
  - typescript interface generator

faqs:
  - q: "How do I convert JSON to a TypeScript interface?"
    a: "Infer a type for every value: strings become string, numbers number, booleans boolean, arrays T[], and each nested object becomes its own named interface. A generator walks the JSON structure and writes these interfaces for you automatically."
  - q: "How are JSON arrays converted to TypeScript types?"
    a: "An array of a single type becomes T[] (for example ['x','y'] becomes string[]). An array of objects becomes its own interface plus a Thing[] reference, so the shared shape of the elements is typed once and reused."
  - q: "What happens to a key that is missing from some array items?"
    a: "A key that appears in some array elements but not others is marked optional with a ? so TypeScript knows the value may be undefined. This prevents an undefined value from slipping through at runtime."
  - q: "How does JSON to TypeScript handle dates and integers?"
    a: "JSON has no date type and no integer/float distinction, so 42 and 3.14 both become number, and an ISO date string like '2026-08-23' becomes plain string. TypeScript cannot tell a date from any other string at the type level, so narrow those by hand if it matters."
  - q: "What is a union type in a generated interface?"
    a: "When the same key appears with more than one type across your sample, the generator produces a union such as string | number so the field accepts either value accurately."
  - q: "Is my JSON uploaded to a server when I convert it?"
    a: "No. The LazyTools JSON-to-TypeScript generator runs entirely in your browser, so the JSON you paste is parsed locally and never sent to a server."
draft: false
---

**To convert JSON into TypeScript, infer a type for every value: strings become `string`, numbers `number`, booleans `boolean`, arrays `T[]`, and each nested object becomes its own named interface.** Paste a JSON object into a [JSON-to-TypeScript generator](/dev/json-to-typescript/) and it walks the structure and writes the interfaces for you — including optional keys and unions where an array's objects differ. It's the fastest way to get typed models for an API response.

<aside class="key-takeaways">

**Key takeaways**

- **Primitive mapping:** string → `string`, number → `number`, boolean → `boolean`, null → `null`.
- **Arrays** become `T[]`; an array of objects becomes its own interface.
- **Nested objects** are broken out into separate named interfaces (a `pet` object → a `Pet` interface).
- **Optional keys:** a key missing from some array elements is marked with `?`.
- **Unions:** a key that appears with more than one type becomes e.g. `string | number`.
- Types are inferred from your **sample**, so widen `null`/`any` fields by hand where needed.

</aside>

<figure>
<img src="/blog/infographic-json-ts.svg" alt="JSON with id, name, active, tags and a nested pet object maps to a TypeScript Root interface (id: number, name: string, active: boolean, tags: string[], pet: Pet) plus a separate Pet interface." width="1200" height="700" loading="lazy" />
<figcaption>Each JSON value maps to a type; nested objects become their own interface.</figcaption>
</figure>

## Why hand-typing API responses is a losing game

Writing interfaces by hand for a real API response is slow and error-prone. A single endpoint can return dozens of fields, several levels of nesting, and arrays whose elements do not all share the same keys. Miss one optional field and TypeScript will happily let an `undefined` slip through until it crashes at runtime. Inference from a concrete sample removes the guesswork: the shape you paste *is* the contract, so the generated types match the data exactly rather than matching what you remembered the data to be.

JSON has only six value kinds — string, number, boolean, null, array, and object — and TypeScript has a natural home for each. That small, fixed mapping is what makes reliable automatic conversion possible.

## How the conversion works

A generator parses your JSON and walks it recursively, choosing a TypeScript type for each value. The core rules are a direct one-to-one mapping:

| JSON value | Example | TypeScript type |
| --- | --- | --- |
| String | `"Ada"` | `string` |
| Number (int or float) | `42`, `3.14` | `number` |
| Boolean | `true` | `boolean` |
| Null | `null` | `null` |
| Array of one type | `["x", "y"]` | `string[]` |
| Array of objects | `[{…}, {…}]` | `Thing[]` + a `Thing` interface |
| Object | `{ "kind": "cat" }` | a new named interface, referenced by field |

Note that JSON has no integer/float distinction and no date type: `42` and `3.14` both become `number`, and an ISO date string like `"2026-08-23"` becomes plain `string` — TypeScript cannot tell a date from any other string at the type level, so you narrow those by hand if it matters.

So this JSON:

```json
{ "id": 1, "name": "Ada", "active": true, "tags": ["x"], "pet": { "kind": "cat" } }
```

becomes:

```ts
interface Root {
  id: number;
  name: string;
  active: boolean;
  tags: string[];
  pet: Pet;
}

interface Pet {
  kind: string;
}
```

## Optional keys and unions

When your JSON is an **array of objects**, the generator merges their shapes:

- A key present in **only some** elements becomes **optional** (`gift?: boolean`).
- A key that appears with **different types** becomes a **union** (`id: string | number`).

```json
[{ "sku": "X1", "qty": 2 }, { "sku": "X2", "qty": 3, "gift": true }]
```

```ts
interface Order {
  sku: string;
  qty: number;
  gift?: boolean;
}
```

This is exactly what you want for real API data, where optional fields are common.

## A fuller worked example

Real responses nest arrays inside objects inside arrays. Take a small order payload:

```json
{
  "orderId": "A-1001",
  "customer": { "name": "Ada", "vip": true },
  "items": [
    { "sku": "X1", "qty": 2 },
    { "sku": "X2", "qty": 1, "giftWrap": true }
  ]
}
```

A generator produces a named interface for every distinct object shape and wires them together:

```ts
interface Root {
  orderId: string;
  customer: Customer;
  items: Item[];
}

interface Customer {
  name: string;
  vip: boolean;
}

interface Item {
  sku: string;
  qty: number;
  giftWrap?: boolean;
}
```

Notice three things at once: `customer` became its own `Customer` interface, `items` became `Item[]` from a single merged `Item` shape, and `giftWrap` is optional because it appears in only one of the two items. That is the whole value of inference in one example — you would have had to spot the missing key yourself.

## interface vs type alias

Most generators let you emit either an `interface` or a `type` alias, and for a plain object shape the two are interchangeable. The differences only matter at the edges:

| Aspect | `interface` | `type` alias |
| --- | --- | --- |
| Object shapes | Yes | Yes |
| Declaration merging | Supported | Not supported |
| Unions / intersections at top level | No | Yes (`type Id = string \| number`) |
| Extending | `extends` | `&` intersection |

A common convention is to prefer `interface` for object models and reach for `type` when you need a union, a tuple, or a mapped type. Pick whichever matches your codebase's existing style — consistency matters more than the choice itself.

## The limits of inference

Types are only as good as the **sample** you paste:

- A field whose only value is `null` is typed `null` — widen it by hand if it can hold other values.
- **Empty arrays** become `any[]`, since there's no element to infer from.
- The generator can't know about fields that never appear in your sample.

Treat the output as a strong starting point, then adjust nullable and union types to match the real API contract.

A practical habit: paste the **largest, most complete** sample you have — ideally one that exercises optional fields and every variant. The more the sample resembles the full range of real responses, the fewer manual fixes you make afterward. If your API documents nullable fields, reconcile the generated `null` types against that documentation rather than trusting a single lucky response.

## Do it privately

API responses can contain sensitive data — tokens, personal details, internal IDs. A [browser-based JSON-to-TypeScript tool](/dev/json-to-typescript/) does the inference **locally in your browser**, so the JSON you paste is never uploaded to a server. You can also switch the output between `interface` and `type` aliases to match your codebase's style.

## FAQ

**How do I convert JSON to a TypeScript interface?**
Paste your JSON into a [generator](/dev/json-to-typescript/) and it infers an interface for it, breaking nested objects into their own named interfaces. Copy the result into your `.ts` file.

**Does it detect optional and union types?**
Yes. In an array of objects, a key missing from some elements is marked optional (`?`), and a key that appears with different value types becomes a union like `string | number`.

**Can I get `type` aliases instead of `interface`?**
Yes — most generators (including this one) let you switch the output to `type X = { … }` instead of `interface X { … }`. Both describe the same shape.

**Why is a field typed `null` or `any`?**
A field whose only sample value is `null` is typed `null` — widen it manually if it can hold other values. Empty arrays become `any[]` because there's nothing to infer the element type from.

**Is it safe to paste a real API response?**
With a browser-based tool, yes — the JSON is parsed locally and never uploaded, so even responses containing tokens or personal data stay on your device.

**Does it handle deeply nested JSON?**
Yes. The generator recurses through nested objects and arrays, creating a named interface for each object shape and referencing them, so even complex structures produce clean, reusable types.
