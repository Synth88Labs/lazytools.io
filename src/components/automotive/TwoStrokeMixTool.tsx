import { useMemo, useState } from 'preact/hooks';
import { twoStrokeMix } from '../../lib/automotive';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

const RATIOS = ['16', '20', '25', '32', '40', '50', '80', '100'];

export default function TwoStrokeMixTool() {
  const [fuel, setFuel] = useState('5');
  const [unit, setUnit] = useState<'l' | 'gal'>('l');
  const [ratio, setRatio] = useState('50');

  const res = useMemo(() => {
    const f = num(fuel), r = num(ratio);
    if (f == null || r == null) return null;
    return twoStrokeMix(f, r, unit);
  }, [fuel, unit, ratio]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount of fuel (petrol)</span>
          <div class="flex gap-1"><input type="number" step="any" value={fuel} onInput={(e) => setFuel((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'l' | 'gal')} class={sel}><option value="l">litres</option><option value="gal">US gal</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mix ratio (fuel : oil)</span>
          <div class="flex items-center gap-2"><span class="text-sm text-slate-500">1 :</span>
            <select value={ratio} onChange={(e) => setRatio((e.target as HTMLSelectElement).value)} class={`${sel} flex-1 py-2`}>{RATIOS.map((r) => <option value={r}>{r}:1</option>)}</select></div></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(res.oilMl)} <span class="text-lg">ml</span></p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Two-stroke oil to add</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-3xl font-extrabold text-slate-800">{fmt(res.oilOz)} <span class="text-lg">fl oz</span></p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Same amount in fluid ounces</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the fuel amount and pick a ratio.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Add this much two-stroke oil to your petrol, then mix well before filling. The ratio is parts fuel to one part oil, a 50:1 mix is 50 parts petrol to 1 part oil, so oil = fuel ÷ 50. Always use the ratio your engine's manufacturer specifies (common for chainsaws, trimmers, outboards and dirt bikes), and a quality two-stroke oil. 🔒 In your browser.
      </p>
    </div>
  );
}
