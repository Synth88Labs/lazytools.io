import { useMemo, useState } from 'preact/hooks';
import { SENSORS, getSensor, cropFactor, diagonal } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function CropFactorTool() {
  const [sensor, setSensor] = useState('apsc-nikon');
  const [focal, setFocal] = useState('35');
  const [fnum, setFnum] = useState('1.8');

  const r = useMemo(() => {
    const f = num(focal), n = num(fnum);
    const s = getSensor(sensor);
    if (f == null || !s) return null;
    const crop = cropFactor(s);
    return {
      crop, diag: diagonal(s), width: s.width, height: s.height,
      equivFocal: f * crop, equivAperture: n != null ? n * crop : null,
    };
  }, [sensor, focal, fnum]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor</span>
          <select value={sensor} onChange={(e) => setSensor((e.target as HTMLSelectElement).value)} class={sel}>{SENSORS.map((s) => <option value={s.id}>{s.name}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lens focal length (mm)</span>
          <input type="number" step="any" value={focal} onInput={(e) => setFocal((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Lens aperture (f/, optional)</span>
          <input type="number" step="any" value={fnum} onInput={(e) => setFnum((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Crop factor</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.crop, 2)}×</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Equiv. focal length</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.equivFocal, 0)} mm</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Equiv. aperture (DoF)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.equivAperture != null ? `f/${fmt(r.equivAperture)}` : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Choose a sensor and enter the lens focal length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Crop factor = 43.3 mm (full-frame diagonal) ÷ your sensor's diagonal. Multiply your lens's focal length by it for the full-frame-equivalent field of view. The equivalent aperture (× crop) matches the depth of field and total light — but not the exposure, which the crop doesn't change. 🔒 In your browser.</p>
    </div>
  );
}
