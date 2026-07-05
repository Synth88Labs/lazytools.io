import { useEffect, useState } from 'preact/hooks';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

async function digest(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function HashTool({ sample = '' }: { sample?: string }) {
  const [input, setInput] = useState(sample);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out: Record<string, string> = {};
      for (const algo of ALGOS) {
        out[algo] = input ? await digest(algo, input) : '';
      }
      if (!cancelled) setHashes(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  async function copy(v: string) {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(v);
      setTimeout(() => setCopied(''), 1200);
    } catch { /* unavailable */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="hash-input" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Text to hash</label>
      <textarea
        id="hash-input"
        rows={5}
        value={input}
        onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        placeholder="Type or paste — hashes update live, locally…"
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        spellcheck={false}
      />
      <div class="mt-4 space-y-2">
        {ALGOS.map((algo) => (
          <div class="rounded-xl border border-slate-200 bg-white p-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wide text-slate-500">{algo}</span>
              <button
                type="button"
                onClick={() => copy(hashes[algo] ?? '')}
                disabled={!hashes[algo]}
                class="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-brand-800 disabled:opacity-40"
              >
                {copied === hashes[algo] && copied ? '✓' : 'Copy'}
              </button>
            </div>
            <p class="mt-1 break-all font-mono text-sm text-slate-800">{hashes[algo] || '—'}</p>
          </div>
        ))}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        Computed with the browser's Web Crypto API (crypto.subtle) — the input never leaves your device. MD5 is
        intentionally absent: it's cryptographically broken and excluded from Web Crypto.
      </p>
    </div>
  );
}
