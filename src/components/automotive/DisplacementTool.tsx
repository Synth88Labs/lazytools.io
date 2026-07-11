import { useMemo, useState } from 'preact/hooks';
import { displacementCc, CI_PER_LITRE } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function DisplacementTool() {
  const [unit, setUnit] = useState<'mm' | 'in'>('mm');
  const [bore, setBore] = useState('86');
  const [stroke, setStroke] = useState('86');
  const [cyl, setCyl] = useState('4');

  const r = useMemo(() => {
    let b = num(bore), s = num(stroke); const c = num(cyl);
    if (b == null || s == null || c == null) return null;
    if (unit === 'in') { b *= 25.4; s *= 25.4; }
    const cc = displacementCc(b, s, c);
    const litres = cc / 1000;
    return { cc, litres, ci: litres * CI_PER_LITRE, perCyl: cc / c };
  }, [unit, bore, stroke, cyl]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['mm', 'in'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'mm' ? 'Millimetres' : 'Inches'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bore ({unit})</span>
          <input type="number" step="any" value={bore} onInput={(e) => setBore((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stroke ({unit})</span>
          <input type="number" step="any" value={stroke} onInput={(e) => setStroke((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cylinders</span>
          <input type="number" step="1" value={cyl} onInput={(e) => setCyl((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Displacement</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.litres, 2)} <span class="text-lg text-slate-500">L</span></p><p class="mt-1 text-xs text-slate-400">{fmt(r.cc, 0)} cc</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cubic inches</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.ci, 1)} ci</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per cylinder</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.perCyl, 0)} cc</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter bore, stroke and cylinder count.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Displacement = π⁄4 × bore² × stroke × cylinders. A “square” engine has bore = stroke; oversquare (bore &gt; stroke) tends to rev higher. 1 litre = 61.02 cubic inches. 🔒 In your browser.</p>
    </div>
  );
}
