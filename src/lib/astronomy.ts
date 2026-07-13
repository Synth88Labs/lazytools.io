/**
 * Astronomy & Space math. Uses established astronomical constants (NASA
 * planetary data, IAU-defined units) and standard algorithms (the mean synodic
 * month for lunar phase, the NOAA solar-position algorithm for sunrise/sunset,
 * telescope optics, the small-angle and parallax relations). Each is cited on
 * its tool page. Do not invent constants; verify against NASA/NOAA/IAU.
 */

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/* ---------------- Distance / light constants ---------------- */
export const C_KMS = 299792.458; // speed of light, km/s (exact)
export const AU_KM = 149597870.7; // astronomical unit (IAU 2012, exact)
export const LY_KM = 9.4607304725808e12; // light-year, km
export const PARSEC_KM = 3.0856775814913673e13; // parsec, km
export const PARSEC_LY = 3.2615637771; // parsec in light-years

/* ---------------- Moon phase ---------------- */
export const SYNODIC_MONTH = 29.530588853; // days
const NEW_MOON_JD = 2451550.09766; // reference new moon (Meeus Lunation 0): 2000-01-06 18:14 UTC

/** Julian Date from a JS Date (UTC). */
export function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export interface MoonPhase {
  ageDays: number; illumination: number; phaseName: string; emoji: string; nextFull: number; nextNew: number;
}
const PHASE_NAMES = [
  { name: 'New Moon', emoji: '🌑' }, { name: 'Waxing Crescent', emoji: '🌒' },
  { name: 'First Quarter', emoji: '🌓' }, { name: 'Waxing Gibbous', emoji: '🌔' },
  { name: 'Full Moon', emoji: '🌕' }, { name: 'Waning Gibbous', emoji: '🌖' },
  { name: 'Last Quarter', emoji: '🌗' }, { name: 'Waning Crescent', emoji: '🌘' },
];
export function moonPhase(date: Date): MoonPhase {
  const jd = toJulian(date);
  let age = (jd - NEW_MOON_JD) % SYNODIC_MONTH;
  if (age < 0) age += SYNODIC_MONTH;
  const frac = age / SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * frac)) / 2;
  // choose the nearest of the 8 named phases within a tolerance, else the segment
  let idx = Math.floor((frac * 8) + 0.5) % 8;
  // snap exact quarters only when very close; otherwise use crescent/gibbous segments
  const nearQuarter = Math.abs(frac * 8 - Math.round(frac * 8)) < 0.06 && Math.round(frac * 8) % 2 === 0;
  if (!nearQuarter) idx = [0, 1, 2, 3, 4, 5, 6, 7][Math.floor(frac * 8) % 8];
  const p = PHASE_NAMES[idx];
  return {
    ageDays: age, illumination, phaseName: p.name, emoji: p.emoji,
    nextFull: ((SYNODIC_MONTH / 2 - age + SYNODIC_MONTH) % SYNODIC_MONTH),
    nextNew: ((SYNODIC_MONTH - age) % SYNODIC_MONTH),
  };
}

/* ---------------- Sunrise / sunset (NOAA algorithm) ---------------- */

