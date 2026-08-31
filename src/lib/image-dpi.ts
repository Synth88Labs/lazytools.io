/**
 * Read and set the DPI (print resolution) metadata of PNG and JPEG files by
 * direct byte editing, no canvas, no re-encoding, so image pixels are untouched.
 * PNG stores density in a `pHYs` chunk (pixels-per-metre); JPEG in the JFIF APP0
 * segment (X/Y density + unit). Pure and deterministic → byte-verifiable in Node.
 */

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const INCH_PER_M = 39.37007874015748; // 1 / 0.0254

// ---- CRC-32 (ISO-HDLC, as used by PNG) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
function u32(n: number): Uint8Array {
  return new Uint8Array([(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]);
}
function isPng(b: Uint8Array): boolean { return PNG_SIG.every((v, i) => b[i] === v); }
function isJpeg(b: Uint8Array): boolean { return b[0] === 0xff && b[1] === 0xd8; }

const dpiToPpm = (dpi: number) => Math.round(dpi * INCH_PER_M);
const ppmToDpi = (ppm: number) => Math.round(ppm / INCH_PER_M);

// ---------- PNG ----------
export function getPngDpi(bytes: Uint8Array): number | null {
  if (!isPng(bytes)) return null;
  let pos = 8;
  while (pos + 8 <= bytes.length) {
    const len = (bytes[pos] << 24) | (bytes[pos + 1] << 16) | (bytes[pos + 2] << 8) | bytes[pos + 3];
    const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
    if (type === 'pHYs') {
      const d = pos + 8;
      const ppuX = (bytes[d] * 2 ** 24) + (bytes[d + 1] << 16) + (bytes[d + 2] << 8) + bytes[d + 3];
      const unit = bytes[d + 8];
      return unit === 1 ? ppmToDpi(ppuX) : null; // unit 0 = aspect only, no real DPI
    }
    if (type === 'IEND') break;
    pos += 12 + len;
  }
  return null;
}

export function setPngDpi(bytes: Uint8Array, dpi: number): Uint8Array {
  if (!isPng(bytes)) throw new Error('Not a PNG file.');
  const ppm = dpiToPpm(dpi);
  // Build the new pHYs chunk.
  const data = concat([u32(ppm), u32(ppm), new Uint8Array([1])]); // X, Y ppu; unit=metre
  const typeAndData = concat([new Uint8Array([0x70, 0x48, 0x59, 0x73]), data]); // "pHYs" + data
  const phys = concat([u32(9), typeAndData, u32(crc32(typeAndData))]);

  // Walk chunks: copy IHDR, drop any existing pHYs, insert new pHYs right after IHDR.
  const out: Uint8Array[] = [bytes.slice(0, 8)];
  let pos = 8;
  let insertedAfterIhdr = false;
  while (pos + 12 <= bytes.length) {
    const len = (bytes[pos] << 24) | (bytes[pos + 1] << 16) | (bytes[pos + 2] << 8) | bytes[pos + 3];
    const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
    const chunk = bytes.slice(pos, pos + 12 + len);
    if (type === 'pHYs') { pos += 12 + len; continue; } // drop old density
    out.push(chunk);
    if (type === 'IHDR' && !insertedAfterIhdr) { out.push(phys); insertedAfterIhdr = true; }
    pos += 12 + len;
    if (type === 'IEND') break;
  }
  return concat(out);
}

// ---------- JPEG ----------
export function getJpegDpi(bytes: Uint8Array): number | null {
  if (!isJpeg(bytes)) return null;
  // Look for the APP0 JFIF segment.
  let pos = 2;
  while (pos + 4 < bytes.length && bytes[pos] === 0xff) {
    const marker = bytes[pos + 1];
    const segLen = (bytes[pos + 2] << 8) | bytes[pos + 3];
    if (marker === 0xe0 && bytes[pos + 4] === 0x4a && bytes[pos + 5] === 0x46 && bytes[pos + 6] === 0x49 && bytes[pos + 7] === 0x46) {
      const u = bytes[pos + 11]; // units: 0 none, 1 dpi, 2 dpcm
      const x = (bytes[pos + 12] << 8) | bytes[pos + 13];
      if (u === 1) return x;
      if (u === 2) return Math.round(x * 2.54); // dots/cm → dpi
      return null;
    }
    if (marker === 0xda || marker === 0xd9) break; // SOS / EOI
    pos += 2 + segLen;
  }
  return null;
}

export function setJpegDpi(bytes: Uint8Array, dpi: number): Uint8Array {
  if (!isJpeg(bytes)) throw new Error('Not a JPEG file.');
  const hi = (dpi >> 8) & 0xff, lo = dpi & 0xff;
  // If an APP0 JFIF segment exists immediately after SOI, edit it in place.
  if (bytes[2] === 0xff && bytes[3] === 0xe0 && bytes[6] === 0x4a && bytes[7] === 0x46) {
    // APP0 JFIF layout from the FF at offset 2: len(4-5) "JFIF\0"(6-10) version(11-12)
    // units(13) Xdensity(14-15) Ydensity(16-17).
    const out = bytes.slice();
    out[13] = 1;                 // units = dpi
    out[14] = hi; out[15] = lo;  // Xdensity
    out[16] = hi; out[17] = lo;  // Ydensity
    return out;
  }
  // Otherwise insert a fresh 16-byte APP0 JFIF segment right after SOI.
  const app0 = new Uint8Array([
    0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, // FF E0, len 16, "JFIF\0"
    0x01, 0x01, // version 1.1
    0x01,       // units = dpi
    hi, lo, hi, lo, // X density, Y density
    0x00, 0x00, // no thumbnail
  ]);
  return concat([bytes.slice(0, 2), app0, bytes.slice(2)]);
}

export type ImgFormat = 'png' | 'jpeg';

export function getImageDpi(bytes: Uint8Array): { format: ImgFormat; dpi: number | null } | null {
  if (isPng(bytes)) return { format: 'png', dpi: getPngDpi(bytes) };
  if (isJpeg(bytes)) return { format: 'jpeg', dpi: getJpegDpi(bytes) };
  return null;
}

export function setImageDpi(bytes: Uint8Array, dpi: number): { bytes: Uint8Array; format: ImgFormat } {
  if (!Number.isFinite(dpi) || dpi <= 0) throw new Error('DPI must be a positive number.');
  if (isPng(bytes)) return { bytes: setPngDpi(bytes, dpi), format: 'png' };
  if (isJpeg(bytes)) return { bytes: setJpegDpi(bytes, dpi), format: 'jpeg' };
  throw new Error('Only PNG and JPEG files carry a DPI value that can be set this way.');
}
