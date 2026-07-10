/**
 * Client-side photo-compliance heuristics for the Photo Size Maker.
 *
 * Everything here runs on a <canvas> in the browser — the photo is NEVER uploaded.
 * These checks are ASSISTIVE, not a guarantee of acceptance: they catch the common,
 * mechanically-detectable mistakes (non-uniform / wrong-colour background, under/over
 * exposure, wrong output size or format) and, where the browser supports on-device
 * face detection, rough head-size / eye-line / centering. Final compliance is always
 * the issuing authority's call.
 */

import { BG_HEX, headHeightBand, outputPixels, type PhotoSpec } from '../data/photo/types';

export type CheckStatus = 'pass' | 'warn' | 'fail' | 'skip';

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
}

// ---- colour helpers ----
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const luma = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Sample the outer border of the crop (where the plain background should be) and
 * report its colour uniformity + how close it is to the required background colour.
 */
export function checkBackground(ctx: CanvasRenderingContext2D, w: number, h: number, spec: PhotoSpec): CheckResult {
  const band = Math.max(4, Math.round(Math.min(w, h) * 0.06)); // outer 6% ring
  const px = ctx.getImageData(0, 0, w, h).data;
  let n = 0, sr = 0, sg = 0, sb = 0;
  const samples: number[] = [];
  const isBorder = (x: number, y: number) => x < band || x >= w - band || y < band || y >= h - band;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (!isBorder(x, y)) continue;
      const i = (y * w + x) * 4;
      const r = px[i], g = px[i + 1], b = px[i + 2];
      sr += r; sg += g; sb += b; n++;
      samples.push(luma(r, g, b));
    }
  }
  if (!n) return { id: 'bg', label: 'Background', status: 'skip', detail: 'Could not sample the background.' };
  const mr = sr / n, mg = sg / n, mb = sb / n;
  const ml = samples.reduce((a, v) => a + v, 0) / samples.length;
  const variance = samples.reduce((a, v) => a + (v - ml) ** 2, 0) / samples.length;
  const sd = Math.sqrt(variance);

  const [tr, tg, tb] = hexToRgb(BG_HEX[spec.background]);
  const dist = Math.sqrt((mr - tr) ** 2 + (mg - tg) ** 2 + (mb - tb) ** 2);

  if (sd > 22) {
    return { id: 'bg', label: 'Plain background', status: 'fail', detail: `The background isn't uniform (shadows, objects or texture detected). ${spec.backgroundLabel} required.` };
  }
  if (dist > 60) {
    return { id: 'bg', label: 'Background colour', status: 'warn', detail: `Background colour looks off. This document needs a ${spec.backgroundLabel.toLowerCase()}.` };
  }
  return { id: 'bg', label: 'Plain background', status: 'pass', detail: `Uniform background detected, close to the required ${spec.backgroundLabel.toLowerCase()}.` };
}

/** Overall exposure — flag photos that are too dark or blown-out. */
export function checkBrightness(ctx: CanvasRenderingContext2D, w: number, h: number): CheckResult {
  const px = ctx.getImageData(0, 0, w, h).data;
  let s = 0, n = 0;
  for (let i = 0; i < px.length; i += 16) { s += luma(px[i], px[i + 1], px[i + 2]); n++; }
  const mean = s / n;
  if (mean < 70) return { id: 'exposure', label: 'Exposure', status: 'warn', detail: 'The photo looks underexposed (too dark). Retake in even, natural light.' };
  if (mean > 225) return { id: 'exposure', label: 'Exposure', status: 'warn', detail: 'The photo looks overexposed (washed out). Reduce lighting or flash.' };
  return { id: 'exposure', label: 'Exposure', status: 'pass', detail: 'Brightness is within a normal range.' };
}

/** The output is generated at the exact spec — this documents that it conforms by construction. */
export function checkDimensions(spec: PhotoSpec, blobBytes: number, format: string): CheckResult[] {
  const { w, h } = outputPixels(spec);
  const out: CheckResult[] = [
    { id: 'size', label: 'Print & pixel size', status: 'pass', detail: `Exported at ${spec.widthMm}×${spec.heightMm} mm (${w}×${h}px @ ${spec.dpi} DPI) — exactly to spec.` },
  ];
  const fmtOk = spec.allowedFormats.includes(format as 'jpeg' | 'png');
  out.push({
    id: 'format', label: 'File format',
    status: fmtOk ? 'pass' : 'warn',
    detail: fmtOk ? `${format.toUpperCase()} is accepted.` : `This authority expects ${spec.allowedFormats.join(' or ').toUpperCase()}.`,
  });
  const kb = blobBytes / 1024;
  if (spec.fileSizeMaxKb || spec.fileSizeMinKb) {
    const okMax = !spec.fileSizeMaxKb || kb <= spec.fileSizeMaxKb;
    const okMin = !spec.fileSizeMinKb || kb >= spec.fileSizeMinKb;
    out.push({
      id: 'filesize', label: 'File size',
      status: okMax && okMin ? 'pass' : 'warn',
      detail: `${kb.toFixed(0)} KB. Required: ${spec.fileSizeMinKb ?? 0}–${spec.fileSizeMaxKb ?? '∞'} KB.`,
    });
  }
  return out;
}

