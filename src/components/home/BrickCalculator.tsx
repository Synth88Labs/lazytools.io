import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString('en-US');

// Preset units per brick/block, face size (length × height) in the small unit.
type Preset = { label: string; w: number; h: number };
const PRESETS_FT: Record<string, Preset> = {
  'modular-brick': { label: 'Modular brick (7⅝ × 2¼ in)', w: 7.625, h: 2.25 },
  'standard-brick': { label: 'Standard brick (8 × 2¼ in)', w: 8, h: 2.25 },
  'cmu-block': { label: 'Concrete block / CMU (16 × 8 in)', w: 16, h: 8 },
};
const PRESETS_M: Record<string, Preset> = {
  'modular-brick': { label: 'Metric brick (215 × 65 mm)', w: 215, h: 65 },
  'standard-brick': { label: 'Standard brick (200 × 65 mm)', w: 200, h: 65 },
  'cmu-block': { label: 'Concrete block (390 × 190 mm)', w: 390, h: 190 },
};

export default function BrickCalculator() {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [L, setL] = useState('20');
  const [H, setH] = useState('8');
  const [preset, setPreset] = useState('modular-brick');
  const [joint, setJoint] = useState(''); // mortar joint in small unit
  const [waste, setWaste] = useState('10');

  // small unit: inches (ft mode) or mm (m mode). big->small conversion.
  const D = unit === 'ft'
    ? { len: 'ft', small: 'in', toSmall: 12, jointDef: 0.375, presets: PRESETS_FT } // 3/8 in joint
    : { len: 'm', small: 'mm', toSmall: 1000, jointDef: 10, presets: PRESETS_M }; // 10 mm joint

  const r = useMemo(() => {
    const l = num(L), h = num(H);
    if (l == null || h == null || l <= 0 || h <= 0) return null;
    const p = D.presets[preset];
    const j = num(joint) ?? D.jointDef;
    const wastePct = num(waste) ?? 0;
    // Effective unit face incl. one mortar joint on width and height.
    const faceW = (p.w + j) / D.toSmall; // in big unit
    const faceH = (p.h + j) / D.toSmall;
    const faceArea = faceW * faceH; // big unit²
    if (faceArea <= 0) return null;
    const wallArea = l * h;
    const base = wallArea / faceArea;
    const withWaste = base * (1 + wastePct / 100);
    const perUnitArea = 1 / faceArea; // units per big-unit²
    return { wallArea, base: Math.ceil(base), withWaste: Math.ceil(withWaste), perUnitArea };
  }, [L, H, preset, joint, waste, unit]);

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
        {inp(L, setL, `Wall length (${D.len})`)}
        {inp(H, setH, `Wall height (${D.len})`)}
        <label class="block sm:col-span-2">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Brick / block type</span>
          <select value={preset} onChange={(e) => setPreset((e.target as HTMLSelectElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200">
            {Object.entries(D.presets).map(([k, v]) => <option value={k}>{v.label}</option>)}
          </select>
        </label>
        {inp(joint, setJoint, `Mortar joint (${D.small}, blank = ${D.jointDef})`)}
        {inp(waste, setWaste, 'Waste allowance (%)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">With waste</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.withWaste)}</p><p class="mt-1 text-xs text-slate-400">buy this many</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Bare count</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.base)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Wall area</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.wallArea, 1)} <span class="text-lg text-slate-500">{D.len}²</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200 sm:col-span-3"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Units per {D.len}²</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perUnitArea, 1)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the wall dimensions and pick a brick or block type.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Units = wall area ÷ (brick face + mortar joint), rounded up, plus a waste allowance. A 3⁄8″ (10 mm) joint is standard. Subtract door and window openings from the wall area for a tighter estimate. 🔒 In your browser.</p>
    </div>
  );
}
