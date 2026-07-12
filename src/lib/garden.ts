/**
 * Gardening & Plants math. Formulas are standard horticulture (plant-spacing
 * geometry, fertilizer nitrogen math, the watering constant, the DLI equation).
 * Data tables (compost C:N ratios, frost-relative planting offsets, DLI targets)
 * are from extension-service / horticulture sources cited on each tool page.
 * Do not invent constants; verify against a reputable source.
 */

const SQFT_PER_SQM = 10.7639104;
const GAL_PER_SQFT_INCH = 0.623; // 1 inch of water over 1 sq ft ≈ 0.623 US gallons

/* ---------------- Plant spacing ---------------- */

/**
 * Plants that fit in an area at a given centre-to-centre spacing.
 * Square grid: area / spacing². Triangular (hexagonal) packing fits ~15.5%
 * more: area / (spacing² × 0.866), where 0.866 = sin 60°.
 */
export function plantsInArea(areaSq: number, spacing: number) {
  if (spacing <= 0 || areaSq <= 0) return null;
  const square = Math.floor(areaSq / (spacing * spacing));
  const triangular = Math.floor(areaSq / (spacing * spacing * 0.866));
  return { square, triangular };
}

/* ---------------- Seed row ---------------- */

/** Seeds/plants along a row: floor(length / spacing) + 1; plus rows if bed width given. */
export function seedsInRow(rowLength: number, inRowSpacing: number, bedWidth?: number, rowSpacing?: number) {
  if (inRowSpacing <= 0 || rowLength <= 0) return null;
  const perRow = Math.floor(rowLength / inRowSpacing) + 1;
  let rows = 1, total = perRow;
  if (bedWidth && rowSpacing && rowSpacing > 0) {
    rows = Math.floor(bedWidth / rowSpacing) + 1;
    total = perRow * rows;
  }
  return { perRow, rows, total };
}

/* ---------------- Raised bed soil ---------------- */

/** Volume of soil for a bed (metric: m; imperial: ft). Returns m³, ft³, litres, yd³. */
export function bedVolume(length: number, width: number, depth: number, metric: boolean) {
  if (metric) {
    const m3 = length * width * depth;
    return { m3, ft3: m3 * 35.3147, litres: m3 * 1000, yd3: m3 * 1.30795 };
  }
  const ft3 = length * width * depth;
  const m3 = ft3 / 35.3147;
  return { m3, ft3, litres: m3 * 1000, yd3: ft3 / 27 };
}

/* ---------------- Fertilizer ---------------- */

/**
 * Pounds of fertilizer product to apply a target N rate.
 * lbs product = (target lb N per 1000 sq ft × area/1000) ÷ (%N ÷ 100).
 */
export function fertilizerLbs(targetNper1000: number, areaSqFt: number, percentN: number) {
  if (percentN <= 0) return null;
  const lbsN = targetNper1000 * (areaSqFt / 1000);
  return { lbsN, lbsProduct: lbsN / (percentN / 100) };
}

/* ---------------- Watering ---------------- */

/** Water needed to apply a depth. Imperial: sqft × inches × 0.623 = US gal. Metric: m² × mm = litres. */
export function waterNeeded(areaSq: number, depth: number, metric: boolean) {
  if (metric) {
    const litres = areaSq * depth; // m² × mm = L
    return { litres, usGal: litres / 3.785411784 };
  }
  const usGal = areaSq * depth * GAL_PER_SQFT_INCH;
  return { usGal, litres: usGal * 3.785411784 };
}

/* ---------------- Grow light DLI ---------------- */

/** Daily Light Integral (mol/m²/day) = PPFD (µmol/m²/s) × hours × 3600 / 1e6. */
export function dli(ppfd: number, hours: number) { return (ppfd * hours * 3600) / 1_000_000; }
/** PPFD needed to hit a target DLI over a photoperiod. */
export function ppfdForDli(targetDli: number, hours: number) {
  if (hours <= 0) return null;
  return (targetDli * 1_000_000) / (hours * 3600);
}
export const DLI_TARGETS: { id: string; label: string; lo: number; hi: number }[] = [
  { id: 'lowlight', label: 'Low-light foliage / houseplants', lo: 3, hi: 6 },
  { id: 'seedlings', label: 'Seedlings / young plants', lo: 6, hi: 10 },
  { id: 'greens', label: 'Leafy greens & herbs', lo: 12, hi: 17 },
  { id: 'fruiting', label: 'Fruiting (tomato, pepper)', lo: 20, hi: 30 },
];

/* ---------------- Compost C:N ---------------- */

