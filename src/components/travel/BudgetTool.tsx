import { useMemo, useState } from 'preact/hooks';
import { budgetPerDay, budgetPerPersonPerDay } from '../../lib/travel';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const int = (s: string) => { const n = parseInt(s, 10); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });

/** A typical split of trip spend as guidance (sums to 100). */
const CATEGORIES: { key: string; label: string; share: number }[] = [
  { key: 'stay', label: 'Accommodation', share: 35 },
  { key: 'food', label: 'Food & drink', share: 25 },
  { key: 'transport', label: 'Local transport', share: 15 },
  { key: 'activities', label: 'Activities & sights', share: 15 },
  { key: 'misc', label: 'Shopping & extras', share: 10 },
];

export default function BudgetTool() {
  const [total, setTotal] = useState('2000');
  const [days, setDays] = useState('7');
  const [people, setPeople] = useState('2');

  const r = useMemo(() => {
    const t = num(total), d = int(days), p = int(people);
    if (t == null || d == null || p == null) return null;
    return {
      perDay: budgetPerDay(t, d)!,
      perPersonPerDay: budgetPerPersonPerDay(t, d, p)!,
      perPerson: t / p,
    };
  }, [total, days, people]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total budget</span>
          <input type="number" step="any" value={total} onInput={(e) => setTotal((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Trip length (days)</span>
          <input type="number" step="1" min="1" value={days} onInput={(e) => setDays((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Travellers</span>
          <input type="number" step="1" min="1" value={people} onInput={(e) => setPeople((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per day</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.perDay)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per person / day</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perPersonPerDay)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per person total</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perPerson)}</p></div>
          </div>

          <div class="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">A typical daily split (guidance)</p>
            <div class="space-y-1.5">
              {CATEGORIES.map((c) => (
                <div class="flex items-center gap-2 text-sm">
                  <span class="w-36 shrink-0 text-slate-600">{c.label}</span>
                  <span class="h-2 rounded bg-brand-400" style={`width:${c.share * 2}px`} />
                  <span class="font-mono text-slate-700">{fmt(r.perDay * c.share / 100)}<span class="ml-1 text-xs text-slate-400">/day</span></span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your total budget, trip length and number of travellers.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Amounts are in whatever currency you enter — no conversion. The category split is a rough starting point (accommodation and food usually dominate); adjust it to your trip. Keep a contingency of ~10–15% for the unexpected. 🔒 In your browser.</p>
    </div>
  );
}
