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
};
