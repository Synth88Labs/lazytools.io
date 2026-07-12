import { useMemo, useState } from 'preact/hooks';
import { sprayMix } from '../../lib/garden';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4));

export default function SprayMixTool() {
  const [tank, setTank] = useState('5');
  const [rate, setRate] = useState('2');
  const [system, setSystem] = useState<'us' | 'metric'>('us');

  const res = useMemo(() => {
    const t = num(tank), r = num(rate);
    if (t == null || r == null) return null;
    return sprayMix(t, r);
  }, [tank, rate]);

  const [tankUnit, rateUnit, productUnit] = system === 'us' ? ['gallons', 'oz per gallon', 'fl oz'] : ['litres', 'mL per litre', 'mL'];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex items-center gap-2"><span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Units</span>
        <select value={system} onChange={(e) => setSystem((e.target as HTMLSelectElement).value as 'us' | 'metric')} class={sel}><option value="us">US (oz/gal)</option><option value="metric">Metric (mL/L)</option></select></div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tank / sprayer volume ({tankUnit})</span><input type="number" step="any" value={tank} onInput={(e) => setTank((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Label rate ({rateUnit})</span><input type="number" step="any" value={rate} onInput={(e) => setRate((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Product to add</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res)} {productUnit}</p>
          <p class="mt-1 text-xs text-slate-500">into {tank} {tankUnit} of water</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the tank volume and the label rate.</p>}

      <p class="mt-4 text-xs text-slate-500">The amount of product is simply the tank volume × the label rate: a 2 oz-per-gallon rate in a 5-gallon sprayer needs 10 fl oz. Always follow the product label — rates and safety directions there take precedence — and never exceed the maximum rate. Measure concentrates carefully and wear the protective equipment the label specifies. 🔒 In your browser.</p>
    </div>
  );
}
