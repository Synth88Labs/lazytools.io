/**
 * Deterministic encoders / validators for developer tools — all pure,
 * dependency-free, and covered by Node tests against official vectors
 * (RFC 4648 Base32, ISO 13616 IBAN mod-97, ISBN check digits, RFC 3492
 * Punycode). No network, no browser APIs required.
 */

/* ------------------------------- Base32 (RFC 4648) ------------------------------- */

const B32_STD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const B32_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';

export function base32Encode(bytes: Uint8Array, hex = false): string {
  const alpha = hex ? B32_HEX : B32_STD;
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of bytes) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += alpha[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += alpha[(value << (5 - bits)) & 31];
  while (out.length % 8 !== 0) out += '=';
  return out;
}

export function base32Decode(str: string, hex = false): Uint8Array {
  const alpha = hex ? B32_HEX : B32_STD;
  const clean = str.toUpperCase().replace(/=+$/, '').replace(/\s+/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const c of clean) {
    const idx = alpha.indexOf(c);
    if (idx < 0) throw new Error(`Invalid Base32 character: "${c}"`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

/* ------------------------------- IBAN (ISO 13616) ------------------------------- */

/** Expected total length per country (subset — length is validated when known). */
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AT: 20, BE: 16, BG: 22, CH: 21, CZ: 24, DE: 22, DK: 18, EE: 20,
  ES: 24, FI: 18, FR: 27, GB: 22, GR: 27, HU: 28, IE: 22, IT: 27, LU: 20, NL: 18,
  NO: 15, PL: 28, PT: 25, RO: 24, SE: 24, SK: 24, SI: 19,
};

export interface IbanResult {
  valid: boolean;
  formatted: string;
  country: string;
  lengthOk: boolean | null;
  reason?: string;
}

export function ibanValidate(input: string): IbanResult {
  const clean = input.replace(/\s+/g, '').toUpperCase();
  const formatted = clean.replace(/(.{4})/g, '$1 ').trim();
  const country = clean.slice(0, 2);
  if (!/^[A-Z0-9]+$/.test(clean)) {
    return { valid: false, formatted, country, lengthOk: null, reason: 'Contains characters that are not letters or digits.' };
  }
  if (!/^[A-Z]{2}[0-9]{2}/.test(clean)) {
    return { valid: false, formatted, country, lengthOk: null, reason: 'Must start with 2 letters (country) then 2 check digits.' };
  }
  if (clean.length < 15 || clean.length > 34) {
    return { valid: false, formatted, country, lengthOk: false, reason: 'Length must be between 15 and 34 characters.' };
  }
  const expected = IBAN_LENGTHS[country];
  const lengthOk = expected === undefined ? null : clean.length === expected;
  if (lengthOk === false) {
    return { valid: false, formatted, country, lengthOk, reason: `${country} IBANs are ${expected} characters; this is ${clean.length}.` };
  }
  // Move the first 4 chars to the end, convert letters (A=10 … Z=35) to digits, mod 97.
  const rearranged = clean.slice(4) + clean.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const chunk = /[A-Z]/.test(ch) ? (ch.charCodeAt(0) - 55).toString() : ch;
    for (const d of chunk) remainder = (remainder * 10 + (d.charCodeAt(0) - 48)) % 97;
  }
  const valid = remainder === 1;
  return { valid, formatted, country, lengthOk, reason: valid ? undefined : 'Checksum failed — the mod-97 remainder is not 1.' };
}

/* ------------------------------- ISBN-10 / ISBN-13 ------------------------------- */

export interface IsbnResult {
  valid: boolean;
  type: 'ISBN-10' | 'ISBN-13' | 'unknown';
  isbn10?: string;
  isbn13?: string;
  reason?: string;
}

function isbn13CheckDigit(first12: string): string {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += (i % 2 === 0 ? 1 : 3) * (first12.charCodeAt(i) - 48);
  return String((10 - (sum % 10)) % 10);
}

function isbn10CheckDigit(first9: string): string {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * (first9.charCodeAt(i) - 48);
  const check = (11 - (sum % 11)) % 11;
  return check === 10 ? 'X' : String(check);
}

export function isbnInfo(input: string): IsbnResult {
  const clean = input.replace(/[\s-]/g, '').toUpperCase();
  if (/^\d{9}[\dX]$/.test(clean)) {
    const valid = isbn10CheckDigit(clean.slice(0, 9)) === clean[9];
    if (!valid) return { valid: false, type: 'ISBN-10', reason: 'ISBN-10 check digit does not match.' };
    const core = '978' + clean.slice(0, 9);
    const isbn13 = core + isbn13CheckDigit(core);
    return { valid: true, type: 'ISBN-10', isbn10: clean, isbn13 };
  }
  if (/^\d{13}$/.test(clean)) {
    const valid = isbn13CheckDigit(clean.slice(0, 12)) === clean[12];
    if (!valid) return { valid: false, type: 'ISBN-13', reason: 'ISBN-13 check digit does not match.' };
    let isbn10: string | undefined;
    if (clean.startsWith('978')) {
      const first9 = clean.slice(3, 12);
      isbn10 = first9 + isbn10CheckDigit(first9);
    }
    return { valid: true, type: 'ISBN-13', isbn13: clean, isbn10 };
  }
  return { valid: false, type: 'unknown', reason: 'Not a 10- or 13-digit ISBN (after removing spaces and hyphens).' };
}

/* ------------------------------- Punycode (RFC 3492) ------------------------------- */

const PN_BASE = 36;
const PN_TMIN = 1;
const PN_TMAX = 26;
const PN_SKEW = 38;
const PN_DAMP = 700;
const PN_INITIAL_BIAS = 72;
const PN_INITIAL_N = 128;

function pnAdapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / PN_DAMP) : delta >> 1;
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > ((PN_BASE - PN_TMIN) * PN_TMAX) >> 1) {
    delta = Math.floor(delta / (PN_BASE - PN_TMIN));
    k += PN_BASE;
  }
  return k + Math.floor(((PN_BASE - PN_TMIN + 1) * delta) / (delta + PN_SKEW));
}

