/**
 * Weather & Atmosphere math. These are published meteorological formulas — the
 * NWS Rothfusz heat-index regression, the 2001 NWS wind-chill formula, the
 * Magnus dew-point equation, Stull's (2011) wet-bulb approximation, the Beaufort
 * scale and the dew-point-spread cloud-base rule. Each is cited on its tool page.
 * Do not invent coefficients; verify against NWS/NOAA/peer-reviewed sources.
 */

export const cToF = (c: number) => (c * 9) / 5 + 32;
export const fToC = (f: number) => ((f - 32) * 5) / 9;

/* ---------------- Heat index (NWS Rothfusz) ---------------- */

/** Heat index in °F from temperature T (°F) and relative humidity RH (%). */
export function heatIndexF(T: number, RH: number): number {
  // Simple Steadman-based formula first (NWS uses this when the result < 80°F).
  const simple = 0.5 * (T + 61 + (T - 68) * 1.2 + RH * 0.094);
  if ((simple + T) / 2 < 80) return simple;

  // Full Rothfusz regression.
  let HI =
    -42.379 + 2.04901523 * T + 10.14333127 * RH - 0.22475541 * T * RH -
    0.00683783 * T * T - 0.05481717 * RH * RH + 0.00122874 * T * T * RH +
    0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;

  // Adjustments
  if (RH < 13 && T >= 80 && T <= 112) {
    HI -= ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
  } else if (RH > 85 && T >= 80 && T <= 87) {
    HI += ((RH - 85) / 10) * ((87 - T) / 5);
  }
  return HI;
}
export const heatIndexC = (tC: number, rh: number) => fToC(heatIndexF(cToF(tC), rh));

/* ---------------- Wind chill (NWS 2001) ---------------- */

/** Wind chill in °F from T (°F) and wind speed V (mph). Valid T ≤ 50°F, V > 3 mph. */
export function windChillF(T: number, V: number): number {
  if (V <= 3) return T;
  const v16 = Math.pow(V, 0.16);
  return 35.74 + 0.6215 * T - 35.75 * v16 + 0.4275 * T * v16;
}
export const windChillC = (tC: number, vKmh: number) => fToC(windChillF(cToF(tC), vKmh / 1.609344));

/* ---------------- Dew point / humidity (Magnus) ---------------- */

const MAGNUS_A = 17.625;
const MAGNUS_B = 243.04;

/** Dew point (°C) from temperature (°C) and relative humidity (%). */
export function dewPointC(T: number, RH: number): number {
  const gamma = Math.log(RH / 100) + (MAGNUS_A * T) / (MAGNUS_B + T);
  return (MAGNUS_B * gamma) / (MAGNUS_A - gamma);
}
/** Relative humidity (%) from temperature (°C) and dew point (°C). */
export function relHumidity(T: number, Td: number): number {
  const num = Math.exp((MAGNUS_A * Td) / (MAGNUS_B + Td));
  const den = Math.exp((MAGNUS_A * T) / (MAGNUS_B + T));
  return 100 * (num / den);
}

/** Saturation vapour pressure (hPa) via the Magnus formula. */
export const satVaporPressureHpa = (T: number): number => 6.112 * Math.exp((MAGNUS_A * T) / (MAGNUS_B + T));

/** Absolute humidity (g/m³) from temperature (°C) and relative humidity (%). */
export function absoluteHumidity(T: number, RH: number): number {
  return (2.1674 * satVaporPressureHpa(T) * RH) / (273.15 + T);
}

/** Vapour pressure deficit (kPa) from air temp (°C), RH (%) and optional leaf temp (°C). */
export function vpd(airT: number, RH: number, leafT: number = airT): number {
  const svpLeaf = satVaporPressureHpa(leafT) / 10; // hPa → kPa
  const svpAir = satVaporPressureHpa(airT) / 10;
  return svpLeaf - svpAir * (RH / 100);
}

