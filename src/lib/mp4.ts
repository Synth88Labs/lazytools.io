/**
 * A dependency-free inspector for ISO Base Media File Format files (MP4, MOV,
 * M4A, HEIF…). These formats are a tree of "boxes" (a.k.a. atoms): a size, a
 * four-character type, and either child boxes or data. This walks the tree,
 * decodes the useful headers (ftyp brands, mvhd/mdhd duration, hdlr handler,
 * tkhd), and reports the structure. Read-only and pure, it parses boxes, not
 * media samples.
 */

export interface Mp4Box {
  type: string;
  size: number;
  offset: number;
  headerSize: number;
  info?: string;
  children?: Mp4Box[];
}

export interface Mp4Info {
  majorBrand?: string;
  compatibleBrands: string[];
  timescale?: number;
  durationSec?: number;
  boxes: Mp4Box[];
  handlers: string[];   // e.g. ['vide', 'soun']
}

// Boxes whose payload is a sequence of child boxes.
const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'dinf', 'edts', 'udta', 'mvex', 'moof', 'traf', 'mfra', 'stsd', 'sinf', 'schi']);

const u32 = (b: Uint8Array, o: number) => ((b[o]! * 0x1000000) + (b[o + 1]! << 16) + (b[o + 2]! << 8) + b[o + 3]!) >>> 0;
const ascii = (b: Uint8Array, o: number, n: number) => { let s = ''; for (let i = 0; i < n; i++) { const c = b[o + i]!; s += c >= 32 && c < 127 ? String.fromCharCode(c) : '·'; } return s; };

const HANDLERS: Record<string, string> = { vide: 'Video', soun: 'Audio', hint: 'Hint', meta: 'Metadata', subt: 'Subtitle', text: 'Text', sbtl: 'Subtitle' };

function decodeLeaf(type: string, d: Uint8Array, info: Mp4Info): string | undefined {
  try {
    if (type === 'ftyp') {
      const major = ascii(d, 0, 4);
      info.majorBrand = major;
      const brands: string[] = [];
      for (let o = 8; o + 4 <= d.length; o += 4) brands.push(ascii(d, o, 4));
      info.compatibleBrands = brands;
      return `brand ${major}, compatible: ${brands.join(' ') || '—'}`;
    }
    if (type === 'mvhd') {
      const version = d[0]!;
      const ts = version === 1 ? u32(d, 20) : u32(d, 12);
      const dur = version === 1 ? u32(d, 24) * 0x100000000 + u32(d, 28) : u32(d, 16);
      info.timescale = ts;
      if (ts > 0) { info.durationSec = dur / ts; return `duration ${(dur / ts).toFixed(2)}s (timescale ${ts})`; }
    }
    if (type === 'mdhd') {
      const version = d[0]!;
      const ts = version === 1 ? u32(d, 20) : u32(d, 12);
      const dur = version === 1 ? u32(d, 24) * 0x100000000 + u32(d, 28) : u32(d, 16);
      return ts > 0 ? `media ${(dur / ts).toFixed(2)}s (timescale ${ts})` : undefined;
    }
    if (type === 'hdlr') {
      const h = ascii(d, 8, 4);
      if (!info.handlers.includes(h)) info.handlers.push(h);
      return `handler ${h}${HANDLERS[h] ? ` (${HANDLERS[h]})` : ''}`;
    }
    if (type === 'tkhd') return 'track header';
    if (type === 'stsd') return undefined; // handled as container-ish below
  } catch { /* ignore */ }
  return undefined;
}

function parseBoxes(bytes: Uint8Array, start: number, end: number, depth: number, info: Mp4Info): Mp4Box[] {
  const boxes: Mp4Box[] = [];
  let p = start;
  while (p + 8 <= end) {
    let size = u32(bytes, p);
    const type = ascii(bytes, p + 4, 4);
    let headerSize = 8;
    if (size === 1) {
      size = u32(bytes, p + 8) * 0x100000000 + u32(bytes, p + 12);
      headerSize = 16;
    } else if (size === 0) {
      size = end - p; // extends to the end of the enclosing box/file
    }
    if (size < headerSize || p + size > end) break; // malformed / truncated
    const box: Mp4Box = { type, size, offset: p, headerSize };
    if (CONTAINERS.has(type) && depth < 12) {
      // 'stsd' has 8 bytes (version/flags + entry count) before its child boxes.
      const childStart = p + headerSize + (type === 'stsd' ? 8 : 0);
      box.children = parseBoxes(bytes, childStart, p + size, depth + 1, info);
    } else {
      box.info = decodeLeaf(type, bytes.subarray(p + headerSize, p + size), info);
    }
    boxes.push(box);
    p += size;
  }
  return boxes;
}

/** Parse an ISOBMFF (MP4/MOV/M4A) file into a box tree + summary. */
export function parseMp4(bytes: Uint8Array): Mp4Info {
  if (bytes.length < 8) throw new Error('File is too small to be an MP4/ISOBMFF file.');
  // The first box is almost always ftyp; some files start with other boxes but ftyp is expected.
  const firstType = ascii(bytes, 4, 4);
  if (!/^[\x20-\x7e]{4}$/.test(firstType) || u32(bytes, 0) < 8 || u32(bytes, 0) > bytes.length) {
    // Allow size==1 (64-bit) first box; otherwise reject.
    if (u32(bytes, 0) !== 1) throw new Error('Not an ISOBMFF (MP4/MOV) file, no valid box header at the start.');
  }
  const info: Mp4Info = { compatibleBrands: [], boxes: [], handlers: [] };
  info.boxes = parseBoxes(bytes, 0, bytes.length, 0, info);
  if (info.boxes.length === 0) throw new Error('No valid boxes found, file may be truncated or not an MP4.');
  return info;
}

/** Flatten the box tree to a list with indentation depth, for display. */
export function flattenBoxes(boxes: Mp4Box[], depth = 0, out: { box: Mp4Box; depth: number }[] = []): { box: Mp4Box; depth: number }[] {
  for (const b of boxes) {
    out.push({ box: b, depth });
    if (b.children) flattenBoxes(b.children, depth + 1, out);
  }
  return out;
}
