/** Pure text-transform functions for the /text/ tools. All client-side. */

export interface TransformResult {
  output: string;
  /** short status line, e.g. "42 duplicate lines removed" */
  info?: string;
}

type Opts = Record<string, string | boolean>;

export function textStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[^.!?…]+[.!?…]+/g) ?? (text.trim() ? [text] : [])).length;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const lines = text ? text.split('\n').length : 0;
  const readingMin = words / 225;
  const speakingMin = words / 130;
  return { words, chars, charsNoSpaces, sentences, paragraphs, lines, readingMin, speakingMin };
}

const toWords = (s: string): string[] =>
  s
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

function changeCase(text: string, mode: string): string {
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.toLowerCase().replace(/(^|\s|[-("'])([a-zà-ÿ])/g, (m, p, c) => p + c.toUpperCase());
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*[a-zà-ÿ])|([.!?]\s+[a-zà-ÿ])/g, (m) => m.toUpperCase());
    case 'camel': {
      const w = toWords(text.toLowerCase());
      return w.map((x, i) => (i === 0 ? x : x[0]!.toUpperCase() + x.slice(1))).join('');
    }
    case 'pascal':
      return toWords(text.toLowerCase())
        .map((x) => x[0]!.toUpperCase() + x.slice(1))
        .join('');
    case 'snake':
      return toWords(text.toLowerCase()).join('_');
    case 'kebab':
      return toWords(text.toLowerCase()).join('-');
    case 'constant':
      return toWords(text.toLowerCase()).join('_').toUpperCase();
    case 'alternating':
      return [...text].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join('');
    case 'inverse':
      return [...text].map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join('');
    default:
      return text;
  }
}

export function slugify(text: string, separator = '-'): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, separator)
    .replace(new RegExp(`\\${separator}{2,}`, 'g'), separator)
    .replace(new RegExp(`^\\${separator}|\\${separator}$`, 'g'), '');
}

