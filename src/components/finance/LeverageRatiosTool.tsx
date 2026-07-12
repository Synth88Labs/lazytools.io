import { useMemo, useState } from 'preact/hooks';
import { leverageRatios } from '../../lib/finance-ratios';
import RatioResults from './RatioResults';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function LeverageRatiosTool() {
  const [debt, setDebt] = useState('200000');
  const [equity, setEquity] = useState('100000');
  const [assets, setAssets] = useState('300000');

  const results = useMemo(() => leverageRatios({ totalDebt: n(debt), totalEquity: n(equity), totalAssets: n(assets) }), [debt, equity, assets]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total debt (or liabilities)</span><input type="number" step="any" value={debt} onInput={(e) => setDebt((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total equity</span><input type="number" step="any" value={equity} onInput={(e) => setEquity((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total assets</span><input type="number" step="any" value={assets} onInput={(e) => setAssets((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      <RatioResults results={results} />

      <p class="mt-4 text-xs text-slate-500">Leverage (solvency) ratios show how much a company relies on debt versus owners&rsquo; money. Whether a level is risky depends heavily on the sector — utilities, telecom and banks run structurally high leverage — so compare to industry peers. Note: some sources use total liabilities for debt-to-equity, others only interest-bearing debt; enter whichever you mean. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
