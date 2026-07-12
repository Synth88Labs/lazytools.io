import { useState, useMemo } from 'preact/hooks';
import { latentHeat } from '../../lib/physics-extra';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const n = (s: string) => { const v = parseFloat(s); return isFinite(v) && v > 0 ? v : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toLocaleString('en-US', { maximumSignificantDigits: 5 });
// [label, L in J/kg]
const PRESETS: [string, number][] = [
  ['Water — melt (Lf)', 334000], ['Water — boil (Lv)', 2260000],
  ['Ethanol — melt', 108000], ['Ethanol — boil', 855000],
  ['Aluminium — melt', 397000], ['Iron — melt', 247000],
];

export default function LatentHeatTool() {
  const [mass, setMass] = useState('2');
  const [L, setL] = useState('334000');

  const Q = useMemo(() => { const m = n(mass), l = n(L); return m != null && l != null ? latentHeat(m, l) : null; }, [mass, L]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass (kg)</span><input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Specific latent heat L (J/kg)</span><input type="number" step="any" value={L} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map(([lbl, v]) => <button onClick={() => setL(String(v))} class="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">{lbl}</button>)}
      </div>

      {Q != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Heat for the phase change (Q = mL)</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(Q / 1000)} kJ</p>
          <p class="mt-1 text-xs text-slate-500">= {fmt(Q)} J · {fmt(Q / 4184)} kcal</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter a mass and a latent heat.</p>}

      <p class="mt-4 text-xs text-slate-500">Latent heat is the energy a phase change needs at constant temperature: Q = m·L, where L is the specific latent heat of fusion (melting) or vaporisation (boiling). Water's huge latent heat of vaporisation (2,260 kJ/kg) is why steam burns and sweating cools. 🔒 In your browser.</p>
    </div>
  );
}
