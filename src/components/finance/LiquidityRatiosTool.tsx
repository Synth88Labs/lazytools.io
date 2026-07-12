import { useMemo, useState } from 'preact/hooks';
import { liquidityRatios } from '../../lib/finance-ratios';
import RatioResults from './RatioResults';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function LiquidityRatiosTool() {
  const [ca, setCa] = useState('150000');
  const [inv, setInv] = useState('60000');
  const [cash, setCash] = useState('30000');
  const [cl, setCl] = useState('100000');

  const results = useMemo(() => liquidityRatios({ currentAssets: n(ca), inventory: n(inv), cash: n(cash), currentLiabilities: n(cl) }), [ca, inv, cash, cl]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current assets</span><input type="number" step="any" value={ca} onInput={(e) => setCa((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Inventory</span><input type="number" step="any" value={inv} onInput={(e) => setInv((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cash & equivalents</span><input type="number" step="any" value={cash} onInput={(e) => setCash((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current liabilities</span><input type="number" step="any" value={cl} onInput={(e) => setCl((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      <RatioResults results={results} />

      <p class="mt-4 text-xs text-slate-500">Liquidity ratios measure whether a company can pay its short-term bills. They are among the more universal ratios, but a very low current ratio can be normal in fast-turnover businesses (like retail), so read them alongside the industry. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
