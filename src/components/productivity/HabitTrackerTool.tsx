import { useState } from 'preact/hooks';
import { usePersistentState, exportJson, pickJson, uid, todayKey } from '../../lib/persist';

interface Habit { id: string; name: string; done: string[]; } // done = list of YYYY-MM-DD

function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function keyFor(y: number, m: number, d: number) { const p = (n: number) => String(n).padStart(2, '0'); return `${y}-${p(m + 1)}-${p(d)}`; }
function streak(done: string[]): number {
  const set = new Set(done);
  let s = 0;
  const d = new Date();
  // count back from today (or yesterday if today not done)
  if (!set.has(todayKey())) d.setDate(d.getDate() - 1);
  for (;;) { if (set.has(todayKey(d))) { s++; d.setDate(d.getDate() - 1); } else break; }
  return s;
}

export default function HabitTrackerTool() {
  const [habits, setHabits] = usePersistentState<Habit[]>('lt.habits', []);
  const [draft, setDraft] = useState('');
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const dim = daysInMonth(ym.y, ym.m);
  const monthName = new Date(ym.y, ym.m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const todayD = now.getFullYear() === ym.y && now.getMonth() === ym.m ? now.getDate() : -1;

  function add() { const n = draft.trim(); if (!n) return; setHabits((h) => [...h, { id: uid(), name: n, done: [] }]); setDraft(''); }
  function toggle(id: string, dayKey: string) {
    setHabits((hs) => hs.map((h) => h.id === id ? { ...h, done: h.done.includes(dayKey) ? h.done.filter((k) => k !== dayKey) : [...h.done, dayKey] } : h));
  }
  const remove = (id: string) => setHabits((hs) => hs.filter((h) => h.id !== id));
  const shiftMonth = (delta: number) => setYm(({ y, m }) => { const d = new Date(y, m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-2">
        <div class="min-w-0 flex-1">
          <label for="hb-add" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Add a habit</label>
          <input id="hb-add" value={draft} onInput={(e) => setDraft((e.target as HTMLInputElement).value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="e.g. Read 20 minutes" class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none" />
        </div>
        <button type="button" onClick={add} class="rounded-xl bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">Add</button>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => shiftMonth(-1)} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-brand-400">← Prev</button>
        <p class="font-bold text-slate-900">{monthName}</p>
        <button type="button" onClick={() => shiftMonth(1)} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-brand-400">Next →</button>
      </div>

      {habits.length === 0 ? (
        <p class="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-400">Add a habit above to start tracking. Tap a day to mark it done — build your streak.</p>
      ) : (
        <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full border-collapse text-center text-xs">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th class="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-left font-semibold">Habit</th>
                {Array.from({ length: dim }, (_, i) => (
                  <th class={`w-7 py-2 font-medium ${i + 1 === todayD ? 'text-brand-700' : ''}`}>{i + 1}</th>
                ))}
                <th class="px-2 py-2 font-semibold">🔥</th>
                <th class="px-2 py-2 font-semibold">%</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => {
                const doneThisMonth = Array.from({ length: dim }, (_, i) => h.done.includes(keyFor(ym.y, ym.m, i + 1))).filter(Boolean).length;
                return (
                  <tr class="border-b border-slate-100 last:border-0">
                    <td class="sticky left-0 z-10 bg-white px-3 py-1.5 text-left">
                      <span class="flex items-center gap-1.5">
                        <button type="button" onClick={() => remove(h.id)} class="text-slate-300 hover:text-red-600" aria-label="Delete habit">✕</button>
                        <span class="font-semibold text-slate-800">{h.name}</span>
                      </span>
                    </td>
                    {Array.from({ length: dim }, (_, i) => {
                      const k = keyFor(ym.y, ym.m, i + 1);
                      const done = h.done.includes(k);
                      return (
                        <td class="p-0.5">
                          <button
                            type="button"
                            onClick={() => toggle(h.id, k)}
                            aria-label={`${h.name} day ${i + 1}`}
                            class={`h-6 w-6 rounded transition ${done ? 'bg-mint-500 text-white' : 'bg-slate-100 hover:bg-slate-200'} ${i + 1 === todayD ? 'ring-2 ring-brand-400' : ''}`}
                          >{done ? '✓' : ''}</button>
                        </td>
                      );
                    })}
                    <td class="px-2 font-mono font-bold text-amber-600">{streak(h.done)}</td>
                    <td class="px-2 font-mono font-semibold text-slate-600">{Math.round((doneThisMonth / dim) * 100)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => exportJson('habits', 'habit-tracker.json', habits)} disabled={!habits.length} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 disabled:opacity-40">⬇ Export JSON</button>
        <button type="button" onClick={() => pickJson().then((d) => Array.isArray(d) && setHabits(d as Habit[])).catch(() => {})} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400">⬆ Import JSON</button>
      </div>
      <p class="mt-3 text-xs text-slate-500">🔥 = current streak of consecutive days. Everything is saved in this browser only.</p>
    </div>
  );
}
