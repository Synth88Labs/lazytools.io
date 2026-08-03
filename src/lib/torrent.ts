/**
 * A dependency-free bencode decoder and .torrent metadata inspector. Reads the
 * announce URLs, name, file tree, piece length and piece count, and computes
 * the info-hash — the SHA-1 of the exact bencoded bytes of the "info"
 * dictionary, which is what identifies a torrent. Decoding is pure; the
 * info-hash uses the Web Crypto SubtleCrypto digest (available in browsers and
 * Node). Read-only.
 */

export type BValue = bigint | Uint8Array | BValue[] | Map<string, BValue>;

const utf8 = (b: Uint8Array) => new TextDecoder('utf-8', { fatal: false }).decode(b);

/** Decode one bencoded value at offset p. Returns the value and the end offset. */
function bdecode(b: Uint8Array, p: number): { val: BValue; end: number } {
  const c = b[p];
  if (c === undefined) throw new Error('Unexpected end of bencoded data');
  if (c === 0x69) { // 'i' integer
    const e = b.indexOf(0x65, p + 1);
    if (e === -1) throw new Error('Unterminated integer');
    const s = utf8(b.subarray(p + 1, e));
    if (!/^-?\d+$/.test(s)) throw new Error(`Invalid integer "${s}"`);
    return { val: BigInt(s), end: e + 1 };
  }
  if (c === 0x6c) { // 'l' list
    const items: BValue[] = [];
    let q = p + 1;
    while (b[q] !== 0x65) { if (q >= b.length) throw new Error('Unterminated list'); const r = bdecode(b, q); items.push(r.val); q = r.end; }
    return { val: items, end: q + 1 };
  }
  if (c === 0x64) { // 'd' dict
    const map = new Map<string, BValue>();
    let q = p + 1;
    while (b[q] !== 0x65) {
      if (q >= b.length) throw new Error('Unterminated dictionary');
      const k = bdecode(b, q);
      if (!(k.val instanceof Uint8Array)) throw new Error('Dictionary key must be a byte string');
      const v = bdecode(b, k.end);
      map.set(utf8(k.val), v.val);
      q = v.end;
    }
    return { val: map, end: q + 1 };
  }
  if (c >= 0x30 && c <= 0x39) { // digit → byte string
    const colon = b.indexOf(0x3a, p);
    if (colon === -1) throw new Error('Malformed byte string (no colon)');
    const len = parseInt(utf8(b.subarray(p, colon)), 10);
    const start = colon + 1;
    if (start + len > b.length) throw new Error('Byte string length exceeds data');
    return { val: b.subarray(start, start + len), end: start + len };
  }
  throw new Error(`Unexpected byte 0x${c.toString(16)} at offset ${p}`);
}

export function decodeBencode(bytes: Uint8Array): BValue {
  const { val, end } = bdecode(bytes, 0);
  if (end !== bytes.length) { /* trailing bytes tolerated */ }
  return val;
}

async function sha1Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-1', bytes.slice().buffer);
  return Array.from(new Uint8Array(digest), (x) => x.toString(16).padStart(2, '0')).join('');
}

export interface TorrentFile { path: string; length: number; }
export interface TorrentInfo {
  name: string;
  infoHash: string;             // hex SHA-1 of the info dict
  announce?: string;
  announceList: string[];
  comment?: string;
  createdBy?: string;
  creationDate?: string;        // ISO
  encoding?: string;
  pieceLength: number;
  pieceCount: number;
  totalSize: number;
  files: TorrentFile[];         // one entry for single-file torrents too
  isPrivate: boolean;
  single: boolean;
}

const num = (v: BValue | undefined) => (typeof v === 'bigint' ? Number(v) : undefined);
const str = (v: BValue | undefined) => (v instanceof Uint8Array ? utf8(v) : undefined);

/** Parse a .torrent file's bytes into readable metadata (async: computes SHA-1). */
export async function parseTorrent(bytes: Uint8Array): Promise<TorrentInfo> {
  if (bytes[0] !== 0x64) throw new Error('Not a .torrent file — it should be a bencoded dictionary starting with "d".');
  // Manually walk the top dict so we can capture the exact byte range of "info".
  let p = 1, infoStart = -1, infoEnd = -1;
  const top = new Map<string, BValue>();
  while (bytes[p] !== 0x65 && p < bytes.length) {
    const k = bdecode(bytes, p);
    if (!(k.val instanceof Uint8Array)) throw new Error('Bad top-level key');
    const key = utf8(k.val);
    const vStart = k.end;
    const v = bdecode(bytes, vStart);
    if (key === 'info') { infoStart = vStart; infoEnd = v.end; }
    top.set(key, v.val);
    p = v.end;
  }
  const info = top.get('info');
  if (!(info instanceof Map)) throw new Error('Torrent has no info dictionary.');
  if (infoStart < 0) throw new Error('Could not locate the info dictionary bytes.');

  const infoHash = await sha1Hex(bytes.subarray(infoStart, infoEnd));
  const name = str(info.get('name')) ?? '(unnamed)';
  const pieceLength = num(info.get('piece length')) ?? 0;
  const pieces = info.get('pieces');
  const pieceCount = pieces instanceof Uint8Array ? Math.floor(pieces.length / 20) : 0;
  const isPrivate = num(info.get('private')) === 1;

  const files: TorrentFile[] = [];
  let single = true;
  const fileList = info.get('files');
  if (Array.isArray(fileList)) {
    single = false;
    for (const f of fileList) {
      if (!(f instanceof Map)) continue;
      const length = num(f.get('length')) ?? 0;
      const pathParts = f.get('path');
      const path = Array.isArray(pathParts) ? pathParts.map((x) => (x instanceof Uint8Array ? utf8(x) : '')).join('/') : '';
      files.push({ path: path || '(unknown)', length });
    }
  } else {
    files.push({ path: name, length: num(info.get('length')) ?? 0 });
  }
  const totalSize = files.reduce((a, f) => a + f.length, 0);

  const announceList: string[] = [];
  const al = top.get('announce-list');
  if (Array.isArray(al)) for (const tier of al) if (Array.isArray(tier)) for (const u of tier) { const s = str(u); if (s) announceList.push(s); }

  const cd = num(top.get('creation date'));

  return {
    name, infoHash,
    announce: str(top.get('announce')),
    announceList,
    comment: str(top.get('comment')),
    createdBy: str(top.get('created by')),
    creationDate: cd ? new Date(cd * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z') : undefined,
    encoding: str(top.get('encoding')),
    pieceLength, pieceCount, totalSize, files, isPrivate, single,
  };
}
