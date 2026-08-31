import { useMemo, useState } from 'preact/hooks';
import { partyQuantities } from '../../lib/cooking';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function PartyFoodTool() {
  const [guests, setGuests] = useState('20');
  const [hours, setHours] = useState('3');
  const [fullMeal, setFullMeal] = useState(true);
  const [alcohol, setAlcohol] = useState(true);

  const res = useMemo(() => {
    const g = num(guests), h = num(hours);
    if (g == null || h == null) return null;
    return partyQuantities(g, h, fullMeal, alcohol);
  }, [guests, hours, fullMeal, alcohol]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number of guests</span>
          <input type="number" step="1" value={guests} onInput={(e) => setGuests((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Event length (hours)</span>
          <input type="number" step="any" value={hours} onInput={(e) => setHours((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-3 flex flex-wrap gap-4">
        <label class="flex items-center gap-1.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={fullMeal} onChange={(e) => setFullMeal((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" /> Serving a full meal</label>
        <label class="flex items-center gap-1.5 text-sm font-medium text-slate-700"><input type="checkbox" checked={alcohol} onChange={(e) => setAlcohol((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-200" /> Serving alcohol</label>
      </div>

      {res ? (
        <ul class="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          {res.map((it) => (
            <li class="flex items-center justify-between px-4 py-2.5">
              <span class="text-sm text-slate-700">{it.label}</span>
              <span class="font-mono text-sm font-bold text-slate-900">{it.amount}</span>
            </li>
          ))}
        </ul>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the number of guests and how long the event runs.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Quantities are per-guest rules of thumb from common party-planning charts, scaled by your guest count and event length, treat them as a shopping starting point and adjust for your crowd (bigger appetites, kids, dietary needs). Appetizer counts assume more finger food when there\'s no full meal. Always drink responsibly and offer plenty of water and non-alcoholic options. 🔒 In your browser.
      </p>
    </div>
  );
}
