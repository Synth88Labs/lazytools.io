import { useMemo, useState } from 'preact/hooks';
import { chargeTime } from '../../lib/solar';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

export default function ChargeTimeTool() {
  const [ah, setAh] = useState('100');
  const [current, setCurrent] = useState('20');
  const [ineff, setIneff] = useState('15');

  const r = useMemo(() => {
    const a = num(ah), c = num(current), inf = parseFloat(ineff);
    if (a == null || c == null || !isFinite(inf) || inf < 0) return null;
    const res = chargeTime(a, c, 1 + inf / 100);
    if (!res) return null;
    const h = Math.floor(res.hours);
    const m = Math.round((res.hours - h) * 60);
    return { ...res, h, m };
  }, [ah, current, ineff]);

  const cRateNote = r ? (r.cRate <= 0.3 ? 'gentle — fine for any battery including lead-acid' : r.cRate <= 0.5 ? 'moderate — good for lithium, high for lead-acid' : 'fast — suitable for lithium (LiFePO4); too high for lead-acid') : '';

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Battery capacity (Ah)</span>
          <input type="number" step="any" value={ah} onInput={(e) => setAh((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charge current (A)</span>
          <input type="number" step="any" value={current} onInput={(e) => setCurrent((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charging losses (%)</span>
          <input type="number" step="any" value={ineff} onInput={(e) => setIneff((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Charge time (empty → full)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{r.h} h {r.m} m</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Charge rate</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.cRate.toFixed(2)}C</p><p class="mt-0.5 text-xs text-slate-500">{cRateNote}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the battery capacity, the charge current and a losses allowance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Time ≈ capacity ÷ charge current, plus ~10–20% for charging losses. The C-rate is the current relative to capacity (a 100 Ah battery at 20 A = 0.2C). Keep it gentle for lead-acid (~0.1–0.3C); lithium (LiFePO4) accepts faster charging (0.5C and up). For solar, the "charge current" is what your panels/controller actually deliver, which varies through the day — so real charging takes longer than this best-case figure. 🔒 In your browser.</p>
    </div>
  );
}
