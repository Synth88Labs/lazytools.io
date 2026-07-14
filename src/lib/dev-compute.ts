/** Developer-tool transforms — all client-side, standard Web APIs only. */

export interface DevResult {
  output: string;
  info?: string;
}

type Opts = Record<string, string | boolean>;

/** UTF-8-safe Base64 (btoa alone corrupts non-Latin1 text). */
function b64encode(text: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  let out = btoa(bin);
  if (urlSafe) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return out;
}

function b64decode(text: string): string {
  const normalized = text.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

const HTML_ESCAPES: [RegExp, string][] = [
  [/&/g, '&amp;'],
  [/</g, '&lt;'],
  [/>/g, '&gt;'],
  [/"/g, '&quot;'],
  [/'/g, '&#39;'],
];

export const DEV: Record<string, (input: string, opts: Opts) => DevResult> = {
  base64: (input, opts) => {
    const mode = String(opts.mode ?? 'encode');
    const urlSafe = Boolean(opts.urlSafe);
    try {
      if (mode === 'encode') {
        const output = b64encode(input, urlSafe);
        return { output, info: `${input.length} chars → ${output.length} Base64 chars (~${Math.round((output.length / Math.max(1, input.length)) * 100)}%)` };
      }
      const output = b64decode(input);
      return { output, info: 'decoded as UTF-8' };
    } catch {
      throw new Error('Not valid Base64 — check for stray characters or truncation.');
    }
  },

  urlCodec: (input, opts) => {
    const mode = String(opts.mode ?? 'encode');
    try {
      if (mode === 'encode') {
        const full = Boolean(opts.component);
        const output = full ? encodeURIComponent(input) : encodeURI(input);
        return { output, info: full ? 'encodeURIComponent — safe for query values' : 'encodeURI — preserves URL structure (/, ?, &)' };
      }
      return { output: decodeURIComponent(input.replace(/\+/g, '%20')), info: '+ treated as space (form encoding)' };
    } catch {
      throw new Error('Malformed percent-encoding — a % must be followed by two hex digits.');
    }
  },

  htmlEntities: (input, opts) => {
    const mode = String(opts.mode ?? 'encode');
    if (mode === 'encode') {
      let out = input;
      for (const [re, rep] of HTML_ESCAPES) out = out.replace(re, rep);
      return { output: out, info: '& < > " \' escaped' };
    }
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return { output: doc.documentElement.textContent ?? '', info: 'entities decoded via the browser parser' };
  },

  jwt: (input) => {
    const parts = input.trim().split('.');
    if (parts.length !== 3) throw new Error('A JWT has three dot-separated parts: header.payload.signature.');
    let header: unknown, payload: Record<string, unknown>;
    try {
      header = JSON.parse(b64decode(parts[0]!));
      payload = JSON.parse(b64decode(parts[1]!));
    } catch {
      throw new Error('Header or payload is not valid Base64URL-encoded JSON.');
    }
    const lines: string[] = [];
    lines.push('— HEADER —', JSON.stringify(header, null, 2), '', '— PAYLOAD —', JSON.stringify(payload, null, 2));
    let info = 'decoded locally — signature NOT verified (that requires the secret/key)';
    if (typeof payload.exp === 'number') {
      const expDate = new Date(payload.exp * 1000);
      const expired = Date.now() > payload.exp * 1000;
      lines.push('', `— exp: ${expDate.toISOString()} (${expired ? 'EXPIRED' : 'valid'})`);
      info = `${expired ? '⚠ token expired' : 'token not yet expired'} · signature NOT verified`;
    }
    return { output: lines.join('\n'), info };
  },

  regex: (input, opts) => {
    const pattern = String(opts.pattern ?? '');
    const flags = String(opts.flags ?? 'g');
    if (!pattern) return { output: '', info: 'enter a pattern' };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
    } catch (e) {
      throw new Error(`Invalid regex: ${(e as Error).message}`);
    }
    const matches = [...input.matchAll(re)];
    if (matches.length === 0) return { output: '(no matches)', info: '0 matches' };
    const lines = matches.slice(0, 500).map((m, i) => {
      const groups = m.length > 1 ? `  groups: [${m.slice(1).map((g) => JSON.stringify(g ?? null)).join(', ')}]` : '';
      return `#${i + 1} @${m.index}: ${JSON.stringify(m[0])}${groups}`;
    });
    return { output: lines.join('\n'), info: `${matches.length} match${matches.length === 1 ? '' : 'es'}` };
  },

  numberBase: (input, opts) => {
    const from = parseInt(String(opts.from ?? '10'), 10);
    const clean = input.trim().replace(/^0[xbo]/i, '').replace(/[\s_]/g, '');
    if (!clean) return { output: '', info: '' };
    let value: bigint;
    try {
      const digits = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, from);
      value = 0n;
      for (const ch of clean.toLowerCase()) {
        const d = digits.indexOf(ch);
        if (d === -1) throw new Error(`"${ch}" is not a base-${from} digit.`);
        value = value * BigInt(from) + BigInt(d);
      }
    } catch (e) {
      throw new Error((e as Error).message);
    }
    const out = [
      `Decimal: ${value.toString(10)}`,
      `Hex:     0x${value.toString(16)}`,
      `Octal:   0o${value.toString(8)}`,
      `Binary:  0b${value.toString(2)}`,
    ];
    return { output: out.join('\n'), info: `parsed as base-${from} · exact (BigInt, no precision loss)` };
  },

  querystring: (input, opts) => {
    const mode = String(opts.mode ?? 'parse');
    if (mode === 'build') {
      // JSON object → query string
      let obj: Record<string, unknown>;
      try { obj = JSON.parse(input); } catch { throw new Error('Enter a JSON object to build a query string, e.g. {"q":"hello world","page":2}.'); }
      if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) throw new Error('Expected a JSON object of key → value.');
      const parts: string[] = [];
      for (const [k, v] of Object.entries(obj)) {
        const vals = Array.isArray(v) ? v : [v];
        for (const item of vals) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(item))}`);
      }
      return { output: parts.join('&'), info: `${parts.length} parameter${parts.length === 1 ? '' : 's'}` };
    }
    // parse: query string (or full URL) → pretty JSON
    let qs = input.trim();
    const hadQuestion = qs.indexOf('?') !== -1;
    if (hadQuestion) qs = qs.slice(qs.indexOf('?') + 1);
    const hashIdx = qs.indexOf('#');
    if (hashIdx !== -1) qs = qs.slice(0, hashIdx);
    qs = qs.replace(/^&+|&+$/g, '');
    // A URL without a query string (no "?" and no "=") has no parameters.
    if (!qs || (!hadQuestion && !qs.includes('='))) return { output: '{}', info: 'no parameters' };
    const result: Record<string, string | string[]> = {};
    let count = 0;
    for (const pair of qs.split('&')) {
      if (!pair) continue;
      const eq = pair.indexOf('=');
      const rawKey = eq === -1 ? pair : pair.slice(0, eq);
      const rawVal = eq === -1 ? '' : pair.slice(eq + 1);
      let key: string, val: string;
      try { key = decodeURIComponent(rawKey.replace(/\+/g, ' ')); val = decodeURIComponent(rawVal.replace(/\+/g, ' ')); }
      catch { key = rawKey; val = rawVal; }
      count++;
      if (key in result) {
        const existing = result[key];
        result[key] = Array.isArray(existing) ? [...existing, val] : [existing, val];
      } else result[key] = val;
    }
    return { output: JSON.stringify(result, null, 2), info: `${count} parameter${count === 1 ? '' : 's'} · repeated keys become arrays` };
  },

  httpstatus: (input) => {
    const codes = input.match(/\d{3}/g);
    if (!codes || codes.length === 0) throw new Error('Enter an HTTP status code, e.g. 404, or a few like "301 404 500".');
    const lines = codes.map((c) => {
      const s = HTTP_STATUS[c];
      const cls = HTTP_CLASS[c[0]] ?? 'Unknown class';
      if (!s) return `${c}  — Unassigned / non-standard (${cls})`;
      return `${c} ${s.name}\n     ${s.desc}\n     Class: ${cls}`;
    });
    return { output: lines.join('\n\n'), info: `${codes.length} code${codes.length === 1 ? '' : 's'} looked up` };
  },

  jsonEscape: (input, opts) => {
    const mode = String(opts.mode ?? 'encode');
    if (mode === 'encode') {
      // JSON.stringify a string produces a fully escaped, double-quoted literal;
      // strip the outer quotes to get the inner escaped form.
      const quoted = JSON.stringify(input);
      return { output: quoted.slice(1, -1), info: 'escaped for a JSON string (\\", \\\\, \\n, \\t, control chars, \\uXXXX)' };
    }
    // decode: wrap in quotes and parse as a JSON string.
    try {
      const parsed = JSON.parse('"' + input + '"');
      return { output: String(parsed), info: 'unescaped from a JSON string literal' };
    } catch {
      throw new Error('Not a valid JSON string body — check for unescaped quotes or backslashes. Paste the text between the quotes, without the surrounding quotes.');
    }
  },

  unicodeEscape: (input, opts) => {
    const mode = String(opts.mode ?? 'encode');
    if (mode === 'encode') {
      // Escape every non-ASCII UTF-16 code unit to \uXXXX.
      const out = input.replace(/[^\x00-\x7F]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
      const n = (input.match(/[^\x00-\x7F]/g) ?? []).length;
      return { output: out, info: `${n} non-ASCII character${n === 1 ? '' : 's'} escaped to \\uXXXX` };
    }
    // decode: turn \uXXXX (and \u{XXXXX}) back into characters.
    let n = 0;
    let out = input.replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_, h) => { n++; return String.fromCodePoint(parseInt(h, 16)); });
    out = out.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => { n++; return String.fromCharCode(parseInt(h, 16)); });
    return { output: out, info: `${n} \\u escape${n === 1 ? '' : 's'} decoded` };
  },

  textHex: (input, opts) => {
    const mode = String(opts.mode ?? 'encode');
    if (mode === 'encode') {
      const bytes = new TextEncoder().encode(input); // UTF-8
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(' ');
      return { output: hex, info: `${bytes.length} UTF-8 byte${bytes.length === 1 ? '' : 's'} → hex` };
    }
    // decode: strip anything that isn't a hex digit (spaces, 0x, colons, commas), pair up.
    const clean = input.replace(/0x/gi, '').replace(/[^0-9a-fA-F]/g, '');
    if (clean.length === 0) return { output: '', info: 'no hex digits found' };
    if (clean.length % 2 !== 0) throw new Error('Hex input has an odd number of digits — each byte needs two hex digits.');
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      return { output: text, info: `${bytes.length} byte${bytes.length === 1 ? '' : 's'} → UTF-8 text` };
    } catch {
      throw new Error('Those bytes are not valid UTF-8 text. Check the hex is correct and complete.');
    }
  },
};

const HTTP_CLASS: Record<string, string> = {
  '1': '1xx Informational', '2': '2xx Success', '3': '3xx Redirection', '4': '4xx Client Error', '5': '5xx Server Error',
};

/** Common HTTP status codes (IANA registry / RFC 9110 and friends). */
export const HTTP_STATUS: Record<string, { name: string; desc: string }> = {
  '100': { name: 'Continue', desc: 'The client should continue the request or ignore this if already finished.' },
  '101': { name: 'Switching Protocols', desc: 'The server is switching protocols as requested by the Upgrade header.' },
  '200': { name: 'OK', desc: 'The request succeeded; the meaning depends on the method (GET returns the resource, POST the result).' },
  '201': { name: 'Created', desc: 'The request succeeded and a new resource was created.' },
  '202': { name: 'Accepted', desc: 'The request was accepted for processing, but is not yet complete.' },
  '204': { name: 'No Content', desc: 'The request succeeded but there is no content to return.' },
  '206': { name: 'Partial Content', desc: 'The server is delivering part of the resource in response to a Range header.' },
  '301': { name: 'Moved Permanently', desc: 'The resource has permanently moved to a new URL; update your links. SEO value is passed.' },
  '302': { name: 'Found', desc: 'The resource is temporarily at a different URL; keep using the original URL for future requests.' },
  '303': { name: 'See Other', desc: 'The response is at another URL, to be fetched with GET (common after a POST).' },
  '304': { name: 'Not Modified', desc: 'The cached version is still valid; the client can reuse it (conditional request).' },
  '307': { name: 'Temporary Redirect', desc: 'Like 302, but the method must not change on redirect.' },
  '308': { name: 'Permanent Redirect', desc: 'Like 301, but the method must not change on redirect.' },
  '400': { name: 'Bad Request', desc: 'The server could not understand the request due to malformed syntax.' },
  '401': { name: 'Unauthorized', desc: 'Authentication is required and has failed or not been provided.' },
  '403': { name: 'Forbidden', desc: 'The server understood the request but refuses to authorize it — you lack permission.' },
  '404': { name: 'Not Found', desc: 'The server cannot find the requested resource; the URL may be broken or the resource removed.' },
  '405': { name: 'Method Not Allowed', desc: 'The HTTP method is not supported for this resource.' },
  '408': { name: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  '409': { name: 'Conflict', desc: 'The request conflicts with the current state of the resource.' },
  '410': { name: 'Gone', desc: 'The resource is permanently gone with no forwarding address.' },
  '418': { name: "I'm a teapot", desc: 'An April Fools\' joke code (RFC 2324); the server refuses to brew coffee because it is a teapot.' },
  '422': { name: 'Unprocessable Content', desc: 'The request was well-formed but has semantic errors (common in APIs for validation failures).' },
  '429': { name: 'Too Many Requests', desc: 'The user has sent too many requests in a given time (rate limiting).' },
  '500': { name: 'Internal Server Error', desc: 'A generic server-side error; something went wrong that the server cannot be more specific about.' },
  '501': { name: 'Not Implemented', desc: 'The server does not support the functionality required to fulfil the request.' },
  '502': { name: 'Bad Gateway', desc: 'The server, acting as a gateway or proxy, got an invalid response from an upstream server.' },
  '503': { name: 'Service Unavailable', desc: 'The server is temporarily unable to handle the request (overloaded or down for maintenance).' },
  '504': { name: 'Gateway Timeout', desc: 'The server, acting as a gateway, did not get a timely response from an upstream server.' },
};
