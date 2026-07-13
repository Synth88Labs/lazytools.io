import { useMemo, useState } from 'preact/hooks';
import { springPeriod } from '../../lib/physics-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 3) => Number(x.toPrecision(d)).toString();

export default function SpringOscillationTool() {
  const [mass, setMass] = useState('0.5');
  const [k, setK] = useState('200');

  const r = useMemo(() => {
    const m = num(mass), kk = num(k);
    if (m == null || kk == null) return null;
    const res = springPeriod(m, kk);
    return res == null ? null : { ...res, omega: 2 * Math.PI * res.frequency };
  }, [mass, k]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass (kg)</span>
          <input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Spring constant k (N/m)</span>
          <input type="number" step="any" value={k} onInput={(e) => setK((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Period</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(r.period)} <span class="text-base text-slate-500">s</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.frequency)} <span class="text-base text-slate-500">Hz</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Angular ω</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.omega)} <span class="text-base text-slate-500">rad/s</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a positive mass and spring constant.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A mass on a spring oscillates with period T = 2π·√(m/k), where m is the mass and k the spring stiffness. A heavier mass or a softer spring gives a slower oscillation; the angular frequency is ω = √(k/m) = 2πf. Gravity doesn\'t affect the period — it only shifts the equilibrium point. This assumes an ideal, massless spring and no damping. 🔒 In your browser.</p>
    </div>
  );
}
