import { useMemo, useState } from 'preact/hooks';
import { epley1RM, brzycki1RM, lombardi1RM, repWeight } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

export default function OneRepMaxTool() {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('100');
  const [reps, setReps] = useState('5');

  const r = useMemo(() => {
    const w = num(weight), reps_ = num(reps);
    if (w == null || reps_ == null || reps_ < 1) return null;
    const e = epley1RM(w, reps_);
    const b = brzycki1RM(w, reps_);
    const l = lombardi1RM(w, reps_);
    const vals = [e, b, l].filter((x): x is number => x != null);
    const avg = vals.reduce((s, x) => s + x, 0) / vals.length;
    const pctReps = [1, 2, 3, 5, 8, 10, 12, 15];
    const table = pctReps.map((n) => ({ reps: n, weight: repWeight(avg, n), pct: (repWeight(avg, n) / avg) * 100 }));
    return { epley: e, brzycki: b, lombardi: l, avg, table };
  }, [weight, reps]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['kg', 'lb'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight lifted ({unit})</span>
          <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reps performed</span>
          <input type="number" step="1" value={reps} onInput={(e) => setReps((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated 1-rep max</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.avg)} <span class="text-lg text-slate-500">{unit}</span></p>
            <p class="mt-1 text-xs text-slate-400">Epley {fmt(r.epley)} · Brzycki {r.brzycki ? fmt(r.brzycki) : '—'} · Lombardi {fmt(r.lombardi)} {unit}</p>
          </div>
          <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-4 py-2">Reps</th><th class="px-4 py-2 text-right">% of 1RM</th><th class="px-4 py-2 text-right">Weight</th></tr></thead>
              <tbody>{r.table.map((row, i) => (
                <tr class={i % 2 ? 'bg-slate-50' : ''}><td class="px-4 py-1.5 font-mono">{row.reps}</td><td class="px-4 py-1.5 text-right font-mono">{fmt(row.pct)}%</td><td class="px-4 py-1.5 text-right font-mono font-semibold text-slate-800">{fmt(row.weight)} {unit}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the weight and reps of a set (works best for 1–10 reps).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Averages the Epley (w × (1 + reps⁄30)), Brzycki (w × 36⁄(37−reps)) and Lombardi (w × reps^0.1) estimates. Accuracy drops above ~10 reps. Estimates only — lift within your ability and use a spotter. 🔒 In your browser.</p>
    </div>
  );
}
