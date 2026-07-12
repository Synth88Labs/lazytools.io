import { useMemo, useState } from 'preact/hooks';
import { batteryLifeHours } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
function fmtDuration(hours: number): string {
  if (hours >= 24) return `${Number((hours / 24).toFixed(1))} days (${Math.round(hours)} h)`;
  if (hours >= 1) return `${Number(hours.toFixed(1))} hours`;
  return `${Math.round(hours * 60)} minutes`;
}

export default function BatteryLifeTool() {
  const [capacity, setCapacity] = useState('2000');
  const [load, setLoad] = useState('100');
  const [derate, setDerate] = useState('80');

  const r = useMemo(() => {
    const c = num(capacity), l = num(load), d = num(derate);
    if (c == null || l == null || d == null) return null;
    const ideal = batteryLifeHours(c, l, 1);
    const real = batteryLifeHours(c, l, d / 100);
    return { ideal, real };
  }, [capacity, load, derate]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Battery capacity (mAh)</span>
          <input type="number" step="any" value={capacity} onInput={(e) => setCapacity((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Device current draw (mA)</span>
          <input type="number" step="any" value={load} onInput={(e) => setLoad((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Efficiency (%)</span>
          <input type="number" step="any" value={derate} onInput={(e) => setDerate((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated life (real)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtDuration(r.real)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Theoretical maximum</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmtDuration(r.ideal)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the capacity, current draw and efficiency.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Life ≈ capacity (mAh) ÷ current draw (mA), then multiplied by an efficiency factor (~70–85%) for real-world losses. It's a rough estimate: actual runtime also depends on discharge rate (the Peukert effect), temperature, the cutoff voltage and how the load varies over time. 🔒 In your browser.</p>
    </div>
  );
}
