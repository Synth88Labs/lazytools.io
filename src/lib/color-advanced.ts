/**
 * Advanced color-space math — OKLab/OKLCH, CIELAB/LCH, XYZ, HWB, gamut mapping,
 * APCA (WCAG 3) contrast, and colour-vision-deficiency simulation.
 * All exact, published algorithms. Pure functions, no DOM.
 */

import type { RGB } from './color-compute';

// ---------- sRGB gamma <-> linear ----------

export const srgbToLinear = (c: number): number => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
};
export const linearToSrgb = (x: number): number => {
  const c = x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  return c * 255;
};

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// ---------- OKLab / OKLCH (Björn Ottosson) ----------

export interface OKLab { L: number; a: number; b: number }
export interface OKLCH { L: number; C: number; h: number }

export function rgbToOklab({ r, g, b }: RGB): OKLab {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

/** OKLab -> linear-sRGB triple (may be out of [0,1] gamut). */
function oklabToLinearRgb({ L, a, b }: OKLab): { r: number; g: number; b: number } {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

export function oklabToRgb(lab: OKLab): { rgb: RGB; inGamut: boolean } {
  const lin = oklabToLinearRgb(lab);
  const eps = 1e-4;
  const inGamut =
    lin.r >= -eps && lin.r <= 1 + eps &&
    lin.g >= -eps && lin.g <= 1 + eps &&
    lin.b >= -eps && lin.b <= 1 + eps;
  return {
    rgb: {
      r: Math.round(clamp01(linearToSrgb(lin.r) / 255) * 255),
      g: Math.round(clamp01(linearToSrgb(lin.g) / 255) * 255),
      b: Math.round(clamp01(linearToSrgb(lin.b) / 255) * 255),
    },
    inGamut,
  };
}

export const oklabToOklch = ({ L, a, b }: OKLab): OKLCH => {
  const C = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
};
export const oklchToOklab = ({ L, C, h }: OKLCH): OKLab => {
  const r = (h * Math.PI) / 180;
  return { L, a: C * Math.cos(r), b: C * Math.sin(r) };
};

export const rgbToOklch = (rgb: RGB): OKLCH => oklabToOklch(rgbToOklab(rgb));

/** OKLCH -> sRGB with CSS Color 4-style chroma gamut mapping. Returns whether clipping/mapping was needed. */
export function oklchToRgb(lch: OKLCH): { rgb: RGB; inGamut: boolean } {
  const direct = oklabToRgb(oklchToOklab(lch));
  if (direct.inGamut) return { rgb: direct.rgb, inGamut: true };
  if (lch.L <= 0) return { rgb: { r: 0, g: 0, b: 0 }, inGamut: false };
  if (lch.L >= 1) return { rgb: { r: 255, g: 255, b: 255 }, inGamut: false };
  // binary-search the largest chroma that stays in gamut, holding L and h
  let lo = 0, hi = lch.C;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (oklabToRgb(oklchToOklab({ L: lch.L, C: mid, h: lch.h })).inGamut) lo = mid;
    else hi = mid;
  }
  return { rgb: oklabToRgb(oklchToOklab({ L: lch.L, C: lo, h: lch.h })).rgb, inGamut: false };
}

// ---------- CIE XYZ (D65) + CIELAB / LCH ----------

export interface XYZ { x: number; y: number; z: number }
export interface LAB { L: number; a: number; b: number }

const D65 = { x: 0.95047, y: 1.0, z: 1.08883 };

export function rgbToXyz({ r, g, b }: RGB): XYZ {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  return {
    x: 0.4124564 * lr + 0.3575761 * lg + 0.1804375 * lb,
    y: 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb,
    z: 0.0193339 * lr + 0.119192 * lg + 0.9503041 * lb,
  };
}

export function xyzToLab({ x, y, z }: XYZ): LAB {
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : (903.3 * t + 16) / 116);
  const fx = f(x / D65.x), fy = f(y / D65.y), fz = f(z / D65.z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

export const rgbToLab = (rgb: RGB): LAB => xyzToLab(rgbToXyz(rgb));

export const labToLch = ({ L, a, b }: LAB): { L: number; C: number; h: number } => {
  const C = Math.hypot(a, b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
};

/** CIEDE2000 colour difference between two Lab colours. */
export function deltaE2000(l1: LAB, l2: LAB): number {
  const kL = 1, kC = 1, kH = 1;
  const avgLp = (l1.L + l2.L) / 2;
  const c1 = Math.hypot(l1.a, l1.b), c2 = Math.hypot(l2.a, l2.b);
  const avgC = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7)));
  const a1p = l1.a * (1 + g), a2p = l2.a * (1 + g);
  const c1p = Math.hypot(a1p, l1.b), c2p = Math.hypot(a2p, l2.b);
  const avgCp = (c1p + c2p) / 2;
  const hp = (a: number, b: number) => { let h = (Math.atan2(b, a) * 180) / Math.PI; if (h < 0) h += 360; return h; };
  const h1p = hp(a1p, l1.b), h2p = hp(a2p, l2.b);
  let dhp = h2p - h1p;
  if (Math.abs(dhp) > 180) dhp += dhp > 0 ? -360 : 360;
  const dHp = 2 * Math.sqrt(c1p * c2p) * Math.sin((dhp * Math.PI) / 360);
  let avgHp = (h1p + h2p) / 2;
  if (Math.abs(h1p - h2p) > 180) avgHp += 180;
  const dLp = l2.L - l1.L, dCp = c2p - c1p;
  const t = 1 - 0.17 * Math.cos(((avgHp - 30) * Math.PI) / 180) + 0.24 * Math.cos((2 * avgHp * Math.PI) / 180) +
    0.32 * Math.cos(((3 * avgHp + 6) * Math.PI) / 180) - 0.2 * Math.cos(((4 * avgHp - 63) * Math.PI) / 180);
  const sL = 1 + (0.015 * (avgLp - 50) ** 2) / Math.sqrt(20 + (avgLp - 50) ** 2);
  const sC = 1 + 0.045 * avgCp;
  const sH = 1 + 0.015 * avgCp * t;
  const dTheta = 30 * Math.exp(-(((avgHp - 275) / 25) ** 2));
  const rC = 2 * Math.sqrt(avgCp ** 7 / (avgCp ** 7 + 25 ** 7));
  const rT = -rC * Math.sin((2 * dTheta * Math.PI) / 180);
  return Math.sqrt(
    (dLp / (kL * sL)) ** 2 + (dCp / (kC * sC)) ** 2 + (dHp / (kH * sH)) ** 2 +
    rT * (dCp / (kC * sC)) * (dHp / (kH * sH))
  );
}