// ---- on-device face detection (progressive enhancement) ----

export interface FaceMetrics {
  /** Head-height (crown→chin, approximated from the detection box) as a fraction of image height. */
  headHeightPct: number;
  /** Eye-line position as a fraction of image height from the BOTTOM. */
  eyePctFromBottom: number;
  /** Horizontal centre of the face as a fraction of width (0.5 = centred). */
  centerX: number;
  /** Roll angle in degrees from the eye landmarks (0 = level). */
  tiltDeg: number;
  faces: number;
}

/**
 * Detect the face on the cropped canvas. Prefers the self-hosted MediaPipe BlazeFace
 * model (works in every modern browser, ~230 KB, lazy-loaded on first use); falls back
 * to the browser's native Shape Detection API, then to null — in which case the UI
 * shows the manual guide overlay instead. The image never leaves the device.
 */
export async function analyzeFace(canvas: HTMLCanvasElement): Promise<FaceMetrics | null> {
  try {
    const { detectFaceMetrics } = await import('./face-model');
    return await detectFaceMetrics(canvas);
  } catch {
    // model failed to load (offline first visit, unsupported wasm) — try the native API
  }
  const FD = (globalThis as any).FaceDetector;
  if (typeof FD !== 'function') return null;
  try {
    const detector = new FD({ fastMode: false, maxDetectedFaces: 3 });
    const faces = await detector.detect(canvas);
    if (!faces?.length) return { headHeightPct: 0, eyePctFromBottom: 0, centerX: 0.5, tiltDeg: 0, faces: 0 };
    const f = faces[0];
    const bb = f.boundingBox;
    const H = canvas.height, W = canvas.width;
    // The detection box spans roughly brow→chin; scale up ~1.35× to approximate crown→chin.
    const headHeightPct = Math.min(1, (bb.height * 1.35) / H);
    const eyes = (f.landmarks || []).filter((l: any) => l.type === 'eye');
    let eyeY = bb.y + bb.height * 0.4, tiltDeg = 0, cx = bb.x + bb.width / 2;
    if (eyes.length === 2) {
      const [a, b] = eyes;
      eyeY = (a.locations[0].y + b.locations[0].y) / 2;
      cx = (a.locations[0].x + b.locations[0].x) / 2;
      tiltDeg = (Math.atan2(b.locations[0].y - a.locations[0].y, b.locations[0].x - a.locations[0].x) * 180) / Math.PI;
    }
    return {
      headHeightPct,
      eyePctFromBottom: 1 - eyeY / H,
      centerX: cx / W,
      tiltDeg: Math.abs(Math.abs(tiltDeg) > 90 ? 180 - Math.abs(tiltDeg) : tiltDeg),
      faces: faces.length,
    };
  } catch {
    return null;
  }
}

/** Turn face metrics into pass/warn/fail checks against the spec's geometry bands. */
export function faceChecks(m: FaceMetrics, spec: PhotoSpec): CheckResult[] {
  if (m.faces === 0) return [{ id: 'face', label: 'Face detected', status: 'fail', detail: 'No face was detected. Make sure your full head is inside the frame, facing forward.' }];
  const out: CheckResult[] = [];
  if (m.faces > 1) out.push({ id: 'faces', label: 'Single subject', status: 'fail', detail: `${m.faces} faces detected — the photo must contain only you.` });

  const band = headHeightBand(spec);
  if (band) {
    const pct = Math.round(m.headHeightPct * 100);
    const lo = Math.round(band.min * 100), hi = Math.round(band.max * 100);
    out.push({
      id: 'head', label: 'Head size',
      status: m.headHeightPct >= band.min * 0.92 && m.headHeightPct <= band.max * 1.08 ? 'pass' : 'warn',
      detail: `Head fills ~${pct}% of the height; this document wants ${lo}–${hi}%. Zoom to fit the head guides.`,
    });
  }
  if (spec.eyeMinPctFromBottom != null && spec.eyeMaxPctFromBottom != null) {
    const okEye = m.eyePctFromBottom >= spec.eyeMinPctFromBottom - 0.03 && m.eyePctFromBottom <= spec.eyeMaxPctFromBottom + 0.03;
    out.push({ id: 'eyes', label: 'Eye position', status: okEye ? 'pass' : 'warn', detail: `Eyes sit at ~${Math.round(m.eyePctFromBottom * 100)}% up from the bottom; move to align with the eye line.` });
  }
  out.push({
    id: 'center', label: 'Centred',
    status: Math.abs(m.centerX - 0.5) < 0.08 ? 'pass' : 'warn',
    detail: Math.abs(m.centerX - 0.5) < 0.08 ? 'Face is horizontally centred.' : 'Face looks off-centre — pan so it sits in the middle.',
  });
  out.push({
    id: 'tilt', label: 'Head level',
    status: m.tiltDeg < 6 ? 'pass' : 'warn',
    detail: m.tiltDeg < 6 ? 'Head is level.' : `Head appears tilted ~${m.tiltDeg.toFixed(0)}°. Keep it straight and square to the camera.`,
  });
  return out;
}
