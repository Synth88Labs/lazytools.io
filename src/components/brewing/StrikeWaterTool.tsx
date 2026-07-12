import { useMemo, useState } from 'preact/hooks';
import { strikeTemp } from '../../lib/brewing';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (n: number, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d });
const C_TO_F = (c: number) => (c * 9) / 5 + 32;
const F_TO_C = (f: number) => ((f - 32) * 5) / 9;
// water:grain ratio conversions — L/kg to qt/lb: 1 L/kg = 0.479 qt/lb
const LKG_TO_QTLB = 0.479305;

export default function StrikeWaterTool() {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [mash, setMash] = useState('67');
  const [grain, setGrain] = useState('20');
  const [ratio, setRatio] = useState('3'); // shown in L/kg for metric, qt/lb for imperial

  const r = useMemo(() => {
    const m = num(mash), g = num(grain), rr = num(ratio);
    if (m == null || g == null || rr == null || rr <= 0) return null;
    const mF = unit === 'C' ? C_TO_F(m) : m;
    const gF = unit === 'C' ? C_TO_F(g) : g;
    const ratioQtLb = unit === 'C' ? rr * LKG_TO_QTLB : rr;
    const sF = strikeTemp(mF, gF, ratioQtLb);
    if (sF == null) return null;
    return { strike: unit === 'C' ? F_TO_C(sF) : sF };
  }, [unit, mash, grain, ratio]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const swap = (u: 'C' | 'F') => {
    if (u === unit) return;
    const conv = (s: string) => { const v = num(s); return v == null ? s : String(Math.round((u === 'F' ? C_TO_F(v) : F_TO_C(v)) * 10) / 10); };
    setMash(conv(mash)); setGrain(conv(grain));
    const rr = num(ratio);
    if (rr != null) setRatio(String(Math.round((u === 'F' ? rr * LKG_TO_QTLB : rr / LKG_TO_QTLB) * 100) / 100));
    setUnit(u);
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex justify-end">
        <select class={sel} value={unit} onChange={(e) => swap((e.target as HTMLSelectElement).value as 'C' | 'F')}><option value="C">Metric (°C, L/kg)</option><option value="F">Imperial (°F, qt/lb)</option></select>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Target mash temp (°{unit})</span>
          <input type="number" step="any" value={mash} onInput={(e) => setMash((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Grain temp (°{unit})</span>
          <input type="number" step="any" value={grain} onInput={(e) => setGrain((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Water:grain ({unit === 'C' ? 'L/kg' : 'qt/lb'})</span>
          <input type="number" step="any" value={ratio} onInput={(e) => setRatio((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Heat your strike water to</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.strike)} °{unit}</p></div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your target mash temperature, grain temperature and water-to-grain ratio.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Strike water goes in hotter than the mash target because the cool, dry grain absorbs heat. Palmer's formula: strike = (0.2 ÷ ratio) × (mash − grain) + mash, where 0.2 is grain's heat capacity relative to water. A common ratio is about 3 L/kg (1.5 qt/lb). This assumes a room-temperature tun; a cold metal pot needs a little extra, so preheat it or aim a degree or two higher. 🔒 In your browser.</p>
    </div>
  );
}
