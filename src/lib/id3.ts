/**
 * A small, dependency-free reader for MP3 metadata: ID3v2 (2.2/2.3/2.4) and
 * ID3v1 tags, plus the first MPEG audio frame header (version, layer, bitrate,
 * sample rate, channel mode) and Xing/Info VBR detection for an accurate
 * duration. Read-only and pure, it parses headers, not audio samples.
 */

export interface Mp3Info {
  id3Version?: string;             // "ID3v2.3.0", "ID3v1", …
  tags: { label: string; value: string }[];
  hasCover: boolean;
  coverBytes?: number;
  mpegVersion?: string;            // "MPEG-1", "MPEG-2", "MPEG-2.5"
  layer?: string;                  // "Layer III"
  bitrate?: number;                // kbps (or nominal for VBR)
  vbr?: boolean;
  sampleRate?: number;             // Hz
  channelMode?: string;
  durationSec?: number;
}

const synchsafe = (b: Uint8Array, o: number) => (b[o]! << 21) | (b[o + 1]! << 14) | (b[o + 2]! << 7) | b[o + 3]!;
const u32be = (b: Uint8Array, o: number) => ((b[o]! * 0x1000000) + (b[o + 1]! << 16) + (b[o + 2]! << 8) + b[o + 3]!) >>> 0;

function decodeText(bytes: Uint8Array): string {
  if (bytes.length === 0) return '';
  const enc = bytes[0]!;
  const body = bytes.subarray(1);
  let out: string;
  if (enc === 0) out = latin1(body);
  else if (enc === 1) out = utf16WithBom(body);
  else if (enc === 2) out = utf16be(body);
  else out = new TextDecoder('utf-8', { fatal: false }).decode(body);
  return out.replace(/\0+$/g, '').replace(/\0/g, ' / ').trim();
}

const latin1 = (b: Uint8Array) => { let s = ''; for (const c of b) s += String.fromCharCode(c); return s; };
const utf16be = (b: Uint8Array) => { let s = ''; for (let i = 0; i + 1 < b.length; i += 2) s += String.fromCharCode((b[i]! << 8) | b[i + 1]!); return s; };
function utf16WithBom(b: Uint8Array): string {
  if (b.length < 2) return '';
  const be = b[0] === 0xfe && b[1] === 0xff;
  let s = '';
  for (let i = 2; i + 1 < b.length; i += 2) s += String.fromCharCode(be ? (b[i]! << 8) | b[i + 1]! : (b[i + 1]! << 8) | b[i]!);
  return s;
}

// Frame ID → readable label (v2.3/2.4 four-char, and v2.2 three-char).
const FRAMES: Record<string, string> = {
  TIT2: 'Title', TPE1: 'Artist', TALB: 'Album', TPE2: 'Album Artist', TCON: 'Genre',
  TRCK: 'Track', TPOS: 'Disc', TYER: 'Year', TDRC: 'Recording Time', TDAT: 'Date',
  TCOM: 'Composer', TPUB: 'Publisher', TBPM: 'BPM', TENC: 'Encoded By', TSSE: 'Software',
  TCOP: 'Copyright', TLAN: 'Language', COMM: 'Comment',
  TT2: 'Title', TP1: 'Artist', TAL: 'Album', TP2: 'Album Artist', TCO: 'Genre',
  TRK: 'Track', TYE: 'Year', TCM: 'Composer',
};

