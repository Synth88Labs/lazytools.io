/**
 * Calendar-system conversions. Forward (Gregorian -> other) uses the browser's
 * own ICU/CLDR calendar data via Intl — the same authoritative source operating
 * systems use — so no calendar algorithm is invented. Reverse (other ->
 * Gregorian) inverts Intl by binary search over the Gregorian day number, which
 * is exact because each calendar's (year, month, day) tuple is monotonic in
 * time. Julian calendar and Julian Day Number use the standard integer
 * algorithms (validated). All date-only, computed in UTC to stay DST-immune.
 */

const DAY = 86_400_000;

export interface CalendarSystem {
  id: string; // Intl `ca` value, or 'julian' / 'jdn'
  name: string;
  note: string;
  /** era/suffix hint shown in the UI, e.g. "AH", "AM" */
  eraHint?: string;
  reversible: boolean;
  /** months in a common year (for the reverse month hint); undefined = variable */
  months?: number;
}

export const CALENDAR_SYSTEMS: CalendarSystem[] = [
  { id: 'gregory', name: 'Gregorian', note: 'The civil calendar used worldwide.', reversible: false, months: 12 },
  { id: 'islamic-umalqura', name: 'Islamic (Umm al-Qura)', note: 'Saudi civil Hijri calendar — the common "Hijri date".', eraHint: 'AH', reversible: true, months: 12 },
  { id: 'islamic-civil', name: 'Islamic (tabular)', note: 'Arithmetic Hijri calendar (no moon sighting).', eraHint: 'AH', reversible: true, months: 12 },
  { id: 'persian', name: 'Persian (Solar Hijri)', note: 'Iranian/Jalali calendar; new year at the spring equinox (Nowruz).', eraHint: 'SH', reversible: true, months: 12 },
  { id: 'hebrew', name: 'Hebrew', note: 'Jewish lunisolar calendar; leap years add a 13th month (Adar I/II).', eraHint: 'AM', reversible: false },
  { id: 'indian', name: 'Indian National (Saka)', note: 'Official civil calendar of India.', eraHint: 'Saka', reversible: true, months: 12 },
  { id: 'buddhist', name: 'Buddhist (Thai)', note: 'Thai solar calendar; year = Gregorian + 543.', eraHint: 'BE', reversible: true, months: 12 },
  { id: 'coptic', name: 'Coptic', note: 'Egyptian Christian calendar; 12 months of 30 days + a short 13th.', eraHint: 'AM', reversible: true },
  { id: 'ethiopic', name: 'Ethiopian', note: 'Calendar of Ethiopia; ~7–8 years behind Gregorian.', eraHint: 'EE', reversible: true },
  { id: 'roc', name: 'Minguo (ROC)', note: 'Taiwan calendar; year = Gregorian − 1911.', reversible: true, months: 12 },
  { id: 'japanese', name: 'Japanese (era)', note: 'Gregorian months with Japanese era years (Reiwa…).', reversible: false, months: 12 },
  { id: 'chinese', name: 'Chinese', note: 'Traditional lunisolar calendar (display only — has leap months).', reversible: false },
  { id: 'julian', name: 'Julian', note: 'The pre-1582 Western calendar; now ~13 days behind Gregorian.', reversible: true, months: 12 },
  { id: 'jdn', name: 'Julian Day Number', note: 'Continuous day count used in astronomy (day changes at noon UT).', reversible: true },
];

const partsCache = new Map<string, Intl.DateTimeFormat>();
function partsFmt(caId: string): Intl.DateTimeFormat {
  let f = partsCache.get(caId);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US-u-ca-' + caId, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' });
    partsCache.set(caId, f);
  }
  return f;
}
const longCache = new Map<string, Intl.DateTimeFormat>();
function longFmt(caId: string): Intl.DateTimeFormat {
  let f = longCache.get(caId);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US-u-ca-' + caId, { dateStyle: 'long', timeZone: 'UTC' });
    longCache.set(caId, f);
  }
  return f;
}

// ---- Julian Day Number (integer, date at noon) ----
export function gregorianToJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
export function julianToJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - 32083;
}
export function gregorianFromJDN(jdn: number): { y: number; m: number; d: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const dd = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * dd) / 4);
  const mm = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * mm + 2) / 5) + 1;
  const month = mm + 3 - 12 * Math.floor(mm / 10);
  const year = 100 * b + dd - 4800 + Math.floor(mm / 10);
  return { y: year, m: month, d: day };
}
export function julianFromJDN(jdn: number): { y: number; m: number; d: number } {
  // Richards algorithm, Julian branch
  const f = jdn + 1401;
  const e = 4 * f + 3;
  const g = Math.floor((((e % 1461) + 1461) % 1461) / 4);
  const h = 5 * g + 2;
  const day = Math.floor((((h % 153) + 153) % 153) / 5) + 1;
  const month = ((Math.floor(h / 153) + 2) % 12) + 1;
  const year = Math.floor(e / 1461) - 4716 + Math.floor((14 - month) / 12);
  return { y: year, m: month, d: day };
}

