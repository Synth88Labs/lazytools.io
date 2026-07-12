import { useMemo, useState } from 'preact/hooks';
import { volumetricFlow, maxSpeedForFlow } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function VolumetricFlowTool() {
  const [layer, setLayer] = useState('0.2');
  const [width, setWidth] = useState('0.4');
  const [speed, setSpeed] = useState('80');
  const [maxFlow, setMaxFlow] = useState('12');

  const r = useMemo(() => {
    const l = num(layer), w = num(width), s = num(speed), mf = num(maxFlow);
    if (l == null || w == null || s == null) return null;
    const q = volumetricFlow(l, w, s)!;
    const maxSpeed = mf != null ? maxSpeedForFlow(mf, l, w) : null;
    return { q, maxSpeed, mf, exceeds: mf != null && q > mf };
  }, [layer, width, speed, maxFlow]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Layer height (mm)</span>
          <input type="number" step="any" value={layer} onInput={(e) => setLayer((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Line width (mm)</span>
          <input type="number" step="any" value={width} onInput={(e) => setWidth((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Print speed (mm/s)</span>
          <input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Hotend max flow (mm³/s)</span>
          <input type="number" step="any" value={maxFlow} onInput={(e) => setMaxFlow((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class={`rounded-xl p-4 text-center ring-2 ${r.exceeds ? 'bg-amber-50 ring-amber-200' : 'bg-white ring-brand-200'}`}><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Required volumetric flow</p><p class={`mt-1 text-3xl font-extrabold ${r.exceeds ? 'text-amber-700' : 'text-brand-800'}`}>{fmt(r.q, 2)} mm³/s</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max speed at this line</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.maxSpeed != null ? `${fmt(r.maxSpeed, 0)} mm/s` : '—'}</p></div>
          </div>
          {r.exceeds && <p class="mt-2 text-sm font-medium text-amber-700">⚠️ This exceeds your hotend's {r.mf} mm³/s limit — expect under-extrusion. Slow down, use a thinner layer or narrower line, or fit a high-flow hotend.</p>}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your layer height, line width and print speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Volumetric flow = layer height × line width × speed — the plastic your hotend must melt each second. A standard hotend manages roughly 10–15 mm³/s; high-flow / Volcano-style hotends reach 20–40+. If your required flow tops your hotend's limit, the print under-extrudes no matter what the speed says. 🔒 In your browser.</p>
    </div>
  );
}
