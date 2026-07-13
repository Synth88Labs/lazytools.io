import { useState } from 'preact/hooks';
import { timeBetween } from '../../lib/time-compute';

export default function TimeDurationTool() {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:30');
  const [breakMin, setBreakMin] = useState('0');

  const r = timeBetween(start, end);
  const brk = Math.max(0, parseInt(breakMin, 10) || 0);
  const net = r ? Math.max(0, r.totalMinutes - brk) : 0;
  const overnight = r ? end < start : false;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const fmtHM = (mins: number) => `${Math.floor(mins / 60)} h ${mins % 60} m`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start time</span>
          <input type="time" value={start} onInput={(e) => setStart((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End time</span>
          <input type="time" value={end} onInput={(e) => setEnd((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Break (minutes)</span>
          <input type="number" min="0" step="5" value={breakMin} onInput={(e) => setBreakMin((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration{brk > 0 ? ' (after break)' : ''}</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtHM(net)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Decimal hours</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{Number((net / 60).toFixed(2))}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total minutes</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{net.toLocaleString()}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a start and end time (24-hour).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Gives the time elapsed from start to end. {overnight ? 'The end time is earlier than the start, so it\'s treated as the next day (an overnight shift). ' : ''}Subtract an unpaid break to get worked hours, and read the decimal hours (e.g., 8 h 30 m = 8.5) straight into a timesheet or payroll. 🔒 In your browser.</p>
    </div>
  );
}
