import { useState } from 'preact/hooks';
import { Rat } from '../../lib/mathx';

interface Row { v: string; w: string }

export default function WeightedAverageTool() {
  const [rows, setRows] = useState<Row[]>([
    { v: '92', w: '20' },
    { v: '78', w: '30' },
    { v: '85', w: '50' },
  ]);

  const set = (i: number, key: keyof Row, val: string) => setRows(rows.map((r, j) => (j === i ? { ...r, [key]: val } : r)));

  let result: { avg: Rat; sumWX: Rat; sumW: Rat } | null = null;
  let error = '';
  try {
    const parsed = rows
      .filter((r) => r.v.trim() !== '' || r.w.trim() !== '')
      .map((r) => ({ v: Rat.parse(r.v || '0'), w: Rat.parse(r.w || '0') }));
    if (parsed.length < 2) throw new Error('Enter at least two value/weight rows.');
    const sumW = parsed.reduce((a, r) => a.add(r.w), new Rat(0n));
    if (sumW.isZero()) throw new Error('Weights sum to zero — at least one weight must be non-zero.');
    const sumWX = parsed.reduce((a, r) => a.add(r.v.mul(r.w)), new Rat(0n));
    result = { avg: sumWX.div(sumW), sumWX, sumW };
  } catch (e) {
    error = (e as Error).message;
  }

  const dec = result?.avg.toDecimal(8);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr><th class="px-3 py-2">Value (e.g. grade)</th><th class="px-3 py-2">Weight (e.g. %)</th><th class="w-10"></th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr>
                <td class="px-2 py-1.5"><input class="w-full rounded border border-slate-200 px-2 py-1 font-mono text-sm" value={r.v} onInput={(e) => set(i, 'v', (e.target as HTMLInputElement).value)} aria-label={`value ${i + 1}`} /></td>
                <td class="px-2 py-1.5"><input class="w-full rounded border border-slate-200 px-2 py-1 font-mono text-sm" value={r.w} onInput={(e) => set(i, 'w', (e.target as HTMLInputElement).value)} aria-label={`weight ${i + 1}`} /></td>
                <td class="px-2 py-1.5 text-center">
                  <button type="button" class="text-xs text-red-500 hover:text-red-700" onClick={() => setRows(rows.filter((_, j) => j !== i))} disabled={rows.length <= 2} aria-label={`remove row ${i + 1}`}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" class="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400" onClick={() => setRows([...rows, { v: '', w: '' }])}>
        + Add row
      </button>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {result && (
        <>
          <div class="mt-5 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="font-mono text-3xl font-extrabold text-brand-700">{dec!.exact ? dec!.text : `≈ ${dec!.text}`}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">weighted average</p>
            </div>
            {!result.avg.isInt() && (
              <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
                <p class="font-mono text-3xl font-extrabold text-slate-800">{result.avg.toFrac()}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">exact fraction</p>
              </div>
            )}
          </div>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Multiply each value by its weight and add: Σ(value × weight) = <span class="font-mono">{result.sumWX.toFrac()}</span></li>
              <li>Add the weights: Σweight = <span class="font-mono">{result.sumW.toFrac()}</span></li>
              <li>Divide: {result.sumWX.toFrac()} ÷ {result.sumW.toFrac()} = <strong class="font-mono">{result.avg.toFrac()}</strong></li>
            </ol>
            <p class="mt-2 text-xs text-slate-500">Weights don't need to sum to 100 — the division normalizes them. Grade example: 92 at 20%, 78 at 30%, 85 at 50% → the exact course grade.</p>
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Exact rational arithmetic — no float drift when your weights are thirds. Runs locally.</p>
    </div>
  );
}
