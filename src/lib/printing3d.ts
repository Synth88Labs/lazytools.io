/**
 * 3D printing math. Exact geometry (filament is a cylinder, so length ↔ weight
 * ↔ volume follow from density and diameter) plus standard maker calibration
 * formulas (E-steps, flow / extrusion multiplier, volumetric flow). Material
 * densities and typical printer power are reference values cited on each tool
 * page — do not invent them; verify against manufacturer datasheets.
 */

export interface Material { name: string; density: number; note?: string; } // density g/cm³
/**
 * Reference filament densities (g/cm³). Brands vary a little; these are the
 * commonly-cited values. Verify against the spool's datasheet for precision.
 */
export const MATERIALS: Material[] = [
  { name: 'PLA', density: 1.24 },
  { name: 'PLA+', density: 1.24 },
  { name: 'ABS', density: 1.04 },
  { name: 'PETG', density: 1.27 },
  { name: 'TPU (flexible)', density: 1.21 },
  { name: 'Nylon (PA)', density: 1.08, note: 'Grade-dependent (PA12 ~1.01, PA6 ~1.14) — check your datasheet.' },
  { name: 'ASA', density: 1.07 },
  { name: 'PC (polycarbonate)', density: 1.20 },
  { name: 'HIPS', density: 1.05 },
  { name: 'PVA', density: 1.23 },
  { name: 'Wood-fill PLA', density: 1.20, note: 'Varies a lot with wood-fibre loading (~1.15–1.28).' },
  { name: 'Carbon-fibre-filled', density: 1.30, note: 'Rises with carbon-fibre content (~1.29–1.31).' },
];
export const materialByName = (n: string) => MATERIALS.find((m) => m.name === n);

/** Standard nominal filament diameters (mm). */
export const DIAMETERS = [1.75, 2.85, 3.0];

/** Cross-sectional area of the filament (mm²) from its diameter (mm). */
export const filamentArea = (diameterMm: number) => Math.PI * (diameterMm / 2) ** 2;

/**
 * Convert between filament length (m), weight (g) and volume (cm³) given the
 * material density (g/cm³) and diameter (mm). Provide exactly one of length or
 * weight; returns all three.
 */
export function filamentConvert(opts: { lengthM?: number; weightG?: number; density: number; diameterMm: number }): { lengthM: number; weightG: number; volumeCm3: number } | null {
  const { density, diameterMm } = opts;
  if (density <= 0 || diameterMm <= 0) return null;
  const areaMm2 = filamentArea(diameterMm);
  // 1 m = 1000 mm, so volume per metre = area(mm²) × 1000 mm = area×1000 mm³.
  // 1 cm³ = 1000 mm³, so cm³ per metre = area×1000 / 1000 = area (numerically).
  const volPerMeterCm3 = areaMm2;
  const gramsPerMeter = volPerMeterCm3 * density;

  let lengthM: number, weightG: number;
  if (opts.lengthM != null && isFinite(opts.lengthM)) {
    lengthM = opts.lengthM;
    weightG = lengthM * gramsPerMeter;
  } else if (opts.weightG != null && isFinite(opts.weightG)) {
    weightG = opts.weightG;
    lengthM = gramsPerMeter > 0 ? weightG / gramsPerMeter : 0;
  } else {
    return null;
  }
  const volumeCm3 = weightG / density;
  return { lengthM, weightG, volumeCm3 };
}

/**
 * Filament cost from weight used and spool pricing. Either give pricePerKg, or
 * a spool price + spool weight (kg) to derive it.
 */
export function filamentCost(weightG: number, pricePerKg: number): number | null {
  if (weightG < 0 || pricePerKg < 0) return null;
  return (weightG / 1000) * pricePerKg;
}

/** Electricity cost of a print: watts × hours → kWh × rate. */
export function printEnergy(watts: number, hours: number, ratePerKwh: number): { kwh: number; cost: number } | null {
  if (watts < 0 || hours < 0 || ratePerKwh < 0) return null;
  const kwh = (watts / 1000) * hours;
  return { kwh, cost: kwh * ratePerKwh };
}

/**
 * Model scaling. A linear scale factor (percent) changes each dimension
 * proportionally; volume (and material/weight) scale by the cube of the factor.
 */
export function scaleModel(scalePct: number, original?: { x?: number; y?: number; z?: number }): { factor: number; volumeFactor: number; dims: { x?: number; y?: number; z?: number } } | null {
  if (scalePct <= 0) return null;
  const factor = scalePct / 100;
  const volumeFactor = factor ** 3;
  const dims = {
    x: original?.x != null ? original.x * factor : undefined,
    y: original?.y != null ? original.y * factor : undefined,
    z: original?.z != null ? original.z * factor : undefined,
  };
  return { factor, volumeFactor, dims };
}

/** Scale percent needed to fit an original dimension into a target (e.g. bed size). */
export function fitScalePercent(originalMax: number, targetMax: number): number | null {
  if (originalMax <= 0 || targetMax <= 0) return null;
  return (targetMax / originalMax) * 100;
}

/**
 * Extruder E-steps calibration. After asking the printer to extrude
 * `requested` mm and measuring `actual` mm extruded:
 *   new E-steps = current × (requested ÷ actual)
 */
export function calibrateEsteps(currentSteps: number, requestedMm: number, actualMm: number): number | null {
  if (currentSteps <= 0 || requestedMm <= 0 || actualMm <= 0) return null;
  return currentSteps * (requestedMm / actualMm);
}

/**
 * Flow / extrusion-multiplier calibration from a measured wall thickness:
 *   new flow % = current % × (target wall ÷ measured wall)
 */
export function calibrateFlow(currentPct: number, targetWall: number, measuredWall: number): number | null {
  if (currentPct <= 0 || targetWall <= 0 || measuredWall <= 0) return null;
  return currentPct * (targetWall / measuredWall);
}

/** Volumetric flow (mm³/s) = layer height × line width × print speed (mm/s). */
export function volumetricFlow(layerHeight: number, lineWidth: number, speedMmS: number): number | null {
  if (layerHeight <= 0 || lineWidth <= 0 || speedMmS <= 0) return null;
  return layerHeight * lineWidth * speedMmS;
}

/** Max print speed (mm/s) a hotend's volumetric limit allows for a given line. */
export function maxSpeedForFlow(maxFlowMm3s: number, layerHeight: number, lineWidth: number): number | null {
  if (maxFlowMm3s <= 0 || layerHeight <= 0 || lineWidth <= 0) return null;
  return maxFlowMm3s / (layerHeight * lineWidth);
}

/** Reference resin density (g/mL) for SLA/MSLA photopolymer. Brands vary. */
export const RESIN_DENSITY = 1.10; // typical standard photopolymer ~1.05–1.25 (Formlabs standard ~1.08)

/** Resin cost + weight for a print volume (mL). */
export function resinCost(volumeMl: number, pricePerLitre: number, density = RESIN_DENSITY, wastePct = 0): { volumeMl: number; weightG: number; cost: number } | null {
  if (volumeMl < 0 || pricePerLitre < 0 || density <= 0 || wastePct < 0) return null;
  const total = volumeMl * (1 + wastePct / 100);
  return { volumeMl: total, weightG: total * density, cost: (total / 1000) * pricePerLitre };
}
