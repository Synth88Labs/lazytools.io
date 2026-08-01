/**
 * GPX (GPS Exchange Format) parsing, statistics and GPX↔GeoJSON conversion.
 * Pure and deterministic (regex-based XML handling so it runs in Node tests and
 * the browser identically). Distances use the haversine formula on the WGS-84
 * mean Earth radius; elevation gain/loss is summed from consecutive points.
 */

export interface GpxPoint { lat: number; lon: number; ele?: number; time?: string }

const EARTH_RADIUS_M = 6371008.8; // IUGG mean radius

/** Great-circle distance in metres between two lat/lon points (haversine). */
export function haversineMeters(a: GpxPoint, b: GpxPoint): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat), la2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

function unescapeXml(s: string): string {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Extract every <trkpt>/<rtept> point (in document order) from GPX XML. */
export function parseGpxPoints(xml: string): GpxPoint[] {
  if (!/<gpx[\s>]/i.test(xml)) throw new Error('Not a GPX file (no <gpx> root element found).');
  const pts: GpxPoint[] = [];
  const re = /<(?:trkpt|rtept)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:trkpt|rtept)>)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const attrs = m[1];
    const inner = m[2] ?? '';
    const lat = parseFloat((/\blat\s*=\s*["']([^"']+)["']/i.exec(attrs) || [])[1] ?? '');
    const lon = parseFloat((/\blon\s*=\s*["']([^"']+)["']/i.exec(attrs) || [])[1] ?? '');
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const p: GpxPoint = { lat, lon };
    const ele = /<ele>\s*([^<]+?)\s*<\/ele>/i.exec(inner);
    if (ele) { const e = parseFloat(ele[1]); if (Number.isFinite(e)) p.ele = e; }
    const time = /<time>\s*([^<]+?)\s*<\/time>/i.exec(inner);
    if (time) p.time = time[1].trim();
    pts.push(p);
  }
  return pts;
}

export interface GpxStats {
  points: number;
  distanceM: number; distanceKm: number; distanceMi: number;
  elevGain: number; elevLoss: number;
  minEle: number | null; maxEle: number | null;
  durationS: number | null;
  avgSpeedKmh: number | null; avgPaceMinPerKm: number | null;
}
/** Compute distance, elevation gain/loss, duration and pace for a set of points. */
export function gpxStats(points: GpxPoint[]): GpxStats {
  let distanceM = 0, elevGain = 0, elevLoss = 0;
  let minEle: number | null = null, maxEle: number | null = null;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.ele != null) {
      minEle = minEle == null ? p.ele : Math.min(minEle, p.ele);
      maxEle = maxEle == null ? p.ele : Math.max(maxEle, p.ele);
    }
    if (i > 0) {
      distanceM += haversineMeters(points[i - 1], p);
      const prevE = points[i - 1].ele, curE = p.ele;
      if (prevE != null && curE != null) {
        const d = curE - prevE;
        if (d > 0) elevGain += d; else elevLoss += -d;
      }
    }
  }
  const first = points.find((p) => p.time)?.time;
  const last = [...points].reverse().find((p) => p.time)?.time;
  let durationS: number | null = null;
  if (first && last) {
    const t0 = Date.parse(first), t1 = Date.parse(last);
    if (Number.isFinite(t0) && Number.isFinite(t1) && t1 >= t0) durationS = (t1 - t0) / 1000;
  }
  const distanceKm = distanceM / 1000;
  const avgSpeedKmh = durationS && durationS > 0 ? distanceKm / (durationS / 3600) : null;
  const avgPaceMinPerKm = durationS && distanceKm > 0 ? (durationS / 60) / distanceKm : null;
  return {
    points: points.length,
    distanceM, distanceKm, distanceMi: distanceKm / 1.609344,
    elevGain, elevLoss, minEle, maxEle,
    durationS, avgSpeedKmh, avgPaceMinPerKm,
  };
}

/** Convert GPX XML to a GeoJSON FeatureCollection (track → LineString, waypoints → Points). */
export function gpxToGeoJSON(xml: string): string {
  const trackPts = parseGpxPoints(xml);
  const features: unknown[] = [];
  if (trackPts.length) {
    features.push({
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: trackPts.map((p) => (p.ele != null ? [p.lon, p.lat, p.ele] : [p.lon, p.lat])) },
    });
  }
  // Standalone <wpt> waypoints become Point features.
  const wptRe = /<wpt\b([^>]*?)(?:\/>|>([\s\S]*?)<\/wpt>)/gi;
  let m: RegExpExecArray | null;
  while ((m = wptRe.exec(xml)) !== null) {
    const lat = parseFloat((/\blat\s*=\s*["']([^"']+)["']/i.exec(m[1]) || [])[1] ?? '');
    const lon = parseFloat((/\blon\s*=\s*["']([^"']+)["']/i.exec(m[1]) || [])[1] ?? '');
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const nameM = /<name>\s*([^<]+?)\s*<\/name>/i.exec(m[2] ?? '');
    features.push({ type: 'Feature', properties: nameM ? { name: unescapeXml(nameM[1]) } : {}, geometry: { type: 'Point', coordinates: [lon, lat] } });
  }
  if (!features.length) throw new Error('No track points or waypoints found in the GPX.');
  return JSON.stringify({ type: 'FeatureCollection', features }, null, 2);
}

/** Convert GeoJSON (Point/LineString/MultiLineString + Features) to GPX 1.1 XML. */
export function geoJSONToGpx(json: string): string {
  let data: any;
  try { data = JSON.parse(json); } catch (e) { throw new Error('Invalid JSON — ' + (e as Error).message); }
  const features: any[] = data.type === 'FeatureCollection' ? (data.features || [])
    : data.type === 'Feature' ? [data]
    : data.type ? [{ type: 'Feature', properties: {}, geometry: data }] : [];
  if (!features.length) throw new Error('Expected GeoJSON with at least one Feature or geometry.');
  const wpts: string[] = [];
  const trksegs: string[] = [];
  const coordToTrkpt = (c: number[]) => `      <trkpt lat="${c[1]}" lon="${c[0]}">${c[2] != null ? `<ele>${c[2]}</ele>` : ''}</trkpt>`;
  for (const f of features) {
    const g = f.geometry; if (!g) continue;
    const name = f.properties && f.properties.name ? `<name>${escapeXml(String(f.properties.name))}</name>` : '';
    if (g.type === 'Point') {
      const c = g.coordinates; wpts.push(`  <wpt lat="${c[1]}" lon="${c[0]}">${c[2] != null ? `<ele>${c[2]}</ele>` : ''}${name}</wpt>`);
    } else if (g.type === 'LineString') {
      trksegs.push(`    <trkseg>\n${g.coordinates.map(coordToTrkpt).join('\n')}\n    </trkseg>`);
    } else if (g.type === 'MultiLineString') {
      for (const line of g.coordinates) trksegs.push(`    <trkseg>\n${line.map(coordToTrkpt).join('\n')}\n    </trkseg>`);
    }
  }
  const trk = trksegs.length ? `  <trk>\n${trksegs.join('\n')}\n  </trk>\n` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="LazyTools" xmlns="http://www.topografix.com/GPX/1/1">\n${wpts.join('\n')}${wpts.length ? '\n' : ''}${trk}</gpx>`;
}
