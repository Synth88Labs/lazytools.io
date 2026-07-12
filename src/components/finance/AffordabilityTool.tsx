import { useMemo, useState } from 'preact/hooks';
import { affordability } from '../../lib/finance-planning';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const money = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 });
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function AffordabilityTool() {
  const [income, setIncome] = useState('8000');
  const [debts, setDebts] = useState('500');
  const [down, setDown] = useState('60000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('30');
  const [escrow, setEscrow] = useState('500');

  const r = useMemo(() => affordability({
    grossMonthlyIncome: n(income), monthlyDebts: n(debts), downPayment: n(down),
    annualRatePct: n(rate), years: n(years), monthlyTaxInsHoa: n(escrow),
  }), [income, debts, down, rate, years, escrow]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Gross monthly income</span><input type="number" step="any" value={income} onInput={(e) => setIncome((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Other monthly debts</span><input type="number" step="any" value={debts} onInput={(e) => setDebts((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Down payment</span><input type="number" step="any" value={down} onInput={(e) => setDown((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Interest rate (%)</span><input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Term (years)</span><input type="number" step="any" value={years} onInput={(e) => setYears((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Est. tax+ins+HOA / mo</span><input type="number" step="any" value={escrow} onInput={(e) => setEscrow((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Home price you can afford</p><p class="mt-1 text-3xl font-extrabold text-brand-800">${money(r.maxHomePrice)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max loan</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.maxLoan)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max housing payment</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.maxHousingPayment)}/mo</p></div>
          </div>
          <p class="mt-2 text-sm text-slate-600">You&rsquo;re limited by the <strong>{r.limitedBy}</strong> guideline. This is the affordability ceiling — many buyers deliberately borrow less for breathing room.</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your gross monthly income and other details.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Uses the lender <strong>28/36 rule</strong>: housing costs should stay under about 28% of gross income (front-end), and all debt payments under 36% (back-end). The tool takes the lower of the two, subtracts estimated taxes/insurance/HOA, and works back to the loan and home price. Lenders vary and may allow higher ratios; this is a conservative guideline, not a pre-approval or financial advice. 🔒 In your browser.</p>
    </div>
  );
}
