/**
 * Additional astronomy for the /astronomy/ category: golden hour / blue hour /
 * twilight (built on the shipped NOAA solar-position algorithm in astronomy.ts),
 * stellar magnitudes (Pogson / distance modulus), and cosmological redshift.
 * Pure computation; constants are IAU/standard values, cited on each tool page.
 */
import { sunTimes } from './astronomy.ts';

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Speed of light, km/s (exact). */
export const C_KMS = 299792.458;
/** Hubble constant, km/s/Mpc (Planck-era consensus ~70; user-adjustable). */
export const HUBBLE_DEFAULT = 70;

/**
 * The two clock times (minutes after local midnight) when the sun reaches a
 * given elevation angle — morning (rising) and evening (setting). Reuses
 * sunTimes for solar noon and declination, then solves the hour angle for the
 * target elevation. Returns null for an event the sun never reaches that day.
 */
export function sunAtElevation(year: number, month: number, day: number, lat: number, lon: number, tz: number, elevationDeg: number): { morning: number | null; evening: number | null } {
  const st = sunTimes(year, month, day, lat, lon, tz);
  const decl = st.declination;
  const cosH = (Math.sin(rad(elevationDeg)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) / (Math.cos(rad(lat)) * Math.cos(rad(decl)));
  if (cosH > 1 || cosH < -1) return { morning: null, evening: null };
  const ha = deg(Math.acos(cosH));
  return { morning: st.solarNoonMin - ha * 4, evening: st.solarNoonMin + ha * 4 };
}

export interface SunWindows {
  solarNoon: number;
  sunrise: number | null; sunset: number | null;
  goldenAm: [number | null, number | null]; goldenPm: [number | null, number | null];
  blueAm: [number | null, number | null]; bluePm: [number | null, number | null];
  civilDawn: number | null; civilDusk: number | null;
  nauticalDawn: number | null; nauticalDusk: number | null;
  astroDawn: number | null; astroDusk: number | null;
}

/**
 * All the photographer/astronomer light windows for a date and location.
 * Golden hour: sun −4° to +6°. Blue hour: sun −6° to −4°. Twilight boundaries at
 * −6° (civil), −12° (nautical), −18° (astronomical). Times in minutes after
 * local midnight.
 */
export function sunWindows(year: number, month: number, day: number, lat: number, lon: number, tz: number): SunWindows {
  const st = sunTimes(year, month, day, lat, lon, tz);
  const at = (e: number) => sunAtElevation(year, month, day, lat, lon, tz, e);
  const e_6 = at(-6), e_4 = at(-4), e6 = at(6), e12 = at(-12), e18 = at(-18);
  return {
    solarNoon: st.solarNoonMin,
    sunrise: st.sunriseMin, sunset: st.sunsetMin,
    goldenAm: [e_4.morning, e6.morning],
    goldenPm: [e6.evening, e_4.evening],
    blueAm: [e_6.morning, e_4.morning],
    bluePm: [e_4.evening, e_6.evening],
    civilDawn: e_6.morning, civilDusk: e_6.evening,
    nauticalDawn: e12.morning, nauticalDusk: e12.evening,
    astroDawn: e18.morning, astroDusk: e18.evening,
  };
}

/** Format minutes-after-midnight as HH:MM (24h), or "—" for null/out of range. */
export function fmtMin(min: number | null): string {
  if (min == null || !isFinite(min)) return '—';
  let m = Math.round(min);
  m = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/* ---------------- Stellar magnitudes (Pogson) ---------------- */

/** Distance modulus m − M = 5·log10(d_pc) − 5. */
export function distanceModulus(distancePc: number): number | null {
  if (distancePc <= 0) return null;
  return 5 * Math.log10(distancePc) - 5;
}
/** Absolute magnitude from apparent magnitude and distance (parsecs). */
export function absoluteMagnitude(apparent: number, distancePc: number): number | null {
  if (distancePc <= 0) return null;
  return apparent - 5 * Math.log10(distancePc) + 5;
}
/** Apparent magnitude from absolute magnitude and distance (parsecs). */
export function apparentMagnitude(absolute: number, distancePc: number): number | null {
  if (distancePc <= 0) return null;
  return absolute + 5 * Math.log10(distancePc) - 5;
}
/** Distance (parsecs) from apparent and absolute magnitude. */
export function distanceFromMagnitudes(apparent: number, absolute: number): number {
  return Math.pow(10, (apparent - absolute + 5) / 5);
}
/** Brightness ratio: how many times brighter the brighter star is (Pogson: 100^0.2 per magnitude). */
export function brightnessRatio(mag1: number, mag2: number): number {
  return Math.pow(10, 0.4 * (mag2 - mag1));
}

/* ---------------- Cosmological redshift ---------------- */

/** Recession velocity (km/s) from redshift z. Relativistic unless nonRelativistic. */
export function velocityFromRedshift(z: number, relativistic = true): number | null {
  if (z <= -1) return null;
  if (!relativistic) return z * C_KMS;
  const zp = (1 + z) ** 2;
  const beta = (zp - 1) / (zp + 1);
  return beta * C_KMS;
}
/** Redshift z from recession velocity (km/s). */
export function redshiftFromVelocity(vKms: number, relativistic = true): number | null {
  const beta = vKms / C_KMS;
  if (beta >= 1 || beta <= -1) return null;
  if (!relativistic) return beta;
  return Math.sqrt((1 + beta) / (1 - beta)) - 1;
}
/** Observed wavelength from rest wavelength and z: λ_obs = λ_rest·(1+z). */
export const observedWavelength = (restWavelength: number, z: number) => restWavelength * (1 + z);
/** Approximate Hubble distance (Mpc) from recession velocity: d = v / H₀. */
export function hubbleDistanceMpc(vKms: number, h0 = HUBBLE_DEFAULT): number | null {
  if (h0 <= 0) return null;
  return vKms / h0;
}
