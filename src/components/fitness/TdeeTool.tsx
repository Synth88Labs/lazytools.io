import { useMemo, useState } from 'preact/hooks';
import { bmrMifflin, tdee, ACTIVITY_FACTORS, type Sex } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Math.round(x).toLocaleString();

export default function TdeeTool() {
  const [sex, setSex] = useState<Sex>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState('80');
  const [height, setHeight] = useState('180');
  const [age, setAge] = useState('30');
  const [activity, setActivity] = useState('moderate');

  const r = useMemo(() => {
    const w = num(weight), h = num(height), a = num(age);
    if (w == null || h == null || a == null) return null;
    const kg = unit === 'metric' ? w : w * 0.45359237;
    const cm = unit === 'metric' ? h : h * 2.54;
    const bmr = bmrMifflin(sex, kg, cm, a);
    if (bmr == null) return null;
    const af = ACTIVITY_FACTORS.find((x) => x.id === activity)!;
    const total = tdee(bmr, af.factor);
    return { bmr, total, lose: total - 500, gain: total + 500 };
  }, [sex, unit, weight, height, age, activity]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {(['male', 'female'] as const).map((s) => <button onClick={() => setSex(s)} class={tog(sex === s)}>{s === 'male' ? '♂ Male' : '♀ Female'}</button>)}
        <span class="mx-1 self-center text-slate-300">|</span>
        {(['metric', 'imperial'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>{u === 'metric' ? 'kg / cm' : 'lb / in'}</button>)}
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight ({unit === 'metric' ? 'kg' : 'lb'})</span>
          <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Height ({unit === 'metric' ? 'cm' : 'in'})</span>
          <input type="number" step="any" value={height} onInput={(e) => setHeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Age</span>
          <input type="number" step="any" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Activity</span>
          <select value={activity} onChange={(e) => setActivity((e.target as HTMLSelectElement).value)} class={sel}>{ACTIVITY_FACTORS.map((a) => <option value={a.id}>{a.label}</option>)}</select></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">BMR (at rest)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.bmr)} <span class="text-base text-slate-500">kcal/day</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">TDEE (maintenance)</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.total)} <span class="text-base text-slate-500">kcal/day</span></p></div>
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2 text-center text-sm">
            <div class="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">Lose ~0.5 kg/wk: <strong>{fmt(r.lose)}</strong> kcal</div>
            <div class="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200">Gain ~0.5 kg/wk: <strong>{fmt(r.gain)}</strong> kcal</div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your weight, height and age.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">BMR (basal metabolic rate) is the energy you\'d burn at complete rest, from the Mifflin-St Jeor equation. TDEE (total daily energy expenditure) multiplies it by an activity factor (1.2–1.9). A deficit of ~500 kcal/day is a common target for ~0.5 kg (1 lb) per week. These are population-average estimates — real needs vary, so adjust based on results and consult a professional for a plan. 🔒 In your browser.</p>
    </div>
  );
}
