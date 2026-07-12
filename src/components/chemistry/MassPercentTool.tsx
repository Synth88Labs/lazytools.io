import { useMemo, useState } from 'preact/hooks';
import { massPercent } from '../../lib/chemistry';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();

export default function MassPercentTool() {
  const [solute, setSolute] = useState('10');
  const [solvent, setSolvent] = useState('90');

  const res = useMemo(() => {
    const s = num(solute), v = num(solvent);
    if (s == null || v == null) return null;
    const solution = s + v;
    return { solution, pct: massPercent(s, solution) };
  }, [solute, solvent]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass of solute (g)</span><input type="number" step="any" value={solute} onInput={(e) => setSolute((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass of solvent (g)</span><input type="number" step="any" value={solvent} onInput={(e) => setSolvent((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mass percent (w/w)</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.pct)}%</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total solution mass</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.solution)} g</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the solute and solvent masses.</p>}

      <p class="mt-4 text-xs text-slate-500">Mass percent by weight (%w/w) = mass of solute ÷ total mass of solution × 100, where the solution mass is solute + solvent. It's the concentration on nutrition and reagent labels — a 10 g solute in 90 g water is a 10% (w/w) solution. 🔒 In your browser.</p>
    </div>
  );
}
