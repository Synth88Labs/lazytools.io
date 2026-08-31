/**
 * A small, dependency-free reader for the headers of uncompressed audio
 * containers: RIFF/WAVE (.wav) and AIFF / AIFF-C (.aif/.aiff/.aifc). Reads the
 * format chunk to report sample rate, bit depth, channel count, codec and
 * duration, plus any embedded INFO/name tags. Read-only and pure, it parses
 * the header chunks, it does not decode the audio samples.
 */

export interface AudioMeta {
  container: string;        // "WAV (RIFF)" | "AIFF" | "AIFF-C"
  codec: string;            // "PCM", "IEEE float", "A-law", …
  channels: number;
  sampleRate: number;       // Hz
  bitsPerSample?: number;
  durationSec?: number;
  byteRate?: number;        // bytes/sec (WAV)
  bitrate?: number;         // bits/sec
  dataBytes?: number;
  chunks: string[];         // chunk IDs found
  tags: { label: string; value: string }[];
}

class R {
  b: Uint8Array;
  constructor(b: Uint8Array) { this.b = b; }
  tag(o: number) { return String.fromCharCode(this.b[o]!, this.b[o + 1]!, this.b[o + 2]!, this.b[o + 3]!); }
  u16le(o: number) { return this.b[o]! | (this.b[o + 1]! << 8); }
  u32le(o: number) { return (this.b[o]! | (this.b[o + 1]! << 8) | (this.b[o + 2]! << 16) | (this.b[o + 3]! * 0x1000000)) >>> 0; }
  u16be(o: number) { return (this.b[o]! << 8) | this.b[o + 1]!; }
  u32be(o: number) { return ((this.b[o]! * 0x1000000) + (this.b[o + 1]! << 16) + (this.b[o + 2]! << 8) + this.b[o + 3]!) >>> 0; }
  ascii(o: number, len: number) { let s = ''; for (let i = 0; i < len; i++) { const c = this.b[o + i]!; if (c === 0) break; s += String.fromCharCode(c); } return s; }
}

const WAV_CODECS: Record<number, string> = {
  0x0001: 'PCM', 0x0003: 'IEEE float', 0x0006: 'A-law', 0x0007: 'µ-law',
  0x0011: 'IMA ADPCM', 0x0055: 'MP3', 0xfffe: 'Extensible',
};

const INFO_TAGS: Record<string, string> = {
  INAM: 'Title', IART: 'Artist', IPRD: 'Album', ICRD: 'Date', IGNR: 'Genre',
  ICMT: 'Comment', ISFT: 'Software', ICOP: 'Copyright', IENG: 'Engineer', ITRK: 'Track',
};

/** Decode an 80-bit IEEE 754 extended-precision float (AIFF sample rate). */
function extended80(r: R, o: number): number {
  const sign = (r.b[o]! & 0x80) ? -1 : 1;
  const exp = ((r.b[o]! & 0x7f) << 8) | r.b[o + 1]!;
  let mantissa = 0;
  for (let i = 0; i < 8; i++) mantissa = mantissa * 256 + r.b[o + 2 + i]!;
  if (exp === 0 && mantissa === 0) return 0;
  return sign * mantissa * Math.pow(2, exp - 16383 - 63);
}

