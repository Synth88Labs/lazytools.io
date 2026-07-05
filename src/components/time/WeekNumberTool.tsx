import { useState } from 'preact/hooks';
import { isoWeek, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function WeekNumberTool() {
  const [dateStr, setDateStr] = useState(() => toDateInputValue(new Date()));

  const date = fromDateInputValue(dateStr);
  const wk = date ? isoWeek(date) : null;

  // Monday–Sunday range of the ISO week containing `date`
  let monday: Date | null = null;
  let sunday: Date | null = null;
  if (date) {
    const dow = date.getDay() || 7;
    monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (dow - 1));
    sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  }

  const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="wn-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</label>
      <div class="flex flex-wrap gap-2">
        <input
          id="wn-date"
          type="date"
          value={dateStr}
          onInput={(e) => setDateStr((e.target as HTMLInputElement).value)}
          class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <button type="button" onClick={() => setDateStr(toDateInputValue(new Date()))} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
          Today
        </button>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {wk && monday && sunday ? (
          <>
            <p class="text-3xl font-extrabold text-brand-800">Week {wk.week}</p>
            <p class="mt-1 text-sm font-medium text-slate-600">
              of ISO year {wk.year} · {fmt(monday)} → {fmt(sunday)}
            </p>
          </>
        ) : (
          <p class="text-sm text-slate-500">Pick a date above.</p>
        )}
      </div>
      <p class="mt-2 text-xs text-slate-500">ISO 8601: weeks start Monday; week 1 contains the year's first Thursday.</p>
    </div>
  );
}
