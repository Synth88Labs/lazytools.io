import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function DrywallCalculator() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [area, setArea] = useState('60');
  const [sheetL, setSheetL] = useState('8');
  const [sheetW, setSheetW] = useState('4');
  const [waste, setWaste] = useState('12');

  const D = unit === 'm' ? { area: 'm²', sheet: 'm', sheetLDef: '2.4', sheetWDef: '1.2' } : { area: 'sq ft', sheet: 'ft', sheetLDef: '8', sheetWDef: '4' };

  const r = useMemo(() => {
    const a = num(area), sl = num(sheetL), sw = num(sheetW), wp = num(waste) ?? 0;
    if (a == null || sl == null || sw == null || sl <= 0 || sw <= 0) return null;
    const sheetArea = sl * sw;
    const base = a / sheetArea;
    const sheets = Math.ceil(base * (1 + wp / 100));
    // rough consumables
    const compound = a * (unit === 'm' ? 0.5 : 0.05); // kg per m² / lb per sq ft (approx)
    return { sheets, base, sheetArea, compound };
  }, [area, sheetL, sheetW, waste, unit]);

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
        {(['ft', 'm'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'ft' ? 'Imperial (ft)' : 'Metric (m)'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {inp(area, setArea, `Wall + ceiling area (${D.area})`)}
        {inp(sheetL, setSheetL, `Sheet length (${D.sheet}, ${D.sheetLDef})`)}
        {inp(sheetW, setSheetW, `Sheet width (${D.sheet}, ${D.sheetWDef})`)}
        {inp(waste, setWaste, 'Waste allowance (%)')}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sheets to buy</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.sheets}</p>
            <p class="mt-1 text-xs text-slate-400">incl. {waste}% waste</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Before waste</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.base)}</p>
            <p class="mt-1 text-xs text-slate-400">{fmt(r.sheetArea, 2)} {D.area}/sheet</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Joint compound (approx)</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.compound, 0)} <span class="text-lg text-slate-500">{unit === 'm' ? 'kg' : 'lb'}</span></p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the total area to board and your sheet size.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Sheets = area ÷ sheet area, + waste (~10–15%). Compound estimate is approximate — check product coverage. 🔒 In your browser.</p>
    </div>
  );
}
