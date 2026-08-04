/**
 * Google's Encoded Polyline Algorithm — encode and decode. A polyline is a
 * compact ASCII string representing a list of latitude/longitude points, used
 * by the Google Maps Directions API and many mapping tools. Coordinates are
 * stored as base-32 varint deltas, scaled by 10^precision (5 by default; 6 for
 * higher-precision variants). Pure and deterministic.
 *
 * Note: polyline coordinate order is [latitude, longitude].
 */

export type LatLng = [number, number];

const round = (v: number) => Math.floor(Math.abs(v) + 0.5) * (v >= 0 ? 1 : -1);

function encodeValue(delta: number): string {
  let v = delta < 0 ? ~(delta << 1) : delta << 1;
  let out = '';
  while (v >= 0x20) {
    out += String.fromCharCode((0x20 | (v & 0x1f)) + 63);
    v >>= 5;
  }
  out += String.fromCharCode(v + 63);
  return out;
}

/** Encode a list of [lat, lng] points into a Google-encoded polyline string. */
export function encodePolyline(points: LatLng[], precision = 5): string {
  const factor = Math.pow(10, precision);
  let prevLat = 0, prevLng = 0, out = '';
  for (const [lat, lng] of points) {
    const late = round(lat * factor);
    const lnge = round(lng * factor);
    out += encodeValue(late - prevLat);
    out += encodeValue(lnge - prevLng);
    prevLat = late; prevLng = lnge;
  }
  return out;
}

/** Decode a Google-encoded polyline string into a list of [lat, lng] points. */
export function decodePolyline(str: string, precision = 5): LatLng[] {
  const factor = Math.pow(10, precision);
  const coords: LatLng[] = [];
  let index = 0, lat = 0, lng = 0;
  const next = (): number => {
    let shift = 1, result = 0, byte: number;
    do {
      if (index >= str.length) throw new Error('Malformed polyline: unexpected end of string.');
      byte = str.charCodeAt(index++) - 63;
      if (byte < 0) throw new Error('Invalid polyline character.');
      result += (byte & 0x1f) * shift;
      shift *= 32;
    } while (byte >= 0x20);
    return (result & 1) ? (-result - 1) / 2 : result / 2;
  };
  while (index < str.length) {
    lat += next();
    lng += next();
    coords.push([lat / factor, lng / factor]);
  }
  return coords;
}

/** Decoded polyline → GeoJSON LineString (GeoJSON uses [lng, lat] order). */
export function polylineToGeoJSON(points: LatLng[]): { type: 'LineString'; coordinates: number[][] } {
  return { type: 'LineString', coordinates: points.map(([lat, lng]) => [lng, lat]) };
}
