import { useMemo, useState } from 'preact/hooks';
import { aquariumVolume, aquariumVolumeIn } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toLocaleString();

export default function AquariumTool() {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [L, setL] = useState('100');
  const [W, setW] = useState('40');
  const [H, setH] = useState('50');

  const r = useMemo(() => {
    const l = num(L), w = num(W), h = num(H);
    if (l == null || w == null || h == null) return null;
    const v = unit === 'cm' ? aquariumVolume(l, w, h) : aquariumVolumeIn(l, w, h);
    // ~90% net after substrate/rocks/displacement
    return { ...v, net: v.litres * 0.9 };
  }, [unit, L, W, H]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['cm', 'in'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u === 'cm' ? 'Centimetres' : 'Inches'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Length ({unit})</span>
          <input type="number" step="any" value={L} onInput={(e) => setL((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Width / depth ({unit})</span>
          <input type="number" step="any" value={W} onInput={(e) => setW((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Height ({unit})</span>
          <input type="number" step="any" value={H} onInput={(e) => setH((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Volume</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.litres)} <span class="text-lg text-slate-500">L</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">US / UK gallons</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.usGal)} / {fmt(r.ukGal)}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Approx. water (−10%)</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{fmt(r.net)} L</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the tank's inside dimensions.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Volume = length × width × height. Use the inside dimensions; actual water volume is roughly 10% less once substrate, rocks and the gap below the rim are accounted for. 1 L = 0.264 US gallons. 🔒 In your browser.</p>
    </div>
  );
}
