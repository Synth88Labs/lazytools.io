import { useMemo, useState } from 'preact/hooks';
import { fuelRange, type EfficiencyMode } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString();

const MODES: { id: EfficiencyMode; label: string; tank: string; dist: string }[] = [
  { id: 'mpg', label: 'mpg (US) + gallons', tank: 'gallons', dist: 'miles' },
  { id: 'kmL', label: 'km/L + litres', tank: 'litres', dist: 'km' },
  { id: 'l100km', label: 'L/100km + litres', tank: 'litres', dist: 'km' },
];

export default function FuelRangeTool() {
  const [mode, setMode] = useState<EfficiencyMode>('mpg');
  const [tank, setTank] = useState('12');
  const [eff, setEff] = useState('30');
  const [reserve, setReserve] = useState('10');

  const m = MODES.find((x) => x.id === mode)!;
  const r = useMemo(() => {
    const t = num(tank), e = num(eff);
    if (t == null || e == null) return null;
    const full = fuelRange(t, e, mode);
    if (full == null) return null;
    const pct = Math.max(0, Math.min(100, parseFloat(reserve) || 0));
    return { full, usable: full * (1 - pct / 100) };
  }, [mode, tank, eff, reserve]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block sm:w-72"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Units</span>
        <select value={mode} onChange={(e) => setMode((e.target as HTMLSelectElement).value as EfficiencyMode)} class={sel}>{MODES.map((x) => <option value={x.id}>{x.label}</option>)}</select></label>
      <div class="mt-3 grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tank capacity ({m.tank})</span>
          <input type="number" step="any" value={tank} onInput={(e) => setTank((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Fuel economy ({mode === 'l100km' ? 'L/100km' : mode === 'kmL' ? 'km/L' : 'mpg'})</span>
          <input type="number" step="any" value={eff} onInput={(e) => setEff((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reserve buffer (%)</span>
          <input type="number" step="any" min="0" max="100" value={reserve} onInput={(e) => setReserve((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Range on a full tank</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.full)} <span class="text-lg text-slate-500">{m.dist}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Safe range (keep {reserve || 0}% reserve)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.usable)} {m.dist}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your tank capacity and fuel economy.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Range is tank capacity × fuel economy (or tank ÷ L/100km × 100 for that unit). Real-world range is usually lower than this best case — highway driving, cold, headwinds, loads and city stop-start all cut economy. Keeping a reserve (10–15%) means you don\'t run the tank dry, which can also stress the fuel pump. 🔒 In your browser.</p>
    </div>
  );
}
