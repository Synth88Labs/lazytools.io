import { useMemo, useState } from 'preact/hooks';
import { navyBodyFat } from '../../lib/fitness';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

export default function NavyBodyFatTool() {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [height, setHeight] = useState('178');
  const [neck, setNeck] = useState('38');
  const [waist, setWaist] = useState('85');
  const [hip, setHip] = useState('95');

  const res = useMemo(() => {
    const h = num(height), n = num(neck), w = num(waist), hp = num(hip);
    if (h == null || n == null || w == null) return null;
    const k = unit === 'in' ? 2.54 : 1;
    return navyBodyFat(sex, h * k, n * k, w * k, (hp ?? 0) * k);
  }, [sex, unit, height, neck, waist, hip]);

  const field = (label: string, v: string, set: (s: string) => void) => (
    <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} ({unit})</span>
      <input type="number" step="any" value={v} onInput={(e) => set((e.target as HTMLInputElement).value)} class={inp} /></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-3">
        <label class="text-sm font-medium text-slate-700">Sex <select value={sex} onChange={(e) => setSex((e.target as HTMLSelectElement).value as 'male' | 'female')} class={sel}><option value="male">Male</option><option value="female">Female</option></select></label>
        <label class="text-sm font-medium text-slate-700">Units <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'cm' | 'in')} class={sel}><option value="cm">cm</option><option value="in">inches</option></select></label>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {field('Height', height, setHeight)}
        {field('Neck', neck, setNeck)}
        {field('Waist', waist, setWaist)}
        {sex === 'female' && field('Hip', hip, setHip)}
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(res.bodyFat)}%</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated body fat</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-2xl font-extrabold text-slate-800">{res.category}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Category (ACE)</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter your measurements. Measure the waist at the navel, the neck below the larynx{sex === 'female' ? ', and the hips at the widest point' : ''}.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Uses the US Navy circumference (tape) method — measure the neck just below the larynx, the waist at the navel{sex === 'female' ? ', and the hips at the widest point' : ''}, keeping the tape snug and level. It\'s a quick estimate (typically within a few percent of more precise methods) and body-measurement data stays on your device. Not medical advice — for clinical accuracy, use DEXA or hydrostatic weighing. 🔒 In your browser.
      </p>
    </div>
  );
}
