/**
 * A dependency-free CBOR (RFC 8949) decoder that produces both a typed tree
 * for display and the RFC's diagnostic notation. Handles all major types,
 * definite and indefinite lengths, tags, half/single/double floats and simple
 * values. BigInt keeps 64-bit integers exact. Pure and deterministic.
 */

export type CborNode =
  | { type: 'uint' | 'nint'; diag: string; value: bigint }
  | { type: 'float'; diag: string; value: number }
  | { type: 'bool'; diag: string; value: boolean }
  | { type: 'null' | 'undefined'; diag: string }
  | { type: 'simple'; diag: string; value: number }
  | { type: 'bytes'; diag: string; length: number; hex: string }
  | { type: 'text'; diag: string; length: number; text: string }
  | { type: 'array'; diag: string; items: CborNode[] }
  | { type: 'map'; diag: string; entries: { key: CborNode; value: CborNode }[] }
  | { type: 'tag'; diag: string; tag: string; content: CborNode };

class Reader {
  b: Uint8Array; p = 0;
  constructor(b: Uint8Array) { this.b = b; }
  byte() { if (this.p >= this.b.length) throw new Error('Unexpected end of CBOR data'); return this.b[this.p++]!; }
  bytes(n: number) { if (this.p + n > this.b.length) throw new Error('CBOR length exceeds data'); const s = this.b.subarray(this.p, this.p + n); this.p += n; return s; }
}

function readUint(r: Reader, ai: number): bigint {
  if (ai < 24) return BigInt(ai);
  if (ai === 24) return BigInt(r.byte());
  if (ai === 25) { const b = r.bytes(2); return (BigInt(b[0]!) << 8n) | BigInt(b[1]!); }
  if (ai === 26) { const b = r.bytes(4); let v = 0n; for (const x of b) v = (v << 8n) | BigInt(x); return v; }
  if (ai === 27) { const b = r.bytes(8); let v = 0n; for (const x of b) v = (v << 8n) | BigInt(x); return v; }
  throw new Error(`Reserved additional-info value ${ai}`);
}

function halfToFloat(u: number): number {
  const sign = (u & 0x8000) ? -1 : 1;
  const exp = (u >> 10) & 0x1f;
  const mant = u & 0x3ff;
  if (exp === 0) return sign * mant * Math.pow(2, -24);
  if (exp === 31) return mant ? NaN : sign * Infinity;
  return sign * (1 + mant / 1024) * Math.pow(2, exp - 15);
}

function formatFloat(v: number): string {
  if (Number.isNaN(v)) return 'NaN';
  if (v === Infinity) return 'Infinity';
  if (v === -Infinity) return '-Infinity';
  if (Number.isInteger(v)) return (Object.is(v, -0) ? '-0' : v.toString()) + '.0';
  return v.toString();
}

const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const toHex = (b: Uint8Array) => Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');

