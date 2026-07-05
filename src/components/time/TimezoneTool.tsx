import { useState } from 'preact/hooks';
import { TIMEZONES, zonedTimeToUtc, formatInZone, toDateInputValue } from '../../lib/time-compute';

export default function TimezoneTool() {
  const [dateStr, setDateStr] = useState(() => toDateInputValue(new Date()));
  const [timeStr, setTimeStr] = useState('09:00');
  const [fromZone, setFromZone] = useState('America/New_York');
  const [toZone, setToZone] = useState('Asia/Kathmandu');

  const instant = dateStr && timeStr ? zonedTimeToUtc(dateStr, timeStr, fromZone) : null;
  const source = instant ? formatInZone(instant, fromZone) : null;
  const target = instant ? formatInZone(instant, toZone) : null;

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const zoneSelect = (id: string, value: string, set: (v: string) => void, label: string) => (
    <div>
      <label for={id} class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <select id={id} value={value} onChange={(e) => set((e.target as HTMLSelectElement).value)} class={inputCls}>
        {TIMEZONES.map((z) => (
          <option value={z.id}>{z.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <div>
          <label for="tz-date" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</label>
          <input id="tz-date" type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
        <div>
          <label for="tz-time" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time</label>
          <input id="tz-time" type="time" value={timeStr} onInput={(e) => setTimeStr((e.target as HTMLInputElement).value)} class={inputCls} />
        </div>
        {zoneSelect('tz-from', fromZone, setFromZone, 'From zone')}
        {zoneSelect('tz-to', toZone, setToZone, 'To zone')}
      </div>

      <button
        type="button"
        onClick={() => { setFromZone(toZone); setToZone(fromZone); }}
        class="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
      >
        ⇄ Swap zones
      </button>

      <div class="mt-4 grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div class="rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{TIMEZONES.find((z) => z.id === fromZone)?.label}</p>
          <p class="mt-1 text-lg font-bold text-slate-900">{source?.formatted ?? '—'}</p>
          <p class="text-xs font-medium text-slate-500">{source?.offset}</p>
        </div>
        <div class="rounded-xl border border-brand-200 bg-brand-50 p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-brand-700">{TIMEZONES.find((z) => z.id === toZone)?.label}</p>
          <p class="mt-1 text-lg font-bold text-brand-900">{target?.formatted ?? '—'}</p>
          <p class="text-xs font-medium text-brand-700">{target?.offset}</p>
        </div>
      </div>
      <p class="mt-2 text-xs text-slate-500">DST applied automatically from the browser's IANA timezone database — works offline.</p>
    </div>
  );
}