function parseWav(r: R, n: number): AudioMeta {
  const meta: AudioMeta = { container: 'WAV (RIFF)', codec: 'unknown', channels: 0, sampleRate: 0, chunks: [], tags: [] };
  let p = 12;
  let dataBytes = 0, blockAlign = 0;
  while (p + 8 <= n) {
    const id = r.tag(p);
    const size = r.u32le(p + 4);
    meta.chunks.push(id.trim());
    const body = p + 8;
    if (id === 'fmt ') {
      const fmt = r.u16le(body);
      meta.codec = WAV_CODECS[fmt] ?? `format 0x${fmt.toString(16)}`;
      meta.channels = r.u16le(body + 2);
      meta.sampleRate = r.u32le(body + 4);
      meta.byteRate = r.u32le(body + 8);
      blockAlign = r.u16le(body + 12);
      meta.bitsPerSample = r.u16le(body + 14);
      if (fmt === 0xfffe && size >= 26) { // WAVE_FORMAT_EXTENSIBLE: real format is in the subformat GUID
        const sub = r.u16le(body + 24);
        meta.codec = `Extensible (${WAV_CODECS[sub] ?? '0x' + sub.toString(16)})`;
      }
    } else if (id === 'data') {
      dataBytes = size;
    } else if (id === 'LIST' && r.tag(body) === 'INFO') {
      let q = body + 4;
      const end = body + size;
      while (q + 8 <= end) {
        const tid = r.tag(q); const tsize = r.u32le(q + 4);
        if (INFO_TAGS[tid]) { const v = r.ascii(q + 8, tsize).trim(); if (v) meta.tags.push({ label: INFO_TAGS[tid]!, value: v }); }
        q += 8 + tsize + (tsize & 1);
      }
    }
    p = body + size + (size & 1); // chunks are word-aligned
  }
  meta.dataBytes = dataBytes;
  if (blockAlign > 0 && meta.sampleRate > 0) meta.durationSec = dataBytes / blockAlign / meta.sampleRate;
  if (meta.byteRate) meta.bitrate = meta.byteRate * 8;
  return meta;
}

const AIFC_CODECS: Record<string, string> = {
  NONE: 'PCM (uncompressed)', sowt: 'PCM (little-endian)', fl32: 'IEEE float 32', fl64: 'IEEE float 64',
  alaw: 'A-law', ulaw: 'µ-law', ima4: 'IMA ADPCM',
};

function parseAiff(r: R, n: number, aifc: boolean): AudioMeta {
  const meta: AudioMeta = { container: aifc ? 'AIFF-C' : 'AIFF', codec: aifc ? 'unknown' : 'PCM', channels: 0, sampleRate: 0, chunks: [], tags: [] };
  let p = 12;
  let numFrames = 0;
  while (p + 8 <= n) {
    const id = r.tag(p);
    const size = r.u32be(p + 4);
    meta.chunks.push(id.trim());
    const body = p + 8;
    if (id === 'COMM') {
      meta.channels = r.u16be(body);
      numFrames = r.u32be(body + 2);
      meta.bitsPerSample = r.u16be(body + 6);
      meta.sampleRate = Math.round(extended80(r, body + 8));
      if (aifc && size >= 22) { const ct = r.tag(body + 18); meta.codec = AIFC_CODECS[ct] ?? ct; }
    } else if (id === 'NAME' || id === 'AUTH' || id === '(c) ' || id === 'ANNO') {
      const labels: Record<string, string> = { NAME: 'Name', AUTH: 'Author', '(c) ': 'Copyright', ANNO: 'Annotation' };
      const v = r.ascii(body, size).trim();
      if (v) meta.tags.push({ label: labels[id] ?? id.trim(), value: v });
    }
    p = body + size + (size & 1);
  }
  if (numFrames > 0 && meta.sampleRate > 0) meta.durationSec = numFrames / meta.sampleRate;
  if (meta.sampleRate && meta.bitsPerSample && meta.channels) meta.bitrate = meta.sampleRate * meta.bitsPerSample * meta.channels;
  return meta;
}

/** Parse a WAV or AIFF file's header into readable metadata. */
export function parseAudio(bytes: Uint8Array): AudioMeta {
  const r = new R(bytes);
  if (bytes.length < 12) throw new Error('File is too small to be a WAV or AIFF audio file.');
  const magic = r.tag(0);
  if (magic === 'RIFF' && r.tag(8) === 'WAVE') return parseWav(r, bytes.length);
  if (magic === 'FORM') {
    const form = r.tag(8);
    if (form === 'AIFF') return parseAiff(r, bytes.length, false);
    if (form === 'AIFC') return parseAiff(r, bytes.length, true);
  }
  if (magic === 'RIFF') throw new Error('This is a RIFF file but not WAVE audio (perhaps AVI or WebP).');
  throw new Error('Not a WAV or AIFF file, expected a RIFF/WAVE or FORM/AIFF signature.');
}

/** Human-readable duration mm:ss(.ms). */
export function formatDuration(sec: number): string {
  if (!Number.isFinite(sec)) return '—';
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return `${m}:${s.toFixed(3).padStart(6, '0')}`;
}
