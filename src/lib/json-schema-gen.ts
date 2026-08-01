/**
 * Infer a JSON Schema (draft-07) from a JSON sample. Pure and deterministic.
 *
 * Type inference: null → "null", integers → "integer", other numbers → "number",
 * booleans, strings, arrays and objects. For an array of objects the item schema
 * is the union of the elements' properties; a property is `required` only when it
 * appears in every element (and, for the root object, always).
 */

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };
type Schema = Record<string, unknown>;

function typeName(v: Json): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  if (typeof v === 'number') return Number.isInteger(v) ? 'integer' : 'number';
  return typeof v; // 'boolean' | 'string' | 'object'
}

function mergeObjectSchema(objs: Record<string, Json>[]): Schema {
  const keys = new Map<string, { values: Json[]; present: number }>();
  for (const o of objs) {
    for (const k of Object.keys(o)) {
      if (!keys.has(k)) keys.set(k, { values: [], present: 0 });
      const e = keys.get(k)!;
      e.values.push(o[k]);
      e.present++;
    }
  }
  const properties: Schema = {};
  const required: string[] = [];
  for (const [k, e] of keys) {
    properties[k] = schemaOf(e.values);
    if (e.present === objs.length) required.push(k);
  }
  const out: Schema = { type: 'object', properties };
  if (required.length) out.required = required;
  return out;
}

/** Build a schema describing a set of sample values (their union). */
function schemaOf(samples: Json[]): Schema {
  const types = new Set(samples.map(typeName));

  // All objects → merge their shapes.
  if (samples.length && samples.every((s) => s !== null && typeof s === 'object' && !Array.isArray(s))) {
    return mergeObjectSchema(samples as Record<string, Json>[]);
  }
  // All arrays → item schema is the union of every element across all the arrays.
  if (samples.length && samples.every((s) => Array.isArray(s))) {
    const items = (samples as Json[][]).flat();
    return { type: 'array', items: items.length ? schemaOf(items) : {} };
  }
  // Scalars (possibly mixed). "integer" and "number" collapse to "number".
  const t = [...types];
  if (t.includes('integer') && t.includes('number')) {
    t.splice(t.indexOf('integer'), 1);
  }
  if (t.length === 1) return { type: t[0] };
  return { type: t };
}

export function jsonToSchema(input: string, indent = 2): string {
  let data: Json;
  try {
    data = JSON.parse(input);
  } catch (e) {
    throw new Error('Invalid JSON — ' + (e as Error).message);
  }
  const schema: Schema = { $schema: 'http://json-schema.org/draft-07/schema#', ...schemaOf([data]) };
  return JSON.stringify(schema, null, indent);
}
