import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

interface Item { id: string; text: string; weight: number }
interface State { title: string; pros: Item[]; cons: Item[] }
const INITIAL: State = { title: 'Should we do it?', pros: [{ id: uid(), text: 'Clear benefit', weight: 4 }], cons: [{ id: uid(), text: 'Takes time', weight: 2 }] };

export default function ProsConsTool() {
  const [st, setSt] = usePersistentState<State>('lt.proscons', INITIAL);
  const [dp, setDp] = useState(''); const [dc, setDc] = useState('');
  const sum = (arr: Item[]) => arr.reduce((s, i) => s + i.weight, 0);
  const pTotal = sum(st.pros), cTotal = sum(st.cons);
  const verdict = pTotal === cTotal ? 'Too close to call' : pTotal > cTotal ? 'Pros win' : 'Cons win';

  const addPro = () => { const t = dp.trim(); if (!t) return; setSt((s) => ({ ...s, pros: [...s.pros, { id: uid(), text: t, weight: 3 }] })); setDp(''); };
  const addCon = () => { const t = dc.trim(); if (!t) return; setSt((s) => ({ ...s, cons: [...s.cons, { id: uid(), text: t, weight: 3 }] })); setDc(''); };
  const setW = (side: 'pros' | 'cons', id: string, w: number) => setSt((s) => ({ ...s, [side]: s[side].map((i) => (i.id === id ? { ...i, weight: w } : i)) }));
  const del = (side: 'pros' | 'cons', id: string) => setSt((s) => ({ ...s, [side]: s[side].filter((i) => i.id !== id) }));
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  const col = (side: 'pros' | 'cons', label: string, draft: string, setDraft: (v: string) => void, addFn: () => void, accent: string) => (
    <div class={`rounded-xl border-2 p-3 ${side === 'pros' ? 'border-mint-200 bg-mint-50' : 'border-red-200 bg-red-50'}`}>
      <div class="flex items-baseline justify-between">
        <p class={`font-bold ${accent}`}>{label}</p>
        <span class={`rounded-full px-2 text-sm font-bold ${side === 'pros' ? 'bg-mint-500' : 'bg-red-500'} text-white`}>{sum(st[side])}</span>
      </div>
      <ul class="mt-2 space-y-1.5">
        {st[side].map((i) => (
          <li class="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800">
            <span class="min-w-0 flex-1 break-words">{i.text}</span>
            <select value={i.weight} onChange={(e) => setW(side, i.id, parseInt((e.target as HTMLSelectElement).value, 10))} class="rounded border border-slate-200 bg-white px-1 py-0.5 text-xs" title="Importance 1–5">
              {[1, 2, 3, 4, 5].map((w) => <option value={w}>{w}</option>)}
            </select>
            <button type="button" onClick={() => del(side, i.id)} class="text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete">✕</button>
          </li>
        ))}
      </ul>
      <div class="mt-2 flex gap-1">
        <input value={draft} onInput={(e) => setDraft((e.target as HTMLInputElement).value)} onKeyDown={(e) => e.key === 'Enter' && addFn()} placeholder={`+ add ${side === 'pros' ? 'pro' : 'con'}`} class="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none" />
        <button type="button" onClick={addFn} class="rounded-lg bg-brand-700 px-3 text-sm font-semibold text-white hover:bg-brand-800">Add</button>
      </div>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <input value={st.title} onInput={(e) => setSt((s) => ({ ...s, title: (e.target as HTMLInputElement).value }))} class="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:border-brand-500 focus:outline-none" placeholder="The decision…" />
        <button type="button" onClick={() => exportJson('proscons', 'pros-cons.json', st)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => d && setSt(d as State)).catch(() => {})} class={btn}>⬆ Import</button>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {col('pros', '👍 Pros', dp, setDp, addPro, 'text-mint-800')}
        {col('cons', '👎 Cons', dc, setDc, addCon, 'text-red-800')}
      </div>
      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4 text-center" aria-live="polite">
        <p class="text-sm font-semibold text-slate-500">Weighted verdict</p>
        <p class={`mt-1 text-2xl font-extrabold ${pTotal > cTotal ? 'text-mint-700' : pTotal < cTotal ? 'text-red-700' : 'text-slate-700'}`}>{verdict}</p>
        <p class="text-sm text-slate-500">Pros {pTotal} · Cons {cTotal} {pTotal !== cTotal ? `· margin ${Math.abs(pTotal - cTotal)}` : ''}</p>
      </div>
      <p class="mt-3 text-xs text-slate-500">Rate each point's importance 1–5; the weighted totals give a verdict. It's a nudge, not a ruling. Saved in this browser.</p>
    </div>
  );
}
