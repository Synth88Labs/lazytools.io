import { useMemo, useState } from 'preact/hooks';
import { aprToApy, apyToApr } from '../../lib/finance';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pct = (x: number) => (x * 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '');

const FREQ: { label: string; n: number }[] = [
  { label: 'Daily', n: 365 }, { label: 'Monthly', n: 12 }, { label: 'Quarterly', n: 4 }, { label: 'Annually', n: 1 },
];

export default function AprApyTool() {
  const [mode, setMode] = useState<'toApy' | 'toApr'>('toApy');
  const [val, setVal] = useState('12');
  const [freq, setFreq] = useState('12');

  const r = useMemo(() => {
    const v = num(val);
    if (v == null || v < 0) return null;
    const n = parseInt(freq, 10);
    if (mode === 'toApy') return { out: aprToApy(v / 100, n), label: 'APY (effective annual)' };
    return { out: apyToApr(v / 100, n), label: 'APR (nominal annual)' };
  }, [mode, val, freq]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['toApy', 'APR → APY'], ['toApr', 'APY → APR']] as const).map(([m, l]) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{l}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'toApy' ? 'APR (nominal, %)' : 'APY (effective, %)'}</span>
          <input type="number" step="any" value={val} onInput={(e) => setVal((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Compounding</span>
          <select value={freq} onChange={(e) => setFreq((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200">
            {FREQ.map((f) => <option value={f.n}>{f.label}</option>)}
          </select>
        </label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.label}</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{pct(r.out)}%</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a rate and compounding frequency.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">APY = (1 + APR/n)ⁿ − 1. APY includes compounding, so it’s always ≥ APR — compare savings and loans on the same basis. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
