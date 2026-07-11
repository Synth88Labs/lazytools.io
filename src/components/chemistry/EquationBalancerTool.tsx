import { useMemo, useState } from 'preact/hooks';
import { balanceEquation } from '../../lib/chemistry';

const EXAMPLES = [
  'H2 + O2 -> H2O',
  'CH4 + O2 -> CO2 + H2O',
  'Fe + O2 -> Fe2O3',
  'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2',
  'C2H6 + O2 -> CO2 + H2O',
  'Al + HCl -> AlCl3 + H2',
];

/** render a species with subscripts + coefficient */
function Species({ coef, formula }: { coef: number; formula: string }) {
  const parts = formula.split(/(\d+)/);
  return (
    <span class="font-mono">
      {coef !== 1 && <span class="font-bold text-brand-700">{coef}</span>}
      {parts.map((p) => (/^\d+$/.test(p) ? <sub>{p}</sub> : p))}
    </span>
  );
}

export default function EquationBalancerTool() {
  const [raw, setRaw] = useState('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2');

  const result = useMemo(() => {
    const s = raw.trim();
    if (!s) return { ok: false as const, error: '' };
    try { return { ok: true as const, data: balanceEquation(s) }; }
    catch (e) { return { ok: false as const, error: (e as Error).message }; }
  }, [raw]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unbalanced equation — use + and -&gt; (or =)</span>
        <input
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button onClick={() => setRaw(ex)} class="rounded-md bg-white px-2 py-1 font-mono text-[11px] text-slate-600 ring-1 ring-slate-200 transition hover:ring-brand-300">{ex}</button>
        ))}
      </div>

      {result.ok ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Balanced equation</p>
            <p class="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-lg text-slate-900">
              {result.data.reactants.map((s, i) => (
                <>{i > 0 && <span class="text-slate-400">+</span>}<Species coef={s.coef} formula={s.formula} /></>
              ))}
              <span class="mx-1 text-brand-600">→</span>
              {result.data.products.map((s, i) => (
                <>{i > 0 && <span class="text-slate-400">+</span>}<Species coef={s.coef} formula={s.formula} /></>
              ))}
            </p>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[...result.data.reactants, ...result.data.products].map((s) => (
              <div class="rounded-lg bg-white p-2 text-center ring-1 ring-slate-200">
                <p class="font-mono text-lg font-bold text-brand-700">{s.coef}</p>
                <p class="font-mono text-xs text-slate-500">{s.formula}</p>
              </div>
            ))}
          </div>
        </>
      ) : result.error ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ {result.error}</p>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an unbalanced equation, e.g. H2 + O2 -&gt; H2O.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Exact integer coefficients from the reaction’s null-space (BigInt rational Gaussian elimination — no floating point). 🔒 Computed in your browser.
      </p>
    </div>
  );
}
