import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function TileCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [L, setL] = useState('4');
  const [W, setW] = useState('3');
  const [tileL, setTileL] = useState('30');
  const [tileW, setTileW] = useState('30');
  const [waste, setWaste] = useState('10');
  const [perBox, setPerBox] = useState('');

  // tile dims are in cm (metric) or inches (imperial)
  const tileUnit = unit === 'm' ? 'cm' : 'in';
  const toArea = (a: number) => (unit === 'm' ? a / 10000 : a / 144); // cm²→m², in²→ft²

  const r = useMemo(() => {
    const l = num(L), w = num(W), tl = num(tileL), tw = num(tileW), wp = num(waste) ?? 0, box = num(perBox);
    if (l == null || w == null || tl == null || tw == null || tl <= 0 || tw <= 0) return null;
    const area = l * w;
    const tileArea = toArea(tl * tw);
    if (tileArea <= 0) return null;
    const base = area / tileArea;
    const withWaste = Math.ceil(base * (1 + wp / 100));
    const boxes = box && box > 0 ? Math.ceil(withWaste / box) : null;
    return { area, base: Math.ceil(base), withWaste, boxes };
  }, [L, W, tileL, tileW, waste, perBox, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric (m, cm)' : 'Imperial (ft, in)'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Area length (${unit})`)}
        {inp(W, setW, `Area width (${unit})`)}
        {inp(waste, setWaste, 'Waste allowance (%)')}
        {inp(tileL, setTileL, `Tile length (${tileUnit})`)}
        {inp(tileW, setTileW, `Tile width (${tileUnit})`)}
        {inp(perBox, setPerBox, 'Tiles per box (optional)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tiles to buy</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.withWaste}</p>
            <p class="mt-1 text-xs text-slate-400">incl. {waste}% waste</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Area to cover</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.area)} <span class="text-lg text-slate-500">{unit === 'm' ? 'm²' : 'sq ft'}</span></p>
            <p class="mt-1 text-xs text-slate-400">{r.base} tiles before waste</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Boxes</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.boxes ?? '—'}</p>
            <p class="mt-1 text-xs text-slate-400">{r.boxes ? 'rounded up' : 'enter tiles per box'}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the area and tile dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Tiles = area ÷ tile area, + waste (10% straight, 15–20% diagonal/herringbone). Buy from one batch. 🔒 In your browser.</p>
    </div>
  );
}
