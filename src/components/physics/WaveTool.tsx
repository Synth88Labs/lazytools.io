import { useMemo, useState } from 'preact/hooks';
import { G_EARTH } from '../../lib/physics-constants';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(5)).toString();

function WaveMode() {
  const [A, setA] = useState('1');
  const [lambda, setLambda] = useState('2');
  const [f, setF] = useState('5');

  const r = useMemo(() => {
    const a = num(A), l = num(lambda), fr = num(f);
    if (a == null || l == null || fr == null || l <= 0) return null;
    return { A: a, lambda: l, f: fr, v: fr * l, T: fr !== 0 ? 1 / fr : Infinity, omega: 2 * Math.PI * fr, k: (2 * Math.PI) / l };
  }, [A, lambda, f]);

  const svg = useMemo(() => {
    if (!r) return null;
    const W = 560, H = 160, mid = H / 2, pad = 10;
    const cycles = 2.2; // show ~2 wavelengths
    const N = 240;
    const amp = (H / 2 - pad) * 0.9;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
      const frac = i / N;
      const x = pad + frac * (W - 2 * pad);
      const phase = frac * cycles * 2 * Math.PI;
      const y = mid - Math.sin(phase) * amp;
      pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    // wavelength marker (one full cycle width)
    const cycleW = (W - 2 * pad) / cycles;
    return { W, H, mid, path: pts.join(' '), pad, cycleW, ampPx: amp };
  }, [r]);

  const inp = (val: string, set: (v: string) => void, label: string, unit: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} <span class="text-slate-400">({unit})</span></span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(A, setA, 'Amplitude A', 'm')}
        {inp(lambda, setLambda, 'Wavelength λ', 'm')}
        {inp(f, setF, 'Frequency f', 'Hz')}
      </div>
      {r && svg ? (
        <>
          <div class="mt-4 overflow-x-auto rounded-xl bg-white p-2 ring-1 ring-slate-200">
            <svg viewBox={`0 0 ${svg.W} ${svg.H}`} class="mx-auto block w-full max-w-xl" role="img" aria-label="Sine wave with amplitude and wavelength marked">
              <line x1={svg.pad} y1={svg.mid} x2={svg.W - svg.pad} y2={svg.mid} stroke="#e2e8f0" />
              <path d={svg.path} fill="none" stroke="#4338ca" stroke-width="2.5" />
              {/* amplitude arrow */}
              <line x1={svg.pad + svg.cycleW * 0.25} y1={svg.mid} x2={svg.pad + svg.cycleW * 0.25} y2={svg.mid - svg.ampPx} stroke="#f59e0b" stroke-width="1.5" />
              <text x={svg.pad + svg.cycleW * 0.25 + 6} y={svg.mid - svg.ampPx / 2} class="fill-amber-600" style="font-size:10px">A</text>
              {/* wavelength bracket */}
              <line x1={svg.pad} y1={svg.H - 6} x2={svg.pad + svg.cycleW} y2={svg.H - 6} stroke="#0e9f6e" stroke-width="1.5" />
              <text x={svg.pad + svg.cycleW / 2} y={svg.H - 10} text-anchor="middle" class="fill-emerald-600" style="font-size:10px">λ</text>
            </svg>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[['Wave speed v = fλ', fmt(r.v), 'm/s'], ['Period T = 1/f', fmt(r.T), 's'], ['Angular freq ω', fmt(r.omega), 'rad/s'], ['Wavenumber k', fmt(r.k), 'rad/m']].map(([l, val, u]) => (
              <div class="rounded-xl bg-white p-3 text-center ring-2 ring-brand-200">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{l}</p>
                <p class="mt-1 font-mono text-base font-bold text-brand-800">{val} <span class="text-xs font-normal text-slate-400">{u}</span></p>
              </div>
            ))}
          </div>
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter amplitude, a positive wavelength and frequency.</p>}
      <p class="mt-3 text-xs text-slate-500">y = A·sin(kx − ωt). v = fλ · T = 1/f · ω = 2πf · k = 2π/λ.</p>
    </>
  );
}

function ShmMode() {
  const [type, setType] = useState<'pendulum' | 'spring'>('pendulum');
  const [L, setL] = useState('1');
  const [g, setG] = useState(String(G_EARTH));
  const [m, setM] = useState('0.5');
  const [k, setK] = useState('20');

  const T = useMemo(() => {
    if (type === 'pendulum') { const l = num(L), gg = num(g); if (l == null || gg == null || l < 0 || gg <= 0) return null; return 2 * Math.PI * Math.sqrt(l / gg); }
    const mm = num(m), kk = num(k); if (mm == null || kk == null || mm < 0 || kk <= 0) return null; return 2 * Math.PI * Math.sqrt(mm / kk);
  }, [type, L, g, m, k]);

  const inp = (val: string, set: (v: string) => void, label: string, unit: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label} <span class="text-slate-400">({unit})</span></span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <>
      <div class="mb-3 flex gap-2">
        {(['pendulum', 'spring'] as const).map((x) => (
          <button onClick={() => setType(x)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${type === x ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{x === 'pendulum' ? 'Simple pendulum' : 'Mass on a spring'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        {type === 'pendulum' ? (<>{inp(L, setL, 'Length L', 'm')}{inp(g, setG, 'Gravity g', 'm/s²')}</>) : (<>{inp(m, setM, 'Mass m', 'kg')}{inp(k, setK, 'Spring constant k', 'N/m')}</>)}
      </div>
      {T != null ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Period T</p>
            <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(T)} <span class="text-lg text-slate-500">s</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency f = 1/T</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(1 / T)} <span class="text-lg text-slate-500">Hz</span></p>
          </div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter positive values.</p>}
      <p class="mt-3 text-xs text-slate-500">{type === 'pendulum' ? 'T = 2π·√(L/g) — small swings only (< ~15°).' : 'T = 2π·√(m/k).'}</p>
    </>
  );
}

export default function WaveTool() {
  const [mode, setMode] = useState<'wave' | 'shm'>('wave');
  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-4 flex flex-wrap gap-2">
        {(['wave', 'shm'] as const).map((x) => (
          <button onClick={() => setMode(x)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${mode === x ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{x === 'wave' ? 'Wave (v = fλ)' : 'Simple harmonic motion'}</button>
        ))}
      </div>
      {mode === 'wave' ? <WaveMode /> : <ShmMode />}
      <p class="mt-4 text-xs text-slate-500">🔒 Computed in your browser.</p>
    </div>
  );
}
