import { useMemo, useState } from 'preact/hooks';
import { moonPhase } from '../../lib/astronomy';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function MoonPhaseTool() {
  const [dateStr, setDateStr] = useState(todayStr());

  const r = useMemo(() => {
    const d = new Date(dateStr + 'T12:00:00Z');
    if (isNaN(d.getTime())) return null;
    return moonPhase(d);
  }, [dateStr]);

  const inp = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Date</span>
        <input type="date" value={dateStr} onInput={(e) => setDateStr((e.target as HTMLInputElement).value)} class={inp} /></label>

      {r ? (
        <>
          <div class="mt-4 flex flex-col items-center">
            <div class="text-7xl" aria-hidden="true">{r.emoji}</div>
            <p class="mt-2 text-2xl font-extrabold text-brand-800">{r.phaseName}</p>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Illumination</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{Math.round(r.illumination * 100)}%</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Moon age</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.ageDays.toFixed(1)} <span class="text-base text-slate-500">days</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Next full / new</p><p class="mt-1 text-lg font-extrabold text-slate-700">{Math.round(r.nextFull)}d / {Math.round(r.nextNew)}d</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a date.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The moon cycles through its phases every 29.53 days (the synodic month). Illumination is the lit fraction of the disc you see. Computed from the mean synodic period anchored to a known new moon — accurate to within a few hours, which is plenty for the phase. 🔒 In your browser.</p>
    </div>
  );
}
