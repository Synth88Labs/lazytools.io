import { useMemo, useState } from 'preact/hooks';
import { calibrateEsteps } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function EstepsTool() {
  const [current, setCurrent] = useState('93');
  const [requested, setRequested] = useState('100');
  const [actual, setActual] = useState('95');

  const r = useMemo(() => {
    const c = num(current), req = num(requested), a = num(actual);
    if (c == null || req == null || a == null) return null;
    const next = calibrateEsteps(c, req, a)!;
    const under = a < req;
    return { next, under, offPct: ((req - a) / req) * 100 };
  }, [current, requested, actual]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current E-steps (steps/mm)</span>
          <input type="number" step="any" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Requested extrusion (mm)</span>
          <input type="number" step="any" value={requested} onInput={(e) => setRequested((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Actually extruded (mm)</span>
          <input type="number" step="any" value={actual} onInput={(e) => setActual((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">New E-steps value</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.next.toFixed(2)} steps/mm</p>
          <p class="mt-2 text-sm text-slate-600">Your extruder {r.under ? 'under' : 'over'}-extruded by {Math.abs(r.offPct).toFixed(1)}%. Set this value with <span class="font-mono">M92 E{r.next.toFixed(2)}</span>, then <span class="font-mono">M500</span> to save.</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your current E-steps, how much you asked to extrude, and how much actually came out.</p>
      )}

      <div class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
        <p class="font-semibold text-slate-700">How to measure:</p>
        <ol class="mt-1 list-decimal space-y-0.5 pl-4">
          <li>Heat the nozzle to printing temperature and mark the filament 120 mm above the extruder inlet.</li>
          <li>Extrude 100 mm slowly (e.g. <span class="font-mono">G1 E100 F50</span>).</li>
          <li>Measure the gap that's left: 100 − gap = the amount actually extruded. Enter it above.</li>
        </ol>
      </div>

      <p class="mt-3 text-xs text-slate-500">New E-steps = current × (requested ÷ actually extruded). Extrude slowly and at temperature, and don't force the filament, or the measurement will be off. Save with M500 or the value resets on reboot. 🔒 In your browser.</p>
    </div>
  );
}
