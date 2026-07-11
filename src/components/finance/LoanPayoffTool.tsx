import { useMemo, useState } from 'preact/hooks';
import { loanPayment, payoff } from '../../lib/finance';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
const monthsToYM = (m: number) => `${Math.floor(m / 12)}y ${m % 12}m`;

export default function LoanPayoffTool() {
  const [amount, setAmount] = useState('20000');
  const [rate, setRate] = useState('6.5');
  const [years, setYears] = useState('5');
  const [extra, setExtra] = useState('100');

  const r = useMemo(() => {
    const p = num(amount), rt = num(rate), y = num(years), ex = num(extra) ?? 0;
    if (p == null || rt == null || y == null || p <= 0 || y <= 0) return null;
    const pmt = loanPayment(p, rt / 100, y);
    const baseInterest = pmt * Math.round(y * 12) - p;
    const withExtra = ex > 0 ? payoff(p, rt / 100, pmt + ex) : null;
    return { pmt, baseInterest, baseMonths: Math.round(y * 12), withExtra, ex };
  }, [amount, rate, years, extra]);

  const inp = (val: string, set: (v: string) => void, label: string, prefix?: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <div class="flex items-center rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
        {prefix && <span class="pl-3 text-sm text-slate-400">{prefix}</span>}
        <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)} class="w-full rounded-xl bg-transparent px-3 py-2 font-mono text-sm text-slate-900 focus:outline-none" />
      </div>
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {inp(amount, setAmount, 'Loan amount', '$')}
        {inp(rate, setRate, 'Interest rate (%)')}
        {inp(years, setYears, 'Term (years)')}
        {inp(extra, setExtra, 'Extra $/month (optional)', '$')}
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly payment</p><p class="mt-1 text-3xl font-extrabold text-brand-800">${money(r.pmt)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total interest</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.baseInterest)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Paid off in</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{monthsToYM(r.baseMonths)}</p></div>
          </div>
          {r.withExtra && (
            <div class="mt-3 rounded-xl bg-emerald-50 p-3 text-center ring-1 ring-emerald-200">
              <p class="text-sm text-emerald-800">Paying <strong>${money(r.pmt + r.ex)}</strong>/mo (${money(r.ex)} extra) clears it in <strong>{monthsToYM(r.withExtra.months)}</strong> and saves <strong>${money(r.baseInterest - r.withExtra.totalInterest)}</strong> in interest.</p>
            </div>
          )}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the loan amount, rate and term.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Standard amortization: PMT = P·i / (1 − (1+i)⁻ⁿ). Extra payments cut interest and time. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
