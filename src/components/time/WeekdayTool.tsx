import { useState } from 'preact/hooks';
import { weekdayInfo, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function WeekdayTool() {
  const [dateStr, setDateStr] = useState(() => toDateInputValue(new Date()));
  const date = fromDateInputValue(dateStr);
  const r = date ? weekdayInfo(date, new Date()) : null;

  const rel = (n: number | null): string => {
    if (n === null) return '';
    if (n === 0) return 'that’s today';
    if (n === 1) return 'tomorrow';
    if (n === -1) return 'yesterday';
    return n > 0 ? `${n} days from today` : `${-n} days ago`;
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="wd-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</label>
      <div class="flex flex-wrap gap-2">
        <input id="wd-date" type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)}
          class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        <button type="button" onClick={() => setDateStr(toDateInputValue(new Date()))} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">Today</button>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {r ? (
          <>
            <p class="text-3xl font-extrabold text-brand-800">{r.weekday}</p>
            <p class="mt-1 text-sm font-medium text-slate-600">
              {r.isWeekend ? 'Weekend' : 'Weekday'} · ISO day {r.isoDow} of 7{r.daysFromToday !== null ? ` · ${rel(r.daysFromToday)}` : ''}
            </p>
          </>
        ) : <p class="text-sm text-slate-500">Pick a date above.</p>}
      </div>
      <p class="mt-2 text-xs text-slate-500">Day names use the proleptic Gregorian calendar. ISO numbering: Monday = 1 … Sunday = 7. 🔒 Computed in your browser.</p>
    </div>
  );
}
