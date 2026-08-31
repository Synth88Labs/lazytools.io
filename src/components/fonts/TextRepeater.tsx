import { useState } from 'preact/hooks';

const SEPARATORS: { id: string; name: string; value: string }[] = [
  { id: 'newline', name: 'New line', value: '\n' },
  { id: 'space', name: 'Space', value: ' ' },
  { id: 'none', name: 'Nothing', value: '' },
  { id: 'comma', name: 'Comma', value: ', ' },
  { id: 'custom', name: 'Custom', value: '' },
];

export default function TextRepeater() {
  const [text, setText] = useState('Hello');
  const [count, setCount] = useState(10);
  const [sepId, setSepId] = useState('newline');
  const [custom, setCustom] = useState(', ');
  const [numbered, setNumbered] = useState(false);
  const [copied, setCopied] = useState(false);

  const n = Math.max(0, Math.min(10000, Math.floor(count) || 0));
  const sep = sepId === 'custom' ? custom : SEPARATORS.find((s) => s.id === sepId)!.value;
  const out = Array.from({ length: n }, (_, i) => (numbered ? `${i + 1}. ${text}` : text)).join(sep);

  async function copy() {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Text to repeat</span>
        <textarea
          value={text}
          rows={2}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">How many times</span>
          <input
            type="number"
            value={count}
            min={0}
            max={10000}
            onInput={(e) => setCount(Number((e.target as HTMLInputElement).value))}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Separate with</span>
          <select
            value={sepId}
            onChange={(e) => setSepId((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {SEPARATORS.map((s) => <option value={s.id}>{s.name}</option>)}
          </select>
        </label>
      </div>

      {sepId === 'custom' && (
        <label class="mt-3 block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Custom separator</span>
          <input
            value={custom}
            onInput={(e) => setCustom((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
      )}

      <label class="mt-3 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={numbered} onChange={(e) => setNumbered((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" />
        Number each line (1. 2. 3. …)
      </label>

      <div class="mt-4">
        <div class="mb-1.5 flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Result</span>
          <span class="text-xs text-slate-400">{out.length.toLocaleString()} characters</span>
        </div>
        <textarea
          readonly
          rows={6}
          value={out}
          aria-label="Result"
          class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-mono text-sm text-slate-800"
        />
      </div>

      <div class="mt-3 flex justify-end">
        <button
          type="button"
          onClick={copy}
          class={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${copied ? 'bg-mint-600' : 'bg-brand-600 hover:bg-brand-700'}`}
        >
          {copied ? '✓ Copied' : 'Copy result'}
        </button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Repeats up to 10,000 times. Handy for test data, filling a field, or a bit of fun, all generated in your browser. 🔒
      </p>
    </div>
  );
}
