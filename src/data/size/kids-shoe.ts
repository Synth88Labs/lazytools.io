/**
 * Children's shoe size conversion (the standard published chart).
 * US kids' sizes run 0C–13.5C ("C" = child), then restart at 1Y–7Y ("Y" = youth).
 * UK ≈ US − 1 (kids), EU is length-based, cm ≈ foot length. Ages are guidance only —
 * children's feet vary widely and grow up to a size per few months when small.
 */

export interface KidsShoeRow {
  /** e.g. "4C" or "1Y" */
  us: string;
  uk: number;
  eu: number;
  cm: number;
  /** typical age range, guidance only */
  age: string;
  group: 'Baby / Toddler' | 'Little Kid' | 'Big Kid';
}

export const KIDS_SHOE_ROWS: KidsShoeRow[] = [
  { us: '2C', uk: 1, eu: 17, cm: 9.5, age: '0–6 mo', group: 'Baby / Toddler' },
  { us: '3C', uk: 2, eu: 18.5, cm: 10.5, age: '6–12 mo', group: 'Baby / Toddler' },
  { us: '4C', uk: 3, eu: 19.5, cm: 11.4, age: '9–18 mo', group: 'Baby / Toddler' },
  { us: '5C', uk: 4, eu: 21, cm: 12.1, age: '1–2 yr', group: 'Baby / Toddler' },
  { us: '6C', uk: 5, eu: 22, cm: 13.0, age: '1.5–2.5 yr', group: 'Baby / Toddler' },
  { us: '7C', uk: 6, eu: 23.5, cm: 13.9, age: '2–3 yr', group: 'Baby / Toddler' },
  { us: '8C', uk: 7, eu: 25, cm: 14.6, age: '2.5–3.5 yr', group: 'Baby / Toddler' },
  { us: '9C', uk: 8, eu: 26, cm: 15.6, age: '3–4 yr', group: 'Little Kid' },
  { us: '10C', uk: 9, eu: 27, cm: 16.5, age: '3.5–4.5 yr', group: 'Little Kid' },
  { us: '11C', uk: 10, eu: 28.5, cm: 17.1, age: '4–5 yr', group: 'Little Kid' },
  { us: '12C', uk: 11, eu: 30, cm: 18.1, age: '5–6 yr', group: 'Little Kid' },
  { us: '13C', uk: 12, eu: 31, cm: 19.0, age: '6–7 yr', group: 'Little Kid' },
  { us: '1Y', uk: 13, eu: 32, cm: 19.7, age: '7–8 yr', group: 'Big Kid' },
  { us: '2Y', uk: 1, eu: 33.5, cm: 20.6, age: '8–9 yr', group: 'Big Kid' },
  { us: '3Y', uk: 2, eu: 35, cm: 21.6, age: '9–10 yr', group: 'Big Kid' },
  { us: '4Y', uk: 3, eu: 36, cm: 22.4, age: '10–11 yr', group: 'Big Kid' },
  { us: '5Y', uk: 4, eu: 37.5, cm: 23.3, age: '11–12 yr', group: 'Big Kid' },
  { us: '6Y', uk: 5, eu: 38.5, cm: 24.1, age: '12–13 yr', group: 'Big Kid' },
  { us: '7Y', uk: 6, eu: 40, cm: 25.0, age: '13+ yr', group: 'Big Kid' },
];

export function nearestKidsShoeByCm(cm: number): KidsShoeRow {
  return KIDS_SHOE_ROWS.reduce((best, row) => (Math.abs(row.cm - cm) < Math.abs(best.cm - cm) ? row : best));
}
