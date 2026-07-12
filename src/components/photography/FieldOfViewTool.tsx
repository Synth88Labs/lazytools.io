import { useMemo, useState } from 'preact/hooks';
import { SENSORS, getSensor, angleOfView, frameSizeM, diagonal } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function FieldOfViewTool() {
  const [sensor, setSensor] = useState('ff');
  const [focal, setFocal] = useState('50');
  const [dist, setDist] = useState('10');

  const r = useMemo(() => {
    const f = num(focal), d = num(dist);
    const s = getSensor(sensor);
    if (f == null || d == null || !s) return null;
    const h = angleOfView(s.width, f), v = angleOfView(s.height, f), diag = angleOfView(diagonal(s), f);
    return { h, v, diag, frameW: frameSizeM(h, d), frameH: frameSizeM(v, d) };
  }, [sensor, focal, dist]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor</span>
          <select value={sensor} onChange={(e) => setSensor((e.target as HTMLSelectElement).value)} class={sel}>{SENSORS.map((s) => <option value={s.id}>{s.name}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Focal length (mm)</span>
          <input type="number" step="any" value={focal} onInput={(e) => setFocal((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Subject distance (m)</span>
          <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Horizontal</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.h)}°</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Vertical</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.v)}°</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Diagonal</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.diag)}°</p></div>
          </div>
          <p class="mt-3 text-center text-sm text-slate-500">At {fmt(num(dist)!, 0)} m you capture a frame ≈ <strong>{fmt(r.frameW)} × {fmt(r.frameH)} m</strong>.</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the sensor, focal length and distance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Angle of view = 2 × arctan(sensor dimension ÷ (2 × focal length)) — narrower for longer lenses and smaller sensors. A 50mm lens is a "normal" ~47° diagonal on full frame. The frame size shows how much of a scene fits at a given distance. 🔒 In your browser.</p>
    </div>
  );
}
