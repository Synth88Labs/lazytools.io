import { useMemo, useState } from 'preact/hooks';
import { refinance } from '../../lib/refinance';

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const usd2 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export default function RefinanceTool() {
  const [balance, setBalance] = useState('300000');
  const [currentRate, setCurrentRate] = useState('6.8');
  const [remainingYears, setRemainingYears] = useState('27');
  const [newRate, setNewRate] = useState('5.5');
  const [newYears, setNewYears] = useState('30');
  const [closing, setClosing] = useState('4500');

  const r = useMemo(() => {
    const b = parseFloat(balance), cr = parseFloat(currentRate), rm = parseFloat(remainingYears) * 12,
      nr = parseFloat(newRate), nm = parseFloat(newYears) * 12, cc = parseFloat(closing);
    if (![b, cr, rm, nr, nm, cc].every(Number.isFinite) || b <= 0 || rm <= 0 || nm <= 0) return null;
    return refinance({ balance: b, currentRate: cr, remainingMonths: rm, newRate: nr, newMonths: nm, closingCosts: cc });
  }, [balance, currentRate, remainingYears, newRate, newYears, closing]);

  const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const lbl = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  const Field = ({ id, label, value, set, step, suffix }: any) => (
    <div>
      <label for={id} class={lbl}>{label}</label>
      <div class="relative">
        <input id={id} type="number" inputMode="decimal" step={step} value={value} onInput={(e) => set((e.target as HTMLInputElement).value)} class={inputCls} />
        {suffix && <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <Field id="rf-bal" label="Loan balance" value={balance} set={setBalance} step="1000" suffix="$" />
        <Field id="rf-cr" label="Current rate" value={currentRate} set={setCurrentRate} step="0.05" suffix="%" />
        <Field id="rf-rm" label="Years left" value={remainingYears} set={setRemainingYears} step="1" suffix="yr" />
        <Field id="rf-nr" label="New rate" value={newRate} set={setNewRate} step="0.05" suffix="%" />
        <Field id="rf-nm" label="New term" value={newYears} set={setNewYears} step="1" suffix="yr" />
        <Field id="rf-cc" label="Closing costs" value={closing} set={setClosing} step="100" suffix="$" />
      </div>

      {r && (
        <div class="mt-5">
          <div class={`rounded-xl border p-4 ${r.worthIt ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">Monthly payment</p>
            <div class="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span class="text-slate-500 line-through">{usd(r.currentPayment)}</span>
              <span class="text-3xl font-extrabold text-slate-900">{usd(r.newPayment)}</span>
              <span class={`text-lg font-bold ${r.monthlySavings >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {r.monthlySavings >= 0 ? '−' : '+'}{usd(Math.abs(r.monthlySavings))}/mo
              </span>
            </div>
          </div>

          <div class="mt-3 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Break-even</p>
              <p class="mt-1 text-2xl font-extrabold text-brand-800">{r.breakEvenMonths == null ? '—' : `${Math.ceil(r.breakEvenMonths)} mo`}</p>
              <p class="mt-0.5 text-xs text-slate-500">{r.breakEvenMonths == null ? 'no monthly saving' : `to recoup ${usd(parseFloat(closing))} closing costs`}</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly saving</p>
              <p class={`mt-1 text-2xl font-extrabold ${r.monthlySavings >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{usd2(r.monthlySavings)}</p>
              <p class="mt-0.5 text-xs text-slate-500">current − new payment</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Lifetime difference</p>
              <p class={`mt-1 text-2xl font-extrabold ${r.lifetimeSavings >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{usd(r.lifetimeSavings)}</p>
              <p class="mt-0.5 text-xs text-slate-500">vs. keeping the current loan</p>
            </div>
          </div>

          <p class="mt-3 text-sm text-slate-600">
            {r.worthIt
              ? `You'd save ${usd(r.monthlySavings)}/month and recoup the ${usd(parseFloat(closing))} closing costs in about ${Math.ceil(r.breakEvenMonths!)} months.`
              : r.monthlySavings > 0
                ? `The lower payment partly comes from a longer term — check the lifetime difference, not just the monthly saving.`
                : `At these terms the new payment isn't lower, so refinancing doesn't save month-to-month.`}
          </p>
        </div>
      )}
    </div>
  );
}
