import { useMemo, useState } from 'preact/hooks';
import { primingSugar, residualCo2, PRIMING_SUGARS } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });
const F_TO_C = (f: number) => ((f - 32) * 5) / 9;
const C_TO_F = (c: number) => (c * 9) / 5 + 32;

// A few typical target carbonation levels (CO2 volumes) by style.
const STYLES = [
  { name: 'British ales', vols: 2.0 },
  { name: 'American ales / lagers', vols: 2.4 },
  { name: 'Belgian ales', vols: 2.9 },
  { name: 'Wheat beer / saison', vols: 3.2 },
];

export default function PrimingSugarTool() {
  const [target, setTarget] = useState('2.4');
  const [temp, setTemp] = useState('20');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [volume, setVolume] = useState('20');
  const [sugar, setSugar] = useState(PRIMING_SUGARS[0].name);

  const gPerL = PRIMING_SUGARS.find((s) => s.name === sugar)!.gPerLPerVol;

  const r = useMemo(() => {
    const t = num(target), tp = num(temp), v = num(volume);
    if (t == null || tp == null || v == null) return null;
    const tempF = unit === 'C' ? C_TO_F(tp) : tp;
    const res = primingSugar(t, tempF, v, gPerL);
    if (!res) return null;
    return { ...res, residual: residualCo2(tempF) };
  }, [target, temp, unit, volume, sugar]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target CO₂ (volumes)</span>
          <input type="number" step="0.1" value={target} onInput={(e) => setTarget((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Beer temp (°{unit})</span>
          <div class="flex gap-2">
            <input type="number" step="any" value={temp} onInput={(e) => setTemp((e.target as HTMLInputElement).value)} class={inp} />
            <select class={sel} value={unit} onChange={(e) => { const u = (e.target as HTMLSelectElement).value as 'C' | 'F'; const cur = num(temp); if (cur != null) setTemp(String(Math.round((u === 'F' ? C_TO_F(cur) : F_TO_C(cur)) * 10) / 10)); setUnit(u); }}><option value="C">°C</option><option value="F">°F</option></select>
          </div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Batch volume (L)</span>
          <input type="number" step="any" value={volume} onInput={(e) => setVolume((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Sugar type</span>
          <select class={sel} value={sugar} onChange={(e) => setSugar((e.target as HTMLSelectElement).value)}>
            {PRIMING_SUGARS.map((s) => <option value={s.name}>{s.name}</option>)}
          </select></label>
      </div>

      <div class="mt-2 flex flex-wrap gap-1.5">
        {STYLES.map((s) => <button onClick={() => setTarget(String(s.vols))} class="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-brand-400 hover:text-brand-700">{s.name} · {s.vols}</button>)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Priming sugar</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.grams)} g</p><p class="mt-0.5 text-xs text-slate-500">{fmt(r.grams / 28.35, 2)} oz</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">CO₂ to add</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.co2ToAdd, 2)} vol</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Already in beer</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.residual, 2)} vol</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your target carbonation, beer temperature, batch volume and sugar.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Beer already holds dissolved CO₂ that depends on temperature — warmer beer holds less — so you only prime for the difference to your target. Use the highest temperature the beer reached after fermentation. Sugar factors are derived from CO₂ stoichiometry (corn sugar is dextrose monohydrate, so slightly more than table sugar by weight); published values vary a little. Dissolve the sugar in boiled water and mix gently to avoid oxidation. 🔒 In your browser.</p>
    </div>
  );
}
