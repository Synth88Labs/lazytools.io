/** Date & Time compute helpers — pure functions, all local. */

/** Parse an epoch input; auto-detects seconds vs milliseconds. */
export function parseEpoch(raw: string): { date: Date; unit: 'seconds' | 'milliseconds' } | null {
  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return null;
  // 1e11 seconds ≈ year 5138; anything larger is almost certainly milliseconds
  const isMs = Math.abs(n) > 1e11;
  const date = new Date(isMs ? n : n * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return { date, unit: isMs ? 'milliseconds' : 'seconds' };
}

export interface DateDiff {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  weekdays: number;
  weekendDays: number;
  totalWeeks: number;
  remainderDays: number;
}

/** Calendar-aware difference between two dates (from ≤ to). */
export function diffDates(from: Date, to: Date): DateDiff {
  let a = from, b = to;
  if (a > b) [a, b] = [b, a];

  // Calendar breakdown: years, then months, then days
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months -= 1;
    // days in the month preceding b
    days += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const msPerDay = 86_400_000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  const totalDays = Math.round((utcB - utcA) / msPerDay);

  // Weekday count over [a, b) — exclusive of the end date
  let weekdays = 0;
  const fullWeeks = Math.floor(totalDays / 7);
  weekdays = fullWeeks * 5;
  const startDow = new Date(utcA).getUTCDay();
  for (let i = fullWeeks * 7; i < totalDays; i++) {
    const dow = (startDow + i) % 7;
    if (dow !== 0 && dow !== 6) weekdays++;
  }

  return {
    years,
    months,
    days,
    totalDays,
    weekdays,
    weekendDays: totalDays - weekdays,
    totalWeeks: Math.floor(totalDays / 7),
    remainderDays: totalDays % 7,
  };
}

/** Add (or subtract, via negative amounts) to a date. Months clamp to end-of-month. */
export function addToDate(base: Date, amount: number, unit: 'days' | 'weeks' | 'months' | 'years'): Date {
  const d = new Date(base.getTime());
  if (unit === 'days') d.setDate(d.getDate() + amount);
  else if (unit === 'weeks') d.setDate(d.getDate() + amount * 7);
  else {
    const targetMonth = unit === 'months' ? d.getMonth() + amount : d.getMonth();
    const targetYear = unit === 'years' ? d.getFullYear() + amount : d.getFullYear();
    const day = d.getDate();
    d.setFullYear(targetYear, targetMonth, 1);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
  }
  return d;
}

/** ISO 8601 week number (weeks start Monday; week 1 contains the first Thursday). */
export function isoWeek(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dow = d.getUTCDay() || 7; // Monday = 1 … Sunday = 7
  d.setUTCDate(d.getUTCDate() + 4 - dow); // move to the Thursday of this ISO week
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

/** Format a date in a given IANA timezone. */
export function formatInZone(date: Date, timeZone: string): { formatted: string; offset: string } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const offsetFmt = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' });
  const offsetPart = offsetFmt.formatToParts(date).find((p) => p.type === 'timeZoneName');
  return { formatted: fmt.format(date), offset: offsetPart?.value ?? '' };
}

/** Convert a wall-clock time in one zone to the equivalent instant. */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): Date | null {
  const [y, mo, da] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  if (!y || !mo || !da || h === undefined || mi === undefined) return null;
  // Iterative: guess UTC, measure what wall-clock it produces in the zone, correct.
  let guess = Date.UTC(y, mo - 1, da, h, mi);
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date(guess));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
    const produced = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'));
    const wanted = Date.UTC(y, mo - 1, da, h, mi);
    if (produced === wanted) break;
    guess += wanted - produced;
  }
  return new Date(guess);
}

/** Common IANA timezones for the picker. */
export const TIMEZONES: { id: string; label: string }[] = [
  { id: 'Pacific/Honolulu', label: 'Honolulu (Hawaii)' },
  { id: 'America/Anchorage', label: 'Anchorage (Alaska)' },
  { id: 'America/Los_Angeles', label: 'Los Angeles (Pacific)' },
  { id: 'America/Denver', label: 'Denver (Mountain)' },
  { id: 'America/Chicago', label: 'Chicago (Central)' },
  { id: 'America/New_York', label: 'New York (Eastern)' },
  { id: 'America/Sao_Paulo', label: 'São Paulo' },
  { id: 'UTC', label: 'UTC' },
  { id: 'Europe/London', label: 'London' },
  { id: 'Europe/Paris', label: 'Paris / Berlin / Madrid' },
  { id: 'Europe/Athens', label: 'Athens / Helsinki' },
  { id: 'Europe/Moscow', label: 'Moscow' },
  { id: 'Asia/Dubai', label: 'Dubai' },
  { id: 'Asia/Karachi', label: 'Karachi' },
  { id: 'Asia/Kolkata', label: 'India (IST)' },
  { id: 'Asia/Kathmandu', label: 'Kathmandu' },
  { id: 'Asia/Dhaka', label: 'Dhaka' },
  { id: 'Asia/Bangkok', label: 'Bangkok / Jakarta' },
  { id: 'Asia/Shanghai', label: 'China (Beijing)' },
  { id: 'Asia/Singapore', label: 'Singapore / Hong Kong' },
  { id: 'Asia/Tokyo', label: 'Tokyo / Seoul' },
  { id: 'Australia/Sydney', label: 'Sydney' },
  { id: 'Pacific/Auckland', label: 'Auckland' },
];

