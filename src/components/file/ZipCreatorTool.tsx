import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

export default function ZipCreatorTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState('archive');
  const [compress, setCompress] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ url: string; name: string; size: number } | null>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...incoming.filter((f) => !seen.has(f.name + f.size))];
    });
    setDone(null); setError('');
  };
  const remove = (i: number) => { setFiles((f) => f.filter((_, idx) => idx !== i)); setDone(null); };
  const clear = () => { setFiles([]); setDone(null); };

  const make = async () => {
    if (!files.length) return;
    setBusy(true); setError(''); setDone(null);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      for (const f of files) zip.file(f.name, f);
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: compress ? 'DEFLATE' : 'STORE',
        compressionOptions: { level: compress ? 6 : 0 },
      });
      const name = (zipName.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '') || 'archive') + '.zip';
      setDone({ url: URL.createObjectURL(blob), name, size: blob.size });
    } catch (e) {
      setError('Could not create the ZIP — ' + (e as Error).message);
    } finally { setBusy(false); }
  };

  const totalIn = files.reduce((n, f) => n + f.size, 0);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-7 text-center hover:border-brand-400">
        <input type="file" multiple class="hidden" onChange={(e) => addFiles((e.target as HTMLInputElement).files)} />
        <span class="text-sm font-semibold text-slate-700">{files.length ? '➕ Add more files' : '📁 Choose files to zip'}</span>
        <span class="mt-1 block text-xs text-slate-500">Select several at once — everything is zipped in your browser, nothing uploaded</span>
      </label>

      {files.length > 0 && (
        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-700">{files.length} file{files.length === 1 ? '' : 's'} · {fmtSize(totalIn)}</p>
            <button onClick={clear} class="text-xs font-semibold text-slate-500 hover:text-rose-600">Clear all</button>
          </div>
          <div class="max-h-64 overflow-auto rounded-xl bg-white ring-1 ring-slate-200">
            {files.map((f, i) => (
              <div class="flex items-center justify-between border-t border-slate-100 px-3 py-2 first:border-t-0">
                <span class="truncate font-mono text-xs text-slate-800">{f.name}</span>
                <span class="ml-2 flex shrink-0 items-center gap-2">
                  <span class="font-mono text-xs text-slate-400">{fmtSize(f.size)}</span>
                  <button onClick={() => remove(i)} class="text-slate-400 hover:text-rose-600" aria-label="Remove">✕</button>
                </span>
              </div>
            ))}
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-3">
            <label class="text-sm text-slate-600">ZIP name <input class="rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-sm" value={zipName} onInput={(e) => setZipName((e.target as HTMLInputElement).value)} /> .zip</label>
            <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={compress} onChange={(e) => setCompress((e.target as HTMLInputElement).checked)} /> Compress (DEFLATE)</label>
            <button onClick={make} disabled={busy} class="rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50">{busy ? 'Zipping…' : 'Create ZIP'}</button>
          </div>
        </div>
      )}

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {done && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <p class="text-sm text-slate-700">Created <strong>{done.name}</strong> — {fmtSize(done.size)}{totalIn > 0 && done.size < totalIn ? ` (${Math.round((1 - done.size / totalIn) * 100)}% smaller)` : ''}.</p>
          <a href={done.url} download={done.name} class="mt-3 inline-block rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">⬇ Download ZIP</a>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Bundles any files into a single standard .zip — for emailing a batch, backing up, or uploading where only one file is allowed. Compression (DEFLATE) shrinks text and documents a lot and already-compressed files (JPEG, PNG, MP4) barely at all; untick it to store files as-is (faster). 🔒 The ZIP is built entirely in your browser with JSZip, so your files are never uploaded.</p>
    </div>
  );
}
