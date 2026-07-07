import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson } from '../../lib/persist';

type Quad = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
type State = Record<Quad, string[]>;
const INITIAL: State = { strengths: [], weaknesses: [], opportunities: [], threats: [] };
const META: Record<Quad, { title: string; sub: string; box: string; head: string }> = {
  strengths: { title: 'Strengths', sub: 'Internal · helpful', box: 'border-mint-200 bg-mint-50', head: 'text-mint-800' },
  weaknesses: { title: 'Weaknesses', sub: 'Internal · harmful', box: 'border-amber-200 bg-amber-50', head: 'text-amber-800' },
  opportunities: { title: 'Opportunities', sub: 'External · helpful', box: 'border-brand-200 bg-brand-50', head: 'text-brand-800' },
  threats: { title: 'Threats', sub: 'External · harmful', box: 'border-red-200 bg-red-50', head: 'text-red-800' },
};
const ORDER: Quad[] = ['strengths', 'weaknesses', 'opportunities', 'threats'];

export default function SwotTool() {
  const [st, setSt] = usePersistentState<State>('lt.swot', INITIAL);
  const [drafts, setDrafts] = useState<Record<Quad, string>>({ strengths: '', weaknesses: '', opportunities: '', threats: '' });
  const add = (q: Quad) => { const t = drafts[q].trim(); if (!t) return; setSt((s) => ({ ...s, [q]: [...s[q], t] })); setDrafts((d) => ({ ...d, [q]: '' })); };
  const remove = (q: Quad, i: number) => setSt((s) => ({ ...s, [q]: s[q].filter((_, x) => x !== i) }));
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => exportJson('swot', 'swot-analysis.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && setSt(d as State)).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={() => window.print()} class={btn}>🖨 Print / Save as PDF</button>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {ORDER.map((q) => (
          <div class={`rounded-xl border-2 p-3 ${META[q].box}`}>
            <p class={`font-bold ${META[q].head}`}>{META[q].title} <span class="ml-1 text-xs font-medium text-slate-500">{META[q].sub}</span></p>
            <ul class="mt-2 space-y-1.5">
              {st[q].map((item, i) => (
                <li class="group flex items-start gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800">
                  <span class="min-w-0 flex-1 break-words">{item}</span>
                  <button type="button" onClick={() => remove(q, i)} class="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete">✕</button>
                </li>
              ))}
            </ul>
            <div class="mt-2 flex gap-1">
              <input value={drafts[q]} onInput={(e) => setDrafts((d) => ({ ...d, [q]: (e.target as HTMLInputElement).value }))} onKeyDown={(e) => e.key === 'Enter' && add(q)} placeholder={`+ add ${META[q].title.toLowerCase().slice(0, -1)}`} class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none" />
              <button type="button" onClick={() => add(q)} class="rounded-lg bg-brand-700 px-3 text-sm font-semibold text-white hover:bg-brand-800">Add</button>
            </div>
          </div>
        ))}
      </div>
      <p class="mt-3 text-xs text-slate-500">Strengths and weaknesses are internal; opportunities and threats are external. Saved in this browser only.</p>
    </div>
  );
}
