import { useMemo, useState } from 'preact/hooks';
import { SENSORS, getSensor, circleOfConfusion, depthOfField } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmtM = (m: number | null) => m == null ? '∞' : m >= 1 ? `${m.toFixed(2)} m` : `${(m * 100).toFixed(0)} cm`;

export default function DepthOfFieldTool() {
  const [sensor, setSensor] = useState('ff');
  const [focal, setFocal] = useState('50');
  const [fnum, setFnum] = useState('2.8');
  const [dist, setDist] = useState('3');

  const r = useMemo(() => {
    const f = num(focal), n = num(fnum), d = num(dist);
    const s = getSensor(sensor);
    if (f == null || n == null || d == null || !s) return null;
    const coc = circleOfConfusion(s);
    return { ...depthOfField(f, n, coc, d), coc };
  }, [sensor, focal, fnum, dist]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor</span>
          <select value={sensor} onChange={(e) => setSensor((e.target as HTMLSelectElement).value)} class={sel}>{SENSORS.map((s) => <option value={s.id}>{s.name}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Focal length (mm)</span>
          <input type="number" step="any" value={focal} onInput={(e) => setFocal((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Aperture (f/)</span>
          <input type="number" step="any" value={fnum} onInput={(e) => setFnum((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Subject distance (m)</span>
          <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Near limit</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmtM(r.nearM)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Depth of field</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.totalM == null ? '∞' : fmtM(r.totalM)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Far limit</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmtM(r.farM)}</p></div>
          </div>
          <p class="mt-3 text-center text-sm text-slate-500">{fmtM(r.inFrontM)} in front · {r.behindM == null ? '∞' : fmtM(r.behindM)} behind · hyperfocal {fmtM(r.hyperfocalM)}</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the sensor, focal length, aperture and subject distance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Depth of field is the zone that looks acceptably sharp. It grows with a smaller aperture (higher f-number), a shorter lens, and a farther subject. Uses the circle of confusion = sensor diagonal ÷ 1500. At or beyond the hyperfocal distance, the far limit is infinity. 🔒 In your browser.</p>
    </div>
  );
}
