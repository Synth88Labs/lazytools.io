import { useState, useRef } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';
import { ASPECT_PRESETS, clampCrop } from '../../lib/image-tools';

type Rect = { x: number; y: number; w: number; h: number };
type Dims = { w: number; h: number };

const MAX_DISPLAY_W = 520;

export default function CropImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>('');
  const [dims, setDims] = useState<Dims>({ w: 0, h: 0 });
  const [crop, setCrop] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const [ratio, setRatio] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [done, setDone] = useState<string>('');

  const imgRef = useRef<HTMLImageElement | null>(null);
  const urlRef = useRef<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  // Pointer-drag state: mode + starting rect + starting pointer (display coords).
  const dragRef = useRef<{ mode: 'move' | 'resize'; start: Rect; px: number; py: number } | null>(null);

  const displayW = dims.w > 0 ? Math.min(dims.w, MAX_DISPLAY_W) : 0;
  const scale = dims.w > 0 ? displayW / dims.w : 1;
  const displayH = dims.h * scale;

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setError('');
    setDone('');

    const objUrl = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      // Revoke any previous preview URL now that the new one has loaded.
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = objUrl;
      imgRef.current = img;
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      setDims({ w, h });
      setFile(f);
      setUrl(objUrl);
      setRatio(null);
      // Start with a centered 80% box.
      const cw = Math.round(w * 0.8);
      const ch = Math.round(h * 0.8);
      setCrop(clampCrop({ x: (w - cw) / 2, y: (h - ch) / 2, w: cw, h: ch }, w, h));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      setError('Could not load that image. Try a JPEG, PNG or WebP file.');
    };
    img.src = objUrl;
  }

  // Apply a locked ratio to a rect, deriving height from width, clamped to bounds.
  function applyRatio(rect: Rect, r: number | null): Rect {
    if (r == null) return clampCrop(rect, dims.w, dims.h);
    const next = { ...rect, h: rect.w / r };
    if (next.y + next.h > dims.h) {
      next.h = dims.h - next.y;
      next.w = next.h * r;
    }
    return clampCrop(next, dims.w, dims.h);
  }

  function selectPreset(r: number | null) {
    setRatio(r);
    setCrop((c) => applyRatio(c, r));
    setDone('');
  }

  function updateField(key: keyof Rect, value: number) {
    setCrop((c) => {
      const next = { ...c, [key]: value };
      // When a ratio is locked, editing width re-derives height (and vice-versa).
      if (ratio != null) {
        if (key === 'w') next.h = next.w / ratio;
        else if (key === 'h') next.w = next.h * ratio;
      }
      return applyRatio(next, ratio);
    });
    setDone('');
  }

  // ---- Pointer drag (move body / resize bottom-right) -------------------
  function pointerPos(e: PointerEvent): { x: number; y: number } {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }

  function startDrag(mode: 'move' | 'resize', e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = pointerPos(e);
    dragRef.current = { mode, start: { ...crop }, px: p.x, py: p.y };
    setDone('');
  }

  function onPointerMove(e: PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const p = pointerPos(e);
    // Convert display-space delta to source pixels.
    const dx = (p.x - d.px) / scale;
    const dy = (p.y - d.py) / scale;

    if (d.mode === 'move') {
      setCrop(clampCrop({ ...d.start, x: d.start.x + dx, y: d.start.y + dy }, dims.w, dims.h));
    } else {
      let w = Math.max(1, d.start.w + dx);
      let h = Math.max(1, d.start.h + dy);
      if (ratio != null) h = w / ratio; // keep locked ratio while resizing
      setCrop(applyRatio({ ...d.start, w, h }, ratio));
    }
  }

  function endDrag(e: PointerEvent) {
    if (dragRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    dragRef.current = null;
  }

  // ---- Download ---------------------------------------------------------
  function cropAndDownload() {
    const img = imgRef.current;
    if (!img) return;
    const c = clampCrop(crop, dims.w, dims.h);
    const canvas = document.createElement('canvas');
    canvas.width = c.w;
    canvas.height = c.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Canvas is not available in this browser.');
      return;
    }
    ctx.drawImage(img, c.x, c.y, c.w, c.h, 0, 0, c.w, c.h);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Could not encode the cropped image.');
        return;
      }
      const base = (file?.name || 'image').replace(/\.[^.]+$/, '');
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${base}-cropped.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
      setDone(`✓ Downloaded, ${c.w}×${c.h} px (${fmtSize(blob.size)})`);
    }, 'image/png');
  }

  const c = clampCrop(crop, dims.w || 1, dims.h || 1);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose an image'}</span>
        <span class="mt-1 block text-xs text-slate-500">
          {file
            ? `${fmtSize(file.size)} · ${dims.w}×${dims.h}px`
            : 'JPEG, PNG, WebP, processed on your device'}
        </span>
      </label>

      {error && (
        <p class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {url && dims.w > 0 && (
        <div class="mt-5">
          {/* Aspect presets */}
          <div class="mb-4">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Aspect ratio</p>
            <div class="flex flex-wrap gap-2">
              {ASPECT_PRESETS.map((p) => {
                const active = p.ratio === ratio;
                return (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => selectPreset(p.ratio)}
                    class={
                      'rounded-lg border px-3 py-1.5 text-sm font-medium transition ' +
                      (active
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-brand-400')
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive crop preview */}
          <div
            ref={containerRef}
            class="relative mx-auto touch-none select-none overflow-hidden rounded-lg border border-slate-200"
            style={{ width: `${displayW}px`, height: `${displayH}px` }}
          >
            <img src={url} alt="" draggable={false} class="block h-full w-full" />
            {/* Dim outside the crop with an inset box-shadow on the crop div */}
            <div
              onPointerDown={(e) => startDrag('move', e as unknown as PointerEvent)}
              onPointerMove={(e) => onPointerMove(e as unknown as PointerEvent)}
              onPointerUp={(e) => endDrag(e as unknown as PointerEvent)}
              onPointerCancel={(e) => endDrag(e as unknown as PointerEvent)}
              class="absolute cursor-move border-2 border-brand-500"
              style={{
                left: `${c.x * scale}px`,
                top: `${c.y * scale}px`,
                width: `${c.w * scale}px`,
                height: `${c.h * scale}px`,
                boxShadow: '0 0 0 9999px rgba(15,23,42,0.45)',
              }}
            >
              {/* Bottom-right resize handle */}
              <div
                onPointerDown={(e) => startDrag('resize', e as unknown as PointerEvent)}
                onPointerMove={(e) => onPointerMove(e as unknown as PointerEvent)}
                onPointerUp={(e) => endDrag(e as unknown as PointerEvent)}
                onPointerCancel={(e) => endDrag(e as unknown as PointerEvent)}
                class="absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-se-resize rounded-sm border-2 border-white bg-brand-700 shadow"
              />
            </div>
          </div>

          <p class="mt-3 text-center text-sm font-medium text-slate-700">
            Crop: {c.w} × {c.h} px
          </p>

          {/* Numeric fallback controls */}
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(['x', 'y', 'w', 'h'] as (keyof Rect)[]).map((key) => {
              const labels: Record<string, string> = { x: 'X', y: 'Y', w: 'Width', h: 'Height' };
              const max = key === 'x' || key === 'w' ? dims.w : dims.h;
              return (
                <label key={key} class="block">
                  <span class="mb-1 block text-xs font-semibold text-slate-500">{labels[key]} (px)</span>
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={c[key]}
                    onInput={(e) => {
                      const v = parseInt((e.target as HTMLInputElement).value, 10);
                      updateField(key, Number.isFinite(v) ? v : 0);
                    }}
                    class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-400"
                  />
                </label>
              );
            })}
          </div>

          <button
            type="button"
            onClick={cropAndDownload}
            class="mt-5 w-full rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 sm:w-auto"
          >
            Crop &amp; download PNG
          </button>

          <p class="mt-2 text-xs text-slate-500">
            Exported at full source resolution as PNG (transparency preserved). Nothing leaves your device.
          </p>

          <div aria-live="polite" class="mt-2 min-h-[1.25rem] text-sm font-medium text-brand-700">
            {done}
          </div>
        </div>
      )}
    </div>
  );
}
