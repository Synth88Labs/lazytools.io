import { toJulian, moonPhase, sunTimes, PLANETS, telescope, angularSizeArcsec, parallaxDistancePc, C_KMS, AU_KM, PARSEC_LY, SYNODIC_MONTH } from '../src/lib/astronomy.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Constants
ok('c = 299792.458', C_KMS === 299792.458);
ok('AU exact', AU_KM === 149597870.7);
ok('parsec 3.2616 ly', approx(PARSEC_LY, 3.26156, 0.001));

// Julian date: 2000-01-01 12:00 UTC = JD 2451545.0
ok('J2000 = JD 2451545', approx(toJulian(new Date('2000-01-01T12:00:00Z')), 2451545, 0.001));

// Moon phase: reference new moon 2000-01-06 18:14 UTC -> age ~0, low illumination
const mp = moonPhase(new Date('2000-01-06T18:14:00Z'));
ok('new moon age ~0', mp.ageDays < 0.5 || mp.ageDays > SYNODIC_MONTH - 0.5);
ok('new moon illumination ~0', mp.illumination < 0.02);
// Full moon ~14.77 days later (2000-01-21)
const mpFull = moonPhase(new Date('2000-01-21T04:40:00Z'));
ok('full moon illumination ~1', mpFull.illumination > 0.97);

// Sunrise: NYC (40.7128, -74.0060), 2024-03-20 (equinox). DST in effect -> EDT (tz -4).
// NOAA reference: sunrise 6:59, solar noon 13:03, sunset 19:08 EDT.
const st = sunTimes(2024, 3, 20, 40.7128, -74.0060, -4);
ok('NYC equinox sunrise ~6:59', st.sunriseMin != null && approx(st.sunriseMin, 419, 8));
ok('NYC equinox sunset ~19:08', st.sunsetMin != null && approx(st.sunsetMin, 1148, 8));
ok('NYC equinox day ~12h', st.dayLengthMin != null && approx(st.dayLengthMin, 725, 15));
ok('equinox declination ~0', approx(st.declination, 0, 1));
// Polar day: Svalbard (78N) in June
const polar = sunTimes(2024, 6, 21, 78, 15, 1);
ok('polar day = 24h', polar.dayLengthMin === 1440);

// Planets: weight ratios
ok('moon gravity 0.166', PLANETS.find((p) => p.id === 'moon')!.gravity === 0.166);
ok('jupiter gravity 2.36', PLANETS.find((p) => p.id === 'jupiter')!.gravity === 2.36);
ok('mars orbit 1.88 yr', approx(PLANETS.find((p) => p.id === 'mars')!.orbitYears, 1.8808, 0.001));

// Telescope: 1200mm FL, 150mm aperture, 10mm eyepiece -> 120x, f/8
const t = telescope(1200, 150, 10);
ok('mag 1200/10 = 120x', t.magnification === 120);
ok('f-ratio 1200/150 = 8', t.fRatio === 8);
ok('max useful mag 2x150 = 300', t.maxUsefulMag === 300);
ok('Dawes 116/150 = 0.77', approx(t.dawesArcsec!, 0.773, 0.01));
ok('exit pupil 150/120 = 1.25', approx(t.exitPupil!, 1.25, 0.01));

// Angular size: Moon (3474 km diameter, 384400 km away) ~ 0.518 deg = 1865 arcsec
ok('moon angular ~1865 arcsec', approx(angularSizeArcsec(3474, 384400), 1865, 10));

// Parallax: 1 arcsec = 1 parsec; 0.1 arcsec = 10 pc
ok('parallax 1arcsec = 1pc', approx(parallaxDistancePc(1)!, 1, 0.001));
ok('parallax 0.1arcsec = 10pc', approx(parallaxDistancePc(0.1)!, 10, 0.001));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
