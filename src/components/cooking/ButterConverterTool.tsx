import { useMemo, useState } from 'preact/hooks';
import { butterConvert } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

type Unit = 'stick' | 'tbsp' | 'cup' | 'gram' | 'oz';

export default function ButterConverterTool() {
  const [amt, setAmt] = useState('1');
  const [from, setFrom] = useState<Unit>('cup');

  const r = useMemo(() => {
    const a = num(amt);
    if (a == null) return null;
    return butterConvert(a, from);
  }, [amt, from]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const out: [string, number][] = r ? [
    ['US sticks', r.sticks], ['Tablespoons', r.tbsp], ['Cups', r.cups], ['Grams', r.grams], ['Ounces', r.oz],
  ] : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</span>
          <input type="number" step="any" min="0" value={amt} onInput={(e) => setAmt((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unit</span>
          <select value={from} onChange={(e) => setFrom((e.target as HTMLSelectElement).value as Unit)} class={sel}>
            <option value="stick">US sticks</option><option value="tbsp">Tablespoons</option><option value="cup">Cups</option><option value="gram">Grams</option><option value="oz">Ounces</option>
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-2 sm:grid-cols-5">
          {out.map(([label, val], i) => (
            <div class={`rounded-xl bg-white p-3 text-center ${i === 3 ? 'ring-2 ring-brand-200' : 'ring-1 ring-slate-200'}`}>
              <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p class="mt-1 text-xl font-extrabold text-slate-800">{fmt(val)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an amount.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">1 US stick = ½ cup = 8 tbsp = 4 oz = 113 g. In the UK, Europe and Australia butter is sold by weight, not sticks — use grams. 🔒 In your browser.</p>
    </div>
  );
}
