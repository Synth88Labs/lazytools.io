import { useMemo, useState } from 'preact/hooks';
import { relHumidity, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

export default function HumidityTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('F');
  const [temp, setTemp] = useState('75');
  const [dew, setDew] = useState('60');

  const r = useMemo(() => {
    const t = num(temp), d = num(dew);
    if (t == null || d == null) return null;
    if (d > t) return { error: 'Dew point cannot exceed the air temperature.' };
    const tC = unit === 'C' ? t : fToC(t);
    const dC = unit === 'C' ? d : fToC(d);
    return { rh: Math.min(100, relHumidity(tC, dC)) };
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
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dew point (°{unit})</span>
          <input type="number" step="any" value={dew} onInput={(e) => setDew((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        'error' in r ? (
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-200">{r.error}</p>
        ) : (
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Relative humidity</p>
            <p class="mt-1 text-5xl font-extrabold text-brand-800">{fmt(r.rh)}<span class="text-2xl text-slate-500">%</span></p>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the air temperature and dew point.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Relative humidity is the ratio of the actual water vapour to the maximum the air can hold at that temperature. It's derived from the temperature and dew point via the Magnus saturation-vapour equation. When the dew point equals the temperature, the air is saturated — 100%. 🔒 In your browser.</p>
    </div>
  );
}
