import { useMemo, useState } from 'preact/hooks';
import { inflationAdjust } from '../../lib/finance-planning';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 2 });

export default function InflationTool() {
  const [amount, setAmount] = useState('10000');
  const [rate, setRate] = useState('3');
  const [years, setYears] = useState('20');

  const res = useMemo(() => {
    const a = num(amount), r = num(rate), y = num(years);
    if (a == null || r == null || y == null || y < 0) return null;
    const adj = inflationAdjust(a, r, y);
    // also the nominal amount you'd need to keep the same purchasing power
    const needed = a * Math.pow(1 + r / 100, y);
    return { ...adj, needed };
  }, [amount, rate, years]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount today</span><input type="number" step="any" value={amount} onInput={(e) => setAmount((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Inflation rate (%/yr)</span><input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Years</span><input type="number" step="any" value={years} onInput={(e) => setYears((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Real value (today's money)</p><p class="mt-1 font-mono text-2xl font-extrabold text-brand-800">{money(res.real)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-rose-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Purchasing power lost</p><p class="mt-1 font-mono text-2xl font-extrabold text-rose-700">{res.lossPct.toFixed(1)}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Needed to keep pace</p><p class="mt-1 font-mono text-2xl font-extrabold text-slate-800">{money(res.needed)}</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter an amount, an average inflation rate and a number of years.</p>}

      <p class="mt-4 text-xs text-slate-500">Inflation erodes what money can buy: the real value after N years is amount ÷ (1 + rate)ᴺ. At 3% a year, money loses about a quarter of its purchasing power over 10 years and nearly half over 20. The "needed to keep pace" figure is the future amount that would buy the same as your amount does today. Uses the rate you enter — no fixed CPI table. Educational, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
