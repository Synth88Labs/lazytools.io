import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

// Rebar mass per metre (kg/m) by US bar size (#3..#8) and metric weight per foot (lb/ft).
const BARS: Record<string, { kgPerM: number; lbPerFt: number }> = {
  '#3': { kgPerM: 0.560, lbPerFt: 0.376 },
  '#4': { kgPerM: 0.994, lbPerFt: 0.668 },
  '#5': { kgPerM: 1.552, lbPerFt: 1.043 },
  '#6': { kgPerM: 2.235, lbPerFt: 1.502 },
  '#7': { kgPerM: 3.042, lbPerFt: 2.044 },
  '#8': { kgPerM: 3.973, lbPerFt: 2.670 },
};

export default function RebarCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [L, setL] = useState('20');
  const [W, setW] = useState('10');
  const [spacing, setSpacing] = useState(''); // grid spacing in inches (ft) or cm (m)
  const [edge, setEdge] = useState(''); // edge clearance
  const [size, setSize] = useState('#4');

  const D = unit === 'ft'
    ? { len: 'ft', small: 'in', spacingDef: 12, edgeDef: 3, toSmall: 12 } // 12 in per ft
    : { len: 'm', small: 'cm', spacingDef: 30, edgeDef: 7.5, toSmall: 100 }; // 100 cm per m

  const r = useMemo(() => {
    const l = num(L), w = num(W);
    if (l == null || w == null || l <= 0 || w <= 0) return null;
    const spSmall = num(spacing) ?? D.spacingDef;
    const edSmall = num(edge) ?? D.edgeDef;
    if (spSmall <= 0) return null;
    const sp = spSmall / D.toSmall; // spacing in main length unit
    const ed = edSmall / D.toSmall; // edge clearance in main length unit
    // Bars running lengthwise are spaced across the width; count = floor((W - 2·edge)/spacing)+1.
    const acrossW = Math.max(0, w - 2 * ed);
    const acrossL = Math.max(0, l - 2 * ed);
    const barsLengthwise = Math.floor(acrossW / sp + 1e-9) + 1; // each spans length L
    const barsWidthwise = Math.floor(acrossL / sp + 1e-9) + 1; // each spans width W
    const barLenL = l - 2 * ed; // effective length per lengthwise bar
    const barLenW = w - 2 * ed;
    const totalLen = barsLengthwise * barLenL + barsWidthwise * barLenW;
    const totalBars = barsLengthwise + barsWidthwise;
    const bar = BARS[size];
    const totalLenM = unit === 'ft' ? totalLen * 0.3048 : totalLen;
    const weight = unit === 'ft' ? totalLen * bar.lbPerFt : totalLenM * bar.kgPerM; // lb or kg
    const intersections = barsLengthwise * barsWidthwise; // tie wires
    return { barsLengthwise, barsWidthwise, totalBars, totalLen, weight, intersections };
  }, [L, W, spacing, edge, size, unit]);

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
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Slab length (${D.len})`)}
        {inp(W, setW, `Slab width (${D.len})`)}
        {inp(spacing, setSpacing, `Grid spacing (${D.small}, blank = ${D.spacingDef})`)}
        {inp(edge, setEdge, `Edge clearance (${D.small}, blank = ${D.edgeDef})`)}
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bar size</span>
          <select value={size} onChange={(e) => setSize((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200">
            {Object.keys(BARS).map((k) => <option value={k}>{k}</option>)}
          </select>
        </label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total bars</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.totalBars}</p><p class="mt-1 text-xs text-slate-400">{r.barsLengthwise} lengthwise + {r.barsWidthwise} widthwise</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total length</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.totalLen)} <span class="text-lg text-slate-500">{D.len}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weight ({size})</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.weight)} <span class="text-lg text-slate-500">{unit === 'ft' ? 'lb' : 'kg'}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200 sm:col-span-3"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Grid intersections (tie wires)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.intersections}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the slab dimensions and grid spacing.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Bars each way = floor((side − 2×edge) ÷ spacing) + 1. Weights per ASTM bar size. Add 40× bar-diameter for lap splices on long runs, and check your local code for spacing and cover. 🔒 In your browser.</p>
    </div>
  );
}
