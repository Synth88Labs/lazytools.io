/**
 * Data-format conversion functions for the /file/ tools.
 * All client-side: js-yaml for YAML, marked for Markdown, DOMParser for XML,
 * and a quote-aware CSV parser (RFC 4180 style) implemented below.
 */
import { load as yamlLoad, dump as yamlDump } from 'js-yaml';
import { marked } from 'marked';

export interface ConvertResult {
  output: string;
  info?: string;
}

type Opts = Record<string, string | boolean>;

/** RFC 4180-style CSV parser: quoted fields, escaped quotes, embedded delimiters/newlines. */
export function parseCSV(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  const src = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"' && field === '') {
      inQuotes = true;
    } else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

export function detectDelimiter(text: string): string {
  const firstLines = text.split('\n').slice(0, 5).join('\n');
  const counts: [string, number][] = [',', ';', '\t', '|'].map((d) => [
    d,
    (firstLines.match(new RegExp(d === '|' ? '\\|' : d === '\t' ? '\t' : d, 'g')) ?? []).length,
  ]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0]![1] > 0 ? counts[0]![0] : ',';
}

function resolveDelimiter(opts: Opts, input: string): string {
  const d = String(opts.delimiter ?? 'auto');
  if (d === 'auto') return detectDelimiter(input);
  if (d === 'tab') return '\t';
  return d;
}

