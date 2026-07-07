import { usePersistentState, exportJson, pickJson, uid, downloadBlob } from '../../lib/persist';

interface Criterion { id: string; name: string; weight: number }
interface Option { id: string; name: string; scores: Record<string, number> }
interface State { criteria: Criterion[]; options: Option[] }
const INITIAL: State = {
  criteria: [
    { id: 'c1', name: 'Cost', weight: 3 },
    { id: 'c2', name: 'Impact', weight: 5 },
    { id: 'c3', name: 'Effort', weight: 2 },
  ],
  options: [
    { id: 'o1', name: 'Option A', scores: { c1: 7, c2: 8, c3: 4 } },
    { id: 'o2', name: 'Option B', scores: { c1: 5, c2: 6, c3: 8 } },
  ],
};

export default function DecisionMatrixTool() {
  const [st, setSt] = usePersistentState<State>('lt.decisionmatrix', INITIAL);
  const total = (o: Option) => st.criteria.reduce((s, c) => s + (o.scores[c.id] || 0) * c.weight, 0);
  const maxWeight = st.criteria.reduce((s, c) => s + c.weight, 0) * 10 || 1;
  const ranked = [...st.options].sort((a, b) => total(b) - total(a));
  const winner = ranked[0];

  const setOpt = (id: string, patch: Partial<Option>) => setSt((s) => ({ ...s, options: s.options.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));
  const setScore = (oid: string, cid: string, v: number) => setSt((s) => ({ ...s, options: s.options.map((o) => (o.id === oid ? { ...o, scores: { ...o.scores, [cid]: v } } : o)) }));
  const setCrit = (id: string, patch: Partial<Criterion>) => setSt((s) => ({ ...s, criteria: s.criteria.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  const addOpt = () => setSt((s) => ({ ...s, options: [...s.options, { id: uid(), name: 'New option', scores: {} }] }));
  const addCrit = () => setSt((s) => ({ ...s, criteria: [...s.criteria, { id: uid(), name: 'New criterion', weight: 3 }] }));
  const delOpt = (id: string) => setSt((s) => ({ ...s, options: s.options.filter((o) => o.id !== id) }));
  const delCrit = (id: string) => setSt((s) => ({ ...s, criteria: s.criteria.filter((c) => c.id !== id) }));

  function exportCsv() {
    const head = ['Option', ...st.criteria.map((c) => `${c.name} (w${c.weight})`), 'Weighted total'];
    const rows = st.options.map((o) => [o.name, ...st.criteria.map((c) => String(o.scores[c.id] || 0)), String(total(o))]);
    downloadBlob(new Blob([[head, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')], { type: 'text/csv' }), 'decision-matrix.csv');
  }

  const inp = 'rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={addOpt} class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800">＋ Option</button>
        <button type="button" onClick={addCrit} class={btn}>＋ Criterion</button>
        <button type="button" onClick={exportCsv} class={btn}>📊 CSV</button>
        <button type="button" onClick={() => exportJson('decisionmatrix', 'decision-matrix.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && setSt(d as State)).catch(() => {})} class={btn}>⬆ Import</button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-left">
              <th class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Option</th>
              {st.criteria.map((c) => (
                <th class="px-2 py-2">
                  <input value={c.name} onInput={(e) => setCrit(c.id, { name: (e.target as HTMLInputElement).value })} class={`${inp} w-24 font-semibold`} />
                  <div class="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                    weight<input type="number" min={1} max={10} value={c.weight} onInput={(e) => setCrit(c.id, { weight: Math.max(1, Math.min(10, parseInt((e.target as HTMLInputElement).value, 10) || 1)) })} class="w-11 rounded border border-slate-200 px-1 py-0.5" />
                    <button type="button" onClick={() => delCrit(c.id)} class="text-slate-300 hover:text-red-600">✕</button>
                  </div>
                </th>
              ))}
              <th class="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Score</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((o, i) => {
              const t = total(o);
              const isWin = winner && o.id === winner.id && st.options.length > 1;
              return (
                <tr class={`border-b border-slate-100 last:border-0 ${isWin ? 'bg-mint-50' : ''}`}>
                  <td class="px-3 py-1.5">
                    <span class="flex items-center gap-1.5">
                      <span class="w-5 text-center font-bold text-slate-400">{i + 1}</span>
                      <input value={o.name} onInput={(e) => setOpt(o.id, { name: (e.target as HTMLInputElement).value })} class={`${inp} min-w-28 font-medium`} />
                      {isWin && <span class="rounded-full bg-mint-500 px-2 text-xs font-bold text-white">✓ best</span>}
                    </span>
                  </td>
                  {st.criteria.map((c) => (
                    <td class="px-2 py-1.5 text-center">
                      <input type="number" min={0} max={10} value={o.scores[c.id] ?? ''} placeholder="0" onInput={(e) => setScore(o.id, c.id, Math.max(0, Math.min(10, parseInt((e.target as HTMLInputElement).value, 10) || 0)))} class={`${inp} w-14 text-center`} />
                    </td>
                  ))}
                  <td class="px-3 py-1.5 text-right">
                    <span class="font-mono text-base font-bold text-slate-900">{t}</span>
                    <span class="ml-1 text-xs text-slate-400">/{maxWeight}</span>
                  </td>
                  <td class="px-2"><button type="button" onClick={() => delOpt(o.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete option">✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-slate-500">Score each option 0–10 on each criterion; the weighted total ranks them. Weight the criteria by how much they matter. Saved in this browser.</p>
    </div>
  );
}
