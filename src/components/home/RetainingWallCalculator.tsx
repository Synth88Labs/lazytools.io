import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString('en-US');

export default function RetainingWallCalculator() {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [length, setLength] = useState('20');
  const [height, setHeight] = useState('3');
  const [blockW, setBlockW] = useState(''); // block face width, small unit
  const [blockH, setBlockH] = useState(''); // block height, small unit
  const [caps, setCaps] = useState(true);

  const D = unit === 'ft'
    ? { len: 'ft', small: 'in', toSmall: 12, bwDef: 12, bhDef: 4, vol: 'yd³', volDiv: 27 } // 12x4in block
    : { len: 'm', small: 'cm', toSmall: 100, bwDef: 30, bhDef: 10, vol: 'm³', volDiv: 1 }; // 30x10cm block

  const r = useMemo(() => {
    const l = num(length), h = num(height);
    if (l == null || h == null || l <= 0 || h <= 0) return null;
    const bw = (num(blockW) ?? D.bwDef) / D.toSmall; // block face width in big unit
    const bh = (num(blockH) ?? D.bhDef) / D.toSmall; // block height in big unit
    if (bw <= 0 || bh <= 0) return null;
    const perCourse = Math.ceil(l / bw);
    const courses = Math.ceil(h / bh);
    const blocks = perCourse * courses;
    const capBlocks = caps ? perCourse : 0;
    // Base gravel trench: ~6 in (15 cm) deep, one block-width plus a bit wide.
    const baseDepth = unit === 'ft' ? 0.5 : 0.15;
    const baseWidth = bw * 1.5;
    const baseVol = (l * baseWidth * baseDepth) / D.volDiv;
    return { perCourse, courses, blocks, capBlocks, total: blocks + capBlocks, baseVol };
  }, [length, height, blockW, blockH, caps, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-center gap-2">
        <label class="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={caps} onChange={(e) => setCaps((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300" />
          Include cap blocks
        </label>
        <div class="ml-auto flex gap-2">
          {(['ft', 'm'] as const).map((u) => (
            <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'ft' ? 'Imperial' : 'Metric'}</button>
          ))}
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {inp(length, setLength, `Wall length (${D.len})`)}
        {inp(height, setHeight, `Wall height (${D.len})`)}
        {inp(blockW, setBlockW, `Block width (${D.small}, blank = ${D.bwDef})`)}
        {inp(blockH, setBlockH, `Block height (${D.small}, blank = ${D.bhDef})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total blocks</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.total, 0)}</p><p class="mt-1 text-xs text-slate-400">{r.perCourse}/course × {r.courses} courses{r.capBlocks ? ` + ${r.capBlocks} caps` : ''}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Courses high</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.courses}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Base gravel</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.baseVol, 2)} <span class="text-lg text-slate-500">{D.vol}</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the wall length and height.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Blocks = ⌈length ÷ block width⌉ per course × ⌈height ÷ block height⌉ courses, plus one cap course. Base allows ~6″ (15 cm) of compacted gravel. Walls over ~3–4 ft usually need engineering, geogrid and a permit — check local codes. 🔒 In your browser.</p>
    </div>
  );
}
