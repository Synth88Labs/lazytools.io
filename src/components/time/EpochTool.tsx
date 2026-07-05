import { useState } from 'preact/hooks';
import { parseEpoch } from '../../lib/time-compute';

export default function EpochTool() {
  const [epoch, setEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [dateStr, setDateStr] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });

  const parsed = parseEpoch(epoch);
  const fromDate = dateStr ? new Date(dateStr) : null;
  const fromDateValid = fromDate && !Number.isNaN(fromDate.getTime());

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const rowCls = 'flex items-baseline justify-between gap-3 border-b border-slate-100 py-2 last:border-0';
  const valCls = 'font-mono text-sm font-semibold text-slate-900 text-right break-all';
  const keyCls = 'shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div class="grid gap-4 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
        <h2 class="text-sm font-bold text-slate-900">Timestamp → date</h2>
        <label for="ep-in" class="mt-3 mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unix timestamp</label>
        <input id="ep-in" type="text" inputMode="numeric" value={epoch} onInput={(e) => setEpoch((e.target as HTMLInputElement).value)} class={inputCls} />
        <button type="button" onClick={() => setEpoch(String(Math.floor(Date.now() / 1000)))} class="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
          Use current time
        </button>
        <div class="mt-3 rounded-xl border border-brand-100 bg-white px-4 py-2" aria-live="polite">
          {parsed ? (
            <>
              <div class={rowCls}><span class={keyCls}>Detected as</span><span class={valCls}>{parsed.unit}</span></div>
              <div class={rowCls}><span class={keyCls}>Your local time</span><span class={valCls}>{parsed.date.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'medium' })}</span></div>
              <div class={rowCls}><span class={keyCls}>UTC</span><span class={valCls}>{parsed.date.toUTCString()}</span></div>
              <div class={rowCls}><span class={keyCls}>ISO 8601</span><span class={valCls}>{parsed.date.toISOString()}</span></div>
            </>
          ) : (
            <p class="py-2 text-sm text-slate-500">Enter a whole number — e.g. 1720224000 (seconds) or 1720224000000 (ms).</p>
          )}
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
        <h2 class="text-sm font-bold text-slate-900">Date → timestamp</h2>
        <label for="ep-date" class="mt-3 mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Local date & time</label>
        <input id="ep-date" type="datetime-local" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)} class={inputCls} />
        <div class="mt-3 rounded-xl border border-brand-100 bg-white px-4 py-2" aria-live="polite">
          {fromDateValid ? (
            <>
              <div class={rowCls}><span class={keyCls}>Unix seconds</span><span class={valCls}>{Math.floor(fromDate!.getTime() / 1000)}</span></div>
              <div class={rowCls}><span class={keyCls}>Milliseconds</span><span class={valCls}>{fromDate!.getTime()}</span></div>
              <div class={rowCls}><span class={keyCls}>ISO 8601 (UTC)</span><span class={valCls}>{fromDate!.toISOString()}</span></div>
            </>
          ) : (
            <p class="py-2 text-sm text-slate-500">Pick a date and time above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
