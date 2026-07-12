import { useMemo, useState } from 'preact/hooks';
import { roastTime } from '../../lib/cooking';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
// [label, min/lb, base min, oven °F, safe internal °F]
const MEATS: { id: string; label: string; minPerLb: number; base: number; oven: number; safe: string }[] = [
  { id: 'turkey', label: 'Turkey, unstuffed (325°F)', minPerLb: 13, base: 0, oven: 325, safe: '74°C / 165°F' },
  { id: 'turkey-stuffed', label: 'Turkey, stuffed (325°F)', minPerLb: 15, base: 0, oven: 325, safe: '74°C / 165°F' },
  { id: 'chicken', label: 'Whole chicken (375°F)', minPerLb: 20, base: 0, oven: 375, safe: '74°C / 165°F' },
  { id: 'beef-mr', label: 'Beef roast, medium-rare (325°F)', minPerLb: 15, base: 0, oven: 325, safe: '63°C / 145°F (rest)' },
  { id: 'pork', label: 'Pork loin (350°F)', minPerLb: 20, base: 0, oven: 350, safe: '63°C / 145°F (rest)' },
  { id: 'ham', label: 'Ham, pre-cooked (325°F)', minPerLb: 15, base: 0, oven: 325, safe: '60°C / 140°F' },
  { id: 'lamb', label: 'Leg of lamb (325°F)', minPerLb: 20, base: 0, oven: 325, safe: '63°C / 145°F (rest)' },
];

function fmtMin(m: number): string {
  const h = Math.floor(m / 60), mm = Math.round(m % 60);
  return h > 0 ? `${h} h ${mm} min` : `${mm} min`;
}

export default function RoastTimeTool() {
  const [weight, setWeight] = useState('12');
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');
  const [meatId, setMeatId] = useState('turkey');

  const meat = MEATS.find((m) => m.id === meatId)!;
  const res = useMemo(() => {
    const w = num(weight);
    if (w == null) return null;
    const lb = unit === 'kg' ? w * 2.2046226218487757 : w;
    return roastTime(lb, meat.minPerLb, meat.base);
  }, [weight, unit, meatId]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight</span>
          <div class="flex gap-1"><input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'lb' | 'kg')} class={sel}><option value="lb">lb</option><option value="kg">kg</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Meat & method</span>
          <select value={meatId} onChange={(e) => setMeatId((e.target as HTMLSelectElement).value)} class={`${inp} font-sans`}>{MEATS.map((m) => <option value={m.id}>{m.label}</option>)}</select></label>
      </div>

      {res != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Approximate roasting time at {meat.oven}°F</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmtMin(res)}</p>
          <p class="mt-2 text-xs text-slate-500">Cook to a safe internal temperature of <span class="font-semibold text-slate-700">{meat.safe}</span> — always check with a thermometer.</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the weight and choose the meat.</p>}

      <p class="mt-4 text-xs text-slate-500">Roasting time is estimated as weight × minutes-per-pound for the cut and oven temperature (e.g. an unstuffed turkey at 325 °F is about 13 min/lb). Times are guidelines — the real doneness test is the internal temperature (USDA safe minimums shown), since shape, starting temperature and oven accuracy all vary. Let roasts rest before carving. 🔒 In your browser.</p>
    </div>
  );
}
