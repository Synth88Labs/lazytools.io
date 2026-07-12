import { useMemo, useState } from 'preact/hooks';
import { SENSORS, getSensor, circleOfConfusion, hyperfocalM } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmtM = (m: number) => m >= 1 ? `${m.toFixed(2)} m` : `${(m * 100).toFixed(0)} cm`;

export default function HyperfocalTool() {
  const [sensor, setSensor] = useState('ff');
  const [focal, setFocal] = useState('24');
  const [fnum, setFnum] = useState('8');

  const r = useMemo(() => {
    const f = num(focal), n = num(fnum);
    const s = getSensor(sensor);
    if (f == null || n == null || !s) return null;
    const coc = circleOfConfusion(s);
    const H = hyperfocalM(f, n, coc);
    return { H, nearFocus: H / 2, coc };
  }, [sensor, focal, fnum]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor</span>
          <select value={sensor} onChange={(e) => setSensor((e.target as HTMLSelectElement).value)} class={sel}>{SENSORS.map((s) => <option value={s.id}>{s.name}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Focal length (mm)</span>
          <input type="number" step="any" value={focal} onInput={(e) => setFocal((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Aperture (f/)</span>
          <input type="number" step="any" value={fnum} onInput={(e) => setFnum((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Hyperfocal distance</p><p class="mt-1 text-4xl font-extrabold text-brand-800">{fmtM(r.H)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Sharp from (½ hyperfocal)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmtM(r.nearFocus)} → ∞</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Choose a sensor and enter the focal length and aperture.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Focus at the hyperfocal distance (H = focal²⁄(f-number × CoC) + focal) and everything from half that distance to infinity is acceptably sharp — the classic trick for maximising depth of field in landscapes. A wider lens and smaller aperture bring the hyperfocal distance closer. 🔒 In your browser.</p>
    </div>
  );
}
