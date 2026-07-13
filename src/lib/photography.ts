/**
 * Photography optics math. Standard formulas (hyperfocal distance, depth of
 * field, angle of view, exposure value) and sensor data. Circle of confusion
 * uses the common CoC = sensor diagonal ÷ 1500 (Zeiss) convention; crop factor
 * = 43.267 mm (full-frame diagonal) ÷ the sensor diagonal. Cited on each tool
 * page. Do not invent sensor dimensions; verify against manufacturer specs.
 */

const FF_DIAGONAL = Math.sqrt(36 * 36 + 24 * 24); // 43.2666 mm

export interface Sensor { id: string; name: string; width: number; height: number }
/** Common sensor formats (physical dimensions in mm). */
export const SENSORS: Sensor[] = [
  { id: 'mf', name: 'Medium format (44×33)', width: 43.8, height: 32.9 },
  { id: 'ff', name: 'Full frame (35mm)', width: 36, height: 24 },
  { id: 'apsh', name: 'APS-H (Canon)', width: 28.7, height: 19.1 },
  { id: 'apsc-nikon', name: 'APS-C (Nikon/Sony/Fuji)', width: 23.5, height: 15.6 },
  { id: 'apsc-canon', name: 'APS-C (Canon)', width: 22.3, height: 14.9 },
  { id: 'mft', name: 'Micro Four Thirds', width: 17.3, height: 13 },
  { id: 'one-inch', name: '1-inch type', width: 13.2, height: 8.8 },
  { id: 'phone', name: 'Smartphone (1/1.7")', width: 7.6, height: 5.7 },
];
export const getSensor = (id: string) => SENSORS.find((s) => s.id === id);

export const diagonal = (s: Sensor) => Math.sqrt(s.width * s.width + s.height * s.height);
export const cropFactor = (s: Sensor) => FF_DIAGONAL / diagonal(s);
/** Circle of confusion (mm) = sensor diagonal ÷ 1500. */
export const circleOfConfusion = (s: Sensor) => diagonal(s) / 1500;

/* ---------------- Hyperfocal & depth of field ---------------- */

/** Hyperfocal distance (metres) from focal length (mm), f-number and CoC (mm). */
export function hyperfocalM(focalMm: number, fNumber: number, cocMm: number): number {
  return (focalMm * focalMm / (fNumber * cocMm) + focalMm) / 1000;
}

export interface DoF { nearM: number; farM: number | null; totalM: number | null; hyperfocalM: number; inFrontM: number; behindM: number | null }
/** Depth of field for a subject at distance s (metres). */
export function depthOfField(focalMm: number, fNumber: number, cocMm: number, sM: number): DoF {
  const H = hyperfocalM(focalMm, fNumber, cocMm); // metres
  const f = focalMm / 1000; // metres
  const s = sM;
  // Exact hyperfocal-based DoF (Wikipedia / Berkeley): Dn = s(H−f)/(H+s−2f), Df = s(H−f)/(H−s).
  const near = (s * (H - f)) / (H + s - 2 * f);
  let far: number | null;
  if (s >= H) far = null; // infinity
  else far = (s * (H - f)) / (H - s);
  return {
    nearM: Math.max(0, near),
    farM: far,
    totalM: far == null ? null : far - near,
    hyperfocalM: H,
    inFrontM: s - Math.max(0, near),
    behindM: far == null ? null : far - s,
  };
}

/* ---------------- Field of view / angle of view ---------------- */

/** Angle of view (degrees) for a sensor dimension (mm) and focal length (mm). */
export function angleOfView(sensorDimMm: number, focalMm: number): number {
  return 2 * Math.atan(sensorDimMm / (2 * focalMm)) * (180 / Math.PI);
}
/** Frame size (metres) covered at a given distance (metres) for an angle of view (deg). */
export function frameSizeM(angleDeg: number, distanceM: number): number {
  return 2 * distanceM * Math.tan((angleDeg / 2) * (Math.PI / 180));
}

/* ---------------- Exposure ---------------- */

