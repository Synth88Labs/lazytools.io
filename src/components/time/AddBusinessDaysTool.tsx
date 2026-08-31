import { useState } from 'preact/hooks';
import { addBusinessDays, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function AddBusinessDaysTool() {
  const [dateStr, setDateStr] = useState(() => toDateInputValue(new Date()));
  const [countStr, setCountStr] = useState('10');
  const start = fromDateInputValue(dateStr);
  const n = parseInt(countStr, 10);
  const result = start && Number.isFinite(n) ? addBusinessDays(start, n) : null;

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start date</span>
          <input type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Business days to add (negative to subtract)</span>
          <input type="number" value={countStr} onInput={(e) => setCountStr((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {result ? (
          <>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{n >= 0 ? `${n} business day${n === 1 ? '' : 's'} after` : `${-n} business day${n === -1 ? '' : 's'} before`}</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(result)}</p>
          </>
        ) : <p class="text-sm text-slate-500">Enter a start date and a whole number of business days.</p>}
      </div>
      <p class="mt-2 text-xs text-slate-500">Counts only Monday, Friday, skipping Saturdays and Sundays; the start day itself isn’t counted. Public holidays aren’t excluded, check your local calendar for those. 🔒 Computed in your browser.</p>
    </div>
  );
}
