import { useState } from 'preact/hooks';
import { randIntRange, randInt } from '../../lib/gen-compute';

export default function RandomNumberTool() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(false);
  const [results, setResults] = useState<number[]>(() => [randIntRange(1, 100)]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function draw() {
    setError('');
    if (max < min) return setError('Max must be ≥ min.');
    const span = max - min + 1;
    const n = Math.max(1, Math.min(count, 1000));
    if (unique && n > span) return setError(`Can't draw ${n} unique values from a range of ${span}.`);
    if (unique) {
      // partial Fisher–Yates over the range
      const pool = Array.from({ length: span }, (_, i) => min + i);
      for (let i = 0; i < n; i++) {
        const j = i + randInt(pool.length - i);
        [pool[i], pool[j]] = [pool[j]!, pool[i]!];
      }
      setResults(pool.slice(0, n));
    } else {
      setResults(Array.from({ length: n }, () => randIntRange(min, max)));
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(results.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  const numCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <div>
          <label for="rn-min" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Min</label>
          <input id="rn-min" type="number" value={min} onInput={(e) => setMin(parseInt((e.target as HTMLInputElement).value, 10) || 0)} class={numCls} />
        </div>
        <div>
          <label for="rn-max" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Max</label>
          <input id="rn-max" type="number" value={max} onInput={(e) => setMax(parseInt((e.target as HTMLInputElement).value, 10) || 0)} class={numCls} />
        </div>
        <div>
          <label for="rn-count" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">How many</label>
          <input id="rn-count" type="number" min={1} max={1000} value={count} onInput={(e) => setCount(parseInt((e.target as HTMLInputElement).value, 10) || 1)} class={numCls} />
        </div>
        <label class="flex items-center gap-2 self-end pb-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={unique} onChange={(e) => setUnique((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          No repeats
        </label>
      </div>

      <button type="button" onClick={draw} class="mt-4 w-full rounded-xl bg-brand-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-800 sm:w-auto sm:px-8">
        🎲 Generate
      </button>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4">
        {error ? (
          <p class="text-sm font-medium text-red-700">✗ {error}</p>
        ) : (
          <>
            <div class="flex flex-wrap items-center gap-2" aria-live="polite">
              {results.map((r) => (
                <span class={`rounded-lg px-3 py-1.5 font-mono font-bold ${results.length === 1 ? 'bg-brand-50 text-3xl text-brand-800' : 'bg-slate-100 text-lg text-slate-900'}`}>{r}</span>
              ))}
            </div>
            {results.length > 1 && (
              <button type="button" onClick={copy} class="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
                {copied ? '✓ Copied' : 'Copy all'}
              </button>
            )}
          </>
        )}
      </div>
      <p class="mt-2 text-xs text-slate-500">crypto.getRandomValues + rejection sampling — every value equally likely, drawn on your device.</p>
    </div>
  );
}
