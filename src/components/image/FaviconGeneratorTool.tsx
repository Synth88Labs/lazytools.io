import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';
import { FAVICON_SIZES, ICO_SIZES, buildIco } from '../../lib/image-tools';

type Dims = { w: number; h: number };

/** Conventional filenames for a few of the standard sizes. */
const CONVENTIONAL: Record<number, string> = {
  16: 'favicon-16x16.png',
  32: 'favicon-32x32.png',
  180: 'apple-touch-icon.png',
  192: 'android-chrome-192x192.png',
  512: 'android-chrome-512x512.png',
};

/** The ready-to-paste HTML <link> snippet. */
const HTML_SNIPPET = [
  '<link rel="icon" href="/favicon.ico" sizes="any">',
  '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
  '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
  '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
  '<link rel="manifest" href="/site.webmanifest">',
].join('\n');

const README = `LazyTools, Favicon set
========================

Drop these files in your site's web root (the folder that serves "/"), then
paste the following into the <head> of your HTML:

${HTML_SNIPPET}

Files:
  favicon.ico              multi-resolution icon (16/32/48) for legacy + tabs
  favicon-16x16.png        small tab icon
  favicon-32x32.png        standard tab icon
  apple-touch-icon.png     180×180, iOS home-screen icon
  android-chrome-192x192.png / android-chrome-512x512.png  PWA / Android
  site.webmanifest         web app manifest referencing the Android icons

Everything was generated in your browser. Nothing was uploaded.
`;

/**
 * Favicon generator, load one square-ish image and get a full favicon set
 * (PNGs at standard sizes, a multi-resolution favicon.ico, a web manifest and
 * the HTML snippet) bundled into a ZIP. 100% client-side: JSZip is the only
 * dependency and it is dynamically imported so it loads on this page alone.
 */