export interface CompostMaterial { id: string; name: string; type: 'green' | 'brown'; cn: number }
/** Representative carbon:nitrogen ratios (Cornell / extension composting data). */
export const COMPOST_MATERIALS: CompostMaterial[] = [
  { id: 'food', name: 'Vegetable & food scraps', type: 'green', cn: 17 },
  { id: 'grass', name: 'Grass clippings (fresh)', type: 'green', cn: 20 },
  { id: 'coffee', name: 'Coffee grounds', type: 'green', cn: 20 },
  { id: 'manure', name: 'Manure (cow/horse)', type: 'green', cn: 20 },
  { id: 'leaves-dry', name: 'Dry / autumn leaves', type: 'brown', cn: 55 },
  { id: 'straw', name: 'Straw', type: 'brown', cn: 75 },
  { id: 'bark', name: 'Bark', type: 'brown', cn: 115 },
  { id: 'paper', name: 'Mixed paper', type: 'brown', cn: 175 },
  { id: 'sawdust', name: 'Sawdust', type: 'brown', cn: 325 },
  { id: 'woodchips', name: 'Wood chips', type: 'brown', cn: 400 },
  { id: 'cardboard', name: 'Corrugated cardboard', type: 'brown', cn: 560 },
];
export const getMaterial = (id: string) => COMPOST_MATERIALS.find((m) => m.id === id);
export const COMPOST_TARGET = { lo: 25, hi: 35 };

/**
 * Blended C:N ratio of a mix. Each entry is {cn, parts} weighted by parts.
 * Approximation weighting by mass share (parts).
 */
export function blendedCN(items: { cn: number; parts: number }[]): number | null {
  const totalParts = items.reduce((s, i) => s + i.parts, 0);
  if (totalParts <= 0) return null;
  // Weighted harmonic-style blend on N basis: assume equal C fraction proxy —
  // use parts-weighted average of C:N as a simple, transparent estimate.
  const weighted = items.reduce((s, i) => s + i.cn * i.parts, 0) / totalParts;
  return weighted;
}

/* ---------------- Planting dates (frost-relative) ---------------- */

export interface Crop {
  id: string; name: string;
  startIndoors?: number; // weeks relative to last frost (negative = before)
  transplant?: number;
  directSow?: number;
}
/** Frost-relative planting guide (weeks; negative = before last frost). Extension guidelines. */
export const CROPS: Crop[] = [
  { id: 'tomato', name: 'Tomatoes', startIndoors: -7, transplant: 1 },
  { id: 'pepper', name: 'Peppers', startIndoors: -8, transplant: 2 },
  { id: 'eggplant', name: 'Eggplant', startIndoors: -8, transplant: 2 },
  { id: 'lettuce', name: 'Lettuce', startIndoors: -5, transplant: -3, directSow: -3 },
  { id: 'peas', name: 'Peas', directSow: -5 },
  { id: 'spinach', name: 'Spinach', directSow: -5 },
  { id: 'kale', name: 'Kale', startIndoors: -5, transplant: -4 },
  { id: 'broccoli', name: 'Broccoli', startIndoors: -5, transplant: -2 },
  { id: 'cabbage', name: 'Cabbage', startIndoors: -5, transplant: -4 },
  { id: 'onion', name: 'Onions', startIndoors: -10, transplant: -4 },
  { id: 'carrot', name: 'Carrots', directSow: -3 },
  { id: 'beans', name: 'Beans', directSow: 1 },
  { id: 'cucumber', name: 'Cucumbers', startIndoors: -3, transplant: 2, directSow: 1 },
  { id: 'squash', name: 'Squash / zucchini', startIndoors: -3, transplant: 2, directSow: 1 },
  { id: 'corn', name: 'Sweet corn', directSow: 1 },
  { id: 'melon', name: 'Melons', startIndoors: -3, transplant: 2 },
];
export const getCrop = (id: string) => CROPS.find((c) => c.id === id);

export { SQFT_PER_SQM, GAL_PER_SQFT_INCH };

/* ---------------- GDD / pond volume / spray mix ---------------- */

/** Growing degree days for one day: max(0, ((min(tMax,cap)+tMin)/2) − tBase). */
export function growingDegreeDays(tMax: number, tMin: number, tBase: number, cap?: number): number {
  const hi = cap != null ? Math.min(tMax, cap) : tMax;
  const avg = (hi + tMin) / 2;
  return Math.max(0, avg - tBase);
}

/** Pond volume (litres & US gallons) and liner size (m) from L×W×avg depth (m) + overlap. */
export function pondVolume(lengthM: number, widthM: number, depthM: number, overlapM = 0.3) {
  if (lengthM <= 0 || widthM <= 0 || depthM <= 0) return null;
  const m3 = lengthM * widthM * depthM;
  return {
    litres: m3 * 1000,
    gallons: m3 * 264.172,
    linerLength: lengthM + 2 * depthM + 2 * overlapM,
    linerWidth: widthM + 2 * depthM + 2 * overlapM,
  };
}

/** Spray mix: product amount = tank volume × rate per volume unit. */
export function sprayMix(tankVolume: number, ratePerUnit: number): number | null {
  if (tankVolume < 0 || ratePerUnit < 0) return null;
  return tankVolume * ratePerUnit;
}
