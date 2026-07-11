import { useMemo, useState } from 'preact/hooks';

export interface SolverField { key: string; label: string; unit: string; initial?: string; placeholder?: string }

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

/** Generic "solve for one variable" formula tool. */
export default function SolverTool({
  fields, solve, formula, resultUnit, defaultTarget,
}: {
  fields: SolverField[];
  /** returns the solved value for `target`, or null if inputs are insufficient/invalid */
  solve: (vals: Record<string, number | null>, target: string) => { value: number; unit: string } | null;
  formula: string;
  resultUnit?: string;
  defaultTarget?: string;
}) {
  const [target, setTarget] = useState(defaultTarget ?? fields[fields.length - 1]!.key);
  const [vals, setVals] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.initial ?? '']))
  );

  const parsed = useMemo(() => {
    const out: Record<string, number | null> = {};
    for (const f of fields) out[f.key] = f.key === target ? null : num(vals[f.key] ?? '');
    return out;
  }, [vals, target, fields]);

  const result = useMemo(() => { try { return solve(parsed, target); } catch { return null; } }, [parsed, target]);
  const targetField = fields.find((f) => f.key === target)!;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap gap-2">
        {fields.map((f) => (
          <button onClick={() => setTarget(f.key)} class={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${target === f.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`}>Solve {f.label}</button>
        ))}
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        {fields.filter((f) => f.key !== target).map((f) => (
          <label class="block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{f.label} <span class="text-slate-400">({f.unit})</span></span>
            <input type="number" step="any" value={vals[f.key] ?? ''} placeholder={f.placeholder}
              onInput={(e) => setVals({ ...vals, [f.key]: (e.target as HTMLInputElement).value })}
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
          </label>
        ))}
      </div>

      {result ? (
        <div class="mt-4 rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{targetField.label}</p>
          <p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(result.value)} <span class="text-lg font-bold text-slate-500">{result.unit || resultUnit || targetField.unit}</span></p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Fill in the other values to solve for {targetField.label.toLowerCase()}.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">{formula} 🔒 Computed in your browser.</p>
    </div>
  );
}
