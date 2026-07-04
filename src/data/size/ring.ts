/**
 * International ring size chart (ISO 8653 defines EU size = inner circumference in mm).
 * US/UK letter mapping follows the standard jewelers' conversion chart:
 * US 3 = UK F, each half-US-size = one UK letter step.
 * Diameter/circumference: US 3 = 14.07 mm dia; +0.41 mm per half size.
 */

export interface RingRow {
  us: number;
  uk: string;
  /** inner diameter, mm */
  diameter: number;
  /** inner circumference, mm — also the EU/ISO size */
  circumference: number;
}

const UK_LETTERS = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const RING_ROWS: RingRow[] = UK_LETTERS.map((uk, i) => {
  const us = 3 + i * 0.5;
  const diameter = +(14.07 + i * 0.41).toFixed(2);
  const circumference = +(diameter * Math.PI).toFixed(1);
  return { us, uk, diameter, circumference };
});

export function nearestRingByCircumference(circMm: number): RingRow {
  return RING_ROWS.reduce((best, row) =>
    Math.abs(row.circumference - circMm) < Math.abs(best.circumference - circMm) ? row : best
  );
}

export function nearestRingByDiameter(diaMm: number): RingRow {
  return RING_ROWS.reduce((best, row) =>
    Math.abs(row.diameter - diaMm) < Math.abs(best.diameter - diaMm) ? row : best
  );
}
