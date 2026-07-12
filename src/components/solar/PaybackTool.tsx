import { useMemo, useState } from 'preact/hooks';
import { solarPayback } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const money = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export default function PaybackTool() {
  const [cost, setCost] = useState('12000');
  const [annualKwh, setAnnualKwh] = useState('6000');
  const [rate, setRate] = useState('0.30');

  const r = useMemo(() => {
    const c = num(cost), k = num(annualKwh), rt = num(rate);
    if (c == null || k == null || rt == null) return null;
    return solarPayback(c, k, rt);
  }, [cost, annualKwh, rate]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Net system cost (after incentives)</span>
          <input type="number" step="any" value={cost} onInput={(e) => setCost((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Annual production (kWh)</span>
          <input type="number" step="any" value={annualKwh} onInput={(e) => setAnnualKwh((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Electricity rate (per kWh)</span>
          <input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Simple payback</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.paybackYears.toFixed(1)} yrs</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Annual savings</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{money(r.annualSavings)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Net savings over 25 yrs</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{money(r.savings25yr)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the system cost, its annual production and your electricity rate.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Simple payback = net cost ÷ annual savings, where annual savings = production × your rate. It's a first-order estimate: it ignores electricity-price inflation (which shortens payback), panel degradation (~0.5%/yr) and the time-value of money, and assumes you use or are credited for all the energy. Use it to compare options, not as financial advice — get quotes and check local incentives and net-metering rules. Amounts are in whatever currency you enter. 🔒 In your browser.</p>
    </div>
  );
}