export const TRANSFORM: Record<string, (input: string, opts: Opts) => TransformResult> = {
  case: (input, opts) => ({ output: changeCase(input, String(opts.mode ?? 'upper')) }),

  dedupe: (input, opts) => {
    const seen = new Set<string>();
    const out: string[] = [];
    let removed = 0;
    for (const line of input.split('\n')) {
      let key = opts.trim ? line.trim() : line;
      if (opts.ignoreCase) key = key.toLowerCase();
      if (seen.has(key)) {
        removed++;
      } else {
        seen.add(key);
        out.push(line);
      }
    }
    return { output: out.join('\n'), info: `${removed} duplicate line${removed === 1 ? '' : 's'} removed` };
  },

  sort: (input, opts) => {
    const lines = input.split('\n');
    const mode = String(opts.mode ?? 'az');
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    switch (mode) {
      case 'az':
        lines.sort((a, b) => collator.compare(a, b));
        break;
      case 'za':
        lines.sort((a, b) => collator.compare(b, a));
        break;
      case 'lengthAsc':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'lengthDesc':
        lines.sort((a, b) => b.length - a.length);
        break;
      case 'reverse':
        lines.reverse();
        break;
      case 'random':
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j]!, lines[i]!];
        }
        break;
    }
    return { output: lines.join('\n'), info: `${lines.length} lines sorted` };
  },

  whitespace: (input, opts) => {
    let out = input;
    const mode = String(opts.mode ?? 'breaks-space');
    if (mode === 'breaks-space') out = out.replace(/\s*\n+\s*/g, ' ').replace(/ {2,}/g, ' ').trim();
    if (mode === 'breaks-none') out = out.replace(/\n+/g, '');
    if (mode === 'collapse') out = out.replace(/[ \t]{2,}/g, ' ').replace(/^[ \t]+|[ \t]+$/gm, '');
    if (mode === 'empty-lines') out = out.replace(/^\s*\n/gm, '');
    return { output: out };
  },

  replace: (input, opts) => {
    const find = String(opts.find ?? '');
    const repl = String(opts.replace ?? '');
    if (!find) return { output: input, info: 'enter something to find' };
    try {
      const flags = opts.caseSensitive ? 'g' : 'gi';
      const pattern = opts.regex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(pattern, flags);
      const count = (input.match(re) ?? []).length;
      return { output: input.replace(re, repl), info: `${count} replacement${count === 1 ? '' : 's'} made` };
    } catch (e) {
      return { output: input, info: `invalid pattern: ${(e as Error).message}` };
    }
  },

  slug: (input, opts) => ({ output: slugify(input, String(opts.separator ?? '-')) }),

  reverse: (input, opts) => {
    const mode = String(opts.mode ?? 'chars');
    if (mode === 'chars') return { output: [...input].reverse().join('') };
    if (mode === 'words') return { output: input.split(/(\s+)/).reverse().join('') };
    return { output: input.split('\n').reverse().join('\n') };
  },

  extract: (input, opts) => {
    const mode = String(opts.mode ?? 'emails');
    const patterns: Record<string, RegExp> = {
      emails: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g,
      urls: /https?:\/\/[^\s<>"')\]]+/g,
      numbers: /-?\d+(?:[.,]\d+)?/g,
    };
    const matches = input.match(patterns[mode] ?? patterns.emails!) ?? [];
    const unique = [...new Set(matches)];
    return { output: unique.join('\n'), info: `${unique.length} unique ${mode} found (${matches.length} total)` };
  },

  prefixSuffix: (input, opts) => {
    const prefix = String(opts.prefix ?? '');
    const suffix = String(opts.suffix ?? '');
    return { output: input.split('\n').map((l) => prefix + l + suffix).join('\n') };
  },

  /** Clean pasted / AI-generated text: normalise dashes, quotes, spaces, invisibles. */
  cleaner: (input, opts) => {
    let t = input;
    let changed = 0;
    const before = t;
    if (opts.dashes !== false) t = t.replace(/[‐‑‒–—―−]/g, '-'); // hyphens, en/em dashes, minus → -
    if (opts.quotes !== false) t = t.replace(/[‘’‚‛]/g, "'").replace(/[“”„‟]/g, '"'); // curly → straight
    if (opts.ellipsis !== false) t = t.replace(/…/g, '...');
    if (opts.spaces !== false) t = t.replace(/[  -   　]/g, ' ');       // exotic spaces → normal
    if (opts.invisible !== false) t = t.replace(/[​‌‍⁠﻿­᠎⁡-⁤]/g, ''); // zero-width & format
    if (opts.collapse === true) t = t.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+$/gm, '');            // collapse runs + trailing
    if (before !== t) changed = 1;
    return { output: t, info: changed ? 'Cleaned: normalised dashes/quotes/spaces and removed hidden characters.' : 'No changes needed — text is already clean.' };
  },

  /** Unicode normalization (NFC/NFD/NFKC/NFKD) with optional diacritic stripping. */
  normalize: (input, opts) => {
    const form = String(opts.form ?? 'NFC') as 'NFC' | 'NFD' | 'NFKC' | 'NFKD';
    let t = input.normalize(form);
    if (opts.stripDiacritics === true) t = t.normalize('NFD').replace(/\p{M}+/gu, '').normalize('NFC');
    return { output: t };
  },

  /** Convert between delimiters and optionally transpose rows/columns. */
  delimiter: (input, opts) => {
    const map: Record<string, string> = { comma: ',', tab: '\t', semicolon: ';', pipe: '|', space: ' ', newline: '\n' };
    const from = map[String(opts.from ?? 'comma')] ?? ',';
    const to = map[String(opts.to ?? 'newline')] ?? '\n';
    const rows = input.split('\n').filter((r) => r.length).map((r) => r.split(from));
    if (opts.transpose === true) {
      const cols = Math.max(0, ...rows.map((r) => r.length));
      const out: string[][] = [];
      for (let c = 0; c < cols; c++) out.push(rows.map((r) => r[c] ?? ''));
      return { output: out.map((r) => r.join(to === '\n' ? ',' : to)).join('\n') };
    }
    return { output: rows.map((r) => r.join(to)).join('\n') };
  },

  /** Decode "fancy" / stylish Unicode text (𝓯𝓪𝓷𝓬𝔂, 𝔤𝔬𝔱𝔥𝔦𝔠, ⓕⓤⓛⓛⓦⓘⓓⓣⓗ) back to plain text. */
  defancy: (input, opts) => {
    let t = input.normalize('NFKC');
    if (opts.zalgo !== false) t = t.replace(/\p{M}+/gu, ''); // strip stacked combining marks (zalgo/underline)
    return { output: t, info: t !== input ? 'Decoded stylish Unicode back to plain text.' : 'No stylised characters found.' };
  },

  /** Strip HTML tags and decode entities → plain text. */
  striphtml: (input) => {
    let t = input.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    t = t.replace(/<\/?(p|div|br|li|tr|h[1-6])\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, '');
    const named: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&nbsp;': ' ' };
    t = t.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
         .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
         .replace(/&[a-z]+;/gi, (m) => named[m.toLowerCase()] ?? m);
    t = t.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    return { output: t };
  },

  /** Line operations: number lines, add prefix/suffix, or pad. */
  lineops: (input, opts) => {
    const mode = String(opts.mode ?? 'number');
    const value = String(opts.value ?? '');
    const lines = input.split('\n');
    if (mode === 'number') {
      const start = parseInt(value) || 1;
      const pad = String(start + lines.length - 1).length;
      return { output: lines.map((l, i) => `${String(start + i).padStart(pad, ' ')}. ${l}`).join('\n') };
    }
    if (mode === 'prefix') return { output: lines.map((l) => value + l).join('\n') };
    if (mode === 'suffix') return { output: lines.map((l) => l + value).join('\n') };
    if (mode === 'padRight') { const w = parseInt(value) || 20; return { output: lines.map((l) => l.padEnd(w)).join('\n') }; }
    if (mode === 'padLeft') { const w = parseInt(value) || 20; return { output: lines.map((l) => l.padStart(w)).join('\n') }; }
    return { output: input };
  },
};

