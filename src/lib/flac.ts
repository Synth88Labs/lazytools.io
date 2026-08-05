/**
 * A dependency-free reader for FLAC metadata: the STREAMINFO block (sample
 * rate, channels, bit depth, duration, MD5 of the audio) and the Vorbis comment
 * block (TITLE/ARTIST/ALBUM… tags and the encoder vendor string), plus a note
 * of embedded pictures. Read-only and pure — it parses the metadata blocks, not
 * the audio frames. Completes the audio-metadata trio with the WAV and MP3
 * inspectors.
 */

export interface FlacInfo {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  totalSamples: number;
  durationSec: number;
  md5: string;
  vendor?: string;
  tags: { key: string; value: string }[];
  hasPicture: boolean;
  pictureBytes: number;
  blocks: { type: string; size: number }[];
}

const BLOCK_TYPES: Record<number, string> = {
  0: 'STREAMINFO', 1: 'PADDING', 2: 'APPLICATION', 3: 'SEEKTABLE',
  4: 'VORBIS_COMMENT', 5: 'CUESHEET', 6: 'PICTURE',
};

const u32be = (b: Uint8Array, o: number) => ((b[o]! << 24) | (b[o + 1]! << 16) | (b[o + 2]! << 8) | b[o + 3]!) >>> 0;
const u32le = (b: Uint8Array, o: number) => (b[o]! | (b[o + 1]! << 8) | (b[o + 2]! << 16) | (b[o + 3]! * 0x1000000)) >>> 0;
const u24be = (b: Uint8Array, o: number) => (b[o]! << 16) | (b[o + 1]! << 8) | b[o + 2]!;

/** Parse a FLAC file's metadata. */
export function parseFlac(bytes: Uint8Array): FlacInfo {
  if (!(bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43)) {
    throw new Error('Not a FLAC file — the "fLaC" marker is missing.');
  }
  const info: FlacInfo = {
    sampleRate: 0, channels: 0, bitsPerSample: 0, totalSamples: 0, durationSec: 0,
    md5: '', tags: [], hasPicture: false, pictureBytes: 0, blocks: [],
  };

  let p = 4;
  let last = false;
  while (!last && p + 4 <= bytes.length) {
    const header = bytes[p]!;
    last = (header & 0x80) !== 0;
    const type = header & 0x7f;
    const size = u24be(bytes, p + 1);
    const body = p + 4;
    if (body + size > bytes.length) throw new Error(`Metadata block "${BLOCK_TYPES[type] ?? type}" exceeds the file.`);
    info.blocks.push({ type: BLOCK_TYPES[type] ?? `type ${type}`, size });

    if (type === 0) { // STREAMINFO
      const d = bytes.subarray(body, body + size);
      // bytes 10..17 pack sampleRate(20) channels(3) bitsPerSample(5) totalSamples(36)
      info.sampleRate = (d[10]! << 12) | (d[11]! << 4) | (d[12]! >> 4);
      info.channels = ((d[12]! >> 1) & 0x7) + 1;
      info.bitsPerSample = (((d[12]! & 0x1) << 4) | (d[13]! >> 4)) + 1;
      info.totalSamples = (d[13]! & 0xf) * 0x100000000 + u32be(d, 14);
      info.md5 = Array.from(d.subarray(18, 34), (x) => x.toString(16).padStart(2, '0')).join('');
      info.durationSec = info.sampleRate > 0 ? info.totalSamples / info.sampleRate : 0;
    } else if (type === 4) { // VORBIS_COMMENT (little-endian lengths)
      let q = body;
      const vlen = u32le(bytes, q); q += 4;
      info.vendor = new TextDecoder('utf-8', { fatal: false }).decode(bytes.subarray(q, q + vlen)); q += vlen;
      const count = u32le(bytes, q); q += 4;
      for (let i = 0; i < count && q + 4 <= body + size; i++) {
        const clen = u32le(bytes, q); q += 4;
        const comment = new TextDecoder('utf-8', { fatal: false }).decode(bytes.subarray(q, q + clen)); q += clen;
        const eq = comment.indexOf('=');
        if (eq > 0) info.tags.push({ key: comment.slice(0, eq).toUpperCase(), value: comment.slice(eq + 1) });
      }
    } else if (type === 6) { // PICTURE
      info.hasPicture = true; info.pictureBytes += size;
    }
    p = body + size;
  }
  if (info.sampleRate === 0) throw new Error('No STREAMINFO block found — file may be truncated.');
  return info;
}
