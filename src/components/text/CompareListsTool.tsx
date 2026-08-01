import { useMemo, useState } from 'preact/hooks';
import { compareLists } from '../../lib/list-ops';

const A_SAMPLE = 'apple\nbanana\ncherry\ndate\nfig';
const B_SAMPLE = 'banana\ncherry\nelderberry\nfig\ngrape';

function Panel({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div class="rounded-xl bg-white p-4 ring-2" style={`--tw-ring-color:${tone}`}>
      <p class="flex items-baseline justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>{title}</span>
        <span class="font-mono text-sm text-slate-400">{items.length}</span>
      </p>
      {items.length === 0 ? (
        <p class="mt-2 text-sm italic text-slate-400">none</p>
      ) : (
        <ul class="mt-2 max-h-64 space-y-0.5 overflow-auto">
          {items.map((x) => <li class="break-all font-mono text-sm text-slate-800">{x}</li>)}
        </ul>
      )}
    </div>
  );
}

export default function CompareListsTool() {
  const [a, setA] = useState(A_SAMPLE);
  const [b, setB] = useState(B_SAMPLE);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trim, setTrim] = useState(true);

  const res = useMemo(
    () => compareLists(a, b, { caseSensitive, trim, ignoreEmpty: true }),
    [a, b, caseSensitive, trim],
  );

  const copy = (lines: string[]) => {
    if (lines.length) navigator.clipboard?.writeText(lines.join('\n'));
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">List A (one item per line)</span>
          <textarea class="h-40 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={a} onInput={(e) => setA((e.target as HTMLTextAreaElement).value)} />
        </label>
        <label class="block">
          <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">List B (one item per line)</span>
          <textarea class="h-40 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" value={b} onInput={(e) => setB((e.target as HTMLTextAreaElement).value)} />
        </label>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-4">
        <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive((e.target as HTMLInputElement).checked)} /> Case-sensitive</label>
        <label class="flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={trim} onChange={(e) => setTrim((e.target as HTMLInputElement).checked)} /> Trim whitespace</label>
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Panel title="In both (common)" items={res.common} tone="#a7f3d0" />
        <Panel title="Only in A" items={res.onlyA} tone="#bfdbfe" />
        <Panel title="Only in B" items={res.onlyB} tone="#fbcfe8" />
        <Panel title="Union (all unique)" items={res.union} tone="#e2e8f0" />
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button onClick={() => copy(res.common)} class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800">Copy common</button>
        <button onClick={() => copy(res.onlyA)} class="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy only-A</button>
        <button onClick={() => copy(res.onlyB)} class="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy only-B</button>
        <button onClick={() => copy(res.union)} class="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy union</button>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Each list is de-duplicated first, then compared as sets: “common” is what appears in both, “only in A/B” are the differences, and “union” is every unique item across both. Duplicates within a single list are collapsed. 🔒 Runs entirely in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
