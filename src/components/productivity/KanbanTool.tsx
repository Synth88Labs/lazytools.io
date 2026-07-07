import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

interface Card { id: string; text: string; color: string; }
interface Column { id: string; title: string; wip: number; cards: Card[] }
const COLORS = ['#e2e8f0', '#bfdbfe', '#bbf7d0', '#fde68a', '#fecaca', '#ddd6fe'];
const INITIAL: Column[] = [
  { id: uid(), title: 'To Do', wip: 0, cards: [{ id: uid(), text: 'Draft the plan', color: COLORS[0]! }] },
  { id: uid(), title: 'Doing', wip: 3, cards: [] },
  { id: uid(), title: 'Done', wip: 0, cards: [] },
];

export default function KanbanTool() {
  const [cols, setCols] = usePersistentState<Column[]>('lt.kanban', INITIAL);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [drag, setDrag] = useState<{ card: string; from: string } | null>(null);

  const setDraft = (colId: string, v: string) => setDrafts((d) => ({ ...d, [colId]: v }));
  function addCard(colId: string) {
    const t = (drafts[colId] || '').trim();
    if (!t) return;
    setCols((cs) => cs.map((c) => (c.id === colId ? { ...c, cards: [...c.cards, { id: uid(), text: t, color: COLORS[0]! }] } : c)));
    setDraft(colId, '');
  }
  const removeCard = (colId: string, cardId: string) => setCols((cs) => cs.map((c) => (c.id === colId ? { ...c, cards: c.cards.filter((k) => k.id !== cardId) } : c)));
  const cycleColor = (colId: string, cardId: string) => setCols((cs) => cs.map((c) => c.id === colId ? { ...c, cards: c.cards.map((k) => k.id === cardId ? { ...k, color: COLORS[(COLORS.indexOf(k.color) + 1) % COLORS.length]! } : k) } : c));
  function drop(toCol: string) {
    if (!drag) return;
    setCols((cs) => {
      const card = cs.flatMap((c) => c.cards).find((k) => k.id === drag.card);
      if (!card) return cs;
      return cs.map((c) => {
        if (c.id === drag.from) c = { ...c, cards: c.cards.filter((k) => k.id !== drag.card) };
        if (c.id === toCol) c = { ...c, cards: [...c.cards, card] };
        return c;
      });
    });
    setDrag(null);
  }
  const renameCol = (id: string, title: string) => setCols((cs) => cs.map((c) => (c.id === id ? { ...c, title } : c)));
  const setWip = (id: string, wip: number) => setCols((cs) => cs.map((c) => (c.id === id ? { ...c, wip } : c)));
  const addCol = () => setCols((cs) => [...cs, { id: uid(), title: 'New column', wip: 0, cards: [] }]);
  const removeCol = (id: string) => setCols((cs) => cs.filter((c) => c.id !== id));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <button type="button" onClick={addCol} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">＋ Column</button>
        <button type="button" onClick={() => exportJson('kanban', 'kanban-board.json', cols)} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">⬇ Export JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setCols(d as Column[])).catch(() => {})} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">⬆ Import</button>
        <button type="button" onClick={() => window.print()} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">🖨 Print / Save as PDF</button>
      </div>

      <div class="flex gap-3 overflow-x-auto pb-2">
        {cols.map((col) => {
          const over = col.wip > 0 && col.cards.length > col.wip;
          return (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(col.id)}
              class="flex w-72 shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-3"
            >
              <div class="flex items-center gap-1">
                <input value={col.title} onInput={(e) => renameCol(col.id, (e.target as HTMLInputElement).value)} class="min-w-0 flex-1 rounded border-0 bg-transparent px-1 py-0.5 text-sm font-bold text-slate-900 focus:bg-slate-50 focus:outline-none" />
                <span class={`rounded-full px-2 text-xs font-bold ${over ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>{col.cards.length}{col.wip > 0 ? `/${col.wip}` : ''}</span>
                <button type="button" onClick={() => removeCol(col.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete column">✕</button>
              </div>
              <label class="mt-1 flex items-center gap-1 text-[11px] text-slate-400">WIP limit
                <input type="number" min={0} max={20} value={col.wip} onInput={(e) => setWip(col.id, parseInt((e.target as HTMLInputElement).value, 10) || 0)} class="w-12 rounded border border-slate-200 px-1 py-0.5 text-xs text-slate-700" />
              </label>
              {over && <p class="mt-1 text-xs font-medium text-red-600">⚠ Over WIP limit — finish before starting more.</p>}

              <ul class="mt-2 flex-1 space-y-2">
                {col.cards.map((card) => (
                  <li
                    draggable
                    onDragStart={() => setDrag({ card: card.id, from: col.id })}
                    class="group rounded-lg border border-slate-200 p-2.5 text-sm text-slate-800 shadow-sm"
                    style={`background:${card.color}`}
                  >
                    <div class="flex items-start gap-1">
                      <span class="min-w-0 flex-1 break-words">{card.text}</span>
                      <button type="button" onClick={() => cycleColor(col.id, card.id)} class="opacity-0 transition group-hover:opacity-100" aria-label="Change colour" title="Change colour">🎨</button>
                      <button type="button" onClick={() => removeCard(col.id, card.id)} class="text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete card">✕</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div class="mt-2 flex gap-1">
                <input
                  value={drafts[col.id] || ''}
                  onInput={(e) => setDraft(col.id, (e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCard(col.id)}
                  placeholder="+ add card"
                  class="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button type="button" onClick={() => addCard(col.id)} class="rounded-lg bg-brand-700 px-3 text-sm font-semibold text-white hover:bg-brand-800">Add</button>
              </div>
            </div>
          );
        })}
      </div>
      <p class="mt-3 text-xs text-slate-500">Drag cards between columns. Everything is saved in this browser only; export JSON to back up or move devices.</p>
    </div>
  );
}
