/**
 * Home & DIY math — staircase geometry, wall-stud counts and room AC sizing.
 * Pure geometry plus widely-published sizing conventions (IRC stair limits,
 * ENERGY STAR ~20 BTU/ft²). Node-tested in scripts/test-home.ts.
 */

/** Staircase from a total rise. Lengths share one unit (in or cm); treadDepth is the going per step. */
export function stairs(totalRise: number, targetRiser: number, treadDepth: number) {
  if (totalRise <= 0 || targetRiser <= 0 || treadDepth <= 0) return null;
  const risers = Math.max(1, Math.round(totalRise / targetRiser));
  const actualRiser = totalRise / risers;
  const treads = risers - 1;
  const run = treads * treadDepth;
  const stringer = Math.sqrt(totalRise * totalRise + run * run);
  return { risers, actualRiser, treads, run, stringer };
}

/** Studs for a wall: ceil(length ÷ spacing) + 1, plus optional extras for corners/openings. */
export function studCount(wallLength: number, spacing: number, extras = 0) {
  if (wallLength <= 0 || spacing <= 0) return null;
  return { studs: Math.ceil(wallLength / spacing) + 1 + Math.max(0, extras) };
}

export interface CoolingOpts { sun?: 'sunny' | 'shaded' | 'normal'; occupants?: number; kitchen?: boolean }
/** Cooling BTU/h for a room: ~20 BTU/ft² (ENERGY STAR) with sun, occupancy and kitchen adjustments. */
export function coolingBtu(areaSqft: number, opts: CoolingOpts = {}): number | null {
  if (areaSqft <= 0) return null;
  let btu = areaSqft * 20;
  if (opts.sun === 'sunny') btu *= 1.1;
  else if (opts.sun === 'shaded') btu *= 0.9;
  btu += Math.max(0, (opts.occupants ?? 1) - 2) * 600;
  if (opts.kitchen) btu += 4000;
  return Math.round(btu / 50) * 50;
}

/* ---------------- Wheelchair / ADA ramp ---------------- */

export interface RampResult {
  run: number;       // horizontal run, same unit as rise
  length: number;    // sloped ramp length (hypotenuse), same unit
  angleDeg: number;  // incline angle in degrees
  adaCompliant: boolean; // true if slope ≤ 1:12
}
/**
 * Ramp geometry from a vertical rise and a slope ratio (1:ratio). Run = rise ×
 * ratio; ramp length = √(rise² + run²). The ADA maximum for wheelchair ramps is
 * 1:12 (about 4.76°), so a ratio ≥ 12 is compliant. Rise and run share a unit.
 */
export function rampLength(rise: number, ratio: number): RampResult | null {
  if (rise <= 0 || ratio <= 0) return null;
  const run = rise * ratio;
  const length = Math.sqrt(rise * rise + run * run);
  const angleDeg = (Math.atan(rise / run) * 180) / Math.PI;
  return { run, length, angleDeg, adaCompliant: ratio >= 12 };
}

/* ---------------- Firewood (cords) ---------------- */

export interface FirewoodResult {
  cubicFeet: number;
  cords: number;      // full cords (128 ft³)
  faceCords16: number; // face cords assuming 16-inch logs
}
/**
 * Firewood stack volume in cords. A full cord is a stack 4 ft × 4 ft × 8 ft =
 * 128 cubic feet. Inputs are the stack's length, height and depth in feet.
 * Also gives face cords for 16-inch logs (a face cord is 8×4 ft by the log
 * length, so a 16-inch/1.333-ft depth face cord ≈ 42.67 ft³).
 */
export function firewoodCords(lengthFt: number, heightFt: number, depthFt: number): FirewoodResult | null {
  if (lengthFt <= 0 || heightFt <= 0 || depthFt <= 0) return null;
  const cubicFeet = lengthFt * heightFt * depthFt;
  return { cubicFeet, cords: cubicFeet / 128, faceCords16: cubicFeet / (8 * 4 * (16 / 12)) };
}
