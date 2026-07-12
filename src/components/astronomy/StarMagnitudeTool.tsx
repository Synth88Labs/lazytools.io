import { useMemo, useState } from 'preact/hooks';
import { absoluteMagnitude, apparentMagnitude, distanceFromMagnitudes, distanceModulus, brightnessRatio } from '../../lib/astronomy-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const pos = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { maximumFractionDigits: d });

type Solve = 'M' | 'm' | 'd';

export default function StarMagnitudeTool() {
  const [solve, setSolve] = useState<Solve>('M');
  const [app, setApp] = useState('0'); // apparent magnitude
  const [abs, setAbs] = useState('4.83');
  const [dist, setDist] = useState('10'); // parsecs

  const r = useMemo(() => {
    const m = num(app), M = num(abs), d = pos(dist);
    if (solve === 'M') {
      if (m == null || d == null) return null;
      const val = absoluteMagnitude(m, d);
      return val == null ? null : { label: 'Absolute magnitude (M)', value: fmt(val), mod: distanceModulus(d) };
    }
    if (solve === 'm') {
      if (M == null || d == null) return null;
      const val = apparentMagnitude(M, d);
      return val == null ? null : { label: 'Apparent magnitude (m)', value: fmt(val), mod: distanceModulus(d) };
    }
    if (m == null || M == null) return null;
    const dv = distanceFromMagnitudes(m, M);
    return { label: 'Distance', value: `${fmt(dv)} pc (${fmt(dv * 3.26156)} ly)`, mod: m - M };
  }, [solve, app, abs, dist]);

  // brightness comparison
  const [b1, setB1] = useState('1'); const [b2, setB2] = useState('6');
  const ratio = useMemo(() => {
    const a = num(b1), b = num(b2);
    if (a == null || b == null) return null;
    return brightnessRatio(Math.min(a, b), Math.max(a, b));
  }, [b1, b2]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setSolve('M')} class={`rounded-lg px-3 py-1 ${solve === 'M' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Find absolute mag</button>
        <button onClick={() => setSolve('m')} class={`rounded-lg px-3 py-1 ${solve === 'm' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Find apparent mag</button>
        <button onClick={() => setSolve('d')} class={`rounded-lg px-3 py-1 ${solve === 'd' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Find distance</button>
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Apparent magnitude (m)</span>
          <input type="number" step="any" value={app} disabled={solve === 'm'} onInput={(e) => setApp((e.target as HTMLInputElement).value)} class={`${inp} ${solve === 'm' ? 'opacity-40' : ''}`} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Absolute magnitude (M)</span>
          <input type="number" step="any" value={abs} disabled={solve === 'M'} onInput={(e) => setAbs((e.target as HTMLInputElement).value)} class={`${inp} ${solve === 'M' ? 'opacity-40' : ''}`} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance (parsecs)</span>
          <input type="number" step="any" value={dist} disabled={solve === 'd'} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={`${inp} ${solve === 'd' ? 'opacity-40' : ''}`} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{r.label}</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.value}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Distance modulus (m − M)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.mod != null ? fmt(r.mod) : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the two known values to solve for the third.</p>
      )}

      <div class="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Brightness comparison</p>
        <div class="flex flex-wrap items-end gap-3">
          <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Magnitude A</span><input type="number" step="any" value={b1} onInput={(e) => setB1((e.target as HTMLInputElement).value)} class={`${inp} w-24`} /></label>
          <label class="block"><span class="mb-1 block text-[11px] text-slate-400">Magnitude B</span><input type="number" step="any" value={b2} onInput={(e) => setB2((e.target as HTMLInputElement).value)} class={`${inp} w-24`} /></label>
          <p class="text-sm text-slate-600">The brighter is <strong class="text-brand-800">{ratio != null ? `${fmt(ratio, ratio > 100 ? 0 : 2)}×` : '—'}</strong> brighter.</p>
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Apparent magnitude (m) is how bright a star looks from Earth; absolute magnitude (M) is how bright it would look at 10 parsecs — a fair comparison of true luminosity. They relate through the distance: m − M = 5·log₁₀(d) − 5. The magnitude scale is backwards (smaller = brighter) and logarithmic: every 5 magnitudes is exactly a 100× brightness ratio, so one magnitude ≈ 2.512×. 🔒 In your browser.</p>
    </div>
  );
}
