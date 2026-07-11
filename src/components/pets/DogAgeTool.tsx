import { useMemo, useState } from 'preact/hooks';
import { dogAgeEpigenetic, dogAgeTraditional, DOG_SIZES, type DogSize } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Math.round(x);

export default function DogAgeTool() {
  const [age, setAge] = useState('4');
  const [size, setSize] = useState<DogSize>('medium');

  const r = useMemo(() => {
    const a = num(age);
    if (a == null) return null;
    return { epi: dogAgeEpigenetic(a), trad: dogAgeTraditional(a, size) };
  }, [age, size]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dog's age (years)</span>
          <input type="number" step="any" min="0" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Breed size (for the traditional estimate)</span>
          <select value={size} onChange={(e) => setSize((e.target as HTMLSelectElement).value as DogSize)} class={sel}>
            {DOG_SIZES.map((s) => <option value={s.id}>{s.label}</option>)}
          </select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Epigenetic estimate</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{r.epi != null ? fmt(r.epi) : '—'} <span class="text-lg text-slate-500">human years</span></p>
            <p class="mt-1 text-xs text-slate-400">2020 DNA-methylation study (16 × ln(age) + 31)</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Traditional (size-based)</p>
            <p class="mt-1 text-4xl font-extrabold text-slate-700">{r.trad != null ? fmt(r.trad) : '—'} <span class="text-lg text-slate-500">human years</span></p>
            <p class="mt-1 text-xs text-slate-400">15 first year, +9 second, then by size</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your dog's age in years.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The old "multiply by 7" rule is a myth — dogs mature fast early then slow down. The epigenetic formula (from a 2020 study comparing dog and human DNA methylation) captures that curve. The traditional estimate uses the AVMA figures (15 the first year, +9 the second); the per-size increments after that are a common convention reflecting that larger breeds age faster, not an official standard. Both are population estimates. 🔒 In your browser.</p>
    </div>
  );
}
