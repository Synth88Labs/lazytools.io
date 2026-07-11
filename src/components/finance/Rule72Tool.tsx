import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toFixed(2)).toString();

export default function Rule72Tool() {
  const [rate, setRate] = useState('8');

  const r = useMemo(() => {
    const rt = num(rate);
    if (rt == null || rt <= 0) return null;
    const d = rt / 100;
    return { yrs72: 72 / rt, yrs70: 70 / rt, exact: Math.log(2) / Math.log(1 + d) };
  }, [rate]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Annual interest / growth rate (%)</span>
        <input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rule of 72</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.yrs72)} <span class="text-lg text-slate-500">yrs</span></p><p class="mt-1 text-xs text-slate-400">to double</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rule of 70</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.yrs70)} <span class="text-lg text-slate-500">yrs</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Exact</p><p class="mt-1 text-2xl font-extrabold text-emerald-700">{fmt(r.exact)} <span class="text-lg text-slate-500">yrs</span></p><p class="mt-1 text-xs text-slate-400">ln2 ÷ ln(1+r)</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an annual rate above 0%.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The Rule of 72 estimates the doubling time: years ≈ 72 ÷ rate. It’s most accurate near 8%; the exact figure is ln2 ÷ ln(1+rate). Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