/** Gregorian UTC ms -> that date's noon JDN. */
function dateToJDN(ms: number): number {
  const d = new Date(ms);
  return gregorianToJDN(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}
function jdnToDateMs(jdn: number): number {
  const { y, m, d } = gregorianFromJDN(jdn);
  return Date.UTC(y, m - 1, d);
}

export interface CalendarValue {
  long: string;
  year: number;
  month: number;
  day: number;
}

/** Forward: a Gregorian instant expressed in calendar `caId`. */
export function toCalendar(ms: number, caId: string): CalendarValue {
  if (caId === 'jdn') {
    const jdn = dateToJDN(ms);
    return { long: `JDN ${jdn}`, year: jdn, month: 0, day: 0 };
  }
  if (caId === 'julian') {
    const { y, m, d } = julianFromJDN(dateToJDN(ms));
    const name = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1];
    return { long: `${d} ${name} ${y}${y <= 0 ? ' BC' : ''} (Julian)`, year: y, month: m, day: d };
  }
  const date = new Date(ms);
  const parts = partsFmt(caId).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return {
    long: longFmt(caId).format(date),
    year: parseInt(get('year').replace(/[^\d-]/g, ''), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
  };
}

/** Reverse: a (year, month, day) in calendar `caId` -> Gregorian UTC ms. */
export function fromCalendar(caId: string, y: number, m: number, d: number): number | null {
  if (caId === 'jdn') return jdnToDateMs(y); // 'y' carries the JDN
  if (caId === 'julian') return jdnToDateMs(julianToJDN(y, m, d));
  if (caId === 'gregory') {
    const ms = Date.UTC(y, m - 1, d);
    return Number.isNaN(ms) ? null : ms;
  }
  // generic inversion: binary search on Gregorian day number
  const target = y * 10000 + m * 100 + d;
  const cmpAt = (ms: number) => {
    const v = toCalendar(ms, caId);
    return v.year * 10000 + v.month * 100 + v.day - target;
  };
  // bracket: estimate a Gregorian year, search ±2 years of days
  const estGregYear = estimateGregorianYear(caId, y);
  let lo = Date.UTC(estGregYear - 2, 0, 1);
  let hi = Date.UTC(estGregYear + 2, 11, 31);
  // expand if the target lies outside the initial bracket
  let guard = 0;
  while (cmpAt(lo) > 0 && guard++ < 6) lo -= 400 * DAY;
  guard = 0;
  while (cmpAt(hi) < 0 && guard++ < 6) hi += 400 * DAY;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / (2 * DAY)) * DAY;
    const c = cmpAt(mid);
    if (c === 0) return mid;
    if (c < 0) lo = mid + DAY;
    else hi = mid - DAY;
  }
  return null;
}

function estimateGregorianYear(caId: string, calYear: number): number {
  switch (caId) {
    case 'islamic-umalqura':
    case 'islamic-civil':
      return Math.round(calYear * 0.970224 + 621.5);
    case 'persian':
      return calYear + 621;
    case 'indian':
      return calYear + 78;
    case 'buddhist':
      return calYear - 543;
    case 'roc':
      return calYear + 1911;
    case 'hebrew':
      return calYear - 3760;
    case 'coptic':
      return calYear + 284;
    case 'ethiopic':
      return calYear + 7;
    default:
      return calYear;
  }
}

// ---- helpers ----
export function isGregorianLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
export function isJulianLeapYear(y: number): boolean {
  return ((y % 4) + 4) % 4 === 0;
}
export function gregorianLeapReason(y: number): string {
  if (y % 400 === 0) return `${y} is divisible by 400 → leap year (the century exception's exception).`;
  if (y % 100 === 0) return `${y} is divisible by 100 but not 400 → common year (the century rule).`;
  if (y % 4 === 0) return `${y} is divisible by 4 (and not by 100) → leap year.`;
  return `${y} is not divisible by 4 → common year.`;
}

export function toDateInput(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
export function fromDateInput(s: string): number | null {
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return Date.UTC(y, m - 1, d);
}
export function weekdayUTC(ms: number): string {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: 'UTC' }).format(new Date(ms));
}
