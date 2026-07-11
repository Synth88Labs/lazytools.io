import { useMemo, useState } from 'preact/hooks';
import { payoff, loanPayment } from '../../lib/finance';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const money = (x: number) => x.toLocaleString(undefined, { maximumFractionDigits: 2 });
const monthsToYM = (m: number) => (m >= 12 ? `${Math.floor(m / 12)}y ${m % 12}m` : `${m}m`);

export default function CreditCardPayoffTool() {
  const [mode, setMode] = useState<'payment' | 'time'>('payment');
  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('21.9');
  const [payment, setPayment] = useState('200');
  const [targetMonths, setTargetMonths] = useState('24');

  const r = useMemo(() => {
    const b = num(balance), a = num(apr);
    if (b == null || a == null || b <= 0) return null;
    if (mode === 'payment') {
      const p = num(payment);
      if (p == null) return null;
      const res = payoff(b, a / 100, p);
      if (!res) return { never: true as const };
      return { months: res.months, interest: res.totalInterest, total: res.totalPaid, payment: p };
    }
    const m = num(targetMonths);
    if (m == null || m <= 0) return null;
    const pmt = loanPayment(b, a / 100, m / 12);
    return { months: Math.round(m), interest: pmt * m - b, total: pmt * m, payment: pmt };
  }, [mode, balance, apr, payment, targetMonths]);

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
      <div class="mb-3 flex gap-2">
        {([['payment', 'I’ll pay $X/month'], ['time', 'Pay off in X months']] as const).map(([m, l]) => (
          <button onClick={() => setMode(m)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === m ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{l}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(balance, setBalance, 'Card balance', '$')}
        {inp(apr, setApr, 'APR (%)')}
        {mode === 'payment' ? inp(payment, setPayment, 'Monthly payment', '$') : inp(targetMonths, setTargetMonths, 'Target months')}
      </div>

      {r ? (
        'never' in r ? (
          <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 ring-1 ring-amber-200">⚠ That payment barely covers the interest — the balance will never clear. Pay more than ${money((num(balance)! * (num(apr)! / 100)) / 12)}/mo (this month’s interest).</p>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode === 'payment' ? 'Debt-free in' : 'Pay each month'}</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{mode === 'payment' ? monthsToYM(r.months) : `$${money(r.payment)}`}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total interest</p><p class="mt-1 text-2xl font-extrabold text-red-600">${money(r.interest)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total paid</p><p class="mt-1 text-2xl font-extrabold text-slate-700">${money(r.total)}</p></div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your balance and APR.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Interest compounds monthly on the balance. Paying only the minimum can take years and cost more than the original balance. Educational, not advice. 🔒 In your browser.</p>
    </div>
  );
}
