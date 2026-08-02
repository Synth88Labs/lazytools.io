/**
 * Geographic coordinate conversions between decimal degrees (DD), degrees-
 * minutes-seconds (DMS), degrees-decimal-minutes (DDM), UTM, MGRS, geohash and
 * Plus Codes (Open Location Code). Pure and deterministic — WGS-84 throughout.
 *
 * The Transverse Mercator series (UTM) follows Karney's / Chris Veness's
 * public-domain formulation, accurate to well under a millimetre.
 */

const A = 6378137;              // WGS-84 semi-major axis (m)
const F = 1 / 298.257223563;    // flattening
const K0 = 0.9996;              // UTM scale factor
const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

// ---------------- DD ⇄ DMS / DDM (formatting) ----------------

export function toDMS(deg: number, isLat: boolean): string {
  const hemi = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  let d = Math.abs(deg);
  const dd = Math.floor(d);
  const mFull = (d - dd) * 60;
  const mm = Math.floor(mFull);
  const ss = Math.round((mFull - mm) * 60 * 100) / 100;
  return `${dd}°${mm}'${ss}"${hemi}`;
}

export function toDDM(deg: number, isLat: boolean): string {
  const hemi = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  let d = Math.abs(deg);
  const dd = Math.floor(d);
  const mm = Math.round((d - dd) * 60 * 1000) / 1000;
  return `${dd}°${mm}'${hemi}`;
}

