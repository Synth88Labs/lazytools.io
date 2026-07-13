import { useMemo, useState } from 'preact/hooks';
import { tirePressureAtTemp } from '../../lib/automotive';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function TirePressureTempTool() {
  const [pressure, setPressure] = useState('32');
  const [from, setFrom] = useState('70');
  const [to, setTo] = useState('40');
  const [tUnit, setTUnit] = useState<'F' | 'C'>('F');

  const r = useMemo(() => {
    const p = num(pressure), f = num(from), t = num(to);
    if (p == null || f == null || t == null) return null;
    const fF = tUnit === 'F' ? f : f * 9 / 5 + 32;
    const tF = tUnit === 'F' ? t : t * 9 / 5 + 32;
    const newP = tirePressureAtTemp(p, fF, tF);
    if (newP == null) return null;
    return { newP, change: newP - p, tF, fF };
  }, [pressure, from, to, tUnit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Set pressure (psi)</span>
          <input type="number" step="any" value={pressure} onInput={(e) => setPressure((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Temp when set (°{tUnit})</span>
          <div class="flex gap-1"><input type="number" step="any" value={from} onInput={(e) => setFrom((e.target as HTMLInputElement).value)} class={inp} />
            <select value={tUnit} onChange={(e) => setTUnit((e.target as HTMLSelectElement).value as 'F' | 'C')} class={sel}><option value="F">°F</option><option value="C">°C</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Current temp (°{tUnit})</span>
          <input type="number" step="any" value={to} onInput={(e) => setTo((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pressure now</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.newP)} <span class="text-lg text-slate-500">psi</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Change</p><p class={`mt-1 text-2xl font-extrabold ${r.change < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{r.change >= 0 ? '+' : ''}{fmt(r.change)} psi</p><p class="mt-0.5 text-xs text-slate-400">{r.change < 0 ? 'colder → top up' : 'warmer → higher reading'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your set pressure and the two temperatures.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Tire pressure follows Gay-Lussac\'s law: for a fixed volume of air, pressure rises and falls with absolute temperature. As a rule of thumb it changes about 1 psi for every 10 °F (roughly 0.07 bar per 5 °C). A cold snap drops your pressure — so check and top up, since low pressure hurts handling, wear and fuel economy. Always set pressure on cold tires. 🔒 In your browser.</p>
    </div>
  );
}
