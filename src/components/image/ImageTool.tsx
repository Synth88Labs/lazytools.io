import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface Props {
  mode: 'compress' | 'convert' | 'resize' | 'base64' | 'rotate' | 'circle';
}

export default function ImageTool({ mode }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [outInfo, setOutInfo] = useState('');
  const [b64, setB64] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [rotation, setRotation] = useState(0); // 0 | 90 | 180 | 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setOutInfo('');
    setB64('');
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.onerror = () => setError('Your browser cannot decode this image format.');
    img.src = url;
    if (mode === 'base64') {
      const reader = new FileReader();
      reader.onload = () => setB64(reader.result as string);
      reader.readAsDataURL(f);
    }
  }

  function render() {
    if (!file || !dims.w) return;
    setError('');
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Circle crop is always square; a quarter-turn swaps width and height.
      const square = Math.min(dims.w, dims.h);
      const quarter = mode === 'rotate' && (rotation === 90 || rotation === 270);
      const targetW = mode === 'resize' ? Math.max(1, width) : mode === 'circle' ? square : quarter ? dims.h : dims.w;
      const targetH = mode === 'resize' ? Math.max(1, height) : mode === 'circle' ? square : quarter ? dims.w : dims.h;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      // A circle crop only makes sense with transparency, so it forces PNG.
      const outFormat = mode === 'circle' ? 'image/png' : format;
      if (outFormat === 'image/jpeg') {
        // JPEG has no alpha — flatten transparency onto white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }
      if (mode === 'circle') {
        ctx.beginPath();
        ctx.arc(square / 2, square / 2, square / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        // Centre-crop the source to the square before drawing.
        ctx.drawImage(img, (dims.w - square) / 2, (dims.h - square) / 2, square, square, 0, 0, square, square);
      } else if (mode === 'rotate') {
        ctx.translate(targetW / 2, targetH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        ctx.drawImage(img, -dims.w / 2, -dims.h / 2, dims.w, dims.h);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        ctx.drawImage(img, 0, 0, targetW, targetH);
      }
      const suffix =
        mode === 'resize' ? `${targetW}x${targetH}`
        : mode === 'compress' ? 'compressed'
        : mode === 'circle' ? 'circle'
        : mode === 'rotate' ? 'rotated'
        : 'converted';
      canvas.toBlob(
        (blob) => {
          if (!blob) return setError('Encoding failed — this browser may not support the chosen format.');
          const ext = outFormat === 'image/png' ? 'png' : outFormat === 'image/webp' ? 'webp' : 'jpg';
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${file.name.replace(/\.[^.]+$/, '')}-${suffix}.${ext}`;
          a.click();
          URL.revokeObjectURL(url);
          const delta = file.size > 0 ? Math.round((1 - blob.size / file.size) * 100) : 0;
          setOutInfo(`✓ Downloaded — ${fmtSize(file.size)} → ${fmtSize(blob.size)}${delta > 0 ? ` (${delta}% smaller)` : ''}`);
        },
        outFormat,
        outFormat === 'image/png' ? undefined : quality / 100
      );
    };
    img.src = preview;
  }

  async function copyB64() {
    try {
      await navigator.clipboard.writeText(b64);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose an image'}</span>
        <span class="mt-1 block text-xs text-slate-500">
          {file ? `${fmtSize(file.size)}${dims.w ? ` · ${dims.w}×${dims.h}px` : ''}` : 'JPEG, PNG, WebP — processed on your device'}
        </span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {file && dims.w > 0 && mode !== 'base64' && (
        <div class="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
          <img src={preview} alt="Preview of the selected image" class="max-h-44 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          <div>
            {mode === 'resize' && (
              <div class="flex flex-wrap items-end gap-3">
                <div>
                  <label for="it-w" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width (px)</label>
                  <input id="it-w" type="number" min={1} value={width} class={`${inputCls} w-28`} onInput={(e) => {
                    const v = parseInt((e.target as HTMLInputElement).value, 10) || 1;
                    setWidth(v);
                    if (lockAspect) setHeight(Math.max(1, Math.round((v * dims.h) / dims.w)));
                  }} />
                </div>
                <div>
                  <label for="it-h" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Height (px)</label>
                  <input id="it-h" type="number" min={1} value={height} class={`${inputCls} w-28`} onInput={(e) => {
                    const v = parseInt((e.target as HTMLInputElement).value, 10) || 1;
                    setHeight(v);
                    if (lockAspect) setWidth(Math.max(1, Math.round((v * dims.w) / dims.h)));
                  }} />
                </div>
                <label class="flex items-center gap-2 pb-3 text-sm font-medium text-slate-700">
                  <input type="checkbox" checked={lockAspect} onChange={(e) => setLockAspect((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
                  Lock aspect ratio
                </label>
                {width > dims.w && <p class="w-full text-xs font-medium text-amber-700">⚠ Upscaling beyond {dims.w}px invents pixels — expect softness.</p>}
              </div>
            )}

            {mode === 'rotate' && (
              <div class="space-y-3">
                <div>
                  <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rotate</span>
                  <div class="flex flex-wrap gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button type="button" onClick={() => setRotation(deg)}
                        class={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${rotation === deg ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>
                        {deg === 0 ? 'None' : `${deg}°`}
                      </button>
                    ))}
                  </div>
                </div>
                <div class="flex flex-wrap gap-4">
                  <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={flipH} onChange={(e) => setFlipH((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
                    Flip horizontally (mirror)
                  </label>
                  <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={flipV} onChange={(e) => setFlipV((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
                    Flip vertically
                  </label>
                </div>
                {(rotation === 90 || rotation === 270) && (
                  <p class="text-xs text-slate-500">Output will be {dims.h}×{dims.w}px — a quarter-turn swaps width and height.</p>
                )}
              </div>
            )}

            {mode === 'circle' && (
              <p class="text-sm text-slate-600">
                The image is centre-cropped to a square, then masked to a circle. Output is always <strong>PNG</strong>, since the corners need transparency —
                {dims.w === dims.h ? ' your image is already square.' : ` a ${Math.min(dims.w, dims.h)}×${Math.min(dims.w, dims.h)}px circle from the middle.`}
              </p>
            )}

            {(mode === 'convert' || mode === 'compress' || mode === 'resize' || mode === 'rotate') && (
              <div class="mt-3">
                <label for="it-fmt" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Output format</label>
                <select id="it-fmt" value={format} onChange={(e) => setFormat((e.target as HTMLSelectElement).value as typeof format)} class={`${inputCls} max-w-xs`}>
                  <option value="image/jpeg">JPEG — photos, universal</option>
                  <option value="image/webp">WebP — smaller, transparency OK</option>
                  <option value="image/png">PNG — lossless, transparency</option>
                </select>
                {format === 'image/jpeg' && <p class="mt-1 text-xs text-slate-500">JPEG has no transparency — transparent areas are flattened to white.</p>}
              </div>
            )}

            {format !== 'image/png' && mode !== 'circle' && (
              <div class="mt-3">
                <label for="it-q" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Quality: {quality}</label>
                <input id="it-q" type="range" min={40} max={100} value={quality} onInput={(e) => setQuality(parseInt((e.target as HTMLInputElement).value, 10))} class="w-full max-w-xs accent-brand-600" />
              </div>
            )}

            <button type="button" onClick={render} class="mt-4 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">
              ⬇ {mode === 'compress' ? 'Compress' : mode === 'resize' ? 'Resize' : mode === 'rotate' ? 'Apply' : mode === 'circle' ? 'Crop to circle' : 'Convert'} &amp; download
            </button>
            {outInfo && <p class="mt-2 text-sm font-medium text-mint-700" aria-live="polite">{outInfo}</p>}
          </div>
        </div>
      )}

      {mode === 'base64' && b64 && (
        <div class="mt-4">
          <div class="flex items-center justify-between">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
              data: URL · {fmtSize(b64.length)} <span class="normal-case">({file ? `+${Math.round((b64.length / file.size - 1) * 100)}% vs file` : ''})</span>
            </p>
            <button type="button" onClick={copyB64} class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <textarea readOnly rows={6} value={b64} class="mt-2 w-full rounded-xl border border-brand-200 bg-white px-3 py-2 font-mono text-xs text-slate-800" spellcheck={false} />
          {b64.length > 100_000 && <p class="mt-1 text-xs font-medium text-amber-700">⚠ Over 100 KB — consider linking the file instead of embedding it.</p>}
        </div>
      )}
    </div>
  );
}
