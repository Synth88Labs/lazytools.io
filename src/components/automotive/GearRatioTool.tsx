import { useMemo, useState } from 'preact/hooks';
import { parseTire, tireDims, roadSpeed, engineRpm } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

type Solve = 'speed' | 'rpm';

export default function GearRatioTool() {
  const [solve, setSolve] = useState<Solve>('speed');
  const [gear, setGear] = useState('1.0');
  const [axle, setAxle] = useState('3.55');
  const [tire, setTire] = useState('225/45R17');
  const [rpm, setRpm] = useState('3000');
  const [speed, setSpeed] = useState('100');

  const r = useMemo(() => {
    const g = num(gear), a = num(axle);
    const spec = parseTire(tire);
    if (g == null || a == null || !spec) return null;
    const dia = tireDims(spec).diameterMm;
    const total = g * a;
    if (solve === 'speed') {
      const rp = num(rpm);
      if (rp == null) return null;
      const rs = roadSpeed(rp, total, dia);
      return { total, rs, dia };
    } else {
      const sp = num(speed);
      if (sp == null) return null;
      const er = engineRpm(sp, total, dia);
      return { total, engineRpm: er, dia };
    }
  }, [solve, gear, axle, tire, rpm, speed]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([['speed', 'RPM → speed'], ['rpm', 'Speed → RPM']] as const).map(([s, lbl]) => (
          <button onClick={() => setSolve(s)} class={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${solve === s ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{lbl}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Transmission gear ratio</span>
          <input type="number" step="any" value={gear} onInput={(e) => setGear((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Final drive (axle) ratio</span>
          <input type="number" step="any" value={axle} onInput={(e) => setAxle((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tire size</span>
          <input value={tire} onInput={(e) => setTire((e.target as HTMLInputElement).value)} class={inp} /></label>
        {solve === 'speed' ? (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Engine RPM</span>
            <input type="number" step="any" value={rpm} onInput={(e) => setRpm((e.target as HTMLInputElement).value)} class={inp} /></label>
        ) : (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Speed (km/h)</span>
            <input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total drive ratio</p>
            <p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.total, 2)}:1</p>
          </div>
          {solve === 'speed' && r.rs ? (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Road speed</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.rs.mph)} <span class="text-lg text-slate-500">mph</span></p>
              <p class="mt-1 text-xs text-slate-400">{fmt(r.rs.kmh)} km/h</p>
            </div>
          ) : solve === 'rpm' && r.engineRpm != null ? (
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Engine RPM</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.engineRpm, 0)}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the gear ratio, final drive and a valid tire size.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Total ratio = gear × final drive. Wheel RPM = engine RPM ÷ total ratio; speed = wheel RPM × tire circumference. A numerically higher final drive gives quicker acceleration but higher cruising RPM. 🔒 In your browser.</p>
    </div>
  );
}
