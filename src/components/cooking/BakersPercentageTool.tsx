import { useMemo, useState } from 'preact/hooks';

interface Row { name: string; grams: string }
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function BakersPercentageTool() {
  const [flour, setFlour] = useState('500');
  const [rows, setRows] = useState<Row[]>([
    { name: 'Water', grams: '350' },
    { name: 'Salt', grams: '10' },
    { name: 'Yeast', grams: '5' },
  ]);

  const r = useMemo(() => {
    const f = num(flour);
    if (f == null || f === 0) return null;
    const ings = rows.map((row) => ({ name: row.name, grams: num(row.grams), pct: num(row.grams) != null ? (num(row.grams)! / f) * 100 : null }));
    // hydration = sum of liquid ingredients / flour; here we treat "water"/"milk" named rows as liquid
    const liquidNames = /water|milk|juice|beer|liquid/i;
    const liquid = ings.filter((i) => liquidNames.test(i.name) && i.grams != null).reduce((s, i) => s + i.grams!, 0);
    const total = f + ings.reduce((s, i) => s + (i.grams ?? 0), 0);
    return { f, ings, hydration: (liquid / f) * 100, total };
  }, [flour, rows]);

  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((x, j) => j === i ? { ...x, ...patch } : x));
  const cell = 'rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Flour (100% — the baseline)</span>
        <input type="number" step="any" min="0" value={flour} onInput={(e) => setFlour((e.target as HTMLInputElement).value)} class={`${cell} w-40 font-mono`} /> <span class="text-sm text-slate-500">g</span></label>

      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th class="px-2 py-1">Ingredient</th><th class="px-2 py-1">Grams</th><th class="px-2 py-1 text-right">Baker's %</th><th></th>
          </tr></thead>
          <tbody>
            <tr class="bg-brand-50/50"><td class="px-2 py-1.5 font-semibold text-slate-700">Flour</td><td class="px-2 py-1.5 font-mono">{r ? fmt(r.f, 0) : '—'}</td><td class="px-2 py-1.5 text-right font-mono font-semibold text-brand-800">100%</td><td></td></tr>
            {rows.map((row, i) => (
              <tr>
                <td class="px-2 py-1"><input value={row.name} onInput={(e) => set(i, { name: (e.target as HTMLInputElement).value })} class={`${cell} w-full`} /></td>
                <td class="px-2 py-1"><input type="number" step="any" min="0" value={row.grams} onInput={(e) => set(i, { grams: (e.target as HTMLInputElement).value })} class={`${cell} w-24 font-mono`} /></td>
                <td class="px-2 py-1 text-right font-mono font-semibold text-slate-700">{r?.ings[i]?.pct != null ? `${fmt(r.ings[i].pct!)}%` : '—'}</td>
                <td class="px-2 py-1 text-right"><button onClick={() => setRows(rows.filter((_, j) => j !== i))} class="text-slate-400 hover:text-red-500" aria-label="Remove">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => setRows([...rows, { name: '', grams: '' }])} class="mt-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add ingredient</button>

      {r && (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Hydration</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.hydration)}%</p>
            <p class="mt-1 text-xs text-slate-400">liquid ÷ flour</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total dough weight</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.total, 0)} <span class="text-lg text-slate-500">g</span></p>
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Baker's percentages express every ingredient relative to the flour (always 100%). Hydration counts rows named water/milk/juice/beer. A lean bread is ~60–65% hydration; ciabatta and focaccia run 75%+. 🔒 In your browser.</p>
    </div>
  );
}
