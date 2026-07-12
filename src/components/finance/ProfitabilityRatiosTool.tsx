import { useMemo, useState } from 'preact/hooks';
import { profitabilityRatios } from '../../lib/finance-ratios';
import RatioResults from './RatioResults';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function ProfitabilityRatiosTool() {
  const [rev, setRev] = useState('100000');
  const [cogs, setCogs] = useState('60000');
  const [opInc, setOpInc] = useState('15000');
  const [ni, setNi] = useState('10000');
  const [assets, setAssets] = useState('200000');
  const [equity, setEquity] = useState('80000');

  const results = useMemo(() => profitabilityRatios({ revenue: n(rev), cogs: n(cogs), operatingIncome: n(opInc), netIncome: n(ni), totalAssets: n(assets), totalEquity: n(equity) }), [rev, cogs, opInc, ni, assets, equity]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue (sales)</span><input type="number" step="any" value={rev} onInput={(e) => setRev((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cost of goods sold</span><input type="number" step="any" value={cogs} onInput={(e) => setCogs((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Operating income (EBIT)</span><input type="number" step="any" value={opInc} onInput={(e) => setOpInc((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Net income</span><input type="number" step="any" value={ni} onInput={(e) => setNi((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total assets</span><input type="number" step="any" value={assets} onInput={(e) => setAssets((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shareholders&rsquo; equity</span><input type="number" step="any" value={equity} onInput={(e) => setEquity((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      <RatioResults results={results} />

      <p class="mt-4 text-xs text-slate-500">Profitability ratios show how much profit a company squeezes from its sales, assets and equity. There is no universal &ldquo;good&rdquo; number — software margins dwarf grocery margins, and asset-light firms post far higher returns than utilities — so the tool flags these to <strong>compare against industry peers and the company&rsquo;s own trend</strong> rather than an absolute cutoff. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
