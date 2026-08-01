/**
 * Set operations over two text lists (one item per line) — common, unique to
 * each, and union. Pure and deterministic, so Node-tested. Distinct from a
 * line/character text diff: this compares the two lists as SETS (order-
 * independent, de-duplicated), which is what "compare two lists" means.
 */

export interface ListComparison {
  common: string[];
  onlyA: string[];
  onlyB: string[];
  union: string[];
}

export interface ListOpts {
  caseSensitive?: boolean;
  trim?: boolean;
  ignoreEmpty?: boolean;
}

/** Split text into a de-duplicated, order-preserving list plus a key set. */
function toList(text: string, opts: Required<ListOpts>): { list: string[]; keys: Set<string> } {
  const keyOf = (s: string) => (opts.caseSensitive ? s : s.toLowerCase());
  const seen = new Set<string>();
  const list: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const s = opts.trim ? raw.trim() : raw;
    if (opts.ignoreEmpty && s === '') continue;
    const k = keyOf(s);
    if (!seen.has(k)) {
      seen.add(k);
      list.push(s);
    }
  }
  return { list, keys: seen };
}

export function compareLists(aText: string, bText: string, opts: ListOpts = {}): ListComparison {
  const o: Required<ListOpts> = {
    caseSensitive: opts.caseSensitive ?? false,
    trim: opts.trim ?? true,
    ignoreEmpty: opts.ignoreEmpty ?? true,
  };
  const keyOf = (s: string) => (o.caseSensitive ? s : s.toLowerCase());
  const A = toList(aText, o);
  const B = toList(bText, o);

  const common = A.list.filter((s) => B.keys.has(keyOf(s)));
  const onlyA = A.list.filter((s) => !B.keys.has(keyOf(s)));
  const onlyB = B.list.filter((s) => !A.keys.has(keyOf(s)));

  const union = [...A.list];
  const unionKeys = new Set(A.keys);
  for (const s of B.list) {
    const k = keyOf(s);
    if (!unionKeys.has(k)) {
      unionKeys.add(k);
      union.push(s);
    }
  }
  return { common, onlyA, onlyB, union };
}
