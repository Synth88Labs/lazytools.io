import { useMemo, useState } from 'preact/hooks';
import { evChargingTime } from '../../lib/automotive';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const CHARGERS: [string, number][] = [['3-pin (2.3)', 2.3], ['Home AC (7.4)', 7.4], ['3-phase (11)', 11], ['3-phase (22)', 22], ['DC rapid (50)', 50], ['DC fast (150)', 150], ['Ultra (350)', 350]];

function fmtHours(h: number): string {
  const totalMin = Math.round(h * 60);
  const hh = Math.floor(totalMin / 60), mm = totalMin % 60;
  return hh > 0 ? `${hh} h ${mm} min` : `${mm} min`;
}

export default function EvChargingTool() {
  const [batt, setBatt] = useState('60');
  const [start, setStart] = useState('20');
  const [end, setEnd] = useState('80');
  const [kw, setKw] = useState('11');
  const [eff, setEff] = useState('90');

  const res = useMemo(() => {
    const b = num(batt), s = num(start), e = num(end), k = num(kw), ef = num(eff);
    if (b == null || s == null || e == null || k == null || ef == null) return null;
    return evChargingTime(b, s, e, k, ef / 100);
  }, [batt, start, end, kw, eff]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Battery capacity (kWh)</span><input type="number" step="any" value={batt} onInput={(e) => setBatt((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start charge (%)</span><input type="number" step="any" value={start} onInput={(e) => setStart((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target charge (%)</span><input type="number" step="any" value={end} onInput={(e) => setEnd((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charger power (kW)</span><input type="number" step="any" value={kw} onInput={(e) => setKw((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Charging efficiency (%)</span><input type="number" step="any" value={eff} onInput={(e) => setEff((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1">{CHARGERS.map(([l, v]) => <button onClick={() => setKw(String(v))} class="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">{l}</button>)}</div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Charging time</p><p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmtHours(res.hours)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Energy added</p><p class="mt-1 font-mono text-3xl font-extrabold text-slate-800">{Number(res.energyNeeded.toPrecision(3))} kWh</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the battery, charge levels and charger power (target must exceed start).</p>}

      <p class="mt-4 text-xs text-slate-500">Charging time = energy needed ÷ (charger power × efficiency), where energy needed = battery capacity × the change in state of charge. Real charging slows as the battery fills — DC rapid charging tapers sharply above ~80%, so this is an average estimate. AC charging is limited by the car's onboard charger, not just the wall unit. 🔒 In your browser.</p>
    </div>
  );
}
