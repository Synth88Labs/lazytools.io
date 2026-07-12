import { useMemo, useState } from 'preact/hooks';
import { raoults } from '../../lib/chemistry';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5));

export default function RaoultsTool() {
  const [pPure, setPPure] = useState('23.8');
  const [xSolvent, setXSolvent] = useState('0.9');

  const res = useMemo(() => {
    const p = num(pPure), x = num(xSolvent);
    if (p == null || x == null || x > 1) return null;
    return raoults(p, x);
  }, [pPure, xSolvent]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Pure solvent vapour pressure (P°)</span><input type="number" step="any" value={pPure} onInput={(e) => setPPure((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mole fraction of solvent (X)</span><input type="number" step="any" value={xSolvent} onInput={(e) => setXSolvent((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Solution vapour pressure</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.pSolution)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Vapour-pressure lowering (ΔP)</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{fmt(res.lowering)}</p></div>
        </div>
      ) : <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">Enter P° and a solvent mole fraction between 0 and 1.</p>}

      <p class="mt-4 text-xs text-slate-500">Raoult\'s law: the vapour pressure of an ideal solution equals the solvent\'s mole fraction times its pure vapour pressure, P = X<sub>solvent</sub> × P°. A non-volatile solute lowers the vapour pressure by ΔP = X<sub>solute</sub> × P° — a colligative effect that also raises boiling point and lowers freezing point. The pressure units of the result match whatever units you enter for P° (e.g. mmHg, kPa). Real solutions deviate from ideal behaviour. 🔒 In your browser.</p>
    </div>
  );
}
