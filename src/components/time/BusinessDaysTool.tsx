import { useState } from 'preact/hooks';
import { businessDays, toDateInputValue, addToDate } from '../../lib/time-compute';

export default function BusinessDaysTool() {
  const [from, setFrom] = useState(() => toDateInputValue(new Date()));
  const [to, setTo] = useState(() => toDateInputValue(addToDate(new Date(), 14, 'days')));
  const [holidays, setHolidays] = useState('0');

  const h = Math.max(0, parseInt(holidays, 10) || 0);
  const r = from && to ? businessDays(from, to, h) : null;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start date</span>
          <input type="date" value={from} onInput={(e) => setFrom((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End date</span>
          <input type="date" value={to} onInput={(e) => setTo((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Public holidays (weekdays)</span>
          <input type="number" min="0" step="1" value={holidays} onInput={(e) => setHolidays((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Business days</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.businessDays.toLocaleString()}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekdays (Mon–Fri)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.weekdays.toLocaleString()}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekend days</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.weekendDays.toLocaleString()}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total days</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.totalDays.toLocaleString()}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a start and end date.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Counts working days (Monday–Friday) from the start date to the end date, <strong>including both</strong> — useful for project deadlines, delivery estimates and leave. Weekends are excluded automatically; enter the number of public holidays that fall on weekdays in the range to subtract them (this tool doesn't know your country's holiday calendar). 🔒 In your browser.</p>
    </div>
  );
}
