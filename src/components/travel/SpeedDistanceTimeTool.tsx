import { useMemo, useState } from 'preact/hooks';
import { solveSDT } from '../../lib/travel';
import { hoursMinutes } from '../../lib/travel';

const num = (s: string): number | null => { const n = parseFloat(s); return s.trim() !== '' && isFinite(n) ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

type Solve = 'distance' | 'speed' | 'time';

export default function SpeedDistanceTimeTool() {
  const [solve, setSolve] = useState<Solve>('time');
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [distance, setDistance] = useState('300');
  const [speed, setSpeed] = useState('60');
  const [hours, setHours] = useState('5');

  const r = useMemo(() => {
    const d = solve === 'distance' ? null : num(distance);
    const s = solve === 'speed' ? null : num(speed);
    const h = solve === 'time' ? null : num(hours);
    // require the two non-solved fields present
    if ((solve !== 'distance' && d == null) || (solve !== 'speed' && s == null) || (solve !== 'time' && h == null)) return null;
    return solveSDT(d, s, h);
  }, [solve, distance, speed, hours]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;
  const dist = unit === 'km' ? 'km' : 'mi';
  const spd = unit === 'km' ? 'km/h' : 'mph';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <span class="self-center text-sm text-slate-600">Solve for:</span>
        {(['distance', 'speed', 'time'] as const).map((s) => <button onClick={() => setSolve(s)} class={tog(solve === s)}>{s[0].toUpperCase() + s.slice(1)}</button>)}
        <span class="mx-1 self-center text-slate-300">|</span>
        {(['km', 'mi'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>{u}</button>)}
      </div>

      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance ({dist})</span>
          <input type="number" step="any" value={solve === 'distance' && r ? fmt(r.distance) : distance} disabled={solve === 'distance'} onInput={(e) => setDistance((e.target as HTMLInputElement).value)} class={`${inp} ${solve === 'distance' ? 'bg-brand-50 font-bold text-brand-800' : ''}`} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Speed ({spd})</span>
          <input type="number" step="any" value={solve === 'speed' && r ? fmt(r.speed) : speed} disabled={solve === 'speed'} onInput={(e) => setSpeed((e.target as HTMLInputElement).value)} class={`${inp} ${solve === 'speed' ? 'bg-brand-50 font-bold text-brand-800' : ''}`} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Time (hours)</span>
          <input type="number" step="any" value={solve === 'time' && r ? fmt(r.hours, 4) : hours} disabled={solve === 'time'} onInput={(e) => setHours((e.target as HTMLInputElement).value)} class={`${inp} ${solve === 'time' ? 'bg-brand-50 font-bold text-brand-800' : ''}`} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {solve === 'distance' ? 'Distance' : solve === 'speed' ? 'Average speed' : 'Travel time'}
          </p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">
            {solve === 'distance' && `${fmt(r.distance)} ${dist}`}
            {solve === 'speed' && `${fmt(r.speed)} ${spd}`}
            {solve === 'time' && (() => { const t = hoursMinutes(r.hours * 60); return `${t.h}h ${t.m}m`; })()}
          </p>
          {solve === 'time' && <p class="mt-1 text-xs text-slate-400">{fmt(r.hours, 3)} hours</p>}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the other two values.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The identity is distance = average speed × time. Give any two and the third follows: time = distance ÷ speed, speed = distance ÷ time. Keep units consistent (km with km/h, or miles with mph). This uses steady average speed, so real journeys with stops and traffic take longer. 🔒 In your browser.</p>
    </div>
  );
}
