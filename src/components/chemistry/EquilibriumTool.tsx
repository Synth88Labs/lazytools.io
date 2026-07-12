import { useMemo, useState } from 'preact/hooks';
import { solveEquilibrium, reactionQuotient } from '../../lib/equilibrium';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pos = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const nonneg = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

// Two reactants (A,B) + two products (C,D); coeff 0 drops a species.
export default function EquilibriumTool() {
  const [kc, setKc] = useState('50');
  const [rows, setRows] = useState({
    A: { coeff: '1', conc: '1' }, B: { coeff: '1', conc: '1' },
    C: { coeff: '2', conc: '0' }, D: { coeff: '0', conc: '0' },
  });

  const set = (key: keyof typeof rows, field: 'coeff' | 'conc', v: string) =>
    setRows((r) => ({ ...r, [key]: { ...r[key], [field]: v } }));

  const r = useMemo(() => {
    const kcv = pos(kc);
    if (kcv == null) return null;
    const build = (keys: (keyof typeof rows)[]) => keys.map((k) => ({ coeff: nonneg(rows[k].coeff) ?? 0, conc: nonneg(rows[k].conc) ?? 0 })).filter((s) => s.coeff > 0);
    const reactants = build(['A', 'B']);
    const products = build(['C', 'D']);
    if (!reactants.length || !products.length) return null;
    const q0 = reactionQuotient(reactants, products);
    const sol = solveEquilibrium(reactants, products, kcv);
    return sol ? { q0, sol, reactants, products } : null;
  }, [kc, rows]);

  const inp = 'w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const labels: Record<string, string> = { A: 'A (reactant)', B: 'B (reactant)', C: 'C (product)', D: 'D (product)' };

  // Map filtered result arrays back to species labels for display.
  const eqConc = r ? (() => {
    const out: { label: string; val: number }[] = [];
    let ri = 0, pi = 0;
    (['A', 'B'] as const).forEach((k) => { if ((nonneg(rows[k].coeff) ?? 0) > 0) out.push({ label: k, val: r.sol.reactants[ri++] }); });
    (['C', 'D'] as const).forEach((k) => { if ((nonneg(rows[k].coeff) ?? 0) > 0) out.push({ label: k, val: r.sol.products[pi++] }); });
    return out;
  })() : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-2 text-sm text-slate-600">Reaction: <span class="font-mono font-semibold">aA + bB ⇌ cC + dD</span> — set coefficients (0 to drop a species) and initial concentrations.</p>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[440px] text-sm">
          <thead><tr class="text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500"><th class="pb-2 pr-2">Species</th><th class="pb-2 px-2 w-28">Coefficient</th><th class="pb-2 px-2 w-32">Initial conc. (M)</th></tr></thead>
          <tbody>
            {(['A', 'B', 'C', 'D'] as const).map((key) => (
              <tr key={key} class="border-t border-slate-200">
                <td class="py-1.5 pr-2 font-medium text-slate-700">{labels[key]}</td>
                <td class="py-1.5 px-2"><input type="number" step="1" min="0" value={rows[key].coeff} onInput={(e) => set(key, 'coeff', (e.target as HTMLInputElement).value)} class={inp} /></td>
                <td class="py-1.5 px-2"><input type="number" step="any" min="0" value={rows[key].conc} onInput={(e) => set(key, 'conc', (e.target as HTMLInputElement).value)} class={inp} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label class="mt-3 block max-w-xs"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Equilibrium constant Kc</span>
        <input type="text" value={kc} onInput={(e) => setKc((e.target as HTMLInputElement).value)} class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" /></label>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-sm font-semibold text-slate-700">Equilibrium concentrations</p>
              <span class={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.sol.direction === 'forward' ? 'bg-emerald-100 text-emerald-800' : r.sol.direction === 'reverse' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                {r.q0 != null ? `Q₀ = ${r.q0.toExponential(2)} · ` : ''}shifts {r.sol.direction === 'equilibrium' ? 'at equilibrium' : r.sol.direction}
              </span>
            </div>
            <div class="mt-2 grid gap-2 sm:grid-cols-4">
              {eqConc.map((e) => <div class="rounded-lg bg-slate-50 p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">[{e.label}]</p><p class="mt-0.5 text-lg font-extrabold text-brand-800">{fmt(Math.max(0, e.val))}</p></div>)}
            </div>
            <p class="mt-2 text-xs text-slate-500">Extent of reaction ξ = {fmt(r.sol.xi)} M</p>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter at least one reactant and one product (coefficient &gt; 0) and a positive Kc.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Builds the ICE table and solves for the extent of reaction ξ where the reaction quotient Q equals Kc: [reactant] = initial − coeff·ξ, [product] = initial + coeff·ξ. Comparing the initial Q₀ to Kc gives the shift direction (Q &lt; K → forward, Q &gt; K → reverse). Concentrations are molar; assumes all species are aqueous/gas-phase and included in Q. 🔒 In your browser.</p>
    </div>
  );
}
