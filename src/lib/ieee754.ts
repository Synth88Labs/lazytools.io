/**
 * IEEE 754 floating-point inspector: convert a real number to its half
 * (binary16), single (binary32) and double (binary64) bit patterns, and decode
 * a raw bit pattern back to a value. Shows the sign / exponent / mantissa
 * fields, the hex, the exact stored value and the rounding error. Uses DataView
 * for single/double (byte-exact) and a verified round-trip for half. Pure.
 */

export interface FloatFormat {
  name: string; totalBits: number; expBits: number; mantBits: number; bias: number;
  sign: 0 | 1;
  exponentRaw: number;      // biased exponent field
  exponentUnbiased: number | null;
  mantissaHex: string;
  hex: string;              // full bit pattern, e.g. "0x3F800000"
  binary: string;           // "0 01111111 0000…" grouped
  stored: number;           // the value actually represented
  error: number;            // stored - input
  category: string;         // normal | subnormal | zero | infinity | nan
}

// ---- half (binary16) decode: verified against RFC 8949 CBOR vectors ----
function halfToFloat(u: number): number {
  const sign = (u & 0x8000) ? -1 : 1;
  const exp = (u >> 10) & 0x1f;
  const mant = u & 0x3ff;
  if (exp === 0) return sign * mant * Math.pow(2, -24);
  if (exp === 31) return mant ? NaN : sign * Infinity;
  return sign * (1 + mant / 1024) * Math.pow(2, exp - 15);
}

/** Encode a number to half bits. Uses a float32 intermediate for a candidate,
 *  then checks neighbours against the exact half decode so double-rounding
 *  can never leave the result off by a ULP. */
function floatToHalf(value: number): number {
  if (Number.isNaN(value)) return 0x7e00;
  const sign = (value < 0 || Object.is(value, -0)) ? 0x8000 : 0;
  const av = Math.abs(value);
  if (av === Infinity) return sign | 0x7c00;
  if (av === 0) return sign;
  if (av >= 65520) return sign | 0x7c00; // rounds to infinity

  // Candidate via the standard f32 → f16 path.
  const f32 = new Float32Array([av]);
  const x = new Uint32Array(f32.buffer)[0]!;
  const e = ((x >> 23) & 0xff) - 127 + 15;
  const m = x & 0x7fffff;
  let cand: number;
  if (e >= 0x1f) cand = 0x7c00;
  else if (e <= 0) {
    if (e < -10) cand = 0;
    else { const mm = m | 0x800000; const shift = 14 - e; cand = mm >> shift; }
  } else cand = (e << 10) | (m >> 13);

  // Pick the neighbour (same sign magnitude) that best matches, ties to even.
  let best = cand & 0x7fff, bestErr = Infinity;
  for (let c = Math.max(0, cand - 2); c <= Math.min(0x7c00, cand + 2); c++) {
    const v = halfToFloat(c);
    const err = Math.abs(v - av);
    if (err < bestErr || (err === bestErr && (c & 1) === 0)) { bestErr = err; best = c; }
  }
  return sign | best;
}

function grouped(bits: string, expBits: number): string {
  return bits[0] + ' ' + bits.slice(1, 1 + expBits) + ' ' + bits.slice(1 + expBits);
}

function categorize(expRaw: number, mantIsZero: boolean, maxExp: number): string {
  if (expRaw === maxExp) return mantIsZero ? 'infinity' : 'nan';
  if (expRaw === 0) return mantIsZero ? 'zero' : 'subnormal';
  return 'normal';
}

function build(name: string, totalBits: number, expBits: number, mantBits: number, rawBits: bigint, stored: number, input: number | null): FloatFormat {
  const bias = (1 << (expBits - 1)) - 1;
  const maxExp = (1 << expBits) - 1;
  const sign = Number((rawBits >> BigInt(totalBits - 1)) & 1n) as 0 | 1;
  const exponentRaw = Number((rawBits >> BigInt(mantBits)) & ((1n << BigInt(expBits)) - 1n));
  const mantissa = rawBits & ((1n << BigInt(mantBits)) - 1n);
  const category = categorize(exponentRaw, mantissa === 0n, maxExp);
  const bin = rawBits.toString(2).padStart(totalBits, '0');
  const hexDigits = totalBits / 4;
  return {
    name, totalBits, expBits, mantBits, bias, sign,
    exponentRaw,
    exponentUnbiased: category === 'normal' ? exponentRaw - bias : category === 'subnormal' ? 1 - bias : null,
    mantissaHex: '0x' + mantissa.toString(16).padStart(Math.ceil(mantBits / 4), '0'),
    hex: '0x' + rawBits.toString(16).padStart(hexDigits, '0').toUpperCase(),
    binary: grouped(bin, expBits),
    stored,
    error: input === null || Number.isNaN(stored) ? 0 : stored - input,
    category,
  };
}

/** Encode a number into all three IEEE 754 formats. */
export function encodeFloat(value: number): FloatFormat[] {
  // Half
  const hb = floatToHalf(value);
  const half = build('binary16 (half)', 16, 5, 10, BigInt(hb), halfToFloat(hb), value);
  // Single
  const f32 = new Float32Array([value]);
  const sb = new Uint32Array(f32.buffer)[0]!;
  const single = build('binary32 (single)', 32, 8, 23, BigInt(sb >>> 0), Math.fround(value), value);
  // Double
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, value, false);
  const db = dv.getBigUint64(0, false);
  const double = build('binary64 (double)', 64, 11, 52, db, value, value);
  return [half, single, double];
}

/** Decode a raw bit pattern (hex or binary) of the given width into a value + fields. */
export function decodeBits(input: string, width: 16 | 32 | 64): FloatFormat {
  const t = input.trim().replace(/^0x/i, '').replace(/\s/g, '');
  let raw: bigint;
  if (/^[01]+$/.test(t) && t.length === width) raw = BigInt('0b' + t);
  else if (/^[0-9a-fA-F]+$/.test(t)) raw = BigInt('0x' + t);
  else throw new Error(`Enter ${width} bits as hex (${width / 4} digits) or binary (${width} digits).`);
  const mask = (1n << BigInt(width)) - 1n;
  if (raw > mask) throw new Error(`Value has more than ${width} bits.`);
  raw &= mask;
  let stored: number;
  if (width === 16) stored = halfToFloat(Number(raw));
  else if (width === 32) { const u = new Uint32Array(1); u[0] = Number(raw); stored = new Float32Array(u.buffer)[0]!; }
  else { const dv = new DataView(new ArrayBuffer(8)); dv.setBigUint64(0, raw, false); stored = dv.getFloat64(0, false); }
  const specs = { 16: [5, 10, 'binary16 (half)'], 32: [8, 23, 'binary32 (single)'], 64: [11, 52, 'binary64 (double)'] } as const;
  const [eb, mb, name] = specs[width];
  return build(name as string, width, eb as number, mb as number, raw, stored, null);
}
