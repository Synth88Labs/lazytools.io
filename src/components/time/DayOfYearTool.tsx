import { useState } from 'preact/hooks';
import { dayOfYear, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function DayOfYearTool() {
  const [dateStr, setDateStr] = useState(() => toDateInputValue(new Date()));
  const date = fromDateInputValue(dateStr);
  const r = date ? dayOfYear(date) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="doy-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</label>
      <div class="flex flex-wrap gap-2">
        <input id="doy-date" type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)}
          class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        <button type="button" onClick={() => setDateStr(toDateInputValue(new Date()))} class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">Today</button>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {r ? (
          <>
            <p class="text-3xl font-extrabold text-brand-800">Day {r.dayOfYear} <span class="text-lg font-semibold text-slate-500">of {r.daysInYear}</span></p>
            <p class="mt-1 text-sm font-medium text-slate-600">{r.weekday} · {r.daysRemaining} day{r.daysRemaining === 1 ? '' : 's'} remaining · {r.percentElapsed}% of the year elapsed</p>
            <div class="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-brand-500" style={`width:${r.percentElapsed}%`} />
            </div>
          </>
        ) : <p class="text-sm text-slate-500">Pick a date above.</p>}
      </div>
      <p class="mt-2 text-xs text-slate-500">The ordinal (day-of-year) number counts from January 1 = 1. Leap years have 366 days. 🔒 Computed in your browser.</p>
    </div>
  );
}
