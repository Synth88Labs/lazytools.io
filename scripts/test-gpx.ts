import { parseGpxPoints, haversineMeters, gpxStats, gpxToGeoJSON, geoJSONToGpx } from '../src/lib/gpx.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

const GPX = `<?xml version="1.0"?>
<gpx version="1.1" creator="test">
  <wpt lat="51.5" lon="-0.1"><name>Start Point</name></wpt>
  <trk><name>Ride</name><trkseg>
    <trkpt lat="51.5000" lon="-0.1000"><ele>10</ele><time>2024-01-01T10:00:00Z</time></trkpt>
    <trkpt lat="51.5090" lon="-0.1000"><ele>25</ele><time>2024-01-01T10:10:00Z</time></trkpt>
    <trkpt lat="51.5090" lon="-0.0800"><ele>15</ele><time>2024-01-01T10:20:00Z</time></trkpt>
  </trkseg></trk>
</gpx>`;

// ---- haversine sanity: 1° latitude ≈ 111.2 km ----
ok('haversine 1° lat ≈ 111 km', near(haversineMeters({ lat: 0, lon: 0 }, { lat: 1, lon: 0 }), 111195, 500));
ok('haversine same point = 0', haversineMeters({ lat: 5, lon: 5 }, { lat: 5, lon: 5 }) === 0);

// ---- parse ----
const pts = parseGpxPoints(GPX);
ok('parsed 3 track points', pts.length === 3);
ok('point lat/lon', pts[0].lat === 51.5 && pts[0].lon === -0.1);
ok('point elevation', pts[1].ele === 25);
ok('point time', pts[0].time === '2024-01-01T10:00:00Z');
let threw = false; try { parseGpxPoints('<html></html>'); } catch { threw = true; }
ok('rejects non-GPX', threw);

// ---- stats ----
const s = gpxStats(pts);
// leg 1: 51.500→51.509 lat (~0.009°) ≈ 1001 m; leg 2: 0.02° lon at lat 51.509 ≈ 1387 m → total ~2.39 km
ok('distance ~2.39 km', near(s.distanceKm, 2.39, 0.1));
ok('elev gain = 15 (10→25)', near(s.elevGain, 15, 0.001));
ok('elev loss = 10 (25→15)', near(s.elevLoss, 10, 0.001));
ok('min/max ele 10/25', s.minEle === 10 && s.maxEle === 25);
ok('duration 1200 s', s.durationS === 1200);
ok('avg speed > 0', (s.avgSpeedKmh ?? 0) > 0);
ok('avg pace > 0', (s.avgPaceMinPerKm ?? 0) > 0);

// ---- GPX → GeoJSON ----
const gj = JSON.parse(gpxToGeoJSON(GPX));
ok('geojson FeatureCollection', gj.type === 'FeatureCollection');
const line = gj.features.find((f: any) => f.geometry.type === 'LineString');
ok('geojson LineString 3 coords', line.geometry.coordinates.length === 3);
ok('geojson coord order [lon,lat,ele]', line.geometry.coordinates[0][0] === -0.1 && line.geometry.coordinates[0][1] === 51.5 && line.geometry.coordinates[0][2] === 10);
const wpt = gj.features.find((f: any) => f.geometry.type === 'Point');
ok('geojson waypoint with name', wpt && wpt.properties.name === 'Start Point');

// ---- GeoJSON → GPX round-trip ----
const gpx2 = geoJSONToGpx(gpxToGeoJSON(GPX));
ok('roundtrip is GPX', gpx2.includes('<gpx') && gpx2.includes('<trkpt'));
const pts2 = parseGpxPoints(gpx2);
ok('roundtrip preserves 3 trackpoints', pts2.length === 3);
ok('roundtrip preserves coords', pts2[2].lat === 51.509 && pts2[2].lon === -0.08);
let threwG = false; try { geoJSONToGpx('{"nope":1}'); } catch { threwG = true; }
ok('geoJSONToGpx rejects non-geojson', threwG);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
