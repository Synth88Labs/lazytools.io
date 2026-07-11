import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 1) => Number(x.toFixed(d)).toString();

export default function CrateSizeTool() {
  const [unit, setUnit] = useState<'cm' | 'in'>('in');
  const [length, setLength] = useState('24'); // nose to base of tail
  const [height, setHeight] = useState('18'); // floor to top of head

  const r = useMemo(() => {
    const l = num(length), h = num(height);
    if (l == null || h == null) return null;
    const margin = unit === 'in' ? [2, 4] : [5, 10];
    return {
      lenLo: l + margin[0], lenHi: l + margin[1],
      htLo: h + margin[0], htHi: h + margin[1],
    };
  }, [length, height, unit]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const u = unit;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['in', 'cm'] as const).map((x) => (
          <button onClick={() => setUnit(x)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === x ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{x === 'in' ? 'Inches' : 'Centimetres'}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dog length — nose to base of tail ({u})</span>
          <input type="number" step="any" value={length} onInput={(e) => setLength((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dog height — floor to top of head ({u})</span>
          <input type="number" step="any" value={height} onInput={(e) => setHeight((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Crate length</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.lenLo, 0)}–{fmt(r.lenHi, 0)} <span class="text-lg text-slate-500">{u}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Crate height</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{fmt(r.htLo, 0)}–{fmt(r.htHi, 0)} <span class="text-lg text-slate-500">{u}</span></p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Measure your dog and enter the two lengths.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The AKC guideline: measure nose to the base of the tail (not the tail tip) for length, and floor to the top of the head (or ear tip for erect-eared breeds) for height, then add about 2–4 inches (5–10 cm) to each. Your dog should be able to stand, turn around and lie down comfortably. For a growing puppy, size for the adult dog and use a divider. 🔒 In your browser.</p>
    </div>
  );
}
