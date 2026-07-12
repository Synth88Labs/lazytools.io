import { useMemo, useState } from 'preact/hooks';
import { windChillF, cToF, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Math.round(x);

function frostbite(wcF: number): { label: string; color: string } {
  if (wcF <= -60) return { label: 'Frostbite in ~5 min', color: 'text-red-700' };
  if (wcF <= -35) return { label: 'Frostbite in ~10 min', color: 'text-red-600' };
  if (wcF <= -18) return { label: 'Frostbite in ~30 min', color: 'text-orange-600' };
  if (wcF <= 20) return { label: 'Cold — cover up', color: 'text-amber-600' };
  return { label: 'Low risk', color: 'text-emerald-600' };
}

export default function WindChillTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('20');
  const [wind, setWind] = useState('15'); // mph or km/h

  const r = useMemo(() => {
    const t = num(temp), w = num(wind);
    if (t == null || w == null || w < 0) return null;
    const tF = unit === 'F' ? t : cToF(t);
    const vMph = unit === 'F' ? w : w / 1.609344;
    const wcF = windChillF(tF, vMph);
    return { wcF, wcC: fToC(wcF), fb: frostbite(wcF), applies: tF <= 50 && vMph > 3 };
  }, [temp, wind, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['F', 'C'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>°{u} · {u === 'F' ? 'mph' : 'km/h'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Wind speed ({unit === 'F' ? 'mph' : 'km/h'})</span>
          <input type="number" step="any" min="0" value={wind} onInput={(e) => setWind((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Wind chill (feels like)</p>
              <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(unit === 'F' ? r.wcF : r.wcC)}°{unit}</p>
              <p class="mt-1 text-xs text-slate-400">{fmt(unit === 'F' ? r.wcC : r.wcF)}°{unit === 'F' ? 'C' : 'F'}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frostbite risk</p>
              <p class={`mt-1 text-2xl font-extrabold ${r.fb.color}`}>{r.fb.label}</p>
            </div>
          </div>
          {!r.applies && <p class="mt-2 text-center text-xs text-amber-600">Wind chill only applies at or below 50°F (10°C) with wind over 3 mph — showing the actual temperature.</p>}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the temperature and wind speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Wind chill is how cold it feels as wind strips heat from your skin, from the 2001 NWS/Environment Canada formula. It's defined for T ≤ 50°F (10°C) and wind above 3 mph. Frostbite times assume exposed skin. 🔒 In your browser.</p>
    </div>
  );
}
