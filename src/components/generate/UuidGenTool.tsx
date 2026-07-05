import { useState } from 'preact/hooks';

export default function UuidGenTool() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => crypto.randomUUID()));
  const [copied, setCopied] = useState(false);

  function regen(n = count) {
    setUuids(Array.from({ length: Math.max(1, Math.min(n, 1000)) }, () => crypto.randomUUID()));
  }

  const text = (upper ? uuids.map((u) => u.toUpperCase()) : uuids).join('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-4">
        <div>
          <label for="uuid-count" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">How many (1–1000)</label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onInput={(e) => {
              const v = parseInt((e.target as HTMLInputElement).value, 10) || 1;
              setCount(v);
              regen(v);
            }}
            class="w-32 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <label class="flex items-center gap-2 pb-2.5 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={upper} onChange={(e) => setUpper((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          UPPERCASE
        </label>
        <div class="ml-auto flex gap-2 pb-0.5">
          <button type="button" onClick={() => regen()} class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
            🔄 Regenerate
          </button>
          <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800">
            {copied ? '✓ Copied' : 'Copy all'}
          </button>
        </div>
      </div>

      <textarea
        readOnly
        rows={Math.min(12, Math.max(4, uuids.length))}
        value={text}
        class="mt-4 w-full rounded-xl border border-brand-200 bg-white px-3 py-3 font-mono text-sm text-slate-900"
        spellcheck={false}
      />
      <p class="mt-2 text-xs text-slate-500">RFC 4122 version 4, via crypto.randomUUID() — generated locally.</p>
    </div>
  );
}
