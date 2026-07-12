import { useMemo, useState } from 'preact/hooks';
import { calibrateFlow } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function FlowTool() {
  const [current, setCurrent] = useState('100');
  const [target, setTarget] = useState('0.40');
  const [measured, setMeasured] = useState('0.42');

  const r = useMemo(() => {
    const c = num(current), t = num(target), m = num(measured);
    if (c == null || t == null || m == null) return null;
    const next = calibrateFlow(c, t, m)!;
    return { next, over: m > t };
  }, [current, target, measured]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current flow / EM (%)</span>
          <input type="number" step="any" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target wall (mm)</span>
          <input type="number" step="any" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Measured wall (mm)</span>
          <input type="number" step="any" value={measured} onInput={(e) => setMeasured((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">New flow / extrusion multiplier</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.next.toFixed(1)}%</p>
          <p class="mt-2 text-sm text-slate-600">Your wall printed {r.over ? 'thicker' : 'thinner'} than target, so flow comes {r.over ? 'down' : 'up'}. Enter this as the flow rate (Cura) or extrusion multiplier (PrusaSlicer/OrcaSlicer; ÷100 → {(r.next / 100).toFixed(3)}).</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your current flow %, the target wall thickness and what you measured.</p>
      )}

      <div class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
        <p class="font-semibold text-slate-700">How to measure:</p>
        <ol class="mt-1 list-decimal space-y-0.5 pl-4">
          <li>Print a single-wall calibration cube (0 top/bottom layers, 0% infill, 1 perimeter) at your line width.</li>
          <li>Measure the wall with calipers at several spots and average — that's the "measured wall".</li>
          <li>The "target wall" is your slicer's line width (often the nozzle size, e.g. 0.40 mm).</li>
        </ol>
      </div>

      <p class="mt-3 text-xs text-slate-500">New flow = current × (target ÷ measured). This is the classic single-wall method; the measurement is a little noisy, so average several readings and re-check after big changes. Calibrate E-steps first, then flow. 🔒 In your browser.</p>
    </div>
  );
}
