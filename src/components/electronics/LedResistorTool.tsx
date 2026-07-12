import { useMemo, useState } from 'preact/hooks';
import { ledResistor, fmtOhms } from '../../lib/electronics';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

// Nearest standard E12 resistor at or above the computed value
const E12 = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
function nearestStandard(r: number): number {
  const decade = Math.pow(10, Math.floor(Math.log10(r)));
  for (let d = decade; d <= decade * 10; d *= 10) for (const v of E12) if (v * d >= r) return v * d;
  return r;
}
const LED_PRESETS: [string, number][] = [['Red', 1.8], ['Orange/Yellow', 2.0], ['Green', 2.2], ['Blue/White', 3.2]];

export default function LedResistorTool() {
  const [vs, setVs] = useState('5');
  const [vled, setVled] = useState('2');
  const [current, setCurrent] = useState('20');

  const r = useMemo(() => {
    const s = num(vs), v = num(vled), i = num(current);
    if (s == null || v == null || i == null) return null;
    if (v >= s) return { error: 'The LED forward voltage must be below the supply voltage.' };
    const res = ledResistor(s, v, i);
    return { ...res, standard: nearestStandard(res.ohms) };
  }, [vs, vled, current]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Supply voltage (V)</span>
          <input type="number" step="any" value={vs} onInput={(e) => setVs((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">LED forward voltage (V)</span>
          <input type="number" step="any" value={vled} onInput={(e) => setVled((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">LED current (mA)</span>
          <input type="number" step="any" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {LED_PRESETS.map(([lbl, v]) => (
          <button onClick={() => setVled(String(v))} class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">{lbl} ({v}V)</button>
        ))}
      </div>

      {r ? (
        'error' in r ? (
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-200">{r.error}</p>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resistor needed</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtOhms(r.ohms)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Nearest standard (E12)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmtOhms(r.standard)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Resistor power</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.power * 1000, 0)} mW</p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the supply voltage, LED forward voltage and current.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">R = (supply − LED forward voltage) ÷ current (Ohm's law). Round up to the nearest standard value so the current stays at or below the LED's rating. Pick a resistor rated well above the power shown — a ¼ W part is usually plenty. 🔒 In your browser.</p>
    </div>
  );
}
