import { parsePng } from '../src/lib/png.ts';
import { crc32 } from '../src/lib/image-dpi.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

const SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const u32 = (n: number) => [(n >>> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
const A = (s: string) => [...s].map((c) => c.charCodeAt(0));

/** Build a chunk with a correct CRC over type+data. */
function chunk(type: string, data: number[]): number[] {
  const td = [...A(type), ...data];
  const crc = crc32(Uint8Array.from(td));
  return [...u32(data.length), ...td, ...u32(crc)];
}

// IHDR: 800x600, 8-bit, colorType 6 (RGBA), no interlace
const ihdr = chunk('IHDR', [...u32(800), ...u32(600), 8, 6, 0, 0, 0]);
// pHYs: 300 DPI → 11811 px/m, unit 1
const phys = chunk('pHYs', [...u32(11811), ...u32(11811), 1]);
// tEXt: Software=LazyTools
const text = chunk('tEXt', [...A('Software'), 0, ...A('LazyTools')]);
const idat = chunk('IDAT', new Array(64).fill(0));
const iend = chunk('IEND', []);
const png = Uint8Array.from([...SIG, ...ihdr, ...phys, ...text, ...idat, ...iend]);

const info = parsePng(png);
ok('signature valid', info.signatureValid);
ok('width 800', info.width === 800);
ok('height 600', info.height === 600);
ok('bit depth 8', info.bitDepth === 8);
ok('color type RGBA', info.colorType === 'Truecolor + alpha (RGBA)');
ok('interlace none', info.interlace === 'none');
ok('dpi 300', info.dpi === 300);
ok('5 chunks', info.chunks.length === 5);
ok('IHDR critical', info.chunks[0]!.type === 'IHDR' && info.chunks[0]!.critical === true);
ok('pHYs ancillary', info.chunks[1]!.type === 'pHYs' && info.chunks[1]!.critical === false);
ok('all CRCs valid', info.chunks.every((c) => c.crcOk));
ok('tEXt decoded', info.text.some((t) => t.keyword === 'Software' && t.value === 'LazyTools'));
ok('IDAT bytes counted', info.totalIdatBytes === 64);
ok('IHDR info string', info.chunks[0]!.info === '800×600, 8-bit Truecolor + alpha (RGBA)');

// ---- corrupt a CRC byte → that chunk fails, others pass ----
const corrupt = png.slice();
// flip a byte inside the pHYs CRC (pHYs is second chunk): find its CRC offset
const physOffset = 8 + ihdr.length; // start of pHYs
const physCrcOffset = physOffset + 8 + 9; // 8 header + 9 data bytes
corrupt[physCrcOffset] = corrupt[physCrcOffset]! ^ 0xff;
const ci = parsePng(corrupt);
ok('corrupt pHYs CRC fails', ci.chunks[1]!.crcOk === false);
ok('other CRCs still valid', ci.chunks.filter((_, i) => i !== 1).every((c) => c.crcOk));

// ---- iTXt (uncompressed) ----
const itxtData = [...A('Comment'), 0, 0, 0, ...A('en'), 0, 0, ...new TextEncoder().encode('Hello 世界')];
const itxt = chunk('iTXt', itxtData);
const png2 = Uint8Array.from([...SIG, ...ihdr, ...itxt, ...iend]);
ok('iTXt utf-8 decoded', parsePng(png2).text.some((t) => t.keyword === 'Comment' && t.value === 'Hello 世界'));

// ---- rejections ----
let threw = false; try { parsePng(Uint8Array.from(A('%PDF-1.7 not a png'))); } catch { threw = true; }
ok('rejects non-png', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
