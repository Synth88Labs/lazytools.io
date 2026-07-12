import { useMemo, useState } from 'preact/hooks';
import { stairs } from '../../lib/home';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4));

export default function StairCalculator() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [rise, setRise] = useState('112');
  const [target, setTarget] = useState('7.5');
  const [tread, setTread] = useState('10');

  const res = useMemo(() => {
    const r = num(rise), t = num(target), d = num(tread);
    if (r == null || t == null || d == null) return null;
    return stairs(r, t, d);
  }, [rise, target, tread]);

  const maxRiser = unit === 'in' ? 7.75 : 19.7;
  const minTread = unit === 'in' ? 10 : 25.4;
  const riserOk = res ? res.actualRiser <= maxRiser + 1e-9 : true;
  const treadOk = num(tread) ? num(tread)! >= minTread - 1e-9 : true;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex items-center gap-2"><span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Units</span>
        <select value={unit} onChange={(e) => { const u = (e.target as HTMLSelectElement).value as 'in' | 'cm'; setUnit(u); if (u === 'cm') { setTarget('19'); setTread('25'); } else { setTarget('7.5'); setTread('10'); } }} class={sel}><option value="in">inches</option><option value="cm">cm</option></select></div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Total rise (floor to floor)</span><input type="number" step="any" value={rise} onInput={(e) => setRise((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target riser height</span><input type="number" step="any" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tread depth (going)</span><input type="number" step="any" value={tread} onInput={(e) => setTread((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-4">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-2xl font-extrabold text-brand-800">{res.risers}</p><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">risers</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class={`font-mono text-2xl font-bold ${riserOk ? 'text-slate-800' : 'text-rose-700'}`}>{fmt(res.actualRiser)} {unit}</p><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">actual riser</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-bold text-slate-800">{fmt(res.run)} {unit}</p><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">total run ({res.treads} treads)</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-bold text-slate-800">{fmt(res.stringer)} {unit}</p><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">stringer length</p></div>
          </div>
          {(!riserOk || !treadOk) && <p class="mt-2 text-center text-xs font-semibold text-rose-700">{!riserOk ? `Riser exceeds the ~${maxRiser} ${unit} code maximum — add a riser. ` : ''}{!treadOk ? `Tread is below the ~${minTread} ${unit} code minimum.` : ''}</p>}
        </>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the total rise, a target riser height and the tread depth.</p>}

      <p class="mt-4 text-xs text-slate-500">The number of risers is the total rise divided by your target riser height, rounded to a whole number; the actual riser is the rise divided by that count. There\'s one fewer tread than risers, so the run is treads × tread depth, and the stringer length is √(rise² + run²). US IRC limits: riser ≤ 7¾″, tread ≥ 10″ — always confirm your local building code. 🔒 In your browser.</p>
    </div>
  );
}
