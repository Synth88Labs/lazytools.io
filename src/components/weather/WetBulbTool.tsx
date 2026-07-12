import { useMemo, useState } from 'preact/hooks';
import { wetBulbC, cToF, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

function danger(twC: number): { label: string; color: string } {
  if (twC >= 35) return { label: 'Lethal limit — survival threshold', color: 'text-red-700' };
  if (twC >= 32) return { label: 'Extreme — dangerous even at rest', color: 'text-red-600' };
  if (twC >= 28) return { label: 'High risk during exertion', color: 'text-orange-600' };
  if (twC >= 25) return { label: 'Caution with activity', color: 'text-amber-600' };
  return { label: 'Generally safe', color: 'text-emerald-600' };
}

export default function WetBulbTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('95');
  const [rh, setRh] = useState('50');

  const r = useMemo(() => {
    const t = num(temp), h = num(rh);
    if (t == null || h == null || h < 5 || h > 99) return null;
    const tC = unit === 'C' ? t : fToC(t);
    const twC = wetBulbC(tC, h);
    return { twC, twF: cToF(twC), danger: danger(twC), inRange: tC >= -20 && tC <= 50 };
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
          <input type="number" step="any" min="5" max="99" value={rh} onInput={(e) => setRh((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Wet-bulb temperature</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(unit === 'F' ? r.twF : r.twC)}°{unit}</p>
            <p class="mt-1 text-xs text-slate-400">{fmt(unit === 'F' ? r.twC : r.twF)}°{unit === 'F' ? 'C' : 'F'}</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Heat-stress level</p>
            <p class={`mt-1 text-lg font-extrabold ${r.danger.color}`}>{r.danger.label}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the temperature and humidity (5–99%).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The wet-bulb temperature is the lowest that evaporative cooling (sweating) can reach — so a high wet-bulb means your body can't cool down. A sustained 35°C (95°F) wet-bulb is considered the limit of human survival. From Stull's (2011) formula, valid −20 to 50°C and 5–99% humidity at sea level. Not a substitute for official heat warnings. 🔒 In your browser.</p>
    </div>
  );
}
