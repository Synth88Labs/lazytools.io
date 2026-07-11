import { useMemo, useState } from 'preact/hooks';
import { ACTIVITIES, getActivity, caloriesBurned } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Math.round(x).toLocaleString();

export default function CaloriesBurnedTool() {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('70');
  const [minutes, setMinutes] = useState('30');
  const [activity, setActivity] = useState('run-6');

  const r = useMemo(() => {
    const w = num(weight), min = num(minutes);
    const act = getActivity(activity);
    if (w == null || min == null || !act) return null;
    const kg = unit === 'kg' ? w : w * 0.45359237;
    const kcal = caloriesBurned(act.met, kg, min);
    return { kcal, met: act.met, perMin: kcal / min };
  }, [weight, minutes, activity, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Activity</span>
        <select value={activity} onChange={(e) => setActivity((e.target as HTMLSelectElement).value)} class={sel}>
          {ACTIVITIES.map((a) => <option value={a.id}>{a.name} — {a.met} MET</option>)}
        </select></label>
      <div class="mt-3 flex gap-2">
        {(['kg', 'lb'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u}</button>
        ))}
      </div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Body weight ({unit})</span>
          <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Duration (minutes)</span>
          <input type="number" step="any" value={minutes} onInput={(e) => setMinutes((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Calories burned</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.kcal)} <span class="text-lg text-slate-500">kcal</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rate</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.perMin.toFixed(1)} kcal/min</p><p class="mt-1 text-xs text-slate-400">at {r.met} MET</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Pick an activity and enter your weight and duration.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Uses the ACSM MET formula: kcal/min = MET × 3.5 × weight(kg) ÷ 200. MET values are representative figures from the Compendium of Physical Activities — actual burn varies with intensity, fitness and body composition, so treat this as an estimate. 🔒 In your browser.</p>
    </div>
  );
}
