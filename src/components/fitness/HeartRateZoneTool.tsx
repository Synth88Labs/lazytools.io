import { useMemo, useState } from 'preact/hooks';
import { maxHrTraditional, maxHrTanaka, maxHrGulati, karvonen, HR_ZONES } from '../../lib/fitness';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const round = (x: number) => Math.round(x);

type Formula = 'tanaka' | 'traditional' | 'gulati';

export default function HeartRateZoneTool() {
  const [age, setAge] = useState('30');
  const [rest, setRest] = useState('60');
  const [formula, setFormula] = useState<Formula>('tanaka');

  const r = useMemo(() => {
    const a = num(age), restHr = num(rest);
    if (a == null) return null;
    const maxHr = formula === 'tanaka' ? maxHrTanaka(a) : formula === 'gulati' ? maxHrGulati(a) : maxHrTraditional(a);
    const useKarvonen = restHr != null;
    const zones = HR_ZONES.map((z) => ({
      ...z,
      loBpm: useKarvonen ? karvonen(maxHr, restHr!, z.lo) : maxHr * z.lo,
      hiBpm: useKarvonen ? karvonen(maxHr, restHr!, z.hi) : maxHr * z.hi,
    }));
    return { maxHr, useKarvonen, zones };
  }, [age, rest, formula]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const colors = ['bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800', 'bg-amber-100 text-amber-800', 'bg-orange-100 text-orange-800', 'bg-red-100 text-red-800'];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Age</span>
          <input type="number" step="1" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Resting HR (optional)</span>
          <input type="number" step="1" value={rest} onInput={(e) => setRest((e.target as HTMLInputElement).value)} class={inp} placeholder="for Karvonen" /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Max-HR formula</span>
          <select value={formula} onChange={(e) => setFormula((e.target as HTMLSelectElement).value as Formula)} class={sel}>
            <option value="tanaka">Tanaka (208 − 0.7 × age)</option><option value="traditional">Traditional (220 − age)</option><option value="gulati">Gulati (women)</option>
          </select></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-3 text-center ring-1 ring-slate-200">
            <span class="text-sm text-slate-600">Estimated maximum heart rate</span>
            <span class="ml-2 text-2xl font-extrabold text-brand-800">{round(r.maxHr)} bpm</span>
            <span class="ml-2 text-xs text-slate-400">{r.useKarvonen ? '· zones via Karvonen (HR reserve)' : '· zones as % of max HR'}</span>
          </div>
          <div class="mt-4 space-y-2">
            {r.zones.map((z, i) => (
              <div class="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <span class={`rounded-lg px-2.5 py-1 text-xs font-bold ${colors[i]}`}>{z.name}</span>
                <span class="flex-1 text-sm text-slate-600">{z.desc} <span class="text-slate-400">({round(z.lo * 100)}–{round(z.hi * 100)}%)</span></span>
                <span class="font-mono text-sm font-bold text-slate-800">{round(z.loBpm)}–{round(z.hiBpm)} bpm</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your age. Add a resting heart rate for more personalised (Karvonen) zones.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Max-HR formulas are population estimates — an actual max can vary ±10–12 bpm. With a resting HR, zones use the Karvonen heart-rate-reserve method: target = (max − rest) × %intensity + rest. Not medical advice. 🔒 In your browser.</p>
    </div>
  );
}