function decodeItem(r: Reader, depth: number): CborNode {
  if (depth > 256) throw new Error('CBOR nested too deep');
  const ib = r.byte();
  const mt = ib >> 5;
  const ai = ib & 0x1f;

  switch (mt) {
    case 0: { const v = readUint(r, ai); return { type: 'uint', diag: v.toString(), value: v }; }
    case 1: { const v = readUint(r, ai); const n = -1n - v; return { type: 'nint', diag: n.toString(), value: n }; }
    case 2: {
      if (ai === 31) { const parts: number[] = []; while (true) { const nx = r.byte(); if (nx === 0xff) break; r.p--; const chunk = decodeItem(r, depth + 1); if (chunk.type !== 'bytes') throw new Error('Bad indefinite byte string'); for (const c of hexToBytes(chunk.hex)) parts.push(c); } const u = Uint8Array.from(parts); return { type: 'bytes', diag: `h'${toHex(u)}'`, length: u.length, hex: toHex(u) }; }
      const len = Number(readUint(r, ai)); const bs = r.bytes(len); return { type: 'bytes', diag: `h'${toHex(bs)}'`, length: len, hex: toHex(bs) };
    }
    case 3: {
      if (ai === 31) { let s = ''; while (true) { const nx = r.byte(); if (nx === 0xff) break; r.p--; const chunk = decodeItem(r, depth + 1); if (chunk.type !== 'text') throw new Error('Bad indefinite text string'); s += chunk.text; } return { type: 'text', diag: `"${escapeText(s)}"`, length: s.length, text: s }; }
      const len = Number(readUint(r, ai)); const bs = r.bytes(len); const t = new TextDecoder('utf-8', { fatal: false }).decode(bs); return { type: 'text', diag: `"${escapeText(t)}"`, length: len, text: t };
    }
    case 4: {
      const items: CborNode[] = [];
      if (ai === 31) { while (true) { const nx = r.byte(); if (nx === 0xff) break; r.p--; items.push(decodeItem(r, depth + 1)); } }
      else { const n = Number(readUint(r, ai)); for (let i = 0; i < n; i++) items.push(decodeItem(r, depth + 1)); }
      return { type: 'array', diag: `[${items.map((x) => x.diag).join(', ')}]`, items };
    }
    case 5: {
      const entries: { key: CborNode; value: CborNode }[] = [];
      if (ai === 31) { while (true) { const nx = r.byte(); if (nx === 0xff) break; r.p--; const key = decodeItem(r, depth + 1); const value = decodeItem(r, depth + 1); entries.push({ key, value }); } }
      else { const n = Number(readUint(r, ai)); for (let i = 0; i < n; i++) { const key = decodeItem(r, depth + 1); const value = decodeItem(r, depth + 1); entries.push({ key, value }); } }
      return { type: 'map', diag: `{${entries.map((e) => `${e.key.diag}: ${e.value.diag}`).join(', ')}}`, entries };
    }
    case 6: {
      const tag = readUint(r, ai); const content = decodeItem(r, depth + 1);
      return { type: 'tag', diag: `${tag}(${content.diag})`, tag: tag.toString(), content };
    }
    case 7: {
      if (ai === 20) return { type: 'bool', diag: 'false', value: false };
      if (ai === 21) return { type: 'bool', diag: 'true', value: true };
      if (ai === 22) return { type: 'null', diag: 'null' };
      if (ai === 23) return { type: 'undefined', diag: 'undefined' };
      if (ai === 25) { const b = r.bytes(2); const v = halfToFloat((b[0]! << 8) | b[1]!); return { type: 'float', diag: formatFloat(v), value: v }; }
      if (ai === 26) { const b = r.bytes(4); const dv = new DataView(b.buffer, b.byteOffset, 4); const v = dv.getFloat32(0, false); return { type: 'float', diag: formatFloat(v), value: v }; }
      if (ai === 27) { const b = r.bytes(8); const dv = new DataView(b.buffer, b.byteOffset, 8); const v = dv.getFloat64(0, false); return { type: 'float', diag: formatFloat(v), value: v }; }
      if (ai === 24) { const s = r.byte(); return { type: 'simple', diag: `simple(${s})`, value: s }; }
      if (ai < 20) return { type: 'simple', diag: `simple(${ai})`, value: ai };
      throw new Error(`Unsupported simple/float additional-info ${ai}`);
    }
    default: throw new Error(`Unknown CBOR major type ${mt}`);
  }
}

function hexToBytes(hex: string): Uint8Array { const o = new Uint8Array(hex.length / 2); for (let i = 0; i < o.length; i++) o[i] = parseInt(hex.substr(i * 2, 2), 16); return o; }

/** Parse hex / 0x / base64 input into bytes. */
export function bytesFromInput(input: string): Uint8Array {
  const t = input.trim();
  const hexish = t.replace(/0x/gi, '').replace(/[\s,]/g, '');
  if (/^[0-9a-fA-F]+$/.test(hexish) && hexish.length % 2 === 0 && hexish.length > 0) return hexToBytes(hexish);
  const b64 = t.replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = typeof atob === 'function' ? atob(pad) : Buffer.from(pad, 'base64').toString('binary');
  const o = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) o[i] = bin.charCodeAt(i); return o;
}

export interface CborResult { tree: CborNode; diagnostic: string; bytesRead: number; trailing: number; }

export function decodeCbor(input: string): CborResult {
  const bytes = bytesFromInput(input);
  if (bytes.length === 0) throw new Error('No bytes to decode.');
  const r = new Reader(bytes);
  const tree = decodeItem(r, 0);
  return { tree, diagnostic: tree.diag, bytesRead: r.p, trailing: bytes.length - r.p };
}
