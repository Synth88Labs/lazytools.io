import { useMemo, useState } from 'preact/hooks';
import { roadTrip, hoursMinutes, addMinutesToClock } from '../../lib/travel';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const numz = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };

export default function RoadTripTool() {
  const [dist, setDist] = useState('600');
  const [speed, setSpeed] = useState('100');
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [brk, setBrk] = useState('30');
  const [start, setStart] = useState('08:00');

  const r = useMemo(() => {
    const d = num(dist), s = num(speed), b = numz(brk);
    if (d == null || s == null || b == null) return null;
    const rt = roadTrip(d, s, b);
    if (!rt) return null;
    const arr = start ? addMinutesToClock(start, rt.totalMin) : null;
    return { drive: hoursMinutes(rt.drivingMin), total: hoursMinutes(rt.totalMin), arr };
  }, [dist, speed, brk, start]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</span>
          <div class="flex gap-2">
            <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} />
            <select class={sel} value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'km' | 'mi')}><option value="km">km</option><option value="mi">mi</option></select>
          </div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average speed ({unit}/h)</span>
          <input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total break time (min)</span>
          <input type="number" step="any" value={brk} onInput={(e) => setBrk((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Departure time (optional)</span>
          <input type="time" value={start} onInput={(e) => setStart((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total trip time</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.total.h} h {r.total.m} m</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Driving only</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.drive.h} h {r.drive.m} m</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Arrival</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.arr ? r.arr.time : '—'}{r.arr && r.arr.dayOffset > 0 ? <span class="text-sm font-medium text-slate-500"> +{r.arr.dayOffset}d</span> : null}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the distance and your average speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Driving time is distance ÷ average speed, plus the breaks you add. Use a realistic <em>average</em> speed — well below the limit once you allow for towns, traffic, fuel stops and slow stretches — for a trustworthy arrival time. 🔒 In your browser.</p>
    </div>
  );
}
