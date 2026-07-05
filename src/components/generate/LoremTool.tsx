import { useState } from 'preact/hooks';
import { generateLorem } from '../../lib/gen-compute';

export default function LoremTool() {
  const [mode, setMode] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [text, setText] = useState(() => generateLorem('paragraphs', 3, true));
  const [copied, setCopied] = useState(false);

  function regen(m = mode, c = count, cl = classic) {
    setText(generateLorem(m, c, cl));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <div>
          <label for="li-mode" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Generate</label>
          <select id="li-mode" value={mode} onChange={(e) => { const m = (e.target as HTMLSelectElement).value as typeof mode; setMode(m); regen(m); }} class={inputCls}>
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <div>
          <label for="li-count" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Count</label>
          <input id="li-count" type="number" min={1} max={mode === 'words' ? 5000 : 100} value={count} onInput={(e) => { const c = parseInt((e.target as HTMLInputElement).value, 10) || 1; setCount(c); regen(mode, c); }} class={inputCls} />
        </div>
        <label class="flex items-center gap-2 self-end pb-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={classic} onChange={(e) => { const v = (e.target as HTMLInputElement).checked; setClassic(v); regen(mode, count, v); }} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Start with "Lorem ipsum…"
        </label>
      </div>

      <div class="mt-3 flex justify-end gap-2">
        <button type="button" onClick={() => regen()} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
          🔄 Regenerate
        </button>
        <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <textarea readOnly rows={10} value={text} class="mt-2 w-full rounded-xl border border-brand-200 bg-white px-3 py-3 text-sm leading-relaxed text-slate-800" />
    </div>
  );
}
