import { useMemo, useState } from 'preact/hooks';
import { checksumText, checksums, type ChecksumResult } from '../../lib/checksums';
import { fmtSize } from '../../lib/audio-compute';

export default function ChecksumTool() {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog');
  const [fileResult, setFileResult] = useState<{ name: string; r: ChecksumResult } | null>(null);
  const [busy, setBusy] = useState(false);

  const textResult = useMemo(() => (mode === 'text' ? checksumText(text) : null), [mode, text]);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      setFileResult({ name: f.name, r: checksums(bytes) });
    } finally { setBusy(false); }
  };

  const active = mode === 'text' ? textResult : fileResult?.r ?? null;
  const copy = (v: string) => navigator.clipboard?.writeText(v);

  const row = (label: string, hex: string, dec: number) => (
    <div class="flex items-center justify-between gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p class="mt-0.5 font-mono text-lg font-bold text-slate-800">{hex}</p>
        <p class="text-xs text-slate-400">decimal {dec.toLocaleString()}</p>
      </div>
      <button onClick={() => copy(hex)} class="shrink-0 rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button>
    </div>
  );

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('text')} class={`rounded-lg px-3 py-1 ${mode === 'text' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Text</button>
        <button onClick={() => setMode('file')} class={`rounded-lg px-3 py-1 ${mode === 'file' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>File</button>
      </div>

      {mode === 'text' ? (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Text (UTF-8)</span>
          <textarea rows={3} class={inp} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
        </label>
      ) : (
        <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center hover:border-brand-400">
          <input type="file" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
          <span class="text-sm font-semibold text-slate-700">{fileResult ? `📄 ${fileResult.name}` : '📄 Choose a file'}</span>
          <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Checksummed locally — nothing uploaded'}</span>
        </label>
      )}

      {active && (
        <div class="mt-4 space-y-2">
          {row('CRC-32 (ZIP/PNG)', active.crc32Hex, active.crc32)}
          {row('Adler-32 (zlib)', active.adler32Hex, active.adler32)}
          <p class="text-xs text-slate-400">{active.bytes.toLocaleString()} bytes checksummed{mode === 'file' && fileResult ? ` · ${fmtSize(active.bytes)}` : ''}</p>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">CRC-32 and Adler-32 are fast, non-cryptographic checksums used to detect accidental corruption — CRC-32 is the one inside ZIP archives and PNG chunks; Adler-32 is used by zlib. They quickly tell you whether two copies of some data are byte-identical. They are NOT for security or passwords (they're easy to forge on purpose and can collide) — use SHA-256 for that. 🔒 Computed entirely in your browser.</p>
    </div>
  );
}
