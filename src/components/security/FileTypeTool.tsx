import { useState } from 'preact/hooks';
import { identifyFile, hexToBytes, toHex, type IdentifyResult } from '../../lib/file-signatures';

const CAT_ICON: Record<string, string> = { image: '🖼️', document: '📄', archive: '🗜️', audio: '🎵', video: '🎬', font: '🔤', executable: '⚙️', database: '🗄️', other: '📦' };

export default function FileTypeTool() {
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [hexInput, setHexInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [headHex, setHeadHex] = useState('');
  const [error, setError] = useState('');

  const run = (data: Uint8Array, name?: string) => {
    setError('');
    setHeadHex(toHex(data, 16));
    setResult(identifyFile(data, name));
    setFileName(name || '');
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    const buf = new Uint8Array(await (f.slice(0, 512).arrayBuffer()));
    run(buf, f.name);
  };

  const fromHex = () => {
    try { run(hexToBytes(hexInput)); }
    catch (e) { setError((e as Error).message); setResult(null); }
  };

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center hover:border-brand-400">
        <input type="file" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="text-sm font-semibold text-slate-700">📂 Choose any file</span>
        <span class="mt-1 block text-xs text-slate-500">Only the first 512 bytes are read — nothing is uploaded</span>
      </label>

      <div class="mt-3">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">…or paste the first bytes as hex</span>
        <div class="flex gap-2">
          <input class={inp} value={hexInput} onInput={(e) => setHexInput((e.target as HTMLInputElement).value)} placeholder="89 50 4E 47 0D 0A 1A 0A" />
          <button onClick={fromHex} disabled={!hexInput.trim()} class="shrink-0 rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-50">Identify</button>
        </div>
      </div>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {result && (
        <div class="mt-4 space-y-3">
          {result.detected ? (
            <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
              <p class="text-3xl font-extrabold text-brand-800">{CAT_ICON[result.detected.category]} {result.detected.name}</p>
              <p class="mt-1 font-mono text-sm text-slate-600">{result.detected.mime} · .{result.detected.ext.slice(0, 4).join(' / .')}</p>
            </div>
          ) : (
            <div class="rounded-xl bg-slate-100 p-4 ring-1 ring-slate-200">
              <p class="text-lg font-bold text-slate-700">Unrecognized signature</p>
              <p class="mt-1 text-sm text-slate-500">The leading bytes don't match a known format. It may be a plain-text file (CSV, JSON, HTML, source code) — those have no magic number — or an uncommon binary format.</p>
            </div>
          )}

          {result.extensionMatches === false && result.detected && (
            <div class="rounded-xl bg-amber-50 p-4 ring-2 ring-amber-300">
              <p class="text-sm font-semibold text-amber-800">⚠️ Extension mismatch</p>
              <p class="mt-1 text-sm text-amber-700">The file is named <span class="font-mono">.{result.claimedExt}</span> but its bytes are actually a <strong>{result.detected.name}</strong>. A wrong extension is often harmless (a mislabelled download), but a deliberately disguised file can be a red flag — the content, not the name, is what actually opens.</p>
            </div>
          )}
          {result.extensionMatches === true && (
            <p class="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200">✓ The <span class="font-mono">.{result.claimedExt}</span> extension matches the actual file content.</p>
          )}

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">First 16 bytes (hex)</p>
            <p class="mt-1 break-all font-mono text-sm text-slate-800">{headHex}</p>
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Every binary format begins with a "magic number" — a fixed byte signature (PNG is 89 50 4E 47, PDF is %PDF, ZIP is PK…). This reads those leading bytes and reports the true type regardless of the file's name, and flags when a file's extension doesn't match its real content. Plain-text formats (CSV, JSON, HTML, code) have no magic number and read as "unrecognized." 🔒 Only the first bytes are read, entirely in your browser — nothing is uploaded.</p>
    </div>
  );
}
