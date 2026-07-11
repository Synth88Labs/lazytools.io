import {
  rgbToOklch, oklchToRgb, rgbToOklab, rgbToLab, labToLch, rgbToHwb,
  apcaContrast, simulateCvd, deltaE2000, fmtOklch,
} from '../src/lib/color-advanced.ts';
import type { RGB } from '../src/lib/color-compute.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol: number, msg: string) => {
  if (Math.abs(a - b) <= tol) { pass++; }
  else { fail++; console.log(`FAIL ${msg}: got ${a}, expected ${b} (±${tol})`); }
};
const eq = (a: unknown, b: unknown, msg: string) => {
  if (a === b) { pass++; } else { fail++; console.log(`FAIL ${msg}: got ${a}, expected ${b}`); }
};

const RED: RGB = { r: 255, g: 0, b: 0 };
const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };
const BLUE: RGB = { r: 29, g: 135, b: 241 };

// --- OKLab reference (Ottosson): linear sRGB red -> (0.6279, 0.2249, 0.1258)
const labRed = rgbToOklab(RED);
approx(labRed.L, 0.627955, 0.001, 'OKLab red L');
approx(labRed.a, 0.224863, 0.001, 'OKLab red a');
approx(labRed.b, 0.125846, 0.001, 'OKLab red b');

// white -> L≈1, a≈0, b≈0
const labWhite = rgbToOklab(WHITE);
approx(labWhite.L, 1.0, 0.002, 'OKLab white L');
approx(labWhite.a, 0, 0.002, 'OKLab white a');

// --- OKLCH red: L=0.628, C=0.2577, H=29.23
const lchRed = rgbToOklch(RED);
approx(lchRed.L, 0.6280, 0.001, 'OKLCH red L');
approx(lchRed.C, 0.2577, 0.001, 'OKLCH red C');
approx(lchRed.h, 29.23, 0.2, 'OKLCH red H');

// --- round-trip OKLCH -> RGB for in-gamut colors
for (const c of [RED, WHITE, BLACK, BLUE, { r: 100, g: 200, b: 50 } as RGB]) {
  const back = oklchToRgb(rgbToOklch(c));
  approx(back.rgb.r, c.r, 1, `roundtrip r ${JSON.stringify(c)}`);
  approx(back.rgb.g, c.g, 1, `roundtrip g ${JSON.stringify(c)}`);
  approx(back.rgb.b, c.b, 1, `roundtrip b ${JSON.stringify(c)}`);
}

// --- out-of-gamut: very high chroma should map & flag
const oog = oklchToRgb({ L: 0.7, C: 0.4, h: 150 });
eq(oog.inGamut, false, 'high-chroma out of gamut flagged');

// --- CIELAB reference: white -> L=100,a=0,b=0
const labW = rgbToLab(WHITE);
approx(labW.L, 100, 0.1, 'LAB white L');
approx(labW.a, 0, 0.1, 'LAB white a');
approx(labW.b, 0, 0.1, 'LAB white b');
// red -> L≈53.24, a≈80.09, b≈67.20
const labR = rgbToLab(RED);
approx(labR.L, 53.24, 0.1, 'LAB red L');
approx(labR.a, 80.09, 0.2, 'LAB red a');
approx(labR.b, 67.20, 0.2, 'LAB red b');
// LCH red: C≈104.55, h≈40
const lchR = labToLch(labR);
approx(lchR.C, 104.55, 0.3, 'LCH red C');
approx(lchR.h, 39.999, 0.5, 'LCH red h');

// --- HWB: red -> h0 w0 b0 ; white -> w100
const hwbR = rgbToHwb(RED);
eq(hwbR.h, 0, 'HWB red h'); eq(hwbR.w, 0, 'HWB red w'); eq(hwbR.b, 0, 'HWB red b');
const hwbW = rgbToHwb(WHITE);
eq(hwbW.w, 100, 'HWB white w');

// --- APCA reference: black text on white ≈ 106.04 ; white on black ≈ -107.88
approx(apcaContrast(BLACK, WHITE), 106.04, 0.5, 'APCA black-on-white');
approx(apcaContrast(WHITE, BLACK), -107.88, 0.5, 'APCA white-on-black');
// same colour -> 0
eq(apcaContrast(BLUE, BLUE), 0, 'APCA identical -> 0');

// --- ΔE2000: identical -> 0 ; white vs black large
approx(deltaE2000(labR, labR), 0, 0.001, 'dE identical');
approx(deltaE2000(rgbToLab(WHITE), rgbToLab(BLACK)), 100, 1.5, 'dE white/black ~100');

// --- CVD: achromatopsia yields grey (r==g==b)
const grey = simulateCvd(BLUE, 'achromatopsia', 1);
eq(grey.r === grey.g && grey.g === grey.b, true, 'achromatopsia -> grey');
// dichromat sim of white stays ~white; black stays ~black
const dW = simulateCvd(WHITE, 'deuteranopia', 1);
approx(dW.r, 255, 3, 'deut white r'); approx(dW.g, 255, 3, 'deut white g');
// severity 0 = original
const s0 = simulateCvd(BLUE, 'protanopia', 0);
approx(s0.r, BLUE.r, 1, 'severity0 r'); approx(s0.g, BLUE.g, 1, 'severity0 g'); approx(s0.b, BLUE.b, 1, 'severity0 b');

console.log(`\noklch(red) = ${fmtOklch(lchRed)}`);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
