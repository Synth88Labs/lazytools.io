import { useMemo, useState } from 'preact/hooks';
import { GESTATION, getSpecies } from '../../lib/pets';

function addDays(iso: string, days: number): Date | null {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d;
}
const fmtDate = (d: Date) => d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });

export default function GestationTool() {
  const [species, setSpecies] = useState('dog');
  const [bred, setBred] = useState('');

  const r = useMemo(() => {
    const sp = getSpecies(species);
    if (!sp || !bred) return null;
    const due = addDays(bred, sp.days);
    if (!due) return null;
    const [loStr, hiStr] = sp.range.split('–');
    const early = addDays(bred, parseInt(loStr));
    const late = addDays(bred, parseInt(hiStr));
    return { sp, due, early, late };
  }, [species, bred]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Animal</span>
          <select value={species} onChange={(e) => setSpecies((e.target as HTMLSelectElement).value)} class={inp}>
            {GESTATION.map((s) => <option value={s.id}>{s.name} — {s.days} days</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Breeding / conception date</span>
          <input type="date" value={bred} onInput={(e) => setBred((e.target as HTMLInputElement).value)} class={inp} /></label>
      </div>

      {r ? (
        <div class="mt-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated due date ({r.sp.name}, {r.sp.days} days)</p>
            <p class="mt-1 text-2xl font-extrabold text-brand-800">{fmtDate(r.due)}</p>
          </div>
          {r.early && r.late && (
            <p class="mt-3 text-center text-sm text-slate-600">Likely window ({r.sp.range} days): <strong>{fmtDate(r.early)}</strong> — <strong>{fmtDate(r.late)}</strong></p>
          )}
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Choose the animal and enter the breeding date.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">Due date = breeding date + the species' average gestation. Actual delivery varies within the normal range shown. For dogs, dating from ovulation (via progesterone testing) is more precise than from mating. Not veterinary advice — consult your vet for a pregnancy plan. 🔒 In your browser.</p>
    </div>
  );
}
