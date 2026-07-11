import { useMemo, useState } from 'preact/hooks';
import { rer, mer, DOG_MER, CAT_MER } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString();

export default function PetFoodTool({ species }: { species: 'dog' | 'cat' }) {
  const factors = species === 'dog' ? DOG_MER : CAT_MER;
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState(species === 'dog' ? '15' : '4.5');
  const [status, setStatus] = useState(factors[0].id);
  const [kcalPerCup, setKcalPerCup] = useState(species === 'dog' ? '360' : '300');

  const r = useMemo(() => {
    const w = num(weight);
    if (w == null) return null;
    const kg = unit === 'kg' ? w : w * 0.45359237;
    const f = factors.find((x) => x.id === status)!;
    const rerV = rer(kg);
    const merV = mer(kg, f.factor);
    const kpc = num(kcalPerCup);
    const cups = kpc ? merV / kpc : null;
    return { rer: rerV, mer: merV, factor: f.factor, cups };
  }, [weight, unit, status, kcalPerCup, species]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {(['kg', 'lb'] as const).map((u) => (
          <button onClick={() => setUnit(u)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${unit === u ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>{u}</button>
        ))}
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{species === 'dog' ? 'Dog' : 'Cat'}'s weight ({unit})</span>
          <input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Life stage / status</span>
          <select value={status} onChange={(e) => setStatus((e.target as HTMLSelectElement).value)} class={sel}>
            {factors.map((f) => <option value={f.id}>{f.label} (×{f.factor})</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Food energy (kcal/cup)</span>
          <input type="number" step="any" value={kcalPerCup} onInput={(e) => setKcalPerCup((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Daily calories (MER)</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.mer)} <span class="text-lg text-slate-500">kcal</span></p><p class="mt-1 text-xs text-slate-400">RER {fmt(r.rer)} × {r.factor}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">≈ Cups per day</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.cups != null ? fmt(r.cups, 2) : '—'}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Per meal (2×/day)</p><p class="mt-1 text-3xl font-extrabold text-slate-700">{r.cups != null ? fmt(r.cups / 2, 2) : '—'}</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your {species}'s weight and pick its status.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Resting energy (RER) = 70 × weight(kg)^0.75; daily need (MER) = RER × a life-stage factor. Cups use the calories printed on your food's label (kcal/cup varies a lot). A guideline — your vet's advice and your pet's body condition come first. 🔒 In your browser.</p>
    </div>
  );
}