/** digit (0-35) → basic code point (a-z0-9). */
function pnDigitToBasic(d: number): number {
  return d + 22 + 75 * (d < 26 ? 1 : 0);
}

/** basic code point → digit (0-35), or PN_BASE if invalid. */
function pnBasicToDigit(cp: number): number {
  if (cp - 48 < 10) return cp - 22; // 0-9 → 26-35
  if (cp - 65 < 26) return cp - 65; // A-Z → 0-25
  if (cp - 97 < 26) return cp - 97; // a-z → 0-25
  return PN_BASE;
}

/** Encode a single label (no xn-- prefix). */
export function punycodeEncode(input: string): string {
  const codePoints = Array.from(input, (c) => c.codePointAt(0)!);
  const output: string[] = [];
  let n = PN_INITIAL_N;
  let delta = 0;
  let bias = PN_INITIAL_BIAS;

  const basic = codePoints.filter((c) => c < 128);
  let h = basic.length;
  const b = h;
  for (const c of basic) output.push(String.fromCodePoint(c));
  if (b > 0) output.push('-');

  while (h < codePoints.length) {
    let m = Infinity;
    for (const c of codePoints) if (c >= n && c < m) m = c;
    delta += (m - n) * (h + 1);
    n = m;
    for (const c of codePoints) {
      if (c < n) delta++;
      else if (c === n) {
        let q = delta;
        for (let k = PN_BASE; ; k += PN_BASE) {
          const t = k <= bias ? PN_TMIN : k >= bias + PN_TMAX ? PN_TMAX : k - bias;
          if (q < t) break;
          output.push(String.fromCharCode(pnDigitToBasic(t + ((q - t) % (PN_BASE - t)))));
          q = Math.floor((q - t) / (PN_BASE - t));
        }
        output.push(String.fromCharCode(pnDigitToBasic(q)));
        bias = pnAdapt(delta, h + 1, h === b);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }
  return output.join('');
}

/** Decode a single label (input has NO xn-- prefix). */
export function punycodeDecode(input: string): string {
  const output: number[] = [];
  let n = PN_INITIAL_N;
  let i = 0;
  let bias = PN_INITIAL_BIAS;

  const lastDelim = input.lastIndexOf('-');
  const basicEnd = lastDelim < 0 ? 0 : lastDelim;
  for (let j = 0; j < basicEnd; j++) {
    const cp = input.charCodeAt(j);
    if (cp >= 128) throw new Error('Not a basic code point in Punycode input.');
    output.push(cp);
  }

  let idx = lastDelim < 0 ? 0 : lastDelim + 1;
  while (idx < input.length) {
    const oldi = i;
    let w = 1;
    for (let k = PN_BASE; ; k += PN_BASE) {
      if (idx >= input.length) throw new Error('Unexpected end of Punycode input.');
      const digit = pnBasicToDigit(input.charCodeAt(idx++));
      if (digit >= PN_BASE) throw new Error('Invalid Punycode digit.');
      i += digit * w;
      const t = k <= bias ? PN_TMIN : k >= bias + PN_TMAX ? PN_TMAX : k - bias;
      if (digit < t) break;
      w *= PN_BASE - t;
    }
    const outLen = output.length + 1;
    bias = pnAdapt(i - oldi, outLen, oldi === 0);
    n += Math.floor(i / outLen);
    i %= outLen;
    output.splice(i, 0, n);
    i++;
  }
  return String.fromCodePoint(...output);
}

/** Convert a Unicode domain to ASCII (encoding non-ASCII labels as xn--…). */
export function domainToAscii(domain: string): string {
  return domain
    .split('.')
    .map((label) => (/[^\x00-\x7F]/.test(label) ? 'xn--' + punycodeEncode(label) : label))
    .join('.');
}

/** Convert an ASCII (possibly xn--) domain back to Unicode. */
export function domainToUnicode(domain: string): string {
  return domain
    .split('.')
    .map((label) => (/^xn--/i.test(label) ? punycodeDecode(label.slice(4)) : label))
    .join('.');
}