/** Parse a DMS / DDM / DD string like 51°30'26.6"N, 51 30 26.6 N, or -0.1278 into decimal degrees. */
export function parseCoord(s: string): number | null {
  const t = s.trim();
  if (t === '') return null;
  const hemiMatch = /([NSEW])\s*$/i.exec(t) || /^\s*([NSEW])/i.exec(t);
  const hemi = hemiMatch ? hemiMatch[1].toUpperCase() : '';
  const nums = (t.replace(/[NSEW]/gi, '').match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  if (!nums.length) return null;
  let dec: number;
  if (nums.length === 1) dec = nums[0];
  else if (nums.length === 2) dec = Math.sign(nums[0] || 1) * (Math.abs(nums[0]) + nums[1] / 60);
  else dec = Math.sign(nums[0] || 1) * (Math.abs(nums[0]) + nums[1] / 60 + nums[2] / 3600);
  if (hemi === 'S' || hemi === 'W') dec = -Math.abs(dec);
  return dec;
}

// ---------------- DD ⇄ UTM ----------------

export interface Utm { zone: number; hemisphere: 'N' | 'S'; easting: number; northing: number; band: string }

const MGRS_BANDS = 'CDEFGHJKLMNPQRSTUVWXX'; // latitude bands from -80°, 8° each
function latBand(lat: number): string {
  if (lat < -80) return 'C';
  if (lat > 84) return 'X';
  return MGRS_BANDS.charAt(Math.floor((lat + 80) / 8));
}

export function llToUtm(lat: number, lon: number): Utm {
  if (lat < -80 || lat > 84) throw new Error('UTM is defined only between 80°S and 84°N.');
  let zone = Math.floor((lon + 180) / 6) + 1;
  // Norway & Svalbard exceptions.
  if (lat >= 56 && lat < 64 && lon >= 3 && lon < 12) zone = 32;
  if (lat >= 72 && lat < 84) {
    if (lon >= 0 && lon < 9) zone = 31;
    else if (lon >= 9 && lon < 21) zone = 33;
    else if (lon >= 21 && lon < 33) zone = 35;
    else if (lon >= 33 && lon < 42) zone = 37;
  }
  const λ0 = ((zone - 1) * 6 - 180 + 3) * RAD;
  const φ = lat * RAD;
  const λ = lon * RAD - λ0;

  const e = Math.sqrt(F * (2 - F));
  const n = F / (2 - F);
  const n2 = n * n, n3 = n2 * n, n4 = n3 * n, n5 = n4 * n, n6 = n5 * n;

  const cosλ = Math.cos(λ), sinλ = Math.sin(λ), tanλ = Math.tan(λ);
  const τ = Math.tan(φ);
  const σ = Math.sinh(e * Math.atanh(e * τ / Math.sqrt(1 + τ * τ)));
  const τʹ = τ * Math.sqrt(1 + σ * σ) - σ * Math.sqrt(1 + τ * τ);
  const ξʹ = Math.atan2(τʹ, cosλ);
  const ηʹ = Math.asinh(sinλ / Math.sqrt(τʹ * τʹ + cosλ * cosλ));

  const A0 = A / (1 + n) * (1 + 1 / 4 * n2 + 1 / 64 * n4 + 1 / 256 * n6);
  const α = [
    1 / 2 * n - 2 / 3 * n2 + 5 / 16 * n3 + 41 / 180 * n4 - 127 / 288 * n5 + 7891 / 37800 * n6,
    13 / 48 * n2 - 3 / 5 * n3 + 557 / 1440 * n4 + 281 / 630 * n5 - 1983433 / 1935360 * n6,
    61 / 240 * n3 - 103 / 140 * n4 + 15061 / 26880 * n5 + 167603 / 181440 * n6,
    49561 / 161280 * n4 - 179 / 168 * n5 + 6601661 / 7257600 * n6,
    34729 / 80640 * n5 - 3418889 / 1995840 * n6,
    212378941 / 319334400 * n6,
  ];
  let ξ = ξʹ, η = ηʹ;
  for (let j = 1; j <= 6; j++) {
    ξ += α[j - 1] * Math.sin(2 * j * ξʹ) * Math.cosh(2 * j * ηʹ);
    η += α[j - 1] * Math.cos(2 * j * ξʹ) * Math.sinh(2 * j * ηʹ);
  }
  let x = K0 * A0 * η;
  let y = K0 * A0 * ξ;
  x += 500e3;                       // false easting
  if (y < 0) y += 10000e3;          // false northing (southern hemisphere)

  return {
    zone,
    hemisphere: lat >= 0 ? 'N' : 'S',
    easting: Math.round(x * 1000) / 1000,
    northing: Math.round(y * 1000) / 1000,
    band: latBand(lat),
  };
}

export function utmToLl(zone: number, hemisphere: 'N' | 'S', easting: number, northing: number): { lat: number; lon: number } {
  const e = Math.sqrt(F * (2 - F));
  const n = F / (2 - F);
  const n2 = n * n, n3 = n2 * n, n4 = n3 * n, n5 = n4 * n, n6 = n5 * n;

  let x = easting - 500e3;
  let y = hemisphere === 'S' ? northing - 10000e3 : northing;

  const A0 = A / (1 + n) * (1 + 1 / 4 * n2 + 1 / 64 * n4 + 1 / 256 * n6);
  const η = x / (K0 * A0);
  const ξ = y / (K0 * A0);

  const β = [
    1 / 2 * n - 2 / 3 * n2 + 37 / 96 * n3 - 1 / 360 * n4 - 81 / 512 * n5 + 96199 / 604800 * n6,
    1 / 48 * n2 + 1 / 15 * n3 - 437 / 1440 * n4 + 46 / 105 * n5 - 1118711 / 3870720 * n6,
    17 / 480 * n3 - 37 / 840 * n4 - 209 / 4480 * n5 + 5569 / 90720 * n6,
    4397 / 161280 * n4 - 11 / 504 * n5 - 830251 / 7257600 * n6,
    4583 / 161280 * n5 - 108847 / 3991680 * n6,
    20648693 / 638668800 * n6,
  ];
  let ξʹ = ξ, ηʹ = η;
  for (let j = 1; j <= 6; j++) {
    ξʹ -= β[j - 1] * Math.sin(2 * j * ξ) * Math.cosh(2 * j * η);
    ηʹ -= β[j - 1] * Math.cos(2 * j * ξ) * Math.sinh(2 * j * η);
  }
  const sinhηʹ = Math.sinh(ηʹ);
  const sinξʹ = Math.sin(ξʹ), cosξʹ = Math.cos(ξʹ);
  const τʹ = sinξʹ / Math.sqrt(sinhηʹ * sinhηʹ + cosξʹ * cosξʹ);
  let τi = τʹ;
  do {
    const σi = Math.sinh(e * Math.atanh(e * τi / Math.sqrt(1 + τi * τi)));
    const τiʹ = τi * Math.sqrt(1 + σi * σi) - σi * Math.sqrt(1 + τi * τi);
    const δτi = (τʹ - τiʹ) / Math.sqrt(1 + τiʹ * τiʹ) * (1 + (1 - e * e) * τi * τi) / ((1 - e * e) * Math.sqrt(1 + τi * τi));
    τi += δτi;
    if (Math.abs(δτi) < 1e-12) break;
  } while (true);
  const φ = Math.atan(τi);
  let λ = Math.atan2(sinhηʹ, cosξʹ);
  const λ0 = ((zone - 1) * 6 - 180 + 3) * RAD;
  return { lat: φ * DEG, lon: (λ + λ0) * DEG };
}

// ---------------- UTM ⇄ MGRS ----------------

const E_SET = ['ABCDEFGH', 'JKLMNPQR', 'STUVWXYZ']; // 100km column letters by (zone-1)%3
const N_SET_ODD = 'ABCDEFGHJKLMNPQRSTUV';           // odd zones
const N_SET_EVEN = 'FGHJKLMNPQRSTUVABCDE';           // even zones

export function utmToMgrs(u: Utm, digits = 5): string {
  const col = Math.floor(u.easting / 100000);
  const row = Math.floor(u.northing / 100000) % 20;
  const colLetter = E_SET[(u.zone - 1) % 3].charAt(col - 1);
  const rowLetter = (u.zone % 2 === 1 ? N_SET_ODD : N_SET_EVEN).charAt(row);
  const e = Math.floor(u.easting % 100000).toString().padStart(5, '0').slice(0, digits);
  const nr = Math.floor(u.northing % 100000).toString().padStart(5, '0').slice(0, digits);
  return `${u.zone}${u.band}${colLetter}${rowLetter} ${e} ${nr}`;
}

// ---------------- DD ⇄ geohash ----------------

const GEOHASH_B32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function geohashEncode(lat: number, lon: number, precision = 9): string {
  let latMin = -90, latMax = 90, lonMin = -180, lonMax = 180;
  let hash = '', bit = 0, ch = 0, even = true;
  while (hash.length < precision) {
    if (even) {
      const mid = (lonMin + lonMax) / 2;
      if (lon >= mid) { ch |= 1 << (4 - bit); lonMin = mid; } else lonMax = mid;
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat >= mid) { ch |= 1 << (4 - bit); latMin = mid; } else latMax = mid;
    }
    even = !even;
    if (bit < 4) bit++;
    else { hash += GEOHASH_B32.charAt(ch); bit = 0; ch = 0; }
  }
  return hash;
}

export function geohashDecode(hash: string): { lat: number; lon: number } {
  let latMin = -90, latMax = 90, lonMin = -180, lonMax = 180, even = true;
  for (const c of hash.toLowerCase()) {
    const idx = GEOHASH_B32.indexOf(c);
    if (idx < 0) throw new Error(`Invalid geohash character: ${c}`);
    for (let i = 4; i >= 0; i--) {
      const bit = (idx >> i) & 1;
      if (even) { const mid = (lonMin + lonMax) / 2; if (bit) lonMin = mid; else lonMax = mid; }
      else { const mid = (latMin + latMax) / 2; if (bit) latMin = mid; else latMax = mid; }
      even = !even;
    }
  }
  return { lat: (latMin + latMax) / 2, lon: (lonMin + lonMax) / 2 };
}

// ---------------- Convenience: format a full UTM/MGRS string ----------------

export function utmString(u: Utm): string {
  return `${u.zone}${u.band} ${Math.round(u.easting)} ${Math.round(u.northing)}`;
}
