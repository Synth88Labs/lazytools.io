import { useMemo, useState } from 'preact/hooks';
import { angularSizeArcsec } from '../../lib/astronomy';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 3) => Number(x.toPrecision(d)).toString();

const PRESETS: { name: string; size: number; dist: number }[] = [
  { name: 'Full Moon', size: 3474, dist: 384400 },
  { name: 'Sun', size: 1391000, dist: 1.496e8 },
  { name: 'Jupiter (avg)', size: 139820, dist: 7.78e8 },
  { name: 'ISS overhead', size: 0.109, dist: 408 },
];

export default function AngularSizeTool() {
  const [size, setSize] = useState('3474');
  const [dist, setDist] = useState('384400');

  const r = useMemo(() => {
    const s = num(size), d = num(dist);
    if (s == null || d == null) return null;
    const arcsec = angularSizeArcsec(s, d);
    return { arcsec, arcmin: arcsec / 60, deg: arcsec / 3600 };
  }, [size, dist]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button onClick={() => { setSize(String(p.size)); setDist(String(p.dist)); }} class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300">{p.name}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Object diameter</span>
          <input type="number" step="any" value={size} onInput={(e) => setSize((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Distance (same units)</span>
          <input type="number" step="any" value={dist} onInput={(e) => setDist((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Degrees</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.deg)}°</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Arcminutes</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.arcmin)}′</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Arcseconds</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.arcsec)}″</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the object's diameter and distance (in the same units).</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Angular (apparent) size is how large something looks: θ = 2·arctan(diameter ÷ 2·distance). For distant objects this is the small-angle rule, θ(arcsec) ≈ 206,265 × size ÷ distance. The Moon and Sun both span about half a degree — which is why eclipses fit so neatly. 1° = 60′ = 3,600″. 🔒 In your browser.</p>
    </div>
  );
}
