import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });

export default function BreakEvenTool() {
  const [fixed, setFixed] = useState('10000');
  const [price, setPrice] = useState('40');
  const [variable, setVariable] = useState('15');

  const r = useMemo(() => {
    const f = num(fixed), p = num(price), v = num(variable);
    if (f == null || p == null || v == null) return null;
    const margin = p - v;
    if (margin <= 0) return { impossible: true as const };
    const units = f / margin;
    return { units, revenue: units * p, margin, marginPct: (margin / p) * 100 };
  }, [fixed, price, variable]);

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
        {inp(fixed, setFixed, 'Fixed costs', '$')}
        {inp(price, setPrice, 'Price per unit', '$')}
        {inp(variable, setVariable, 'Variable cost per unit', '$')}
      </div>

      {r ? (
        'impossible' in r ? (
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ The price doesn’t cover the variable cost per unit, so you lose money on every sale and never break even. Raise the price or cut the variable cost.</p>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Break-even units</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{Math.ceil(r.units).toLocaleString()}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Break-even revenue</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.revenue)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Contribution margin</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.margin)}</p><p class="mt-1 text-xs text-slate-400">{r.marginPct.toFixed(0)}% per unit</p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your fixed costs, unit price and variable cost per unit.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Break-even units = fixed costs ÷ (price − variable cost). Above this, each sale is profit. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
