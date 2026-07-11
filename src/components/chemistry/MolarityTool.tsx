import { useMemo, useState } from 'preact/hooks';
import { molarMass } from '../../lib/chemistry';

type Solve = 'molarity' | 'mass' | 'volume' | 'molarMass';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function MolarityTool() {
  const [solve, setSolve] = useState<Solve>('mass');
  const [formula, setFormula] = useState('NaCl');
  const [molarity, setMolarity] = useState('0.5');
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('0.25');
  const [molarMassStr, setMM] = useState('58.44');

  const formulaMM = useMemo(() => {
    const f = formula.trim();
    if (!f) return null;
    try { return molarMass(f).molarMass; } catch { return null; }
  }, [formula]);

  const M = num(molarity), m = num(mass), V = num(volume), MW = num(molarMassStr);

  const result = useMemo(() => {
    try {
      if (solve === 'molarity' && m != null && MW != null && V != null && MW > 0 && V > 0) return { label: 'Molarity', value: m / MW / V, unit: 'mol/L (M)' };
      if (solve === 'mass' && M != null && MW != null && V != null) return { label: 'Mass of solute', value: M * V * MW, unit: 'g' };
      if (solve === 'volume' && M != null && MW != null && m != null && M > 0 && MW > 0) return { label: 'Volume of solution', value: m / MW / M, unit: 'L' };
      if (solve === 'molarMass' && M != null && V != null && m != null && M > 0 && V > 0) return { label: 'Molar mass', value: m / (M * V), unit: 'g/mol' };
    } catch { /* */ }
    return null;
  }, [solve, M, m, V, MW]);

  const field = (key: Solve, label: string, val: string, set: (v: string) => void, unit: string) => (
    solve === key ? null : (
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} <span class="text-slate-400">({unit})</span></span>
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </label>
    )
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {([['mass', 'Mass'], ['molarity', 'Molarity'], ['volume', 'Volume'], ['molarMass', 'Molar mass']] as [Solve, string][]).map(([k, l]) => (
          <button onClick={() => setSolve(k)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === k ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>Solve {l}</button>
        ))}
      </div>

      {solve !== 'molarMass' && (
        <label class="mb-3 block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Formula (optional — auto-fills molar mass)</span>
          <div class="flex gap-2">
            <input value={formula} spellcheck={false} onInput={(e) => setFormula((e.target as HTMLInputElement).value)}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            {formulaMM != null && (
              <button onClick={() => setMM(formulaMM.toFixed(2))} class="shrink-0 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700">Use {formulaMM.toFixed(2)}</button>
            )}
          </div>
        </label>
      )}

      <div class="grid gap-3 sm:grid-cols-2">
        {field('molarity', 'Molarity', molarity, setMolarity, 'mol/L')}
        {field('mass', 'Mass of solute', mass, setMass, 'g')}
        {field('volume', 'Volume of solution', volume, setVolume, 'L')}
        {field('molarMass', 'Molar mass', molarMassStr, setMM, 'g/mol')}
      </div>

      {result ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{result.label}</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(result.value)} <span class="text-lg font-bold text-slate-500">{result.unit}</span></p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Fill in the other three values to solve for {solve === 'molarMass' ? 'molar mass' : solve}.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">M = n/V, with n = mass ÷ molar mass. Volume in litres. 🔒 Computed in your browser.</p>
    </div>
  );
}
