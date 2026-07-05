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
};