/** Harvested rainwater (litres) from roof footprint (m²), rainfall (mm) and runoff coefficient. */
export const rainfallCollectionL = (areaM2: number, rainMm: number, coeff = 0.9): number => areaM2 * rainMm * coeff;

/* ---------------- Wet-bulb (Stull 2011) ---------------- */

/** Wet-bulb temperature (°C) from T (°C) and RH (%), at ~sea-level pressure. */
export function wetBulbC(T: number, RH: number): number {
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

/* ---------------- Feels-like (apparent temperature) ---------------- */

/** Apparent temperature (°F): heat index when warm, wind chill when cold, else actual. */
export function feelsLikeF(T: number, RH: number, Vmph: number): { value: number; basis: string } {
  if (T >= 80) return { value: heatIndexF(T, RH), basis: 'heat index' };
  if (T <= 50 && Vmph > 3) return { value: windChillF(T, Vmph), basis: 'wind chill' };
  return { value: T, basis: 'actual temperature' };
}

/* ---------------- Beaufort scale ---------------- */

export interface BeaufortLevel { force: number; name: string; minMph: number; maxMph: number; effect: string }
export const BEAUFORT: BeaufortLevel[] = [
  { force: 0, name: 'Calm', minMph: 0, maxMph: 1, effect: 'Smoke rises vertically' },
  { force: 1, name: 'Light air', minMph: 1, maxMph: 3, effect: 'Smoke drifts; wind vanes still' },
  { force: 2, name: 'Light breeze', minMph: 4, maxMph: 7, effect: 'Leaves rustle; wind felt on face' },
  { force: 3, name: 'Gentle breeze', minMph: 8, maxMph: 12, effect: 'Leaves and twigs in motion' },
  { force: 4, name: 'Moderate breeze', minMph: 13, maxMph: 18, effect: 'Dust and loose paper raised' },
  { force: 5, name: 'Fresh breeze', minMph: 19, maxMph: 24, effect: 'Small trees sway' },
  { force: 6, name: 'Strong breeze', minMph: 25, maxMph: 31, effect: 'Large branches move; umbrellas hard to use' },
  { force: 7, name: 'Near gale', minMph: 32, maxMph: 38, effect: 'Whole trees in motion; hard to walk' },
  { force: 8, name: 'Gale', minMph: 39, maxMph: 46, effect: 'Twigs break off trees' },
  { force: 9, name: 'Severe gale', minMph: 47, maxMph: 54, effect: 'Slight structural damage' },
  { force: 10, name: 'Storm', minMph: 55, maxMph: 63, effect: 'Trees uprooted; considerable damage' },
  { force: 11, name: 'Violent storm', minMph: 64, maxMph: 72, effect: 'Widespread damage' },
  { force: 12, name: 'Hurricane force', minMph: 73, maxMph: Infinity, effect: 'Devastation' },
];
export function beaufort(mph: number): BeaufortLevel {
  return BEAUFORT.find((b) => mph >= b.minMph && mph <= b.maxMph) ?? BEAUFORT[BEAUFORT.length - 1];
}

/* ---------------- Cloud base ---------------- */

/** Estimated cloud base (feet AGL) from T and dew point in °F (spread × ~227 ft/°F). */
export function cloudBaseFt(tF: number, tdF: number): number {
  return Math.max(0, ((tF - tdF) / 4.4) * 1000);
}

/** Density altitude (ft) — pilot approximation from pressure altitude (ft) and outside air temp (°C). */
export function densityAltitude(pressureAltFt: number, oatC: number): number {
  const isaC = 15 - 1.98 * (pressureAltFt / 1000);
  return pressureAltFt + 120 * (oatC - isaC);
}

/** Snow roof load from depth (m) and snow density (kg/m³): mass/area, pressure and lb/ft². */
export function snowLoad(depthM: number, densityKgM3: number) {
  if (depthM < 0 || densityKgM3 <= 0) return null;
  const massPerArea = depthM * densityKgM3; // kg/m²
  const kPa = (massPerArea * 9.80665) / 1000;
  return { massPerArea, kPa, psf: kPa * 20.8854342 };
}
