/** SVG → PNG rasterizer. 100% client-side — nothing is uploaded. */
import { useState, useRef, useEffect } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface Intrinsic {
  w: number;
  h: number;
  source: 'viewBox' | 'width/height' | null;
}

/** Read intrinsic size from SVG markup via viewBox or width/height attributes. */
function parseIntrinsic(svg: string): Intrinsic {
  const vb = svg.match(/viewBox\s*=\s*["']\s*([-\d.eE]+)[\s,]+([-\d.eE]+)[\s,]+([-\d.eE]+)[\s,]+([-\d.eE]+)\s*["']/);
  if (vb) {
    const w = parseFloat(vb[3]);
    const h = parseFloat(vb[4]);
    if (w > 0 && h > 0) return { w, h, source: 'viewBox' };
  }
  const wm = svg.match(/\bwidth\s*=\s*["']\s*([\d.]+)\s*(px)?\s*["']/i);
  const hm = svg.match(/\bheight\s*=\s*["']\s*([\d.]+)\s*(px)?\s*["']/i);
  if (wm && hm) {
    const w = parseFloat(wm[1]);
    const h = parseFloat(hm[1]);
    if (w > 0 && h > 0) return { w, h, source: 'width/height' };
  }
  return { w: 0, h: 0, source: null };
}

export default function SvgToPngTool() {
  const [svgText, setSvgText] = useState('');
  const [fileName, setFileName] = useState('');
  const [intrinsic, setIntrinsic] = useState<Intrinsic>({ w: 0, h: 0, source: null });
  const [outW, setOutW] = useState(512);
  const [outH, setOutH] = useState(512);
  const [lockAspect, setLockAspect] = useState(true);
  const [bg, setBg] = useState<'transparent' | 'white'>('transparent');
  const [error, setError] = useState('');
  const [pngSize, setPngSize] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const aspect = intrinsic.w > 0 && intrinsic.h > 0 ? intrinsic.h / intrinsic.w : 1;
  const baseName = (fileName.replace(/\.svg$/i, '') || 'image').trim() || 'image';

  /** Ingest new markup: parse size, seed output dimensions. */
  function ingest(text: string) {
    setSvgText(text);
    setError('');
    setPngSize(null);
    const trimmed = text.trim();
    if (!trimmed) {
      setIntrinsic({ w: 0, h: 0, source: null });
      return;
    }
    const intr = parseIntrinsic(trimmed);
    setIntrinsic(intr);
    if (intr.source) {
      const w = Math.round(intr.w) || 512;
      setOutW(w);
      setOutH(Math.max(1, Math.round(w * (intr.h / intr.w))));
    } else {
      setOutW(512);
      setOutH(512);
    }
  }

  function onFile(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => ingest(String(reader.result || ''));
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsText(file);
  }

  function onWidth(v: number) {
    const w = Math.max(1, Math.round(v || 0));
    setOutW(w);
    if (lockAspect) setOutH(Math.max(1, Math.round(w * aspect)));
  }

  function onHeight(v: number) {
    const h = Math.max(1, Math.round(v || 0));
    setOutH(h);
    if (lockAspect && aspect > 0) setOutW(Math.max(1, Math.round(h / aspect)));
  }

  /** Rasterize the SVG onto `target` at outW×outH. Calls back with the canvas. */
  function rasterize(target: HTMLCanvasElement, done?: (c: HTMLCanvasElement) => void) {
    if (!svgText.trim()) return;
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const ctx = target.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      target.width = outW;
      target.height = outH;
      ctx.clearRect(0, 0, outW, outH);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (bg === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outW, outH);
      }
      try {
        ctx.drawImage(img, 0, 0, outW, outH);
        setError('');
        done?.(target);
      } catch {
        setError("Couldn't render this SVG — check the markup.");
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Couldn't render this SVG — check the markup.");
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  // Live preview whenever inputs change.
  useEffect(() => {
    if (!canvasRef.current || !svgText.trim()) return;
    rasterize(canvasRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgText, outW, outH, bg]);

  function download() {
    const c = document.createElement('canvas');
    rasterize(c, (canvas) => {
      canvas.toBlob((b) => {
        if (!b) {
          setError("Couldn't create the PNG.");
          return;
        }
        setPngSize(b.size);
        const url = URL.createObjectURL(b);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${baseName}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, 'image/png');
    });
  }

  const hasSvg = svgText.trim().length > 0;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="space-y-5">
        {/* File input */}
        <div>
          <label class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600 transition hover:border-brand-500 hover:bg-slate-50">
            <span class="font-medium text-slate-700">Choose an SVG file</span>
            <span class="text-xs text-slate-500">or drop the markup below — nothing leaves your browser</span>
            <input
              type="file"
              accept="image/svg+xml,.svg"
              class="hidden"
              onChange={onFile}
            />
          </label>
          {fileName && <p class="mt-1.5 text-xs text-slate-500">Loaded: {fileName}</p>}
        </div>

        {/* Paste textarea */}
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Or paste SVG markup</label>
          <textarea
            value={svgText}
            onInput={(e) => ingest((e.currentTarget as HTMLTextAreaElement).value)}
            placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>…</svg>"
            rows={5}
            aria-label="Paste SVG markup"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-xs text-slate-800"
          />
          {hasSvg && (
            <p class="mt-1.5 text-xs text-slate-500">
              {intrinsic.source
                ? `Detected size: ${intrinsic.w} × ${intrinsic.h} (from ${intrinsic.source})`
                : 'No intrinsic size found — using 512 × 512 default.'}
            </p>
          )}
        </div>

        {/* Output controls */}
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Output width (px)</label>
            <input
              type="number"
              min={1}
              value={outW}
              aria-label="Output width (px)"
              onInput={(e) => onWidth(parseInt((e.currentTarget as HTMLInputElement).value, 10))}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Output height (px)</label>
            <input
              type="number"
              min={1}
              value={outH}
              aria-label="Output height (px)"
              onInput={(e) => onHeight(parseInt((e.currentTarget as HTMLInputElement).value, 10))}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>
        </div>

        <label class="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={lockAspect}
            onChange={(e) => setLockAspect((e.currentTarget as HTMLInputElement).checked)}
            class="h-4 w-4 rounded border-slate-300"
          />
          Lock aspect ratio
        </label>

        {/* Background */}
        <div>
          <span class="mb-1.5 block text-sm font-medium text-slate-700">Background</span>
          <div class="flex gap-4 text-sm text-slate-700">
            <label class="flex items-center gap-2">
              <input
                type="radio"
                name="bg"
                checked={bg === 'transparent'}
                onChange={() => setBg('transparent')}
                class="h-4 w-4"
              />
              Transparent
            </label>
            <label class="flex items-center gap-2">
              <input
                type="radio"
                name="bg"
                checked={bg === 'white'}
                onChange={() => setBg('white')}
                class="h-4 w-4"
              />
              White
            </label>
          </div>
        </div>

        {error && <p class="text-sm font-medium text-red-600">{error}</p>}

        {/* Preview */}
        {hasSvg && !error && (
          <div>
            <span class="mb-1.5 block text-sm font-medium text-slate-700">Live PNG preview</span>
            <canvas
              ref={canvasRef}
              class="max-h-72 w-auto rounded-xl border bg-white"
              style={{
                backgroundImage:
                  bg === 'transparent'
                    ? 'linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)'
                    : undefined,
                backgroundSize: bg === 'transparent' ? '16px 16px' : undefined,
                backgroundPosition: bg === 'transparent' ? '0 0,0 8px,8px -8px,-8px 0' : undefined,
              }}
            />
          </div>
        )}

        {/* Download */}
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={download}
            disabled={!hasSvg}
            class="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download PNG
          </button>
          {pngSize != null && (
            <span class="text-sm text-slate-600">
              PNG saved · {fmtSize(pngSize)} · {outW} × {outH}
            </span>
          )}
        </div>

        <p class="text-xs text-slate-500">
          Everything runs locally in your browser. Your SVG is never uploaded to any server.
        </p>
      </div>
    </div>
  );
}
