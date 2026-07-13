import { useMemo, useState } from 'preact/hooks';
import { navyBodyFat, bodyFatCategory, type Sex } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function BodyFatTool() {
  const [sex, setSex] = useState<Sex>('male');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [height, setHeight] = useState('70');
  const [neck, setNeck] = useState('15');
  const [waist, setWaist] = useState('34');
  const [hip, setHip] = useState('38');

  const r = useMemo(() => {
    const h = num(height), n = num(neck), w = num(waist), hp = num(hip);
    if (h == null || n == null || w == null) return null;
    const k = unit === 'in' ? 1 : 1 / 2.54; // cm → in
    const pct = navyBodyFat(sex, h * k, n * k, w * k, sex === 'female' ? (hp ?? 0) * k : 0);
    if (pct == null || pct <= 0 || pct > 75) return null;
    return { pct, cat: bodyFatCategory(sex, pct) };
  }, [sex, unit, height, neck, waist, hip]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;
  const field = (label: string, val: string, set: (s: string) => void) => (
    <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} ({unit})</span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)} class={inp} /></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {(['male', 'female'] as const).map((s) => <button onClick={() => setSex(s)} class={tog(sex === s)}>{s === 'male' ? '♂ Male' : '♀ Female'}</button>)}
        <span class="mx-1 self-center text-slate-300">|</span>
        {(['in', 'cm'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>{u}</button>)}
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {field('Height', height, setHeight)}
        {field('Neck', neck, setNeck)}
        {field('Waist', waist, setWaist)}
        {sex === 'female' && field('Hip', hip, setHip)}
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated body fat</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.pct)}%</p>
          <p class="mt-1 text-sm font-semibold text-slate-600">{r.cat}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your measurements{sex === 'female' ? ' (including hip)' : ''}. Waist must be larger than neck.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The US Navy tape method estimates body fat from body circumferences: waist and neck (plus hip for women) against height, using a logarithmic formula. Measure at the navel for the waist and below the larynx for the neck, snug but not compressing. It\'s an estimate — typically within 3–4% of a DEXA scan — not a medical measurement. 🔒 In your browser.</p>
    </div>
  );
}
