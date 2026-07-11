import { useMemo, useState } from 'preact/hooks';
import { riegel, fmtDuration, fmtPace } from '../../lib/fitness';

const M_PER_MILE = 1609.344;
function parseClock(s: string): number | null {
  const t = s.trim(); if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t) * 60;
  const parts = t.split(':').map((x) => parseFloat(x));
  if (parts.some((x) => !isFinite(x))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

const DISTANCES: { label: string; m: number }[] = [
  { label: '5K', m: 5000 }, { label: '10K', m: 10000 },
  { label: 'Half marathon', m: 21097.5 }, { label: 'Marathon', m: 42195 },
  { label: '1 mile', m: M_PER_MILE }, { label: '15K', m: 15000 },
];

export default function RaceTimePredictorTool() {
  const [knownDist, setKnownDist] = useState('5000');
  const [knownTime, setKnownTime] = useState('25:00');

  const r = useMemo(() => {
    const d1 = num(knownDist);
    const t1 = parseClock(knownTime);
    if (d1 == null || t1 == null) return null;
    return DISTANCES.map((d) => {
      const t2 = riegel(t1, d1, d.m);
      if (t2 == null) return null;
      return { label: d.label, m: d.m, time: t2, secPerKm: t2 / (d.m / 1000) };
    }).filter((x): x is NonNullable<typeof x> => x != null);
  }, [knownDist, knownTime]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">A recent race distance</span>
          <select value={knownDist} onChange={(e) => setKnownDist((e.target as HTMLSelectElement).value)} class={sel}>
            {DISTANCES.map((d) => <option value={d.m}>{d.label}</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Your time (h:mm:ss)</span>
          <input value={knownTime} onInput={(e) => setKnownTime((e.target as HTMLInputElement).value)} class={inp} placeholder="25:00" /></label>
      </div>

      {r ? (
        <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <table class="w-full text-sm">
            <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Distance</th><th class="px-4 py-2 text-right">Predicted time</th><th class="px-4 py-2 text-right">Pace</th></tr></thead>
            <tbody>{r.map((row, i) => (
              <tr class={`${i % 2 ? 'bg-slate-50' : ''} ${String(row.m) === knownDist ? 'bg-brand-50/60' : ''}`}>
                <td class="px-4 py-2 font-semibold text-slate-700">{row.label}{String(row.m) === knownDist ? ' (entered)' : ''}</td>
                <td class="px-4 py-2 text-right font-mono font-bold text-brand-800">{fmtDuration(row.time)}</td>
                <td class="px-4 py-2 text-right font-mono text-slate-500">{fmtPace(row.secPerKm, 'km')}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick a distance you've raced and enter your time.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Uses Peter Riegel's formula: predicted time = known time × (new distance ÷ known distance)^1.06. Most accurate between distances within a similar range, and it assumes equivalent training and effort. 🔒 In your browser.</p>
    </div>
  );
}
