import { useMemo, useState } from 'preact/hooks';
import { quarterMileET, quarterMileMph } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function QuarterMileTool() {
  const [hp, setHp] = useState('300');
  const [weight, setWeight] = useState('3300');
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');

  const r = useMemo(() => {
    const p = num(hp), w = num(weight);
    if (p == null || w == null) return null;
    const lb = unit === 'lb' ? w : w * 2.2046226218;
    const et = quarterMileET(p, lb), mph = quarterMileMph(p, lb);
    if (et == null || mph == null) return null;
    return { et, mph, kmh: mph * 1.609344 };
  }, [hp, weight, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['lb', 'kg'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>{u}</button>)}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Power (hp at the wheels or crank)</span>
          <input type="number" step="any" value={hp} onInput={(e) => setHp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight ({unit}, with driver)</span>
          <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated 1/4-mile ET</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.et, 2)} <span class="text-lg text-slate-500">sec</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Trap speed</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.mph)} <span class="text-lg text-slate-500">mph</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.kmh)} km/h</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter power and weight.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Estimates from the classic empirical drag-racing formulas: ET ≈ 5.825 × (weight ÷ hp)^⅓ and trap speed ≈ 234 × (hp ÷ weight)^⅓ (pounds and horsepower). These assume a well-set-up rear-drive car with good traction — real times depend heavily on tyres, gearing, launch and aero, so treat them as a ballpark. 🔒 In your browser.</p>
    </div>
  );
}
