/**
 * Travel & trips math. Pure-geometry tools (great-circle distance via the
 * haversine formula, initial bearing) plus everyday planning helpers (road-trip
 * time, budget split, luggage volume, layover gap) and lightly reference-backed
 * estimators (flight time, jet-lag adjustment, tipping customs). Constants that
 * depend on the real world (cruise speed, baggage limits, tipping norms) are
 * cited on each tool page; do not invent them — verify against authoritative
 * references and caveat that they vary.
 */

/** IUGG mean Earth radius R1 (arithmetic mean of the WGS-84 semi-axes), km. */
export const EARTH_RADIUS_KM = 6371.0088;
export const KM_PER_MILE = 1.609344;
export const KM_PER_NM = 1.852; // nautical mile

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

export interface Coord { lat: number; lon: number; }

/**
 * Great-circle distance between two lat/lon points via the haversine formula.
 * Returns kilometres. Assumes a spherical Earth (accurate to ~0.5%).
 */
export function haversineKm(a: Coord, b: Coord): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_KM * c;
}

/** Initial (forward) great-circle bearing from a to b, degrees 0–360 (0 = north). */
export function initialBearing(a: Coord, b: Coord): number {
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const dLon = toRad(b.lon - a.lon);
  const y = Math.sin(dLon) * Math.cos(la2);
  const x =
    Math.cos(la1) * Math.sin(la2) -
    Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** 16-point compass name for a bearing in degrees. */
export function compassPoint(deg: number): string {
  const pts = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return pts[Math.round(((deg % 360) / 22.5)) % 16];
}

/**
 * Rough flight-time estimate from a great-circle distance. Uses a typical
 * jetliner cruise ground speed and a fixed ground/climb/descent overhead.
 * Deliberately approximate — real times depend on winds, routing and ATC.
 */
export const CRUISE_SPEED_KMH = 830; // typical 737/A320-family cruise ≈ M0.78 ≈ 828–840 km/h TAS
export const FLIGHT_OVERHEAD_MIN = 30; // modeling convention for taxi + climb + descent + approach

export function flightTimeMinutes(distanceKm: number, cruiseKmh = CRUISE_SPEED_KMH, overheadMin = FLIGHT_OVERHEAD_MIN): number {
  if (distanceKm <= 0) return 0;
  return (distanceKm / cruiseKmh) * 60 + overheadMin;
}

/** Split minutes into whole hours + minutes. */
export function hoursMinutes(totalMin: number): { h: number; m: number } {
  const t = Math.max(0, Math.round(totalMin));
  return { h: Math.floor(t / 60), m: t % 60 };
}

/**
 * Road-trip driving time from distance and average speed, with optional break
 * time added. Returns total, driving and break minutes.
 */
export function roadTrip(distance: number, avgSpeed: number, breakMin = 0): { drivingMin: number; breakMin: number; totalMin: number } | null {
  if (distance <= 0 || avgSpeed <= 0) return null;
  const drivingMin = (distance / avgSpeed) * 60;
  return { drivingMin, breakMin, totalMin: drivingMin + breakMin };
}

/**
 * Add minutes to a HH:MM clock time, returning the new time and how many days
 * it rolled over (for arrival-next-day layovers).
 */
export function addMinutesToClock(hhmm: string, addMin: number): { time: string; dayOffset: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
  if (!m) return null;
  const h = +m[1];
  const min = +m[2];
  if (h > 23 || min > 59) return null;
  const total = h * 60 + min + Math.round(addMin);
  const dayOffset = Math.floor(total / 1440);
  const wrapped = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(wrapped / 60)).padStart(2, '0');
  const mm = String(wrapped % 60).padStart(2, '0');
  return { time: `${hh}:${mm}`, dayOffset };
}

/**
 * Layover gap in minutes between an arrival and a departure clock time.
 * `nextDay` handles departures after midnight relative to arrival.
 */
export function layoverMinutes(arrival: string, departure: string, nextDay = false): number | null {
  const pa = /^(\d{1,2}):(\d{2})$/.exec(arrival.trim());
  const pd = /^(\d{1,2}):(\d{2})$/.exec(departure.trim());
  if (!pa || !pd) return null;
  const a = +pa[1] * 60 + +pa[2];
  const d = +pd[1] * 60 + +pd[2] + (nextDay ? 1440 : 0);
  return d - a;
}

/**
 * Typical minimum connection times (MCT), minutes. These vary widely by airport
 * and airline; treat as a rough safety floor, not a guarantee. Verify with the
 * airline/airport for your specific connection.
 */
export const MIN_CONNECTION_MIN = {
  domestic: 45,
  international: 90,
  mixed: 75, // domestic <-> international
};

