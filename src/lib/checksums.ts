/**
 * CRC-32 and Adler-32 checksums over bytes or UTF-8 text. Pure and
 * deterministic. CRC-32 (ISO-HDLC, the ZIP/PNG variant) is reused from the
 * image-dpi module; Adler-32 (used by zlib) is implemented here. Both return an
 * unsigned 32-bit value plus its zero-padded hex form.
 */
import { crc32 } from './image-dpi.ts';

/** Adler-32 checksum (zlib): two rolling 16-bit sums modulo 65521. */
export function adler32(bytes: Uint8Array): number {
  const MOD = 65521;
  let a = 1, b = 0;
  // Process in blocks to keep a,b within safe-integer range before the modulo.
  let i = 0;
  const n = bytes.length;
  while (i < n) {
    const end = Math.min(i + 5552, n); // 5552 = largest block before overflow risk
    for (; i < end; i++) { a += bytes[i]; b += a; }
    a %= MOD; b %= MOD;
  }
  return ((b << 16) | a) >>> 0;
}

const hex8 = (n: number) => (n >>> 0).toString(16).toUpperCase().padStart(8, '0');

export interface ChecksumResult {
  crc32: number; crc32Hex: string;
  adler32: number; adler32Hex: string;
  bytes: number;
}

export function checksums(bytes: Uint8Array): ChecksumResult {
  const c = crc32(bytes);
  const a = adler32(bytes);
  return { crc32: c, crc32Hex: hex8(c), adler32: a, adler32Hex: hex8(a), bytes: bytes.length };
}

export function checksumText(text: string): ChecksumResult {
  return checksums(new TextEncoder().encode(text));
}

export { crc32 };
