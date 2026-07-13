import { useMemo, useState } from 'preact/hooks';
import { firewoodCords } from '../../lib/home';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toLocaleString();

export default function FirewoodTool() {
  const [length, setLength] = useState('8');
  const [height, setHeight] = useState('4');
  const [depth, setDepth] = useState('4');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');

  const r = useMemo(() => {
    const l = num(length), h = num(height), d = num(depth);
    if (l == null || h == null || d == null) return null;
    const k = unit === 'ft' ? 1 : 3.280839895; // m → ft
    return firewoodCords(l * k, h * k, d * k);
  }, [length, height, depth, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['ft', 'm'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>{u === 'ft' ? 'feet' : 'metres'}</button>)}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stack length ({unit})</span>
          <input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stack height ({unit})</span>
          <input type="number" step="any" value={height} onInput={(e) => setHeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Depth / log length ({unit})</span>
          <input type="number" step="any" value={depth} onInput={(e) => setDepth((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Full cords</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.cords)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Face cords (16″ logs)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.faceCords16)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.cubicFeet, 1)} ft³</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the stack\'s length, height and depth.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A <strong>full cord</strong> is a stack measuring 4 ft × 4 ft × 8 ft = 128 cubic feet of wood, air gaps included. A <strong>face cord</strong> (or "rick") is 4 ft high × 8 ft long but only one log deep — so for 16-inch logs it\'s about a third of a full cord. Measure the neatly stacked pile, not a loose heap. 🔒 In your browser.</p>
    </div>
  );
}
