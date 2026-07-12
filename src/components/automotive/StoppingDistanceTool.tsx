import { useMemo, useState } from 'preact/hooks';
import { stoppingDistance } from '../../lib/automotive';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(3));
const GRIP: [string, number][] = [['Dry (0.7)', 0.7], ['Wet (0.4)', 0.4], ['Snow (0.2)', 0.2], ['Ice (0.1)', 0.1]];

export default function StoppingDistanceTool() {
  const [speed, setSpeed] = useState('100');
  const [speedUnit, setSpeedUnit] = useState<'kmh' | 'mph'>('kmh');
  const [reaction, setReaction] = useState('1.0');
  const [mu, setMu] = useState('0.7');

  const res = useMemo(() => {
    const s = num(speed), r = num(reaction), m = num(mu);
    if (s == null || r == null || m == null) return null;
    const kmh = speedUnit === 'mph' ? s * 1.609344 : s;
    const out = stoppingDistance(kmh, r, m);
    if (!out) return null;
    const toFt = (x: number) => x * 3.280839895;
    return { ...out, unit: speedUnit === 'mph' ? 'ft' : 'm', conv: speedUnit === 'mph' ? toFt : (x: number) => x };
  }, [speed, speedUnit, reaction, mu]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Speed</span>
          <div class="flex gap-1"><input type="number" step="any" value={speed} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={inp} />
            <select value={speedUnit} onChange={(e) => setSpeedUnit((e.target as HTMLSelectElement).value as 'kmh' | 'mph')} class={sel}><option value="kmh">km/h</option><option value="mph">mph</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reaction time (s)</span><input type="number" step="any" value={reaction} onInput={(e) => setReaction((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tyre–road grip (μ)</span><input type="number" step="any" value={mu} onInput={(e) => setMu((e.target as HTMLInputElement).value)} class={inp} />
          <div class="mt-1 flex flex-wrap gap-1">{GRIP.map(([l, v]) => <button onClick={() => setMu(String(v))} class="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] text-slate-600 hover:border-brand-400">{l}</button>)}</div></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Total stopping distance</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res.conv(res.total))} {res.unit}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Reaction distance</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.conv(res.reaction))} {res.unit}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Braking distance</p><p class="mt-1 font-mono text-2xl font-bold text-slate-800">{fmt(res.conv(res.braking))} {res.unit}</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter speed, reaction time and grip.</p>}

      <p class="mt-4 text-xs text-slate-500">Total stopping distance is reaction distance (speed × reaction time) plus braking distance (v² ÷ 2μg), where μ is the tyre–road friction coefficient. Braking distance grows with the square of speed — doubling your speed quadruples it — and grip falls sharply in the wet, snow and ice. Real distances also depend on the vehicle, tyres and brakes; this is a physics estimate. 🔒 In your browser.</p>
    </div>
  );
}
