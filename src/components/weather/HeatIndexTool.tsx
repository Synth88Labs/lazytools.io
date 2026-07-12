import { useMemo, useState } from 'preact/hooks';
import { heatIndexF, cToF, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Math.round(x);

function risk(hiF: number): { label: string; color: string } {
  if (hiF >= 125) return { label: 'Extreme danger', color: 'text-red-700' };
  if (hiF >= 103) return { label: 'Danger', color: 'text-red-600' };
  if (hiF >= 90) return { label: 'Extreme caution', color: 'text-orange-600' };
  if (hiF >= 80) return { label: 'Caution', color: 'text-amber-600' };
  return { label: 'Comfortable', color: 'text-emerald-600' };
}

export default function HeatIndexTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('90');
  const [rh, setRh] = useState('70');

  const r = useMemo(() => {
    const t = num(temp), h = num(rh);
    if (t == null || h == null || h < 0 || h > 100) return null;
    const tF = unit === 'F' ? t : cToF(t);
    const hiF = heatIndexF(tF, h);
    return { hiF, hiC: fToC(hiF), risk: risk(hiF) };
  }, [temp, rh, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['F', 'C'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>°{u}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Relative humidity (%)</span>
          <input type="number" step="any" min="0" max="100" value={rh} onInput={(e) => setRh((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Heat index (feels like)</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(unit === 'F' ? r.hiF : r.hiC)}°{unit}</p>
            <p class="mt-1 text-xs text-slate-400">{fmt(unit === 'F' ? r.hiC : r.hiF)}°{unit === 'F' ? 'C' : 'F'}</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk level</p>
            <p class={`mt-1 text-3xl font-extrabold ${r.risk.color}`}>{r.risk.label}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the temperature and humidity (0–100%).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The heat index is how hot it <em>feels</em> when humidity slows sweat evaporation, from the NWS Rothfusz regression. It applies in warm, humid conditions (roughly 80°F+ / 27°C+). In direct sun it can feel up to ~15°F hotter still. 🔒 In your browser.</p>
    </div>
  );
}
