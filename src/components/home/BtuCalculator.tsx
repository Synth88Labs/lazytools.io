import { useMemo, useState } from 'preact/hooks';
import { coolingBtu } from '../../lib/home';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function BtuCalculator() {
  const [area, setArea] = useState('300');
  const [unit, setUnit] = useState<'sqft' | 'm2'>('sqft');
  const [sun, setSun] = useState<'normal' | 'sunny' | 'shaded'>('normal');
  const [occupants, setOccupants] = useState('2');
  const [kitchen, setKitchen] = useState(false);

  const res = useMemo(() => {
    const a = num(area), o = num(occupants);
    if (a == null) return null;
    const sqft = unit === 'm2' ? a * 10.7639 : a;
    return coolingBtu(sqft, { sun, occupants: o ?? 2, kitchen });
  }, [area, unit, sun, occupants, kitchen]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Room area</span>
          <div class="flex gap-1"><input type="number" step="any" value={area} onInput={(e) => setArea((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'sqft' | 'm2')} class={sel}><option value="sqft">ft²</option><option value="m2">m²</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sun exposure</span>
          <select value={sun} onChange={(e) => setSun((e.target as HTMLSelectElement).value as 'normal' | 'sunny' | 'shaded')} class={`${inp} font-sans`}><option value="normal">Normal</option><option value="sunny">Very sunny (+10%)</option><option value="shaded">Heavily shaded (−10%)</option></select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Regular occupants</span><input type="number" step="1" value={occupants} onInput={(e) => setOccupants((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <label class="mt-3 flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={kitchen} onChange={(e) => setKitchen((e.target as HTMLInputElement).checked)} /> It\'s a kitchen (+4,000 BTU)</label>

      {res ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended cooling capacity</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{res.toLocaleString()} BTU/h</p>
          <p class="mt-1 text-xs text-slate-500">≈ {(res / 12000).toFixed(2)} tons · {(res * 0.293).toFixed(0)} watts</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the room area.</p>}

      <p class="mt-4 text-xs text-slate-500">Sizing follows the ENERGY STAR guideline of about 20 BTU per square foot, adjusted for a very sunny (+10%) or heavily shaded (−10%) room, extra occupants (+600 BTU each beyond two) and kitchens (+4,000 BTU for appliance heat). Oversizing an AC makes it short-cycle and dehumidify poorly, so bigger isn\'t better. For whole-home or high-ceiling spaces, a Manual J load calculation is more precise. 🔒 In your browser.</p>
    </div>
  );
}
