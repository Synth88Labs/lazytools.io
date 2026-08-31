import { useState } from 'preact/hooks';
import { getImageDpi, setImageDpi } from '../../lib/image-dpi';
import { fmtSize } from '../../lib/audio-compute';

const PRESETS = [72, 96, 150, 200, 300, 600];

export default function ImageDpiTool() {
  const [file, setFile] = useState<File | null>(null);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg' | null>(null);
  const [currentDpi, setCurrentDpi] = useState<number | null>(null);
  const [target, setTarget] = useState('300');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ url: string; name: string; dpi: number } | null>(null);

  const onFile = async (f: File | null) => {
    setError(''); setResult(null); setFormat(null); setBytes(null); setCurrentDpi(null);
    if (!f) return;
    const b = new Uint8Array(await f.arrayBuffer());
    const info = getImageDpi(b);
    if (!info) { setError('This tool works with PNG and JPEG files (other formats don’t store a DPI value this way).'); return; }
    setFile(f); setBytes(b); setFormat(info.format); setCurrentDpi(info.dpi);
  };

  const apply = () => {
    if (!bytes || !file) return;
    const dpi = parseInt(target, 10);
    if (!Number.isFinite(dpi) || dpi <= 0) { setError('Enter a DPI greater than 0.'); return; }
    try {
      const { bytes: out } = setImageDpi(bytes, dpi);
      const blob = new Blob([out], { type: format === 'png' ? 'image/png' : 'image/jpeg' });
      const base = file.name.replace(/\.(png|jpe?g)$/i, '');
      setResult({ url: URL.createObjectURL(blob), name: `${base}-${dpi}dpi.${format === 'png' ? 'png' : 'jpg'}`, dpi });
      setError('');
    } catch (e) { setError((e as Error).message); }
  };

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-7 text-center hover:border-brand-400">
        <input type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="text-sm font-semibold text-slate-700">{file ? `🖼️ ${file.name}` : '🖼️ Choose a PNG or JPEG'}</span>
        <span class="mt-1 block text-xs text-slate-500">{file ? `${format?.toUpperCase()} · ${fmtSize(file.size)}` : 'DPI is metadata, the pixels are never changed'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {format && (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Current DPI</p>
            <p class="mt-1 text-2xl font-extrabold text-slate-800">{currentDpi != null ? `${currentDpi} DPI` : 'Not set'}</p>
            {currentDpi == null && <p class="mt-0.5 text-xs text-slate-400">The file has no density metadata yet, most apps then assume 72 or 96.</p>}
          </div>

          <div class="mt-3">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Set DPI to</span>
            <div class="flex flex-wrap items-center gap-2">
              <input type="number" min="1" aria-label="Set DPI to" class={`${inp} w-32`} value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} />
              {PRESETS.map((p) => (
                <button onClick={() => setTarget(String(p))} class={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${target === String(p) ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>{p}</button>
              ))}
              <button onClick={apply} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">Set DPI</button>
            </div>
          </div>
        </>
      )}

      {result && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <p class="text-sm text-slate-700">Saved a copy at <strong class="text-brand-800">{result.dpi} DPI</strong>, same pixels, updated print resolution.</p>
          <a href={result.url} download={result.name} class="mt-3 inline-block rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">⬇ Download {result.dpi} DPI image</a>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        DPI (dots per inch) tells a printer how large to print an image; it doesn’t change the pixels or the file’s appearance on screen. This edits the density metadata directly, PNG’s <span class="font-mono">pHYs</span> chunk or JPEG’s JFIF header, without re-encoding, so quality is untouched (unlike “resize to 300 DPI” tools that resample). For a specific <em>print size</em> you also need enough pixels: a 4×6&quot; photo at 300 DPI needs 1200×1800 pixels. 🔒 Runs entirely in your browser, the image is never uploaded.
      </p>
    </div>
  );
}
