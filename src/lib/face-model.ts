/**
 * On-device face detection via MediaPipe Tasks Vision (BlazeFace short-range).
 *
 * The model (~230 KB) and wasm runtime are SELF-HOSTED under /vendor/mediapipe/ —
 * nothing is fetched from a CDN and the image never leaves the browser. Loaded
 * lazily on first "Check photo" so it costs nothing on page load. Exposes the same
 * FaceMetrics shape the heuristic checker consumes, so callers never change.
 */

import type { FaceMetrics } from './photo-checks';

let detectorPromise: Promise<any> | null = null;

async function getDetector(): Promise<any> {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const { FilesetResolver, FaceDetector } = await import('@mediapipe/tasks-vision');
      const fileset = await FilesetResolver.forVisionTasks('/vendor/mediapipe/wasm');
      return await FaceDetector.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: '/vendor/mediapipe/blaze_face_short_range.tflite' },
        runningMode: 'IMAGE',
        minDetectionConfidence: 0.5,
      });
    })().catch((e) => { detectorPromise = null; throw e; });
  }
  return detectorPromise;
}

/** Detect faces on the composed output canvas and reduce to spec-check metrics. */
export async function detectFaceMetrics(canvas: HTMLCanvasElement): Promise<FaceMetrics> {
  const detector = await getDetector();
  const res = detector.detect(canvas);
  const dets: any[] = res?.detections || [];
  const W = canvas.width, H = canvas.height;
  if (!dets.length) return { headHeightPct: 0, eyePctFromBottom: 0, centerX: 0.5, tiltDeg: 0, faces: 0 };

  // Use the largest detection as the subject.
  const d = dets.reduce((a, b) => (a.boundingBox.height >= b.boundingBox.height ? a : b));
  const bb = d.boundingBox; // pixels: originX, originY, width, height
  // The detection box spans roughly brow→chin; scale ~1.4× to approximate crown→chin.
  const headHeightPct = Math.min(1, (bb.height * 1.4) / H);

  // BlazeFace keypoints (normalised 0–1): [rightEye, leftEye, noseTip, mouth, rightEar, leftEar].
  const kp: any[] = d.keypoints || [];
  let eyeY = (bb.originY + bb.height * 0.4) / H;
  let cx = (bb.originX + bb.width / 2) / W;
  let tiltDeg = 0;
  if (kp.length >= 2) {
    const re = kp[0], le = kp[1];
    eyeY = (re.y + le.y) / 2;
    cx = (re.x + le.x) / 2;
    tiltDeg = Math.abs((Math.atan2((le.y - re.y) * H, (le.x - re.x) * W) * 180) / Math.PI);
    if (tiltDeg > 90) tiltDeg = 180 - tiltDeg;
  }
  return { headHeightPct, eyePctFromBottom: 1 - eyeY, centerX: cx, tiltDeg, faces: dets.length };
}
