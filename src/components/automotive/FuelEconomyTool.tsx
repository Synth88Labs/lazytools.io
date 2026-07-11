import { useMemo, useState } from 'preact/hooks';
import { fuelFromUsMpg, fuelFromL100 } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

type Unit = 'usmpg' | 'ukmpg' | 'l100' | 'kmpl';

export default function FuelEconomyTool() {
  const [amt, setAmt] = useState('30');
  const [from, setFrom] = useState<Unit>('usmpg');

  const r = useMemo(() => {
    const a = num(amt);
    if (a == null) return null;
    if (from === 'usmpg') return fuelFromUsMpg(a);
    if (from === 'ukmpg') return fuelFromUsMpg(a * (3.785411784 / 4.54609));
    if (from === 'l100') return fuelFromL100(a);
    return fuelFromL100(100 / a); // km/L
  }, [amt, from]);

  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const out: [string, number, string][] = r ? [
    ['US MPG', r.usMpg, 'mpg'], ['UK (imperial) MPG', r.ukMpg, 'mpg'], ['Litres / 100 km', r.l100km, 'L'], ['Kilometres / litre', r.kmPerL, 'km/L'],
  ] : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount</span>
          <input type="number" step="any" value={amt} onInput={(e) => setAmt((e.target as HTMLInputElement).value)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unit</span>
          <select value={from} onChange={(e) => setFrom((e.target as HTMLSelectElement).value as Unit)} class={sel}>
            <option value="usmpg">US MPG</option><option value="ukmpg">UK (imperial) MPG</option><option value="l100">Litres / 100 km</option><option value="kmpl">Kilometres / litre</option>
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-2 sm:grid-cols-4">
          {out.map(([label, val, u]) => (
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200">
              <p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p class="mt-1 text-xl font-extrabold text-slate-800">{fmt(val)}</p>
              <p class="text-[10px] text-slate-400">{u}</p>
            </div>
          ))}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a fuel-economy figure.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The US and UK gallons differ (3.785 L vs 4.546 L), so US MPG and UK MPG are NOT the same — 30 US mpg is about 36 UK mpg. L/100 km is an inverse measure: lower is better. 🔒 In your browser.</p>
    </div>
  );
}
