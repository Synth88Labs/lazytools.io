import { useMemo, useState } from 'preact/hooks';
import { cooperVo2 } from '../../lib/fitness';

const M_PER_MILE = 1609.344;
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

// Fitness rating bands (ml/kg/min) — indicative, general adult reference.
function rating(vo2: number): string {
  if (vo2 >= 60) return 'Elite';
  if (vo2 >= 52) return 'Excellent';
  if (vo2 >= 45) return 'Good';
  if (vo2 >= 38) return 'Above average';
  if (vo2 >= 32) return 'Average';
  if (vo2 >= 25) return 'Below average';
  return 'Poor';
}

export default function Vo2MaxTool() {
  const [unit, setUnit] = useState<'m' | 'mi'>('m');
  const [dist, setDist] = useState('2400');

  const r = useMemo(() => {
    const d = num(dist);
    if (d == null) return null;
    const metres = unit === 'm' ? d : d * M_PER_MILE;
    const vo2 = cooperVo2(metres);
    if (vo2 <= 0) return null;
    return { vo2, rating: rating(vo2), metres };
  }, [dist, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-3 text-sm text-slate-600">The <strong>Cooper test</strong>: run/walk as far as you can in <strong>12 minutes</strong>, then enter the distance.</p>
      <div class="mb-3 flex gap-2">
        {(['m', 'mi'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metres' : 'Miles'}</button>
        ))}
      </div>
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance covered in 12 minutes ({unit === 'm' ? 'metres' : 'miles'})</span>
        <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated VO₂ max</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.vo2)}</p><p class="mt-1 text-xs text-slate-400">ml/kg/min</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fitness rating</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.rating}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the distance you covered in 12 minutes.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cooper formula: VO₂ max = (distance in metres − 504.9) ÷ 44.73. An estimate from a field test — actual VO₂ max needs lab testing, and ratings vary with age and sex. Only attempt a maximal effort if you're healthy and cleared to exercise. 🔒 In your browser.</p>
    </div>
  );
}
