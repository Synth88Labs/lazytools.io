/**
 * Identify a file's true type from its magic bytes (signature), independent of
 * its extension. Pure and deterministic — the signature table is a frozen set
 * of well-documented format signatures, so this is fully unit-testable and never
 * goes stale. Each signature is one or more (offset, bytes) matches that must all
 * hold. Multi-part checks (e.g. RIFF containers) use a second match at offset 8.
 */

export interface FileSignature {
  name: string;
  category: 'image' | 'document' | 'archive' | 'audio' | 'video' | 'font' | 'executable' | 'database' | 'other';
  mime: string;
  ext: string[];
  matches: { offset: number; bytes: number[] }[];
}

// Bytes as decimal; comments give the ASCII/hex mnemonic.
export const SIGNATURES: FileSignature[] = [
  { name: 'PNG image', category: 'image', mime: 'image/png', ext: ['png'], matches: [{ offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }] },
  { name: 'JPEG image', category: 'image', mime: 'image/jpeg', ext: ['jpg', 'jpeg'], matches: [{ offset: 0, bytes: [0xff, 0xd8, 0xff] }] },
  { name: 'GIF image', category: 'image', mime: 'image/gif', ext: ['gif'], matches: [{ offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }] }, // GIF8
  { name: 'BMP image', category: 'image', mime: 'image/bmp', ext: ['bmp'], matches: [{ offset: 0, bytes: [0x42, 0x4d] }] }, // BM
  { name: 'WebP image', category: 'image', mime: 'image/webp', ext: ['webp'], matches: [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }] }, // RIFF….WEBP
  { name: 'TIFF image (little-endian)', category: 'image', mime: 'image/tiff', ext: ['tif', 'tiff'], matches: [{ offset: 0, bytes: [0x49, 0x49, 0x2a, 0x00] }] },
  { name: 'TIFF image (big-endian)', category: 'image', mime: 'image/tiff', ext: ['tif', 'tiff'], matches: [{ offset: 0, bytes: [0x4d, 0x4d, 0x00, 0x2a] }] },
  { name: 'ICO icon', category: 'image', mime: 'image/x-icon', ext: ['ico'], matches: [{ offset: 0, bytes: [0x00, 0x00, 0x01, 0x00] }] },
  { name: 'PDF document', category: 'document', mime: 'application/pdf', ext: ['pdf'], matches: [{ offset: 0, bytes: [0x25, 0x50, 0x44, 0x46, 0x2d] }] }, // %PDF-
  { name: 'RTF document', category: 'document', mime: 'application/rtf', ext: ['rtf'], matches: [{ offset: 0, bytes: [0x7b, 0x5c, 0x72, 0x74, 0x66] }] }, // {\rtf
  { name: 'ZIP archive (or .docx/.xlsx/.pptx/.jar/.epub)', category: 'archive', mime: 'application/zip', ext: ['zip', 'docx', 'xlsx', 'pptx', 'jar', 'epub', 'apk'], matches: [{ offset: 0, bytes: [0x50, 0x4b, 0x03, 0x04] }] }, // PK\x03\x04
  { name: 'GZIP archive', category: 'archive', mime: 'application/gzip', ext: ['gz'], matches: [{ offset: 0, bytes: [0x1f, 0x8b] }] },
  { name: '7-Zip archive', category: 'archive', mime: 'application/x-7z-compressed', ext: ['7z'], matches: [{ offset: 0, bytes: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c] }] },
  { name: 'RAR archive', category: 'archive', mime: 'application/vnd.rar', ext: ['rar'], matches: [{ offset: 0, bytes: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07] }] }, // Rar!
  { name: 'XZ archive', category: 'archive', mime: 'application/x-xz', ext: ['xz'], matches: [{ offset: 0, bytes: [0xfd, 0x37, 0x7a, 0x58, 0x5a, 0x00] }] },
  { name: 'TAR archive', category: 'archive', mime: 'application/x-tar', ext: ['tar'], matches: [{ offset: 257, bytes: [0x75, 0x73, 0x74, 0x61, 0x72] }] }, // "ustar" at 257
  { name: 'MP3 audio (ID3)', category: 'audio', mime: 'audio/mpeg', ext: ['mp3'], matches: [{ offset: 0, bytes: [0x49, 0x44, 0x33] }] }, // ID3
  { name: 'WAV audio', category: 'audio', mime: 'audio/wav', ext: ['wav'], matches: [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, { offset: 8, bytes: [0x57, 0x41, 0x56, 0x45] }] }, // RIFF….WAVE
  { name: 'FLAC audio', category: 'audio', mime: 'audio/flac', ext: ['flac'], matches: [{ offset: 0, bytes: [0x66, 0x4c, 0x61, 0x43] }] }, // fLaC
  { name: 'OGG audio/video', category: 'audio', mime: 'application/ogg', ext: ['ogg', 'oga', 'ogv'], matches: [{ offset: 0, bytes: [0x4f, 0x67, 0x67, 0x53] }] }, // OggS
  { name: 'MP4 / MOV video', category: 'video', mime: 'video/mp4', ext: ['mp4', 'm4a', 'm4v', 'mov'], matches: [{ offset: 4, bytes: [0x66, 0x74, 0x79, 0x70] }] }, // ftyp at offset 4
  { name: 'AVI video', category: 'video', mime: 'video/x-msvideo', ext: ['avi'], matches: [{ offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] }, { offset: 8, bytes: [0x41, 0x56, 0x49, 0x20] }] }, // RIFF….AVI
  { name: 'Matroska / WebM video', category: 'video', mime: 'video/webm', ext: ['mkv', 'webm'], matches: [{ offset: 0, bytes: [0x1a, 0x45, 0xdf, 0xa3] }] },
  { name: 'WOFF font', category: 'font', mime: 'font/woff', ext: ['woff'], matches: [{ offset: 0, bytes: [0x77, 0x4f, 0x46, 0x46] }] }, // wOFF
  { name: 'WOFF2 font', category: 'font', mime: 'font/woff2', ext: ['woff2'], matches: [{ offset: 0, bytes: [0x77, 0x4f, 0x46, 0x32] }] }, // wOF2
  { name: 'TrueType font', category: 'font', mime: 'font/ttf', ext: ['ttf'], matches: [{ offset: 0, bytes: [0x00, 0x01, 0x00, 0x00] }] },
  { name: 'OpenType font', category: 'font', mime: 'font/otf', ext: ['otf'], matches: [{ offset: 0, bytes: [0x4f, 0x54, 0x54, 0x4f] }] }, // OTTO
  { name: 'Windows executable (PE)', category: 'executable', mime: 'application/vnd.microsoft.portable-executable', ext: ['exe', 'dll'], matches: [{ offset: 0, bytes: [0x4d, 0x5a] }] }, // MZ
  { name: 'ELF executable (Linux)', category: 'executable', mime: 'application/x-elf', ext: ['elf', 'so'], matches: [{ offset: 0, bytes: [0x7f, 0x45, 0x4c, 0x46] }] }, // \x7fELF
  { name: 'Java class file', category: 'executable', mime: 'application/java-vm', ext: ['class'], matches: [{ offset: 0, bytes: [0xca, 0xfe, 0xba, 0xbe] }] },
  { name: 'SQLite database', category: 'database', mime: 'application/vnd.sqlite3', ext: ['sqlite', 'db'], matches: [{ offset: 0, bytes: [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74, 0x20, 0x33, 0x00] }] }, // "SQLite format 3\0"
];

