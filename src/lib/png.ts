/**
 * A dependency-free PNG chunk inspector. Walks the chunk structure, decodes the
 * common chunks (IHDR, pHYs, tEXt/iTXt, gAMA, sRGB, tIME, PLTE, …) and verifies
 * each chunk's stored CRC-32 against a freshly computed one (reusing the CRC-32
 * engine from the image-DPI module) so corruption is caught. Read-only and
 * pure. Text in compressed zTXt/iTXt chunks is flagged but not inflated.
 */
import { crc32 } from './image-dpi.ts';

const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const COLOR_TYPES: Record<number, string> = {
  0: 'Grayscale', 2: 'Truecolor (RGB)', 3: 'Indexed (palette)', 4: 'Grayscale + alpha', 6: 'Truecolor + alpha (RGBA)',
};

export interface PngChunk {
  type: string;
  length: number;
  offset: number;
  crcStored: string;
  crcOk: boolean;
  critical: boolean;   // uppercase first letter = critical
  info?: string;       // decoded summary
}

export interface PngInfo {
  signatureValid: boolean;
  width?: number;
  height?: number;
  bitDepth?: number;
  colorType?: string;
  interlace?: string;
  dpi?: number;
  chunks: PngChunk[];
  text: { keyword: string; value: string }[];
  totalIdatBytes: number;
}

const u32 = (b: Uint8Array, o: number) => ((b[o]! * 0x1000000) + (b[o + 1]! << 16) + (b[o + 2]! << 8) + b[o + 3]!) >>> 0;
const hex8 = (n: number) => (n >>> 0).toString(16).toUpperCase().padStart(8, '0');
const latin1 = (b: Uint8Array) => { let s = ''; for (const c of b) s += String.fromCharCode(c); return s; };

export function parsePng(bytes: Uint8Array): PngInfo {
  const signatureValid = PNG_SIG.every((v, i) => bytes[i] === v);
  if (!signatureValid) throw new Error('Not a PNG file — the 8-byte PNG signature is missing.');

  const info: PngInfo = { signatureValid: true, chunks: [], text: [], totalIdatBytes: 0 };
  let p = 8;
  while (p + 8 <= bytes.length) {
    const length = u32(bytes, p);
    const type = latin1(bytes.subarray(p + 4, p + 8));
    const dataStart = p + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > bytes.length) throw new Error(`Chunk "${type}" claims ${length} bytes but the file is too short.`);
    const data = bytes.subarray(dataStart, dataEnd);
    const crcStored = u32(bytes, dataEnd);
    const crcComputed = crc32(bytes.subarray(p + 4, dataEnd)); // CRC covers type + data
    const chunk: PngChunk = {
      type, length, offset: p,
      crcStored: hex8(crcStored),
      crcOk: crcStored === crcComputed,
      critical: type[0] === type[0]!.toUpperCase(),
    };

    switch (type) {
      case 'IHDR': {
        info.width = u32(data, 0); info.height = u32(data, 4);
        info.bitDepth = data[8];
        info.colorType = COLOR_TYPES[data[9]!] ?? `type ${data[9]}`;
        info.interlace = data[12] === 1 ? 'Adam7' : 'none';
        chunk.info = `${info.width}×${info.height}, ${info.bitDepth}-bit ${info.colorType}`;
        break;
      }
      case 'pHYs': {
        const ppuX = u32(data, 0), unit = data[8];
        if (unit === 1) info.dpi = Math.round(ppuX / 39.3701);
        chunk.info = unit === 1 ? `${ppuX} px/m (${info.dpi} DPI)` : `${ppuX} px/unit (aspect only)`;
        break;
      }
      case 'tEXt': {
        const nul = data.indexOf(0);
        if (nul >= 0) { const keyword = latin1(data.subarray(0, nul)); const value = latin1(data.subarray(nul + 1)); info.text.push({ keyword, value }); chunk.info = `${keyword}: ${value.slice(0, 40)}${value.length > 40 ? '…' : ''}`; }
        break;
      }
      case 'iTXt': {
        const nul = data.indexOf(0);
        const keyword = nul >= 0 ? latin1(data.subarray(0, nul)) : '';
        const compressed = data[nul + 1] === 1;
        if (!compressed) {
          // keyword\0 compFlag compMethod langTag\0 transKeyword\0 text
          let q = nul + 3;
          q = data.indexOf(0, q) + 1; // skip language tag
          q = data.indexOf(0, q) + 1; // skip translated keyword
          const value = new TextDecoder('utf-8', { fatal: false }).decode(data.subarray(q));
          info.text.push({ keyword, value });
          chunk.info = `${keyword}: ${value.slice(0, 40)}${value.length > 40 ? '…' : ''}`;
        } else chunk.info = `${keyword} (compressed)`;
        break;
      }
      case 'zTXt': {
        const nul = data.indexOf(0);
        chunk.info = `${nul >= 0 ? latin1(data.subarray(0, nul)) : ''} (compressed)`;
        break;
      }
      case 'gAMA': chunk.info = `gamma ${(u32(data, 0) / 100000).toFixed(5)}`; break;
      case 'sRGB': chunk.info = `rendering intent ${data[0]}`; break;
      case 'PLTE': chunk.info = `${length / 3} palette entries`; break;
      case 'tRNS': chunk.info = `${length} transparency byte(s)`; break;
      case 'bKGD': chunk.info = 'background color'; break;
      case 'tIME': chunk.info = `${(data[0]! << 8) | data[1]!}-${String(data[2]).padStart(2, '0')}-${String(data[3]).padStart(2, '0')} ${String(data[4]).padStart(2, '0')}:${String(data[5]).padStart(2, '0')}:${String(data[6]).padStart(2, '0')}`; break;
      case 'IDAT': info.totalIdatBytes += length; break;
      case 'IEND': chunk.info = 'end of image'; break;
    }

    info.chunks.push(chunk);
    p = dataEnd + 4;
    if (type === 'IEND') break;
  }
  return info;
}
