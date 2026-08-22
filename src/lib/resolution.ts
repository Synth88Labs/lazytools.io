/**
 * Pure helpers for describing a camera resolution: the reduced aspect ratio and
 * a common name (720p, 1080p, 4K…). Used by the Webcam & Mic Test. Deterministic.
 */
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

/** Reduced aspect ratio as "w:h" (e.g. 1280×720 -> "16:9"). */
export function aspectRatio(w: number, h: number): string {
  if (w <= 0 || h <= 0) return '—';
  const g = gcd(w, h) || 1;
  return `${w / g}:${h / g}`;
}

const NAMES: Record<number, string> = { 2160: '4K UHD', 1440: '1440p (QHD)', 1080: '1080p (Full HD)', 720: '720p (HD)', 480: '480p (SD)', 360: '360p' };

/** A human-readable resolution label, e.g. "1280×720 (16:9, 720p (HD))". */
export function resolutionLabel(w: number, h: number): string {
  if (!w || !h) return 'unknown';
  const name = NAMES[h];
  return `${w}×${h} (${aspectRatio(w, h)}${name ? `, ${name}` : ''})`;
}