const ID3V1_GENRES = ['Blues', 'Classic Rock', 'Country', 'Dance', 'Disco', 'Funk', 'Grunge', 'Hip-Hop', 'Jazz', 'Metal', 'New Age', 'Oldies', 'Other', 'Pop', 'R&B', 'Rap', 'Reggae', 'Rock', 'Techno', 'Industrial', 'Alternative', 'Ska', 'Death Metal', 'Pranks', 'Soundtrack', 'Euro-Techno', 'Ambient', 'Trip-Hop', 'Vocal', 'Jazz+Funk', 'Fusion', 'Trance', 'Classical', 'Instrumental', 'Acid', 'House', 'Game', 'Sound Clip', 'Gospel', 'Noise', 'AlternRock', 'Bass', 'Soul', 'Punk', 'Space', 'Meditative', 'Instrumental Pop', 'Instrumental Rock', 'Ethnic', 'Gothic', 'Darkwave', 'Techno-Industrial', 'Electronic', 'Pop-Folk', 'Eurodance', 'Dream', 'Southern Rock', 'Comedy', 'Cult', 'Gangsta', 'Top 40', 'Christian Rap', 'Pop/Funk', 'Jungle', 'Native American', 'Cabaret', 'New Wave', 'Psychadelic', 'Rave', 'Showtunes', 'Trailer', 'Lo-Fi', 'Tribal', 'Acid Punk', 'Acid Jazz', 'Polka', 'Retro', 'Musical', 'Rock & Roll', 'Hard Rock'];

function resolveGenre(v: string): string {
  const m = v.match(/^\((\d+)\)$/) || v.match(/^(\d+)$/);
  if (m) { const g = ID3V1_GENRES[parseInt(m[1]!, 10)]; if (g) return g; }
  return v;
}

function parseId3v2(bytes: Uint8Array, info: Mp3Info): number {
  const major = bytes[3]!, revision = bytes[4]!, flags = bytes[5]!;
  info.id3Version = `ID3v2.${major}.${revision}`;
  const tagSize = synchsafe(bytes, 6);
  let p = 10;
  const end = 10 + tagSize;
  if (flags & 0x40) p += u32be(bytes, p); // skip extended header (v2.3 size is plain)
  const v22 = major === 2;
  const idLen = v22 ? 3 : 4;
  const seen = new Set<string>();
  while (p + idLen < end) {
    const id = latin1(bytes.subarray(p, p + idLen));
    if (id.charCodeAt(0) === 0) break; // padding
    let size: number, headerLen: number;
    if (v22) { size = (bytes[p + 3]! << 16) | (bytes[p + 4]! << 8) | bytes[p + 5]!; headerLen = 6; }
    else { size = major === 4 ? synchsafe(bytes, p + 4) : u32be(bytes, p + 4); headerLen = 10; }
    if (size <= 0 || p + headerLen + size > end) break;
    const body = bytes.subarray(p + headerLen, p + headerLen + size);
    if (id === 'APIC' || id === 'PIC') { info.hasCover = true; info.coverBytes = size; }
    else if ((id[0] === 'T' || id === 'COMM' || id === 'COM') && FRAMES[id] && !seen.has(id)) {
      let value: string;
      if (id === 'COMM' || id === 'COM') {
        // encoding(1) + lang(3) + short desc (null-terminated) + text
        const enc = body[0]!; let q = 4;
        const term = enc === 1 || enc === 2 ? 2 : 1;
        while (q < body.length && !(body[q] === 0 && (term === 1 || body[q + 1] === 0))) q += term;
        q += term;
        value = decodeText(Uint8Array.from([enc, ...body.subarray(q)]));
      } else {
        value = decodeText(body);
      }
      if (value) {
        if (id === 'TCON' || id === 'TCO') value = resolveGenre(value);
        info.tags.push({ label: FRAMES[id]!, value });
        seen.add(id);
      }
    }
    p += headerLen + size;
  }
  return end;
}

function parseId3v1(bytes: Uint8Array, info: Mp3Info) {
  const o = bytes.length - 128;
  if (o < 0 || latin1(bytes.subarray(o, o + 3)) !== 'TAG') return;
  const str = (s: number, len: number) => latin1(bytes.subarray(o + s, o + s + len)).replace(/\0+$/g, '').trim();
  const add = (label: string, value: string) => { if (value && !info.tags.some((t) => t.label === label)) info.tags.push({ label, value }); };
  add('Title', str(3, 30));
  add('Artist', str(33, 30));
  add('Album', str(63, 30));
  add('Year', str(93, 4));
  add('Comment', str(97, 30));
  const g = bytes[o + 127]!;
  if (ID3V1_GENRES[g]) add('Genre', ID3V1_GENRES[g]!);
  if (!info.id3Version) info.id3Version = 'ID3v1';
}

