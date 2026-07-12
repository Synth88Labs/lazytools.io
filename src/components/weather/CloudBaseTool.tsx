import { useMemo, useState } from 'preact/hooks';
import { cloudBaseFt, cToF } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Math.round(x).toLocaleString();

export default function CloudBaseTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('77');
  const [dew, setDew] = useState('59');

  const r = useMemo(() => {
    const t = num(temp), d = num(dew);
    if (t == null || d == null) return null;
    if (d > t) return { error: 'Dew point cannot exceed the temperature.' };
    const tF = unit === 'F' ? t : cToF(t);
    const dF = unit === 'F' ? d : cToF(d);
    const ft = cloudBaseFt(tF, dF);
    return { ft, m: ft * 0.3048, spreadF: tF - dF };
  }, [temp, dew, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['F', 'C'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>°{u}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Surface temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Surface dew point (°{unit})</span>
          <input type="number" step="any" value={dew} onInput={(e) => setDew((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        'error' in r ? (
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-200">{r.error}</p>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated cloud base (AGL)</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.ft)} <span class="text-lg text-slate-500">ft</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.m)} m above ground</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Temp–dew point spread</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.spreadF)}°F</p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the surface temperature and dew point.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A pilot's rule of thumb: cumulus cloud base ≈ (temperature − dew point in °F) ÷ 4.4 × 1,000 feet, or about 400 ft per °C of spread. It works best for fair-weather convective (cumulus) cloud on a well-mixed afternoon — it's an estimate, not for stratus, fronts or stable air, and not a substitute for aviation weather reports. 🔒 In your browser.</p>
    </div>
  );
}
