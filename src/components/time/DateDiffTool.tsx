import { useState } from 'preact/hooks';
import { diffDates, addToDate, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function DateDiffTool() {
  const [from, setFrom] = useState(() => toDateInputValue(new Date()));
  const [to, setTo] = useState(() => toDateInputValue(addToDate(new Date(), 30, 'days')));

  const a = fromDateInputValue(from);
  const b = fromDateInputValue(to);
  const valid = !!(a && b);
  const d = valid ? diffDates(a!, b!) : null;

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label for="dd-from" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start date</label>
          <input id="dd-from" type="date" value={from} onInput={(e) => setFrom((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
        <div>
          <label for="dd-to" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End date</label>
          <input id="dd-to" type="date" value={to} onInput={(e) => setTo((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {valid && d ? (
          <>
            <p class="text-2xl font-extrabold text-slate-900">
              {d.totalDays.toLocaleString()} <span class="text-base font-semibold text-slate-500">days</span>
            </p>
            <div class="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Weekdays (Mon–Fri)</span><span class="font-mono font-bold text-slate-900">{d.weekdays.toLocaleString()}</span></div>
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Weekend days</span><span class="font-mono font-bold text-slate-900">{d.weekendDays.toLocaleString()}</span></div>
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Weeks + days</span><span class="font-mono font-bold text-slate-900">{d.totalWeeks}w {d.remainderDays}d</span></div>
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Calendar breakdown</span><span class="font-bold text-slate-900">{d.years}y {d.months}m {d.days}d</span></div>
            </div>
            <p class="mt-3 text-xs text-slate-500">End date excluded (elapsed days). Weekday count doesn't subtract public holidays.</p>
          </>
        ) : (
          <p class="text-sm text-slate-500">Pick two dates above.</p>
        )}
      </div>
    </div>
  );
}
