/**
 * Pure helpers for the client-side canvas image tools (crop, resize-to-KB,
 * favicon). The canvas encoding itself lives in the Preact components; the
 * testable maths and byte-layout live here so they can be Node-tested.
 */

/** Aspect-ratio presets for cropping (label → width/height ratio, or null = freeform). */
export const ASPECT_PRESETS: { label: string; ratio: number | null }[] = [
  { label: 'Free', ratio: null },
  { label: '1:1', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:2', ratio: 3 / 2 },
  { label: '16:9', ratio: 16 / 9 },
  { label: '3:4', ratio: 3 / 4 },
  { label: '2:3', ratio: 2 / 3 },
  { label: '9:16', ratio: 9 / 16 },
];

/** Favicon export sizes (px). 16/32/48 also go into the multi-resolution .ico. */
export const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 180, 192, 512] as const;
/** Resolutions packed into favicon.ico. */
export const ICO_SIZES = [16, 32, 48] as const;

/**
 * Clamp a crop rectangle to the image bounds, preserving a locked aspect ratio
 * where possible. All values in source pixels. Returns integer pixel bounds.
 */
export function clampCrop(
  rect: { x: number; y: number; w: number; h: number },
  imgW: number,
  imgH: number,
): { x: number; y: number; w: number; h: number } {
  let { x, y, w, h } = rect;
  w = Math.max(1, Math.min(w, imgW));
  h = Math.max(1, Math.min(h, imgH));
  x = Math.max(0, Math.min(x, imgW - w));
  y = Math.max(0, Math.min(y, imgH - h));
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

/** Largest centered box of the given aspect ratio that fits inside w×h. */
export function fitAspectBox(imgW: number, imgH: number, ratio: number): { x: number; y: number; w: number; h: number } {
  let w = imgW;
  let h = w / ratio;
  if (h > imgH) {
    h = imgH;
    w = h * ratio;
  }
  return { x: (imgW - w) / 2, y: (imgH - h) / 2, w, h };
}

/**
 * Binary-search the highest encoder quality (0..1) whose encoded byte size is
 * ≤ targetBytes, given an async `sizeAt(quality)` that performs the real canvas
 * encode. Size is assumed monotonically non-decreasing in quality. Returns the
 * chosen quality and its measured size. If even the minimum quality overshoots,
 * the caller should also downscale the image; this returns that minimum so the
 * UI can report the best it achieved.
 */
export async function searchQualityForSize(
  targetBytes: number,
  sizeAt: (quality: number) => Promise<number>,
  opts: { min?: number; max?: number; iterations?: number } = {},
): Promise<{ quality: number; bytes: number; overshoot: boolean }> {
  const min = opts.min ?? 0.1;
  const max = opts.max ?? 0.95;
  const iterations = opts.iterations ?? 8;

  const maxBytes = await sizeAt(max);
  if (maxBytes <= targetBytes) return { quality: max, bytes: maxBytes, overshoot: false };

  const minBytes = await sizeAt(min);
  if (minBytes > targetBytes) return { quality: min, bytes: minBytes, overshoot: true };

  let lo = min;
  let hi = max;
  let best = { quality: min, bytes: minBytes };
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    const b = await sizeAt(mid);
    if (b <= targetBytes) {
      best = { quality: mid, bytes: b };
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return { quality: best.quality, bytes: best.bytes, overshoot: false };
}

/**
 * Assemble a multi-resolution .ico from PNG-encoded images (PNG-in-ICO, the
 * modern form every current browser and OS reads). Each entry stores its PNG
 * payload verbatim after a 6-byte ICONDIR header and 16-byte-per-image
 * directory. A size of 256 is written as 0 per the ICO spec.
 */
export function buildIco(images: { size: number; png: Uint8Array }[]): Uint8Array {
  const count = images.length;
  const headerSize = 6 + 16 * count;
  const totalSize = headerSize + images.reduce((s, im) => s + im.png.length, 0);
  const buf = new Uint8Array(totalSize);
  const dv = new DataView(buf.buffer);

  dv.setUint16(0, 0, true); // reserved
  dv.setUint16(2, 1, true); // image type: 1 = icon
  dv.setUint16(4, count, true); // number of images

  let offset = headerSize;
  images.forEach((im, i) => {
    const e = 6 + 16 * i;
    buf[e] = im.size >= 256 ? 0 : im.size; // width  (0 ⇒ 256)
    buf[e + 1] = im.size >= 256 ? 0 : im.size; // height (0 ⇒ 256)
    buf[e + 2] = 0; // colours in palette (0 = truecolour)
    buf[e + 3] = 0; // reserved
    dv.setUint16(e + 4, 1, true); // colour planes
    dv.setUint16(e + 6, 32, true); // bits per pixel
    dv.setUint32(e + 8, im.png.length, true); // size of PNG payload
    dv.setUint32(e + 12, offset, true); // offset of PNG payload
    buf.set(im.png, offset);
    offset += im.png.length;
  });
  return buf;
}
