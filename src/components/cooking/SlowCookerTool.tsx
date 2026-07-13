import { useMemo, useState } from 'preact/hooks';
import { slowCookerConvert } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const hr = ([a, b]: [number, number]) => `${a}–${b} hours`;

export default function SlowCookerTool() {
  const [value, setValue] = useState('30');
  const [unit, setUnit] = useState<'min' | 'hr'>('min');

  const r = useMemo(() => {
    const v = num(value);
    if (v == null) return null;
    return slowCookerConvert(unit === 'min' ? v : v * 60);
  }, [value, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block sm:w-72"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Conventional recipe cooking time</span>
        <div class="flex gap-1"><input type="number" step="any" value={value} onInput={(e) => setValue((e.target as HTMLInputElement).value)} class={inp} />
          <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'min' | 'hr')} class={sel}><option value="min">minutes</option><option value="hr">hours</option></select></div></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Slow cooker — Low</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{hr(r.lowHours)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Slow cooker — High</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{hr(r.highHours)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the recipe's conventional cooking time.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A rough conversion from oven/stovetop time to a slow cooker: roughly 1 hour of conventional cooking becomes about 4–6 hours on Low or 1.5–2.5 on High. Low and High reach the same temperature (~90–100°C); High just gets there faster. Reduce added liquid by about a third (the lid traps steam), and add dairy or delicate vegetables near the end. Times vary with your cooker and how full it is — check for doneness. 🔒 In your browser.</p>
    </div>
  );
}
