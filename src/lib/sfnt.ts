/**
 * A small, dependency-free reader for the metadata inside a TrueType/OpenType
 * font (sfnt). Parses the table directory and pulls the human-readable fields
 * from the `name` table plus a few facts from `head`, `maxp` and `OS/2`:
 * family, subfamily, version, designer, license, glyph count, units-per-em,
 * weight/width and outline type. Read-only and pure — no glyph rendering.
 */

export interface NameRecord { nameId: number; label: string; value: string; }

export interface FontInfo {
  format: string;          // "TrueType", "OpenType/CFF", "TrueType Collection", …
  outlines: string;        // "TrueType (glyf)" | "PostScript/CFF" | "unknown"
  numTables: number;
  tables: string[];        // 4-char tags present
  unitsPerEm?: number;
  numGlyphs?: number;
  created?: string;
  modified?: string;
  weightClass?: number;
  widthClass?: number;
  embeddable?: string;     // interpretation of OS/2 fsType
  names: NameRecord[];     // selected name records, de-duplicated by nameId
  family?: string;
  subfamily?: string;
  fullName?: string;
  version?: string;
}

const NAME_IDS: Record<number, string> = {
  0: 'Copyright', 1: 'Font Family', 2: 'Font Subfamily', 3: 'Unique ID', 4: 'Full Name',
  5: 'Version', 6: 'PostScript Name', 7: 'Trademark', 8: 'Manufacturer', 9: 'Designer',
  10: 'Description', 11: 'Vendor URL', 12: 'Designer URL', 13: 'License', 14: 'License URL',
  16: 'Typographic Family', 17: 'Typographic Subfamily',
};

class Reader {
  b: Uint8Array;
  constructor(b: Uint8Array) { this.b = b; }
  u8(o: number) { return this.b[o]!; }
  u16(o: number) { return (this.b[o]! << 8) | this.b[o + 1]!; }
  i16(o: number) { const v = this.u16(o); return v >= 0x8000 ? v - 0x10000 : v; }
  u32(o: number) { return (this.b[o]! * 0x1000000) + (this.b[o + 1]! << 16) + (this.b[o + 2]! << 8) + this.b[o + 3]!; }
  tag(o: number) { return String.fromCharCode(this.b[o]!, this.b[o + 1]!, this.b[o + 2]!, this.b[o + 3]!); }
  slice(o: number, len: number) { return this.b.subarray(o, o + len); }
}

const SFNT_EPOCH_MS = Date.UTC(1904, 0, 1); // fonts count seconds from 1904-01-01

function longDateTime(r: Reader, o: number): string {
  const hi = r.u32(o), lo = r.u32(o + 4);
  const seconds = hi * 0x100000000 + lo;
  const ms = SFNT_EPOCH_MS + seconds * 1000;
  if (!Number.isFinite(ms)) return '';
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function decodeName(bytes: Uint8Array, platformId: number, encodingId: number): string {
  // Windows (3) and Unicode (0) platforms use UTF-16BE. Mac (1) roman ≈ Latin-1.
  const utf16 = platformId === 3 || platformId === 0 || (platformId === 2 && encodingId === 1);
  if (utf16) {
    let s = '';
    for (let i = 0; i + 1 < bytes.length; i += 2) s += String.fromCharCode((bytes[i]! << 8) | bytes[i + 1]!);
    return s;
  }
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]!);
  return s;
}

const FSTYPE = (v: number): string => {
  if (v === 0) return 'Installable (no embedding restriction)';
  if (v & 0x0002) return 'Restricted — no embedding allowed';
  const parts: string[] = [];
  if (v & 0x0004) parts.push('preview & print only');
  if (v & 0x0008) parts.push('editable embedding');
  if (v & 0x0100) parts.push('no subsetting');
  if (v & 0x0200) parts.push('bitmap embedding only');
  return parts.length ? parts.join(', ') : `flags 0x${v.toString(16)}`;
};

