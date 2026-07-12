import { useMemo, useState } from 'preact/hooks';
import { airFryerConvert } from '../../lib/cooking';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const round5 = (x: number) => Math.round(x / 5) * 5;

export default function AirFryerTool() {
  const [temp, setTemp] = useState('400');
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [time, setTime] = useState('30');

  const res = useMemo(() => {
    const t = num(temp), m = num(time);
    if (t == null || m == null) return null;
    // convert to F, apply rule, back to unit
    const tF = unit === 'C' ? t * 9 / 5 + 32 : t;
    const out = airFryerConvert(tF, m);
    const outTemp = unit === 'C' ? (out.tempF - 32) * 5 / 9 : out.tempF;
    return { temp: round5(outTemp), time: Math.round(out.timeMin) };
  }, [temp, unit, time]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-3 text-xs text-slate-500">Enter the conventional-oven temperature and time from your recipe.</p>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Oven temperature</span>
          <div class="flex gap-1"><input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'F' | 'C')} class={sel}><option value="F">°F</option><option value="C">°C</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Oven time (minutes)</span><input type="number" step="any" value={time} onInput={(e) => setTime((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Air fryer temperature</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{res.temp}°{unit}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Air fryer time</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">≈ {res.time} min</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the oven temperature and time.</p>}

      <p class="mt-4 text-xs text-slate-500">The common rule for converting an oven recipe to an air fryer is to lower the temperature by about 25 °F (≈15 °C) and cut the time by roughly 20%, because an air fryer\'s rapid convection cooks faster and browns more. Air fryers vary, so check for doneness early the first time and adjust — think of it as a compact convection oven. 🔒 In your browser.</p>
    </div>
  );
}
