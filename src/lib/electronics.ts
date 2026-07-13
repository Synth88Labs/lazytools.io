/**
 * Electronics & circuits math. Standard tables (IEC 60062 resistor/capacitor
 * color codes, AWG wire gauge) and textbook formulas (Ohm's law, RC time
 * constants, the 555 timer equations). Cited on each tool page. Do not invent
 * table values; verify against IEC/NEC/manufacturer references.
 */

export interface ResColor { name: string; hex: string; digit?: number; mult?: number; tol?: number; tempco?: number; }
/** IEC 60062 resistor color bands. */
export const RES_COLORS: ResColor[] = [
  { name: 'Black', hex: '#111827', digit: 0, mult: 1 },
  { name: 'Brown', hex: '#78350f', digit: 1, mult: 10, tol: 1, tempco: 100 },
  { name: 'Red', hex: '#dc2626', digit: 2, mult: 100, tol: 2, tempco: 50 },
  { name: 'Orange', hex: '#ea580c', digit: 3, mult: 1e3, tol: 0.05, tempco: 15 },
  { name: 'Yellow', hex: '#eab308', digit: 4, mult: 1e4, tol: 0.02, tempco: 25 },
  { name: 'Green', hex: '#16a34a', digit: 5, mult: 1e5, tol: 0.5, tempco: 20 },
  { name: 'Blue', hex: '#2563eb', digit: 6, mult: 1e6, tol: 0.25, tempco: 10 },
  { name: 'Violet', hex: '#7c3aed', digit: 7, mult: 1e7, tol: 0.1, tempco: 5 },
  { name: 'Grey', hex: '#6b7280', digit: 8, mult: 1e8, tol: 0.01, tempco: 1 },
  { name: 'White', hex: '#f9fafb', digit: 9, mult: 1e9 },
  { name: 'Gold', hex: '#d4af37', mult: 0.1, tol: 5 },
  { name: 'Silver', hex: '#c0c0c0', mult: 0.01, tol: 10 },
];
export const colorByName = (n: string) => RES_COLORS.find((c) => c.name === n);

/** Resistance, tolerance and (optional) temp-coefficient from an array of band color names. */
export function resistorFromBands(colors: string[]): { ohms: number; tolerance: number | null; tempco: number | null } | null {
  const n = colors.length;
  if (n < 3 || n > 6) return null;
  const digitCount = n >= 5 ? 3 : n === 4 ? 2 : 2; // 3-band has no tol
  const cs = colors.map(colorByName);
  if (cs.some((c) => !c)) return null;
  let digits = 0;
  for (let i = 0; i < digitCount; i++) {
    const d = cs[i]!.digit;
    if (d == null) return null;
    digits = digits * 10 + d;
  }
  const mult = cs[digitCount]!.mult;
  if (mult == null) return null;
  const ohms = digits * mult;
  const tolColor = n >= 4 ? cs[digitCount + 1] : null;
  const tolerance = tolColor?.tol ?? (n >= 4 ? null : 20);
  const tempco = n === 6 ? cs[5]!.tempco ?? null : null;
  return { ohms, tolerance: tolerance ?? null, tempco };
}

/** Format an ohm value with SI prefix. */
export function fmtOhms(ohms: number): string {
  if (ohms >= 1e9) return `${+(ohms / 1e9).toPrecision(4)} GΩ`;
  if (ohms >= 1e6) return `${+(ohms / 1e6).toPrecision(4)} MΩ`;
  if (ohms >= 1e3) return `${+(ohms / 1e3).toPrecision(4)} kΩ`;
  return `${+ohms.toPrecision(4)} Ω`;
}

/* ---------------- Capacitor code ---------------- */

/** Parse a 3-digit ceramic cap code (e.g. "104") → picofarads. */
export function capacitorCodePf(code: string): number | null {
  const t = code.trim();
  if (/^\d{3}$/.test(t)) {
    const d = parseInt(t.slice(0, 2), 10);
    const m = parseInt(t[2], 10);
    return d * Math.pow(10, m);
  }
  if (/^\d{1,2}$/.test(t)) return parseInt(t, 10); // direct pF
  return null;
}
export function fmtCapacitance(pf: number): string {
  if (pf >= 1e6) return `${+(pf / 1e6).toPrecision(4)} µF`;
  if (pf >= 1e3) return `${+(pf / 1e3).toPrecision(4)} nF`;
  return `${+pf.toPrecision(4)} pF`;
}

/* ---------------- SMD resistor code ---------------- */

/**
 * EIA-96 3-significant-figure lookup, code 01–96 → value (the E96 1% series).
 * Standard EIA/IEC table — do not alter values.
 */
