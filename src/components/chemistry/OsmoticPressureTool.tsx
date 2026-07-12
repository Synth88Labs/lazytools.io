import { useMemo, useState } from 'preact/hooks';
import { osmoticPressure } from '../../lib/chemistry';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();
// van't Hoff factor presets
const IONS: [string, number][] = [['Glucose / non-electrolyte (i=1)', 1], ['NaCl, KCl (i=2)', 2], ['CaCl₂, Na₂SO₄ (i=3)', 3], ['AlCl₃ (i=4)', 4]];

export default function OsmoticPressureTool() {
  const [M, setM] = useState('0.1');
  const [tempC, setTempC] = useState('25');
  const [i, setI] = useState('1');

  const res = useMemo(() => {
    const m = num(M), t = num(tempC), ii = num(i);
    if (m == null || t == null || ii == null || m < 0 || ii <= 0) return null;
    const tempK = t + 273.15;
    if (tempK <= 0) return null;
    const atm = osmoticPressure(ii, m, tempK);
    return { atm, kPa: atm * 101.325, mmHg: atm * 760, tempK };
  }, [M, tempC, i]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Molarity (mol/L)</span><input type="number" step="any" value={M} onInput={(e) => setM((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Temperature (°C)</span><input type="number" step="any" value={tempC} onInput={(e) => setTempC((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">van't Hoff factor (i)</span><input type="number" step="any" value={i} onInput={(e) => setI((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {IONS.map(([lbl, v]) => <button onClick={() => setI(String(v))} class="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">{lbl}</button>)}
      </div>

      {res ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Osmotic pressure (π = iMRT)</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.atm)} atm</p>
          <p class="mt-1 text-xs text-slate-500">= {fmt(res.kPa)} kPa · {fmt(res.mmHg)} mmHg · at {fmt(res.tempK)} K</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter molarity, temperature and the van't Hoff factor.</p>}

      <p class="mt-4 text-xs text-slate-500">Osmotic pressure is the pressure needed to stop solvent flowing across a semipermeable membrane into a solution: π = iMRT, with R = 0.08206 L·atm/(mol·K) and T in kelvin. The van't Hoff factor i counts the particles each formula unit releases (1 for glucose, 2 for NaCl). 🔒 In your browser.</p>
    </div>
  );
}
