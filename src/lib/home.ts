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
