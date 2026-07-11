/** Generator helpers — cryptographic randomness with rejection sampling (no modulo bias). */

/** Unbiased random integer in [0, maxExclusive). */
export function randInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0]!;
  } while (v >= limit);
  return v % maxExclusive;
}

export function randIntRange(min: number, max: number): number {
  return min + randInt(max - min + 1);
}

export const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
  ambiguous: 'l1IO0o',
};

export function generatePassword(
  length: number,
  sets: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean },
  excludeAmbiguous: boolean
): { password: string; entropyBits: number } {
  let alphabet = '';
  if (sets.lower) alphabet += CHARSETS.lower;
  if (sets.upper) alphabet += CHARSETS.upper;
  if (sets.digits) alphabet += CHARSETS.digits;
  if (sets.symbols) alphabet += CHARSETS.symbols;
  if (excludeAmbiguous) alphabet = [...alphabet].filter((c) => !CHARSETS.ambiguous.includes(c)).join('');
  if (!alphabet) return { password: '', entropyBits: 0 };
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[randInt(alphabet.length)];
  return { password: out, entropyBits: Math.round(length * Math.log2(alphabet.length) * 10) / 10 };
}

const LOREM_WORDS =
  ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ' +
    'enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in ' +
    'reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt ' +
    'culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus iusto odio dignissimos ducimus blanditiis ' +
    'praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi occaecati rerum facilis expedita distinctio')
    .split(' ');

function loremSentence(): string {
  const len = 6 + randInt(9);
  const words = Array.from({ length: len }, () => LOREM_WORDS[randInt(LOREM_WORDS.length)]!);
  const s = words.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

export function generateLorem(mode: 'paragraphs' | 'sentences' | 'words', count: number, classicStart: boolean): string {
  const clamp = Math.max(1, Math.min(count, mode === 'words' ? 5000 : 100));
  let out: string;
  if (mode === 'words') {
    const words = Array.from({ length: clamp }, () => LOREM_WORDS[randInt(LOREM_WORDS.length)]!);
    out = words.join(' ') + '.';
    out = out.charAt(0).toUpperCase() + out.slice(1);
  } else if (mode === 'sentences') {
    out = Array.from({ length: clamp }, loremSentence).join(' ');
  } else {
    out = Array.from({ length: clamp }, () => {
      const n = 3 + randInt(4);
      return Array.from({ length: n }, loremSentence).join(' ');
    }).join('\n\n');
  }
  if (classicStart) {
    out = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' + (out ? ', ' + out.charAt(0).toLowerCase() + out.slice(1) : '.');
  }
  return out;
}

// ───────────────────────── modern IDs (v7 / ULID / NanoID) ─────────────────────────

const hex = (b: number) => b.toString(16).padStart(2, '0');

/** RFC 9562 UUID v7 — 48-bit Unix-ms timestamp + version/variant + secure random, time-sortable. */
export function uuidV7(ts = Date.now()): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[0] = Math.floor(ts / 2 ** 40) & 0xff;
  b[1] = Math.floor(ts / 2 ** 32) & 0xff;
  b[2] = Math.floor(ts / 2 ** 24) & 0xff;
  b[3] = Math.floor(ts / 2 ** 16) & 0xff;
  b[4] = Math.floor(ts / 2 ** 8) & 0xff;
  b[5] = ts & 0xff;
  b[6] = (b[6]! & 0x0f) | 0x70; // version 7
  b[8] = (b[8]! & 0x3f) | 0x80; // variant 10
  const h = [...b].map(hex).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/** ULID — 48-bit ms timestamp + 80-bit randomness, Crockford base32 (26 chars, sortable). */
export function ulid(ts = Date.now()): string {
  let t = ts, time = '';
  for (let i = 0; i < 10; i++) { time = CROCKFORD[t % 32] + time; t = Math.floor(t / 32); }
  const r = new Uint32Array(16);
  crypto.getRandomValues(r);
  let rand = '';
  for (let i = 0; i < 16; i++) rand += CROCKFORD[r[i]! % 32]; // 32 divides 2^32 → unbiased
  return time + rand;
}

const NANO_ALPHABET = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

/** NanoID — URL-safe, cryptographically random. Default 21 chars from a 64-char alphabet. */
export function nanoid(size = 21, alphabet = NANO_ALPHABET): string {
  const len = alphabet.length;
  const bytes = new Uint8Array(size * 2 + 16);
  crypto.getRandomValues(bytes);
  let id = '', i = 0;
  const mask = (2 << Math.floor(Math.log2(len - 1))) - 1; // smallest mask >= len-1
  while (id.length < size) {
    if (i >= bytes.length) { crypto.getRandomValues(bytes); i = 0; }
    const b = bytes[i++]! & mask;
    if (b < len) id += alphabet[b]; // rejection sampling → unbiased for any alphabet
  }
  return id;
}

export interface IdInfo { kind: string; version?: string; timestamp?: string; note?: string }

/** Decode/inspect a UUID or ULID: version + embedded timestamp where present. */
export function decodeId(raw: string): IdInfo | null {
  const s = raw.trim();
  const uuid = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i.exec(s);
  if (uuid) {
    const ver = parseInt(s[14]!, 16);
    const info: IdInfo = { kind: 'UUID', version: `v${ver}` };
    if (ver === 7) {
      const ms = parseInt(s.replace(/-/g, '').slice(0, 12), 16);
      info.timestamp = new Date(ms).toISOString();
    } else if (ver === 4) {
      info.note = 'Random UUID — no embedded timestamp.';
    }
    return info;
  }
  if (/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(s)) {
    let ms = 0;
    for (const c of s.slice(0, 10).toUpperCase()) ms = ms * 32 + CROCKFORD.indexOf(c);
    return { kind: 'ULID', timestamp: new Date(ms).toISOString() };
  }
  return null;
}
