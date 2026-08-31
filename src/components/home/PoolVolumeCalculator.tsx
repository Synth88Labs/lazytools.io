import { useMemo, useState } from 'preact/hooks';
import { poolVolume } from '../../lib/home';

const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const sel = 'rounded-xl border border-slate-300 bg-white px-2 text-sm';
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Math.round(x).toLocaleString('en-US');

export default function PoolVolumeCalculator() {
  const [shape, setShape] = useState<'rect' | 'round' | 'oval'>('rect');
  const [a, setA] = useState('8');
  const [b, setB] = useState('4');
  const [depth, setDepth] = useState('1.5');
  const [unit, setUnit] = useState<'m' | 'ft'>('m');

  const res = useMemo(() => {
    const A = num(a), B = num(b), D = num(depth);
    if (A == null || D == null) return null;
    return poolVolume(shape, A, B ?? 0, D, unit);
  }, [shape, a, b, depth, unit]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-3">
        <label class="text-sm font-medium text-slate-700">Shape <select value={shape} onChange={(e) => setShape((e.target as HTMLSelectElement).value as any)} class={sel}><option value="rect">Rectangular</option><option value="round">Round</option><option value="oval">Oval</option></select></label>
        <label class="text-sm font-medium text-slate-700">Units <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'm' | 'ft')} class={sel}><option value="m">metres</option><option value="ft">feet</option></select></label>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{shape === 'round' ? `Diameter (${unit})` : `Length (${unit})`}</span>
          <input type="number" step="any" value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} class={inp} /></label>
        {shape !== 'round' && (
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width ({unit})</span>
            <input type="number" step="any" value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} class={inp} /></label>
        )}
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Average depth ({unit})</span>
          <input type="number" step="any" value={depth} onInput={(e) => setDepth((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {res ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(res.usGal)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">US gallons</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.litres)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Litres</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(res.m3)}</p><p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Cubic metres</p></div>
        </div>
      ) : <p class="mt-4 text-sm text-slate-500">Enter the pool dimensions.</p>}

      <p class="mt-4 text-xs text-slate-500">
        Volume uses the average depth, for a pool that slopes from shallow to deep, average the two ends ((shallow + deep) ÷ 2). Knowing the gallons is the basis for dosing chlorine, shock, algaecide and other chemicals correctly. Round pools use the diameter; oval and rectangular use length × width. 🔒 In your browser.
      </p>
    </div>
  );
}
