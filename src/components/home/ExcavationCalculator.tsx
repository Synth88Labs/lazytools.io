import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n >= 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString('en-US');

export default function ExcavationCalculator() {
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [L, setL] = useState('20');
  const [W, setW] = useState('10');
  const [depthSmall, setDepthSmall] = useState(''); // depth in inches (ft) or cm (m)
  const [density, setDensity] = useState(''); // material density
  const [swell, setSwell] = useState('25'); // swell / bulking factor %
  const [truck, setTruck] = useState(''); // truck capacity in volume unit

  const D = unit === 'ft'
    ? { len: 'ft', small: 'in', toSmall: 12, vol: 'yd³', volDiv: 27, densDef: 2200, densUnit: 'lb/yd³', wt: 'US tons', wtDiv: 2000, truckDef: 10 }
    : { len: 'm', small: 'cm', toSmall: 100, vol: 'm³', volDiv: 1, densDef: 1600, densUnit: 'kg/m³', wt: 'tonnes', wtDiv: 1000, truckDef: 8 };

  const r = useMemo(() => {
    const l = num(L), w = num(W), ds = num(depthSmall);
    if (l == null || w == null || ds == null || l <= 0 || w <= 0 || ds <= 0) return null;
    const depth = ds / D.toSmall; // depth in big length unit
    const volRaw = l * w * depth; // in big-unit³ (ft³ or m³)
    const vol = volRaw / D.volDiv; // yd³ or m³
    const dens = num(density) ?? D.densDef;
    const weight = (vol * dens) / D.wtDiv; // tons or tonnes
    const swellPct = num(swell) ?? 0;
    const loose = vol * (1 + swellPct / 100); // bulked-up volume to haul
    const cap = num(truck) ?? D.truckDef;
    const loads = cap > 0 ? Math.ceil(loose / cap) : null;
    return { vol, weight, loose, loads };
  }, [L, W, depthSmall, density, swell, truck, unit]);

  const inp = (val: string, set: (v: string) => void, label: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" min="0" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        <div class="ml-auto flex gap-2">
          {(['ft', 'm'] as const).map((u) => (
            <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'ft' ? 'Imperial' : 'Metric'}</button>
          ))}
        </div>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        {inp(L, setL, `Length (${D.len})`)}
        {inp(W, setW, `Width (${D.len})`)}
        {inp(depthSmall, setDepthSmall, `Depth (${D.small})`)}
        {inp(density, setDensity, `Soil density (${D.densUnit}, blank = ${D.densDef})`)}
        {inp(swell, setSwell, 'Swell / bulking (%)')}
        {inp(truck, setTruck, `Truck capacity (${D.vol}, blank = ${D.truckDef})`)}
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">In-ground volume</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.vol)} <span class="text-lg text-slate-500">{D.vol}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Weight</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.weight)} <span class="text-lg text-slate-500">{D.wt}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Loose volume to haul</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.loose)} <span class="text-lg text-slate-500">{D.vol}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Truckloads</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.loads ?? '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the dig’s length, width and depth.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Volume = length × width × depth. Excavated soil bulks up (swells) about 20–30% once loose, so haul volume exceeds the hole. Density varies: dry soil ≈ 2,200 lb/yd³ (1,600 kg/m³), wet or clay soil more. 🔒 In your browser.</p>
    </div>
  );
}
