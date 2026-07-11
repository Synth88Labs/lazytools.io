import { useMemo, useState } from 'preact/hooks';
import { cagr } from '../../lib/finance';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pct = (x: number) => (x * 100).toFixed(2);

export default function CagrTool() {
  const [start, setStart] = useState('10000');
  const [end, setEnd] = useState('18000');
  const [years, setYears] = useState('5');

  const r = useMemo(() => {
    const s = num(start), e = num(end), y = num(years);
    if (s == null || e == null || y == null || s <= 0 || y <= 0) return null;
    const g = cagr(s, e, y);
    const total = e / s - 1;
    return { cagr: g, total, multiple: e / s };
  }, [start, end, years]);

  const inp = (val: string, set: (v: string) => void, label: string, prefix?: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
        {prefix && <span class="pl-3 text-sm text-slate-400">{prefix}</span>}
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)} class="w-full rounded-xl bg-transparent px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none" />
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(start, setStart, 'Starting value', '$')}
        {inp(end, setEnd, 'Ending value', '$')}
        {inp(years, setYears, 'Number of years')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">CAGR</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{pct(r.cagr)}%</p><p class="mt-1 text-xs text-slate-400">per year</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total return</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{pct(r.total)}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Growth multiple</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.multiple.toFixed(2)}×</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the start and end values and the number of years.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">CAGR = (end ÷ start)^(1/years) − 1 — the smoothed annual growth rate. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
