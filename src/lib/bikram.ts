/**
 * Bikram Sambat (Nepali) ⇄ Gregorian (AD) conversion.
 *
 * Bikram Sambat is not in the browser's Intl/ICU data — its month lengths are
 * astronomically determined and published in official tables rather than
 * derived by a formula — so this wraps @remotemerge/nepali-date-converter,
 * whose tabulated data is validated across its whole range (1975–2099 BS ≈
 * 1918–2043 AD). Verified against known anchors (1 Baishakh 2081 BS =
 * 13 April 2024 AD).
 */
import DateConverter from '@remotemerge/nepali-date-converter';

/** Romanised Nepali month names, index 0 = Baishakh (BS month 1). */
export const BS_MONTHS = [
  'Baishakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
];

export const BS_RANGE = { minYear: 1975, maxYear: 2099 };
export const AD_RANGE = { minYear: 1918, maxYear: 2043 };

export interface ConvResult {
  year: number;
  month: number; // 1–12
  day: number; // day of month
  weekday: string;
  monthName: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

function shape(r: { year: number; month: number; date: number; day: string }, bs: boolean): ConvResult {
  return {
    year: r.year,
    month: r.month,
    day: r.date,
    weekday: r.day,
    monthName: bs ? BS_MONTHS[r.month - 1] ?? '' : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][r.month - 1] ?? '',
  };
}

/** Gregorian (AD) → Bikram Sambat. Returns null if outside the supported range. */
export function adToBs(y: number, m: number, d: number): ConvResult | null {
  try {
    const r = new DateConverter(`${y}-${pad(m)}-${pad(d)}`).toBs() as { year: number; month: number; date: number; day: string };
    return shape(r, true);
  } catch {
    return null;
  }
}

/** Bikram Sambat → Gregorian (AD). Returns null if outside the supported range or an invalid BS date. */
export function bsToAd(y: number, m: number, d: number): ConvResult | null {
  try {
    const r = new DateConverter(`${y}-${pad(m)}-${pad(d)}`).toAd() as { year: number; month: number; date: number; day: string };
    return shape(r, false);
  } catch {
    return null;
  }
}
