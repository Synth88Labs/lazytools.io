import { useMemo, useState } from 'preact/hooks';
import { feelsLikeF, cToF, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Math.round(x);

export default function FeelsLikeTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('88');
  const [rh, setRh] = useState('65');
  const [wind, setWind] = useState('5');

  const r = useMemo(() => {
    const t = num(temp), h = num(rh), w = num(wind);
    if (t == null || h == null || w == null) return null;
    const tF = unit === 'F' ? t : cToF(t);
    const vMph = unit === 'F' ? w : w / 1.609344;
    const fl = feelsLikeF(tF, h, vMph);
    const diff = fl.value - tF;
    return { valueF: fl.value, valueC: fToC(fl.value), basis: fl.basis, diffF: diff };
  }, [temp, rh, wind, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['F', 'C'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>°{u} · {u === 'F' ? 'mph' : 'km/h'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Humidity (%)</span>
          <input type="number" step="any" min="0" max="100" value={rh} onInput={(e) => setRh((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wind ({unit === 'F' ? 'mph' : 'km/h'})</span>
          <input type="number" step="any" min="0" value={wind} onInput={(e) => setWind((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Feels like</p>
          <p class="mt-1 text-5xl font-extrabold text-brand-800">{fmt(unit === 'F' ? r.valueF : r.valueC)}°{unit}</p>
          <p class="mt-1 text-sm text-slate-500">via {r.basis} · {r.diffF >= 0 ? '+' : ''}{fmt(r.diffF)}°F vs actual</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the temperature, humidity and wind.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The apparent ("feels like") temperature uses the heat index in warm weather (80°F/27°C and up, where humidity matters) and wind chill in cold weather (50°F/10°C and below, where wind matters). In between, the air temperature itself is the best guide. 🔒 In your browser.</p>
    </div>
  );
}