function julianDayCal(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

export interface SunTimes { sunriseMin: number | null; sunsetMin: number | null; solarNoonMin: number; dayLengthMin: number | null; declination: number }

/**
 * Sunrise, sunset and solar noon as minutes after local midnight, using the
 * NOAA solar-position algorithm. lat/lon in degrees (east positive), tz in hours
 * from UTC. Returns null sunrise/sunset for polar day/night.
 */
export function sunTimes(year: number, month: number, day: number, lat: number, lon: number, tz: number): SunTimes {
  const jd = julianDayCal(year, month, day);
  const jc = (jd - 2451545) / 36525;
  const gml = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
  const gma = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
  const ecc = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
  const eqCtr = Math.sin(rad(gma)) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
    Math.sin(rad(2 * gma)) * (0.019993 - 0.000101 * jc) + Math.sin(rad(3 * gma)) * 0.000289;
  const trueLong = gml + eqCtr;
  const appLong = trueLong - 0.00569 - 0.00478 * Math.sin(rad(125.04 - 1934.136 * jc));
  const meanObliq = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60;
  const obliqCorr = meanObliq + 0.00256 * Math.cos(rad(125.04 - 1934.136 * jc));
  const declin = deg(Math.asin(Math.sin(rad(obliqCorr)) * Math.sin(rad(appLong))));
  const varY = Math.tan(rad(obliqCorr / 2)) ** 2;
  const eqTime = 4 * deg(varY * Math.sin(2 * rad(gml)) - 2 * ecc * Math.sin(rad(gma)) +
    4 * ecc * varY * Math.sin(rad(gma)) * Math.cos(2 * rad(gml)) -
    0.5 * varY * varY * Math.sin(4 * rad(gml)) - 1.25 * ecc * ecc * Math.sin(2 * rad(gma)));

  const solarNoonMin = 720 - 4 * lon - eqTime + tz * 60;
  const cosH = Math.cos(rad(90.833)) / (Math.cos(rad(lat)) * Math.cos(rad(declin))) - Math.tan(rad(lat)) * Math.tan(rad(declin));
  if (cosH > 1) return { sunriseMin: null, sunsetMin: null, solarNoonMin, dayLengthMin: 0, declination: declin }; // polar night
  if (cosH < -1) return { sunriseMin: null, sunsetMin: null, solarNoonMin, dayLengthMin: 1440, declination: declin }; // polar day
  const ha = deg(Math.acos(cosH));
  const sunriseMin = solarNoonMin - ha * 4;
  const sunsetMin = solarNoonMin + ha * 4;
  return { sunriseMin, sunsetMin, solarNoonMin, dayLengthMin: ha * 8, declination: declin };
}

/* ---------------- Planets ---------------- */
export interface Planet { id: string; name: string; gravity: number; orbitYears: number }
/** Surface gravity (Earth=1) and sidereal orbital period (Earth years). NASA Planetary Fact Sheet. */
export const PLANETS: Planet[] = [
  { id: 'mercury', name: 'Mercury', gravity: 0.378, orbitYears: 0.2408467 },
  { id: 'venus', name: 'Venus', gravity: 0.907, orbitYears: 0.61519726 },
  { id: 'earth', name: 'Earth', gravity: 1, orbitYears: 1 },
  { id: 'moon', name: 'The Moon', gravity: 0.166, orbitYears: 1 },
  { id: 'mars', name: 'Mars', gravity: 0.377, orbitYears: 1.8808476 },
  { id: 'jupiter', name: 'Jupiter', gravity: 2.36, orbitYears: 11.862615 },
  { id: 'saturn', name: 'Saturn', gravity: 0.916, orbitYears: 29.447498 },
  { id: 'uranus', name: 'Uranus', gravity: 0.889, orbitYears: 84.016846 },
  { id: 'neptune', name: 'Neptune', gravity: 1.12, orbitYears: 164.79132 },
  { id: 'pluto', name: 'Pluto', gravity: 0.071, orbitYears: 247.92065 },
  { id: 'sun', name: 'The Sun', gravity: 27.9, orbitYears: NaN },
];

/* ---------------- Telescope optics ---------------- */
export function telescope(scopeFL: number, aperture: number, eyepieceFL: number) {
  const magnification = eyepieceFL > 0 ? scopeFL / eyepieceFL : null;
  const fRatio = aperture > 0 ? scopeFL / aperture : null;
  return {
    magnification, fRatio,
    maxUsefulMag: aperture * 2, // ~2× aperture in mm
    minUsefulMag: aperture / 7, // exit pupil ~7 mm
    dawesArcsec: aperture > 0 ? 116 / aperture : null, // resolving power
    rayleighArcsec: aperture > 0 ? 138 / aperture : null,
    exitPupil: magnification && magnification > 0 ? aperture / magnification : null,
  };
}

/* ---------------- Small angle & parallax ---------------- */
export const ARCSEC_PER_RAD = 206264.806;
/** Angular size (arcseconds) of an object of given size at a given distance (same units). */
export function angularSizeArcsec(size: number, distance: number): number {
  return 2 * deg(Math.atan(size / (2 * distance))) * 3600;
}
/** Distance to a star (parsecs) from its parallax angle (arcseconds). */
export function parallaxDistancePc(parallaxArcsec: number): number | null {
  return parallaxArcsec > 0 ? 1 / parallaxArcsec : null;
}

/* ---------------- Kepler's third law ---------------- */

/**
 * Kepler's third law in solar-system units: P² = a³ ÷ M, with P in years, a in
 * AU and the central mass M in solar masses (M = 1 for the Sun). So the orbital
 * period is P = √(a³ ÷ M). Exact for a two-body orbit; a good approximation for
 * planets and satellites where one body dominates the mass.
 */
export function keplerPeriodYears(semiMajorAU: number, centralMassSolar = 1): number | null {
  if (semiMajorAU <= 0 || centralMassSolar <= 0) return null;
  return Math.sqrt((semiMajorAU ** 3) / centralMassSolar);
}
/** Inverse: semi-major axis (AU) from the orbital period (years) and central mass (solar masses). */
export function keplerAxisAU(periodYears: number, centralMassSolar = 1): number | null {
  if (periodYears <= 0 || centralMassSolar <= 0) return null;
  return Math.cbrt((periodYears ** 2) * centralMassSolar);
}

/* ---------------- Schwarzschild radius ---------------- */

export const G_SI = 6.674e-11; // gravitational constant, m³·kg⁻¹·s⁻²
export const C_MS = 299792458; // speed of light, m/s (exact)
export const M_SUN_KG = 1.98892e30; // solar mass, kg

/**
 * Schwarzschild radius (event-horizon radius) of a non-rotating mass:
 * r_s = 2·G·M ÷ c². Returns metres from a mass in kilograms. About 2.95 km per
 * solar mass; ~8.87 mm for the whole Earth.
 */
export function schwarzschildRadiusM(massKg: number): number | null {
  if (massKg <= 0) return null;
  return (2 * G_SI * massKg) / (C_MS ** 2);
}
/** Schwarzschild radius (metres) from a mass given in solar masses. */
export function schwarzschildRadiusFromSolar(massSolar: number): number | null {
  return schwarzschildRadiusM(massSolar * M_SUN_KG);
}

export { rad, deg };
