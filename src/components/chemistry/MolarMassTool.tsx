import { useMemo, useState } from 'preact/hooks';
import { molarMass } from '../../lib/chemistry';

const EXAMPLES = ['H2O', 'C6H12O6', 'H2SO4', 'CuSO4·5H2O', 'Ca(OH)2', 'Fe2(SO4)3', 'NaHCO3', 'KAl(SO4)2·12H2O'];

export default function MolarMassTool({ view = 'mass' as 'mass' | 'percent' }: { view?: 'mass' | 'percent' }) {
  const [raw, setRaw] = useState('C6H12O6');

  const result = useMemo(() => {
    const f = raw.trim();
    if (!f) return { ok: false as const, error: '' };
    try {
      return { ok: true as const, data: molarMass(f) };
    } catch (e) {
      return { ok: false as const, error: (e as Error).message };
    }
  }, [raw]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chemical formula</span>
        <input
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </label>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((ex) => (
          <button onClick={() => setRaw(ex)} class="rounded-md bg-white px-2 py-1 font-mono text-xs text-slate-600 ring-1 ring-slate-200 transition hover:ring-brand-300">{ex}</button>
        ))}
      </div>

      {result.ok ? (
        <>
          {view === 'mass' && (
            <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Molar mass</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{result.data.molarMass.toFixed(3)} <span class="text-lg font-bold text-slate-500">g/mol</span></p>
            </div>
          )}

          <div class="mt-4 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th class="px-3 py-2">Element</th>
                  <th class="px-3 py-2 text-right">Atoms</th>
                  <th class="px-3 py-2 text-right">Atomic wt</th>
                  <th class="px-3 py-2 text-right">Mass</th>
                  <th class="px-3 py-2 text-right">Mass %</th>
                </tr>
              </thead>
              <tbody>
                {result.data.breakdown.map((r) => (
                  <tr class="border-b border-slate-100 last:border-0">
                    <td class="px-3 py-2 font-semibold text-slate-800">{r.symbol} <span class="font-normal text-slate-400">{r.name}</span></td>
                    <td class="px-3 py-2 text-right font-mono text-slate-700">{r.count}</td>
                    <td class="px-3 py-2 text-right font-mono text-slate-500">{r.atomicWeight}</td>
                    <td class="px-3 py-2 text-right font-mono text-slate-700">{r.mass.toFixed(3)}</td>
                    <td class="px-3 py-2 text-right font-mono font-bold text-brand-700">{r.percent.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr class="bg-slate-50 font-semibold">
                  <td class="px-3 py-2 text-slate-800" colSpan={3}>Total</td>
                  <td class="px-3 py-2 text-right font-mono text-slate-900">{result.data.molarMass.toFixed(3)}</td>
                  <td class="px-3 py-2 text-right font-mono text-slate-900">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {view === 'percent' && (
            <div class="mt-3 flex h-4 overflow-hidden rounded-full ring-1 ring-slate-200">
              {result.data.breakdown.map((r, i) => (
                <div style={`width:${r.percent}%;background:${['#4338ca', '#0e9f6e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'][i % 7]}`} title={`${r.symbol} ${r.percent.toFixed(1)}%`} />
              ))}
            </div>
          )}
        </>
      ) : result.error ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ {result.error}</p>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a chemical formula like H2O, C6H12O6 or CuSO4·5H2O.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        IUPAC/CIAAW standard atomic weights. Parser handles nested groups, hydrates (· / . / *) and two-letter symbols. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
