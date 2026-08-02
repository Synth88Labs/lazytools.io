import { setImageDpi, getImageDpi, getPngDpi, getJpegDpi, setPngDpi, setJpegDpi, crc32 } from '../src/lib/image-dpi.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol = 1) => Math.abs(a - b) <= tol;

// ---- build a minimal valid-enough PNG (sig + IHDR + IDAT + IEND) ----
function u32(n: number) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]; }
function chunk(type: string, data: number[]) {
  const t = [...type].map((c) => c.charCodeAt(0));
  return [...u32(data.length), ...t, ...data, ...u32(crc32(new Uint8Array([...t, ...data])))];
}
const png = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ...chunk('IHDR', [0, 0, 0, 2, 0, 0, 0, 2, 8, 2, 0, 0, 0]), // 2x2, 8-bit RGB
  ...chunk('IDAT', [0x78, 0x9c, 0x63, 0x00]),
  ...chunk('IEND', []),
]);

// ---- CRC32 known vector ----
ok('crc32("IEND") known', crc32(new Uint8Array([0x49, 0x45, 0x4e, 0x44])) === 0xae426082);

// ---- PNG DPI ----
ok('fresh PNG has no DPI', getPngDpi(png) === null);
const png300 = setPngDpi(png, 300);
ok('PNG set 300 → reads ~300', near(getPngDpi(png300)!, 300));
ok('PNG DPI is idempotent (re-set 72)', getPngDpi(setPngDpi(png300, 72))! === 72 || near(getPngDpi(setPngDpi(png300, 72))!, 72));
// setting again should not add a second pHYs (size stays same as first set)
ok('PNG re-set doesn\'t grow file', setPngDpi(png300, 150).length === png300.length);
// pHYs is inserted right after IHDR: bytes at offset 8+25 should be the pHYs length (0,0,0,9)
ok('pHYs placed after IHDR', png300[8 + 25] === 0 && png300[8 + 25 + 3] === 9 && String.fromCharCode(png300[8 + 25 + 4], png300[8 + 25 + 5], png300[8 + 25 + 6], png300[8 + 25 + 7]) === 'pHYs');
// verify ppm encoding: 300 dpi → 11811 ppm (300*39.3700787)
const d = 8 + 25 + 8;
const ppm = (png300[d] * 2 ** 24) + (png300[d + 1] << 16) + (png300[d + 2] << 8) + png300[d + 3];
ok('PNG ppm = 11811 for 300 dpi', ppm === 11811);
ok('PNG pHYs unit = metre (1)', png300[d + 8] === 1);
// pHYs CRC valid
const physType = png300.slice(8 + 25 + 4, 8 + 25 + 8 + 9); // "pHYs" + 9 data bytes
const physCrc = (png300[8 + 25 + 8 + 9] << 24) + (png300[8 + 25 + 8 + 10] << 16) + (png300[8 + 25 + 8 + 11] << 8) + png300[8 + 25 + 8 + 12];
ok('PNG pHYs CRC valid', (crc32(physType) >>> 0) === (physCrc >>> 0));

// ---- JPEG DPI ----
const jpegBare = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]); // SOI + EOI, no JFIF
ok('bare JPEG has no DPI', getJpegDpi(jpegBare) === null);
const jpeg300 = setJpegDpi(jpegBare, 300);
ok('JPEG inserted APP0 → reads 300', getJpegDpi(jpeg300) === 300);
ok('JPEG grew by 18 bytes (APP0 segment)', jpeg300.length === jpegBare.length + 18);
// editing an existing JFIF in place (don't grow)
const jpeg72 = setJpegDpi(jpeg300, 72);
ok('JPEG re-set edits in place (no growth)', jpeg72.length === jpeg300.length && getJpegDpi(jpeg72) === 72);
ok('JPEG units byte = 1 (dpi)', jpeg300[11] === 1);

// ---- dispatcher ----
ok('getImageDpi png format', getImageDpi(png300)!.format === 'png');
ok('setImageDpi jpeg', setImageDpi(jpegBare, 150).format === 'jpeg' && getJpegDpi(setImageDpi(jpegBare, 150).bytes) === 150);
let threw = false; try { setImageDpi(new Uint8Array([1, 2, 3, 4]), 300); } catch { threw = true; }
ok('rejects non-image', threw);
let threw2 = false; try { setImageDpi(png, 0); } catch { threw2 = true; }
ok('rejects dpi<=0', threw2);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
