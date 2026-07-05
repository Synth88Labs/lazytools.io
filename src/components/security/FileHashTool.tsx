import { useState } from 'preact/hooks';
import { hashFile } from '../../lib/security-compute';
import { fmtSize } from '../../lib/audio-compute';

export default function FileHashTool() {
  const [name, setName] = useState('');
  const [size, setSize] = useState(0);
  const [hashes, setHashes] = useState<{ algo: string; hex: string }[]>([]);
  const [expected, setExpected] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');

  async function onFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    setBusy(true);
    setName(file.name);
    setSize(file.size);
    const buf = await file.arrayBuffer();
    const out: { algo: string; hex: string }[] = [];
    for (const algo of ['SHA-256', 'SHA-512', 'SHA-1'] as const) {
      out.push({ algo, hex: await hashFile(buf, algo) });
    }
    setHashes(out);
    setBusy(false);
  }

  const cleaned = expected.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
  const match = cleaned ? hashes.find((h) => h.hex === cleaned) : null;

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* unavailable */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">Choose a file to hash</span>
        <span class="mt-1 block text-xs text-slate-500">Any file type — it never leaves your browser</span>
      </label>

      {busy && <p class="mt-3 text-sm font-medium text-slate-600">Hashing…</p>}

      {hashes.length > 0 && !busy && (
        <>
          <p class="mt-4 text-sm font-semibold text-slate-900">{name} <span class="font-normal text-slate-500">· {fmtSize(size)}</span></p>
          <div class="mt-2 space-y-2">
            {hashes.map((h) => (
              <div class={`rounded-xl border bg-white p-3 ${match?.algo === h.algo ? 'border-mint-500 ring-2 ring-mint-200' : 'border-slate-200'}`}>
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wide text-slate-500">{h.algo}{h.algo === 'SHA-1' ? ' (legacy)' : ''}</span>
                  <button type="button" onClick={() => copy(h.hex)} class="rounded border border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700">
                    {copied === h.hex ? '✓' : 'Copy'}
                  </button>
                </div>
                <p class="mt-1 break-all font-mono text-xs text-slate-900">{h.hex}</p>
              </div>
            ))}
          </div>

          <label for="fh-expected" class="mt-4 mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Compare with expected checksum (paste from the download page)</label>
          <input
            id="fh-expected"
            type="text"
            value={expected}
            onInput={(e) => setExpected((e.target as HTMLInputElement).value)}
            placeholder="e.g. 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
            spellcheck={false}
          />
          {cleaned && (
            <p class={`mt-2 text-sm font-bold ${match ? 'text-mint-700' : 'text-red-700'}`} aria-live="polite">
              {match ? `✓ Match — identical ${match.algo} checksum; the file is intact.` : '✗ No match against any computed hash — re-download and check you\'re comparing the right file/version.'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
