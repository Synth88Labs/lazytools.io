import { useMemo, useState } from 'preact/hooks';
import { keplerPeriodYears, keplerAxisAU } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 4) => Number(x.toPrecision(d)).toString();

type Solve = 'period' | 'axis';

export default function KeplerTool() {
  const [solve, setSolve] = useState<Solve>('period');
  const [axis, setAxis] = useState('1.524');
  const [period, setPeriod] = useState('1.881');
  const [mass, setMass] = useState('1');

  const r = useMemo(() => {
    const m = num(mass);
    if (m == null) return null;
    if (solve === 'period') {
      const a = num(axis);
      if (a == null) return null;
      const p = keplerPeriodYears(a, m);
      return p == null ? null : { value: p, unit: 'years', label: 'Orbital period', days: p * 365.25 };
    }
    const p = num(period);
    if (p == null) return null;
    const a = keplerAxisAU(p, m);
    return a == null ? null : { value: a, unit: 'AU', label: 'Semi-major axis' };
  }, [solve, axis, period, mass]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        <button onClick={() => setSolve('period')} class={tog(solve === 'period')}>Find period</button>
        <button onClick={() => setSolve('axis')} class={tog(solve === 'axis')}>Find distance</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        {solve === 'period' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Semi-major axis (AU)</span>
            <input type="number" step="any" value={axis} onInput={(e) => setAxis((e.target as HTMLInputElement).value)} class={inp} /></label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Orbital period (years)</span>
            <input type="number" step="any" value={period} onInput={(e) => setPeriod((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Central mass (solar masses)</span>
          <input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.label}</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.value)} <span class="text-xl text-slate-500">{r.unit}</span></p>
          {r.days != null && <p class="mt-1 text-xs text-slate-400">≈ {fmt(r.days, 5)} days</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the values above.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Kepler\'s third law: P² = a³ ÷ M, with the period P in years, the semi-major axis a in astronomical units and the central mass M in solar masses. For the Sun (M = 1) it\'s simply P = √(a³) — Earth at 1 AU orbits in 1 year, Mars at 1.52 AU in 1.88 years. Set M to model other stars or planets. 🔒 In your browser.</p>
    </div>
  );
}