// ---------- HWB ----------

export function rgbToHwb({ r, g, b }: RGB): { h: number; w: number; b: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), w: Math.round(min * 100), b: Math.round((1 - max) * 100) };
}

// ---------- APCA (WCAG 3) — pinned to APCA-W3 0.1.9 ----------

const APCA = {
  mainTRC: 2.4,
  Rco: 0.2126729, Gco: 0.7151522, Bco: 0.072175,
  normBG: 0.56, normTXT: 0.57, revTXT: 0.62, revBG: 0.65,
  blkThrs: 0.022, blkClmp: 1.414, scaleBoW: 1.14, scaleWoB: 1.14,
  loBoWoffset: 0.027, loWoBoffset: 0.027, deltaYmin: 0.0005, loClip: 0.1,
};

const apcaY = ({ r, g, b }: RGB): number => {
  const s = (c: number) => Math.pow(c / 255, APCA.mainTRC);
  let y = APCA.Rco * s(r) + APCA.Gco * s(g) + APCA.Bco * s(b);
  if (y < APCA.blkThrs) y += Math.pow(APCA.blkThrs - y, APCA.blkClmp);
  return y;
};

/** APCA lightness contrast Lc (signed, ~ -108..+106). text on background. */
export function apcaContrast(text: RGB, bg: RGB): number {
  const Ytxt = apcaY(text), Ybg = apcaY(bg);
  if (Math.abs(Ybg - Ytxt) < APCA.deltaYmin) return 0;
  let out: number;
  if (Ybg > Ytxt) {
    const sapc = (Math.pow(Ybg, APCA.normBG) - Math.pow(Ytxt, APCA.normTXT)) * APCA.scaleBoW;
    out = sapc < APCA.loClip ? 0 : (sapc - APCA.loBoWoffset) * 100;
  } else {
    const sapc = (Math.pow(Ybg, APCA.revBG) - Math.pow(Ytxt, APCA.revTXT)) * APCA.scaleWoB;
    out = sapc > -APCA.loClip ? 0 : (sapc + APCA.loWoBoffset) * 100;
  }
  return out;
}

