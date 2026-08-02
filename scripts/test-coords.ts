import { toDMS, toDDM, parseCoord, llToUtm, utmToLl, utmToMgrs, geohashEncode, geohashDecode } from '../src/lib/coords.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// ---- DMS / DDM formatting ----
ok('toDMS London lat', toDMS(51.507222, true) === `51°30'26"N`);
ok('toDMS negative lon → W', toDMS(-0.1275, false).endsWith('W'));
ok('toDDM lat', toDDM(51.507222, true) === `51°30.433'N`);
ok('toDDM south', toDDM(-33.8688, true).endsWith('S'));

// ---- parse ----
ok('parse decimal', parseCoord('-0.1278') === -0.1278);
ok('parse DMS', near(parseCoord(`51°30'26.6"N`)!, 51.50739, 1e-4));
ok('parse DDM with W→negative', near(parseCoord(`0°7.665'W`)!, -0.12775, 1e-4));
ok('parse space-separated', near(parseCoord('51 30 26.6 N')!, 51.50739, 1e-4));
ok('parse empty → null', parseCoord('   ') === null);

// ---- UTM: central-meridian invariants (exact) ----
// On a zone's central meridian, easting is exactly 500000; at the equator, northing 0.
const cm = llToUtm(0, 3); // lon 3 → zone 31, central meridian 3°
ok('UTM equator+CM easting = 500000', near(cm.easting, 500000, 0.01));
ok('UTM equator northing = 0', near(cm.northing, 0, 0.01));
ok('UTM zone from lon 3 = 31', cm.zone === 31);
const cm45 = llToUtm(45, 3);
ok('UTM CM at 45N easting still 500000', near(cm45.easting, 500000, 0.01));
// meridian arc to 45°N × k0 ≈ 4,982,950 m
ok('UTM northing at 45N,CM ≈ 4,982,950', near(cm45.northing, 4982950, 300));

// ---- UTM: published reference (Eiffel Tower 48.8584N, 2.2945E → 31U 448266 5411931 approx) ----
const eiffel = llToUtm(48.8584, 2.2945);
ok('Eiffel zone 31', eiffel.zone === 31);
ok('Eiffel band U', eiffel.band === 'U');
ok('Eiffel easting ≈ 448266', near(eiffel.easting, 448266, 30));
ok('Eiffel northing ≈ 5411931', near(eiffel.northing, 5411931, 30));

// ---- UTM round-trip (many points) ----
const pts: [number, number][] = [[51.5074, -0.1278], [-33.8688, 151.2093], [40.7128, -74.006], [-1.2921, 36.8219], [64.1466, -21.9426]];
let maxErr = 0;
for (const [lat, lon] of pts) {
  const u = llToUtm(lat, lon);
  const b = utmToLl(u.zone, u.hemisphere, u.easting, u.northing);
  maxErr = Math.max(maxErr, Math.abs(b.lat - lat), Math.abs(b.lon - lon));
}
ok('UTM round-trip < 1e-6° for all points', maxErr < 1e-6);

// ---- MGRS ----
const mg = utmToMgrs(llToUtm(48.8584, 2.2945));
ok('MGRS starts with 31U', mg.startsWith('31U'));
ok('MGRS has 100km square letters + digits', /^31U[A-Z]{2} \d{5} \d{5}$/.test(mg));

// ---- geohash: published reference (57.64911, 10.40744) → u4pruydqqvj ----
ok('geohash reference u4pruydqqvj', geohashEncode(57.64911, 10.40744, 11) === 'u4pruydqqvj');
ok('geohash London prefix gcpv', geohashEncode(51.5074, -0.1278, 9).startsWith('gcpv'));
const gd = geohashDecode('u4pruydqqvj');
ok('geohash decode ≈ original', near(gd.lat, 57.64911, 1e-3) && near(gd.lon, 10.40744, 1e-3));
let threw = false; try { geohashDecode('abcª'); } catch { threw = true; }
ok('geohash decode rejects bad char', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
