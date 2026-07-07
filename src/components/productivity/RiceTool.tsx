import { usePersistentState, exportJson, pickJson, uid, downloadBlob } from '../../lib/persist';

interface Item { id: string; name: string; reach: number; impact: number; confidence: number; effort: number }
const INITIAL: Item[] = [
  { id: uid(), name: 'Feature A', reach: 500, impact: 2, confidence: 80, effort: 3 },
  { id: uid(), name: 'Feature B', reach: 2000, impact: 1, confidence: 100, effort: 2 },
  { id: uid(), name: 'Feature C', reach: 150, impact: 3, confidence: 50, effort: 1 },
];
const rice = (i: Item) => (i.effort > 0 ? (i.reach * i.impact * (i.confidence / 100)) / i.effort : 0);

export default function RiceTool() {
  const [items, setItems] = usePersistentState<Item[]>('lt.rice', INITIAL);
  const ranked = [...items].sort((a, b) => rice(b) - rice(a));
  const set = (id: string, patch: Partial<Item>) => setItems((it) => it.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const add = () => setItems((it) => [...it, { id: uid(), name: 'New idea', reach: 100, impact: 1, confidence: 80, effort: 1 }]);
  const del = (id: string) => setItems((it) => it.filter((x) => x.id !== id));
  function exportCsv() {
    const head = ['Item', 'Reach', 'Impact', 'Confidence %', 'Effort', 'RICE score'];
    const rows = ranked.map((i) => [i.name, i.reach, i.impact, i.confidence, i.effort, rice(i).toFixed(1)]);
    downloadBlob(new Blob([[head, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')], { type: 'text/csv' }), 'rice-scores.csv');
  }
  const inp = 'rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';
  const numTd = (id: string, k: keyof Item, min: number, max: number, step = 1) => (
    <td class="px-2 py-1.5 text-center"><input type="number" min={min} max={max} step={step} value={items.find((x) => x.id === id)![k] as number} onInput={(e) => set(id, { [k]: Math.max(min, parseFloat((e.target as HTMLInputElement).value) || 0) } as Partial<Item>)} class={`${inp} w-20 text-center`} /></td>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={add} class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800">＋ Item</button>
        <button type="button" onClick={exportCsv} class={btn}>📊 CSV</button>
        <button type="button" onClick={() => exportJson('rice', 'rice-scores.json', items)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setItems(d as Item[])).catch(() => {})} class={btn}>⬆ Import</button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th class="px-3 py-2">#</th><th class="px-3 py-2">Item</th>
              <th class="px-2 py-2 text-center" title="How many people it affects in a period">Reach</th>
              <th class="px-2 py-2 text-center" title="Per-person impact — e.g. 3 massive, 2 high, 1 medium, 0.5 low">Impact</th>
              <th class="px-2 py-2 text-center" title="How sure you are, as a %">Confid.</th>
              <th class="px-2 py-2 text-center" title="Person-effort (e.g. months)">Effort</th>
              <th class="px-3 py-2 text-right">RICE</th><th></th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((i, idx) => (
              <tr class={`border-b border-slate-100 last:border-0 ${idx === 0 && items.length > 1 ? 'bg-mint-50' : ''}`}>
                <td class="px-3 py-1.5 text-center font-bold text-slate-400">{idx + 1}</td>
                <td class="px-3 py-1.5"><input value={i.name} onInput={(e) => set(i.id, { name: (e.target as HTMLInputElement).value })} class={`${inp} min-w-28 font-medium`} /></td>
                {numTd(i.id, 'reach', 0, 1e9)}
                {numTd(i.id, 'impact', 0, 10, 0.25)}
                {numTd(i.id, 'confidence', 0, 100)}
                {numTd(i.id, 'effort', 0.1, 1000, 0.5)}
                <td class="px-3 py-1.5 text-right"><span class="font-mono text-base font-bold text-slate-900">{rice(i).toFixed(1)}</span></td>
                <td class="px-2"><button type="button" onClick={() => del(i.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-slate-500">RICE = Reach × Impact × Confidence ÷ Effort — a single score to rank ideas. Higher is better; the top row is highlighted. Saved locally.</p>
    </div>
  );
}
