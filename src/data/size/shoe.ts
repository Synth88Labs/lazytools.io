/**
 * Adult shoe size conversion charts (the widely used standard chart;
 * individual brands deviate by up to half a size — foot length in cm is
 * the reliable ground truth, per ISO 19407's Mondopoint approach).
 */

export interface ShoeRow {
  us: number;
  uk: number;
  eu: number;
  /** foot length, cm (≈ JP/Mondopoint size) */
  cm: number;
}

// Men: US 6–14. UK = US − 1; EU and cm per standard chart.
export const SHOE_MEN: ShoeRow[] = [
  { us: 6, uk: 5, eu: 38.5, cm: 24.0 },
  { us: 6.5, uk: 5.5, eu: 39, cm: 24.4 },
  { us: 7, uk: 6, eu: 40, cm: 24.8 },
  { us: 7.5, uk: 6.5, eu: 40.5, cm: 25.2 },
  { us: 8, uk: 7, eu: 41, cm: 25.7 },
  { us: 8.5, uk: 7.5, eu: 42, cm: 26.0 },
  { us: 9, uk: 8, eu: 42.5, cm: 26.5 },
  { us: 9.5, uk: 8.5, eu: 43, cm: 26.9 },
  { us: 10, uk: 9, eu: 44, cm: 27.3 },
  { us: 10.5, uk: 9.5, eu: 44.5, cm: 27.8 },
  { us: 11, uk: 10, eu: 45, cm: 28.2 },
  { us: 11.5, uk: 10.5, eu: 45.5, cm: 28.6 },
  { us: 12, uk: 11, eu: 46, cm: 29.0 },
  { us: 13, uk: 12, eu: 47.5, cm: 29.9 },
  { us: 14, uk: 13, eu: 48.5, cm: 30.7 },
];

// Women: US 5–12. UK = US − 2; EU per standard chart.
export const SHOE_WOMEN: ShoeRow[] = [
  { us: 5, uk: 3, eu: 35.5, cm: 21.6 },
  { us: 5.5, uk: 3.5, eu: 36, cm: 22.0 },
  { us: 6, uk: 4, eu: 36.5, cm: 22.4 },
  { us: 6.5, uk: 4.5, eu: 37, cm: 22.9 },
  { us: 7, uk: 5, eu: 37.5, cm: 23.3 },
  { us: 7.5, uk: 5.5, eu: 38, cm: 23.7 },
  { us: 8, uk: 6, eu: 38.5, cm: 24.1 },
  { us: 8.5, uk: 6.5, eu: 39, cm: 24.6 },
  { us: 9, uk: 7, eu: 40, cm: 25.0 },
  { us: 9.5, uk: 7.5, eu: 40.5, cm: 25.4 },
  { us: 10, uk: 8, eu: 41, cm: 25.9 },
  { us: 10.5, uk: 8.5, eu: 42, cm: 26.2 },
  { us: 11, uk: 9, eu: 42.5, cm: 26.7 },
  { us: 12, uk: 10, eu: 44, cm: 27.6 },
];

export function nearestShoeByCm(rows: ShoeRow[], cm: number): ShoeRow {
  return rows.reduce((best, row) => (Math.abs(row.cm - cm) < Math.abs(best.cm - cm) ? row : best));
}
