import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

interface Card { id: string; text: string; votes: number }
type ColId = 'went-well' | 'to-improve' | 'actions';
type State = Record<ColId, Card[]>;
const INITIAL: State = { 'went-well': [], 'to-improve': [], actions: [] };
const COLS: { id: ColId; title: string; box: string; head: string }[] = [
  { id: 'went-well', title: '😀 What went well', box: 'border-mint-200 bg-mint-50', head: 'text-mint-800' },
  { id: 'to-improve', title: '🤔 What to improve', box: 'border-amber-200 bg-amber-50', head: 'text-amber-800' },
  { id: 'actions', title: '✅ Action items', box: 'border-brand-200 bg-brand-50', head: 'text-brand-800' },
];

export default function RetroTool() {
  const [st, setSt] = usePersistentState<State>('lt.retro', INITIAL);
  const [drafts, setDrafts] = useState<Record<ColId, string>>({ 'went-well': '', 'to-improve': '', actions: '' });
  const add = (c: ColId) => { const t = drafts[c].trim(); if (!t) return; setSt((s) => ({ ...s, [c]: [...s[c], { id: uid(), text: t, votes: 0 }] })); setDrafts((d) => ({ ...d, [c]: '' })); };
  const vote = (c: ColId, id: string, d: number) => setSt((s) => ({ ...s, [c]: s[c].map((k) => (k.id === id ? { ...k, votes: Math.max(0, k.votes + d) } : k)).sort((a, b) => b.votes - a.votes) }));
  const remove = (c: ColId, id: string) => setSt((s) => ({ ...s, [c]: s[c].filter((k) => k.id !== id) }));
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => exportJson('retro', 'retrospective.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && setSt(d as State)).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={() => window.print()} class={btn}>🖨 Print / Save as PDF</button>
        <button type="button" onClick={() => confirm('Clear the whole board?') && setSt(INITIAL)} class={`${btn} !text-red-600`}>Clear</button>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        {COLS.map((col) => (
          <div class={`rounded-xl border-2 p-3 ${col.box}`}>
            <p class={`font-bold ${col.head}`}>{col.title} <span class="text-xs font-medium text-slate-500">· {st[col.id].length}</span></p>
            <ul class="mt-2 space-y-1.5">
              {st[col.id].map((card) => (
                <li class="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800">
                  <button type="button" onClick={() => vote(col.id, card.id, 1)} class="flex items-center gap-0.5 rounded bg-slate-100 px-1.5 text-xs font-bold text-slate-600 hover:bg-brand-100 hover:text-brand-700" title="Upvote">▲ {card.votes}</button>
                  <span class="min-w-0 flex-1 break-words">{card.text}</span>
                  <button type="button" onClick={() => vote(col.id, card.id, -1)} class="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-slate-600" aria-label="Downvote">▼</button>
                  <button type="button" onClick={() => remove(col.id, card.id)} class="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete">✕</button>
                </li>
              ))}
            </ul>
            <div class="mt-2 flex gap-1">
              <input value={drafts[col.id]} onInput={(e) => setDrafts((d) => ({ ...d, [col.id]: (e.target as HTMLInputElement).value }))} onKeyDown={(e) => e.key === 'Enter' && add(col.id)} placeholder="+ add note" class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none" />
              <button type="button" onClick={() => add(col.id)} class="rounded-lg bg-brand-700 px-3 text-sm font-semibold text-white hover:bg-brand-800">Add</button>
            </div>
          </div>
        ))}
      </div>
      <p class="mt-3 text-xs text-slate-500">Add notes to each column and upvote the ones the team cares about — they sort to the top. Saved in this browser only.</p>
    </div>
  );
}
