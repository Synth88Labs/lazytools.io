import { useMemo, useState } from 'preact/hooks';
import { layoverMinutes, hoursMinutes, MIN_CONNECTION_MIN } from '../../lib/travel';

type Kind = 'domestic' | 'international' | 'mixed';

export default function LayoverTool() {
  const [arr, setArr] = useState('14:20');
  const [dep, setDep] = useState('16:05');
  const [nextDay, setNextDay] = useState(false);
  const [kind, setKind] = useState<Kind>('domestic');

  const r = useMemo(() => {
    const mins = layoverMinutes(arr, dep, nextDay);
    if (mins == null) return null;
    const min = MIN_CONNECTION_MIN[kind];
    return { mins, hm: hoursMinutes(Math.abs(mins)), negative: mins < 0, min, ok: mins >= min, margin: mins - min };
  }, [arr, dep, nextDay, kind]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Arrival time</span>
          <input type="time" value={arr} onInput={(e) => setArr((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Next departure</span>
          <input type="time" value={dep} onInput={(e) => setDep((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Connection type</span>
          <select class={sel} value={kind} onChange={(e) => setKind((e.target as HTMLSelectElement).value as Kind)}>
            <option value="domestic">Domestic → domestic</option>
            <option value="international">International</option>
            <option value="mixed">Domestic ↔ international</option>
          </select></label>
      </div>
      <label class="mt-3 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={nextDay} onChange={(e) => setNextDay((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
        Departure is the next day (after midnight)
      </label>

      {r ? (
        <div class="mt-4">
          <div class={`rounded-xl p-4 text-center ring-2 ${r.negative ? 'bg-rose-50 ring-rose-200' : r.ok ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200'}`}>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Layover</p>
            <p class={`mt-1 text-3xl font-extrabold ${r.negative ? 'text-rose-700' : r.ok ? 'text-emerald-700' : 'text-amber-700'}`}>{r.negative ? '−' : ''}{r.hm.h} h {r.hm.m} m</p>
            <p class="mt-2 text-sm font-medium text-slate-700">
              {r.negative ? 'The departure is before the arrival — check the times (or tick "next day").'
                : r.ok ? `Comfortable — about ${Math.floor(r.margin / 60)} h ${r.margin % 60} m above the typical ${r.min}-minute minimum.`
                : `Tight — below the typical ${r.min}-minute minimum connection time for this type.`}
            </p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the arrival and next-departure times.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Minimum connection times vary a lot by airport, terminal and whether you re-clear security or immigration; the figures here (domestic ~45 min, international ~90 min) are rough safety floors, not guarantees. On a single ticket the airline protects you if a delay makes you miss a legal connection; on separate tickets you don't have that protection, so leave much more time. 🔒 In your browser.</p>
    </div>
  );
}