/** Minimum font size (px) per APCA font lookup, given |Lc| and weight (400/700). Coarse public bronze table. */
export function apcaMinFont(lc: number, weight: 400 | 700 = 400): string {
  const a = Math.abs(lc);
  if (a < 15) return 'fails — invisible';
  if (a < 30) return 'non-text / decorative only';
  if (a < 45) return weight >= 700 ? '≈ 24px+' : '≈ 36px+ (large only)';
  if (a < 60) return weight >= 700 ? '≈ 16px+' : '≈ 18px+';
  if (a < 75) return weight >= 700 ? '≈ 14px+' : '≈ 16px body';
  if (a < 90) return '≈ 14px+ body text';
  return 'all sizes incl. fine print';
}

// ---------- Colour-vision-deficiency simulation (Machado et al. 2009, severity 1.0) ----------
// 3x3 matrices operate on LINEAR sRGB (per DaltonLens). Severity <1 interpolates from identity.

type Mat3 = [number, number, number, number, number, number, number, number, number];

const CVD_MATRICES: Record<'protanopia' | 'deuteranopia' | 'tritanopia', Mat3> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
};

export type CvdType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

/** Simulate CVD on a single sRGB colour. severity 0..1 (dichromats use 1). */
export function simulateCvd(rgb: RGB, type: CvdType, severity = 1): RGB {
  const lr = srgbToLinear(rgb.r), lg = srgbToLinear(rgb.g), lb = srgbToLinear(rgb.b);
  let or_: number, og: number, ob: number;
  if (type === 'achromatopsia') {
    const y = 0.2126729 * lr + 0.7151522 * lg + 0.072175 * lb;
    or_ = og = ob = y;
  } else {
    const m = CVD_MATRICES[type];
    or_ = m[0] * lr + m[1] * lg + m[2] * lb;
    og = m[3] * lr + m[4] * lg + m[5] * lb;
    ob = m[6] * lr + m[7] * lg + m[8] * lb;
  }
  const s = Math.min(1, Math.max(0, severity));
  const mix = (orig: number, sim: number) => orig * (1 - s) + sim * s;
  return {
    r: Math.round(clamp01(linearToSrgb(mix(lr, or_)) / 255) * 255),
    g: Math.round(clamp01(linearToSrgb(mix(lg, og)) / 255) * 255),
    b: Math.round(clamp01(linearToSrgb(mix(lb, ob)) / 255) * 255),
  };
}

// ---------- formatting helpers ----------

export const fmtOklch = ({ L, C, h }: OKLCH, pct = true): string =>
  pct
    ? `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(4)} ${h.toFixed(1)})`
    : `oklch(${L.toFixed(4)} ${C.toFixed(4)} ${h.toFixed(1)})`;
export const fmtOklab = ({ L, a, b }: OKLab): string =>
  `oklab(${(L * 100).toFixed(1)}% ${a.toFixed(4)} ${b.toFixed(4)})`;
export const fmtLab = ({ L, a, b }: LAB): string =>
  `lab(${L.toFixed(2)} ${a.toFixed(2)} ${b.toFixed(2)})`;
export const fmtLch = ({ L, C, h }: { L: number; C: number; h: number }): string =>
  `lch(${L.toFixed(2)} ${C.toFixed(2)} ${h.toFixed(1)})`;

/** CIE76 colour difference — Euclidean distance in Lab. */
export function deltaE76(a: LAB, b: LAB): number {
  return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b);
}


/** Colour temperature (Kelvin) → approximate sRGB (Tanner Helland algorithm), 1000–40000 K. */
export function kelvinToRgb(kelvin: number): RGB {
  const t = Math.max(1000, Math.min(40000, kelvin)) / 100;
  const cl = (x: number) => Math.max(0, Math.min(255, Math.round(x)));
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return { r: cl(r), g: cl(g), b: cl(b) };
}
