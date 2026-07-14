import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString('en-US');

export default function PaverCalculator() {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [L, setL] = useState('12');
  const [W, setW] = useState('10');
  const [pL, setPL] = useState(''); // paver length, small unit
  const [pW, setPW] = useState(''); // paver width, small unit
  const [waste, setWaste] = useState('10');

  const D = unit === 'ft'
    ? { len: 'ft', small: 'in', toSmall: 12, pLDef: 8, pWDef: 4, vol: 'yd³', volDiv: 27, baseDepth: 0.5 } // 8x4in paver, 6in base
    : { len: 'm', small: 'cm', toSmall: 100, pLDef: 20, pWDef: 10, vol: 'm³', volDiv: 1, baseDepth: 0.15 };

  const r = useMemo(() => {
    const l = num(L), w = num(W);
    if (l == null || w == null || l <= 0 || w <= 0) return null;
    const paverL = (num(pL) ?? D.pLDef) / D.toSmall; // in big unit
    const paverW = (num(pW) ?? D.pWDef) / D.toSmall;
    const paverArea = paverL * paverW;
    if (paverArea <= 0) return null;
    const area = l * w;
    const base = Math.ceil(area / paverArea);
    const wastePct = num(waste) ?? 0;
    const withWaste = Math.ceil(base * (1 + wastePct / 100));
    const perArea = 1 / paverArea; // pavers per big-unit²
    // Base: compacted gravel ~6 in (15 cm), plus ~1 in (2.5 cm) bedding sand.
    const gravel = (area * D.baseDepth) / D.volDiv;
    const sandDepth = unit === 'ft' ? 1 / 12 : 0.025;
    const sand = (area * sandDepth) / D.volDiv;
    return { area, base, withWaste, perArea, gravel, sand };
  }, [L, W, pL, pW, waste, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <div class="ml-auto flex gap-2">
          {(['ft', 'm'] as const).map((u) => (
            <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'ft' ? 'Imperial' : 'Metric'}</button>
          ))}
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(L, setL, `Patio length (${D.len})`)}
        {inp(W, setW, `Patio width (${D.len})`)}
        {inp(pL, setPL, `Paver length (${D.small}, blank = ${D.pLDef})`)}
        {inp(pW, setPW, `Paver width (${D.small}, blank = ${D.pWDef})`)}
        {inp(waste, setWaste, 'Waste allowance (%)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pavers (+waste)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.withWaste, 0)}</p><p class="mt-1 text-xs text-slate-400">{fmt(r.base, 0)} bare · {fmt(r.perArea, 1)}/{D.len}²</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Gravel base (~6″)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.gravel, 2)} <span class="text-lg text-slate-500">{D.vol}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bedding sand (~1″)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.sand, 2)} <span class="text-lg text-slate-500">{D.vol}</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the patio and paver dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Pavers = patio area ÷ paver area, rounded up, plus waste for cuts. Base allows ~6″ (15 cm) compacted gravel and ~1″ (2.5 cm) bedding sand. Add extra pavers for a diagonal or herringbone pattern. 🔒 In your browser.</p>
    </div>
  );
}
