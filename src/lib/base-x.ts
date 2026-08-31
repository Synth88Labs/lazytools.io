/**
 * Ascii85 (Adobe/PDF variant) and Base62 encoders/decoders over raw bytes.
 *
 * Ascii85 packs 4 bytes into 5 printable ASCII characters (vs Base64's 4→3),
 * so it is ~7% denser than Base64; it is the encoding inside PDF and
 * PostScript streams. Base62 uses the URL-safe alphabet [0-9A-Za-z] with no
 * padding, via the same big-integer scheme as Base58 (leading zero bytes map
 * to leading '0's), so it round-trips arbitrary data. All pure functions.
 */

// ---------------------------------------------------------------------------
// Ascii85 (Adobe)
// ---------------------------------------------------------------------------

/** Encode bytes as Adobe Ascii85. `delimiters` wraps output in <~ … ~>. */
export function ascii85Encode(bytes: Uint8Array, delimiters = false): string {
  let out = '';
  const n = bytes.length;
  let i = 0;
  for (; i + 4 <= n; i += 4) {
    let v = (bytes[i]! * 0x1000000) + (bytes[i + 1]! << 16) + (bytes[i + 2]! << 8) + bytes[i + 3]!;
    v = v >>> 0;
    if (v === 0) { out += 'z'; continue; }
    out += encodeGroup(v, 5);
  }
  const rem = n - i;
  if (rem > 0) {
    let v = 0;
    for (let k = 0; k < 4; k++) v = (v * 256 + (k < rem ? bytes[i + k]! : 0)) >>> 0;
    out += encodeGroup(v, rem + 1);
  }
  return delimiters ? `<~${out}~>` : out;
}

function encodeGroup(v: number, count: number): string {
  const chars = new Array(5);
  for (let j = 4; j >= 0; j--) { chars[j] = String.fromCharCode(33 + (v % 85)); v = Math.floor(v / 85); }
  return chars.slice(0, count).join('');
}

/** Decode Adobe Ascii85. Tolerates <~ ~> delimiters and whitespace. */
export function ascii85Decode(text: string): Uint8Array {
  let s = text.trim();
  const dm = s.match(/^<~([\s\S]*?)~>$/);
  if (dm) s = dm[1]!;
  s = s.replace(/\s+/g, '');
  const out: number[] = [];
  let group: number[] = [];
  const flush = (count: number) => {
    while (group.length < 5) group.push(84); // pad with 'u'
    let v = 0;
    for (let k = 0; k < 5; k++) v = (v * 85 + group[k]!) >>> 0;
    const b = [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff];
    for (let k = 0; k < count - 1; k++) out.push(b[k]!);
    group = [];
  };
  for (let idx = 0; idx < s.length; idx++) {
    const c = s[idx]!;
    if (c === 'z') {
      if (group.length !== 0) throw new Error("'z' cannot appear inside an Ascii85 group");
      out.push(0, 0, 0, 0);
      continue;
    }
    const code = c.charCodeAt(0) - 33;
    if (code < 0 || code > 84) throw new Error(`Invalid Ascii85 character: '${c}'`);
    group.push(code);
    if (group.length === 5) flush(5);
  }
  if (group.length === 1) throw new Error('Truncated Ascii85: a final group needs at least 2 characters');
  if (group.length > 0) flush(group.length);
  return Uint8Array.from(out);
}

// ---------------------------------------------------------------------------
// Base62 (and the generic base-x scheme it uses)
// ---------------------------------------------------------------------------

export const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** Encode bytes in an arbitrary alphabet via the Base58-style big-integer
 *  scheme (leading zero bytes become leading alphabet[0] characters). */
export function baseXEncode(bytes: Uint8Array, alphabet: string): string {
  const base = alphabet.length;
  if (bytes.length === 0) return '';
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;
  // Convert the big-endian byte array to the target base by repeated division.
  const digits: number[] = [];
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i]!;
    for (let j = 0; j < digits.length; j++) {
      carry += digits[j]! * 256;
      digits[j] = carry % base;
      carry = Math.floor(carry / base);
    }
    while (carry > 0) { digits.push(carry % base); carry = Math.floor(carry / base); }
  }
  let out = alphabet[0]!.repeat(zeros);
  for (let j = digits.length - 1; j >= 0; j--) out += alphabet[digits[j]!];
  return out;
}

/** Inverse of baseXEncode. */
export function baseXDecode(str: string, alphabet: string): Uint8Array {
  const base = alphabet.length;
  const map: Record<string, number> = {};
  for (let i = 0; i < alphabet.length; i++) map[alphabet[i]!] = i;
  if (str.length === 0) return new Uint8Array(0);
  let zeros = 0;
  while (zeros < str.length && str[zeros] === alphabet[0]) zeros++;
  const bytes: number[] = [];
  for (let i = zeros; i < str.length; i++) {
    const val = map[str[i]!];
    if (val === undefined) throw new Error(`Invalid character for this alphabet: '${str[i]}'`);
    let carry = val;
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j]! * base;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) { bytes.push(carry & 0xff); carry >>= 8; }
  }
  const out = new Uint8Array(zeros + bytes.length);
  // leading zeros already accounted; bytes are little-endian → reverse into place
  for (let j = 0; j < bytes.length; j++) out[zeros + j] = bytes[bytes.length - 1 - j]!;
  return out;
}

export function base62Encode(bytes: Uint8Array): string { return baseXEncode(bytes, BASE62_ALPHABET); }
export function base62Decode(str: string): Uint8Array { return baseXDecode(str, BASE62_ALPHABET); }

// Base58, the Bitcoin/IPFS alphabet (no 0, O, I, l to avoid look-alikes).
export const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export function base58Encode(bytes: Uint8Array): string { return baseXEncode(bytes, BASE58_ALPHABET); }
export function base58Decode(str: string): Uint8Array { return baseXDecode(str, BASE58_ALPHABET); }
