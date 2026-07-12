import { useMemo, useState } from 'preact/hooks';
import { printEnergy } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PrintEnergyTool() {
  const [watts, setWatts] = useState('100');
  const [hours, setHours] = useState('4');
  const [mins, setMins] = useState('30');
  const [rate, setRate] = useState('0.30');

  const r = useMemo(() => {
    const w = num(watts), h = num(hours), m = num(mins), rt = num(rate);
    if (w == null || h == null || m == null || rt == null) return null;
    return printEnergy(w, h + m / 60, rt);
  }, [watts, hours, mins, rate]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Printer power (W)</span>
          <input type="number" step="any" value={watts} onInput={(e) => setWatts((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Print time — hours</span>
          <input type="number" step="1" value={hours} onInput={(e) => setHours((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">…minutes</span>
          <input type="number" step="1" value={mins} onInput={(e) => setMins((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Electricity (per kWh)</span>
          <input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Electricity cost</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{money(r.cost)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Energy used</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.kwh.toFixed(3)} kWh</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the printer's power, the print time and your electricity rate.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cost = power (kW) × time (h) × rate. A typical FDM printer averages about 50–150 W during a print (the heated bed dominates), so 100 W is a reasonable default — but measure yours with a plug meter for accuracy, as bed temperature and enclosure change it a lot. Amounts are in whatever currency you enter. 🔒 In your browser.</p>
    </div>
  );
}