/* ---------------- number to words ---------------- */
const NTW_ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const NTW_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const NTW_SCALES = ['', ' thousand', ' million', ' billion', ' trillion', ' quadrillion'];

function ntwThree(n: number): string {
  let s = '';
  if (n >= 100) { s += NTW_ONES[Math.floor(n / 100)] + ' hundred'; n %= 100; if (n) s += ' '; }
  if (n >= 20) { s += NTW_TENS[Math.floor(n / 10)]; n %= 10; if (n) s += '-' + NTW_ONES[n]; }
  else if (n > 0) s += NTW_ONES[n];
  return s;
}

/** Integer (0 to ~10^18) to English words. */
export function integerToWords(num: number): string {
  if (!isFinite(num)) return '';
  num = Math.trunc(Math.abs(num));
  if (num === 0) return 'zero';
  const groups: number[] = [];
  while (num > 0) { groups.push(num % 1000); num = Math.floor(num / 1000); }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    parts.push(ntwThree(groups[i]) + NTW_SCALES[i]);
  }
  return parts.join(' ');
}

/** Full number (sign + decimals) to English words, e.g. -12.5 → "negative twelve point five". */
export function numberToWords(num: number): string {
  if (!isFinite(num)) return '';
  const neg = num < 0;
  const s = Math.abs(num).toString();
  const [intStr, fracStr] = s.split('.');
  let out = integerToWords(parseInt(intStr, 10));
  if (fracStr) out += ' point ' + [...fracStr].map((d) => NTW_ONES[parseInt(d, 10)]).join(' ');
  return (neg ? 'negative ' : '') + out;
}

/** Cheque/"amount in words" style: "one thousand two hundred thirty-four and 50/100". */
export function amountToWords(num: number): string {
  const neg = num < 0;
  const abs = Math.abs(num);
  const dollars = Math.trunc(abs);
  const cents = Math.round((abs - dollars) * 100);
  const words = integerToWords(dollars);
  const cap = words.charAt(0).toUpperCase() + words.slice(1);
  return (neg ? 'Negative ' : '') + cap + ' and ' + String(cents).padStart(2, '0') + '/100';
}

/* ---------------- upside-down text ---------------- */
const FLIP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'q', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ᴚ', S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", '?': '¿', '!': '¡', "'": ',', '"': '„', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾',
};
/** Flip text upside down (map glyphs and reverse order). */
export function upsideDown(text: string): string {
  return [...text].map((c) => FLIP[c] ?? c).reverse().join('');
}

/* ---------------- random line picker ---------------- */
/** Pick n random lines. unique = no repeats (up to available). rand injectable for testing. */
export function pickLines(lines: string[], n: number, unique: boolean, rand: () => number = Math.random): string[] {
  const pool = lines.filter((l) => l.trim() !== '');
  if (pool.length === 0 || n <= 0) return [];
  if (unique) {
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1));[copy[i], copy[j]] = [copy[j], copy[i]]; }
    return copy.slice(0, Math.min(n, copy.length));
  }
  return Array.from({ length: n }, () => pool[Math.floor(rand() * pool.length)]);
}
