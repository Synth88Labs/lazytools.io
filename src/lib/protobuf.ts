/**
 * A dependency-free Protocol Buffers wire-format decoder, the equivalent of
 * `protoc --decode_raw`. Without a .proto schema you can't recover field names
 * or exact declared types, but the wire format is fully self-describing for
 * field numbers and wire types, so we decode the structure and offer the
 * plausible interpretations of each value. Pure and deterministic; BigInt is
 * used so 64-bit values stay exact.
 */

export type WireField =
  | { field: number; wire: 'varint'; uint: string; sint: string; bool?: boolean }
  | { field: number; wire: 'i64'; hex: string; uint: string; int: string; double: number }
  | { field: number; wire: 'i32'; hex: string; uint: number; int: number; float: number }
  | { field: number; wire: 'len'; length: number; kind: 'message' | 'string' | 'bytes'; text?: string; hex?: string; fields?: WireField[] };

const WIRE_NAMES: Record<number, string> = { 0: 'varint', 1: 'i64', 2: 'len', 3: 'sgroup', 4: 'egroup', 5: 'i32' };

function readVarint(b: Uint8Array, pos: number): { value: bigint; next: number } {
  let result = 0n, shift = 0n, p = pos;
  while (p < b.length) {
    const byte = b[p]!;
    result |= BigInt(byte & 0x7f) << shift;
    p++;
    if ((byte & 0x80) === 0) return { value: result, next: p };
    shift += 7n;
    if (shift > 70n) throw new Error('Varint too long (malformed)');
  }
  throw new Error('Truncated varint');
}

const asInt64 = (u: bigint) => (u >= 1n << 63n ? u - (1n << 64n) : u);
const zigzag = (u: bigint) => (u >> 1n) ^ -(u & 1n);

/** Accept the length-delimited bytes as text only when they decode as UTF-8
 *  with no disallowed control characters (tab/newline/CR are fine). */
function isPrintableUtf8(bytes: Uint8Array): string | null {
  try {
    const s = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      if (c < 0x20 && c !== 0x09 && c !== 0x0a && c !== 0x0d) return null;
    }
    return s;
  } catch { return null; }
}

const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join(' ');

/** Decode a protobuf message body into a list of fields. Throws on malformed input. */
export function decodeMessage(b: Uint8Array, depth = 0): WireField[] {
  if (depth > 100) throw new Error('Nested too deep');
  const out: WireField[] = [];
  let p = 0;
  while (p < b.length) {
    const { value: tag, next } = readVarint(b, p);
    p = next;
    const field = Number(tag >> 3n);
    const wire = Number(tag & 0x7n);
    if (field === 0) throw new Error('Invalid field number 0');
    if (wire === 0) {
      const { value, next: n2 } = readVarint(b, p); p = n2;
      out.push({ field, wire: 'varint', uint: value.toString(), sint: zigzag(value).toString(), bool: value === 0n || value === 1n ? value === 1n : undefined });
    } else if (wire === 1) {
      if (p + 8 > b.length) throw new Error('Truncated 64-bit value');
      const slice = b.subarray(p, p + 8); p += 8;
      const dv = new DataView(slice.buffer, slice.byteOffset, 8);
      const u = dv.getBigUint64(0, true);
      out.push({ field, wire: 'i64', hex: '0x' + u.toString(16).padStart(16, '0'), uint: u.toString(), int: asInt64(u).toString(), double: dv.getFloat64(0, true) });
    } else if (wire === 5) {
      if (p + 4 > b.length) throw new Error('Truncated 32-bit value');
      const slice = b.subarray(p, p + 4); p += 4;
      const dv = new DataView(slice.buffer, slice.byteOffset, 4);
      const u = dv.getUint32(0, true);
      out.push({ field, wire: 'i32', hex: '0x' + u.toString(16).padStart(8, '0'), uint: u, int: dv.getInt32(0, true), float: dv.getFloat32(0, true) });
    } else if (wire === 2) {
      const { value: len, next: n3 } = readVarint(b, p); p = n3;
      const L = Number(len);
      if (p + L > b.length) throw new Error('Length-delimited field exceeds buffer');
      const body = b.subarray(p, p + L); p += L;
      out.push(interpretLen(field, body, depth));
    } else {
      throw new Error(`Unsupported wire type ${wire} (${WIRE_NAMES[wire] ?? '?'}) — groups are deprecated`);
    }
  }
  return out;
}

function interpretLen(field: number, body: Uint8Array, depth: number): WireField {
  // Prefer a nested message when the bytes parse cleanly as one (protoc --decode_raw behaviour).
  if (body.length > 0) {
    try {
      const sub = decodeMessage(body, depth + 1);
      if (sub.length > 0) return { field, wire: 'len', length: body.length, kind: 'message', fields: sub };
    } catch { /* not a message */ }
  }
  const text = isPrintableUtf8(body);
  if (text !== null) return { field, wire: 'len', length: body.length, kind: 'string', text };
  return { field, wire: 'len', length: body.length, kind: 'bytes', hex: toHex(body) };
}

/** Parse a hex, base64, or 0x-prefixed byte string into bytes. */
export function bytesFromInput(input: string): Uint8Array {
  const t = input.trim();
  // Accept "08 96 01", "0x08,0x96,0x01", "089601", etc. by stripping 0x/space/comma.
  const hexish = t.replace(/0x/gi, '').replace(/[\s,]/g, '');
  if (/^[0-9a-fA-F]+$/.test(hexish) && hexish.length % 2 === 0 && hexish.length > 0) {
    const out = new Uint8Array(hexish.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hexish.substr(i * 2, 2), 16);
    return out;
  }
  // Base64 (standard or URL-safe).
  const b64 = t.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = typeof atob === 'function' ? atob(pad) : Buffer.from(pad, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function decodeProtobuf(input: string): WireField[] {
  const bytes = bytesFromInput(input);
  if (bytes.length === 0) throw new Error('No bytes to decode.');
  return decodeMessage(bytes);
}
