import { useMemo, useState } from 'preact/hooks';
import { absoluteHumidity, fToC } from '../../lib/weather';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4)).toString();

export default function AbsoluteHumidityTool() {
  const [temp, setTemp] = useState('20');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [rh, setRh] = useState('50');

  const res = useMemo(() => {
    const t = num(temp), r = num(rh);
    if (t == null || r == null || r < 0 || r > 100) return null;
    const tC = unit === 'F' ? fToC(t) : t;
    return absoluteHumidity(tC, r);
  }, [temp, unit, rh]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature</span>
          <div class="flex gap-1"><input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'C' | 'F')} class={sel}><option value="C">°C</option><option value="F">°F</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Relative humidity (%)</span><input type="number" step="any" value={rh} onInput={(e) => setRh((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Absolute humidity</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res)} g/m³</p>
          <p class="mt-1 text-xs text-slate-500">= {fmt(res * 0.4370)} grains/ft³</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter a temperature and a relative humidity (0–100%).</p>}

      <p class="mt-4 text-xs text-slate-500">Absolute humidity is the actual mass of water vapour in a cubic metre of air (g/m³), unlike relative humidity which is a percentage of the maximum. It's computed from the Magnus saturation vapour pressure at your temperature times the relative humidity. Warm air can hold far more, so the same RH means more water when it's hot. 🔒 In your browser.</p>
    </div>
  );
}
