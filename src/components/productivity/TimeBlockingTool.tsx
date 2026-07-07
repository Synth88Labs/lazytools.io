import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

const CATS = [
  { name: 'Deep work', color: '#1d87f1' },
  { name: 'Meetings', color: '#f59e0b' },
  { name: 'Admin', color: '#64748b' },
  { name: 'Break', color: '#10b981' },
  { name: 'Personal', color: '#8b5cf6' },
];
interface Block { id: string; start: string; dur: number; label: string; cat: number }
const INITIAL: Block[] = [
  { id: uid(), start: '09:00', dur: 90, label: 'Focus block', cat: 0 },
  { id: uid(), start: '10:30', dur: 30, label: 'Standup', cat: 1 },
  { id: uid(), start: '12:30', dur: 45, label: 'Lunch', cat: 3 },
];
const DAY_START = 6, DAY_END = 23, PX = 0.9;
const toMin = (s: string) => { const [h, m] = s.split(':').map(Number); return (h || 0) * 60 + (m || 0); };
const fmtDur = (m: number) => `${Math.floor(m / 60) ? Math.floor(m / 60) + 'h ' : ''}${m % 60 ? (m % 60) + 'm' : ''}`.trim() || '0m';

export default function TimeBlockingTool() {
  const [blocks, setBlocks] = usePersistentState<Block[]>('lt.timeblock', INITIAL);
  const dayTop = DAY_START * 60;
  const set = (id: string, patch: Partial<Block>) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const add = () => setBlocks((bs) => [...bs, { id: uid(), start: '14:00', dur: 60, label: 'New block', cat: 0 }]);
  const del = (id: string) => setBlocks((bs) => bs.filter((b) => b.id !== id));

  const totals = CATS.map((c, i) => blocks.filter((b) => b.cat === i).reduce((s, b) => s + b.dur, 0));
  const inp = 'rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const btn = 'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={add} class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-800">＋ Block</button>
        <button type="button" onClick={() => exportJson('timeblock', 'time-blocks.json', blocks)} class={btn}>⬇ JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setBlocks(d as Block[])).catch(() => {})} class={btn}>⬆ Import</button>
        <button type="button" onClick={() => window.print()} class={btn}>🖨 Print / Save as PDF</button>
      </div>

      <div class="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* timeline */}
        <div class="relative rounded-xl border border-slate-200 bg-white" style={`height:${(DAY_END - DAY_START) * 60 * PX + 16}px`}>
          {Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => (
            <div class="absolute left-0 right-0 border-t border-slate-100" style={`top:${i * 60 * PX + 8}px`}>
              <span class="absolute -top-2 left-1 bg-white px-1 text-[11px] font-medium text-slate-400">{String(DAY_START + i).padStart(2, '0')}:00</span>
            </div>
          ))}
          {blocks.map((b) => {
            const top = (toMin(b.start) - dayTop) * PX + 8;
            const h = Math.max(14, b.dur * PX);
            const c = CATS[b.cat] ?? CATS[0]!;
            return (
              <div class="absolute left-12 right-1.5 overflow-hidden rounded-lg px-2 py-1 text-xs text-white shadow-sm" style={`top:${top}px;height:${h}px;background:${c.color}`} title={`${b.label} · ${b.start} · ${fmtDur(b.dur)}`}>
                <span class="font-semibold">{b.label}</span>
                <span class="ml-1 opacity-80">{b.start}</span>
              </div>
            );
          })}
        </div>

        <div>
          <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-sm">
              <thead><tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-3 py-2">Block</th><th class="px-2 py-2">Start</th><th class="px-2 py-2">Min</th><th class="px-2 py-2">Category</th><th></th></tr></thead>
              <tbody>
                {blocks.slice().sort((a, b) => toMin(a.start) - toMin(b.start)).map((b) => (
                  <tr class="border-b border-slate-100 last:border-0">
                    <td class="px-3 py-1.5"><input value={b.label} onInput={(e) => set(b.id, { label: (e.target as HTMLInputElement).value })} class={`${inp} w-full min-w-28`} /></td>
                    <td class="px-2 py-1.5"><input type="time" value={b.start} onInput={(e) => set(b.id, { start: (e.target as HTMLInputElement).value })} class={inp} /></td>
                    <td class="px-2 py-1.5"><input type="number" min={5} max={720} step={5} value={b.dur} onInput={(e) => set(b.id, { dur: Math.max(5, parseInt((e.target as HTMLInputElement).value, 10) || 5) })} class={`${inp} w-16`} /></td>
                    <td class="px-2 py-1.5"><select value={b.cat} onChange={(e) => set(b.id, { cat: parseInt((e.target as HTMLSelectElement).value, 10) })} class={inp}>{CATS.map((c, i) => <option value={i}>{c.name}</option>)}</select></td>
                    <td class="px-2"><button type="button" onClick={() => del(b.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete">✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div class="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Time by category</p>
            <div class="mt-2 flex flex-wrap gap-3">
              {CATS.map((c, i) => totals[i]! > 0 && (
                <span class="flex items-center gap-1.5 text-sm font-medium text-slate-700"><span class="h-3 w-3 rounded" style={`background:${c.color}`} />{c.name}: {fmtDur(totals[i]!)}</span>
              ))}
              {totals.every((t) => t === 0) && <span class="text-sm text-slate-400">Add blocks to see where your day goes.</span>}
            </div>
          </div>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500">Assign every block to a category and the totals show where your day actually goes — often a surprise. Saved in this browser only.</p>
    </div>
  );
}
