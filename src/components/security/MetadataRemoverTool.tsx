import { useState } from 'preact/hooks';
import { detectJpegMetadata } from '../../lib/security-compute';
import { fmtSize } from '../../lib/audio-compute';

export default function MetadataRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [found, setFound] = useState<string[] | null>(null);
  const [preview, setPreview] = useState('');
  const [quality, setQuality] = useState(92);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setDone('');
    setFound(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
    if (f.type === 'image/jpeg') {
      const bytes = new Uint8Array(await f.arrayBuffer());
      setFound(detectJpegMetadata(bytes));
    } else {
      setFound([]); // non-JPEG: can't itemize, but stripping still works
    }
  }

  function clean() {
    if (!file) return;
    setError('');
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      const isPng = file.type === 'image/png';
      canvas.toBlob(
        (blob) => {
          if (!blob) return setError('Re-encoding failed — the format may not be supported.');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const base = file.name.replace(/\.[^.]+$/, '');
          a.href = url;
          a.download = `${base}-clean.${isPng ? 'png' : 'jpg'}`;
          a.click();
          URL.revokeObjectURL(url);
          setDone(`✓ Clean copy downloaded — ${fmtSize(file.size)} → ${fmtSize(blob.size)}, metadata stripped.`);
        },
        isPng ? 'image/png' : 'image/jpeg',
        quality / 100
      );
    };
    img.onerror = () => setError('Could not decode this image in your browser.');
    img.src = preview;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose a photo'}</span>
        <span class="mt-1 block text-xs text-slate-500">{file ? fmtSize(file.size) : 'JPEG, PNG, WebP — scanned and cleaned locally'}</span>
      </label>

      {file && (
        <div class="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <img src={preview} alt="Preview of the selected photo" class="max-h-48 w-full rounded-xl border border-slate-200 object-contain bg-white" />
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Metadata detected</p>
            {found === null ? (
              <p class="mt-1 text-sm text-slate-600">Scanning…</p>
            ) : found.length > 0 ? (
              <ul class="mt-1 space-y-1">
                {found.map((f) => (
                  <li class="text-sm font-medium text-amber-800">⚠ {f}</li>
                ))}
              </ul>
            ) : (
              <p class="mt-1 text-sm text-slate-600">
                {file.type === 'image/jpeg'
                  ? '✓ No metadata segments found in this JPEG.'
                  : 'Itemized scan is JPEG-only, but stripping works for any format the browser decodes.'}
              </p>
            )}

            {file.type !== 'image/png' && (
              <div class="mt-3">
                <label for="mr-q" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Re-encode quality: {quality}</label>
                <input id="mr-q" type="range" min={70} max={100} value={quality} onInput={(e) => setQuality(parseInt((e.target as HTMLInputElement).value, 10))} class="w-full max-w-xs accent-brand-600" />
              </div>
            )}

            <button type="button" onClick={clean} class="mt-3 rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">
              🧹 Strip metadata & download
            </button>
            <div aria-live="polite">
              {done && <p class="mt-2 text-sm font-medium text-mint-700">{done}</p>}
              {error && <p class="mt-2 text-sm font-medium text-red-700">✗ {error}</p>}
            </div>
          </div>
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">The clean copy contains pixels only — canvas re-encoding never carries metadata across.</p>
    </div>
  );
}
