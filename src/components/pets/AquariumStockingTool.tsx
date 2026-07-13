import { useMemo, useState } from 'preact/hooks';
import { aquariumStocking, type StockingResult } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

const STATUS: Record<StockingResult['status'], { label: string; ring: string; text: string; bg: string }> = {
  understocked: { label: 'Understocked — room for more', ring: 'ring-sky-300', text: 'text-sky-800', bg: 'bg-sky-50' },
  ok: { label: 'Well stocked', ring: 'ring-emerald-300', text: 'text-emerald-800', bg: 'bg-emerald-50' },
  'fully stocked': { label: 'Fully stocked — at capacity', ring: 'ring-amber-300', text: 'text-amber-800', bg: 'bg-amber-50' },
  overstocked: { label: 'Overstocked — reduce or upgrade', ring: 'ring-rose-400', text: 'text-rose-900', bg: 'bg-rose-50' },
};

export default function AquariumStockingTool() {
  const [gallons, setGallons] = useState('20');
  const [unit, setUnit] = useState<'gal' | 'L'>('gal');
  const [inches, setInches] = useState('10');

  const r = useMemo(() => {
    const g = num(gallons), f = num(inches);
    if (g == null || f == null) return null;
    const gal = unit === 'gal' ? g : g * 0.264172;
    return aquariumStocking(gal, f);
  }, [gallons, unit, inches]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tank volume</span>
          <div class="flex gap-1"><input type="number" step="any" value={gallons} onInput={(e) => setGallons((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'gal' | 'L')} class={sel}><option value="gal">US gal</option><option value="L">litres</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total adult fish length (inches)</span>
          <input type="number" step="any" value={inches} onInput={(e) => setInches((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class={`mt-4 rounded-xl p-4 ring-2 ${STATUS[r.status].ring} ${STATUS[r.status].bg}`}>
            <p class={`text-lg font-extrabold ${STATUS[r.status].text}`}>{STATUS[r.status].label}</p>
            <p class="mt-1 text-sm text-slate-700"><strong>{fmt(r.percent, 0)}%</strong> of capacity — {fmt(r.usedInches)}″ of a suggested {fmt(r.maxInchesRule)}″ (net {fmt(r.netGallons)} gal).</p>
          </div>
          <div class="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div class="h-full rounded-full bg-brand-500" style={`width:${Math.min(100, r.percent)}%`}></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the tank volume and total adult fish length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The classic guideline is about 1 inch of adult fish per net gallon (roughly 85% of the rated volume once substrate and décor are in). It\'s a rough guide only: fish body mass, waste output, temperament, filtration and surface area matter more than length. Tall, heavy-bodied or messy fish (goldfish, cichlids) need far more room than the rule implies. Always research each species\' adult size and needs. 🔒 In your browser.</p>
    </div>
  );
}
