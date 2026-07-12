import { useMemo, useState } from 'preact/hooks';
import { C_KMS, AU_KM, LY_KM, PARSEC_KM } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => {
  if (x >= 1e6 || (x < 1e-3 && x > 0)) return x.toExponential(3);
  return Number(x.toPrecision(6)).toLocaleString();
};

type Unit = 'km' | 'au' | 'ly' | 'pc';
const TO_KM: Record<Unit, number> = { km: 1, au: AU_KM, ly: LY_KM, pc: PARSEC_KM };

function humanTime(seconds: number): string {
  if (seconds < 1) return `${(seconds * 1000).toFixed(1)} ms`;
  if (seconds < 60) return `${seconds.toFixed(2)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(2)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} h`;
  if (seconds < 86400 * 365.25) return `${(seconds / 86400).toFixed(2)} days`;
  return `${(seconds / (86400 * 365.25)).toFixed(3)} years`;
}

const PRESETS: { name: string; km: number }[] = [
  { name: 'Moon', km: 384400 }, { name: 'Sun', km: AU_KM },
  { name: 'Mars (avg)', km: 2.25e8 }, { name: 'Proxima Centauri', km: 4.0175e13 },
];

export default function LightTimeTool() {
  const [dist, setDist] = useState('1');
  const [unit, setUnit] = useState<Unit>('au');

  const r = useMemo(() => {
    const d = num(dist);
    if (d == null) return null;
    const km = d * TO_KM[unit];
    const seconds = km / C_KMS;
    return { km, seconds, au: km / AU_KM, ly: km / LY_KM, pc: km / PARSEC_KM };
  }, [dist, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance</span>
        <div class="flex gap-2 sm:w-80">
          <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} />
          <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as Unit)} class={sel}>
            <option value="km">km</option><option value="au">AU</option><option value="ly">light-years</option><option value="pc">parsecs</option>
          </select>
        </div>
      </label>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button onClick={() => { setDist(String(p.km)); setUnit('km'); }} class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">{p.name}</button>
        ))}
      </div>

      {r ? (
        <>
          <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Light travel time</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{humanTime(r.seconds)}</p>
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-4">
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">km</p><p class="mt-1 text-sm font-bold text-slate-800">{fmt(r.km)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">AU</p><p class="mt-1 text-sm font-bold text-slate-800">{fmt(r.au)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">light-years</p><p class="mt-1 text-sm font-bold text-slate-800">{fmt(r.ly)}</p></div>
            <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">parsecs</p><p class="mt-1 text-sm font-bold text-slate-800">{fmt(r.pc)}</p></div>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a distance.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Light travels 299,792.458 km every second. So you see the Moon as it was 1.3 seconds ago, the Sun 8.3 minutes ago, and the nearest star over 4 years ago. Units: 1 AU = Earth–Sun distance, 1 light-year ≈ 9.46 trillion km, 1 parsec ≈ 3.26 ly. 🔒 In your browser.</p>
    </div>
  );
}
