import { useState, useRef, useEffect } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

type Item = { img: HTMLImageElement; url: string; name: string; w: number; h: number };
type Direction = 'vertical' | 'horizontal';
type Align = 'start' | 'center' | 'end';
type Format = 'png' | 'jpeg';

export default function CombineImagesTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [direction, setDirection] = useState<Direction>('vertical');
  const [align, setAlign] = useState<Align>('center');
  const [gap, setGap] = useState<number>(0);
  const [bg, setBg] = useState<string>('#ffffff');
  const [format, setFormat] = useState<Format>('png');
  const [error, setError] = useState<string>('');
  const [done, setDone] = useState<string>('');
  const [outDims, setOutDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;

  // Revoke all object URLs on unmount.
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, []);

  function onFiles(e: Event) {
    const list = (e.target as HTMLInputElement).files;
    if (!list || list.length === 0) return;
    setError('');
    setDone('');

    const files = Array.from(list);
    let remaining = files.length;
    const loaded: Item[] = [];

    files.forEach((f) => {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.onload = () => {
        loaded.push({ img, url, name: f.name, w: img.naturalWidth, h: img.naturalHeight });
        if (--remaining === 0) finish();
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setError('One or more files could not be loaded as images.');
        if (--remaining === 0) finish();
      };
      img.src = url;
    });

    function finish() {
      if (loaded.length > 0) setItems((prev) => [...prev, ...loaded]);
    }

    // Allow selecting the same files again later.
    (e.target as HTMLInputElement).value = '';
  }

  function removeItem(idx: number) {
    setDone('');
    setItems((prev) => {
      const it = prev[idx];
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function crossOffset(canvasSize: number, itemSize: number): number {
    if (align === 'start') return 0;
    if (align === 'end') return canvasSize - itemSize;
    return (canvasSize - itemSize) / 2;
  }

  // Re-render the preview canvas whenever inputs or controls change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (items.length === 0) {
      canvas.width = 0;
      canvas.height = 0;
      setOutDims({ w: 0, h: 0 });
      return;
    }

    const g = Math.max(0, Math.round(gap));
    const n = items.length;
    let cw = 0;
    let ch = 0;

    if (direction === 'vertical') {
      cw = Math.max(...items.map((it) => it.w));
      ch = items.reduce((s, it) => s + it.h, 0) + g * (n - 1);
    } else {
      ch = Math.max(...items.map((it) => it.h));
      cw = items.reduce((s, it) => s + it.w, 0) + g * (n - 1);
    }

    canvas.width = cw;
    canvas.height = ch;

    // Fill background first so gaps / letterboxing aren't transparent-black in JPEG.
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, cw, ch);

    let offset = 0;
    for (const it of items) {
      if (direction === 'vertical') {
        const x = crossOffset(cw, it.w);
        ctx.drawImage(it.img, Math.round(x), Math.round(offset));
        offset += it.h + g;
      } else {
        const y = crossOffset(ch, it.h);
        ctx.drawImage(it.img, Math.round(offset), Math.round(y));
        offset += it.w + g;
      }
    }

    setOutDims({ w: cw, h: ch });
  }, [items, direction, align, gap, bg]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || items.length < 2) return;
    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : 'jpg';
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError('Could not generate the combined image.');
          return;
        }
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = `combined.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDone(`✓ Downloaded — ${canvas.width}×${canvas.height} (${fmtSize(blob.size)})`);
      },
      mime,
      format === 'jpeg' ? 0.92 : undefined,
    );
  }

  const canDownload = items.length >= 2;
  const alignOptions: { value: Align; label: string }[] =
    direction === 'vertical'
      ? [
          { value: 'start', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Right' },
        ]
      : [
          { value: 'start', label: 'Top' },
          { value: 'center', label: 'Middle' },
          { value: 'end', label: 'Bottom' },
        ];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="space-y-5">
        {/* File input */}
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">
            Choose images (select several)
          </label>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onFiles}
            aria-label="Choose images"
            class="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-brand-700 file:px-3 file:py-1.5 file:text-white hover:file:bg-brand-800"
          />
          <p class="mt-1.5 text-xs text-slate-500">
            Everything runs in your browser — no upload. Order = the order shown below. Add more to append.
          </p>
        </div>

        {error && (
          <p class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        {/* Thumbnails */}
        {items.length > 0 && (
          <div class="flex flex-wrap gap-3">
            {items.map((it, i) => (
              <div
                key={it.url}
                class="relative overflow-hidden rounded-xl border border-slate-300 bg-white"
              >
                <img src={it.url} alt={it.name} class="h-20 w-20 object-contain" />
                <span class="absolute bottom-0 left-0 rounded-tr-lg bg-slate-900/70 px-1.5 py-0.5 text-[10px] text-white">
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  aria-label={`Remove ${it.name}`}
                  class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/70 text-xs text-white hover:bg-red-600"
                >
                  {'✕'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        {items.length > 0 && (
          <div class="grid gap-4 sm:grid-cols-2">
            {/* Direction */}
            <div>
              <span class="mb-1.5 block text-sm font-medium text-slate-700">Direction</span>
              <div class="inline-flex rounded-xl border border-slate-300 bg-white p-1">
                {(['vertical', 'horizontal'] as Direction[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDirection(d)}
                    class={`rounded-lg px-3 py-1.5 text-sm ${
                      direction === d ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {d === 'vertical' ? 'Vertical (stacked)' : 'Horizontal (side by side)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment */}
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">
                Align {direction === 'vertical' ? '(horizontal)' : '(vertical)'}
              </label>
              <select
                value={align}
                onChange={(e) => setAlign((e.target as HTMLSelectElement).value as Align)}
                aria-label="Alignment"
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                {alignOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Gap */}
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">Gap (px)</label>
              <input
                type="number"
                min={0}
                value={gap}
                aria-label="Gap (px)"
                onInput={(e) => setGap(Math.max(0, Number((e.target as HTMLInputElement).value) || 0))}
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              />
            </div>

            {/* Background + format */}
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">Background</label>
                <div class="flex items-center gap-2">
                  <input
                    type="color"
                    value={bg}
                    onInput={(e) => setBg((e.target as HTMLInputElement).value)}
                    aria-label="Background colour"
                    class="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white"
                  />
                  <span class="text-sm text-slate-600">{bg}</span>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium text-slate-700">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat((e.target as HTMLSelectElement).value as Format)}
                  aria-label="Format"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        {items.length > 0 && (
          <div>
            <span class="mb-1.5 block text-sm font-medium text-slate-700">
              Preview {outDims.w > 0 && (
                <span class="font-normal text-slate-500">
                  — {outDims.w}×{outDims.h}
                </span>
              )}
            </span>
            <div class="overflow-auto rounded-xl bg-slate-100 p-3" tabIndex={0} aria-label="Combined image preview">
              <canvas ref={canvasRef} class="max-h-96 w-auto rounded-xl border border-slate-300" />
            </div>
          </div>
        )}

        {/* Download */}
        <div class="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={download}
            disabled={!canDownload}
            class="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download combined image
          </button>
          {!canDownload && (
            <span class="text-sm text-slate-500">Add at least two images.</span>
          )}
          {done && <span class="text-sm font-medium text-green-700">{done}</span>}
        </div>
      </div>
    </div>
  );
}
