---
title: "How to Convert JSON to TypeScript Interfaces"
description: "To turn JSON into TypeScript, map each value to a type — strings to string, numbers to number, nested objects to their own interface, and keys missing from some array items to optional. Here's how inference works and how to do it instantly."
pubDate: 2026-07-28
updatedDate: 2026-07-28
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

## How the conversion works

A generator parses your JSON and walks it recursively, choosing a TypeScript type for each value:

- `"Ada"` → `string`
- `42` → `number`
- `true` → `boolean`
- `null` → `null`
- `["x", "y"]` → `string[]`
- `{ "kind": "cat" }` → a new interface (say `Pet`), referenced as `pet: Pet`

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

## The limits of inference

Types are only as good as the **sample** you paste:

- A field whose only value is `null` is typed `null` — widen it by hand if it can hold other values.
- **Empty arrays** become `any[]`, since there's no element to infer from.
- The generator can't know about fields that never appear in your sample.

Treat the output as a strong starting point, then adjust nullable and union types to match the real API contract.

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