export const EIA96: number[] = [
  100, 102, 105, 107, 110, 113, 115, 118, 121, 124, 127, 130, 133, 137, 140, 143,
  147, 150, 154, 158, 162, 165, 169, 174, 178, 182, 187, 191, 196, 200, 205, 210,
  215, 221, 226, 232, 237, 243, 249, 255, 261, 267, 274, 280, 287, 294, 301, 309,
  316, 324, 332, 340, 348, 357, 365, 374, 383, 392, 402, 412, 422, 432, 442, 453,
  464, 475, 487, 499, 511, 523, 536, 549, 562, 576, 590, 604, 619, 634, 649, 665,
  681, 698, 715, 732, 750, 768, 787, 806, 825, 845, 866, 887, 909, 931, 953, 976,
];
/** EIA-96 multiplier letters. */
const EIA96_MULT: Record<string, number> = {
  Z: 0.001, Y: 0.01, R: 0.01, X: 0.1, S: 0.1, A: 1, B: 10, H: 10, C: 100, D: 1e3, E: 1e4, F: 1e5,
};

export interface SmdResult { ohms: number; format: string; }
/**
 * Decode an SMD resistor marking to ohms. Handles 3-digit (103), 4-digit 1%
 * (1002), EIA-96 (01C, 68X), R-notation decimals (R47, 4R7, 47R0) and 0-ohm
 * jumpers (0, 00, 000). Returns null on an unrecognisable code.
 */
export function decodeSmd(raw: string): SmdResult | null {
  const code = raw.trim().toUpperCase();
  if (!code) return null;
  if (/^0+$/.test(code)) return { ohms: 0, format: 'Zero-ohm jumper' };
  // EIA-96: two digits + multiplier letter
  const eia = code.match(/^(\d{2})([A-Z])$/);
  if (eia) {
    const idx = parseInt(eia[1], 10);
    const mult = EIA96_MULT[eia[2]];
    if (idx >= 1 && idx <= 96 && mult != null) return { ohms: EIA96[idx - 1] * mult, format: 'EIA-96 (1%)' };
    return null;
  }
  // R-notation decimal: the R marks the decimal point
  if (/^\d*R\d*$/.test(code)) {
    const v = parseFloat(code.replace('R', '.'));
    return isFinite(v) ? { ohms: v, format: 'R-notation' } : null;
  }
  // 3-digit: two significant figures + power-of-ten multiplier
  if (/^\d{3}$/.test(code)) {
    return { ohms: parseInt(code.slice(0, 2), 10) * Math.pow(10, parseInt(code[2], 10)), format: '3-digit' };
  }
  // 4-digit (1%): three significant figures + multiplier
  if (/^\d{4}$/.test(code)) {
    return { ohms: parseInt(code.slice(0, 3), 10) * Math.pow(10, parseInt(code[3], 10)), format: '4-digit (1%)' };
  }
  return null;
}

/* ---------------- LC resonance ---------------- */

/** LC resonant (tank) frequency f = 1 ÷ (2π·√(LC)), Hz, from L (H) and C (F). */
export const lcResonance = (l: number, c: number) => 1 / (2 * Math.PI * Math.sqrt(l * c));
/** Characteristic impedance of an LC tank, √(L/C), Ω. */
export const lcImpedance = (l: number, c: number) => Math.sqrt(l / c);

/* ---------------- AWG wire gauge ---------------- */

const CU_RESISTIVITY = 1.68e-8; // Ω·m (annealed copper, 20°C)
/** AWG diameter in mm. */
export const awgDiameterMm = (n: number) => 0.127 * Math.pow(92, (36 - n) / 39);
export function awg(n: number) {
  const d = awgDiameterMm(n);
  const areaMm2 = Math.PI * (d / 2) ** 2;
  const areaM2 = areaMm2 * 1e-6;
  const ohmPerKm = (CU_RESISTIVITY / areaM2) * 1000;
  return { diameterMm: d, areaMm2, ohmPerKm, ohmPer1000ft: ohmPerKm * 0.3048 };
}
/** Typical ampacity (A). Chassis = single wire in free air; power = NEC-style bundled/60°C. */
export const AWG_AMPACITY: Record<number, { chassis: number; power: number }> = {
  10: { chassis: 55, power: 30 }, 12: { chassis: 41, power: 20 }, 14: { chassis: 32, power: 15 },
  16: { chassis: 22, power: 10 }, 18: { chassis: 16, power: 7 }, 20: { chassis: 11, power: 5 },
  22: { chassis: 7, power: 3 }, 24: { chassis: 3.5, power: 2.1 }, 26: { chassis: 2.2, power: 1.3 },
  28: { chassis: 1.4, power: 0.8 },
};

/* ---------------- RC / reactance ---------------- */

