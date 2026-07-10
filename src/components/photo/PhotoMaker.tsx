import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { BG_HEX, headHeightBand, outputPixels, type PhotoSpec } from '../../data/photo/types';
import {
  analyzeFace, checkBackground, checkBrightness, checkDimensions, faceChecks,
  type CheckResult,
} from '../../lib/photo-checks';

/** Patch a JPEG's JFIF APP0 segment so the file reports the correct print DPI. */
function setJpegDpi(buf: ArrayBuffer, dpi: number): ArrayBuffer {
  const b = new Uint8Array(buf);
  // SOI FFD8, then APP0 FFE0 with "JFIF\0" at offset 6..10
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff && b[3] === 0xe0 &&
      b[6] === 0x4a && b[7] === 0x46 && b[8] === 0x49 && b[9] === 0x46) {
    b[13] = 1;                    // units = dots per inch
    b[14] = (dpi >> 8) & 0xff; b[15] = dpi & 0xff; // Xdensity
    b[16] = (dpi >> 8) & 0xff; b[17] = dpi & 0xff; // Ydensity
  }
  return buf;
}

const statusStyle: Record<string, string> = {
  pass: 'text-emerald-700 bg-emerald-50 ring-emerald-200',
  warn: 'text-amber-800 bg-amber-50 ring-amber-200',
  fail: 'text-red-700 bg-red-50 ring-red-200',
  skip: 'text-slate-500 bg-slate-50 ring-slate-200',
};
const statusIcon: Record<string, string> = { pass: '✓', warn: '!', fail: '✕', skip: '–' };

