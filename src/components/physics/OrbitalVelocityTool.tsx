import { useMemo, useState } from 'preact/hooks';
import { G_GRAV } from '../../lib/physics-constants';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

const PRESETS = [
  { label: 'Earth (5.972×10²⁴ kg)', value: 5.972e24 },
  { label: 'Sun (1.989×10³⁰ kg)', value: 1.989e30 },
  { label: 'Moon (7.348×10²² kg)', value: 7.348e22 },
  { label: 'Mars (6.417×10²³ kg)', value: 6.417e23 },
];

export default function OrbitalVelocityTool() {
  const [M, setM] = useState('5.972e24');
  const [r, setR] = useState('6.771e6');

  const res = useMemo(() => {
    const mass = num(M), radius = num(r);
    if (mass == null || radius == null || mass <= 0 || radius <= 0) return null;
    const v = Math.sqrt((G_GRAV * mass) / radius);
    const T = 2 * Math.PI * Math.sqrt(radius ** 3 / (G_GRAV * mass));
    return { v, T };
  }, [M, r]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Central mass M <span class="text-slate-400">(kg)</span></span>
          <input list="masses" type="number" step="any" value={M} onInput={(e) => setM((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          <datalist id="masses">{PRESETS.map((p) => <option value={p.value}>{p.label}</option>)}</datalist>
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Orbital radius r <span class="text-slate-400">(m, from centre)</span></span>
          <input type="number" step="any" value={r} onInput={(e) => setR((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
        </label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Orbital velocity v = √(GM/r)</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(res.v)} <span class="text-sm text-slate-500">m/s</span></p>
            <p class="mt-1 text-xs text-slate-400">{fmt(res.v / 1000)} km/s</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Orbital period T = 2π√(r³/GM)</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmt(res.T)} <span class="text-sm text-slate-500">s</span></p>
            <p class="mt-1 text-xs text-slate-400">{fmt(res.T / 60)} min · {fmt(res.T / 3600)} h</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a positive central mass and orbital radius (measured from the centre of the body).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Circular orbit: v = √(GM/r) and T = 2π·√(r³/GM), with G = 6.6743×10⁻¹¹. Defaults are a low Earth orbit (~400 km altitude). 🔒 In your browser.
      </p>
    </div>
  );
}
