/**
 * Parsers and serializers for three ubiquitous flat config formats that JSON
 * tooling doesn't cover natively: INI, .env (dotenv) and Java .properties.
 *
 * All functions are pure and deterministic. Values are treated as strings
 * (these formats are untyped on the wire); the JSON side is a plain object.
 * INI supports one level of [section] nesting → a nested object; .env and
 * .properties are flat key/value maps.
 */

// ---------------------------------------------------------------------------
// INI
// ---------------------------------------------------------------------------

/** Parse INI text into an object. Keys before any [section] live at the root;
 *  each [section] becomes a nested object. `;` and `#` start comments. */
export function parseIni(text: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let current: Record<string, unknown> = root;
  const lines = text.split(/\r?\n/);
  for (let raw of lines) {
    const line = raw.trim();
    if (line === '' || line.startsWith(';') || line.startsWith('#')) continue;
    const sec = line.match(/^\[(.+?)\]$/);
    if (sec) {
      const name = sec[1]!.trim();
      const obj: Record<string, unknown> = {};
      root[name] = obj;
      current = obj;
      continue;
    }
    const eq = line.indexOf('=');
    if (eq === -1) continue; // not a key=value line; skip silently
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    val = stripInlineComment(val);
    val = unquote(val);
    current[key] = val;
  }
  return root;
}

/** Remove an unquoted inline comment ( value ; comment  /  value # comment ). */
function stripInlineComment(val: string): string {
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val; // fully quoted, leave as-is
  }
  const m = val.match(/\s+[;#]/);
  if (m && m.index !== undefined) return val.slice(0, m.index).trim();
  return val;
}

function unquote(val: string): string {
  if (val.length >= 2 && ((val[0] === '"' && val[val.length - 1] === '"') || (val[0] === "'" && val[val.length - 1] === "'"))) {
    const inner = val.slice(1, -1);
    return val[0] === '"' ? inner.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\') : inner;
  }
  return val;
}

/** Serialize an object into INI. Top-level scalar values are written first,
 *  then each object-valued property becomes a [section]. Two levels only. */
export function stringifyIni(data: Record<string, unknown>): string {
  const rootLines: string[] = [];
  const sections: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const body: string[] = [`[${key}]`];
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        body.push(`${k}=${iniScalar(v)}`);
      }
      sections.push(body.join('\n'));
    } else {
      rootLines.push(`${key}=${iniScalar(value)}`);
    }
  }
  const parts: string[] = [];
  if (rootLines.length) parts.push(rootLines.join('\n'));
  if (sections.length) parts.push(sections.join('\n\n'));
  return parts.join('\n\n') + '\n';
}

function iniScalar(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (Array.isArray(v)) return v.map((x) => String(x)).join(',');
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

// ---------------------------------------------------------------------------
// .env  (dotenv)
// ---------------------------------------------------------------------------

/** Parse a .env file into a flat object. Handles `export ` prefix, single- and
 *  double-quoted values (double-quoted expand \n, \t, \r), and # comments. */
export function parseEnv(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (let raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (line === '' || line.startsWith('#')) continue;
    if (line.startsWith('export ')) line = line.slice(7).trim();
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!key) continue;
    let val = line.slice(eq + 1).trim();
    if (val.length >= 2 && val[0] === '"' && val[val.length - 1] === '"') {
      val = val.slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    } else if (val.length >= 2 && val[0] === "'" && val[val.length - 1] === "'") {
      val = val.slice(1, -1); // single quotes are literal
    } else {
      val = stripInlineComment(val);
    }
    out[key] = val;
  }
  return out;
}

/** Serialize a flat object into .env lines. Values needing it are double-quoted. */
export function stringifyEnv(data: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    lines.push(`${key}=${envValue(value)}`);
  }
  return lines.join('\n') + '\n';
}

