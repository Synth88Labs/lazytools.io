import { useMemo, useState } from 'preact/hooks';
import { OVEN_TABLE, fToC, cToF, fanC } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const round5 = (x: number) => Math.round(x / 5) * 5;

type In = 'f' | 'c' | 'gas';

export default function OvenTempTool() {
  const [mode, setMode] = useState<In>('f');
  const [val, setVal] = useState('350');

  const r = useMemo(() => {
    const v = num(val);
    if (v == null) return null;
    // Snap to the nearest standard oven-table row so the pairing matches how
    // cookbooks quote it (350 °F = 180 °C = gas 4), not raw °F↔°C maths.
    const key = mode === 'f' ? 'f' : mode === 'c' ? 'c' : 'gas';
    const row = OVEN_TABLE.reduce((best, r2) => Math.abs((r2 as any)[key] - v) < Math.abs((best as any)[key] - v) ? r2 : best);
    // exact maths for the entered value, shown as a secondary note
    const exact = mode === 'f' ? fToC(v) : mode === 'c' ? v : null;
    return { f: row.f, c: row.c, gas: row.gas, desc: row.desc, fan: fanC(row.c), exact };
  }, [mode, val]);

  const cell = 'w-32 rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {([['f', '°Fahrenheit'], ['c', '°Celsius'], ['gas', 'Gas mark']] as const).map(([m, lbl]) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'f' ? 'Temperature (°F)' : mode === 'c' ? 'Temperature (°C)' : 'Gas mark'}</span>
        <input type="number" step="any" value={val} onInput={(e) => setVal((e.target as HTMLInputElement).value)} class={cell} /></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fahrenheit</p><p class="mt-1 text-2xl font-extrabold text-slate-800">{r.f} °F</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Celsius</p><p class="mt-1 text-2xl font-extrabold text-slate-800">{r.c} °C</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Gas mark</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{r.gas}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-amber-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fan / convection</p><p class="mt-1 text-2xl font-extrabold text-amber-700">{r.fan} °C</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a temperature.</p>
      )}
      {r && (
        <p class="mt-2 text-center text-sm text-slate-500">
          {r.desc} oven — nearest standard setting{r.exact != null && Math.abs(r.exact - r.c) >= 1 ? ` (exact maths: ${round5(r.exact)} °C)` : ''}
        </p>
      )}

      <details class="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200">
        <summary class="cursor-pointer text-sm font-semibold text-slate-700">Full conversion table</summary>
        <div class="mt-2 overflow-x-auto"><table class="w-full text-sm">
          <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-3 py-1">Gas</th><th class="px-3 py-1">°F</th><th class="px-3 py-1">°C</th><th class="px-3 py-1">Description</th></tr></thead>
          <tbody>{OVEN_TABLE.map((row, i) => <tr class={i % 2 ? 'bg-slate-50' : ''}><td class="px-3 py-1 font-mono">{row.gas}</td><td class="px-3 py-1 font-mono">{row.f}</td><td class="px-3 py-1 font-mono">{row.c}</td><td class="px-3 py-1 text-slate-600">{row.desc}</td></tr>)}</tbody>
        </table></div>
      </details>

      <p class="mt-4 text-xs text-slate-500">°C = (°F − 32) × 5⁄9 (exact); gas marks and descriptions are the conventional UK values, rounded to practical oven settings. Fan (convection) ovens run about 20 °C cooler — drop the temperature or shorten the time. 🔒 In your browser.</p>
    </div>
  );
}
