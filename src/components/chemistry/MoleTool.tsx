import { useMemo, useState } from 'preact/hooks';
import { molarMass, moleConvert } from '../../lib/chemistry';

type Known = 'mass' | 'moles' | 'particles';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

export default function MoleTool() {
  const [known, setKnown] = useState<Known>('mass');
  const [formula, setFormula] = useState('H2O');
  const [mmOverride, setMM] = useState('');
  const [value, setValue] = useState('18.015');

  const formulaMM = useMemo(() => { try { return molarMass(formula.trim()).molarMass; } catch { return null; } }, [formula]);
  const mm = num(mmOverride) ?? formulaMM;
  const v = num(value);

  const result = useMemo(() => {
    if (mm == null || mm <= 0 || v == null) return null;
    const input = known === 'mass' ? { mass: v } : known === 'moles' ? { moles: v } : { particles: v };
    return moleConvert(input, mm);
  }, [known, v, mm]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Formula (for molar mass)</span>
        <div class="flex gap-2">
          <input value={formula} spellcheck={false} onInput={(e) => setFormula((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          {formulaMM != null && <span class="shrink-0 self-center rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-600">{formulaMM.toFixed(2)} g/mol</span>}
        </div>
      </label>

      <div class="mt-3 mb-3 flex flex-wrap gap-2">
        {([['mass', 'Mass (g)'], ['moles', 'Moles'], ['particles', 'Particles']] as [Known, string][]).map(([k, l]) => (
          <button onClick={() => setKnown(k)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${known === k ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>I know {l}</button>
        ))}
      </div>
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{known === 'mass' ? 'Mass (grams)' : known === 'moles' ? 'Amount (moles)' : 'Number of particles'}</span>
        <input type="number" step="any" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder={known === 'particles' ? 'e.g. 6.022e23' : ''} />
      </label>

      {result ? (
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[['Moles', fmt(result.moles) + ' mol'], ['Mass', fmt(result.mass) + ' g'], ['Particles', result.particles.toExponential(4)]].map(([l, val]) => (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</p>
              <p class="mt-1 font-mono text-lg font-bold text-brand-800">{val}</p>
            </div>
          ))}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid formula (or molar mass) and a value.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">moles = mass ÷ molar mass; particles = moles × Avogadro (6.022×10²³). 🔒 Computed in your browser.</p>
    </div>
  );
}
