import { useMemo, useState } from 'preact/hooks';
import { INGREDIENTS, getIngredient, VOLUME_ML } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

type Dir = 'v2w' | 'w2v'; // volume→weight or weight→volume

export default function GramsToCupsTool() {
  const [ing, setIng] = useState('flour-ap');
  const [dir, setDir] = useState<Dir>('v2w');
  const [amt, setAmt] = useState('1');
  const [volUnit, setVolUnit] = useState<'us_cup' | 'us_tbsp' | 'us_tsp' | 'ml'>('us_cup');
  const [wUnit, setWUnit] = useState<'gram' | 'oz'>('gram');

  const item = getIngredient(ing)!;
  const gPerMl = item.gPerCup / VOLUME_ML.us_cup;

  const r = useMemo(() => {
    const a = num(amt);
    if (a == null) return null;
    if (dir === 'v2w') {
      const ml = a * VOLUME_ML[volUnit];
      const grams = ml * gPerMl;
      return { grams, oz: grams / 28.349523125, ml };
    } else {
      const grams = wUnit === 'gram' ? a : a * 28.349523125;
      const ml = grams / gPerMl;
      return { grams, ml, cups: ml / VOLUME_ML.us_cup, tbsp: ml / VOLUME_ML.us_tbsp, tsp: ml / VOLUME_ML.us_tsp };
    }
  }, [amt, dir, volUnit, wUnit, ing]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Ingredient</span>
        <select value={ing} onChange={(e) => setIng((e.target as HTMLSelectElement).value)} class={sel}>
          {INGREDIENTS.map((i) => <option value={i.id}>{i.name}</option>)}
        </select>
      </label>

      <div class="mt-3 flex gap-2">
        {([['v2w', 'Volume → weight'], ['w2v', 'Weight → volume']] as const).map(([d, lbl]) => (
          <button onClick={() => setDir(d)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${dir === d ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</span>
          <input type="number" step="any" min="0" value={amt} onInput={(e) => setAmt((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
        {dir === 'v2w' ? (
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Volume unit</span>
            <select value={volUnit} onChange={(e) => setVolUnit((e.target as HTMLSelectElement).value as any)} class={sel}>
              <option value="us_cup">US cups</option>
              <option value="us_tbsp">US tablespoons</option>
              <option value="us_tsp">US teaspoons</option>
              <option value="ml">millilitres</option>
            </select>
          </label>
        ) : (
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Weight unit</span>
            <select value={wUnit} onChange={(e) => setWUnit((e.target as HTMLSelectElement).value as any)} class={sel}>
              <option value="gram">grams</option>
              <option value="oz">ounces</option>
            </select>
          </label>
        )}
      </div>

      {r ? (
        dir === 'v2w' ? (
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weight</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.grams, r.grams < 10 ? 1 : 0)} <span class="text-lg text-slate-500">g</span></p>
              <p class="mt-1 text-xs text-slate-400">{fmt(r.oz)} oz</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p>
              <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.ml, 0)} <span class="text-lg text-slate-500">mL</span></p>
            </div>
          </div>
        ) : (
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cups</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.cups!)}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tablespoons</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.tbsp!, 1)}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Millilitres</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.ml, 0)}</p>
            </div>
          </div>
        )
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter an amount to convert.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        {item.name}: {item.gPerCup} g per US cup{item.note ? ` — ${item.note}` : ''} Weights from King Arthur Baking's Ingredient Weight Chart. 🔒 In your browser.
      </p>
    </div>
  );
}
