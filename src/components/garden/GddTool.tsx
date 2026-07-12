import { useMemo, useState } from 'preact/hooks';
import { growingDegreeDays } from '../../lib/garden';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4));

export default function GddTool() {
  const [tMax, setTMax] = useState('30');
  const [tMin, setTMin] = useState('12');
  const [tBase, setTBase] = useState('10');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [days, setDays] = useState('30');

  const res = useMemo(() => {
    const hi = num(tMax), lo = num(tMin), b = num(tBase), d = num(days);
    if (hi == null || lo == null || b == null) return null;
    const gdd = growingDegreeDays(hi, lo, b);
    return { gdd, accumulated: d != null ? gdd * d : null };
  }, [tMax, tMin, tBase, days]);

  const bases = unit === 'C' ? [['General (10°C)', 10], ['Cool crops (4°C)', 4], ['Warm crops (15°C)', 15]] : [['General (50°F)', 50], ['Cool crops (40°F)', 40], ['Warm crops (59°F)', 59]];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex items-center gap-2"><span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Units</span>
        <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'C' | 'F')} class={sel}><option value="C">°C</option><option value="F">°F</option></select></div>
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Daily high (°{unit})</span><input type="number" step="any" value={tMax} onInput={(e) => setTMax((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Daily low (°{unit})</span><input type="number" step="any" value={tMin} onInput={(e) => setTMin((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Base temp (°{unit})</span><input type="number" step="any" value={tBase} onInput={(e) => setTBase((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Days (optional)</span><input type="number" step="1" value={days} onInput={(e) => setDays((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-1 flex flex-wrap gap-1">{bases.map(([l, v]) => <button onClick={() => setTBase(String(v))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">GDD for one day</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.gdd)}</p></div>
          {res.accumulated != null && <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Accumulated over {days} similar days</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{fmt(res.accumulated)}</p></div>}
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the daily high, low and base temperature.</p>}

      <p class="mt-4 text-xs text-slate-500">Growing degree days measure accumulated warmth: GDD = ((daily high + daily low) ÷ 2) − base temperature, floored at zero. The base is the temperature below which a crop doesn\'t grow (commonly 10 °C / 50 °F; 4 °C for cool-season and higher for warm-season crops). Add up daily GDD to predict flowering, pest emergence and harvest. This gives one day; multiply by similar days for a rough total. 🔒 In your browser.</p>
    </div>
  );
}
