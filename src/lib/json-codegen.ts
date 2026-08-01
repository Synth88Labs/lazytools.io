/**
 * Generate typed data structures (Go / Python / Rust / C#) from a JSON sample.
 * Pure and deterministic. One shared recursive walker infers the shape; a small
 * per-language spec decides scalar type names, containers and how a struct/class
 * is rendered. For an array of objects the elements are merged into one type.
 */

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

interface Field {
  key: string; // original JSON key
  type: string; // language type expression
  optional: boolean; // absent in some elements of a merged array-of-objects
}

interface LangSpec {
  /** scalar leaf type for a concrete value (never null/array/object) */
  scalar: (v: number | string | boolean) => string;
  nullType: string;
  emptyArray: string;
  arrayOf: (inner: string) => string;
  /** render one struct/class definition */
  render: (name: string, fields: Field[]) => string;
  /** deepest-first push order is reversed unless this is false */
  reverse?: boolean;
  header?: (rootName: string) => string;
}

function pascal(s: string): string {
  const parts = (s || '').replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
  let name = parts.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  if (!/^[A-Za-z_]/.test(name)) name = 'F' + name;
  return name || 'Field';
}
function singular(s: string): string {
  return s.replace(/ies$/i, 'y').replace(/([^s])s$/i, '$1');
}

function generate(input: string, rootName: string, spec: LangSpec): { output: string; count: number } {
  let data: Json;
  try {
    data = JSON.parse(input);
  } catch (e) {
    throw new Error('Invalid JSON — ' + (e as Error).message);
  }

  const defs: string[] = [];
  const used = new Set<string>();
  const root = pascal(rootName) || 'Root';

  const uniqueName = (base: string): string => {
    let name = pascal(base) || 'Obj';
    let i = 1;
    while (used.has(name)) name = pascal(base) + ++i;
    used.add(name);
    return name;
  };

  const typeOf = (value: Json, keyHint: string): string => {
    if (value === null) return spec.nullType;
    if (Array.isArray(value)) {
      if (value.length === 0) return spec.emptyArray;
      if (value.every((x) => x !== null && typeof x === 'object' && !Array.isArray(x))) {
        return spec.arrayOf(objectDef(value as Record<string, Json>[], singular(keyHint)));
      }
      const inner = [...new Set(value.map((x) => typeOf(x, keyHint)))];
      return spec.arrayOf(inner.length === 1 ? inner[0] : spec.nullType);
    }
    switch (typeof value) {
      case 'string': return spec.scalar(value as string);
      case 'number': return spec.scalar(value as number);
      case 'boolean': return spec.scalar(value as boolean);
      case 'object': return objectDef([value as Record<string, Json>], keyHint);
      default: return spec.nullType;
    }
  };

  const objectDef = (objs: Record<string, Json>[], keyHint: string, forceName?: string): string => {
    const name = forceName ?? uniqueName(singular(keyHint));
    if (forceName) used.add(forceName);
    const keys = new Map<string, { sample: Json; present: number }>();
    for (const o of objs) for (const k of Object.keys(o)) {
      const e = keys.get(k);
      if (!e) keys.set(k, { sample: o[k], present: 1 });
      else { e.present++; if (e.sample === null) e.sample = o[k]; }
    }
    const fields: Field[] = [];
    for (const [k, e] of keys) {
      fields.push({ key: k, type: typeOf(e.sample, k), optional: e.present < objs.length });
    }
    defs.push(spec.render(name, fields));
    return name;
  };

  if (Array.isArray(data)) {
    typeOf(data, root);
  } else if (data !== null && typeof data === 'object') {
    objectDef([data as Record<string, Json>], root, root);
  } else {
    return { output: `// Root JSON value is a scalar: ${typeOf(data, root)}`, count: 0 };
  }

  const ordered = spec.reverse === false ? defs : defs.reverse();
  const header = spec.header ? spec.header(root) : '';
  return { output: (header + ordered.join('\n\n')).trim(), count: ordered.length };
}

