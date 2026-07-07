/** Timezone city-pair landing pages (issue #6) — data + pure Intl helpers, no tz DB shipped. */

export interface Zone {
  /** search abbreviation, lowercase (ist, est, gmt…) */
  abbr: string;
  /** IANA identifier resolved by the browser's own tz data */
  iana: string;
  /** short display label */
  label: string;
  /** representative cities */
  cities: string;
}

/** Abbreviation → zone. Abbreviations are ambiguous; we pick the most-searched meaning and label it clearly. */
export const ZONES: Record<string, Zone> = {
  ist: { abbr: 'ist', iana: 'Asia/Kolkata', label: 'India (IST)', cities: 'Mumbai, Delhi, Bengaluru' },
  est: { abbr: 'est', iana: 'America/New_York', label: 'US Eastern (ET)', cities: 'New York, Toronto, Atlanta' },
  cst: { abbr: 'cst', iana: 'America/Chicago', label: 'US Central (CT)', cities: 'Chicago, Dallas, Mexico City' },
  mst: { abbr: 'mst', iana: 'America/Denver', label: 'US Mountain (MT)', cities: 'Denver, Phoenix, Salt Lake City' },
  pst: { abbr: 'pst', iana: 'America/Los_Angeles', label: 'US Pacific (PT)', cities: 'Los Angeles, San Francisco, Seattle' },
  gmt: { abbr: 'gmt', iana: 'Europe/London', label: 'UK (GMT/BST)', cities: 'London, Dublin, Lisbon' },
  cet: { abbr: 'cet', iana: 'Europe/Paris', label: 'Central Europe (CET/CEST)', cities: 'Paris, Berlin, Madrid' },
  gst: { abbr: 'gst', iana: 'Asia/Dubai', label: 'Gulf (GST)', cities: 'Dubai, Abu Dhabi' },
  sgt: { abbr: 'sgt', iana: 'Asia/Singapore', label: 'Singapore (SGT)', cities: 'Singapore, Kuala Lumpur' },
  jst: { abbr: 'jst', iana: 'Asia/Tokyo', label: 'Japan (JST)', cities: 'Tokyo, Osaka, Seoul' },
  aest: { abbr: 'aest', iana: 'Australia/Sydney', label: 'Australia Eastern (AEST/AEDT)', cities: 'Sydney, Melbourne, Brisbane' },
};

/** Top ~20 searched pairs. Slug is `${a}-to-${b}`; each page covers both directions. */
export const ZONE_PAIRS: [string, string][] = [
  ['ist', 'est'],
  ['ist', 'pst'],
  ['ist', 'gmt'],
  ['ist', 'cst'],
  ['ist', 'cet'],
  ['ist', 'sgt'],
  ['ist', 'jst'],
  ['ist', 'aest'],
  ['ist', 'gst'],
  ['est', 'pst'],
  ['est', 'gmt'],
  ['est', 'cst'],
  ['est', 'cet'],
  ['est', 'ist'],
  ['pst', 'gmt'],
  ['pst', 'cst'],
  ['pst', 'jst'],
  ['gmt', 'cet'],
  ['gmt', 'aest'],
  ['cet', 'jst'],
];

export interface PairDef {
  slug: string;
  a: Zone;
  b: Zone;
}

export function allPairs(): PairDef[] {
  const seen = new Set<string>();
  const out: PairDef[] = [];
  for (const [x, y] of ZONE_PAIRS) {
    const a = ZONES[x], b = ZONES[y];
    if (!a || !b) continue;
    const key = [x, y].sort().join('|');
    if (seen.has(key)) continue; // drop accidental reverse-duplicates
    seen.add(key);
    out.push({ slug: `${x}-to-${y}`, a, b });
  }
  return out;
}

export function pairFromSlug(slug: string): PairDef | undefined {
  return allPairs().find((p) => p.slug === slug);
}

/** UTC offset in minutes for an IANA zone at a given instant (DST-correct, via Intl). */
export function offsetMinutes(iana: string, date: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: iana,
    timeZoneName: 'longOffset',
  }).formatToParts(date);
  const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+0';
  const m = raw.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (parseInt(m[2]!, 10) * 60 + parseInt(m[3] ?? '0', 10));
}

/** Signed hour difference b − a at `date` (e.g. IST vs EST ≈ +9.5). */
export function hourDifference(a: string, b: string, date: Date): number {
  return (offsetMinutes(b, date) - offsetMinutes(a, date)) / 60;
}

/** Whether a zone observes DST at all (Jan and Jul offsets differ). */
export function observesDst(iana: string, year: number): boolean {
  const jan = offsetMinutes(iana, new Date(Date.UTC(year, 0, 1)));
  const jul = offsetMinutes(iana, new Date(Date.UTC(year, 6, 1)));
  return jan !== jul;
}

export function fmtOffset(mins: number): string {
  const sign = mins < 0 ? '−' : '+';
  const abs = Math.abs(mins);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`;
}

export function fmtDiff(hours: number): string {
  if (hours === 0) return 'the same time';
  const sign = hours > 0 ? 'ahead of' : 'behind';
  const abs = Math.abs(hours);
  const h = Math.floor(abs);
  const m = Math.round((abs - h) * 60);
  const hp = h ? `${h} hour${h !== 1 ? 's' : ''}` : '';
  const mp = m ? `${m} minutes` : '';
  return `${[hp, mp].filter(Boolean).join(' ')} ${sign}`;
}
