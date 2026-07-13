import { useMemo, useState } from 'preact/hooks';
import { schwarzschildRadiusM, M_SUN_KG } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const EARTH_KG = 5.972e24;

const UNITS: Record<string, number> = {
  'solar masses': M_SUN_KG,
  'Earth masses': EARTH_KG,
  'kilograms': 1,
};

function fmtLength(m: number): string {
  if (m >= 9.461e15) return `${Number((m / 9.461e15).toPrecision(4))} light-years`;
  if (m >= 1.496e11) return `${Number((m / 1.496e11).toPrecision(4))} AU`;
  if (m >= 1e3) return `${Number((m / 1e3).toPrecision(4))} km`;
  if (m >= 1) return `${Number(m.toPrecision(4))} m`;
  if (m >= 1e-3) return `${Number((m * 1e3).toPrecision(4))} mm`;
  return `${Number((m * 1e6).toPrecision(4))} µm`;
}

export default function SchwarzschildTool() {
  const [mass, setMass] = useState('1');
  const [unit, setUnit] = useState('solar masses');

  const r = useMemo(() => {
    const m = num(mass);
    if (m == null) return null;
    const kg = m * UNITS[unit];
    const rs = schwarzschildRadiusM(kg);
    return rs == null ? null : { rs, diameter: rs * 2 };
  }, [mass, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Mass</span>
        <div class="flex gap-1 sm:w-80"><input type="number" step="any" value={mass} onInput={(e) => setMass((e.target as HTMLInputElement).value)} class={inp} />
          <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value)} class={sel}>{Object.keys(UNITS).map((u) => <option value={u}>{u}</option>)}</select></div></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Schwarzschild radius</p><p class="mt-1 text-2xl font-extrabold text-brand-800">{fmtLength(r.rs)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Event-horizon diameter</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmtLength(r.diameter)}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter a mass.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The Schwarzschild radius is how small a mass must be squeezed to become a (non-rotating) black hole — the radius of its event horizon: r = 2GM ÷ c². It works out to about 2.95 km per solar mass, so the Sun would need to collapse to under 3 km across, and the whole Earth to about 9 mm. 🔒 In your browser.</p>
    </div>
  );
}
