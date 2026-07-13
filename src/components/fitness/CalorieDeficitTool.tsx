import { useMemo, useState } from 'preact/hooks';
import { calorieDeficit } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString();

export default function CalorieDeficitTool() {
  const [amount, setAmount] = useState('5');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weeks, setWeeks] = useState('10');

  const r = useMemo(() => {
    const a = num(amount), w = num(weeks);
    if (a == null || w == null) return null;
    const res = calorieDeficit(a, w * 7, unit);
    if (!res) return null;
    return { ...res, aggressive: res.weeklyRate > (unit === 'kg' ? 1 : 2) };
  }, [amount, unit, weeks]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight to lose</span>
          <div class="flex gap-1"><input type="number" step="any" value={amount} onInput={(e) => setAmount((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'kg' | 'lb')} class={sel}><option value="kg">kg</option><option value="lb">lb</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Timeframe (weeks)</span>
          <input type="number" step="any" min="1" value={weeks} onInput={(e) => setWeeks((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily deficit needed</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.dailyDeficit)} <span class="text-base text-slate-500">kcal</span></p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekly loss rate</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{Number(r.weeklyRate.toFixed(2))} {unit}/wk</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total deficit</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.totalDeficit)} kcal</p></div>
          </div>
          {r.aggressive && <p class="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200">⚠️ That\'s a fast rate. Losing more than about {unit === 'kg' ? '1 kg' : '2 lb'} per week usually means a very large deficit that\'s hard to sustain and can cost muscle. Consider a longer timeframe.</p>}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a weight to lose and a timeframe.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Based on roughly 7,700 kcal per kg (3,500 per lb) of body fat: total deficit = weight × that figure, spread over your timeframe. Subtract the daily deficit from your maintenance calories (TDEE) to set your intake. This is a simplified estimate — real loss varies with water, muscle and metabolic adaptation. Not medical advice; consult a professional for a plan. 🔒 In your browser.</p>
    </div>
  );
}
