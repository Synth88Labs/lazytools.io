/**
 * Hat size conversion. US fitted hat size ≈ head circumference (inches) ÷ π —
 * i.e. the head's "diameter" in inches, in eighths. UK sizes run 1/8 smaller.
 * Letter sizes are the common retail mapping.
 */

export interface HatRow {
  cm: number;
  inches: number;
  us: string;
  uk: string;
  letter: string;
}

const EIGHTH = (v: number): string => {
  const whole = Math.floor(v);
  const frac = Math.round((v - whole) * 8);
  const glyphs: Record<number, string> = { 0: '', 1: '⅛', 2: '¼', 3: '⅜', 4: '½', 5: '⅝', 6: '¾', 7: '⅞' };
  if (frac === 8) return String(whole + 1);
  return `${whole}${glyphs[frac] ?? ''}`;
};

const LETTERS = (cm: number): string =>
  cm <= 53 ? 'XS' : cm <= 55 ? 'S' : cm <= 57 ? 'M' : cm <= 59 ? 'L' : cm <= 61 ? 'XL' : 'XXL';

export const HAT_ROWS: HatRow[] = Array.from({ length: 13 }, (_, i) => {
  const cm = 52 + i;
  const inches = +(cm / 2.54).toFixed(1);
  const usVal = 6.5 + i * 0.125;
  return {
    cm,
    inches,
    us: EIGHTH(usVal),
    uk: EIGHTH(usVal - 0.125),
    letter: LETTERS(cm),
  };
});

export function nearestHatByCm(cm: number): HatRow {
  return HAT_ROWS.reduce((best, row) => (Math.abs(row.cm - cm) < Math.abs(best.cm - cm) ? row : best));
}
