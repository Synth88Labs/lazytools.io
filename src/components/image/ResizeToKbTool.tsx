import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';
import { searchQualityForSize } from '../../lib/image-tools';

/** Output formats worth compressing to. PNG is lossless so it can't hit a size target. */
const FORMATS = [
  { label: 'JPEG', mime: 'image/jpeg', ext: 'jpg' },
  { label: 'WebP (smaller)', mime: 'image/webp', ext: 'webp' },
] as const;

const QUICK_PICKS = [20, 50, 100, 200, 500] as const;

const SCALE_STEP = 0.85; // shrink factor per downscale round
const MIN_SCALE = 0.1; // don't go below 10% of the original
const MIN_WIDTH = 64; // …or narrower than this
const MAX_SCALE_STEPS = 12; // bound the downscale loop

type Dims = { w: number; h: number };

/**
 * Resize / compress an image to hit a target file size (KB) entirely in the
 * browser. Binary-searches the encoder quality via searchQualityForSize; if even
 * the lowest quality overshoots, progressively downscales the canvas and retries.
 */
export default function ResizeToKbTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [dims, setDims] = useState<Dims>({ w: 0, h: 0 });
  const [targetKb, setTargetKb] = useState(100);
  const [mime, setMime] = useState<string>(FORMATS[0].mime);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0] ?? null;
    setResult(null);
    setError(null);
    if (!f) return;
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => {
      setFile(f);
      setImg(image);
      setDims({ w: image.naturalWidth, h: image.naturalHeight });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Couldn't read that image. Try a JPEG, PNG or WebP file.");
    };
    image.src = url;
  }

  /** Draw the loaded image scaled and encode it to a Blob at the given quality. */
  function encodeAt(scale: number, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!img) return reject(new Error('No image loaded'));
      const w = Math.max(1, Math.round(dims.w * scale));
      const h = Math.max(1, Math.round(dims.h * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      // White backfill so transparency doesn't turn black in JPEG.
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Encoding failed'))),
        mime,
        quality,
      );
    });
  }

  async function run() {
    if (!img) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const targetBytes = Math.max(1, Math.round(targetKb * 1024));
      let scale = 1;
      let steps = 0;
      let found: { scale: number; quality: number; bytes: number } | null = null;
      let best: { scale: number; quality: number; bytes: number } | null = null;

      while (steps < MAX_SCALE_STEPS) {
        const currentScale = scale;
        const sizeAt = async (q: number) => (await encodeAt(currentScale, q)).size;
        const res = await searchQualityForSize(targetBytes, sizeAt);

        // Track the smallest we managed, in case the target is unreachable.
        if (!best || res.bytes < best.bytes) {
          best = { scale: currentScale, quality: res.quality, bytes: res.bytes };
        }

        if (!res.overshoot) {
          found = { scale: currentScale, quality: res.quality, bytes: res.bytes };
          break;
        }

        // Even minimum quality is too big — shrink and try again.
        const nextScale = scale * SCALE_STEP;
        const nextW = Math.round(dims.w * nextScale);
        if (nextScale < MIN_SCALE || nextW < MIN_WIDTH) break;
        scale = nextScale;
        steps++;
      }

      const ext = FORMATS.find((f) => f.mime === mime)?.ext ?? 'jpg';
      const basename = (file?.name ?? 'image').replace(/\.[^./\\]+$/, '') || 'image';

      if (found) {
        const finalBlob = await encodeAt(found.scale, found.quality);
        const outW = Math.max(1, Math.round(dims.w * found.scale));
        const outH = Math.max(1, Math.round(dims.h * found.scale));
        const finalKb = Math.max(1, Math.round(finalBlob.size / 1024));
        download(finalBlob, `${basename}-${finalKb}kb.${ext}`);
        const dimNote =
          found.scale < 1 ? ` (${outW}×${outH}, was ${dims.w}×${dims.h})` : ` (${outW}×${outH})`;
        setResult(
          `✓ ${fmtSize(file?.size ?? 0)} → ${fmtSize(finalBlob.size)} at quality ${Math.round(
            found.quality * 100,
          )}%${dimNote}`,
        );
      } else if (best) {
        const smallestKb = Math.max(1, Math.round(best.bytes / 1024));
        setError(
          `Smallest achievable ≈ ${smallestKb} KB — lower the target or crop the image first.`,
        );
      } else {
        setError('Could not compress this image.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while compressing.');
    } finally {
      setBusy(false);
    }
  }

  function download(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose an image'}</span>
        <span class="mt-1 block text-xs text-slate-500">
          {file ? `${fmtSize(file.size)} · ${dims.w}×${dims.h}px` : 'JPEG, PNG, WebP — processed on your device'}
        </span>
      </label>

      {file && (
        <div class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700">Target size (KB)</label>
            <input
              type="number"
              min={1}
              step={1}
              aria-label="Target size (KB)"
              value={targetKb}
              onInput={(e) => {
                const v = Math.max(1, Math.round(Number((e.target as HTMLInputElement).value) || 0));
                setTargetKb(v);
              }}
              class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
            <div class="mt-2 flex flex-wrap gap-2">
              {QUICK_PICKS.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => setTargetKb(kb)}
                  class={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    targetKb === kb
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'
                  }`}
                >
                  {kb} KB
                </button>
              ))}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700">Output format</label>
            <select
              value={mime}
              aria-label="Output format"
              onChange={(e) => setMime((e.target as HTMLSelectElement).value)}
              class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              {FORMATS.map((f) => (
                <option key={f.mime} value={f.mime}>
                  {f.label}
                </option>
              ))}
            </select>
            <p class="mt-1 text-xs text-slate-500">
              PNG is excluded because it's lossless and can't be squeezed to a size target. WebP usually reaches the
              same size at higher visual quality than JPEG.
            </p>
          </div>

          <button
            type="button"
            onClick={run}
            disabled={busy}
            class="w-full rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Working…' : `Compress to ≤ ${targetKb} KB & download`}
          </button>

          {result && (
            <p class="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-800">
              {result}
            </p>
          )}
          {error && (
            <p class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-800">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
