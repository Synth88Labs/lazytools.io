import { useMemo, useState } from 'preact/hooks';
import { pondVolume } from '../../lib/garden';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(4)).toLocaleString('en-US', { maximumSignificantDigits: 4 });

export default function PondVolumeTool() {
  const [length, setLength] = useState('3');
  const [width, setWidth] = useState('2');
  const [depth, setDepth] = useState('0.5');
  const [unit, setUnit] = useState<'m' | 'ft'>('m');

  const res = useMemo(() => {
    const l = num(length), w = num(width), d = num(depth);
    if (l == null || w == null || d == null) return null;
    const f = unit === 'ft' ? 0.3048 : 1;
    const overlap = unit === 'ft' ? 0.3048 : 0.3; // ~1 ft / 0.3 m
    const p = pondVolume(l * f, w * f, d * f, overlap);
    if (!p) return null;
    const back = (m: number) => m / f;
    return { ...p, linerLength: back(p.linerLength), linerWidth: back(p.linerWidth) };
  }, [length, width, depth, unit]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex items-center gap-2"><span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Units</span>
        <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'm' | 'ft')} class={sel}><option value="m">metres</option><option value="ft">feet</option></select></div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length ({unit})</span><input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width ({unit})</span><input type="number" step="any" value={width} onInput={(e) => setWidth((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average depth ({unit})</span><input type="number" step="any" value={depth} onInput={(e) => setDepth((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p><p class="mt-1 font-mono text-2xl font-extrabold text-brand-800">{fmt(res.litres)} L</p><p class="text-xs text-slate-500">{fmt(res.gallons)} US gal</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Liner size</p><p class="mt-1 font-mono text-2xl font-extrabold text-slate-800">{fmt(res.linerLength)} × {fmt(res.linerWidth)}</p><p class="text-xs text-slate-500">{unit} (incl. overlap)</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the length, width and average depth.</p>}

      <p class="mt-4 text-xs text-slate-500">Volume = length × width × average depth (1 m³ = 1,000 L = 264 US gallons). Use the <em>average</em> depth for a sloped or irregular pond. Liner size adds twice the depth to each dimension (to line the sides) plus an overlap for the edges: liner = (length + 2×depth + overlap) × (width + 2×depth + overlap). Buy a little extra for folds. 🔒 In your browser.</p>
    </div>
  );
}
