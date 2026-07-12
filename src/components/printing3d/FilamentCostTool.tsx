import { useMemo, useState } from 'preact/hooks';
import { filamentCost, filamentConvert, materialByName, MATERIALS } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function FilamentCostTool() {
  const [weight, setWeight] = useState('50');
  const [price, setPrice] = useState('20');
  const [material, setMaterial] = useState('PLA');

  const r = useMemo(() => {
    const w = num(weight), p = num(price);
    const m = materialByName(material);
    if (w == null || p == null || !m) return null;
    const cost = filamentCost(w, p)!;
    const conv = filamentConvert({ weightG: w, density: m.density, diameterMm: 1.75 });
    return { cost, lengthM: conv?.lengthM ?? null };
  }, [weight, price, material]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Filament used (g)</span>
          <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Spool price (per kg)</span>
          <input type="number" step="any" value={price} onInput={(e) => setPrice((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Material</span>
          <select class={sel} value={material} onChange={(e) => setMaterial((e.target as HTMLSelectElement).value)}>
            {MATERIALS.map((m) => <option value={m.name}>{m.name}</option>)}
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Filament cost</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{money(r.cost)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Filament length (1.75 mm)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.lengthM != null ? `${r.lengthM.toFixed(1)} m` : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the grams used and the spool's price per kg.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Cost = grams used ÷ 1000 × price per kg. Your slicer reports the grams (or length) a print needs; enter that here. This is the material cost only — for the full picture add electricity (see the print energy cost tool) and a margin for failed prints and machine time. Amounts are in whatever currency you enter. 🔒 In your browser.</p>
    </div>
  );
}