// ---------- Go ----------
const goField = (k: string) => pascal(k);
export function jsonToGo(input: string, rootName = 'Root'): { output: string; count: number } {
  return generate(input, rootName, {
    scalar: (v) => (typeof v === 'number' ? (Number.isInteger(v) ? 'int' : 'float64') : typeof v === 'boolean' ? 'bool' : 'string'),
    nullType: 'interface{}',
    emptyArray: '[]interface{}',
    arrayOf: (inner) => '[]' + inner,
    render: (name, fields) =>
      `type ${name} struct {\n${fields.map((f) => `\t${goField(f.key)} ${f.type} \`json:"${f.key}"\``).join('\n')}\n}`,
  });
}

// ---------- Python (dataclasses) ----------
const pyIdent = (k: string) => /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : k.replace(/[^A-Za-z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
export function jsonToPython(input: string, rootName = 'Root'): { output: string; count: number } {
  return generate(input, rootName, {
    scalar: (v) => (typeof v === 'number' ? (Number.isInteger(v) ? 'int' : 'float') : typeof v === 'boolean' ? 'bool' : 'str'),
    nullType: 'Optional[Any]',
    emptyArray: 'List[Any]',
    arrayOf: (inner) => `List[${inner}]`,
    reverse: false, // dataclasses must be defined before they're referenced → deepest first
    header: () => 'from __future__ import annotations\nfrom dataclasses import dataclass\nfrom typing import Any, List, Optional\n\n\n',
    render: (name, fields) =>
      `@dataclass\nclass ${name}:\n${fields.length ? fields.map((f) => `    ${pyIdent(f.key)}: ${f.optional ? `Optional[${f.type}]` : f.type}`).join('\n') : '    pass'}`,
  });
}

// ---------- Rust (serde) ----------
const rustField = (k: string) => /^[a-z_][a-z0-9_]*$/.test(k)
  ? k
  : k.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[^A-Za-z0-9_]/g, '_').replace(/^([0-9])/, '_$1').toLowerCase();
export function jsonToRust(input: string, rootName = 'Root'): { output: string; count: number } {
  return generate(input, rootName, {
    scalar: (v) => (typeof v === 'number' ? (Number.isInteger(v) ? 'i64' : 'f64') : typeof v === 'boolean' ? 'bool' : 'String'),
    nullType: 'Option<serde_json::Value>',
    emptyArray: 'Vec<serde_json::Value>',
    arrayOf: (inner) => `Vec<${inner}>`,
    header: () => 'use serde::{Deserialize, Serialize};\n\n',
    render: (name, fields) =>
      `#[derive(Serialize, Deserialize)]\nstruct ${name} {\n${fields
        .map((f) => {
          const fn = rustField(f.key);
          const rename = fn !== f.key ? `    #[serde(rename = "${f.key}")]\n` : '';
          const ty = f.optional ? `Option<${f.type}>` : f.type;
          return `${rename}    ${fn}: ${ty},`;
        })
        .join('\n')}\n}`,
  });
}

// ---------- C# (System.Text.Json) ----------
export function jsonToCsharp(input: string, rootName = 'Root'): { output: string; count: number } {
  return generate(input, rootName, {
    scalar: (v) => (typeof v === 'number' ? (Number.isInteger(v) ? 'int' : 'double') : typeof v === 'boolean' ? 'bool' : 'string'),
    nullType: 'object',
    emptyArray: 'List<object>',
    arrayOf: (inner) => `List<${inner}>`,
    header: () => 'using System.Collections.Generic;\nusing System.Text.Json.Serialization;\n\n',
    render: (name, fields) =>
      `public class ${name}\n{\n${fields
        .map((f) => {
          const prop = pascal(f.key);
          const attr = prop !== f.key ? `    [JsonPropertyName("${f.key}")]\n` : '';
          return `${attr}    public ${f.type} ${prop} { get; set; }`;
        })
        .join('\n\n')}\n}`,
  });
}
