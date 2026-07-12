import { useMemo, useState } from 'preact/hooks';
import { flightTimeMinutes, hoursMinutes, KM_PER_MILE } from '../../lib/travel';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function FlightTimeTool() {
  const [dist, setDist] = useState('5550');
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [speed, setSpeed] = useState('830');

  const r = useMemo(() => {
    const d = num(dist), s = num(speed);
    if (d == null || s == null) return null;
    const km = unit === 'mi' ? d * KM_PER_MILE : d;
    const speedKmh = unit === 'mi' ? s * KM_PER_MILE : s;
    const air = hoursMinutes((km / speedKmh) * 60);
    const total = hoursMinutes(flightTimeMinutes(km, speedKmh));
    return { air, total };
  }, [dist, unit, speed]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block sm:col-span-1"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</span>
          <div class="flex gap-2">
            <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} />
            <select class={sel} value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'km' | 'mi')}><option value="km">km</option><option value="mi">mi</option></select>
          </div>
        </label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cruise speed ({unit}/h)</span>
          <input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated total time</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.total.h} h {r.total.m} m</p><p class="mt-0.5 text-xs text-slate-500">incl. ~30 min taxi / climb / descent</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Time in the air (cruise only)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.air.h} h {r.air.m} m</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a distance and cruise speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A rough estimate: cruise time is distance ÷ speed, plus about 30 minutes for taxi, climb, descent and approach. A typical jetliner cruises near 830 km/h (≈515 mph), but real ground speed swings ±100 km/h or more with head- and tail-winds — which is why the same route differs by direction. 🔒 In your browser.</p>
    </div>
  );
}