/**
 * Jet-lag adjustment estimate. Rule of thumb: the body shifts roughly one time
 * zone per day, and eastward travel (advancing the clock) is usually harder
 * than westward. General guidance, not medical advice.
 */
export function jetLagDays(zonesCrossed: number, direction: 'east' | 'west'): { days: number; rate: number } {
  const z = Math.abs(Math.round(zonesCrossed));
  // Common guideline: ~1 day/zone westward, a little slower (~1.5) eastward.
  const rate = direction === 'east' ? 1.5 : 1;
  return { days: Math.round(z * rate * 10) / 10, rate };
}

/** Difference in whole-hour UTC offsets, and travel direction. */
export function timeZoneDelta(fromOffset: number, toOffset: number): { zones: number; direction: 'east' | 'west' | 'same' } {
  const diff = toOffset - fromOffset;
  return {
    zones: Math.abs(diff),
    direction: diff > 0 ? 'east' : diff < 0 ? 'west' : 'same',
  };
}

/** Luggage volume in litres from dimensions in cm; plus common airline limits. */
export function luggageLitres(l: number, w: number, h: number): number | null {
  if (l <= 0 || w <= 0 || h <= 0) return null;
  return (l * w * h) / 1000; // cm³ → L
}

/**
 * Common airline baggage reference limits. Highly airline-dependent — the site
 * page carries a prominent "always check your airline" caveat.
 */
export const BAGGAGE = {
  carryOn: { l: 56, w: 36, h: 23, linearCm: 115, weightKg: 10 }, // IATA cabin guideline 55×35×20–56×36×23
  checked: { linearCm: 158, weightKg: 23 }, // 62 in linear, 50 lb economy
};

/** Sum of dimensions (linear total) in cm. */
export const linearCm = (l: number, w: number, h: number) => l + w + h;

/** Simple even + per-category travel budget split. */
export function budgetPerDay(total: number, days: number): number | null {
  if (total < 0 || days <= 0) return null;
  return total / days;
}
export function budgetPerPersonPerDay(total: number, days: number, people: number): number | null {
  if (total < 0 || days <= 0 || people <= 0) return null;
  return total / days / people;
}

/** Restaurant tip amount and total for a bill. */
export function tip(bill: number, percent: number, split = 1): { tip: number; total: number; perPerson: number } | null {
  if (bill < 0 || percent < 0 || split < 1) return null;
  const t = bill * (percent / 100);
  const total = bill + t;
  return { tip: t, total, perPerson: total / Math.max(1, Math.round(split)) };
}

export interface TipCustom { country: string; low: number; high: number; note: string; }
/**
 * Customary restaurant tipping by country. Tipping is cultural and varies by
 * setting and service; these are typical ranges as guidance only. Cited on the
 * page. `low`/`high` are percent; a 0–0 range means tipping is not expected.
 */
export const TIP_CUSTOMS: TipCustom[] = [
  { country: 'United States', low: 15, high: 20, note: 'Expected; 18–20% for good service. Often not included in the bill.' },
  { country: 'Canada', low: 15, high: 20, note: 'Expected, similar to the US.' },
  { country: 'United Kingdom', low: 10, high: 15, note: 'Common if service is not already included (check for a service charge).' },
  { country: 'France', low: 0, high: 5, note: 'Service compris — service is included by law. Round up or leave small change for good service.' },
  { country: 'Germany', low: 5, high: 10, note: 'Round up or add ~5–10%, handed directly to the server.' },
  { country: 'Italy', low: 0, high: 10, note: 'A coperto (cover charge) is common; extra tip optional, round up or up to 10%.' },
  { country: 'Spain', low: 0, high: 10, note: 'Not obligatory; round up or leave small change, up to ~10% for good service.' },
  { country: 'Japan', low: 0, high: 0, note: 'No tipping — it can cause confusion or offence. Excellent service is standard.' },
  { country: 'China', low: 0, high: 0, note: 'Generally not expected, especially outside high-end/international hotels.' },
  { country: 'Australia', low: 0, high: 10, note: 'Not expected (staff are paid a living wage); ~10% appreciated for great service.' },
  { country: 'United Arab Emirates', low: 10, high: 15, note: 'A 10% service charge is often added; an extra ~10% is common if not.' },
  { country: 'India', low: 5, high: 10, note: 'Common in restaurants; check whether a service charge is already added.' },
  { country: 'Mexico', low: 10, high: 15, note: 'Expected (propina); ~10–15% is standard.' },
  { country: 'Brazil', low: 0, high: 10, note: 'A 10% service charge (serviço) is usually added to the bill; extra optional.' },
];
