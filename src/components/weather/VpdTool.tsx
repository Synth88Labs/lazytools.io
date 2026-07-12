import { useMemo, useState } from 'preact/hooks';
import { vpd, fToC } from '../../lib/weather';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(3)).toString();

// grow-stage VPD guidance (kPa)
function zone(v: number) {
  if (v < 0.4) return { label: 'Too humid — disease/mould risk', color: 'text-blue-700' };
  if (v < 0.8) return { label: 'Propagation / early veg', color: 'text-emerald-700' };
  if (v < 1.2) return { label: 'Vegetative growth', color: 'text-emerald-700' };
  if (v < 1.6) return { label: 'Flowering / fruiting', color: 'text-amber-700' };
  return { label: 'Too dry — plant stress risk', color: 'text-rose-700' };
}

export default function VpdTool() {
  const [airT, setAirT] = useState('25');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [rh, setRh] = useState('50');
  const [leafOffset, setLeafOffset] = useState('0');

  const res = useMemo(() => {
    const a = num(airT), r = num(rh), off = num(leafOffset) ?? 0;
    if (a == null || r == null || r < 0 || r > 100) return null;
    const aC = unit === 'F' ? fToC(a) : a;
    const offC = unit === 'F' ? off * 5 / 9 : off;
    return vpd(aC, r, aC + offC);
  }, [airT, unit, rh, leafOffset]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Air temperature</span>
          <div class="flex gap-1"><input type="number" step="any" value={airT} onInput={(e) => setAirT((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'C' | 'F')} class={sel}><option value="C">°C</option><option value="F">°F</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Relative humidity (%)</span><input type="number" step="any" value={rh} onInput={(e) => setRh((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Leaf temp offset (°{unit})</span><input type="number" step="any" value={leafOffset} onInput={(e) => setLeafOffset((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res != null ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Vapour pressure deficit</p>
          <p class="mt-1 font-mono text-3xl font-extrabold text-brand-800">{fmt(res)} kPa</p>
          <p class={`mt-1 text-sm font-semibold ${zone(res).color}`}>{zone(res).label}</p>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter air temperature and relative humidity.</p>}

      <p class="mt-4 text-xs text-slate-500">VPD is the gap between how much moisture the air holds and how much it could hold at leaf temperature — the "drying power" that drives transpiration. VPD = SVP(leaf) − SVP(air)×RH. Growers target roughly 0.4–0.8 kPa for clones/seedlings, 0.8–1.2 for veg and 1.2–1.6 for flower. Set a leaf offset (leaves often run 1–3° cooler than the air). 🔒 In your browser.</p>
    </div>
  );
}
