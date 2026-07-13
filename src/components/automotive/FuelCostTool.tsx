import { useMemo, useState } from 'preact/hooks';
import { fuelUsed, tripFuelCost, type EfficiencyMode } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toLocaleString(undefined, { maximumFractionDigits: d });

const MODES: { id: EfficiencyMode; label: string; distUnit: string; fuelUnit: string }[] = [
  { id: 'mpg', label: 'mpg (US) + miles', distUnit: 'miles', fuelUnit: 'gal' },
  { id: 'kmL', label: 'km/L + km', distUnit: 'km', fuelUnit: 'L' },
  { id: 'l100km', label: 'L/100km + km', distUnit: 'km', fuelUnit: 'L' },
];

export default function FuelCostTool() {
  const [mode, setMode] = useState<EfficiencyMode>('mpg');
  const [distance, setDistance] = useState('300');
  const [eff, setEff] = useState('30');
  const [price, setPrice] = useState('3.50');

  const m = MODES.find((x) => x.id === mode)!;
  const r = useMemo(() => {
    const d = num(distance), e = num(eff), p = num(price);
    if (d == null || e == null || p == null) return null;
    const fuel = fuelUsed(d, e, mode);
    const cost = tripFuelCost(d, e, mode, p);
    if (fuel == null || cost == null) return null;
    return { fuel, cost, perDist: d > 0 ? cost / d : 0 };
  }, [mode, distance, eff, price]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block sm:w-72"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Efficiency units</span>
        <select value={mode} onChange={(e) => setMode((e.target as HTMLSelectElement).value as EfficiencyMode)} class={sel}>{MODES.map((x) => <option value={x.id}>{x.label}</option>)}</select></label>

      <div class="mt-3 grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance ({m.distUnit})</span>
          <input type="number" step="any" value={distance} onInput={(e) => setDistance((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Efficiency ({mode === 'l100km' ? 'L/100km' : mode === 'kmL' ? 'km/L' : 'mpg'})</span>
          <input type="number" step="any" value={eff} onInput={(e) => setEff((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fuel price (per {m.fuelUnit})</span>
          <input type="number" step="any" value={price} onInput={(e) => setPrice((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Trip fuel cost</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.cost)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fuel used</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.fuel)} {m.fuelUnit}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cost per {m.distUnit.replace('s', '')}</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perDist, 3)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter distance, efficiency and fuel price.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cost = fuel used × price, where fuel used is distance ÷ efficiency (mpg or km/L) or distance ÷ 100 × L/100km. Enter the price in your own currency — the result comes out in the same currency, so there\'s no exchange-rate or location data involved. For a round trip, double the distance. 🔒 In your browser.</p>
    </div>
  );
}
