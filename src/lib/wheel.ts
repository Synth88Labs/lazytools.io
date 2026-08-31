/**
 * Pure geometry for a spinning name-picker wheel. Segments are drawn clockwise
 * from the top; a fixed pointer sits at the top (0°). To guarantee the announced
 * winner is exactly the segment under the pointer, we pick the target segment
 * first and compute the rotation that lands it there, rather than reading a
 * segment off a floating-point final angle. Deterministic and unit-testable.
 */

const norm = (deg: number) => ((deg % 360) + 360) % 360;

/** The rotation (degrees, clockwise) that lands segment `index` under the top
 *  pointer, after `turns` full spins. */
export function rotationToLandOn(index: number, count: number, turns = 5): number {
  if (count <= 0) throw new Error('count must be positive');
  const seg = 360 / count;
  const center = index * seg + seg / 2;      // segment centre, measured from top
  return turns * 360 + norm(360 - center);   // extra full turns for the animation
}

/** Which segment sits under the top pointer at a given rotation. Inverse of
 *  rotationToLandOn (ignoring the full-turn count). */
export function winnerIndexAt(rotationDeg: number, count: number): number {
  if (count <= 0) throw new Error('count must be positive');
  const seg = 360 / count;
  const angleAtPointer = norm(360 - norm(rotationDeg)); // original angle now at the top
  return Math.floor(angleAtPointer / seg) % count;
}
