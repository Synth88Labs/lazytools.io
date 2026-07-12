import { useMemo, useState } from 'preact/hooks';
import { collision1d } from '../../lib/physics-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pos = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 3) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function CollisionTool() {
  const [m1, setM1] = useState('2');
  const [u1, setU1] = useState('3');
  const [m2, setM2] = useState('1');
  const [u2, setU2] = useState('0');
  const [type, setType] = useState<'elastic' | 'inelastic' | 'custom'>('elastic');
  const [e, setE] = useState('1');

  const rest = type === 'elastic' ? 1 : type === 'inelastic' ? 0 : (num(e) ?? 1);

  const r = useMemo(() => {
    const a = pos(m1), b = pos(m2), ua = num(u1), ub = num(u2);
    if (a == null || b == null || ua == null || ub == null) return null;
    return collision1d(a, ua, b, ub, Math.max(0, Math.min(1, rest)));
  }, [m1, u1, m2, u2, rest]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setType('elastic')} class={`rounded-lg px-3 py-1 ${type === 'elastic' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Elastic</button>
        <button onClick={() => setType('inelastic')} class={`rounded-lg px-3 py-1 ${type === 'inelastic' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Perfectly inelastic</button>
        <button onClick={() => setType('custom')} class={`rounded-lg px-3 py-1 ${type === 'custom' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Custom e</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass m₁ (kg)</span>
          <input type="number" step="any" value={m1} onInput={(ev) => setM1((ev.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Velocity u₁ (m/s)</span>
          <input type="number" step="any" value={u1} onInput={(ev) => setU1((ev.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass m₂ (kg)</span>
          <input type="number" step="any" value={m2} onInput={(ev) => setM2((ev.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Velocity u₂ (m/s)</span>
          <input type="number" step="any" value={u2} onInput={(ev) => setU2((ev.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      {type === 'custom' && (
        <label class="mt-3 block max-w-xs"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Coefficient of restitution e (0–1)</span>
          <input type="number" step="0.05" min="0" max="1" value={e} onInput={(ev) => setE((ev.target as HTMLInputElement).value)} class={inp} /></label>
      )}

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Final velocity v₁</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.v1)} m/s</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Final velocity v₂</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.v2)} m/s</p></div>
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Momentum (conserved)</p><p class="mt-1 text-lg font-extrabold text-slate-700">{fmt(r.momentum)} kg·m/s</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">KE before → after</p><p class="mt-1 text-lg font-extrabold text-slate-700">{fmt(r.keBefore, 1)} → {fmt(r.keAfter, 1)} J</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Kinetic energy lost</p><p class="mt-1 text-lg font-extrabold text-slate-700">{fmt(r.keLost, 2)} J</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the two masses and their initial velocities (negative = moving the other way).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Momentum is always conserved: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. In a perfectly <strong>elastic</strong> collision (e = 1) kinetic energy is also conserved; in a perfectly <strong>inelastic</strong> one (e = 0) the objects stick together and the most kinetic energy is lost to heat/sound. The coefficient of restitution e sets where between those a real collision falls. 🔒 In your browser.</p>
    </div>
  );
}