/** yyyy-mm-dd for <input type="date"> values, in local time. */
export function toDateInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromDateInputValue(s: string): Date | null {
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/* ---------------- Business (working) days ---------------- */

export interface BusinessDaysResult {
  totalDays: number;
  weekdays: number;
  weekendDays: number;
  businessDays: number;
}
/**
 * Count business (working) days between two ISO dates (YYYY-MM-DD), inclusive
 * of both endpoints. Weekdays are Mon–Fri; an optional whole-number `holidays`
 * count (that fall on weekdays) is subtracted. Order-independent. Uses UTC to
 * avoid timezone drift.
 */
export function businessDays(startISO: string, endISO: string, holidays = 0): BusinessDaysResult | null {
  const MS = 86400000;
  const s0 = new Date(`${startISO}T00:00:00Z`).getTime();
  const e0 = new Date(`${endISO}T00:00:00Z`).getTime();
  if (!Number.isFinite(s0) || !Number.isFinite(e0)) return null;
  const s = Math.min(s0, e0);
  const e = Math.max(s0, e0);
  const totalDays = Math.round((e - s) / MS) + 1;
  let weekdays = 0;
  for (let t = s; t <= e; t += MS) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) weekdays++;
  }
  const h = Math.max(0, Math.floor(holidays));
  return { totalDays, weekdays, weekendDays: totalDays - weekdays, businessDays: Math.max(0, weekdays - h) };
}

/* ---------------- Duration between two clock times ---------------- */

export interface TimeBetweenResult {
  totalMinutes: number;
  hours: number;
  minutes: number;
  decimalHours: number;
}
/**
 * Duration between two 24-hour clock times "HH:MM". If the end is earlier than
 * the start (or `overnight` is set), it's treated as crossing midnight and 24 h
 * is added. Returns total minutes plus an h:m and decimal-hours breakdown.
 */
export function timeBetween(startHHMM: string, endHHMM: string, overnight = false): TimeBetweenResult | null {
  const parse = (s: string): number | null => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
    if (!m) return null;
    const h = +m[1], min = +m[2];
    if (h > 23 || min > 59) return null;
    return h * 60 + min;
  };
  const a = parse(startHHMM), b = parse(endHHMM);
  if (a == null || b == null) return null;
  let diff = b - a;
  if (diff < 0 || overnight) diff += 1440;
  return { totalMinutes: diff, hours: Math.floor(diff / 60), minutes: diff % 60, decimalHours: diff / 60 };
}

/* ---------------- Day of year ---------------- */

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export interface DayOfYearResult {
  dayOfYear: number;   // 1-based ordinal (Jan 1 = 1)
  daysInYear: number;
  daysRemaining: number; // after this day, to Dec 31 inclusive of Dec 31
  percentElapsed: number; // 0–100, share of the year completed at end of this day
  weekday: string;
}
/** Ordinal day-of-year for a local Date, plus days remaining and % of year. */
export function dayOfYear(date: Date): DayOfYearResult {
  const year = date.getFullYear();
  const start = new Date(year, 0, 1);
  const diff = Math.round((date.getTime() - start.getTime()) / 86400000);
  const doy = diff + 1;
  const total = daysInYear(year);
  return {
    dayOfYear: doy,
    daysInYear: total,
    daysRemaining: total - doy,
    percentElapsed: Math.round((doy / total) * 1000) / 10,
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

/* ---------------- Weekday of a date ---------------- */

export interface WeekdayResult {
  weekday: string;     // e.g. "Monday"
  isoDow: number;      // 1 = Monday … 7 = Sunday
  isWeekend: boolean;
  daysFromToday: number | null; // signed, based on the caller-supplied today (local midnight)
}
/** The day of the week for a date, and its signed day-offset from `today`. */
export function weekdayInfo(date: Date, today?: Date): WeekdayResult {
  const jsDow = date.getDay(); // 0=Sun..6=Sat
  const isoDow = jsDow === 0 ? 7 : jsDow;
  let daysFromToday: number | null = null;
  if (today) {
    const a = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const b = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    daysFromToday = Math.round((a - b) / 86400000);
  }
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
    isoDow,
    isWeekend: jsDow === 0 || jsDow === 6,
    daysFromToday,
  };
}

/* ---------------- Add business days ---------------- */

/**
 * Add (or subtract, for negative n) `n` business days to a start date, skipping
 * Saturdays and Sundays. The start day itself is not counted; the result is the
 * date reached after moving n working days. Returns a local Date.
 */
export function addBusinessDays(start: Date, n: number): Date {
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  if (n === 0) return d;
  const step = n > 0 ? 1 : -1;
  let remaining = Math.abs(n);
  while (remaining > 0) {
    d.setDate(d.getDate() + step);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) remaining--;
  }
  return d;
}
