/**
 * Convert between OGC Well-Known Text (WKT) and GeoJSON geometry (RFC 7946).
 * Supports Point, LineString, Polygon, their Multi* variants and
 * GeometryCollection, plus EMPTY geometries and optional Z coordinates. Both
 * formats use X Y (longitude latitude) order, so no axis swap is needed. Pure
 * and deterministic.
 */

type Coord = number[];
export interface Geometry { type: string; coordinates?: unknown; geometries?: Geometry[]; }

// ---------------------------------------------------------------------------
// WKT → GeoJSON
// ---------------------------------------------------------------------------

/** Parse a balanced ( ... ) group into nested arrays of coordinate tuples. */
function parseGroup(s: string, i: number): [unknown, number] {
  while (s[i] === ' ') i++;
  if (s[i] !== '(') throw new Error(`Expected "(" at position ${i}`);
  i++;
  while (s[i] === ' ') i++;
  const result: unknown[] = [];
  if (s[i] === '(') {
    // A group of sub-groups.
    while (true) {
      const [child, ni] = parseGroup(s, i); i = ni;
      result.push(child);
      while (s[i] === ' ') i++;
      if (s[i] === ',') { i++; while (s[i] === ' ') i++; continue; }
      if (s[i] === ')') { i++; break; }
      throw new Error(`Expected "," or ")" at position ${i}`);
    }
  } else {
    // A comma-separated list of "x y [z]" tuples.
    let buf = '';
    while (i < s.length && s[i] !== ')') { buf += s[i]; i++; }
    if (s[i] !== ')') throw new Error('Unterminated group');
    i++;
    for (const part of buf.split(',')) {
      const nums = part.trim().split(/\s+/).map(Number);
      if (nums.some((n) => Number.isNaN(n))) throw new Error(`Invalid coordinate "${part.trim()}"`);
      result.push(nums as Coord);
    }
  }
  return [result, i];
}

const EMPTY_COORDS: Record<string, unknown> = {
  POINT: [], LINESTRING: [], POLYGON: [], MULTIPOINT: [], MULTILINESTRING: [], MULTIPOLYGON: [],
};

/** Split the top-level comma-separated geometries of a GEOMETRYCOLLECTION body. */
function splitTopLevel(s: string): string[] {
  const out: string[] = []; let depth = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if (s[i] === ',' && depth === 0) { out.push(s.slice(start, i)); start = i + 1; }
  }
  out.push(s.slice(start));
  return out.map((x) => x.trim()).filter(Boolean);
}

export function wktToGeoJSON(wkt: string): Geometry {
  const s = wkt.trim();
  const m = s.match(/^([A-Za-z]+)\s*(ZM|Z|M)?\s*/);
  if (!m) throw new Error('Not a WKT geometry, expected a type like POINT or POLYGON.');
  const type = m[1]!.toUpperCase();
  const rest = s.slice(m[0].length).trim();

  if (/^EMPTY$/i.test(rest)) {
    if (type === 'GEOMETRYCOLLECTION') return { type: 'GeometryCollection', geometries: [] };
    if (!(type in EMPTY_COORDS)) throw new Error(`Unknown WKT type "${type}"`);
    return { type: toGeoType(type), coordinates: EMPTY_COORDS[type] };
  }

  if (type === 'GEOMETRYCOLLECTION') {
    const inner = rest.replace(/^\(/, '').replace(/\)$/, '');
    return { type: 'GeometryCollection', geometries: splitTopLevel(inner).map(wktToGeoJSON) };
  }

  const [parsed] = parseGroup(rest, 0);
  const coords = parsed as unknown[];
  switch (type) {
    case 'POINT': return { type: 'Point', coordinates: coords[0] };
    case 'LINESTRING': return { type: 'LineString', coordinates: coords };
    case 'POLYGON': return { type: 'Polygon', coordinates: coords };
    case 'MULTIPOINT': return { type: 'MultiPoint', coordinates: coords.map((c) => (Array.isArray((c as unknown[])[0]) ? (c as unknown[])[0] : c)) };
    case 'MULTILINESTRING': return { type: 'MultiLineString', coordinates: coords };
    case 'MULTIPOLYGON': return { type: 'MultiPolygon', coordinates: coords };
    default: throw new Error(`Unknown WKT type "${type}"`);
  }
}

function toGeoType(wktType: string): string {
  return ({ POINT: 'Point', LINESTRING: 'LineString', POLYGON: 'Polygon', MULTIPOINT: 'MultiPoint', MULTILINESTRING: 'MultiLineString', MULTIPOLYGON: 'MultiPolygon' } as Record<string, string>)[wktType] ?? wktType;
}

// ---------------------------------------------------------------------------
// GeoJSON → WKT
// ---------------------------------------------------------------------------

const fmtPt = (c: Coord) => c.join(' ');
const fmtRing = (r: Coord[]) => '(' + r.map(fmtPt).join(', ') + ')';
const fmtPoly = (p: Coord[][]) => '(' + p.map(fmtRing).join(', ') + ')';

export function geoJSONToWkt(input: unknown): string {
  const g = input as { type?: string; coordinates?: any; geometries?: any[]; geometry?: any; features?: any[] };
  if (!g || typeof g !== 'object' || !g.type) throw new Error('Not a GeoJSON object (missing "type").');
  const t = g.type;
  if (t === 'Feature') return geoJSONToWkt(g.geometry);
  if (t === 'FeatureCollection') return 'GEOMETRYCOLLECTION (' + (g.features ?? []).map((f) => geoJSONToWkt(f.geometry)).join(', ') + ')';
  if (t === 'GeometryCollection') return 'GEOMETRYCOLLECTION (' + (g.geometries ?? []).map(geoJSONToWkt).join(', ') + ')';

  const c = g.coordinates;
  const empty = !c || (Array.isArray(c) && c.length === 0);
  switch (t) {
    case 'Point': return empty ? 'POINT EMPTY' : `POINT (${fmtPt(c)})`;
    case 'LineString': return empty ? 'LINESTRING EMPTY' : `LINESTRING (${(c as Coord[]).map(fmtPt).join(', ')})`;
    case 'Polygon': return empty ? 'POLYGON EMPTY' : `POLYGON ${fmtPoly(c)}`;
    case 'MultiPoint': return empty ? 'MULTIPOINT EMPTY' : `MULTIPOINT (${(c as Coord[]).map(fmtPt).join(', ')})`;
    case 'MultiLineString': return empty ? 'MULTILINESTRING EMPTY' : `MULTILINESTRING (${(c as Coord[][]).map(fmtRing).join(', ')})`;
    case 'MultiPolygon': return empty ? 'MULTIPOLYGON EMPTY' : `MULTIPOLYGON (${(c as Coord[][][]).map(fmtPoly).join(', ')})`;
    default: throw new Error(`Unsupported GeoJSON geometry type "${t}"`);
  }
}
