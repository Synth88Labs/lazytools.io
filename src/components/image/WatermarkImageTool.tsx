import { useState, useEffect, useRef, useCallback } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

type Dims = { w: number; h: number };
type Pos =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';
type Fmt = 'png' | 'jpeg' | 'webp';

const POSITIONS: { id: Pos; label: string }[] = [
  { id: 'top-left', label: '↖' },
  { id: 'top-center', label: '↑' },
  { id: 'top-right', label: '↗' },
  { id: 'middle-left', label: '←' },
  { id: 'center', label: '•' },
  { id: 'middle-right', label: '→' },
  { id: 'bottom-left', label: '↙' },
  { id: 'bottom-center', label: '↓' },
  { id: 'bottom-right', label: '↘' },
];

const MIME: Record<Fmt, string> = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
};
const EXT: Record<Fmt, string> = { png: 'png', jpeg: 'jpg', webp: 'webp' };

export default function WatermarkImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [dims, setDims] = useState<Dims>({ w: 0, h: 0 });
  const [error, setError] = useState<string>('');

  const [text, setText] = useState('© Your Name');
  const [fontPct, setFontPct] = useState(5);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(50);
  const [bold, setBold] = useState(true);
  const [outline, setOutline] = useState(true);
  const [tile, setTile] = useState(false);
  const [pos, setPos] = useState<Pos>('bottom-right');
  const [fmt, setFmt] = useState<Fmt>('png');
  const [downloaded, setDownloaded] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setError('');
    setDownloaded(false);
    setFile(f);
    const url = URL.createObjectURL(f);
    setImgUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    const image = new Image();
    image.onload = () => {
      setDims({ w: image.naturalWidth, h: image.naturalHeight });
      setImg(image);
      // Default output format matches input where sensible, else PNG.
      if (f.type === 'image/jpeg') setFmt('jpeg');
      else if (f.type === 'image/webp') setFmt('webp');
      else setFmt('png');
    };
    image.onerror = () => {
      setError('Could not load that image. Try a JPEG, PNG, or WebP file.');
      setImg(null);
      setDims({ w: 0, h: 0 });
    };
    image.src = url;
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !dims.w || !dims.h) return;
    canvas.width = dims.w;
    canvas.height = dims.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, dims.w, dims.h);
    ctx.drawImage(img, 0, 0, dims.w, dims.h);

    const label = text.trim();
    if (!label) return;

    const px = Math.max(1, Math.round((fontPct / 100) * dims.w));
    const weight = bold ? '700' : '400';
    ctx.font = `${weight} ${px}px system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = Math.max(1, px * 0.06);
    ctx.lineJoin = 'round';

    const stamp = (x: number, y: number) => {
      if (outline) ctx.strokeText(label, x, y);
      ctx.fillText(label, x, y);
    };

    ctx.save();
    ctx.globalAlpha = opacity / 100;

    if (tile) {
      // Rotate the whole canvas ~ -30° and repeat the text on a grid that
      // covers the (rotated) area, so the mark spans the entire image.
      const metrics = ctx.measureText(label);
      const stepX = Math.max(metrics.width + px * 1.5, px * 3);
      const stepY = px * 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(dims.w / 2, dims.h / 2);
      ctx.rotate((-30 * Math.PI) / 180);
      // Over-extend beyond the diagonal so corners are covered after rotation.
      const reach = Math.ceil(Math.hypot(dims.w, dims.h) / 2) + Math.max(stepX, stepY);
      for (let y = -reach; y <= reach; y += stepY) {
        // Offset alternate rows for a woven look.
        const rowOffset = (Math.round(y / stepY) % 2) * (stepX / 2);
        for (let x = -reach - stepX; x <= reach + stepX; x += stepX) {
          stamp(x + rowOffset, y);
        }
      }
    } else {
      const pad = px * 0.6;
      let x = pad;
      let y = pad;
      const vert = pos.split('-')[0];
      const horiz = pos.startsWith('middle') ? pos.split('-')[1] : pos.split('-')[1] || 'center';

      // Horizontal
      if (pos === 'center' || horiz === 'center') {
        ctx.textAlign = 'center';
        x = dims.w / 2;
      } else if (horiz === 'left') {
        ctx.textAlign = 'left';
        x = pad;
      } else {
        ctx.textAlign = 'right';
        x = dims.w - pad;
      }

      // Vertical
      if (pos === 'center' || vert === 'middle') {
        ctx.textBaseline = 'middle';
        y = dims.h / 2;
      } else if (vert === 'top') {
        ctx.textBaseline = 'top';
        y = pad;
      } else {
        ctx.textBaseline = 'bottom';
        y = dims.h - pad;
      }

      stamp(x, y);
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }, [img, dims, text, fontPct, color, opacity, bold, outline, tile, pos]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [imgUrl]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const quality = fmt === 'jpeg' || fmt === 'webp' ? 0.92 : undefined;
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Could not generate the image.');
          return;
        }
        const base = file.name.replace(/\.[^.]+$/, '') || 'image';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${base}-watermarked.${EXT[fmt]}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setDownloaded(true);
      },
      MIME[fmt],
      quality,
    );
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm';

  return (
    <div class="space-y-4">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">
          {file ? file.name : 'Choose an image'}
        </span>
        <span class="mt-1 block text-xs text-slate-500">
          {file
            ? `${fmtSize(file.size)} · ${dims.w}×${dims.h}px`
            : 'JPEG, PNG, WebP — processed on your device'}
        </span>
      </label>

      {error && (
        <p class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      )}

      {img && (
        <>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <label class="block">
                <span class="mb-1 block text-sm font-medium text-slate-700">
                  Watermark text
                </span>
                <input
                  type="text"
                  value={text}
                  onInput={(e) => setText((e.target as HTMLInputElement).value)}
                  class={inputCls}
                  placeholder="© Your Name"
                />
              </label>

              <label class="block">
                <span class="mb-1 block text-sm font-medium text-slate-700">
                  Output format
                </span>
                <select
                  value={fmt}
                  onChange={(e) =>
                    setFmt((e.target as HTMLSelectElement).value as Fmt)
                  }
                  class={inputCls}
                >
                  <option value="png">PNG (keeps transparency)</option>
                  <option value="jpeg">JPEG</option>
                  <option value="webp">WebP</option>
                </select>
              </label>

              <label class="block">
                <span class="mb-1 block text-sm font-medium text-slate-700">
                  Font size — {fontPct}% of width
                </span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={fontPct}
                  onInput={(e) =>
                    setFontPct(Number((e.target as HTMLInputElement).value))
                  }
                  class="w-full accent-brand-700"
                />
              </label>

              <label class="block">
                <span class="mb-1 block text-sm font-medium text-slate-700">
                  Opacity — {opacity}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onInput={(e) =>
                    setOpacity(Number((e.target as HTMLInputElement).value))
                  }
                  class="w-full accent-brand-700"
                />
              </label>

              <label class="flex items-center gap-3">
                <span class="text-sm font-medium text-slate-700">Colour</span>
                <input
                  type="color"
                  value={color}
                  onInput={(e) => setColor((e.target as HTMLInputElement).value)}
                  class="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white"
                />
              </label>

              <div class="flex flex-wrap items-center gap-4">
                <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={bold}
                    onChange={(e) =>
                      setBold((e.target as HTMLInputElement).checked)
                    }
                    class="h-4 w-4 accent-brand-700"
                  />
                  Bold
                </label>
                <label class="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={outline}
                    onChange={(e) =>
                      setOutline((e.target as HTMLInputElement).checked)
                    }
                    class="h-4 w-4 accent-brand-700"
                  />
                  Outline (for busy photos)
                </label>
              </div>
            </div>

            <div class="mt-4">
              <label class="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={tile}
                  onChange={(e) => setTile((e.target as HTMLInputElement).checked)}
                  class="h-4 w-4 accent-brand-700"
                />
                Tile — repeat diagonally across the whole image
              </label>

              {!tile && (
                <div class="mt-3">
                  <span class="mb-2 block text-sm font-medium text-slate-700">
                    Position
                  </span>
                  <div class="grid w-32 grid-cols-3 gap-1">
                    {POSITIONS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPos(p.id)}
                        aria-pressed={pos === p.id}
                        aria-label={p.id}
                        class={`flex h-9 items-center justify-center rounded-lg border text-base transition ${
                          pos === p.id
                            ? 'border-brand-700 bg-brand-700 text-white'
                            : 'border-slate-300 bg-white text-slate-600 hover:border-brand-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
            <span class="mb-2 block text-sm font-medium text-slate-700">
              Preview
            </span>
            <div class="flex justify-center rounded-xl bg-[repeating-conic-gradient(#e2e8f0_0%_25%,#f8fafc_0%_50%)] bg-[length:20px_20px] p-2">
              <canvas ref={canvasRef} class="max-h-80 w-auto rounded" />
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={download}
                class="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Download {EXT[fmt].toUpperCase()}
              </button>
              <span aria-live="polite" class="text-sm font-medium text-emerald-600">
                {downloaded ? '✓ Downloaded' : ''}
              </span>
            </div>
            <p class="mt-3 text-xs text-slate-500">
              Nothing leaves your device — the image is watermarked entirely in
              your browser.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
