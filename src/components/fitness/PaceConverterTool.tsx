import { useMemo, useState } from 'preact/hooks';
import { fmtPace } from '../../lib/fitness';

const M_PER_MILE = 1609.344;
function parseClock(s: string): number | null {
  const t = s.trim(); if (!t) return null;
  if (/^\d+(\.\d+)?$/.test(t)) return parseFloat(t) * 60;
  const parts = t.split(':').map((x) => parseFloat(x));
  if (parts.some((x) => !isFinite(x))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

type Unit = 'minkm' | 'minmi' | 'kmh' | 'mph';

export default function PaceConverterTool() {
  const [val, setVal] = useState('5:00');
  const [from, setFrom] = useState<Unit>('minkm');

  const r = useMemo(() => {
    // normalise to metres/second
    let mps: number | null = null;
    if (from === 'minkm') { const s = parseClock(val); mps = s ? 1000 / s : null; }
    else if (from === 'minmi') { const s = parseClock(val); mps = s ? M_PER_MILE / s : null; }
    else if (from === 'kmh') { const v = num(val); mps = v ? (v * 1000) / 3600 : null; }
    else { const v = num(val); mps = v ? (v * M_PER_MILE) / 3600 : null; }
    if (mps == null || mps <= 0) return null;
    return {
      secPerKm: 1000 / mps,
      secPerMile: M_PER_MILE / mps,
      kmh: (mps * 3600) / 1000,
      mph: (mps * 3600) / M_PER_MILE,
    };
  }, [val, from]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Value</span>
          <input value={val} onInput={(e) => setVal((e.target as HTMLInputElement).value)} class={inp} placeholder={from === 'minkm' || from === 'minmi' ? '5:00' : '12'} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unit</span>
          <select value={from} onChange={(e) => setFrom((e.target as HTMLSelectElement).value as Unit)} class={sel}>
            <option value="minkm">min/km (pace)</option><option value="minmi">min/mile (pace)</option><option value="kmh">km/h (speed)</option><option value="mph">mph (speed)</option>
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-2 sm:grid-cols-4">
          <div class="rounded-xl bg-white p-3 text-center ring-2 ring-brand-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Pace / km</p><p class="mt-1 text-lg font-extrabold text-slate-800">{fmtPace(r.secPerKm, 'km').replace(' /km', '')}</p></div>
          <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Pace / mile</p><p class="mt-1 text-lg font-extrabold text-slate-800">{fmtPace(r.secPerMile, 'mi').replace(' /mi', '')}</p></div>
          <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">km/h</p><p class="mt-1 text-lg font-extrabold text-slate-800">{r.kmh.toFixed(2)}</p></div>
          <div class="rounded-xl bg-white p-3 text-center ring-1 ring-slate-200"><p class="text-[10px] font-semibold uppercase tracking-wide text-slate-500">mph</p><p class="mt-1 text-lg font-extrabold text-slate-800">{r.mph.toFixed(2)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a pace (mm:ss) or speed.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Pace (min per distance) and speed (distance per time) are inverses. 1 mile = 1.609344 km exactly. 🔒 In your browser.</p>
    </div>
  );
}
