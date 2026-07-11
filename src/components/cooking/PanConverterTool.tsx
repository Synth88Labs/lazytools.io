import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Shape = 'round' | 'square' | 'rect';

function area(shape: Shape, a: number, b: number): number {
  if (shape === 'round') return Math.PI * (a / 2) ** 2;
  if (shape === 'square') return a * a;
  return a * b;
}

export default function PanConverterTool() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  // original pan
  const [oShape, setOShape] = useState<Shape>('round');
  const [oA, setOA] = useState('9');
  const [oB, setOB] = useState('9');
  // new pan
  const [nShape, setNShape] = useState<Shape>('square');
  const [nA, setNA] = useState('8');
  const [nB, setNB] = useState('8');

  const r = useMemo(() => {
    const oa = num(oA), ob = num(oB), na = num(nA), nb = num(nB);
    if (oa == null || na == null) return null;
    if (oShape === 'rect' && ob == null) return null;
    if (nShape === 'rect' && nb == null) return null;
    const oArea = area(oShape, oa, ob ?? 0);
    const nArea = area(nShape, na, nb ?? 0);
    if (nArea === 0) return null;
    return { oArea, nArea, ratio: nArea / oArea };
  }, [oShape, oA, oB, nShape, nA, nB]);

  const sel = 'rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const inp = 'w-20 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const panFields = (shape: Shape, a: string, setA: (v: string) => void, b: string, setB: (v: string) => void, setShape: (s: Shape) => void) => (
    <div class="flex flex-wrap items-end gap-2">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shape</span>
        <select value={shape} onChange={(e) => setShape((e.target as HTMLSelectElement).value as Shape)} class={sel}>
          <option value="round">Round</option><option value="square">Square</option><option value="rect">Rectangular</option>
        </select></label>
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{shape === 'round' ? `Diameter (${unit})` : `${shape === 'rect' ? 'Length' : 'Side'} (${unit})`}</span>
        <input type="number" step="any" min="0" value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} class={inp} /></label>
      {shape === 'rect' && (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width ({unit})</span>
          <input type="number" step="any" min="0" value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} class={inp} /></label>
      )}
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['in', 'cm'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'in' ? 'Inches' : 'Centimetres'}</button>
        ))}
      </div>

      <div class="space-y-4">
        <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <p class="mb-2 text-sm font-semibold text-slate-700">Original pan (what the recipe calls for)</p>
          {panFields(oShape, oA, setOA, oB, setOB, setOShape)}
        </div>
        <div class="rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <p class="mb-2 text-sm font-semibold text-slate-700">Your pan</p>
          {panFields(nShape, nA, setNA, nB, setNB, setNShape)}
        </div>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <div class="grid gap-3 sm:grid-cols-3 text-center">
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Original area</p><p class="mt-1 text-xl font-bold text-slate-700">{fmt(r.oArea)} {unit}²</p></div>
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your area</p><p class="mt-1 text-xl font-bold text-slate-700">{fmt(r.nArea)} {unit}²</p></div>
            <div><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Batter ratio</p><p class="mt-1 text-2xl font-extrabold text-brand-800">×{fmt(r.ratio, 2)}</p></div>
          </div>
          <p class="mt-3 text-center text-sm text-slate-600">
            Your pan holds <strong>{r.ratio >= 1 ? `${fmt((r.ratio - 1) * 100, 0)}% more` : `${fmt((1 - r.ratio) * 100, 0)}% less`}</strong>. Multiply the recipe by <strong class="font-mono text-brand-700">×{fmt(r.ratio, 2)}</strong> to keep the same batter depth.
          </p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter both pans' dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Compares pan floor area (round = π × (d/2)²). Keep the batter depth the same for similar baking; a much bigger or smaller pan will also change the bake time and temperature. 🔒 In your browser.</p>
    </div>
  );
}
