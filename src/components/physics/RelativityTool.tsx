import { useMemo, useState } from 'preact/hooks';
import { relativity, dilatedTime, contractedLength, relativisticKE, totalEnergy, SPEED_OF_LIGHT } from '../../lib/physics-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 4) => {
  const a = Math.abs(n);
  if (a !== 0 && (a < 1e-3 || a >= 1e6)) return n.toExponential(3);
  return n.toLocaleString('en-US', { maximumFractionDigits: d });
};

export default function RelativityTool() {
  const [beta, setBeta] = useState('0.8'); // v as fraction of c
  const [properTime, setProperTime] = useState('1');
  const [properLength, setProperLength] = useState('1');
  const [mass, setMass] = useState('1');

  const r = useMemo(() => {
    const b = num(beta), t = num(properTime), l = num(properLength), m = num(mass);
    if (b == null || b >= 1) return null;
    const rel = relativity(b * SPEED_OF_LIGHT);
    if (!rel) return null;
    return {
      ...rel,
      dt: t != null ? dilatedTime(t, rel.gamma) : null,
      lc: l != null ? contractedLength(l, rel.gamma) : null,
      ke: m != null ? relativisticKE(m, rel.gamma) : null,
      E: m != null ? totalEnergy(m, rel.gamma) : null,
    };
  }, [beta, properTime, properLength, mass]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Speed (fraction of c)</span>
          <input type="number" step="0.01" min="0" max="0.999999" value={beta} onInput={(e) => setBeta((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Proper time (s)</span>
          <input type="number" step="any" value={properTime} onInput={(e) => setProperTime((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Proper length (m)</span>
          <input type="number" step="any" value={properLength} onInput={(e) => setProperLength((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rest mass (kg)</span>
          <input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Lorentz factor γ</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.gamma)}</p><p class="mt-0.5 text-xs text-slate-500">at {fmt(r.beta, 4)}c = {fmt(r.beta * SPEED_OF_LIGHT, 0)} m/s</p></div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dilated time</p><p class="mt-1 text-lg font-extrabold text-slate-700">{r.dt != null ? `${fmt(r.dt)} s` : '—'}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Contracted length</p><p class="mt-1 text-lg font-extrabold text-slate-700">{r.lc != null ? `${fmt(r.lc)} m` : '—'}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Kinetic energy</p><p class="mt-1 text-lg font-extrabold text-slate-700">{r.ke != null ? `${fmt(r.ke)} J` : '—'}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total energy</p><p class="mt-1 text-lg font-extrabold text-slate-700">{r.E != null ? `${fmt(r.E)} J` : '—'}</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a speed below c (as a fraction, e.g. 0.8), plus optional proper time, length and rest mass.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The Lorentz factor γ = 1 ÷ √(1 − (v/c)²) governs special relativity. A moving clock runs slow (time dilation ×γ), a moving object shortens along its motion (length contraction ÷γ), and its kinetic energy is (γ−1)mc² — diverging from ½mv² as v approaches c. Nothing with mass can reach c, where γ → ∞. Speeds are entered as a fraction of the speed of light (299,792,458 m/s). 🔒 In your browser.</p>
    </div>
  );
}