function envValue(v: unknown): string {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') {
    // Represent nested/array values as their JSON, quoted.
    return '"' + JSON.stringify(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  const s = String(v);
  if (s === '' || /[\s#'"=\n\r\t]/.test(s)) {
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t') + '"';
  }
  return s;
}

// ---------------------------------------------------------------------------
// Java .properties
// ---------------------------------------------------------------------------

/** Parse a Java .properties file into a flat object. Supports `=`, `:` and
 *  whitespace separators, `#`/`!` comments, backslash line-continuations,
 *  \uXXXX escapes, and escaped separators (\=, \:, \ ). Keys stay flat (dots
 *  are kept literally, e.g. "server.port"). */
export function parseProperties(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  const rawLines = text.split(/\r?\n/);
  // Join continuation lines (a line ending in an odd number of backslashes).
  const logical: string[] = [];
  let buf = '';
  for (const rl of rawLines) {
    // On a continuation, leading whitespace of the next line is stripped.
    const line = buf ? rl.replace(/^\s+/, '') : rl;
    if (endsWithOddBackslash(line)) {
      buf += line.replace(/\\+$/, (m) => '\\'.repeat(m.length - 1));
    } else {
      logical.push(buf + line);
      buf = '';
    }
  }
  if (buf) logical.push(buf);

  for (const l of logical) {
    const line = l.replace(/^\s+/, '');
    if (line === '' || line.startsWith('#') || line.startsWith('!')) continue;
    // Find the first unescaped separator: =, :, or whitespace.
    let i = 0, sep = -1, sepIsSpace = false;
    while (i < line.length) {
      const c = line[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '=' || c === ':') { sep = i; break; }
      if (c === ' ' || c === '\t' || c === '\f') { sep = i; sepIsSpace = true; break; }
      i++;
    }
    let key: string, val: string;
    if (sep === -1) {
      key = line; val = '';
    } else {
      key = line.slice(0, sep);
      let rest = line.slice(sep + 1);
      if (sepIsSpace) {
        // Skip following whitespace then an optional = or : separator.
        rest = rest.replace(/^[ \t\f]+/, '');
        if (rest[0] === '=' || rest[0] === ':') rest = rest.slice(1).replace(/^[ \t\f]+/, '');
      } else {
        rest = rest.replace(/^[ \t\f]+/, '');
      }
      val = rest;
    }
    out[unescapeProp(key)] = unescapeProp(val);
  }
  return out;
}

function endsWithOddBackslash(s: string): boolean {
  let n = 0;
  for (let i = s.length - 1; i >= 0 && s[i] === '\\'; i--) n++;
  return n % 2 === 1;
}

function unescapeProp(s: string): string {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\') {
      const n = s[i + 1];
      if (n === 'u') {
        const hex = s.slice(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(hex)) { out += String.fromCharCode(parseInt(hex, 16)); i += 5; continue; }
      }
      if (n === 'n') { out += '\n'; i++; continue; }
      if (n === 't') { out += '\t'; i++; continue; }
      if (n === 'r') { out += '\r'; i++; continue; }
      if (n === 'f') { out += '\f'; i++; continue; }
      if (n !== undefined) { out += n; i++; continue; } // \=, \:, \ , \\, \#
      continue;
    }
    out += s[i];
  }
  return out;
}

/** Serialize a flat object into .properties. Keys escape separators/spaces;
 *  values escape newlines. */
export function stringifyProperties(data: Record<string, unknown>): string {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    lines.push(`${escapePropKey(key)}=${escapePropVal(value)}`);
  }
  return lines.join('\n') + '\n';
}

function escapePropKey(k: string): string {
  return k.replace(/\\/g, '\\\\').replace(/([=:\s#!])/g, '\\$1');
}

function escapePropVal(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

// ---------------------------------------------------------------------------
// Shared: require a top-level JSON object for the *-to-config directions.
// ---------------------------------------------------------------------------

export function requireObject(data: unknown, fmt: string): Record<string, unknown> {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`A ${fmt} document is a set of key/value pairs, so the JSON must be an object at the top level, not an array, string or number.`);
  }
  return data as Record<string, unknown>;
}
