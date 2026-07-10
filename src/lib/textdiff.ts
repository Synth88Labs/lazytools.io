/**
 * Exact text diff via longest-common-subsequence — deterministic, staleness-proof.
 * Line-level diff for the whole text, plus word-level diff within a changed line.
 * Runs entirely in the browser: sensitive text (contracts, code, drafts) is never
 * uploaded. Node-tested.
 */

export type Op = 'eq' | 'add' | 'del';
export interface DiffRow { type: Op; a?: string; b?: string; }

/** LCS table → edit script over two token arrays. */
function lcsDiff(a: string[], b: string[]): { type: Op; value: string }[] {
  const n = a.length, m = b.length;
  // dp[i][j] = LCS length of a[i:] and b[j:]
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const out: { type: Op; value: string }[] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ type: 'eq', value: a[i] }); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) { out.push({ type: 'del', value: a[i] }); i++; }
    else { out.push({ type: 'add', value: b[j] }); j++; }
  }
  while (i < n) out.push({ type: 'del', value: a[i++] });
  while (j < m) out.push({ type: 'add', value: b[j++] });
  return out;
}

export interface DiffResult {
  rows: DiffRow[];
  added: number;
  removed: number;
  unchanged: number;
}

/** Line-level diff. Pairs a deletion immediately followed by an addition as a change row. */
export function diffLines(textA: string, textB: string, opts: { ignoreCase?: boolean; ignoreWhitespace?: boolean } = {}): DiffResult {
  const norm = (s: string) => {
    let x = s;
    if (opts.ignoreWhitespace) x = x.replace(/\s+/g, ' ').trim();
    if (opts.ignoreCase) x = x.toLowerCase();
    return x;
  };
  const a = textA.split('\n');
  const b = textB.split('\n');
  const script = lcsDiff(a.map(norm), b.map(norm));

  // map normalized ops back to original lines
  const rows: DiffRow[] = [];
  let ia = 0, ib = 0, added = 0, removed = 0, unchanged = 0;
  for (const op of script) {
    if (op.type === 'eq') { rows.push({ type: 'eq', a: a[ia], b: b[ib] }); ia++; ib++; unchanged++; }
    else if (op.type === 'del') { rows.push({ type: 'del', a: a[ia] }); ia++; removed++; }
    else { rows.push({ type: 'add', b: b[ib] }); ib++; added++; }
  }
  return { rows, added, removed, unchanged };
}

/** Word-level diff of two single lines, for inline highlighting. */
export function diffWords(a: string, b: string): { type: Op; value: string }[] {
  const split = (s: string) => s.match(/\s+|[^\s]+/g) || [];
  return lcsDiff(split(a), split(b));
}
