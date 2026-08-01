/**
 * Generate SQL from data — JSON or CSV to INSERT statements, and a list to an
 * IN (...) clause. Pure and deterministic. Values are typed and escaped: numbers
 * and booleans stay literal, empty/null become NULL, everything else is a
 * single-quoted string with '' escaping. Identifiers are lightly sanitized.
 */

/** Minimal RFC 4180 CSV parser (handles quotes, escaped quotes, quoted newlines). */
export function parseCsv(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const s = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); field = '';
      rows.push(row); row = [];
    } else field += c;
  }
  // trailing field/row (unless the input ended exactly on a newline with nothing after)
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

function ident(name: string): string {
  const clean = name.trim().replace(/[^A-Za-z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
  return clean || 'col';
}

/** true if the string is a plain SQL numeric literal. */
function isNumeric(v: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(v.trim());
}

function sqlString(v: string): string {
  return `'${v.replace(/'/g, "''")}'`;
}

/** Format a JS value (from JSON) as a SQL literal. */
function sqlValueFromJson(v: unknown): string {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (typeof v === 'object') return sqlString(JSON.stringify(v));
  return sqlString(String(v));
}

/** Format a CSV cell as a SQL literal (infers number, boolean, empty→NULL). */
function sqlValueFromCsv(v: string, nullFromEmpty: boolean): string {
  const t = v.trim();
  if (t === '' ) return nullFromEmpty ? 'NULL' : "''";
  if (isNumeric(t)) return t;
  if (/^(true|false)$/i.test(t)) return t.toUpperCase();
  return sqlString(v);
}

export interface SqlOpts {
  table?: string;
  /** one multi-row INSERT vs one statement per row */
  multiRow?: boolean;
}

export function jsonToSql(input: string, opts: SqlOpts = {}): { output: string; rows: number } {
  let data: unknown;
  try {
    data = JSON.parse(input);
  } catch (e) {
    throw new Error('Invalid JSON — ' + (e as Error).message);
  }
  const arr = Array.isArray(data) ? data : [data];
  const objs = arr.filter((x) => x !== null && typeof x === 'object' && !Array.isArray(x)) as Record<string, unknown>[];
  if (!objs.length) throw new Error('Expected a JSON object or an array of objects.');
  const table = ident(opts.table || 'my_table');
  // Column order: union of keys, first-seen order.
  const cols: string[] = [];
  for (const o of objs) for (const k of Object.keys(o)) if (!cols.includes(k)) cols.push(k);
  const colList = cols.map(ident).join(', ');
  const rowVals = objs.map((o) => '(' + cols.map((c) => sqlValueFromJson(o[c])).join(', ') + ')');
  const out = opts.multiRow === false
    ? rowVals.map((v) => `INSERT INTO ${table} (${colList}) VALUES ${v};`).join('\n')
    : `INSERT INTO ${table} (${colList}) VALUES\n${rowVals.join(',\n')};`;
  return { output: out, rows: objs.length };
}

export function csvToSql(input: string, opts: SqlOpts & { delimiter?: string; nullFromEmpty?: boolean } = {}): { output: string; rows: number } {
  const rows = parseCsv(input, opts.delimiter || ',');
  if (rows.length < 2) throw new Error('Need a header row and at least one data row.');
  const header = rows[0];
  const table = ident(opts.table || 'my_table');
  const colList = header.map(ident).join(', ');
  const dataRows = rows.slice(1);
  const rowVals = dataRows.map((r) => '(' + header.map((_, i) => sqlValueFromCsv(r[i] ?? '', opts.nullFromEmpty !== false)).join(', ') + ')');
  const out = opts.multiRow === false
    ? rowVals.map((v) => `INSERT INTO ${table} (${colList}) VALUES ${v};`).join('\n')
    : `INSERT INTO ${table} (${colList}) VALUES\n${rowVals.join(',\n')};`;
  return { output: out, rows: dataRows.length };
}

/** Turn a list (newline- or comma-separated) into a SQL IN (...) clause. */
export function listToInClause(input: string, opts: { quote?: 'auto' | 'always' | 'never' } = {}): { output: string; count: number } {
  const items = input
    .split(/[\n,]/)
    .map((x) => x.trim())
    .filter((x) => x !== '');
  if (!items.length) throw new Error('Enter at least one value.');
  const mode = opts.quote || 'auto';
  const formatted = items.map((v) => {
    if (mode === 'never') return v;
    if (mode === 'always') return sqlString(v);
    return isNumeric(v) ? v : sqlString(v); // auto
  });
  return { output: `(${formatted.join(', ')})`, count: items.length };
}
