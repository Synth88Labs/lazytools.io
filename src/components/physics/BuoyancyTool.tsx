import { useState, useMemo } from 'preact/hooks';
import { buoyancy } from '../../lib/physics-extra';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const n = (s: string) => { const v = parseFloat(s); return isFinite(v) && v > 0 ? v : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toLocaleString('en-US', { maximumSignificantDigits: 5 });
const FLUIDS: [string, number][] = [['Fresh water', 1000], ['Seawater', 1025], ['Oil', 900], ['Mercury', 13534], ['Air', 1.225]];

export default function BuoyancyTool() {
  const [rho, setRho] = useState('1000');
  const [vol, setVol] = useState('0.05');
  const [mass, setMass] = useState('40');

  const res = useMemo(() => {
    const r = n(rho), v = n(vol);
    if (r == null || v == null) return null;
    return buoyancy(r, v, 9.80665, n(mass));
  }, [rho, vol, mass]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fluid density (kg/m³)</span><input type="number" step="any" value={rho} onInput={(e) => setRho((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Displaced volume (m³)</span><input type="number" step="any" value={vol} onInput={(e) => setVol((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Object mass (kg, optional)</span><input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {FLUIDS.map(([lbl, v]) => <button onClick={() => setRho(String(v))} class="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">{lbl}</button>)}
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Buoyant force</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.buoyantForce)} N</p></div>
          {res.floats != null && (
            <div class={`rounded-xl bg-white p-4 text-center ring-1 ${res.floats ? 'ring-emerald-200' : 'ring-rose-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Object weight {fmt(res.weight!)} N →</p><p class={`mt-1 text-2xl font-extrabold ${res.floats ? 'text-emerald-700' : 'text-rose-700'}`}>{res.floats ? 'Floats ⬆' : 'Sinks ⬇'}</p></div>
          )}
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter fluid density and displaced volume.</p>}

      <p class="mt-4 text-xs text-slate-500">Archimedes' principle: the upward buoyant force equals the weight of the displaced fluid, F = ρ·V·g. An object floats when that force is at least its own weight (i.e. its average density is below the fluid's). 🔒 In your browser.</p>
    </div>
  );
}