export default function PhotoMaker({ spec }: { spec: PhotoSpec }) {
  const out = useMemo(() => outputPixels(spec), [spec]);
  const aspect = out.w / out.h;
  const dispH = 460;
  const dispW = Math.round(dispH * aspect);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [hasImg, setHasImg] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGuides, setShowGuides] = useState(true);
  const [format, setFormat] = useState<'jpeg' | 'png'>(spec.allowedFormats[0]);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const drag = useRef<{ x: number; y: number } | null>(null);

  const bgHex = BG_HEX[spec.background];
  const band = headHeightBand(spec);

  // Draw the composed photo (background + positioned image) at an arbitrary output size.
  const compose = useCallback((ctx: CanvasRenderingContext2D, W: number, H: number) => {
    const img = imgRef.current;
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, W, H);
    if (!img) return;
    const base = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const s = base * zoom;
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    const dx = (W - dw) / 2 + pan.x * W;
    const dy = (H - dh) / 2 + pan.y * H;
    (ctx as any).imageSmoothingQuality = 'high';
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [bgHex, zoom, pan]);

  // Redraw the on-screen preview + guide overlay whenever the view changes.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    compose(ctx, dispW, dispH);

    const o = overlayRef.current!;
    const octx = o.getContext('2d')!;
    octx.clearRect(0, 0, dispW, dispH);
    if (!showGuides || !hasImg) return;
    octx.strokeStyle = 'rgba(37,99,235,0.7)';
    octx.setLineDash([6, 5]);
    octx.lineWidth = 1.5;
    // vertical centre line
    octx.beginPath(); octx.moveTo(dispW / 2, 0); octx.lineTo(dispW / 2, dispH); octx.stroke();
    // head-height band → an oval guide + crown/chin lines
    if (band) {
      const mid = (band.min + band.max) / 2;
      const headPx = mid * dispH;
      const eyeMid = spec.eyeMinPctFromBottom != null && spec.eyeMaxPctFromBottom != null
        ? (spec.eyeMinPctFromBottom + spec.eyeMaxPctFromBottom) / 2
        : null;
      const eyeY = eyeMid != null ? (1 - eyeMid) * dispH : dispH * 0.42;
      const crownY = eyeY - headPx * 0.45;
      const chinY = eyeY + headPx * 0.55;
      octx.strokeStyle = 'rgba(37,99,235,0.85)';
      octx.beginPath(); octx.ellipse(dispW / 2, (crownY + chinY) / 2, headPx * 0.34, headPx / 2, 0, 0, Math.PI * 2); octx.stroke();
      octx.setLineDash([3, 4]); octx.strokeStyle = 'rgba(37,99,235,0.5)';
      for (const y of [crownY, chinY]) { octx.beginPath(); octx.moveTo(0, y); octx.lineTo(dispW, y); octx.stroke(); }
      // eye line
      octx.strokeStyle = 'rgba(16,185,129,0.8)';
      octx.beginPath(); octx.moveTo(0, eyeY); octx.lineTo(dispW, eyeY); octx.stroke();
    }
  }, [compose, dispW, dispH, showGuides, hasImg, band, spec]);

  function clampPan(p: { x: number; y: number }, z: number) {
    const img = imgRef.current;
    if (!img) return p;
    const base = Math.max(dispW / img.naturalWidth, dispH / img.naturalHeight);
    const s = base * z;
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    const mx = Math.max(0, (dw - dispW) / (2 * dispW));
    const my = Math.max(0, (dh - dispH) / (2 * dispH));
    return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
  }

  function loadFile(f: File) {
    setError(''); setResults(null);
    if (!f.type.startsWith('image/')) { setError('Please choose an image file (JPG or PNG).'); return; }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => { imgRef.current = img; setZoom(1); setPan({ x: 0, y: 0 }); setHasImg(true); URL.revokeObjectURL(url); };
    img.onerror = () => { setError('Your browser could not decode that image.'); URL.revokeObjectURL(url); };
    img.src = url;
  }

  const onPointerDown = (e: PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY }; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return;
    const dx = (e.clientX - drag.current.x) / dispW;
    const dy = (e.clientY - drag.current.y) / dispH;
    drag.current = { x: e.clientX, y: e.clientY };
    setPan((p) => clampPan({ x: p.x + dx, y: p.y + dy }, zoom));
  };
  const onPointerUp = () => { drag.current = null; };

  function setZoomClamped(z: number) { setZoom(z); setPan((p) => clampPan(p, z)); }

  /** Render the current view at exact output pixels. */
  function renderOutput(): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = out.w; c.height = out.h;
    compose(c.getContext('2d')!, out.w, out.h);
    return c;
  }

  async function encode(c: HTMLCanvasElement): Promise<Blob> {
    const type = format === 'png' ? 'image/png' : 'image/jpeg';
    if (type === 'image/png') return await new Promise<Blob>((res) => c.toBlob((b) => res(b!), type));
    // JPEG: step quality down to meet a max file size when the authority sets one.
    let q = 0.92;
    let blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), type, q));
    while (spec.fileSizeMaxKb && blob.size / 1024 > spec.fileSizeMaxKb && q > 0.4) {
      q -= 0.08;
      blob = await new Promise<Blob>((res) => c.toBlob((b) => res(b!), type, q));
    }
    const patched = setJpegDpi(await blob.arrayBuffer(), spec.dpi);
    return new Blob([patched], { type });
  }

  async function runCheck() {
    if (!hasImg) return;
    setBusy(true);
    try {
      const c = renderOutput();
      const ctx = c.getContext('2d')!;
      const res: CheckResult[] = [checkBackground(ctx, out.w, out.h, spec), checkBrightness(ctx, out.w, out.h)];
      const blob = await encode(c);
      res.push(...checkDimensions(spec, blob.size, format));
      const fm = await analyzeFace(c);
      if (fm) res.unshift(...faceChecks(fm, spec));
      else res.push({ id: 'face', label: 'Face position', status: 'skip', detail: 'On-device face detection is unavailable in this browser — align your head to the blue guides manually.' });
      // order: fails first
      const rank = { fail: 0, warn: 1, skip: 2, pass: 3 } as const;
      res.sort((a, b) => rank[a.status] - rank[b.status]);
      setResults(res);
    } catch { setError('Could not analyse the photo.'); }
    setBusy(false);
  }

  async function download() {
    if (!hasImg) return;
    setBusy(true);
    try {
      const blob = await encode(renderOutput());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${spec.slug}-photo.${format === 'png' ? 'png' : 'jpg'}`; a.click();
      URL.revokeObjectURL(url);
    } catch { setError('Export failed.'); }
    setBusy(false);
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* editor */}
        <div>
          <div class="relative mx-auto" style={`width:${dispW}px;height:${dispH}px`}>
            <canvas
              ref={canvasRef} width={dispW} height={dispH}
              class="absolute inset-0 rounded-lg border border-slate-300 bg-white shadow-inner touch-none"
              style={hasImg ? 'cursor:grab' : ''}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
            />
            <canvas ref={overlayRef} width={dispW} height={dispH} class="pointer-events-none absolute inset-0 rounded-lg" />
            {!hasImg && (
              <label class="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white/70 text-center hover:border-brand-400">
                <span class="text-3xl">📷</span>
                <span class="px-6 text-sm font-medium text-slate-600">Click or drop a photo<br /><span class="font-normal text-slate-400">stays 100% in your browser</span></span>
                <input type="file" accept="image/*" class="hidden" onChange={(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f); }} />
              </label>
            )}
          </div>

          {hasImg && (
            <div class="mx-auto mt-3 space-y-3" style={`width:${dispW}px`}>
              <label class="flex items-center gap-3 text-sm text-slate-600">
                <span class="w-12 font-medium">Zoom</span>
                <input type="range" min="1" max="3" step="0.01" value={zoom} class="flex-1 accent-brand-600" onInput={(e) => setZoomClamped(parseFloat((e.target as HTMLInputElement).value))} />
              </label>
              <div class="flex flex-wrap items-center gap-2">
                <label class="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600">
                  <input type="checkbox" checked={showGuides} class="accent-brand-600" onChange={(e) => setShowGuides((e.target as HTMLInputElement).checked)} /> Guides
                </label>
                {spec.allowedFormats.length > 1 && (
                  <select value={format} class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm" onChange={(e) => setFormat((e.target as HTMLSelectElement).value as 'jpeg' | 'png')}>
                    {spec.allowedFormats.map((f) => <option value={f}>{f.toUpperCase()}</option>)}
                  </select>
                )}
                <label class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-sm font-medium text-slate-600 hover:border-brand-400 cursor-pointer">
                  Replace<input type="file" accept="image/*" class="hidden" onChange={(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) loadFile(f); }} />
                </label>
              </div>
              <div class="flex gap-2">
                <button type="button" onClick={runCheck} disabled={busy} class="flex-1 rounded-lg border border-brand-300 bg-white px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-50">{busy ? 'Checking…' : '🔍 Check photo'}</button>
                <button type="button" onClick={download} disabled={busy} class="flex-1 rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-50">⬇ Download</button>
              </div>
            </div>
          )}
          {error && <p class="mt-2 text-center text-sm text-red-600">{error}</p>}
        </div>

        {/* spec + results */}
        <div class="min-w-0">
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Output</p>
            <p class="mt-1 text-lg font-bold text-slate-900">{spec.widthMm}×{spec.heightMm} mm{spec.widthIn ? ` (${spec.widthIn}×${spec.heightIn} in)` : ''}</p>
            <p class="font-mono text-sm text-slate-500">{out.w}×{out.h}px · {spec.dpi} DPI · {spec.backgroundLabel}</p>
            {(spec.fileSizeMaxKb || spec.fileSizeMinKb) && <p class="mt-1 text-xs text-slate-500">File size {spec.fileSizeMinKb ?? 0}–{spec.fileSizeMaxKb ?? '∞'} KB · {spec.allowedFormats.join('/').toUpperCase()}</p>}
          </div>

          {results && (
            <div class="mt-3 space-y-1.5">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Compliance check <span class="font-normal normal-case text-slate-400">— assistive, not a guarantee</span></p>
              {results.map((r) => (
                <div class={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ring-1 ${statusStyle[r.status]}`}>
                  <span class="mt-0.5 font-bold">{statusIcon[r.status]}</span>
                  <span><strong>{r.label}.</strong> {r.detail}</span>
                </div>
              ))}
            </div>
          )}
          {!results && hasImg && <p class="mt-3 text-sm text-slate-500">Position your head inside the blue guides, then press <strong>Check photo</strong>.</p>}
        </div>
      </div>

      <p class="mt-4 border-t border-slate-200 pt-3 text-center text-xs text-slate-500">
        🔒 Your photo is processed entirely on your device and never uploaded. The compliance check catches common mistakes but does not guarantee acceptance — always confirm against the official requirements below.
      </p>
    </div>
  );
}
