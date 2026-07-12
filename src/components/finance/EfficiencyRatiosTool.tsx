import { useMemo, useState } from 'preact/hooks';
import { efficiencyRatios } from '../../lib/finance-ratios';
import RatioResults from './RatioResults';

const n = (s: string) => { const v = parseFloat(s); return isFinite(v) ? v : 0; };
const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function EfficiencyRatiosTool() {
  const [cogs, setCogs] = useState('60000');
  const [inv, setInv] = useState('10000');
  const [rev, setRev] = useState('100000');
  const [ar, setAr] = useState('12000');
  const [ap, setAp] = useState('8000');
  const [assets, setAssets] = useState('200000');

  const results = useMemo(() => efficiencyRatios({ cogs: n(cogs), avgInventory: n(inv), revenue: n(rev), avgReceivables: n(ar), avgPayables: n(ap), totalAssets: n(assets) }), [cogs, inv, rev, ar, ap, assets]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cost of goods sold</span><input type="number" step="any" value={cogs} onInput={(e) => setCogs((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average inventory</span><input type="number" step="any" value={inv} onInput={(e) => setInv((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Revenue</span><input type="number" step="any" value={rev} onInput={(e) => setRev((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average receivables</span><input type="number" step="any" value={ar} onInput={(e) => setAr((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average payables</span><input type="number" step="any" value={ap} onInput={(e) => setAp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total assets</span><input type="number" step="any" value={assets} onInput={(e) => setAssets((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      <RatioResults results={results} />

      <p class="mt-4 text-xs text-slate-500">Efficiency (activity) ratios show how well a company turns its assets and working capital into sales and cash. &ldquo;Fast&rdquo; is relative — grocers turn inventory many times a year, heavy-equipment makers slowly — so benchmark against the industry and your own payment terms. A shorter (or negative) cash conversion cycle frees up working capital. Educational information, not financial advice. 🔒 In your browser.</p>
    </div>
  );
}
