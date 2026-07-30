/**
 * Structural (semantic) JSON diff — key-aware, order-insensitive for object
 * keys, index-based for arrays. Pure and deterministic, so it is Node-tested.
 * Distinct from a line-based text diff: it compares the parsed data, not the
 * text, so reformatting or key reordering produces "no changes".
 */

export type ChangeType = 'added' | 'removed' | 'changed';

export interface Change {
  /** dot/bracket path, e.g. `user.roles[2]` */
  path: string;
  type: ChangeType;
  oldValue?: unknown;
  newValue?: unknown;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  }
  if (isObject(a) && isObject(b)) {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    return ak.length === bk.length && ak.every((k) => k in b && deepEqual(a[k], b[k]));
  }
  return false;
}

function join(base: string, key: string | number): string {
  if (typeof key === 'number') return `${base}[${key}]`;
  return base ? `${base}.${key}` : key;
}

/** Recursively collect the differences from `a` (old) to `b` (new). */
export function diffJson(a: unknown, b: unknown, path = ''): Change[] {
  const changes: Change[] = [];

  if (Array.isArray(a) && Array.isArray(b)) {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (i >= a.length) changes.push({ path: join(path, i), type: 'added', newValue: b[i] });
      else if (i >= b.length) changes.push({ path: join(path, i), type: 'removed', oldValue: a[i] });
      else changes.push(...diffJson(a[i], b[i], join(path, i)));
    }
    return changes;
  }

  if (isObject(a) && isObject(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      const inA = k in a;
      const inB = k in b;
      if (inA && !inB) changes.push({ path: join(path, k), type: 'removed', oldValue: a[k] });
      else if (!inA && inB) changes.push({ path: join(path, k), type: 'added', newValue: b[k] });
      else changes.push(...diffJson(a[k], b[k], join(path, k)));
    }
    return changes;
  }

  if (!deepEqual(a, b)) {
    changes.push({ path: path || '(root)', type: 'changed', oldValue: a, newValue: b });
  }
  return changes;
}

/** Human-readable summary of the changes. */
export function formatDiff(changes: Change[]): string {
  if (changes.length === 0) return 'No differences — the two JSON documents are structurally identical.';
  const j = (v: unknown) => JSON.stringify(v);
  return changes
    .map((c) => {
      if (c.type === 'added') return `+ ${c.path}: ${j(c.newValue)}`;
      if (c.type === 'removed') return `- ${c.path}: ${j(c.oldValue)}`;
      return `~ ${c.path}: ${j(c.oldValue)} → ${j(c.newValue)}`;
    })
    .join('\n');
}
