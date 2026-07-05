import { useState } from 'preact/hooks';
import { addToDate, toDateInputValue, fromDateInputValue } from '../../lib/time-compute';

export default function DateAddTool() {
  const [base, setBase] = useState(() => toDateInputValue(new Date()));
  const [amount, setAmount] = useState(90);
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [direction, setDirection] = useState<'after' | 'before'>('after');

  const baseDate = fromDateInputValue(base);
  const result = baseDate ? addToDate(baseDate, direction === 'after' ? amount : -amount, unit) : null;

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <div>
          <label for="da-amount" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</label>
          <input id="da-amount" type="number" min={0} max={10000} value={amount} onInput={(e) => setAmount(parseInt((e.target as HTMLInputElement).value, 10) || 0)} class={inputCls} />
        </div>
        <div>
          <label for="da-unit" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unit</label>
          <select id="da-unit" value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as typeof unit)} class={inputCls}>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
        <div>
          <label for="da-dir" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Direction</label>
          <select id="da-dir" value={direction} onChange={(e) => setDirection((e.target as HTMLSelectElement).value as typeof direction)} class={inputCls}>
            <option value="after">After (add)</option>
            <option value="before">Before (subtract)</option>
          </select>
        </div>
        <div>
          <label for="da-base" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start date</label>
          <input id="da-base" type="date" value={base} onInput={(e) => setBase((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
        {result ? (
          <>
            <p class="text-sm text-slate-600">
              {amount} {unit} {direction} {baseDate!.toLocaleDateString(undefined, { dateStyle: 'long' })} is
            </p>
            <p class="mt-1 text-2xl font-extrabold text-slate-900">
              {result.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </>
        ) : (
          <p class="text-sm text-slate-500">Pick a start date above.</p>
        )}
      </div>
      <p class="mt-2 text-xs text-slate-500">Months clamp to month-end: 31 Jan + 1 month = last day of February.</p>
    </div>
  );
}
