import { encodePolyline, decodePolyline, polylineToGeoJSON, type LatLng } from '../src/lib/polyline.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number) => Math.abs(a - b) < 1e-5;

// ---- Google's canonical documented example ----
const CANON = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
const points: LatLng[] = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]];

ok('encode canonical example', encodePolyline(points) === CANON);

const decoded = decodePolyline(CANON);
ok('decode count 3', decoded.length === 3);
ok('decode p1', near(decoded[0]![0], 38.5) && near(decoded[0]![1], -120.2));
ok('decode p2', near(decoded[1]![0], 40.7) && near(decoded[1]![1], -120.95));
ok('decode p3', near(decoded[2]![0], 43.252) && near(decoded[2]![1], -126.453));

// ---- single point ----
ok('encode single point', encodePolyline([[38.5, -120.2]]) === '_p~iF~ps|U');
ok('decode single point', near(decodePolyline('_p~iF~ps|U')[0]![0], 38.5));

// ---- empty ----
ok('encode empty', encodePolyline([]) === '');
ok('decode empty', decodePolyline('').length === 0);

// ---- precision 6 round-trip ----
const p6: LatLng[] = [[38.500000, -120.200000], [40.700000, -120.950000]];
const enc6 = encodePolyline(p6, 6);
const dec6 = decodePolyline(enc6, 6);
ok('precision 6 round-trips', near(dec6[0]![0], 38.5) && near(dec6[1]![1], -120.95));
ok('precision 5 vs 6 differ', enc6 !== encodePolyline(p6, 5));

// ---- round-trip fuzz (deterministic LCG) ----
let seed = 42424242;
for (let t = 0; t < 100; t++) {
  const n = (seed % 8) + 1;
  const pts: LatLng[] = [];
  for (let i = 0; i < n; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff; const lat = (seed % 18000000) / 100000 - 90;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff; const lng = (seed % 36000000) / 100000 - 180;
    pts.push([lat, lng]);
  }
  const back = decodePolyline(encodePolyline(pts));
  ok(`fuzz #${t}`, back.length === pts.length && back.every((c, i) => near(c[0], pts[i]![0]) && near(c[1], pts[i]![1])));
}

// ---- GeoJSON (swaps to [lng, lat]) ----
const gj = polylineToGeoJSON(decoded);
ok('geojson LineString', gj.type === 'LineString' && gj.coordinates.length === 3);
ok('geojson lng,lat order', near(gj.coordinates[0]![0], -120.2) && near(gj.coordinates[0]![1], 38.5));

// ---- rejection ----
let threw = false; try { decodePolyline('_p~iF~ps'); } catch { threw = true; } // truncated pair
ok('rejects truncated', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
