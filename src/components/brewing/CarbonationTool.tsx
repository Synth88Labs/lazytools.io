import { useMemo, useState } from 'preact/hooks';
import { carbonationPressurePsi } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

const STYLES = [
  { label: 'British ales', vols: '1.5–2.0' },
  { label: 'American ales / lagers', vols: '2.2–2.7' },
  { label: 'Wheat / Belgian', vols: '3.0–4.0' },
];

export default function CarbonationTool() {
  const [unit, setUnit] = useState<'F' | 'C'>('F');
  const [temp, setTemp] = useState('38');
  const [vols, setVols] = useState('2.5');

  const r = useMemo(() => {
    const t = num(temp), v = num(vols);
    if (t == null || v == null) return null;
    const tF = unit === 'F' ? t : t * 9 / 5 + 32;
    const psi = carbonationPressurePsi(tF, v);
    if (psi == null) return null;
    return { psi, kpa: psi * 6.894757, bar: psi * 0.0689476 };
  }, [unit, temp, vols]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['F', 'C'] as const).map((u) => <button onClick={() => setUnit(u)} class={tog(unit === u)}>°{u}</button>)}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Beer temperature (°{unit})</span>
          <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target CO₂ (volumes)</span>
          <input type="number" step="any" value={vols} onInput={(e) => setVols((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-5 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Regulator pressure</p>
          <p class="mt-1 text-4xl font-extrabold text-brand-800">{r.psi > 0 ? fmt(r.psi) : '0'} <span class="text-xl text-slate-500">PSI</span></p>
          <p class="mt-1 text-xs text-slate-400">{fmt(r.kpa, 0)} kPa · {fmt(r.bar, 2)} bar{r.psi <= 0 ? ' — beer this cold already holds that much CO₂' : ''}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a temperature and a positive CO₂ volume.</p>
      )}

      <div class="mt-4 grid gap-2 sm:grid-cols-3 text-center text-xs">
        {STYLES.map((s) => <div class="rounded-lg bg-slate-50 p-2 ring-1 ring-slate-200"><span class="font-semibold text-slate-700">{s.label}</span><br />{s.vols} vols</div>)}
      </div>

      <p class="mt-4 text-xs text-slate-500">To force-carbonate in a keg, set your CO₂ regulator to this pressure and leave the beer at that temperature until it reaches equilibrium (about a week, or faster if you shake/rock the keg). Colder beer absorbs CO₂ more readily, so it needs less pressure for the same carbonation. Typical targets run 2.0–2.7 volumes for most beers. 🔒 In your browser.</p>
    </div>
  );
}
