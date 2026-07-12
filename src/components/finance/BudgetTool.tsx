import { useMemo, useState } from 'preact/hooks';
import { budget503020 } from '../../lib/finance-planning';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) && v >= 0 ? v : 0; };
const money = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 });
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

const CATS = [
  { key: 'needs', label: 'Needs (50%)', pct: 50, color: 'bg-blue-500', ring: 'ring-blue-200', text: 'text-blue-800', ex: 'rent/mortgage, utilities, groceries, insurance, minimum debt payments, transport' },
  { key: 'wants', label: 'Wants (30%)', pct: 30, color: 'bg-violet-500', ring: 'ring-violet-200', text: 'text-violet-800', ex: 'dining out, subscriptions, hobbies, travel, shopping' },
  { key: 'savings', label: 'Savings & debt (20%)', pct: 20, color: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-800', ex: 'emergency fund, retirement, investments, extra debt payoff' },
] as const;

export default function BudgetTool() {
  const [income, setIncome] = useState('5000');
  const b = useMemo(() => budget503020(n(income)), [income]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block max-w-xs"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly take-home pay (after tax)</span>
        <input type="number" step="any" value={income} onInput={(e) => setIncome((e.target as HTMLInputElement).value)} class={inp} /></label>

      {b ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          {CATS.map((c) => (
            <div class={`rounded-xl bg-white p-4 ring-2 ${c.ring}`}>
              <div class="flex items-center gap-2"><span class={`inline-block h-3 w-3 rounded-full ${c.color}`} /><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.label}</p></div>
              <p class={`mt-1 text-3xl font-extrabold ${c.text}`}>${money(b[c.key])}</p>
              <p class="mt-1 text-xs text-slate-500">{c.ex}</p>
            </div>
          ))}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your monthly take-home pay.</p>
      )}

      {b && (
        <div class="mt-3 flex h-4 overflow-hidden rounded-full">
          <div class="bg-blue-500" style="width:50%" /><div class="bg-violet-500" style="width:30%" /><div class="bg-emerald-500" style="width:20%" />
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">The 50/30/20 rule (popularised by Senator Elizabeth Warren) splits after-tax income into 50% needs, 30% wants and 20% savings and debt repayment — a simple starting framework, not a strict rule. High-cost-of-living areas often can&rsquo;t hit 50% needs; adjust the split to your situation and prioritise an emergency fund and any high-interest debt. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
