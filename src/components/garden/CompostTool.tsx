import { useMemo, useState } from 'preact/hooks';
import { COMPOST_MATERIALS, getMaterial, blendedCN, COMPOST_TARGET } from '../../lib/garden';

interface Row { id: string; parts: string }
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

export default function CompostTool() {
  const [rows, setRows] = useState<Row[]>([
    { id: 'grass', parts: '1' },
    { id: 'leaves-dry', parts: '2' },
  ]);

  const r = useMemo(() => {
    const items = rows.map((row) => ({ mat: getMaterial(row.id), parts: num(row.parts) ?? 0 })).filter((x) => x.mat && x.parts > 0);
    if (items.length === 0) return null;
    const cn = blendedCN(items.map((i) => ({ cn: i.mat!.cn, parts: i.parts })));
    if (cn == null) return null;
    const status = cn < COMPOST_TARGET.lo ? 'too rich (add browns)' : cn > COMPOST_TARGET.hi ? 'too woody (add greens)' : 'in the ideal range';
    return { cn, status, ideal: cn >= COMPOST_TARGET.lo && cn <= COMPOST_TARGET.hi };
  }, [rows]);

  const set = (i: number, patch: Partial<Row>) => setRows(rows.map((x, j) => j === i ? { ...x, ...patch } : x));
  const cell = 'rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-2 py-1">Material</th><th class="px-2 py-1">C:N</th><th class="px-2 py-1">Parts (by volume)</th><th></th></tr></thead>
          <tbody>
            {rows.map((row, i) => {
              const mat = getMaterial(row.id);
              return (
                <tr>
                  <td class="px-2 py-1"><select value={row.id} onChange={(e) => set(i, { id: (e.target as HTMLSelectElement).value })} class={`${cell} w-full`}>
                    <optgroup label="Greens (nitrogen)">{COMPOST_MATERIALS.filter((m) => m.type === 'green').map((m) => <option value={m.id}>{m.name}</option>)}</optgroup>
                    <optgroup label="Browns (carbon)">{COMPOST_MATERIALS.filter((m) => m.type === 'brown').map((m) => <option value={m.id}>{m.name}</option>)}</optgroup>
                  </select></td>
                  <td class="px-2 py-1 font-mono text-slate-500">{mat?.cn}:1</td>
                  <td class="px-2 py-1"><input type="number" step="any" min="0" value={row.parts} onInput={(e) => set(i, { parts: (e.target as HTMLInputElement).value })} class={`${cell} w-24 font-mono`} /></td>
                  <td class="px-2 py-1 text-right"><button onClick={() => setRows(rows.filter((_, j) => j !== i))} class="text-slate-400 hover:text-red-500" aria-label="Remove">✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button onClick={() => setRows([...rows, { id: 'food', parts: '1' }])} class="mt-3 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50">+ Add material</button>

      {r ? (
        <div class={`mt-4 rounded-xl bg-white p-4 text-center ring-2 ${r.ideal ? 'ring-emerald-300' : 'ring-amber-300'}`}>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Blended C:N ratio</p>
          <p class={`mt-1 text-4xl font-extrabold ${r.ideal ? 'text-emerald-700' : 'text-amber-700'}`}>{Number(r.cn.toFixed(0))}:1</p>
          <p class="mt-1 text-sm text-slate-600">{r.status}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Add materials and their proportions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A compost pile decomposes fastest around a carbon-to-nitrogen ratio of 25–30:1 — roughly 2–3 parts "browns" (carbon) to 1 part "greens" (nitrogen) by volume. This is a parts-weighted estimate; moisture and turning matter too. C:N values from composting-science references. 🔒 In your browser.</p>
    </div>
  );
}
