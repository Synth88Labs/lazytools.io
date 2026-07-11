import { useMemo, useState } from 'preact/hooks';

interface Row { qty: string; unit: string; name: string }
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(3)).toString();

// Parse a quantity that may be a fraction ("1/2"), mixed ("1 1/2") or decimal.
function parseQty(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3];
  const frac = t.match(/^(\d+)\/(\d+)$/);
  if (frac) return +frac[1] / +frac[2];
  const n = parseFloat(t);
  return isFinite(n) ? n : null;
}

export default function RecipeScalerTool() {
  const [mode, setMode] = useState<'servings' | 'factor'>('servings');
  const [fromServ, setFromServ] = useState('4');
  const [toServ, setToServ] = useState('6');
  const [factor, setFactor] = useState('2');
  const [rows, setRows] = useState<Row[]>([
    { qty: '2', unit: 'cups', name: 'flour' },
    { qty: '1', unit: 'tsp', name: 'salt' },
    { qty: '1/2', unit: 'cup', name: 'butter' },
    { qty: '3', unit: '', name: 'eggs' },
  ]);

  const mult = useMemo(() => {
    if (mode === 'factor') return num(factor) ?? null;
    const f = num(fromServ), t = num(toServ);
    if (f == null || t == null) return null;
    return t / f;
  }, [mode, fromServ, toServ, factor]);

  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((r, j) => j === i ? { ...r, ...patch } : r));
  const cell = 'rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['servings', 'By servings'], ['factor', 'By multiplier']] as const).map(([m, lbl]) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>

      {mode === 'servings' ? (
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original servings</span>
            <input type="number" step="any" min="0" value={fromServ} onInput={(e) => setFromServ((e.target as HTMLInputElement).value)} class={`${cell} w-full font-mono`} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">New servings</span>
            <input type="number" step="any" min="0" value={toServ} onInput={(e) => setToServ((e.target as HTMLInputElement).value)} class={`${cell} w-full font-mono`} /></label>
        </div>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Multiply by</span>
          <input type="number" step="any" min="0" value={factor} onInput={(e) => setFactor((e.target as HTMLInputElement).value)} class={`${cell} w-full font-mono sm:w-40`} /></label>
      )}

      {mult != null && (
        <p class="mt-3 text-sm text-slate-600">Scaling factor: <strong class="font-mono text-brand-700">×{fmt(mult)}</strong></p>
      )}

      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th class="px-2 py-1">Qty</th><th class="px-2 py-1">Unit</th><th class="px-2 py-1">Ingredient</th>
              <th class="px-2 py-1 text-right">Scaled</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const q = parseQty(r.qty);
              const scaled = q != null && mult != null ? q * mult : null;
              return (
                <tr>
                  <td class="px-2 py-1"><input value={r.qty} onInput={(e) => set(i, { qty: (e.target as HTMLInputElement).value })} class={`${cell} w-20`} placeholder="1 1/2" /></td>
                  <td class="px-2 py-1"><input value={r.unit} onInput={(e) => set(i, { unit: (e.target as HTMLInputElement).value })} class={`${cell} w-24`} placeholder="cups" /></td>
                  <td class="px-2 py-1"><input value={r.name} onInput={(e) => set(i, { name: (e.target as HTMLInputElement).value })} class={`${cell} w-full`} placeholder="flour" /></td>
                  <td class="px-2 py-1 text-right font-mono font-semibold text-brand-800">{scaled != null ? `${fmt(scaled)} ${r.unit}` : '—'}</td>
                  <td class="px-2 py-1 text-right"><button onClick={() => setRows(rows.filter((_, j) => j !== i))} class="text-slate-400 hover:text-red-500" aria-label="Remove">✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={() => setRows([...rows, { qty: '', unit: '', name: '' }])} class="mt-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add ingredient</button>

      <p class="mt-4 text-xs text-slate-500">Enter quantities as decimals or fractions (½ → <code>1/2</code>, 1½ → <code>1 1/2</code>). Every ingredient scales by the same factor. Adjust cooking times and seasoning to taste. 🔒 In your browser.</p>
    </div>
  );
}