const BITRATES: Record<string, number[]> = {
  // MPEG1 Layer III, MPEG2/2.5 Layer III
  '1-3': [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0],
  '2-3': [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0],
};
const SAMPLERATES: Record<string, number[]> = {
  '1': [44100, 48000, 32000, 0], '2': [22050, 24000, 16000, 0], '2.5': [11025, 12000, 8000, 0],
};

function parseMpegFrame(bytes: Uint8Array, start: number, info: Mp3Info) {
  // Find frame sync 0xFFE within a reasonable window.
  let p = start;
  const limit = Math.min(bytes.length - 4, start + 200000);
  while (p < limit) {
    if (bytes[p] === 0xff && (bytes[p + 1]! & 0xe0) === 0xe0) break;
    p++;
  }
  if (p >= limit) return;
  const b1 = bytes[p + 1]!, b2 = bytes[p + 2]!, b3 = bytes[p + 3]!;
  const verBits = (b1 >> 3) & 0x3, layerBits = (b1 >> 1) & 0x3;
  const version = verBits === 3 ? '1' : verBits === 2 ? '2' : verBits === 0 ? '2.5' : '';
  const layer = layerBits === 1 ? 'III' : layerBits === 2 ? 'II' : layerBits === 3 ? 'I' : '';
  if (!version || layer !== 'III') { // only Layer III fully supported for tables here
    if (version) { info.mpegVersion = `MPEG-${version}`; if (layer) info.layer = `Layer ${layer}`; }
    return;
  }
  const brIndex = (b2 >> 4) & 0xf, srIndex = (b2 >> 2) & 0x3;
  const brKey = version === '1' ? '1-3' : '2-3';
  const bitrate = BITRATES[brKey]![brIndex] ?? 0;
  const sampleRate = SAMPLERATES[version]![srIndex] ?? 0;
  const modeBits = (b3 >> 6) & 0x3;
  const channelMode = ['Stereo', 'Joint Stereo', 'Dual Channel', 'Mono'][modeBits]!;
  info.mpegVersion = `MPEG-${version}`;
  info.layer = 'Layer III';
  info.sampleRate = sampleRate;
  info.channelMode = channelMode;

  // Xing/Info (VBR) header sits after the side info of this first frame.
  const mono = modeBits === 3;
  const sideInfo = version === '1' ? (mono ? 17 : 32) : (mono ? 9 : 17);
  const xingOff = p + 4 + sideInfo;
  const tag = xingOff + 4 <= bytes.length ? latin1(bytes.subarray(xingOff, xingOff + 4)) : '';
  const samplesPerFrame = version === '1' ? 1152 : 576;
  if (tag === 'Xing' || tag === 'Info') {
    info.vbr = tag === 'Xing';
    const flagsX = u32be(bytes, xingOff + 4);
    if (flagsX & 0x1) {
      const frameCount = u32be(bytes, xingOff + 8);
      if (sampleRate > 0) info.durationSec = (frameCount * samplesPerFrame) / sampleRate;
    }
    info.bitrate = bitrate || undefined;
  } else {
    info.vbr = false;
    info.bitrate = bitrate;
    if (bitrate > 0) {
      const audioBytes = bytes.length - start;
      info.durationSec = audioBytes / (bitrate * 1000 / 8);
    }
  }
}

/** Parse an MP3 file's ID3 tags and MPEG audio header. */
export function parseMp3(bytes: Uint8Array): Mp3Info {
  const info: Mp3Info = { tags: [], hasCover: false };
  let audioStart = 0;
  if (bytes.length >= 10 && latin1(bytes.subarray(0, 3)) === 'ID3') {
    audioStart = parseId3v2(bytes, info);
  }
  parseId3v1(bytes, info);
  if (bytes.length < 4 || (audioStart === 0 && !(bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0) && info.tags.length === 0)) {
    if (info.tags.length === 0) throw new Error('No ID3 tags or MPEG audio frame found, this may not be an MP3 file.');
  }
  parseMpegFrame(bytes, audioStart, info);
  return info;
}
