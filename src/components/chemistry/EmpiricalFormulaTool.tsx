import { useMemo, useState } from 'preact/hooks';
import { empiricalFormula } from '../../lib/chemistry';

interface Row { symbol: string; amount: string }
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };

export default function EmpiricalFormulaTool() {
  const [rows, setRows] = useState<Row[]>([{ symbol: 'C', amount: '40.0' }, { symbol: 'H', amount: '6.7' }, { symbol: 'O', amount: '53.3' }]);
  const [mmTarget, setMM] = useState('');

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows([...rows, { symbol: '', amount: '' }]);
  const delRow = (i: number) => setRows(rows.filter((_, j) => j !== i));

  const result = useMemo(() => {
    const input = rows.map((r) => ({ symbol: r.symbol.trim(), amount: num(r.amount) ?? 0 })).filter((r) => r.symbol && r.amount > 0);
    if (input.length === 0) return { ok: false as const, error: '' };
    try { return { ok: true as const, data: empiricalFormula(input, num(mmTarget) ?? undefined) }; }
    catch (e) { return { ok: false as const, error: (e as Error).message }; }
  }, [rows, mmTarget]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Element and amount (mass % or grams)</p>
      <div class="space-y-2">
        {rows.map((r, i) => (
          <div class="flex items-center gap-2">
            <input value={r.symbol} placeholder="El" spellcheck={false} onInput={(e) => update(i, { symbol: (e.target as HTMLInputElement).value })}
              class="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            <input type="number" step="any" value={r.amount} placeholder="% or g" onInput={(e) => update(i, { amount: (e.target as HTMLInputElement).value })}
              class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
            <button onClick={() => delRow(i)} class="shrink-0 rounded-lg px-2.5 py-2 text-sm text-slate-400 ring-1 ring-slate-200 hover:text-red-600 hover:ring-red-300" aria-label="Remove">✕</button>
          </div>
        ))}
      </div>
      <button onClick={addRow} class="mt-2 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add element</button>

      <label class="mt-3 block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Molar mass (optional — for molecular formula)</span>
        <input type="number" step="any" value={mmTarget} placeholder="g/mol" onInput={(e) => setMM((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
      </label>

      {result.ok ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Empirical formula</p>
              <p class="mt-1 text-2xl font-extrabold text-brand-800">{result.data.empiricalFormula}</p>
              <p class="mt-1 font-mono text-xs text-slate-400">{result.data.empiricalMass.toFixed(2)} g/mol</p>
            </div>
            {result.data.molecularFormula && (
              <div class="rounded-xl bg-white p-4 text-center ring-2 ring-emerald-200">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Molecular formula</p>
                <p class="mt-1 text-2xl font-extrabold text-emerald-700">{result.data.molecularFormula}</p>
                <p class="mt-1 font-mono text-xs text-slate-400">×{result.data.multiple} the empirical unit</p>
              </div>
            )}
          </div>
          <div class="mt-3 overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-sm">
              <thead><tr class="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500"><th class="px-3 py-2">Element</th><th class="px-3 py-2 text-right">Moles</th><th class="px-3 py-2 text-right">÷ smallest</th><th class="px-3 py-2 text-right">Whole #</th></tr></thead>
              <tbody>
                {result.data.ratios.map((r) => (
                  <tr class="border-b border-slate-100 last:border-0">
                    <td class="px-3 py-2 font-semibold text-slate-800">{r.symbol}</td>
                    <td class="px-3 py-2 text-right font-mono text-slate-600">{r.moles.toFixed(4)}</td>
                    <td class="px-3 py-2 text-right font-mono text-slate-600">{r.ratio.toFixed(3)}</td>
                    <td class="px-3 py-2 text-right font-mono font-bold text-brand-700">{r.whole}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : result.error ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ {result.error}</p>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter each element and its mass percent (or grams). Add a molar mass to also get the molecular formula.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Divide each element’s amount by its atomic weight, then by the smallest, and scale to whole numbers. 🔒 In your browser.</p>
    </div>
  );
}
