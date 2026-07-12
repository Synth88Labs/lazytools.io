import { useMemo, useState } from 'preact/hooks';
import { applianceCost } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function ApplianceCostTool() {
  const [watts, setWatts] = useState('150');
  const [hours, setHours] = useState('24');
  const [rate, setRate] = useState('0.30');

  const r = useMemo(() => {
    const w = num(watts), h = num(hours), rt = num(rate);
    if (w == null || h == null || rt == null) return null;
    return applianceCost(w, h, rt);
  }, [watts, hours, rate]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Power (watts)</span>
          <input type="number" step="any" value={watts} onInput={(e) => setWatts((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hours used per day</span>
          <input type="number" step="any" value={hours} onInput={(e) => setHours((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Electricity rate (per kWh)</span>
          <input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per day</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{money(r.dailyCost)}</p><p class="mt-0.5 text-xs text-slate-500">{fmt(r.dailyKwh, 2)} kWh</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per month</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{money(r.monthlyCost)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per year</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{money(r.annualCost)}</p><p class="mt-0.5 text-xs text-slate-500">{fmt(r.annualKwh, 0)} kWh</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the appliance's power, daily hours and your electricity rate.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cost = power (kW) × hours × rate. Find the watts on the appliance's label or a plug-in energy meter; for things that cycle (fridges, heaters, AC) use the average hours they actually run, not the hours they're plugged in. Amounts are in whatever currency you enter. 🔒 In your browser.</p>
    </div>
  );
}
