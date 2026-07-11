import { useMemo, useState } from 'preact/hooks';
import { parseTire, tireDims } from '../../lib/automotive';

const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function TireSizeTool() {
  const [code, setCode] = useState('225/45R17');

  const r = useMemo(() => {
    const spec = parseTire(code);
    if (!spec) return null;
    return { spec, dims: tireDims(spec) };
  }, [code]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tire size (e.g. 225/45R17)</span>
        <input value={code} onInput={(e) => setCode((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 sm:w-64" placeholder="225/45R17" />
      </label>

      {r ? (
        <>
          <div class="mt-4 flex flex-wrap gap-2 text-sm">
            <span class="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200"><strong class="text-slate-500">Width</strong> {r.spec.width} mm</span>
            <span class="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200"><strong class="text-slate-500">Aspect</strong> {r.spec.aspect}%</span>
            <span class="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200"><strong class="text-slate-500">Rim</strong> {r.spec.wheel}″</span>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall diameter</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.dims.diameterIn)}″</p>
              <p class="mt-1 text-xs text-slate-400">{fmt(r.dims.diameterMm, 0)} mm</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sidewall height</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.dims.sidewallMm, 1)} mm</p>
              <p class="mt-1 text-xs text-slate-400">{fmt(r.dims.sidewallMm / 25.4)}″</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Circumference</p>
              <p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.dims.circumferenceMm / 1000, 3)} m</p>
              <p class="mt-1 text-xs text-slate-400">{fmt(r.dims.circumferenceMm / 25.4)}″</p>
            </div>
          </div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Revolutions per mile</p><p class="mt-1 text-xl font-bold text-slate-700">{fmt(r.dims.revsPerMile, 0)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Revolutions per km</p><p class="mt-1 text-xl font-bold text-slate-700">{fmt(r.dims.revsPerKm, 0)}</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a tire size like <code>225/45R17</code> — width (mm) / aspect ratio (%) R rim (inches).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Overall diameter = rim + 2 × sidewall, where sidewall = width × aspect ratio. All exact geometry. 🔒 In your browser.</p>
    </div>
  );
}
