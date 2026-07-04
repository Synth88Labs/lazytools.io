import { useMemo, useState } from 'preact/hooks';
import { COMPUTE, type ResultRow } from '../lib/calc-compute';

interface FieldDto {
  id: string;
  label: string;
  type: 'number' | 'date' | 'select';
  suffix?: string;
  placeholder?: string;
  defaultValue?: string;
  min?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

interface Props {
  computeId: string;
  fields: FieldDto[];
}

export default function CalcWidget({ computeId, fields }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, f.defaultValue ?? '']))
  );
  const [copied, setCopied] = useState(false);

  const rows: ResultRow[] | null = useMemo(() => {
    const fn = COMPUTE[computeId];
    return fn ? fn(values) : null;
  }, [computeId, values]);

  function set(id: string, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  async function copyResult() {
    if (!rows?.length) return;
    try {
      await navigator.clipboard.writeText(rows.map((r) => `${r.label}: ${r.value}`).join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div class={fields.length === 1 ? 'sm:col-span-2' : ''}>
            <label
              for={`cf-${f.id}`}
              class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              {f.label}
            </label>
            {f.type === 'select' ? (
              <select
                id={`cf-${f.id}`}
                value={values[f.id]}
                onChange={(e) => set(f.id, (e.target as HTMLSelectElement).value)}
                class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              >
                {f.options?.map((o) => (
                  <option value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : (
              <div class="relative">
                <input
                  id={`cf-${f.id}`}
                  type={f.type}
                  inputMode={f.type === 'number' ? 'decimal' : undefined}
                  step={f.step ?? 'any'}
                  min={f.min}
                  placeholder={f.placeholder}
                  value={values[f.id]}
                  onInput={(e) => set(f.id, (e.target as HTMLInputElement).value)}
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 pr-16 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
                {f.suffix && (
                  <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                    {f.suffix}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div class="mt-5 rounded-xl border border-brand-100 bg-white p-4">
        {rows && rows.length > 0 ? (
          <>
            <div class="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <div class="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
                  <span class="text-sm font-medium text-slate-600">{r.label}</span>
                  <span class={`font-bold ${i === 0 ? 'text-2xl text-brand-800' : 'text-lg text-slate-900'}`}>
                    {r.value}
                  </span>
                  {r.hint && <p class="w-full font-mono text-xs text-slate-400">{r.hint}</p>}
                </div>
              ))}
            </div>
            <div class="mt-3 flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={copyResult}
                class="rounded-lg bg-brand-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-800"
              >
                {copied ? '✓ Copied' : 'Copy results'}
              </button>
            </div>
          </>
        ) : (
          <p class="py-2 text-sm text-slate-500">Fill in the fields above — results appear instantly.</p>
        )}
      </div>
    </div>
  );
}
