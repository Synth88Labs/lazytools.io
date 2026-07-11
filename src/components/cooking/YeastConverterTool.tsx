import { useMemo, useState } from 'preact/hooks';
import { yeastConvert, YEAST } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Type = 'active-dry' | 'instant' | 'fresh';

export default function YeastConverterTool() {
  const [amt, setAmt] = useState('7');
  const [from, setFrom] = useState<Type>('active-dry');

  const r = useMemo(() => {
    const a = num(amt);
    if (a == null) return null;
    const y = yeastConvert(a, from);
    return { ...y, packets: y.activeDry / YEAST.packetGrams, tsp: (y.activeDry / YEAST.packetGrams) * YEAST.packetTsp };
  }, [amt, from]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount (grams)</span>
          <input type="number" step="any" min="0" value={amt} onInput={(e) => setAmt((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Yeast type</span>
          <select value={from} onChange={(e) => setFrom((e.target as HTMLSelectElement).value as Type)} class={sel}>
            <option value="active-dry">Active dry</option><option value="instant">Instant / rapid-rise</option><option value="fresh">Fresh / cake</option>
          </select></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class={`rounded-xl bg-white p-4 text-center ${from === 'active-dry' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Active dry</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-800">{fmt(r.activeDry)} g</p>
            </div>
            <div class={`rounded-xl bg-white p-4 text-center ${from === 'instant' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Instant</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-800">{fmt(r.instant)} g</p>
            </div>
            <div class={`rounded-xl bg-white p-4 text-center ${from === 'fresh' ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fresh / cake</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-800">{fmt(r.fresh)} g</p>
            </div>
          </div>
          <p class="mt-3 text-center text-sm text-slate-600">
            ≈ <strong>{fmt(r.packets, 2)}</strong> standard packet{Math.abs(r.packets - 1) < 0.005 ? '' : 's'} of dry yeast (<strong>{fmt(r.tsp)}</strong> tsp)
          </p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an amount in grams.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Active dry and instant are swapped 1:1 by weight (Red Star); some bakers use about 25% less instant. Fresh (cake) yeast ≈ 2.5× the dry weight (King Arthur). 1 packet dry yeast = ¼ oz = 7 g = 2¼ tsp. 🔒 In your browser.
      </p>
    </div>
  );
}
