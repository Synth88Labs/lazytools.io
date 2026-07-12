import { useMemo, useState } from 'preact/hooks';
import { terminalVelocity } from '../../lib/physics-extra';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4)).toString();
const CD: [string, number][] = [['Sphere (0.47)', 0.47], ['Skydiver, belly (1.0)', 1.0], ['Skydiver, dive (0.7)', 0.7], ['Flat plate (1.28)', 1.28], ['Car (0.30)', 0.30]];
const FLUID: [string, number][] = [['Air (1.225)', 1.225], ['Water (1000)', 1000]];

export default function TerminalVelocityTool() {
  const [mass, setMass] = useState('80');
  const [area, setArea] = useState('0.7');
  const [cd, setCd] = useState('1.0');
  const [rho, setRho] = useState('1.225');

  const v = useMemo(() => {
    const m = num(mass), a = num(area), c = num(cd), r = num(rho);
    if (m == null || a == null || c == null || r == null) return null;
    return terminalVelocity(m, a, c, r);
  }, [mass, area, cd, rho]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass (kg)</span><input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Frontal area (m²)</span><input type="number" step="any" value={area} onInput={(e) => setArea((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Drag coefficient (Cd)</span><input type="number" step="any" value={cd} onInput={(e) => setCd((e.target as HTMLInputElement).value)} class={inp} />
          <div class="mt-1 flex flex-wrap gap-1">{CD.map(([l, v2]) => <button onClick={() => setCd(String(v2))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fluid density (kg/m³)</span><input type="number" step="any" value={rho} onInput={(e) => setRho((e.target as HTMLInputElement).value)} class={inp} />
          <div class="mt-1 flex flex-wrap gap-1">{FLUID.map(([l, v2]) => <button onClick={() => setRho(String(v2))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div></label>
      </div>

      {v != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Terminal velocity</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(v)} m/s</p>
          <p class="mt-1 text-xs text-slate-500">= {fmt(v * 3.6)} km/h · {fmt(v * 2.23694)} mph</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter mass, frontal area, drag coefficient and fluid density.</p>}

      <p class="mt-4 text-xs text-slate-500">Terminal velocity is the steady falling speed where drag balances weight: v = √(2mg ÷ (ρ·A·Cd)), with ρ the fluid density, A the frontal area and Cd the drag coefficient. A belly-down skydiver reaches about 55 m/s (200 km/h); a streamlined dive is much faster. 🔒 In your browser.</p>
    </div>
  );
}
