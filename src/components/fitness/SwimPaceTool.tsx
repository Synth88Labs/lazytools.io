import { useMemo, useState } from 'preact/hooks';
import { swimPace } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const paceStr = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function SwimPaceTool() {
  const [dist, setDist] = useState('1500');
  const [unit, setUnit] = useState<'m' | 'yd'>('m');
  const [mm, setMm] = useState('30');
  const [ss, setSs] = useState('00');

  const r = useMemo(() => {
    const d = num(dist), m = num(mm), s = num(ss);
    if (d == null || m == null || s == null) return null;
    const meters = unit === 'm' ? d : d * 0.9144;
    const totalSec = m * 60 + s;
    return swimPace(meters, totalSec);
  }, [dist, unit, mm, ss]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance swum</span>
          <div class="flex gap-1"><input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'm' | 'yd')} class={sel}><option value="m">metres</option><option value="yd">yards</option></select></div></label>
        <div><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time (min : sec)</span>
          <div class="flex items-center gap-1">
            <input type="number" min="0" value={mm} onInput={(e) => setMm((e.target as HTMLInputElement).value)} class={inp} />
            <span class="font-bold text-slate-400">:</span>
            <input type="number" min="0" max="59" value={ss} onInput={(e) => setSs((e.target as HTMLInputElement).value)} class={inp} />
          </div></div>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pace / 100 m</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{paceStr(r.per100m)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pace / 100 yd</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{paceStr(r.per100yd)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Speed</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.speedMs)} m/s</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the distance and your time.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Swim pace is usually expressed per 100 metres (long-course/metric pools) or per 100 yards (US yard pools). It\'s the total time divided by the distance, scaled to 100. Comparing your per-100 pace across sets and sessions is the simplest way to track swim fitness. 🔒 In your browser.</p>
    </div>
  );
}
