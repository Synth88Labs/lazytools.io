import { useMemo, useState } from 'preact/hooks';
import { coverageRatios } from '../../lib/finance-ratios';
import RatioResults from './RatioResults';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function CoverageRatiosTool() {
  const [ebit, setEbit] = useState('50000');
  const [interest, setInterest] = useState('10000');
  const [noi, setNoi] = useState('60000');
  const [service, setService] = useState('40000');
  const [lease, setLease] = useState('0');

  const results = useMemo(() => coverageRatios({ ebit: n(ebit), interestExpense: n(interest), netOperatingIncome: n(noi), totalDebtService: n(service), leasePayments: n(lease) }), [ebit, interest, noi, service, lease]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">EBIT (operating income)</span><input type="number" step="any" value={ebit} onInput={(e) => setEbit((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Interest expense</span><input type="number" step="any" value={interest} onInput={(e) => setInterest((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lease / rent payments</span><input type="number" step="any" value={lease} onInput={(e) => setLease((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Net operating income</span><input type="number" step="any" value={noi} onInput={(e) => setNoi((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total debt service (P+I)</span><input type="number" step="any" value={service} onInput={(e) => setService((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      <RatioResults results={results} />

      <p class="mt-4 text-xs text-slate-500">Coverage ratios show how comfortably earnings cover debt obligations — the ratios lenders lean on most. The rules of thumb here (interest coverage above ~2.5–3×, DSCR at or above 1.25×) are widely used loan-underwriting benchmarks, though stable-cash-flow sectors get more leeway. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
