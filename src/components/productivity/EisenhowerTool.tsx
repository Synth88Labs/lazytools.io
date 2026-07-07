import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid } from '../../lib/persist';

type Quad = 'do' | 'schedule' | 'delegate' | 'delete';
interface Task { id: string; text: string; q: Quad; }

const QUAD: Record<Quad, { title: string; sub: string; advice: string; box: string; head: string }> = {
  do: { title: 'Do first', sub: 'Urgent · Important', advice: 'Tackle these now.', box: 'border-red-200 bg-red-50', head: 'text-red-800' },
  schedule: { title: 'Schedule', sub: 'Not urgent · Important', advice: 'Plan time for these — this is where good work lives.', box: 'border-brand-200 bg-brand-50', head: 'text-brand-800' },
  delegate: { title: 'Delegate', sub: 'Urgent · Not important', advice: 'Hand these off if you can.', box: 'border-amber-200 bg-amber-50', head: 'text-amber-800' },
  delete: { title: 'Delete', sub: 'Not urgent · Not important', advice: 'Drop these without guilt.', box: 'border-slate-200 bg-slate-100', head: 'text-slate-600' },
};
const ORDER: Quad[] = ['do', 'schedule', 'delegate', 'delete'];

export default function EisenhowerTool() {
  const [tasks, setTasks] = usePersistentState<Task[]>('lt.eisenhower', []);
  const [draft, setDraft] = useState('');
  const [addQ, setAddQ] = useState<Quad>('do');
  const [dragId, setDragId] = useState<string | null>(null);

  function add() {
    const t = draft.trim();
    if (!t) return;
    setTasks((ts) => [...ts, { id: uid(), text: t, q: addQ }]);
    setDraft('');
  }
  const move = (id: string, q: Quad) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, q } : t)));
  const remove = (id: string) => setTasks((ts) => ts.filter((t) => t.id !== id));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-2">
        <div class="min-w-0 flex-1">
          <label for="ei-add" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Add a task</label>
          <input id="ei-add" value={draft} onInput={(e) => setDraft((e.target as HTMLInputElement).value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="e.g. Reply to the client proposal" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none" />
        </div>
        <select value={addQ} onChange={(e) => setAddQ((e.target as HTMLSelectElement).value as Quad)} class="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
          {ORDER.map((q) => <option value={q}>{QUAD[q].title}</option>)}
        </select>
        <button type="button" onClick={add} class="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">Add</button>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        {ORDER.map((q) => {
          const list = tasks.filter((t) => t.q === q);
          return (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => { if (dragId) move(dragId, q); setDragId(null); }}
              class={`min-h-36 rounded-xl border-2 p-3 ${QUAD[q].box}`}
            >
              <div class="flex items-baseline justify-between">
                <p class={`font-bold ${QUAD[q].head}`}>{QUAD[q].title} <span class="ml-1 text-xs font-medium text-slate-500">{QUAD[q].sub}</span></p>
                <span class="rounded-full bg-white/70 px-2 text-xs font-bold text-slate-500">{list.length}</span>
              </div>
              <p class="mt-0.5 text-xs text-slate-500">{QUAD[q].advice}</p>
              <ul class="mt-2 space-y-1.5">
                {list.map((t) => (
                  <li
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    class="group flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm"
                  >
                    <span class="cursor-grab text-slate-300">⠿</span>
                    <span class="min-w-0 flex-1 break-words">{t.text}</span>
                    <button type="button" onClick={() => remove(t.id)} class="text-xs text-slate-300 opacity-0 transition group-hover:opacity-100 hover:text-red-600" aria-label="Delete">✕</button>
                  </li>
                ))}
                {list.length === 0 && <li class="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-center text-xs text-slate-400">drag tasks here</li>}
              </ul>
            </div>
          );
        })}
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => exportJson('eisenhower', 'eisenhower-matrix.json', tasks)} disabled={!tasks.length} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40">⬇ Export JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setTasks(d as Task[])).catch(() => {})} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400">⬆ Import JSON</button>
        <button type="button" onClick={() => window.print()} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400">🖨 Print</button>
        {tasks.length > 0 && <button type="button" onClick={() => confirm('Clear all tasks?') && setTasks([])} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-400">Clear all</button>}
      </div>
      <p class="mt-3 text-xs text-slate-500">Drag tasks between quadrants. Saved in this browser only; export JSON to back up or move devices.</p>
    </div>
  );
}
