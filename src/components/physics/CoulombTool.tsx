import { useMemo, useState } from 'preact/hooks';
import { coulombForce, electricField } from '../../lib/physics-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number) => {
  const a = Math.abs(n);
  if (a !== 0 && (a < 1e-3 || a >= 1e6)) return n.toExponential(3);
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
};

export default function CoulombTool() {
  const [q1, setQ1] = useState('1e-6');
  const [q2, setQ2] = useState('1e-6');
  const [r, setR] = useState('0.1');

  const res = useMemo(() => {
    const a = num(q1), b = num(q2), d = num(r);
    if (a == null || b == null || d == null) return null;
    const f = coulombForce(a, b, d);
    if (!f) return null;
    return { ...f, e1: electricField(a, d), e2: electricField(b, d) };
  }, [q1, q2, r]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charge q₁ (C)</span>
          <input type="text" value={q1} onInput={(e) => setQ1((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charge q₂ (C)</span>
          <input type="text" value={q2} onInput={(e) => setQ2((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Separation r (m)</span>
          <input type="text" value={r} onInput={(e) => setR((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Force magnitude</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(res.magnitude)} N</p></div>
          <div class={`rounded-xl p-4 text-center ring-2 ${res.attractive ? 'bg-blue-50 ring-blue-200' : 'bg-rose-50 ring-rose-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Direction</p><p class={`mt-1 text-2xl font-extrabold ${res.attractive ? 'text-blue-700' : 'text-rose-700'}`}>{res.attractive ? 'Attractive ↔' : 'Repulsive ↕'}</p><p class="mt-0.5 text-xs text-slate-500">{res.attractive ? 'opposite charges pull together' : 'like charges push apart'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the two charges (coulombs, e.g. 1e-6 for 1 µC) and their separation.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Coulomb's law: F = k·q₁·q₂ ÷ r², with k = 8.99×10⁹ N·m²/C². The force is repulsive when the charges have the same sign and attractive when opposite. Charges are in coulombs — use scientific notation for the usual micro- (1e-6) and nano- (1e-9) coulomb values. The field each charge creates at that distance is E = k·q ÷ r². 🔒 In your browser.</p>
    </div>
  );
}
