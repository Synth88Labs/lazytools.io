/**
 * Generate a Go struct definition from a JSON sample. Pure and deterministic.
 *
 * Type inference: integer → int, other number → float64, boolean → bool,
 * string → string, null / empty array → interface{}, nested object → a named
 * struct, array → slice of the element type. Each field keeps a json:"key" tag.
 */

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

function pascal(s: string): string {
  const parts = (s || '').replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
  let name = parts.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
  if (!/^[A-Za-z_]/.test(name)) name = 'F' + name;
  return name || 'Field';
}

function singular(s: string): string {
  return s.replace(/ies$/i, 'y').replace(/([^s])s$/i, '$1');
}

export function jsonToGo(input: string, rootName = 'Root'): { output: string; count: number } {
  let data: Json;
  try {
    data = JSON.parse(input);
  } catch (e) {
    throw new Error('Invalid JSON — ' + (e as Error).message);
  }

  const structs: string[] = [];
  const used = new Set<string>();
  const root = pascal(rootName) || 'Root';

  const uniqueName = (base: string): string => {
    let name = pascal(base) || 'Obj';
    let i = 1;
    while (used.has(name)) name = pascal(base) + ++i;
    used.add(name);
    return name;
  };

  const goType = (value: Json, keyHint: string): string => {
    if (value === null) return 'interface{}';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]interface{}';
      // Slice of objects → merge them into one named struct.
      if (value.every((x) => x !== null && typeof x === 'object' && !Array.isArray(x))) {
        return '[]' + objectStruct(value as Record<string, Json>[], singular(keyHint));
      }
      const inner = [...new Set(value.map((x) => goType(x, keyHint)))];
      return '[]' + (inner.length === 1 ? inner[0] : 'interface{}');
    }
    switch (typeof value) {
      case 'string': return 'string';
      case 'number': return Number.isInteger(value) ? 'int' : 'float64';
      case 'boolean': return 'bool';
      case 'object': return objectStruct([value as Record<string, Json>], keyHint);
      default: return 'interface{}';
    }
  };

  const objectStruct = (objs: Record<string, Json>[], keyHint: string, forceName?: string): string => {
    const name = forceName ?? uniqueName(singular(keyHint));
    if (forceName) used.add(forceName);
    const keys = new Map<string, Json>();
    for (const o of objs) for (const k of Object.keys(o)) {
      if (!keys.has(k) || keys.get(k) === null) keys.set(k, o[k]); // prefer a non-null sample for typing
    }
    const lines: string[] = [];
    let field = 0;
    for (const [k, v] of keys) {
      lines.push(`\t${pascal(k)} ${goType(v, k)} \`json:"${k}"\``);
      field++;
    }
    void field;
    const body = lines.length ? `\n${lines.join('\n')}\n` : '\n';
    structs.push(`type ${name} struct {${body}}`);
    return name;
  };

  if (Array.isArray(data)) {
    // Root is a slice; still emit a struct for the element if it's an object.
    goType(data, root);
  } else if (data !== null && typeof data === 'object') {
    objectStruct([data as Record<string, Json>], root, root);
  } else {
    // Scalar root — wrap in an aliasable type comment.
    return { output: `// Root JSON value is a ${typeof data}\ntype ${root} ${goType(data, root)}`, count: 0 };
  }

  // Structs were pushed deepest-first; reverse so the root reads top-down.
  const ordered = structs.reverse();
  return { output: ordered.join('\n\n'), count: ordered.length };
}
