import { wktToGeoJSON, geoJSONToWkt } from '../src/lib/wkt.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const eq = (name: string, a: unknown, b: unknown) => ok(name, JSON.stringify(a) === JSON.stringify(b));

// ---- WKT → GeoJSON (canonical OGC / Wikipedia examples) ----
eq('POINT', wktToGeoJSON('POINT (30 10)'), { type: 'Point', coordinates: [30, 10] });
eq('LINESTRING', wktToGeoJSON('LINESTRING (30 10, 10 30, 40 40)'), { type: 'LineString', coordinates: [[30, 10], [10, 30], [40, 40]] });
eq('POLYGON', wktToGeoJSON('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))'), { type: 'Polygon', coordinates: [[[30, 10], [40, 40], [20, 40], [10, 20], [30, 10]]] });
eq('POLYGON with hole', wktToGeoJSON('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30))'),
  { type: 'Polygon', coordinates: [[[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], [[20, 30], [35, 35], [30, 20], [20, 30]]] });
eq('MULTIPOINT paren form', wktToGeoJSON('MULTIPOINT ((10 40), (40 30), (20 20), (30 10))'), { type: 'MultiPoint', coordinates: [[10, 40], [40, 30], [20, 20], [30, 10]] });
eq('MULTIPOINT bare form', wktToGeoJSON('MULTIPOINT (10 40, 40 30, 20 20, 30 10)'), { type: 'MultiPoint', coordinates: [[10, 40], [40, 30], [20, 20], [30, 10]] });
eq('MULTILINESTRING', wktToGeoJSON('MULTILINESTRING ((10 10, 20 20, 10 40), (40 40, 30 30, 40 20, 30 10))'),
  { type: 'MultiLineString', coordinates: [[[10, 10], [20, 20], [10, 40]], [[40, 40], [30, 30], [40, 20], [30, 10]]] });
eq('MULTIPOLYGON', wktToGeoJSON('MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))'),
  { type: 'MultiPolygon', coordinates: [[[[30, 20], [45, 40], [10, 40], [30, 20]]], [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]]] });

// GeometryCollection
const gc = wktToGeoJSON('GEOMETRYCOLLECTION (POINT (40 10), LINESTRING (10 10, 20 20, 10 40))');
eq('GEOMETRYCOLLECTION', gc, { type: 'GeometryCollection', geometries: [{ type: 'Point', coordinates: [40, 10] }, { type: 'LineString', coordinates: [[10, 10], [20, 20], [10, 40]] }] });

// Z coordinates + EMPTY
eq('POINT Z', wktToGeoJSON('POINT Z (30 10 5)'), { type: 'Point', coordinates: [30, 10, 5] });
eq('POINT EMPTY', wktToGeoJSON('POINT EMPTY'), { type: 'Point', coordinates: [] });

// ---- GeoJSON → WKT ----
ok('→ POINT', geoJSONToWkt({ type: 'Point', coordinates: [30, 10] }) === 'POINT (30 10)');
ok('→ LINESTRING', geoJSONToWkt({ type: 'LineString', coordinates: [[30, 10], [10, 30]] }) === 'LINESTRING (30 10, 10 30)');
ok('→ POLYGON', geoJSONToWkt({ type: 'Polygon', coordinates: [[[30, 10], [40, 40], [20, 40], [30, 10]]] }) === 'POLYGON ((30 10, 40 40, 20 40, 30 10))');
ok('→ MULTIPOINT', geoJSONToWkt({ type: 'MultiPoint', coordinates: [[10, 40], [40, 30]] }) === 'MULTIPOINT (10 40, 40 30)');
ok('→ MULTIPOLYGON', geoJSONToWkt({ type: 'MultiPolygon', coordinates: [[[[30, 20], [45, 40], [10, 40], [30, 20]]]] }) === 'MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)))');
ok('→ Feature unwraps geometry', geoJSONToWkt({ type: 'Feature', geometry: { type: 'Point', coordinates: [1, 2] }, properties: {} }) === 'POINT (1 2)');
ok('→ GeometryCollection', geoJSONToWkt(gc) === 'GEOMETRYCOLLECTION (POINT (40 10), LINESTRING (10 10, 20 20, 10 40))');
ok('→ POINT EMPTY', geoJSONToWkt({ type: 'Point', coordinates: [] }) === 'POINT EMPTY');

// ---- round-trips (WKT → GeoJSON → WKT) ----
for (const w of [
  'POINT (30 10)',
  'LINESTRING (30 10, 10 30, 40 40)',
  'POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30))',
  'MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)), ((15 5, 40 10, 10 20, 5 10, 15 5)))',
  'GEOMETRYCOLLECTION (POINT (40 10), LINESTRING (10 10, 20 20, 10 40))',
]) {
  ok(`round-trip ${w.slice(0, 14)}…`, geoJSONToWkt(wktToGeoJSON(w)) === w);
}

// ---- rejections ----
const reject = (fn: () => unknown, label: string) => { let t = false; try { fn(); } catch { t = true; } ok(label, t); };
reject(() => wktToGeoJSON('BANANA (1 2)'), 'rejects unknown type');
reject(() => wktToGeoJSON('POINT (30 abc)'), 'rejects bad coordinate');
reject(() => geoJSONToWkt({ type: 'Nope', coordinates: [] }), 'rejects unknown geojson type');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
