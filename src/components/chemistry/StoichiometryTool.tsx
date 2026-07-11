import { useMemo, useState } from 'preact/hooks';
import { balanceEquation, stoichiometry } from '../../lib/chemistry';

const fmt = (x: number) => Number(x.toPrecision(5)).toString();

export default function StoichiometryTool() {
  const [eq, setEq] = useState('N2 + H2 -> NH3');
  const [masses, setMasses] = useState<Record<string, string>>({ N2: '28', H2: '10' });

  const balanced = useMemo(() => {
    try { return { ok: true as const, data: balanceEquation(eq) }; }
    catch (e) { return { ok: false as const, error: (e as Error).message }; }
  }, [eq]);

  const result = useMemo(() => {
    if (!balanced.ok) return null;
    const m: Record<string, number> = {};
    for (const [k, v] of Object.entries(masses)) { const n = parseFloat(v); if (isFinite(n) && n > 0) m[k] = n; }
    if (Object.keys(m).length === 0) return null;
    try { return stoichiometry(eq, m); } catch { return null; }
  }, [eq, masses, balanced]);

  const reactants = balanced.ok ? balanced.data.reactants : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Equation (auto-balanced)</span>
        <input value={eq} spellcheck={false} onInput={(e) => setEq((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </label>

      {balanced.ok ? (
        <>
          <p class="mt-2 text-center font-mono text-sm text-slate-700">Balanced: <span class="font-bold text-brand-700">{balanced.data.balancedString}</span></p>

          <p class="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Reactant amounts (grams) — enter one or more</p>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reactants.map((r) => (
              <label class="block">
                <span class="mb-1 block font-mono text-xs text-slate-600">{r.coef !== 1 ? r.coef : ''}{r.formula}</span>
                <input type="number" step="any" value={masses[r.formula] ?? ''} placeholder="g"
                  onInput={(e) => setMasses({ ...masses, [r.formula]: (e.target as HTMLInputElement).value })}
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
              </label>
            ))}
          </div>

          {result && (
            <>
              {result.limiting && (
                <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Limiting reagent</p>
                  <p class="mt-1 text-2xl font-extrabold text-brand-800">{result.limiting}</p>
                </div>
              )}
              <div class="mt-3 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th class="px-3 py-2">Species</th>
                      <th class="px-3 py-2 text-right">Moles</th>
                      <th class="px-3 py-2 text-right">Mass (g)</th>
                      <th class="px-3 py-2">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.species.map((s) => (
                      <tr class="border-b border-slate-100 last:border-0">
                        <td class="px-3 py-2 font-mono font-semibold text-slate-800">{s.coef !== 1 ? s.coef : ''}{s.formula}</td>
                        <td class="px-3 py-2 text-right font-mono text-slate-700">{fmt(s.producedMoles)}</td>
                        <td class="px-3 py-2 text-right font-mono font-bold text-brand-700">{fmt(s.producedMass)}</td>
                        <td class="px-3 py-2 text-xs text-slate-500">
                          {s.role === 'product' ? 'produced' : s.formula === result.limiting ? 'limiting — fully consumed' : s.remainingMass != null ? `${fmt(s.remainingMass)} g left over` : 'reactant'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p class="mt-2 text-xs text-slate-500">Masses shown are theoretical (100% yield). For actual yield, use the percent-yield calculator.</p>
            </>
          )}
        </>
      ) : (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ {balanced.error}</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Balances the equation, finds the limiting reagent (min moles ÷ coefficient), and computes theoretical yield. 🔒 In your browser.</p>
    </div>
  );
}
