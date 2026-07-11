import { useMemo, useState } from 'preact/hooks';
import { parseTire, tireDims, speedoError } from '../../lib/automotive';

const fmt = (x: number, d = 2) => Number(x.toFixed(d)).toString();

export default function TireCompareTool() {
  const [oldCode, setOldCode] = useState('225/45R17');
  const [newCode, setNewCode] = useState('245/40R18');
  const [indicated, setIndicated] = useState('60');
  const [unit, setUnit] = useState<'mph' | 'kmh'>('mph');

  const r = useMemo(() => {
    const o = parseTire(oldCode), n = parseTire(newCode);
    if (!o || !n) return null;
    const od = tireDims(o), nd = tireDims(n);
    const ind = parseFloat(indicated);
    const se = isFinite(ind) ? speedoError(od, nd, ind) : null;
    return { od, nd, se, diaDiffPct: (nd.diameterMm / od.diameterMm - 1) * 100 };
  }, [oldCode, newCode, indicated]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original tire</span>
          <input value={oldCode} onInput={(e) => setOldCode((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">New tire</span>
          <input value={newCode} onInput={(e) => setNewCode((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <>
          <div class="mt-4 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
            <table class="w-full text-sm">
              <thead><tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th class="px-3 py-2">Spec</th><th class="px-3 py-2 text-right">Original</th><th class="px-3 py-2 text-right">New</th><th class="px-3 py-2 text-right">Δ</th></tr></thead>
              <tbody>
                <tr><td class="px-3 py-2 text-slate-600">Diameter</td><td class="px-3 py-2 text-right font-mono">{fmt(r.od.diameterIn)}″</td><td class="px-3 py-2 text-right font-mono">{fmt(r.nd.diameterIn)}″</td><td class={`px-3 py-2 text-right font-mono font-semibold ${r.diaDiffPct >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{r.diaDiffPct >= 0 ? '+' : ''}{fmt(r.diaDiffPct)}%</td></tr>
                <tr class="bg-slate-50"><td class="px-3 py-2 text-slate-600">Sidewall</td><td class="px-3 py-2 text-right font-mono">{fmt(r.od.sidewallMm, 0)} mm</td><td class="px-3 py-2 text-right font-mono">{fmt(r.nd.sidewallMm, 0)} mm</td><td class="px-3 py-2 text-right font-mono">{fmt(r.nd.sidewallMm - r.od.sidewallMm, 0)} mm</td></tr>
                <tr><td class="px-3 py-2 text-slate-600">Revs / mile</td><td class="px-3 py-2 text-right font-mono">{fmt(r.od.revsPerMile, 0)}</td><td class="px-3 py-2 text-right font-mono">{fmt(r.nd.revsPerMile, 0)}</td><td class="px-3 py-2 text-right font-mono">{fmt(r.nd.revsPerMile - r.od.revsPerMile, 0)}</td></tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex flex-wrap items-end gap-3">
            <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Speedometer reads</span>
              <input type="number" step="any" value={indicated} onInput={(e) => setIndicated((e.target as HTMLInputElement).value)} class={`${inp} w-28`} /></label>
            <div class="flex gap-1">{(['mph', 'kmh'] as const).map((u) => (
              <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-2 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>{u === 'mph' ? 'mph' : 'km/h'}</button>
            ))}</div>
          </div>
          {r.se && (
            <div class="mt-3 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-sm text-slate-600">With the new tires, at an indicated <strong>{fmt(parseFloat(indicated), 0)} {unit === 'mph' ? 'mph' : 'km/h'}</strong> you're actually doing</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.se.trueSpeed, 1)} <span class="text-lg text-slate-500">{unit === 'mph' ? 'mph' : 'km/h'}</span></p>
              <p class="mt-1 text-sm text-slate-500">speedometer error {r.se.pctDiff >= 0 ? 'reads slow by' : 'reads fast by'} {fmt(Math.abs(r.se.pctDiff))}%</p>
            </div>
          )}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter two tire sizes like <code>225/45R17</code> and <code>245/40R18</code>.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">A larger overall diameter makes your true speed higher than the speedometer shows (and the odometer under-count). Keep a size change within about ±3% of diameter for accurate readings and clearance. 🔒 In your browser.</p>
    </div>
  );
}
