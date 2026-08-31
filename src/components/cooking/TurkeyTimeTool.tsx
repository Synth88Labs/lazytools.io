import { useMemo, useState } from 'preact/hooks';
import { turkeyTime } from '../../lib/cooking';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

function hrs(h: number): string {
  const d = Math.floor(h / 24);
  const rem = h - d * 24;
  const wh = Math.floor(rem);
  const m = Math.round((rem - wh) * 60);
  const parts = [] as string[];
  if (d) parts.push(`${d} day${d > 1 ? 's' : ''}`);
  if (wh) parts.push(`${wh} hr${wh > 1 ? 's' : ''}`);
  if (m && !d) parts.push(`${m} min`);
  return parts.join(' ') || '0';
}

export default function TurkeyTimeTool() {
  const [weight, setWeight] = useState('14');
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');
  const [stuffed, setStuffed] = useState('no');

  const res = useMemo(() => {
    const w = num(weight);
    if (w == null) return null;
    const lb = unit === 'kg' ? w * 2.2046226218 : w;
    return turkeyTime(lb, stuffed === 'yes');
  }, [weight, unit, stuffed]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Turkey weight</span>
          <div class="flex gap-1"><input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'lb' | 'kg')} class={sel}><option value="lb">lb</option><option value="kg">kg</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stuffed?</span>
          <select value={stuffed} onChange={(e) => setStuffed((e.target as HTMLSelectElement).value)} class={`${sel} w-full py-2`}><option value="no">No (unstuffed)</option><option value="yes">Yes (stuffed)</option></select></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-xl font-extrabold text-brand-800">{hrs(res.roastHours)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Roast at 325°F</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-xl font-extrabold text-slate-800">{hrs(res.fridgeThawHours)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Fridge thaw</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-xl font-extrabold text-slate-800">{hrs(res.coldWaterHours)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Cold-water thaw</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the turkey weight.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Based on USDA guidance: thaw in the fridge about <strong>24 hours per 4-5 lb</strong>, or in cold water (changed every 30 min) about <strong>30 minutes per lb</strong>. Roast unstuffed ≈ 13 min/lb, stuffed ≈ 15 min/lb at 325°F. Times are estimates, always cook until a thermometer in the thickest part of the breast and innermost thigh reads <strong>165°F (74°C)</strong>. 🔒 In your browser.
      </p>
    </div>
  );
}
