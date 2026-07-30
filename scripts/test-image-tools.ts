import { clampCrop, fitAspectBox, searchQualityForSize, buildIco } from '../src/lib/image-tools.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }
const approx = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// ---- clampCrop ----
const c1 = clampCrop({ x: -10, y: -5, w: 500, h: 500 }, 400, 300);
ok('clamp keeps box inside width', c1.x + c1.w <= 400);
ok('clamp keeps box inside height', c1.y + c1.h <= 300);
ok('clamp w capped to image', c1.w === 400);
ok('clamp h capped to image', c1.h === 300);
const c2 = clampCrop({ x: 350, y: 250, w: 100, h: 100 }, 400, 300);
ok('clamp shifts x so box fits', c2.x === 300 && c2.w === 100);
ok('clamp shifts y so box fits', c2.y === 200 && c2.h === 100);

// ---- fitAspectBox ----
const f1 = fitAspectBox(400, 300, 1); // square in landscape → 300×300 centered
ok('square box fits height', approx(f1.w, 300) && approx(f1.h, 300));
ok('square box centered x', approx(f1.x, 50) && approx(f1.y, 0));
const f2 = fitAspectBox(400, 300, 16 / 9); // wide → limited by width
ok('16:9 box uses full width', approx(f2.w, 400) && approx(f2.h, 225));
ok('16:9 centered vertically', approx(f2.y, 37.5));

// ---- searchQualityForSize ----
// Synthetic monotonic size model: bytes = round(quality * 1000).
const sizeModel = (q: number) => Promise.resolve(Math.round(q * 1000));
const r1 = await searchQualityForSize(500, sizeModel, { min: 0.1, max: 0.95, iterations: 12 });
ok('search result fits target', r1.bytes <= 500);
ok('search is near-maximal (>=480)', r1.bytes >= 480);
ok('search not flagged overshoot', r1.overshoot === false);
// Full quality already fits.
const r2 = await searchQualityForSize(2000, sizeModel);
ok('full quality returned when it fits', r2.quality === 0.95 && r2.overshoot === false);
// Even min overshoots (target below the min-quality size of 100).
const r3 = await searchQualityForSize(50, sizeModel);
ok('overshoot flagged when min too big', r3.overshoot === true && r3.quality === 0.1);

// ---- buildIco ----
const pngA = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3, 4]); // 8 bytes
const pngB = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 9, 9, 9]);   // 7 bytes
const ico = buildIco([{ size: 16, png: pngA }, { size: 32, png: pngB }]);
const dv = new DataView(ico.buffer);
ok('ico reserved = 0', dv.getUint16(0, true) === 0);
ok('ico type = 1 (icon)', dv.getUint16(2, true) === 1);
ok('ico count = 2', dv.getUint16(4, true) === 2);
ok('ico entry0 width = 16', ico[6] === 16);
ok('ico entry0 bytesInRes = 8', dv.getUint32(6 + 8, true) === 8);
ok('ico entry0 offset = 38', dv.getUint32(6 + 12, true) === 6 + 32); // header(6)+2 entries(32)
ok('ico entry1 width = 32', ico[6 + 16] === 32);
ok('ico entry1 offset = 46', dv.getUint32(6 + 16 + 12, true) === 38 + 8);
ok('ico entry1 bytesInRes = 7', dv.getUint32(6 + 16 + 8, true) === 7);
ok('ico total length correct', ico.length === 6 + 32 + 8 + 7);
ok('ico payload A placed at 38', ico[38] === 0x89 && ico[38 + 7] === 4);
ok('ico payload B placed at 46', ico[46] === 0x89 && ico[46 + 6] === 9);
// 256px is written as 0.
const ico256 = buildIco([{ size: 256, png: pngA }]);
ok('ico 256px width byte = 0', ico256[6] === 0 && ico256[7] === 0);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
