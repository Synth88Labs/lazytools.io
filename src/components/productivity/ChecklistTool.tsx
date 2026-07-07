import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

interface Step { id: string; text: string; done: boolean }
interface State { title: string; steps: Step[] }
const INITIAL: State = { title: 'Publish checklist', steps: [
  { id: uid(), text: 'Proofread the content', done: false },
  { id: uid(), text: 'Check all links work', done: false },
  { id: uid(), text: 'Add meta description', done: false },
] };

export default function ChecklistTool() {
  const [st, setSt] = usePersistentState<State>('lt.checklist', INITIAL);
  const [draft, setDraft] = useState('');
  const done = st.steps.filter((s) => s.done).length;
  const pct = st.steps.length ? Math.round((done / st.steps.length) * 100) : 0;

  const add = () => { const t = draft.trim(); if (!t) return; setSt((s) => ({ ...s, steps: [...s.steps, { id: uid(), text: t, done: false }] })); setDraft(''); };
  const toggle = (id: string) => setSt((s) => ({ ...s, steps: s.steps.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }));
  const remove = (id: string) => setSt((s) => ({ ...s, steps: s.steps.filter((x) => x.id !== id) }));
  const move = (i: number, dir: -1 | 1) => setSt((s) => { const a = [...s.steps]; const j = i + dir; if (j < 0 || j >= a.length) return s; [a[i], a[j]] = [a[j]!, a[i]!]; return { ...s, steps: a }; });
  const reset = () => setSt((s) => ({ ...s, steps: s.steps.map((x) => ({ ...x, done: false })) }));
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <input value={st.title} onInput={(e) => setSt((s) => ({ ...s, title: (e.target as HTMLInputElement).value }))} class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-bold text-slate-900 focus:border-brand-500 focus:outline-none" placeholder="Checklist name" />

      <div class="mt-3 flex items-center gap-3">
        <span class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200"><span class="block h-full rounded-full bg-mint-500 transition-all" style={`width:${pct}%`} /></span>
        <span class="text-sm font-bold text-slate-700">{done}/{st.steps.length} · {pct}%</span>
      </div>

      <ul class="mt-3 space-y-1.5">
        {st.steps.map((s, i) => (
          <li class="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
            <input type="checkbox" checked={s.done} onChange={() => toggle(s.id)} class="h-5 w-5 rounded border-slate-300 text-mint-600 focus:ring-mint-500" />
            <span class={`min-w-0 flex-1 break-words text-sm ${s.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{s.text}</span>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} class="text-slate-300 disabled:opacity-30 hover:text-brand-600" aria-label="Up">↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === st.steps.length - 1} class="text-slate-300 disabled:opacity-30 hover:text-brand-600" aria-label="Down">↓</button>
            <button type="button" onClick={() => remove(s.id)} class="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete">✕</button>
          </li>
        ))}
      </ul>

      <div class="mt-3 flex gap-1">
        <input value={draft} onInput={(e) => setDraft((e.target as HTMLInputElement).value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="+ add step" class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
        <button type="button" onClick={add} class="rounded-lg bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800">Add</button>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={reset} class={btn} disabled={done === 0}>↺ Reset (run again)</button>
        <button type="button" onClick={() => exportJson('checklist', 'checklist.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && setSt(d as State)).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={() => window.print()} class={btn}>🖨 Print / Save as PDF</button>
      </div>
      <p class="mt-3 text-xs text-slate-500">A reusable checklist / SOP — tick items off, then "Reset" to run the whole procedure again. Saved in this browser only.</p>
    </div>
  );
}
