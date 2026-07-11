import { useMemo, useState } from 'preact/hooks';
import { waterIntakeMl } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString();

export default function WaterIntakeTool() {
  const [pet, setPet] = useState<'dog' | 'cat'>('dog');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('15');

  const r = useMemo(() => {
    const w = num(weight);
    if (w == null) return null;
    const kg = unit === 'kg' ? w : w * 0.45359237;
    // guideline: ~50 ml/kg/day baseline, up to ~60 for active dogs
    const lo = waterIntakeMl(kg, pet === 'dog' ? 50 : 45);
    const hi = waterIntakeMl(kg, pet === 'dog' ? 60 : 55);
    return { lo, hi, cupsLo: lo / 236.588, cupsHi: hi / 236.588 };
  }, [pet, unit, weight]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {([['dog', '🐕 Dog'], ['cat', '🐈 Cat']] as const).map(([p, lbl]) => (
          <button onClick={() => setPet(p)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${pet === p ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
        <span class="mx-1 self-center text-slate-300">|</span>
        {(['kg', 'lb'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u}</button>
        ))}
      </div>
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight ({unit})</span>
        <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Water per day</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.lo)}–{fmt(r.hi)} <span class="text-lg text-slate-500">ml</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In cups (US)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.cupsLo, 1)}–{fmt(r.cupsHi, 1)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your pet's weight.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A rough guideline of about 50–60 ml per kg of body weight per day (dogs) — wet food, heat and exercise raise it. Persistent big changes in drinking (much more or much less) can signal a health issue; check with your vet. 🔒 In your browser.</p>
    </div>
  );
}
