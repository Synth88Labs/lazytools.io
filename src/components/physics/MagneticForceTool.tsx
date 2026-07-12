import { useMemo, useState } from 'preact/hooks';
import { lorentzForce, wireForce } from '../../lib/physics-extra';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4)).toString();

export default function MagneticForceTool() {
  const [mode, setMode] = useState<'charge' | 'wire'>('charge');
  // charge
  const [q, setQ] = useState('1.6e-19');
  const [v, setV] = useState('1e6');
  const [Bc, setBc] = useState('0.5');
  const [angC, setAngC] = useState('90');
  // wire
  const [B, setB] = useState('0.5');
  const [I, setI] = useState('10');
  const [L, setL] = useState('2');
  const [angW, setAngW] = useState('90');

  const F = useMemo(() => {
    if (mode === 'charge') {
      const a = num(q), b = num(v), c = num(Bc), d = num(angC);
      if (a == null || b == null || c == null || d == null) return null;
      return lorentzForce(a, b, c, d);
    }
    const a = num(B), b = num(I), c = num(L), d = num(angW);
    if (a == null || b == null || c == null || d == null) return null;
    return wireForce(a, b, c, d);
  }, [mode, q, v, Bc, angC, B, I, L, angW]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-1 rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('charge')} class={`flex-1 rounded-lg px-3 py-1.5 ${mode === 'charge' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600'}`}>Moving charge (F = qvB)</button>
        <button onClick={() => setMode('wire')} class={`flex-1 rounded-lg px-3 py-1.5 ${mode === 'wire' ? 'bg-white text-brand-800 shadow-sm' : 'text-slate-600'}`}>Current wire (F = BIL)</button>
      </div>

      {mode === 'charge' ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charge q (C)</span><input value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Velocity v (m/s)</span><input value={v} onInput={(e) => setV((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Field B (T)</span><input value={Bc} onInput={(e) => setBc((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Angle θ (°)</span><input value={angC} onInput={(e) => setAngC((e.target as HTMLInputElement).value)} class={inp} /></label>
        </div>
      ) : (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Field B (T)</span><input value={B} onInput={(e) => setB((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current I (A)</span><input value={I} onInput={(e) => setI((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length L (m)</span><input value={L} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Angle θ (°)</span><input value={angW} onInput={(e) => setAngW((e.target as HTMLInputElement).value)} class={inp} /></label>
        </div>
      )}

      {F != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Magnetic force</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(F)} N</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the values above.</p>}

      <p class="mt-4 text-xs text-slate-500">A magnetic field pushes on moving charge. For a single charge the Lorentz force is F = q·v·B·sinθ; for a current-carrying wire it's F = B·I·L·sinθ. The force is greatest when the motion (or current) is perpendicular to the field (θ = 90°) and zero when parallel. 🔒 In your browser.</p>
    </div>
  );
}
