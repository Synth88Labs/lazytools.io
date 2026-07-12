import { useMemo, useState } from 'preact/hooks';
import { valuationRatios } from '../../lib/finance-ratios';
import RatioResults from './RatioResults';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function ValuationRatiosTool() {
  const [price, setPrice] = useState('50');
  const [shares, setShares] = useState('1000');
  const [ni, setNi] = useState('5000');
  const [equity, setEquity] = useState('40000');
  const [rev, setRev] = useState('100000');
  const [div, setDiv] = useState('2000');
  const [ebitda, setEbitda] = useState('12000');
  const [ev, setEv] = useState('60000');

  const results = useMemo(() => valuationRatios({ price: n(price), shares: n(shares), netIncome: n(ni), totalEquity: n(equity), revenue: n(rev), dividendsPaid: n(div), ebitda: n(ebitda), enterpriseValue: n(ev) }), [price, shares, ni, equity, rev, div, ebitda, ev]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Share price</span><input type="number" step="any" value={price} onInput={(e) => setPrice((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shares outstanding</span><input type="number" step="any" value={shares} onInput={(e) => setShares((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Net income</span><input type="number" step="any" value={ni} onInput={(e) => setNi((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shareholders&rsquo; equity</span><input type="number" step="any" value={equity} onInput={(e) => setEquity((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</span><input type="number" step="any" value={rev} onInput={(e) => setRev((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dividends paid</span><input type="number" step="any" value={div} onInput={(e) => setDiv((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">EBITDA</span><input type="number" step="any" value={ebitda} onInput={(e) => setEbitda((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Enterprise value</span><input type="number" step="any" value={ev} onInput={(e) => setEv((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      <RatioResults results={results} />

      <p class="mt-4 text-xs text-slate-500">Valuation (market) ratios relate a company&rsquo;s share price to its earnings, book value, sales and cash flow — telling you how expensive the stock is. They only mean something <strong>versus sector peers, the company&rsquo;s own history and its growth rate</strong>: a P/E of 30 is cheap for a fast grower and dear for a utility. Enterprise value = market cap + net debt. Educational information, not financial or investment advice. 🔒 In your browser.</p>
    </div>
  );
}
