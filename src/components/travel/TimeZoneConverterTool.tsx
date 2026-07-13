import { useMemo, useState } from 'preact/hooks';
import { addMinutesToClock, timeZoneDelta } from '../../lib/travel';

// UTC offsets from −12 to +14 (including the common half-hour zones).
const OFFSETS = [-12, -11, -10, -9.5, -9, -8, -7, -6, -5, -4, -3.5, -3, -2, -1, 0, 1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 8.75, 9, 9.5, 10, 10.5, 11, 12, 12.75, 13, 14];
const label = (o: number) => `UTC${o >= 0 ? '+' : '−'}${Number.isInteger(Math.abs(o)) ? Math.abs(o) : Math.abs(o).toString()}`;

export default function TimeZoneConverterTool() {
  const [time, setTime] = useState('14:30');
  const [from, setFrom] = useState(-5);
  const [to, setTo] = useState(0);

  const r = useMemo(() => {
    const res = addMinutesToClock(time, Math.round((to - from) * 60));
    if (!res) return null;
    const delta = timeZoneDelta(from, to);
    return { ...res, delta };
  }, [time, from, to]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';
  const dayLabel = (d: number) => d === 0 ? 'same day' : d === 1 ? 'next day' : d === -1 ? 'previous day' : `${d > 0 ? '+' : ''}${d} days`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time (24-hour, HH:MM)</span>
          <input type="text" value={time} onInput={(e) => setTime((e.target as HTMLInputElement).value)} placeholder="14:30" class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">From zone</span>
          <select value={from} onChange={(e) => setFrom(parseFloat((e.target as HTMLSelectElement).value))} class={sel}>{OFFSETS.map((o) => <option value={o}>{label(o)}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">To zone</span>
          <select value={to} onChange={(e) => setTo(parseFloat((e.target as HTMLSelectElement).value))} class={sel}>{OFFSETS.map((o) => <option value={o}>{label(o)}</option>)}</select></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Time in {label(to)}</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{r.time}</p>
          <p class="mt-1 text-xs text-slate-400">{dayLabel(r.dayOffset)} · {r.delta.direction === 'same' ? 'same time zone' : `${r.delta.zones} h ${r.delta.direction}`}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a valid 24-hour time like 09:15.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Converts a clock time between UTC offsets — enter the time, pick the source and destination zones, and the result shows the local time plus whether it lands on the previous, same or next day. This uses fixed UTC offsets, so for a specific date check whether daylight saving time is in effect at either end. 🔒 In your browser.</p>
    </div>
  );
}
