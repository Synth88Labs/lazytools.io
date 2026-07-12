import { useMemo, useState } from 'preact/hooks';
import { solarProduction } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function SolarOutputTool() {
  const [panelW, setPanelW] = useState('400');
  const [count, setCount] = useState('6');
  const [sunHours, setSunHours] = useState('4.5');
  const [derate, setDerate] = useState('80');

  const r = useMemo(() => {
    const w = num(panelW), c = num(count), sh = num(sunHours), d = num(derate);
    if (w == null || c == null || sh == null || d == null || d === 0) return null;
    const total = w * c;
    const prod = solarProduction(total, sh, d / 100);
    return prod ? { total, ...prod } : null;
  }, [panelW, count, sunHours, derate]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Panel wattage (W)</span>
          <input type="number" step="any" value={panelW} onInput={(e) => setPanelW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of panels</span>
          <input type="number" step="1" value={count} onInput={(e) => setCount((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Peak sun hours/day</span>
          <input type="number" step="any" value={sunHours} onInput={(e) => setSunHours((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">System efficiency (%)</span>
          <input type="number" step="any" value={derate} onInput={(e) => setDerate((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-2 text-sm text-slate-500">Array size: <strong class="text-slate-700">{fmt(r.total / 1000, 2)} kW</strong> ({fmt(r.total, 0)} W)</div>
          <div class="mt-3 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per day</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.dailyKwh)} kWh</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per month</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.monthlyKwh, 0)} kWh</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per year</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.annualKwh, 0)} kWh</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the panel wattage, count, peak sun hours and system efficiency.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Daily kWh = total watts × peak sun hours × system efficiency ÷ 1000. Peak sun hours are the equivalent hours of full (1 kW/m²) sun for your location — roughly 3–4 in cloudy northern regions and 5–6+ in sunny climates, and lower in winter; look yours up from a solar-irradiance map (e.g. NREL). System efficiency of ~75–85% accounts for inverter, wiring, heat, dust and mismatch losses. An estimate — real output varies with weather, shading and panel age. 🔒 In your browser.</p>
    </div>
  );
}
