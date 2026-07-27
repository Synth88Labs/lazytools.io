import { useRef, useState } from 'preact/hooks';

interface Loaded {
  img: HTMLImageElement;
  name: string;
  w: number;
  h: number;
}

const PRESETS = [
  { label: '3 × 3 (Instagram grid)', rows: 3, cols: 3 },
  { label: '2 × 2', rows: 2, cols: 2 },
  { label: '1 × 3 (carousel strip)', rows: 1, cols: 3 },
  { label: '3 × 1 (vertical)', rows: 3, cols: 1 },
];

export default function SplitImageTool() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setError('');
    const img = new Image();
    img.onload = () => setLoaded({ img, name: f.name.replace(/\.[^.]+$/, ''), w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => setError('That file could not be read as an image.');
    img.src = URL.createObjectURL(f);
  }

  const r = Math.max(1, Math.min(10, Math.floor(rows) || 1));
  const c = Math.max(1, Math.min(10, Math.floor(cols) || 1));
  const tileW = loaded ? Math.floor(loaded.w / c) : 0;
  const tileH = loaded ? Math.floor(loaded.h / r) : 0;

  async function downloadAll() {
    if (!loaded) return;
    setBusy(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (let row = 0; row < r; row++) {
        for (let col = 0; col < c; col++) {
          const canvas = document.createElement('canvas');
          canvas.width = tileW;
          canvas.height = tileH;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(loaded.img, col * tileW, row * tileH, tileW, tileH, 0, 0, tileW, tileH);
          const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/png'));
          if (blob) zip.file(`${loaded.name}_${row + 1}-${col + 1}.png`, blob);
        }
      }
      const out = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(out);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${loaded.name}_${r}x${c}_tiles.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{loaded ? `${loaded.name} — ${loaded.w}×${loaded.h}` : 'Choose an image to split'}</span>
        <span class="mt-1 block text-xs text-slate-500">Split on your device — the image is never uploaded</span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}

      {loaded && (
        <div class="mt-4">
          <div class="flex flex-wrap items-end gap-4">
            <label class="text-sm font-medium text-slate-700">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rows</span>
              <input type="number" min={1} max={10} value={rows} onInput={(e) => setRows(Number((e.target as HTMLInputElement).value))} class="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900 focus:border-brand-500 focus:outline-none" />
            </label>
            <label class="text-sm font-medium text-slate-700">
              <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Columns</span>
              <input type="number" min={1} max={10} value={cols} onInput={(e) => setCols(Number((e.target as HTMLInputElement).value))} class="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-900 focus:border-brand-500 focus:outline-none" />
            </label>
            <div class="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button type="button" onClick={() => { setRows(p.rows); setCols(p.cols); }} class="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700">{p.label}</button>
              ))}
            </div>
          </div>

          <p class="mt-3 text-sm text-slate-600">{r * c} tiles of <strong>{tileW} × {tileH}px</strong> each.</p>

          <div ref={previewRef} class="relative mt-3 inline-block max-w-full overflow-hidden rounded-lg border border-slate-200">
            <img src={loaded.img.src} alt="preview" class="block max-h-80 w-auto max-w-full" />
            <div class="pointer-events-none absolute inset-0 grid" style={`grid-template-columns:repeat(${c},1fr);grid-template-rows:repeat(${r},1fr)`}>
              {Array.from({ length: r * c }, (_, i) => <div key={i} class="border border-white/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.25)]" />)}
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button type="button" onClick={downloadAll} disabled={busy} class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${busy ? 'bg-slate-400' : 'bg-brand-600 hover:bg-brand-700'}`}>
              {busy ? 'Slicing…' : `⬇ Download ${r * c} tiles (.zip)`}
            </button>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Slices your image into an even grid and downloads each tile as a PNG (numbered row-column). Great for Instagram grid posts and carousels. If the dimensions don't divide evenly, tiles use the floor size and a thin edge may be trimmed. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