function matchAt(data: Uint8Array, offset: number, bytes: number[]): boolean {
  if (offset + bytes.length > data.length) return false;
  for (let i = 0; i < bytes.length; i++) if (data[offset + i] !== bytes[i]) return false;
  return true;
}

/** Return the matching signatures for the given bytes (most specific first, by longest total match). */
export function identifyBytes(data: Uint8Array): FileSignature[] {
  const hits = SIGNATURES.filter((sig) => sig.matches.every((m) => matchAt(data, m.offset, m.bytes)));
  // Prefer signatures with more/longer matched bytes.
  return hits.sort((a, b) => totalBytes(b) - totalBytes(a));
}
function totalBytes(sig: FileSignature): number {
  return sig.matches.reduce((n, m) => n + m.bytes.length, 0);
}

/** Format the first `n` bytes as an uppercase hex string, space-separated. */
export function toHex(data: Uint8Array, n = 16): string {
  return Array.from(data.slice(0, n)).map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

/** Parse a hex string (with optional spaces / 0x) into bytes. */
export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '');
  if (clean.length % 2 !== 0) throw new Error('Hex has an odd number of digits.');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

export interface IdentifyResult {
  detected: FileSignature | null;
  all: FileSignature[];
  extensionMatches: boolean | null; // null when no extension supplied
  claimedExt: string | null;
}
/** Identify bytes and, if given a filename, check whether the extension matches the true type. */
export function identifyFile(data: Uint8Array, filename?: string): IdentifyResult {
  const all = identifyBytes(data);
  const detected = all[0] ?? null;
  let extensionMatches: boolean | null = null;
  let claimedExt: string | null = null;
  if (filename && filename.includes('.')) {
    claimedExt = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    extensionMatches = detected ? detected.ext.includes(claimedExt) : false;
  }
  return { detected, all, extensionMatches, claimedExt };
}