/** Read the sfnt table directory starting at `base` and return {tables, r}. */
function readDirectory(r: Reader, base: number): { tables: Map<string, { offset: number; length: number }>; count: number } {
  const numTables = r.u16(base + 4);
  const tables = new Map<string, { offset: number; length: number }>();
  let p = base + 12;
  for (let i = 0; i < numTables; i++) {
    const tag = r.tag(p);
    tables.set(tag, { offset: r.u32(p + 8), length: r.u32(p + 12) });
    p += 16;
  }
  return { tables, count: numTables };
}

/** Parse a TrueType/OpenType font's metadata. */
export function parseFont(bytes: Uint8Array): FontInfo {
  const r = new Reader(bytes);
  const sig = r.tag(0);
  if (sig === 'wOFF') throw new Error('This is a WOFF font (web font). Convert it to TTF/OTF first — WOFF tables are compressed and not read here.');
  if (sig === 'wOF2') throw new Error('This is a WOFF2 font (web font). Convert it to TTF/OTF first — WOFF2 uses Brotli compression, not read here.');

  let base = 0;
  let format: string;
  if (sig === 'ttcf') {
    base = r.u32(12); // offset of the first font in the collection
    format = 'TrueType Collection (first font)';
  } else if (sig === 'OTTO') {
    format = 'OpenType/CFF';
  } else if (sig === '\x00\x01\x00\x00' || sig === 'true' || sig === 'typ1') {
    format = 'TrueType';
  } else {
    throw new Error('Not a TrueType/OpenType font — the file does not start with a known sfnt signature.');
  }

  const { tables, count } = readDirectory(r, base);
  const info: FontInfo = {
    format,
    outlines: tables.has('CFF ') ? 'PostScript/CFF' : tables.has('glyf') ? 'TrueType (glyf)' : 'unknown',
    numTables: count,
    tables: [...tables.keys()].map((t) => t.trim()).sort(),
    names: [],
  };

  const head = tables.get('head');
  if (head) {
    info.unitsPerEm = r.u16(head.offset + 18);
    info.created = longDateTime(r, head.offset + 20);
    info.modified = longDateTime(r, head.offset + 28);
  }
  const maxp = tables.get('maxp');
  if (maxp) info.numGlyphs = r.u16(maxp.offset + 4);
  const os2 = tables.get('OS/2');
  if (os2) {
    info.weightClass = r.u16(os2.offset + 4);
    info.widthClass = r.u16(os2.offset + 6);
    info.embeddable = FSTYPE(r.u16(os2.offset + 8));
  }

  const name = tables.get('name');
  if (name) {
    const nb = name.offset;
    const recCount = r.u16(nb + 2);
    const storage = nb + r.u16(nb + 4);
    // Collect best value per nameId: prefer Windows English (3/1/0x409), else first seen.
    const best = new Map<number, { value: string; score: number }>();
    let p = nb + 6;
    for (let i = 0; i < recCount; i++) {
      const platformId = r.u16(p), encodingId = r.u16(p + 2), languageId = r.u16(p + 4);
      const nameId = r.u16(p + 6), len = r.u16(p + 8), off = r.u16(p + 10);
      p += 12;
      if (!(nameId in NAME_IDS)) continue;
      const str = decodeName(r.slice(storage + off, len), platformId, encodingId);
      if (!str) continue;
      const score = (platformId === 3 ? 4 : platformId === 0 ? 2 : 1) + (languageId === 0x409 ? 1 : 0);
      const cur = best.get(nameId);
      if (!cur || score > cur.score) best.set(nameId, { value: str, score });
    }
    for (const [nameId, { value }] of [...best.entries()].sort((a, b) => a[0] - b[0])) {
      info.names.push({ nameId, label: NAME_IDS[nameId]!, value });
    }
    const pick = (id: number) => best.get(id)?.value;
    info.family = pick(16) ?? pick(1);
    info.subfamily = pick(17) ?? pick(2);
    info.fullName = pick(4);
    info.version = pick(5);
  }

  return info;
}
