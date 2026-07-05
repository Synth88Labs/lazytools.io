import { useState } from 'preact/hooks';
import { diffDates, addToDate, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function AgeTool() {
  const [dob, setDob] = useState('1990-01-01');
  const [asOf, setAsOf] = useState(() => toDateInputValue(new Date()));

  const birth = fromDateInputValue(dob);
  const at = fromDateInputValue(asOf);
  const valid = birth && at && birth <= at;
  const d = valid ? diffDates(birth!, at!) : null;

  // Next birthday relative to the "as of" date
  let nextBday: Date | null = null;
  let daysToBday = 0;
  if (valid) {
    nextBday = addToDate(birth!, d!.years + 1, 'years');
    daysToBday = diffDates(at!, nextBday).totalDays;
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label for="age-dob" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date of birth</label>
          <input id="age-dob" type="date" value={dob} onInput={(e) => setDob((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
        <div>
          <label for="age-at" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Age at (defaults to today)</label>
          <input id="age-at" type="date" value={asOf} onInput={(e) => setAsOf((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {valid && d ? (
          <>
            <p class="text-2xl font-extrabold text-slate-900">
              {d.years} <span class="text-base font-semibold text-slate-500">years</span>{' '}
              {d.months} <span class="text-base font-semibold text-slate-500">months</span>{' '}
              {d.days} <span class="text-base font-semibold text-slate-500">days</span>
            </p>
            <div class="mt-3 grid gap-2 text-sm sm:grid-cols-3">
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Total days lived</span><span class="font-mono font-bold text-slate-900">{d.totalDays.toLocaleString()}</span></div>
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Total weeks</span><span class="font-mono font-bold text-slate-900">{d.totalWeeks.toLocaleString()}</span></div>
              <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Next birthday</span><span class="font-bold text-slate-900">{daysToBday === 0 ? '🎉 Today!' : `in ${daysToBday} days`}</span></div>
            </div>
          </>
        ) : (
          <p class="text-sm text-slate-500">Enter a date of birth on or before the "age at" date.</p>
        )}
      </div>
      <p class="mt-2 text-xs text-slate-500">Calculated on your device — your birthdate is never transmitted.</p>
    </div>
  );
}