/** Exposure value at ISO 100: EV = log2(N² / t). t = shutter time (seconds). */
export function ev100(fNumber: number, shutterSec: number): number {
  return Math.log2((fNumber * fNumber) / shutterSec);
}
/** Scene EV allowing for ISO: EV = log2(N²/t) − log2(ISO/100). */
export function evAtIso(fNumber: number, shutterSec: number, iso: number): number {
  return ev100(fNumber, shutterSec) - Math.log2(iso / 100);
}
/** Sunny-16: correct shutter (seconds) at f/16 in bright sun ≈ 1/ISO. Scaled for aperture. */
export function sunny16Shutter(iso: number, fNumber: number, evAdjust = 0): number {
  // base at f/16: 1/ISO. Opening up (smaller N) needs faster shutter by the light ratio.
  const baseT = 1 / iso; // at f/16
  const stops = Math.log2((16 * 16) / (fNumber * fNumber)); // stops brighter than f/16
  return baseT / Math.pow(2, stops + evAdjust);
}

/* ---------------- Time-lapse ---------------- */

export function timelapse(shootSeconds: number, intervalSec: number, fps: number) {
  const shots = Math.floor(shootSeconds / intervalSec) + 1;
  const clipSec = shots / fps;
  return { shots, clipSec };
}

/* ---------------- Print resolution ---------------- */

/** Print dimension (inches) = pixels ÷ DPI. */
export function printInches(pixels: number, dpi: number): number { return pixels / dpi; }
export function megapixels(w: number, h: number): number { return (w * h) / 1e6; }

/* ---------------- Astro: max shutter before star trails ---------------- */

/**
 * Longest exposure (seconds) before stars visibly trail, by the "rule of N"
 * for a static tripod: seconds = N ÷ (focal length in mm × crop factor). N is
 * traditionally 500 (lenient) or 300/200 for pixel-peeping or high-res sensors.
 * The crop factor converts the lens to its full-frame-equivalent field of view.
 */
export function maxShutterSeconds(focalMm: number, crop: number, rule = 500): number {
  if (focalMm <= 0 || crop <= 0) return 0;
  return rule / (focalMm * crop);
}

/* ---------------- Flash guide number ---------------- */

/**
 * Flash guide number relates aperture and distance: GN = f-number × distance.
 * So the correct aperture at a distance is GN ÷ distance, and the reach at a
 * given aperture is GN ÷ f-number. GN is quoted at ISO 100 for a distance unit
 * (metres or feet); doubling ISO multiplies effective GN by √2.
 */
export const flashAperture = (gn: number, distance: number) => distance > 0 ? gn / distance : 0;
export const flashDistance = (gn: number, fStop: number) => fStop > 0 ? gn / fStop : 0;
/** Effective guide number at a different ISO: GN × √(ISO ÷ 100). */
export const flashGnAtIso = (gn100: number, iso: number) => gn100 * Math.sqrt(iso / 100);

/* ---------------- ND filter exposure ---------------- */

/**
 * New shutter time (seconds) after adding a neutral-density filter of `stops`.
 * Each stop doubles the exposure time, so time = base × 2^stops. A 10-stop ND
 * turns 1/60 s into about 17 seconds.
 */
export function ndShutter(baseSeconds: number, stops: number): number | null {
  if (baseSeconds <= 0 || stops < 0) return null;
  return baseSeconds * Math.pow(2, stops);
}

/* ---------------- Diffraction limit ---------------- */

/** Green-light wavelength used for diffraction estimates (µm). */
export const DIFFRACTION_LAMBDA_UM = 0.55;
/** Airy-disk diameter (µm) at an aperture: d = 2.44 · λ · N (N = f-number). */
export function airyDiskUm(fNumber: number, lambdaUm = DIFFRACTION_LAMBDA_UM): number | null {
  if (fNumber <= 0) return null;
  return 2.44 * lambdaUm * fNumber;
}
/** Pixel pitch (µm) from a sensor width (mm) and its horizontal pixel count. */
export function pixelPitchUm(sensorWidthMm: number, horizontalPixels: number): number | null {
  if (sensorWidthMm <= 0 || horizontalPixels <= 0) return null;
  return (sensorWidthMm / horizontalPixels) * 1000;
}
/**
 * Diffraction-limited aperture — the f-number where the Airy disk diameter
 * first equals the pixel pitch, i.e. where stopping down further starts to
 * soften per-pixel detail: N = pixelPitch ÷ (2.44 · λ).
 */
export function diffractionApertureN(pixelPitchUm: number, lambdaUm = DIFFRACTION_LAMBDA_UM): number | null {
  if (pixelPitchUm <= 0) return null;
  return pixelPitchUm / (2.44 * lambdaUm);
}

export { FF_DIAGONAL };
