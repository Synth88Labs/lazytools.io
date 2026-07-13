import { useMemo, useState } from 'preact/hooks';
import { riceWater, RICE_TYPES } from '../../lib/cooking';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number) => Number(x.toFixed(2)).toString();

export default function RiceWaterTool() {
  const [rice, setRice] = useState('1');
  const [unit, setUnit] = useState<'cups' | 'ml'>('cups');
  const [type, setType] = useState('white');

  const r = useMemo(() => {
    const q = num(rice);
    if (q == null) return null;
    return riceWater(q, type);
  }, [rice, type]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';
  const u = unit === 'cups' ? 'cups' : 'ml';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dry rice</span>
          <div class="flex gap-1"><input type="number" step="any" value={rice} onInput={(e) => setRice((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'cups' | 'ml')} class={sel}><option value="cups">cups</option><option value="ml">ml</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Rice type</span>
          <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value)} class={`${sel} w-full`}>{RICE_TYPES.map((t) => <option value={t.id}>{t.label}</option>)}</select></label>
      </div>

      {r ? (
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Water</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.water)} <span class="text-lg text-slate-500">{u}</span></p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cooked yield</p><p class="mt-1 text-2xl font-extrabold text-slate-700">~{fmt(r.yield)} {u}</p></div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Simmer time</p><p class="mt-1 text-2xl font-extrabold text-slate-700">~{r.minutes} min</p></div>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the amount of dry rice.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Water is in the same unit as the rice — the ratio is what matters (2:1 for white, 2.5:1 for brown, 1.5:1 for basmati/jasmine). Rinse the rice first for fluffier grains, bring to a boil then cover and simmer on low, and rest it off the heat for 5–10 minutes before fluffing. Times and absorption vary by pan and lid, so adjust to taste. 🔒 In your browser.</p>
    </div>
  );
}
