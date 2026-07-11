import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pct = (x: number) => (x * 100).toFixed(2);

export default function RoiTool() {
  const [cost, setCost] = useState('10000');
  const [ret, setRet] = useState('13500');
  const [years, setYears] = useState('3');

  const r = useMemo(() => {
    const c = num(cost), v = num(ret), y = num(years);
    if (c == null || v == null || c === 0) return null;
    const gain = v - c;
    const roi = gain / Math.abs(c);
    const annualized = y != null && y > 0 && c > 0 && v > 0 ? Math.pow(v / c, 1 / y) - 1 : null;
    return { gain, roi, annualized };
  }, [cost, ret, years]);

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
        {inp(cost, setCost, 'Amount invested', '$')}
        {inp(ret, setRet, 'Final value / return', '$')}
        {inp(years, setYears, 'Years held (optional)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">ROI</p><p class={`mt-1 text-3xl font-extrabold ${r.roi >= 0 ? 'text-brand-800' : 'text-red-600'}`}>{pct(r.roi)}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Net gain</p><p class={`mt-1 text-2xl font-extrabold ${r.gain >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>${r.gain.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Annualised (CAGR)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.annualized != null ? pct(r.annualized) + '%' : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the amount invested and the final value.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">ROI = (final − invested) ÷ invested × 100. The annualised figure is the CAGR over the holding period. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
