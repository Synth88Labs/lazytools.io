import { useState, useMemo } from 'preact/hooks';
import { escapeVelocity } from '../../lib/physics-extra';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const n = (s: string) => { const v = parseFloat(s); return isFinite(v) && v > 0 ? v : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toLocaleString('en-US', { maximumSignificantDigits: 5 });
// [label, mass kg, radius m]
const BODIES: [string, number, number][] = [
  ['Earth', 5.972e24, 6.371e6], ['Moon', 7.342e22, 1.7374e6], ['Mars', 6.417e23, 3.3895e6],
  ['Jupiter', 1.898e27, 6.9911e7], ['Sun', 1.989e30, 6.9634e8], ['Ceres', 9.39e20, 4.73e5],
];

export default function EscapeVelocityTool() {
  const [mass, setMass] = useState('5.972e24');
  const [radius, setRadius] = useState('6.371e6');

  const v = useMemo(() => { const m = n(mass), r = n(radius); return m != null && r != null ? escapeVelocity(m, r) : null; }, [mass, radius]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass of body (kg)</span><input type="text" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Radius / distance (m)</span><input type="text" value={radius} onInput={(e) => setRadius((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {BODIES.map(([lbl, m, r]) => <button onClick={() => { setMass(String(m)); setRadius(String(r)); }} class="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">{lbl}</button>)}
      </div>

      {v != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Escape velocity</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(v / 1000)} km/s</p>
          <p class="mt-1 text-xs text-slate-500">= {fmt(v)} m/s · {fmt(v * 3.6)} km/h · Mach {fmt(v / 343)}</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the body's mass and radius (scientific notation like 5.972e24 works).</p>}

      <p class="mt-4 text-xs text-slate-500">Escape velocity is the speed needed to break free of a body's gravity without further propulsion: v = √(2GM/r), with G = 6.6743×10⁻¹¹. It's √2 times the circular-orbit speed at the same radius, and independent of the escaping object's mass. 🔒 In your browser.</p>
    </div>
  );
}
