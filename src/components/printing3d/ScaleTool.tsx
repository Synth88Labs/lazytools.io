import { useMemo, useState } from 'preact/hooks';
import { scaleModel, fitScalePercent } from '../../lib/printing3d';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const opt = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : undefined; };
const fmt = (n: number, d = 2) => n.toLocaleString('en-US', { maximumFractionDigits: d });

export default function ScaleTool() {
  const [pct, setPct] = useState('200');
  const [x, setX] = useState('50');
  const [y, setY] = useState('30');
  const [z, setZ] = useState('20');

  const r = useMemo(() => {
    const p = num(pct);
    if (p == null) return null;
    return scaleModel(p, { x: opt(x), y: opt(y), z: opt(z) });
  }, [pct, x, y, z]);

  // bonus: fit-to-bed helper
  const [orig, setOrig] = useState('250');
  const [bed, setBed] = useState('220');
  const fit = useMemo(() => {
    const o = num(orig), b = num(bed);
    if (o == null || b == null) return null;
    return fitScalePercent(o, b);
  }, [orig, bed]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Scale (%)</span>
          <input type="number" step="any" value={pct} onInput={(e) => setPct((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original X (mm)</span>
          <input type="number" step="any" value={x} onInput={(e) => setX((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original Y (mm)</span>
          <input type="number" step="any" value={y} onInput={(e) => setY((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original Z (mm)</span>
          <input type="number" step="any" value={z} onInput={(e) => setZ((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Scaled size (mm)</p><p class="mt-1 text-xl font-extrabold text-brand-800">{[r.dims.x, r.dims.y, r.dims.z].filter((d) => d != null).map((d) => fmt(d!)).join(' × ') || '—'}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume / material change</p><p class="mt-1 text-2xl font-extrabold text-slate-700">×{fmt(r.volumeFactor, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Linear factor</p><p class="mt-1 text-2xl font-extrabold text-slate-700">×{fmt(r.factor, 3)}</p></div>
          </div>
          <p class="mt-2 text-xs text-slate-500">Scaling to {fmt(r.factor * 100, 0)}% multiplies each dimension by {fmt(r.factor, 2)}, but uses about <strong>{fmt(r.volumeFactor, 2)}×</strong> the filament — volume grows with the cube of the scale.</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a scale percentage (and optionally the original dimensions).</p>
      )}

      <div class="mt-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Fit-to-bed helper</p>
        <div class="grid gap-3 sm:grid-cols-3">
          <label class="block"><span class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Model's largest side (mm)</span>
            <input type="number" step="any" value={orig} onInput={(e) => setOrig((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Bed size (mm)</span>
            <input type="number" step="any" value={bed} onInput={(e) => setBed((e.target as HTMLInputElement).value)} class={inp} /></label>
          <div class="rounded-lg bg-slate-50 p-3 text-center ring-1 ring-slate-200"><p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Scale to fit</p><p class="mt-0.5 text-xl font-extrabold text-slate-700">{fit != null ? `${fmt(Math.min(fit, 100000), 1)}%` : '—'}</p></div>
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">The key gotcha: doubling a model's size (200%) makes it eight times the volume, so it needs roughly 8× the filament and print time — not twice. Slicing the scaled model gives the exact figures. 🔒 In your browser.</p>
    </div>
  );
}
