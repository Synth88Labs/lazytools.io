import { useMemo, useState } from 'preact/hooks';
import { enthalpyOfReaction, type EnthalpyTerm } from '../../lib/equilibrium';

const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

let idSeed = 0;
interface Row { id: number; name: string; coeff: number; hf: number; side: 'reactant' | 'product'; }

export default function HessLawTool() {
  const [rows, setRows] = useState<Row[]>([
    { id: idSeed++, name: 'CH₄', coeff: 1, hf: -74.8, side: 'reactant' },
    { id: idSeed++, name: 'O₂', coeff: 2, hf: 0, side: 'reactant' },
    { id: idSeed++, name: 'CO₂', coeff: 1, hf: -393.5, side: 'product' },
    { id: idSeed++, name: 'H₂O (l)', coeff: 2, hf: -285.8, side: 'product' },
  ]);

  const dh = useMemo(() => {
    const reactants: EnthalpyTerm[] = rows.filter((r) => r.side === 'reactant').map((r) => ({ coeff: r.coeff, hf: r.hf }));
    const products: EnthalpyTerm[] = rows.filter((r) => r.side === 'product').map((r) => ({ coeff: r.coeff, hf: r.hf }));
    if (!reactants.length || !products.length) return null;
    return enthalpyOfReaction(reactants, products);
  }, [rows]);

  const update = (id: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));
  const add = (side: 'reactant' | 'product') => setRows((rs) => [...rs, { id: idSeed++, name: '', coeff: 1, hf: 0, side }]);

  const inp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const nameInp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const renderSide = (side: 'reactant' | 'product') => (
    <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{side === 'reactant' ? 'Reactants' : 'Products'}</p>
      <div class="space-y-1.5">
        {rows.filter((r) => r.side === side).map((r) => (
          <div key={r.id} class="flex items-center gap-1.5">
            <input value={r.name} placeholder="Formula" onInput={(e) => update(r.id, { name: (e.target as HTMLInputElement).value })} class={`${nameInp} flex-1`} />
            <input type="number" step="any" value={r.coeff} title="Coefficient" onInput={(e) => update(r.id, { coeff: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={`${inp} w-16`} />
            <input type="number" step="any" value={r.hf} title="ΔHf (kJ/mol)" onInput={(e) => update(r.id, { hf: parseFloat((e.target as HTMLInputElement).value) || 0 })} class={`${inp} w-24`} />
            <button onClick={() => remove(r.id)} class="text-slate-400 hover:text-rose-600" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <button onClick={() => add(side)} class="mt-2 rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-700">+ Add {side}</button>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-2 text-xs text-slate-500">Enter each species' coefficient and standard enthalpy of formation ΔHf° (kJ/mol). Elements in their standard state are 0.</p>
      <div class="grid gap-3 sm:grid-cols-2">
        {renderSide('reactant')}
        {renderSide('product')}
      </div>

      {dh != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Enthalpy of reaction ΔH°rxn</p>
          <p class={`mt-1 text-3xl font-extrabold ${dh < 0 ? 'text-emerald-700' : 'text-amber-700'}`}>{dh > 0 ? '+' : ''}{fmt(dh)} kJ/mol</p>
          <p class="mt-1 text-sm text-slate-600">{dh < 0 ? 'Exothermic — releases heat.' : dh > 0 ? 'Endothermic — absorbs heat.' : 'Thermoneutral.'}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Add at least one reactant and one product with their ΔHf values.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Hess's law: ΔH°rxn = Σ(coeff · ΔHf° products) − Σ(coeff · ΔHf° reactants). Because enthalpy is a state function, the reaction enthalpy depends only on the difference between products and reactants, not the path. Use consistent ΔHf° values (kJ/mol) from one data table, and mind the physical state — H₂O(l) and H₂O(g) differ. 🔒 In your browser.</p>
    </div>
  );
}
