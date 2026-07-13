import { useMemo, useState } from 'preact/hooks';
import { humidex, humidexComfort, cToF, fToC } from '../../lib/weather';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Math.round(x).toString();

export default function HumidexTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [temp, setTemp] = useState('30');
  const [dew, setDew] = useState('25');

  const r = useMemo(() => {
    const t = num(temp), d = num(dew);
    if (t == null || d == null) return null;
    const tC = unit === 'C' ? t : fToC(t);
    const dC = unit === 'C' ? d : fToC(d);
    if (dC > tC + 0.01) return null; // dew point can't exceed air temp
    const h = humidex(tC, dC);
    return { c: h, f: cToF(h), comfort: humidexComfort(h) };
  }, [unit, temp, dew]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['C', 'F'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>°{u}</button>)}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dew point (°{unit})</span>
          <input type="number" step="any" value={dew} onInput={(e) => setDew((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Humidex</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(unit === 'C' ? r.c : r.f)}<span class="text-xl text-slate-500">°{unit}</span></p>
          <p class="mt-2 text-sm font-semibold text-slate-600">{r.comfort}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the temperature and a dew point no higher than it.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Humidex is Environment Canada\'s "feels-like" index for humid heat: humidex = T + 0.5555 × (e − 10), where e is the vapour pressure from the dew point. It\'s unitless but read on the same scale as temperature. Guidance: under 30 comfortable, 30–39 some discomfort, 40–45 great discomfort, 46+ dangerous. Unlike the US heat index it uses dew point rather than relative humidity. 🔒 In your browser.</p>
    </div>
  );
}
