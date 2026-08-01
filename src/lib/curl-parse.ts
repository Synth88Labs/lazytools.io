/**
 * Parse a curl command into its parts and emit an equivalent JavaScript fetch()
 * call. Pure and deterministic. Handles a shell-style tokenizer (single/double
 * quotes, backslash escapes, and `\`-newline line continuations) and the common
 * curl flags: -X/--request, -H/--header, -d/--data(-raw/-binary/-urlencode),
 * -u/--user, -A/--user-agent, -b/--cookie, -e/--referer.
 */

export interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
}

/** Tokenize a shell command line, honoring quotes, escapes and line continuations. */
export function shellTokenize(input: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let has = false; // current token started (so "" produces an empty token)
  let i = 0;
  const s = input;
  while (i < s.length) {
    const c = s[i];
    if (c === '\\') {
      // line continuation
      if (s[i + 1] === '\n') { i += 2; continue; }
      if (s[i + 1] === '\r' && s[i + 2] === '\n') { i += 3; continue; }
      cur += s[i + 1] ?? ''; has = true; i += 2; continue;
    }
    if (c === "'") {
      has = true; i++;
      while (i < s.length && s[i] !== "'") { cur += s[i++]; }
      i++; // closing quote
      continue;
    }
    if (c === '"') {
      has = true; i++;
      while (i < s.length && s[i] !== '"') {
        if (s[i] === '\\' && (s[i + 1] === '"' || s[i + 1] === '\\' || s[i + 1] === '$' || s[i + 1] === '`')) {
          cur += s[i + 1]; i += 2;
        } else { cur += s[i++]; }
      }
      i++; // closing quote
      continue;
    }
    if (/\s/.test(c)) {
      if (has) { tokens.push(cur); cur = ''; has = false; }
      i++; continue;
    }
    cur += c; has = true; i++;
  }
  if (has) tokens.push(cur);
  return tokens;
}

export function parseCurl(input: string): ParsedCurl {
  const trimmed = input.trim().replace(/^\$\s+/, '');
  const tokens = shellTokenize(trimmed);
  if (!tokens.length || tokens[0] !== 'curl') {
    // tolerate a bare URL or a command not starting with curl
    if (tokens[0] && /^https?:\/\//i.test(tokens[0])) tokens.unshift('curl');
    else throw new Error('This does not look like a curl command (it should start with "curl").');
  }

  const headers: Record<string, string> = {};
  const dataParts: string[] = [];
  let method = '';
  let url = '';

  const val = (i: number, inline: string | null): [string, number] =>
    inline !== null ? [inline, i] : [tokens[i + 1] ?? '', i + 1];

  for (let i = 1; i < tokens.length; i++) {
    let t = tokens[i];
    if (!t) continue;
    // support --flag=value
    let inline: string | null = null;
    const eq = t.startsWith('--') ? t.indexOf('=') : -1;
    if (eq !== -1) { inline = t.slice(eq + 1); t = t.slice(0, eq); }

    if (t === '-X' || t === '--request') { const [v, ni] = val(i, inline); method = v.toUpperCase(); i = ni; }
    else if (t === '-H' || t === '--header') {
      const [v, ni] = val(i, inline); i = ni;
      const idx = v.indexOf(':');
      if (idx > 0) headers[v.slice(0, idx).trim()] = v.slice(idx + 1).trim();
    }
    else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary' || t === '--data-ascii' || t === '--data-urlencode') {
      const [v, ni] = val(i, inline); dataParts.push(v); i = ni;
    }
    else if (t === '-u' || t === '--user') {
      const [v, ni] = val(i, inline); i = ni;
      headers['Authorization'] = 'Basic ' + btoaSafe(v);
    }
    else if (t === '-A' || t === '--user-agent') { const [v, ni] = val(i, inline); headers['User-Agent'] = v; i = ni; }
    else if (t === '-b' || t === '--cookie') { const [v, ni] = val(i, inline); headers['Cookie'] = v; i = ni; }
    else if (t === '-e' || t === '--referer') { const [v, ni] = val(i, inline); headers['Referer'] = v; i = ni; }
    else if (t === '--url') { const [v, ni] = val(i, inline); url = v; i = ni; }
    // flags that take no value we can ignore safely
    else if (t === '-L' || t === '--location' || t === '--compressed' || t === '-s' || t === '--silent' || t === '-k' || t === '--insecure' || t === '-i' || t === '--include' || t === '-v' || t === '--verbose' || t === '-g' || t === '--globoff') { /* ignore */ }
    else if (t.startsWith('-')) { /* unknown flag: skip its value if it clearly takes one is unknown, so skip only the flag */ }
    else if (!url) { url = t; }
  }

  const body = dataParts.length ? dataParts.join('&') : null;
  if (!method) method = body !== null ? 'POST' : 'GET';
  if (body !== null && !Object.keys(headers).some((h) => h.toLowerCase() === 'content-type')) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  if (!url) throw new Error('No URL found in the curl command.');
  return { method, url, headers, body };
}

function btoaSafe(s: string): string {
  if (typeof btoa === 'function') return btoa(s);
  // Node fallback for tests
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).Buffer ? (globalThis as any).Buffer.from(s, 'utf-8').toString('base64') : s;
}

/** Emit a JavaScript fetch() call from a parsed curl command. */
export function curlToFetch(parsed: ParsedCurl): string {
  const opts: string[] = [`  method: ${JSON.stringify(parsed.method)}`];
  const hk = Object.keys(parsed.headers);
  if (hk.length) {
    const lines = hk.map((k) => `    ${JSON.stringify(k)}: ${JSON.stringify(parsed.headers[k])}`);
    opts.push(`  headers: {\n${lines.join(',\n')}\n  }`);
  }
  if (parsed.body !== null) opts.push(`  body: ${JSON.stringify(parsed.body)}`);
  return `fetch(${JSON.stringify(parsed.url)}, {\n${opts.join(',\n')}\n})\n  .then((res) => res.json())\n  .then(console.log);`;
}

export function curlToCode(input: string): string {
  return curlToFetch(parseCurl(input));
}
