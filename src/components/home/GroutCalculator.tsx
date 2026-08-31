import { useMemo, useState } from 'preact/hooks';
import { groutVolume } from '../../lib/home';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function GroutCalculator() {
  const [area, setArea] = useState('10');
  const [tileL, setTileL] = useState('300');
  const [tileW, setTileW] = useState('300');
  const [joint, setJoint] = useState('3');
  const [depth, setDepth] = useState('8');

  const res = useMemo(() => {
    const a = num(area), l = num(tileL), w = num(tileW), j = num(joint), d = num(depth);
    if (a == null || l == null || w == null || j == null || d == null) return null;
    return groutVolume(a, l, w, j, d);
  }, [area, tileL, tileW, joint, depth]);

  const field = (label: string, v: string, set: (s: string) => void) => (
    <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input type="number" step="any" value={v} onInput={(e) => set((e.target as HTMLInputElement).value)} class={inp} /></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        {field('Area to tile (m²)', area, setArea)}
        {field('Joint / gap width (mm)', joint, setJoint)}
        {field('Tile length (mm)', tileL, setTileL)}
        {field('Tile width (mm)', tileW, setTileW)}
        {field('Joint depth ≈ tile thickness (mm)', depth, setDepth)}
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(res.litres, 2)} <span class="text-lg">L</span></p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Grout volume needed</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-3xl font-extrabold text-slate-800">≈ {fmt(res.kg, 1)} <span class="text-lg">kg</span></p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Approx. dry grout weight</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the area, tile size and joint dimensions.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Grout fills the joints between tiles, so the amount depends on tile size (smaller tiles = more joints), joint width and joint depth (about the tile thickness). Weight assumes a cementitious grout at ≈1.6 kg per litre, check your product\'s coverage chart and add ~10% for waste and partial tiles. 🔒 In your browser.
      </p>
    </div>
  );
}