/** RC time constant (s) from R (Ω) and C (F). */
export const rcTau = (r: number, c: number) => r * c;
/** RC low-pass cutoff frequency (Hz). */
export const rcCutoff = (r: number, c: number) => 1 / (2 * Math.PI * r * c);
export const capReactance = (f: number, c: number) => 1 / (2 * Math.PI * f * c);
export const indReactance = (f: number, l: number) => 2 * Math.PI * f * l;

/* ---------------- 555 timer ---------------- */

/** Astable NE555: f, high/low times, duty from R1, R2 (Ω), C (F). */
export function timer555Astable(r1: number, r2: number, c: number) {
  const freq = 1.44 / ((r1 + 2 * r2) * c);
  const tHigh = 0.693 * (r1 + r2) * c;
  const tLow = 0.693 * r2 * c;
  const duty = (r1 + r2) / (r1 + 2 * r2);
  return { freq, tHigh, tLow, duty };
}
/** Monostable NE555 pulse width (s): t = 1.1·R·C. */
export const timer555Monostable = (r: number, c: number) => 1.1 * r * c;

/* ---------------- LED resistor & divider ---------------- */

/** Series resistor for an LED. Returns resistance (Ω) and power (W). */
export function ledResistor(vSupply: number, vLed: number, iMa: number) {
  const i = iMa / 1000;
  const r = (vSupply - vLed) / i;
  return { ohms: r, power: i * i * r };
}
/** Voltage divider output. */
export const voltageDivider = (vin: number, r1: number, r2: number) => (vin * r2) / (r1 + r2);

/* ---------------- Battery life ---------------- */

/** Estimated battery life (hours) = capacity(mAh) / load(mA) × derating. */
export const batteryLifeHours = (capacityMah: number, loadMa: number, derate = 0.8) =>
  (capacityMah / loadMa) * derate;

/* ---------------- Series / parallel networks ---------------- */

/** Total resistance of resistors in series (Ω) — simple sum. */
export const seriesResistance = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
/** Total resistance of resistors in parallel (Ω): 1 ÷ Σ(1/Rᵢ). */
export function parallelResistance(vals: number[]): number {
  const recip = vals.reduce((a, b) => a + (b > 0 ? 1 / b : Infinity), 0);
  return recip > 0 ? 1 / recip : 0;
}
/** Total capacitance in parallel (F) — simple sum. */
export const parallelCapacitance = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
/** Total capacitance in series (F): 1 ÷ Σ(1/Cᵢ) — the reciprocal rule (opposite of resistors). */
export function seriesCapacitance(vals: number[]): number {
  const recip = vals.reduce((a, b) => a + (b > 0 ? 1 / b : Infinity), 0);
  return recip > 0 ? 1 / recip : 0;
}
/** Total inductance in series (H) — simple sum (no mutual coupling). */
export const seriesInductance = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
/** Total inductance in parallel (H): 1 ÷ Σ(1/Lᵢ). */
export function parallelInductance(vals: number[]): number {
  const recip = vals.reduce((a, b) => a + (b > 0 ? 1 / b : Infinity), 0);
  return recip > 0 ? 1 / recip : 0;
}

/* ---------------- Ohm's law / power ---------------- */

export interface OhmsResult { v: number; i: number; r: number; p: number; }
/**
 * Ohm's-law + power wheel. Supply EXACTLY two of voltage V (V), current I (A),
 * resistance R (Ω), power P (W); returns all four. Pass null/undefined for the
 * two unknowns. Returns null if fewer or more than two are given, or the pair
 * is unsolvable (e.g. non-positive R with only P known).
 */
export function ohmsLaw(v?: number | null, i?: number | null, r?: number | null, p?: number | null): OhmsResult | null {
  const known = [v, i, r, p].filter((x) => x != null && isFinite(x as number)).length;
  if (known !== 2) return null;
  let V = v ?? null, I = i ?? null, R = r ?? null, P = p ?? null;
  if (V != null && I != null) { R = I !== 0 ? V / I : Infinity; P = V * I; }
  else if (V != null && R != null) { if (R <= 0) return null; I = V / R; P = (V * V) / R; }
  else if (V != null && P != null) { if (V === 0) return null; I = P / V; R = (V * V) / P; }
  else if (I != null && R != null) { V = I * R; P = I * I * R; }
  else if (I != null && P != null) { if (I === 0) return null; V = P / I; R = P / (I * I); }
  else if (R != null && P != null) { if (R < 0 || P < 0) return null; V = Math.sqrt(P * R); I = R > 0 ? Math.sqrt(P / R) : Infinity; }
  else return null;
  return { v: V as number, i: I as number, r: R as number, p: P as number };
}

export { CU_RESISTIVITY };
