import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface Entry { path: string; size: number; dir: boolean; getBlob: () => Promise<Blob> }

export default function ZipExtractorTool() {
  const [name, setName] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (f: File | null) => {
    setError(''); setEntries([]); setName('');
    if (!f) return;
    setBusy(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = await JSZip.loadAsync(await f.arrayBuffer());
      const list: Entry[] = [];
      zip.forEach((path, file) => {
        list.push({
          path,
          dir: file.dir,
          // @ts-ignore uncompressedSize is present at runtime
          size: (file as any)._data ? (file as any)._data.uncompressedSize ?? 0 : 0,
          getBlob: () => file.async('blob'),
        });
      });
      list.sort((a, b) => a.path.localeCompare(b.path));
      setEntries(list);
      setName(f.name);
    } catch (e) {
      setError('Could not read this ZIP. It may be corrupt, encrypted (password-protected ZIPs aren\'t supported), or not a ZIP file.');
    } finally {
      setBusy(false);
    }
  };

  const download = async (e: Entry) => {
    const blob = await e.getBlob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = e.path.split('/').pop() || 'file';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const files = entries.filter((e) => !e.dir);
  const totalSize = files.reduce((n, e) => n + e.size, 0);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-7 text-center hover:border-brand-400">
        <input type="file" accept=".zip,application/zip,application/x-zip-compressed" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="text-sm font-semibold text-slate-700">{name ? `🗜️ ${name}` : '🗜️ Choose a .zip file'}</span>
        <span class="mt-1 block text-xs text-slate-500">Opened in your browser, no software, nothing uploaded</span>
      </label>

      {busy && <p class="mt-4 text-sm text-slate-500">Reading archive…</p>}
      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {files.length > 0 && (
        <div class="mt-4">
          <p class="mb-2 text-sm font-semibold text-slate-700">{files.length} file{files.length === 1 ? '' : 's'} · {fmtSize(totalSize)} uncompressed</p>
          <div class="max-h-96 overflow-auto rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-left text-sm">
              <thead class="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th class="px-3 py-2">File</th><th class="px-3 py-2 text-right">Size</th><th class="px-3 py-2"></th></tr>
              </thead>
              <tbody>
                {files.map((e) => (
                  <tr class="border-t border-slate-100">
                    <td class="px-3 py-2 font-mono text-xs text-slate-800 break-all">{e.path}</td>
                    <td class="px-3 py-2 text-right font-mono text-xs text-slate-500 whitespace-nowrap">{fmtSize(e.size)}</td>
                    <td class="px-3 py-2 text-right"><button onClick={() => download(e)} class="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-800">Save</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Lists everything inside a ZIP archive and lets you save any file out of it, no unzip software needed, and no upload. Works with standard ZIP files from any tool; encrypted (password-protected) archives and formats like RAR or 7z aren\'t supported. 🔒 The archive is read entirely in your browser with JSZip; nothing is transmitted.</p>
    </div>
  );
}
