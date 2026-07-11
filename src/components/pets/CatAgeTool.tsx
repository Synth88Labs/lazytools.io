import { useMemo, useState } from 'preact/hooks';
import { catAge } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Math.round(x);

function lifeStage(catYears: number): string {
  if (catYears < 1) return 'Kitten';
  if (catYears <= 2) return 'Junior';
  if (catYears <= 6) return 'Prime adult';
  if (catYears <= 10) return 'Mature';
  if (catYears <= 14) return 'Senior';
  return 'Geriatric';
}

export default function CatAgeTool() {
  const [age, setAge] = useState('5');

  const r = useMemo(() => {
    const a = num(age);
    if (a == null) return null;
    return { human: catAge(a), stage: lifeStage(a) };
  }, [age]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Cat's age (years)</span>
        <input type="number" step="any" min="0" value={age} onInput={(e) => setAge((e.target as HTMLInputElement).value)} class={`${inp} sm:w-48`} /></label>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Human-age equivalent</p>
            <p class="mt-1 text-4xl font-extrabold text-brand-800">{r.human != null ? fmt(r.human) : '—'} <span class="text-lg text-slate-500">human years</span></p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Life stage</p>
            <p class="mt-1 text-3xl font-extrabold text-slate-700">{r.stage}</p>
          </div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter your cat's age in years.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Using the standard veterinary chart: a cat's first year ≈ 15 human years, the second year adds 9 (≈ 24), then about +4 human years per cat year after that. Indoor cats often live 15+ years. 🔒 In your browser.</p>
    </div>
  );
}