export default function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [dims, setDims] = useState<Dims>({ w: 0, h: 0 });
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);
  const [bg, setBg] = useState<string>('#ffffff');
  const [useBg, setUseBg] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const square = dims.w && dims.h ? Math.abs(dims.w - dims.h) <= 1 : true;

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0] ?? null;
    setDone(null);
    setError(null);
    setCopied(false);
    if (!f) return;
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => {
      const w = image.naturalWidth || 0;
      const h = image.naturalHeight || 0;
      setFile(f);
      setImg(image);
      setDims({ w, h });
      // Build small previews at a few sizes so the user sees how it looks tiny.
      const urls = [16, 32, 180]
        .map((size) => {
          const c = drawSquare(image, { w, h }, size, false, bg);
          return c ? { size, url: c.toDataURL('image/png') } : null;
        })
        .filter((p): p is { size: number; url: string } => p !== null);
      setPreviews(urls);
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Couldn't read that image. Try a PNG, JPG, WebP or SVG file.");
    };
    image.src = url;
  }

  /** Center-crop `image` to a square and draw it into a `size×size` canvas. */
  function drawSquare(
    image: HTMLImageElement,
    d: Dims,
    size: number,
    fill: boolean,
    color: string,
  ): HTMLCanvasElement | null {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (fill) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, size, size);
    }
    const src = Math.min(d.w, d.h) || size;
    const sx = (d.w - src) / 2;
    const sy = (d.h - src) / 2;
    ctx.drawImage(image, sx, sy, src, src, 0, 0, size, size);
    return canvas;
  }

  /** Render a PNG at `size`, returning its raw bytes. */
  async function renderPngAt(size: number, fill: boolean): Promise<Uint8Array> {
    if (!img) throw new Error('No image loaded');
    const canvas = drawSquare(img, dims, size, fill, bg);
    if (!canvas) throw new Error('Canvas unsupported in this browser.');
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png'),
    );
    return new Uint8Array(await blob.arrayBuffer());
  }

  async function generate() {
    if (!img) return;
    setBusy(true);
    setDone(null);
    setError(null);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      let count = 0;

      // 1. PNGs at every standard size (generic + conventional names).
      const icoInputs: { size: number; png: Uint8Array }[] = [];
      for (const size of FAVICON_SIZES) {
        const png = await renderPngAt(size, false);
        zip.file(`favicon-${size}x${size}.png`, png);
        count++;
        const conventional = CONVENTIONAL[size];
        if (conventional && conventional !== `favicon-${size}x${size}.png`) {
          zip.file(conventional, png);
          count++;
        }
      }

      // 2. Multi-resolution favicon.ico (optionally flattened onto a bg colour).
      for (const size of ICO_SIZES) {
        icoInputs.push({ size, png: await renderPngAt(size, useBg) });
      }
      const ico = buildIco(icoInputs);
      zip.file('favicon.ico', ico);
      count++;

      // 3. Web manifest + HTML snippet / README.
      const manifest = {
        name: 'My site',
        short_name: 'My site',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
      };
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));
      count++;
      zip.file('README.txt', README);
      count++;

      // 4. Bundle + download.
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicons.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setDone(`✓ Generated ${count} files, favicons.zip downloaded`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong generating the favicons.');
    } finally {
      setBusy(false);
    }
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(HTML_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div class="space-y-4">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={onFile}
            class="sr-only"
          />
          <span class="text-sm font-semibold text-brand-700">
            {file ? file.name : 'Choose a square image / logo'}
          </span>
          <span class="mt-1 block text-xs text-slate-500">
            {file
              ? `${fmtSize(file.size)} · ${dims.w}×${dims.h}px`
              : 'PNG, JPG, WebP or SVG, a square image works best'}
          </span>
        </label>

        {error && (
          <p class="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        {file && !square && !error && (
          <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Your image isn't square ({dims.w}×{dims.h}px). It will be center-cropped to a
            square before generating the icons.
          </p>
        )}
      </div>

      {file && !error && (
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
          <h3 class="text-sm font-semibold text-slate-800">Preview at real size</h3>
          <p class="mt-1 text-xs text-slate-500">Shown at actual favicon pixel dimensions.</p>
          <div class="mt-3 flex flex-wrap items-end gap-5">
            {previews.map((p) => (
              <div key={p.size} class="text-center">
                <img
                  src={p.url}
                  width={p.size}
                  height={p.size}
                  alt={`${p.size}×${p.size} preview`}
                  style={{ width: `${p.size}px`, height: `${p.size}px`, imageRendering: 'auto' }}
                  class="mx-auto rounded border border-slate-200 bg-white"
                />
                <span class="mt-1 block text-[11px] text-slate-500">
                  {p.size}×{p.size}
                </span>
              </div>
            ))}
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
            <label class="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={useBg}
                onChange={(e) => setUseBg((e.target as HTMLInputElement).checked)}
                class="h-4 w-4 rounded border-slate-300"
              />
              Fill transparency behind favicon.ico
            </label>
            {useBg && (
              <input
                type="color"
                value={bg}
                onInput={(e) => setBg((e.target as HTMLInputElement).value)}
                class="h-8 w-12 cursor-pointer rounded border border-slate-300 bg-white"
                aria-label="Background colour"
              />
            )}
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={busy}
            class="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Generating…' : 'Generate favicon set (ZIP)'}
          </button>

          <p class="mt-2 text-xs text-slate-500" aria-live="polite">
            {done}
          </p>
        </div>
      )}

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-sm font-semibold text-slate-800">HTML snippet</h3>
          <button
            type="button"
            onClick={copySnippet}
            class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-800"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <p class="mt-1 text-xs text-slate-500">
          Paste this into the <code class="text-slate-600">&lt;head&gt;</code> of your pages.
        </p>
        <textarea
          readOnly
          rows={5}
          value={HTML_SNIPPET}
          aria-label="HTML snippet"
          class="mt-3 w-full rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-700"
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
        />
      </div>
    </div>
  );
}