function csvEscape(value: string, delimiter: string): string {
  if (value.includes('"') || value.includes(delimiter) || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

/** Try to keep CSV numbers/booleans typed in JSON output. */
function coerce(v: string): unknown {
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null') return null;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v) && v.length < 16) return Number(v);
  return v;
}

function jsonParse(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (e) {
    const msg = (e as Error).message;
    const pos = msg.match(/position (\d+)/);
    if (pos) {
      const p = parseInt(pos[1]!, 10);
      const before = input.slice(0, p);
      const line = before.split('\n').length;
      const col = p - before.lastIndexOf('\n');
      throw new Error(`Invalid JSON at line ${line}, column ${col}: ${msg}`);
    }
    throw new Error(`Invalid JSON: ${msg}`);
  }
}

// ---------- XML helpers ----------

function xmlNodeToValue(el: Element): unknown {
  const children = Array.from(el.children);
  const attrs = Array.from(el.attributes);
  if (children.length === 0 && attrs.length === 0) return coerce(el.textContent ?? '');

  const obj: Record<string, unknown> = {};
  for (const a of attrs) obj['@' + a.name] = coerce(a.value);
  if (children.length === 0) {
    const text = (el.textContent ?? '').trim();
    if (text) obj['#text'] = coerce(text);
    return obj;
  }
  for (const child of children) {
    const val = xmlNodeToValue(child);
    const key = child.tagName;
    if (key in obj) {
      const existing = obj[key];
      if (Array.isArray(existing)) existing.push(val);
      else obj[key] = [existing, val];
    } else {
      obj[key] = val;
    }
  }
  return obj;
}

function valueToXml(value: unknown, tag: string, indent: string): string {
  const pad = indent;
  const safeTag = /^[a-zA-Z_][\w.-]*$/.test(tag) ? tag : 'item';
  if (value === null || value === undefined) return `${pad}<${safeTag}/>`;
  if (Array.isArray(value)) {
    return value.map((v) => valueToXml(v, safeTag, indent)).join('\n');
  }
  if (typeof value === 'object') {
    const inner = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => valueToXml(v, k, indent + '  '))
      .join('\n');
    return `${pad}<${safeTag}>\n${inner}\n${pad}</${safeTag}>`;
  }
  const text = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `${pad}<${safeTag}>${text}</${safeTag}>`;
}

// ---------- converters ----------

export const CONVERT: Record<string, (input: string, opts: Opts) => ConvertResult> = {
  jsonFormat: (input, opts) => {
    const data = jsonParse(input);
    const mode = String(opts.mode ?? 'format');
    if (mode === 'minify') {
      const output = JSON.stringify(data);
      return { output, info: `valid JSON — minified to ${output.length.toLocaleString()} characters` };
    }
    const indent = opts.indent === 'tab' ? '\t' : Number(opts.indent ?? 2);
    return { output: JSON.stringify(data, null, indent), info: 'valid JSON ✓' };
  },

  csvToJson: (input, opts) => {
    const delimiter = resolveDelimiter(opts, input);
    const rows = parseCSV(input, delimiter);
    if (rows.length === 0) return { output: '', info: 'no rows found' };
    const hasHeaders = opts.headers !== false;
    const delimName = delimiter === '\t' ? 'tab' : `"${delimiter}"`;

    if (!hasHeaders || String(opts.shape ?? 'objects') === 'arrays') {
      const data = rows.map((r) => r.map(coerce));
      return {
        output: JSON.stringify(data, null, 2),
        info: `${rows.length} rows → array of arrays (delimiter: ${delimName})`,
      };
    }
    const headers = rows[0]!.map((h, i) => h.trim() || `column_${i + 1}`);
    const records = rows.slice(1).map((r) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => (obj[h] = coerce(r[i] ?? '')));
      return obj;
    });
    return {
      output: JSON.stringify(records, null, 2),
      info: `${records.length} records, ${headers.length} fields (delimiter: ${delimName})`,
    };
  },

  jsonToCsv: (input, opts) => {
    const data = jsonParse(input);
    const delimiter = String(opts.delimiter ?? ',') === 'tab' ? '\t' : String(opts.delimiter ?? ',');
    if (!Array.isArray(data)) throw new Error('Expected a JSON array (of objects or arrays) at the top level.');
    if (data.length === 0) return { output: '', info: '0 rows' };

    if (Array.isArray(data[0])) {
      const lines = (data as unknown[][]).map((row) => row.map((v) => csvEscape(String(v ?? ''), delimiter)).join(delimiter));
      return { output: lines.join('\n'), info: `${data.length} rows` };
    }
    const keys = [...new Set((data as Record<string, unknown>[]).flatMap((o) => Object.keys(o)))];
    const lines = [
      keys.map((k) => csvEscape(k, delimiter)).join(delimiter),
      ...(data as Record<string, unknown>[]).map((o) =>
        keys
          .map((k) => {
            const v = o[k];
            const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
            return csvEscape(s, delimiter);
          })
          .join(delimiter)
      ),
    ];
    return { output: lines.join('\n'), info: `${data.length} records, ${keys.length} columns` };
  },

  jsonToYaml: (input) => {
    const data = jsonParse(input);
    return { output: yamlDump(data, { lineWidth: 100 }), info: 'converted with js-yaml' };
  },

  yamlToJson: (input, opts) => {
    let data: unknown;
    try {
      data = yamlLoad(input);
    } catch (e) {
      throw new Error(`Invalid YAML: ${(e as Error).message}`);
    }
    const indent = opts.minify ? undefined : 2;
    return { output: JSON.stringify(data, null, indent), info: 'valid YAML ✓' };
  },

  xmlToJson: (input) => {
    const doc = new DOMParser().parseFromString(input, 'application/xml');
    const err = doc.querySelector('parsererror');
    if (err) throw new Error(`Invalid XML: ${err.textContent?.split('\n')[1] ?? 'parse error'}`);
    const root = doc.documentElement;
    const result = { [root.tagName]: xmlNodeToValue(root) };
    return { output: JSON.stringify(result, null, 2), info: `root element <${root.tagName}> converted` };
  },

  jsonToXml: (input, opts) => {
    const data = jsonParse(input);
    const rootName = String(opts.root ?? 'root') || 'root';
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` + valueToXml(data, rootName, '');
    return { output: xml, info: 'attributes are not generated — keys become elements' };
  },

  csvToMarkdown: (input, opts) => {
    const delimiter = resolveDelimiter(opts, input);
    const rows = parseCSV(input, delimiter);
    if (rows.length === 0) return { output: '', info: 'no rows found' };
    const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    const width = Math.max(...rows.map((r) => r.length));
    const norm = rows.map((r) => Array.from({ length: width }, (_, i) => esc(r[i] ?? '')));
    const header = opts.headers !== false ? norm[0]! : Array.from({ length: width }, (_, i) => `Column ${i + 1}`);
    const body = opts.headers !== false ? norm.slice(1) : norm;
    const lines = [
      `| ${header.join(' | ')} |`,
      `| ${header.map(() => '---').join(' | ')} |`,
      ...body.map((r) => `| ${r.join(' | ')} |`),
    ];
    return { output: lines.join('\n'), info: `${body.length} rows × ${width} columns` };
  },

  markdownToHtml: (input) => {
    const output = marked.parse(input, { async: false }) as string;
    return { output, info: 'GitHub-flavored Markdown via marked' };
  },
};
