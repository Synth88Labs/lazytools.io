import { useMemo, useState } from 'preact/hooks';
import { mashEfficiency } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

function verdict(eff: number): { label: string; cls: string } {
  if (eff >= 90) return { label: 'Unusually high — double-check your numbers', cls: 'bg-amber-50 text-amber-800 ring-amber-200' };
  if (eff >= 75) return { label: 'Excellent efficiency', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-200' };
  if (eff >= 65) return { label: 'Good, typical all-grain efficiency', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-200' };
  if (eff >= 55) return { label: 'A bit low — check crush, mash pH and sparge', cls: 'bg-amber-50 text-amber-800 ring-amber-200' };
  return { label: 'Low — finer crush, longer mash or better sparge may help', cls: 'bg-rose-50 text-rose-900 ring-rose-200' };
}

export default function MashEfficiencyTool() {
  const [og, setOg] = useState('1.050');
  const [grain, setGrain] = useState('10');
  const [ppg, setPpg] = useState('36');
  const [volume, setVolume] = useState('5');
  const [unit, setUnit] = useState<'us' | 'metric'>('us');

  const r = useMemo(() => {
    const o = num(og), g = num(grain), p = num(ppg), v = num(volume);
    if (o == null || g == null || p == null || v == null) return null;
    const grainLb = unit === 'us' ? g : g * 2.2046226;
    const volGal = unit === 'us' ? v : v * 0.264172;
    const eff = mashEfficiency(o, grainLb, p, volGal);
    return eff == null ? null : { eff };
  }, [og, grain, ppg, volume, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['us', 'metric'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>{u === 'us' ? 'lb / gal' : 'kg / L'}</button>)}
      </div>
      <div class="grid gap-3 sm:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Measured OG</span>
          <input type="number" step="any" value={og} onInput={(e) => setOg((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Grain weight ({unit === 'us' ? 'lb' : 'kg'})</span>
          <input type="number" step="any" value={grain} onInput={(e) => setGrain((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Grain potential (PPG)</span>
          <input type="number" step="any" value={ppg} onInput={(e) => setPpg((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Batch volume ({unit === 'us' ? 'gal' : 'L'})</span>
          <input type="number" step="any" value={volume} onInput={(e) => setVolume((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mash / brewhouse efficiency</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{fmt(r.eff)}%</p>
          </div>
          <p class={`mt-3 rounded-lg p-3 text-sm ring-1 ${verdict(r.eff).cls}`}>{verdict(r.eff).label}</p>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your OG, grain bill and batch volume.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Efficiency = the gravity points you got ÷ the most the grain could give. Actual points are (OG − 1) × 1000; the maximum is grain weight × its potential (PPG, ~36–37 for base malt) ÷ batch volume in gallons. Most all-grain brewers land at 65–80%. A finer crush, correct mash pH, full 60-minute mash and efficient sparge all raise it. 🔒 In your browser.</p>
    </div>
  );
}
