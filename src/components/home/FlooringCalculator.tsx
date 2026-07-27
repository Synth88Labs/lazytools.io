import { useMemo, useState } from 'preact/hooks';
import { flooringBoxes } from '../../lib/home';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function FlooringCalculator() {
  const [area, setArea] = useState('20');
  const [unit, setUnit] = useState<'m2' | 'ft2'>('m2');
  const [box, setBox] = useState('2');
  const [waste, setWaste] = useState('10');

  const res = useMemo(() => {
    const a = num(area), b = num(box), w = parseFloat(waste);
    if (a == null || b == null || !isFinite(w) || w < 0) return null;
    return flooringBoxes(a, b, w);
  }, [area, box, waste]);
  const u = unit === 'm2' ? 'm²' : 'ft²';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Room area</span>
          <div class="flex gap-1"><input type="number" step="any" value={area} onInput={(e) => setArea((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'm2' | 'ft2')} class={sel}><option value="m2">m²</option><option value="ft2">ft²</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Coverage per box ({u})</span>
          <input type="number" step="any" value={box} onInput={(e) => setBox((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Waste allowance (%)</span>
          <input type="number" step="any" value={waste} onInput={(e) => setWaste((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{res.boxes}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Boxes to buy</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.withWaste)} {u}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Area + waste</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.totalCoverage)} {u}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Total coverage bought</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the room area, coverage per box and a waste %.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Works for laminate, vinyl plank (LVP/LVT), engineered and hardwood flooring. Add a waste allowance for offcuts and layout — 10% for a simple straight lay, 15% for diagonals or busy patterns, more for many doorways or an irregular room. The box coverage is printed on the flooring pack. Buy from the same batch/lot for a colour match. 🔒 In your browser.
      </p>
    </div>
  );
}
