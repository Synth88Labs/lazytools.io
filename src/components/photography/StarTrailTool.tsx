import { useMemo, useState } from 'preact/hooks';
import { SENSORS, getSensor, cropFactor, maxShutterSeconds } from '../../lib/photography';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

const RULES = [
  { n: 500, label: '500 (lenient — small prints/web)' },
  { n: 300, label: '300 (balanced)' },
  { n: 200, label: '200 (strict — high-res/pixel peeping)' },
];

export default function StarTrailTool() {
  const [sensorId, setSensorId] = useState('ff');
  const [focal, setFocal] = useState('24');
  const [rule, setRule] = useState(500);

  const r = useMemo(() => {
    const f = num(focal);
    const s = getSensor(sensorId);
    if (f == null || !s) return null;
    const crop = cropFactor(s);
    return { crop, secs: maxShutterSeconds(f, crop, rule), effFocal: f * crop };
  }, [sensorId, focal, rule]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sensor / camera</span>
          <select value={sensorId} onChange={(e) => setSensorId((e.target as HTMLSelectElement).value)} class={sel}>{SENSORS.map((s) => <option value={s.id}>{s.name}</option>)}</select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Focal length (mm)</span>
          <input type="number" step="any" value={focal} onInput={(e) => setFocal((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rule</span>
          <select value={rule} onChange={(e) => setRule(parseInt((e.target as HTMLSelectElement).value, 10))} class={sel}>{RULES.map((x) => <option value={x.n}>{x.label}</option>)}</select></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Max exposure before star trails</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.secs)} <span class="text-xl text-slate-500">sec</span></p>
          <p class="mt-2 text-xs text-slate-400">{fmt(r.effFocal, 0)}mm full-frame equivalent · crop factor {fmt(r.crop, 2)}×</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Choose a sensor and focal length.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The "500 rule": longest exposure (seconds) ≈ 500 ÷ (focal length × crop factor), which keeps stars as points rather than streaks as the Earth turns. A wider (shorter) lens allows longer exposures. Modern high-resolution sensors show trailing sooner, so many astrophotographers use 300 or 200 instead. For the sharpest results the NPF rule accounts for aperture and pixel pitch too. 🔒 In your browser.</p>
    </div>
  );
}
