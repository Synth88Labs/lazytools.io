import { useMemo, useState } from 'preact/hooks';
import { pace, distanceFromPace, timeFromPace, fmtDuration, fmtPace } from '../../lib/fitness';

const M_PER_MILE = 1609.344;
// parse "MM:SS" or "H:MM:SS" or plain seconds/minutes
function parseClock(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t) * 60; // bare number = minutes
  const parts = t.split(':').map((x) => parseFloat(x));
  if (parts.some((x) => !isFinite(x))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

const PRESETS: { label: string; m: number }[] = [
  { label: '5K', m: 5000 }, { label: '10K', m: 10000 },
  { label: 'Half', m: 21097.5 }, { label: 'Marathon', m: 42195 },
  { label: '1 mile', m: M_PER_MILE },
];
type Solve = 'pace' | 'time' | 'distance';

export default function RunningPaceTool() {
  const [solve, setSolve] = useState<Solve>('pace');
  const [distUnit, setDistUnit] = useState<'km' | 'mi'>('km');
  const [dist, setDist] = useState('10');
  const [time, setTime] = useState('50:00');
  const [paceStr, setPaceStr] = useState('5:00');
  const [paceUnit, setPaceUnit] = useState<'km' | 'mi'>('km');

  const r = useMemo(() => {
    const distM = distUnit === 'km' ? (num(dist) ?? 0) * 1000 : (num(dist) ?? 0) * M_PER_MILE;
    const timeSec = parseClock(time);
    const paceSec = parseClock(paceStr); // per selected paceUnit
    const paceSecPerKm = paceSec == null ? null : (paceUnit === 'km' ? paceSec : paceSec / (M_PER_MILE / 1000));

    if (solve === 'pace') {
      if (!distM || timeSec == null) return null;
      const p = pace(distM, timeSec);
      return { kind: 'pace' as const, p };
    } else if (solve === 'time') {
      if (!distM || paceSecPerKm == null) return null;
      return { kind: 'time' as const, timeSec: timeFromPace(paceSecPerKm, distM) };
    } else {
      if (timeSec == null || paceSecPerKm == null) return null;
      const dm = distanceFromPace(paceSecPerKm, timeSec);
      return { kind: 'distance' as const, km: dm / 1000, miles: dm / M_PER_MILE };
    }
  }, [solve, dist, distUnit, time, paceStr, paceUnit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const seg = (active: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${active ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {([['pace', 'Find pace'], ['time', 'Find time'], ['distance', 'Find distance']] as const).map(([s, lbl]) => (
          <button onClick={() => setSolve(s)} class={seg(solve === s)}>{lbl}</button>
        ))}
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        {solve !== 'distance' && (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</span>
            <div class="flex gap-1">
              <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} />
              <select value={distUnit} onChange={(e) => setDistUnit((e.target as HTMLSelectElement).value as any)} class="rounded-xl border border-slate-300 bg-white px-2 text-sm"><option value="km">km</option><option value="mi">mi</option></select>
            </div>
          </label>
        )}
        {solve !== 'time' && (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time (h:mm:ss)</span>
            <input value={time} onInput={(e) => setTime((e.target as HTMLInputElement).value)} class={inp} placeholder="50:00" /></label>
        )}
        {solve !== 'pace' && (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pace (mm:ss)</span>
            <div class="flex gap-1">
              <input value={paceStr} onInput={(e) => setPaceStr((e.target as HTMLInputElement).value)} class={inp} placeholder="5:00" />
              <select value={paceUnit} onChange={(e) => setPaceUnit((e.target as HTMLSelectElement).value as any)} class="rounded-xl border border-slate-300 bg-white px-2 text-sm"><option value="km">/km</option><option value="mi">/mi</option></select>
            </div>
          </label>
        )}
      </div>

      {solve === 'pace' && (
        <div class="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button onClick={() => { setDist(distUnit === 'km' ? String(p.m / 1000) : String(+(p.m / M_PER_MILE).toFixed(2)) ); }} class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">{p.label}</button>
          ))}
        </div>
      )}

      {r ? (
        <div class="mt-4">
          {r.kind === 'pace' && r.p && (
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pace</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmtPace(r.p.secPerKm, 'km')}</p><p class="mt-1 text-xs text-slate-400">{fmtPace(r.p.secPerMile, 'mi')}</p></div>
              <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Speed</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p.kmh.toFixed(2)} km/h</p><p class="mt-1 text-xs text-slate-400">{r.p.mph.toFixed(2)} mph</p></div>
            </div>
          )}
          {r.kind === 'time' && (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Finish time</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmtDuration(r.timeSec)}</p></div>
          )}
          {r.kind === 'distance' && (
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.km.toFixed(2)} km</p></div>
              <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In miles</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.miles.toFixed(2)} mi</p></div>
            </div>
          )}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the two known values — times as mm:ss or h:mm:ss.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Pace = time ÷ distance. Enter a marathon time to see the pace you need to hold, or a pace to project a finish time. 🔒 In your browser.</p>
    </div>
  );
}
