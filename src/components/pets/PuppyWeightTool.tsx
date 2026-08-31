import { useMemo, useState } from 'preact/hooks';
import { puppyAdultWeight } from '../../lib/pets';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(1)).toString();

export default function PuppyWeightTool() {
  const [weight, setWeight] = useState('5');
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [age, setAge] = useState('16');
  const [size, setSize] = useState('medium');

  const res = useMemo(() => {
    const w = num(weight), a = num(age);
    if (w == null || a == null) return null;
    return puppyAdultWeight(w, a, size);
  }, [weight, age, size]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current weight</span>
          <div class="flex gap-1"><input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'kg' | 'lb')} class={sel}><option value="kg">kg</option><option value="lb">lb</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current age (weeks)</span>
          <input type="number" step="any" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Adult size class</span>
          <select value={size} onChange={(e) => setSize((e.target as HTMLSelectElement).value)} class={`${sel} w-full py-2`}>
            <option value="small">Small (up to ~9 kg / 20 lb)</option>
            <option value="medium">Medium (~9-23 kg / 20-50 lb)</option>
            <option value="large">Large (~23-45 kg / 50-100 lb)</option>
            <option value="giant">Giant (over ~45 kg / 100 lb)</option>
          </select></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(res.adult)} <span class="text-lg">{unit}</span></p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated adult weight</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-3xl font-extrabold text-slate-800">{Math.round(res.pct)}%</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Of adult weight reached so far</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter your puppy\'s current weight, age and size class.</p>}

      <p class="mt-4 text-xs text-slate-500">
        The estimate divides your puppy\'s current weight by the fraction of adult weight it has typically reached by this age for its size class. Small breeds finish growing by about 10-12 months; large and giant breeds keep growing to 18-24 months. This is an <strong>approximation</strong> based on breed-size growth curves, real adult size depends on breed, genetics and nutrition, so treat it as a guide, and ask your vet about healthy growth. 🔒 In your browser.
      </p>
    </div>
  );
}
