import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

/** HEIC/HEIF → JPG/PNG via libheif wasm (heic-to), lazy-loaded on first use. */
export default function HeicTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [quality, setQuality] = useState(85);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultInfo, setResultInfo] = useState('');

  function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setResultInfo('');
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
  }

  async function convert() {
    if (!file) return;
    setError('');
    setBusy('Loading the HEIC decoder (first use only)…');
    try {
      // ~1.2 MB wasm decoder — loaded only when someone actually converts
      const { isHeic, heicTo } = await import('heic-to');
      setBusy('Decoding…');
      if (!(await isHeic(file))) {
        setBusy('');
        return setError('This file doesn\'t look like HEIC/HEIF — for JPG, PNG or WebP use the image converter instead.');
      }
      const out = (await heicTo({ blob: file, type: format, quality: quality / 100 })) as Blob;
      const url = URL.createObjectURL(out);
      setResultUrl(url);
      setResultInfo(`${fmtSize(file.size)} HEIC → ${fmtSize(out.size)} ${format === 'image/png' ? 'PNG' : 'JPG'}`);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace(/\.[^.]+$/, '')}.${format === 'image/png' ? 'png' : 'jpg'}`;
      a.click();
    } catch (e) {
      setError((e as Error).message || 'Decoding failed — the file may be corrupted or use an unsupported HEIF variant.');
    }
    setBusy('');
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".heic,.heif,image/heic,image/heif" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose a HEIC / HEIF photo'}</span>
        <span class="mt-1 block text-xs text-slate-500">{file ? fmtSize(file.size) : 'Straight from an iPhone — decoded on your device'}</span>
      </label>

      {file && (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label for="heic-fmt" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Convert to</label>
            <select
              id="heic-fmt"
              value={format}
              onChange={(e) => setFormat((e.target as HTMLSelectElement).value as typeof format)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none"
            >
              <option value="image/jpeg">JPG — universal, small</option>
              <option value="image/png">PNG — lossless, larger</option>
            </select>
          </div>
          {format === 'image/jpeg' && (
            <div>
              <label for="heic-q" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Quality: {quality}</label>
              <input id="heic-q" type="range" min={50} max={100} value={quality} onInput={(e) => setQuality(parseInt((e.target as HTMLInputElement).value, 10))} class="w-full accent-brand-600" />
            </div>
          )}
        </div>
      )}

      {file && (
        <button type="button" onClick={convert} disabled={!!busy} class="mt-4 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40">
          {busy || '🔁 Convert & download'}
        </button>
      )}

      <div aria-live="polite">
        {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}
        {resultUrl && !error && (
          <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4">
            <p class="text-sm font-medium text-mint-700">✓ {resultInfo} — download started.</p>
            <img src={resultUrl} alt="Converted photo preview" class="mt-3 max-h-64 rounded-lg border border-slate-200 object-contain" />
          </div>
        )}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        Decoding uses libheif compiled to WebAssembly, fetched on first convert (~1 MB) and run entirely in your browser — photos are never uploaded.
      </p>
    </div>
  );
}
