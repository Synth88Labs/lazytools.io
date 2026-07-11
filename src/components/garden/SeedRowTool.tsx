import { useMemo, useState } from 'preact/hooks';
import { seedsInRow } from '../../lib/garden';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => x.toLocaleString();

export default function SeedRowTool() {
  const [unit, setUnit] = useState<'m' | 'ft'>('ft');
  const [rowLen, setRowLen] = useState('10');
  const [inRow, setInRow] = useState('6'); // cm or in
  const [multiRow, setMultiRow] = useState(false);
  const [bedWidth, setBedWidth] = useState('4');
  const [rowGap, setRowGap] = useState('12'); // cm or in

  const r = useMemo(() => {
    const rl = num(rowLen), ir = num(inRow);
    if (rl == null || ir == null) return null;
    const irUnit = unit === 'm' ? ir / 100 : ir / 12;
    if (multiRow) {
      const bw = num(bedWidth), rg = num(rowGap);
      if (bw == null || rg == null) return null;
      const rgUnit = unit === 'm' ? rg / 100 : rg / 12;
      return seedsInRow(rl, irUnit, bw, rgUnit);
    }
    return seedsInRow(rl, irUnit);
  }, [rowLen, inRow, multiRow, bedWidth, rowGap, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const su = unit === 'm' ? 'cm' : 'in';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['m', 'ft'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'm' ? 'Metric' : 'Imperial'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Row length ({unit})</span>
          <input type="number" step="any" value={rowLen} onInput={(e) => setRowLen((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">In-row seed spacing ({su})</span>
          <input type="number" step="any" value={inRow} onInput={(e) => setInRow((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <label class="mt-2 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={multiRow} onChange={(e) => setMultiRow((e.target as HTMLInputElement).checked)} class="h-4 w-4 rounded border-slate-300 text-brand-600" />
        Multiple rows in a bed
      </label>
      {multiRow && (
        <div class="mt-2 grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bed width ({unit})</span>
            <input type="number" step="any" value={bedWidth} onInput={(e) => setBedWidth((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Between-row spacing ({su})</span>
            <input type="number" step="any" value={rowGap} onInput={(e) => setRowGap((e.target as HTMLInputElement).value)} class={inp} /></label>
        </div>
      )}

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Seeds total</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.total)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per row</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.perRow)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Rows</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.rows)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the row length and seed spacing.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Seeds per row = row length ÷ spacing + 1 (a plant at each end). Sow a few extra to allow for germination gaps and thinning. 🔒 In your browser.</p>
    </div>
  );
}
