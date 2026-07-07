/**
 * NRF 4-5-4 retail calendar (deterministic, date-only, all local).
 *
 * Rules (National Retail Federation): retail weeks run Sunday–Saturday; the
 * retail year ends on the Saturday nearest to January 31 and begins the next
 * day. Quarters are 13 weeks split into months of 4, 5 and 4 weeks (Q1 = Feb,
 * Mar, Apr; Q2 = May, Jun, Jul; Q3 = Aug, Sep, Oct; Q4 = Nov, Dec, Jan). When
 * the 52-week (364-day) layout leaves ≥4 days of January uncovered, a 53rd week
 * is added to the final retail month (January). Uses UTC to stay DST-immune.
 */

const DAY = 86_400_000;

/** The Saturday nearest to January 31 of `year` (within ±3 days). */
function nearestSaturdayToJan31(year: number): number {
  const jan31 = Date.UTC(year, 0, 31);
  const dow = new Date(jan31).getUTCDay(); // 0 Sun … 6 Sat
  const offset = (((6 - dow + 3) % 7) - 3); // snap to nearest Saturday, range [-3, +3]
  return jan31 + offset * DAY;
}

/** UTC ms for the first day (Sunday) of retail fiscal year N. */
export function retailYearStart(fy: number): number {
  return nearestSaturdayToJan31(fy) + DAY;
}

/** UTC ms for the last day (Saturday) of retail fiscal year N. */
export function retailYearEnd(fy: number): number {
  return nearestSaturdayToJan31(fy + 1);
}

/** 52 or 53. */
export function weeksInRetailYear(fy: number): number {
  return Math.round((retailYearEnd(fy) - retailYearStart(fy) + DAY) / (7 * DAY));
}

export function is53WeekYear(fy: number): boolean {
  return weeksInRetailYear(fy) === 53;
}

export const RETAIL_MONTHS = ['February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January'];

/** Which week of each 13-week quarter holds the 5-week month. */
export type RetailPattern = '4-5-4' | '4-4-5' | '5-4-4';

export const RETAIL_PATTERNS: { id: RetailPattern; label: string; quarter: [number, number, number]; note: string }[] = [
  { id: '4-5-4', label: '4-5-4 (NRF default)', quarter: [4, 5, 4], note: '5-week month in the middle of each quarter' },
  { id: '4-4-5', label: '4-4-5', quarter: [4, 4, 5], note: '5-week month at the end of each quarter' },
  { id: '5-4-4', label: '5-4-4', quarter: [5, 4, 4], note: '5-week month at the start of each quarter' },
];

/** Weeks per retail month: the chosen pattern repeated over 4 quarters; the 53rd week (if any) lands in the last month. */
export function monthWeekPattern(fy: number, pattern: RetailPattern = '4-5-4'): number[] {
  const q = RETAIL_PATTERNS.find((p) => p.id === pattern)!.quarter;
  const out = [...q, ...q, ...q, ...q];
  if (is53WeekYear(fy)) out[11] += 1;
  return out;
}

export interface RetailMonth {
  index: number; // 1–12
  name: string;
  quarter: number; // 1–4
  weeks: number; // 4 or 5
  start: Date;
  end: Date;
  /** which retail week-of-year this month starts on (1-based) */
  startWeek: number;
}

export function retailMonths(fy: number, pat: RetailPattern = '4-5-4'): RetailMonth[] {
  const pattern = monthWeekPattern(fy, pat);
  const start = retailYearStart(fy);
  const out: RetailMonth[] = [];
  let cursorWeek = 0;
  for (let i = 0; i < 12; i++) {
    const weeks = pattern[i]!;
    const mStart = start + cursorWeek * 7 * DAY;
    const mEnd = mStart + (weeks * 7 - 1) * DAY;
    out.push({
      index: i + 1,
      name: RETAIL_MONTHS[i]!,
      quarter: Math.floor(i / 3) + 1,
      weeks,
      start: new Date(mStart),
      end: new Date(mEnd),
      startWeek: cursorWeek + 1,
    });
    cursorWeek += weeks;
  }
  return out;
}

export interface RetailPosition {
  fy: number;
  quarter: number;
  monthIndex: number;
  monthName: string;
  weekOfYear: number; // 1–52/53
  weekOfMonth: number; // 1–5
  weekOfQuarter: number; // 1–13/14
  dayOfWeek: string;
  yearStart: Date;
  yearEnd: Date;
  weeksInYear: number;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Map a Gregorian date (local Y/M/D) to its retail position under the chosen pattern. */
export function toRetailPosition(year: number, month0: number, day: number, pat: RetailPattern = '4-5-4'): RetailPosition {
  const d = Date.UTC(year, month0, day);
  // pick the fiscal year whose span contains d
  let fy = year;
  if (d < retailYearStart(fy)) fy -= 1;
  else if (d > retailYearEnd(fy)) fy += 1;

  const start = retailYearStart(fy);
  const weekOfYear = Math.floor((d - start) / (7 * DAY)) + 1;

  const months = retailMonths(fy, pat);
  const m = months.find((mo) => d >= mo.start.getTime() && d <= mo.end.getTime())!;
  const weekOfMonth = Math.floor((d - m.start.getTime()) / (7 * DAY)) + 1;
  const quarterStartWeek = (m.quarter - 1) * 13 + 1;

  return {
    fy,
    quarter: m.quarter,
    monthIndex: m.index,
    monthName: m.name,
    weekOfYear,
    weekOfMonth,
    weekOfQuarter: weekOfYear - quarterStartWeek + 1,
    dayOfWeek: WEEKDAYS[new Date(d).getUTCDay()]!,
    yearStart: new Date(start),
    yearEnd: new Date(retailYearEnd(fy)),
    weeksInYear: weeksInRetailYear(fy),
  };
}

export function fmtUTCDate(d: Date): string {
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export function fmtUTCShort(d: Date): string {
  return d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
}
