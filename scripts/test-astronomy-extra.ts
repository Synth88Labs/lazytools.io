/**
 * Node test for src/lib/astronomy-extra.ts — run:
 *   node --experimental-strip-types scripts/test-astronomy-extra.ts
 */
import {
  sunAtElevation, sunWindows, fmtMin, distanceModulus, absoluteMagnitude,
  apparentMagnitude, distanceFromMagnitudes, brightnessRatio,
  velocityFromRedshift, redshiftFromVelocity, observedWavelength, hubbleDistanceMpc, C_KMS,
} from '../src/lib/astronomy-extra.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;
const rel = (a: number, b: number, tol = 1e-3) => Math.abs(a - b) <= tol * Math.abs(b);

// --- Sun windows: London 2024-06-21 (summer solstice), lat 51.5, lon -0.13, tz +1 (BST)
const w = sunWindows(2024, 6, 21, 51.5, -0.13, 1);
ok('London solstice sunrise ~04:43', w.sunrise != null && Math.abs(w.sunrise - (4 * 60 + 43)) < 6, fmtMin(w.sunrise));
ok('London solstice sunset ~21:21', w.sunset != null && Math.abs(w.sunset - (21 * 60 + 21)) < 6, fmtMin(w.sunset));
ok('golden AM before/around sunrise', w.goldenAm[0] != null && w.goldenAm[0]! < w.sunrise! + 5);
ok('golden PM around sunset', w.goldenPm[1] != null && w.goldenPm[1]! > w.sunset! - 60);
ok('solar noon ~13:02', Math.abs(w.solarNoon - (13 * 60 + 2)) < 5, fmtMin(w.solarNoon));
// ordering: astro dawn < nautical dawn < civil dawn < sunrise
ok('dawn ordering', w.astroDawn! < w.nauticalDawn! && w.nauticalDawn! < w.civilDawn! && w.civilDawn! < w.sunrise!);
// blue hour AM ends where golden AM begins (both at -4 deg)
ok('blue AM meets golden AM at -4deg', near(w.blueAm[1]!, w.goldenAm[0]!, 1e-6));

// high-latitude summer: no astronomical night (astro dawn null)
const wHigh = sunWindows(2024, 6, 21, 60, 0, 0);
ok('high-lat solstice: no astro twilight', wHigh.astroDawn === null);

// --- sunAtElevation basic sanity: -0.833 ~ sunrise/sunset
const se = sunAtElevation(2024, 3, 20, 0, 0, 0, -0.833); // equator equinox
ok('equator equinox sunrise ~06:00', se.morning != null && Math.abs(se.morning - 360) < 8, fmtMin(se.morning));

// --- fmtMin
ok('fmtMin 763 = 12:43', fmtMin(763) === '12:43');
ok('fmtMin null = dash', fmtMin(null) === '—');
ok('fmtMin wraps negative', fmtMin(-30) === '23:30');

// --- Stellar magnitudes
// star at 10 pc: distance modulus 0 → apparent = absolute
ok('distance modulus 10pc = 0', near(distanceModulus(10)!, 0, 1e-9));
ok('distance modulus 100pc = 5', near(distanceModulus(100)!, 5, 1e-9));
ok('absolute from apparent (10pc)', near(absoluteMagnitude(5, 10)!, 5, 1e-9));
ok('apparent from absolute (100pc)', near(apparentMagnitude(1, 100)!, 6, 1e-9));
// distance from m - M = 5 → 100 pc
ok('distance from mods (m-M=5) = 100pc', rel(distanceFromMagnitudes(6, 1), 100, 1e-6), distanceFromMagnitudes(6, 1));
// 5 magnitudes = 100x brightness
ok('5 mag = 100x brighter', rel(brightnessRatio(1, 6), 100, 1e-6), brightnessRatio(1, 6));
ok('1 mag ≈ 2.512x', rel(brightnessRatio(1, 2), 2.51189, 1e-4));
ok('equal mag = 1x', near(brightnessRatio(3, 3), 1, 1e-9));

// --- Redshift
// z = 0.1 non-relativistic → v = 0.1c
ok('z=0.1 nonrel v = 0.1c', rel(velocityFromRedshift(0.1, false)!, 0.1 * C_KMS, 1e-9));
// relativistic v for z=0.1 is a bit less than 0.1c
const vrel = velocityFromRedshift(0.1, true)!;
ok('z=0.1 rel v < 0.1c', vrel < 0.1 * C_KMS && vrel > 0.09 * C_KMS, vrel.toFixed(1));
// round trip
ok('redshift round trip (rel)', rel(redshiftFromVelocity(vrel, true)!, 0.1, 1e-6));
ok('redshift round trip (nonrel)', rel(redshiftFromVelocity(0.1 * C_KMS, false)!, 0.1, 1e-9));
// wavelength: rest 500nm at z=0.1 → 550nm
ok('wavelength 500nm z=0.1 = 550', near(observedWavelength(500, 0.1), 550, 1e-9));
// Hubble distance: v=7000 km/s at H0=70 → 100 Mpc
ok('Hubble distance 7000/70 = 100 Mpc', near(hubbleDistanceMpc(7000, 70)!, 100, 1e-9));
ok('velocity invalid z<=-1', velocityFromRedshift(-1) === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
