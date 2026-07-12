import { useMemo, useState } from 'preact/hooks';
import { molarMass, molality } from '../../lib/chemistry';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();

export default function MolalityTool() {
  const [formula, setFormula] = useState('NaCl');
  const [mass, setMass] = useState('5.844');
  const [solventKg, setSolventKg] = useState('0.5');

  const res = useMemo(() => {
    const m = num(mass), kg = num(solventKg);
    if (m == null || kg == null) return null;
    let mm: number;
    try { mm = molarMass(formula).molarMass; } catch { return { error: true as const }; }
    if (!(mm > 0)) return { error: true as const };
    const moles = m / mm;
    return { mm, moles, b: molality(moles, kg) };
  }, [formula, mass, solventKg]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Solute formula</span><input value={formula} onInput={(e) => setFormula((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Solute mass (g)</span><input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Solvent mass (kg)</span><input type="number" step="any" value={solventKg} onInput={(e) => setSolventKg((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res && !('error' in res) ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Molality</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.b)} m</p><p class="text-xs text-slate-500">mol/kg</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Moles of solute</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.moles)} mol</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Molar mass</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.mm)} g/mol</p></div>
        </div>
      ) : res && 'error' in res ? (
        <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Couldn't read that formula — check the element symbols (e.g. NaCl, C6H12O6, CaCl2).</p>
      ) : <p class="mt-4 text-sm text-slate-500">Enter a formula, solute mass and solvent mass.</p>}

      <p class="mt-4 text-xs text-slate-500">Molality is moles of solute per kilogram of solvent: b = (mass ÷ molar mass) ÷ kg solvent. Unlike molarity (per litre of solution), molality uses solvent mass, so it doesn't change with temperature — which is why colligative-property work uses it. 🔒 In your browser.</p>
    </div>
  );
}
