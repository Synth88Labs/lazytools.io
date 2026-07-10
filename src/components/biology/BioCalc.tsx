import { useMemo, useState } from 'preact/hooks';
import { BIO_COMPUTE } from '../../lib/bio-compute';
import type { BioField } from '../../data/biology/types';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

/** Declarative field→result widget for the simple [S] biology tools. */
export default function BioCalc({ computeId, fields }: { computeId: string; fields: BioField[] }) {
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.id, f.defaultValue ?? ''])),
  );
  const rows = useMemo(() => {
    const nums: Record<string, number> = {};
    for (const f of fields) nums[f.id] = parseFloat(vals[f.id]);
    try { return BIO_COMPUTE[computeId](nums); } catch { return [{ label: 'Result', value: 'Enter values above' }]; }
  }, [vals, computeId, fields]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{f.label}{f.suffix ? ` (${f.suffix})` : ''}</span>
            {f.type === 'select' ? (
              <select class={inputCls} value={vals[f.id]} onChange={(e) => setVals({ ...vals, [f.id]: (e.target as HTMLSelectElement).value })}>
                {f.options?.map((o) => <option value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input class={`${inputCls} font-mono`} type="number" value={vals[f.id]} onInput={(e) => setVals({ ...vals, [f.id]: (e.target as HTMLInputElement).value })} />
            )}
          </label>
        ))}
      </div>
      <div class="mt-5 space-y-2">
        {rows.map((r) => (
          <div class="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div>
              <p class="text-sm font-medium text-slate-600">{r.label}</p>
              {r.hint && <p class="mt-0.5 font-mono text-xs text-slate-400">{r.hint}</p>}
            </div>
            <p class="text-xl font-extrabold text-brand-800">{r.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
