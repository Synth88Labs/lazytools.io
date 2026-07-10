import { useMemo, useState } from 'preact/hooks';
import { diffLines } from '../../lib/textdiff';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

export default function TextDiffTool() {
  const [a, setA] = useState('The quick brown fox\njumps over the lazy dog.\nLine three stays.');
  const [b, setB] = useState('The quick red fox\njumps over the lazy dog.\nLine three stays.\nA new line at the end.');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWs, setIgnoreWs] = useState(false);

  const diff = useMemo(() => diffLines(a, b, { ignoreCase, ignoreWhitespace: ignoreWs }), [a, b, ignoreCase, ignoreWs]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 lg:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Original</span>
          <textarea class={ta} rows={8} value={a} onInput={(e) => setA((e.target as HTMLTextAreaElement).value)} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Changed</span>
          <textarea class={ta} rows={8} value={b} onInput={(e) => setB((e.target as HTMLTextAreaElement).value)} /></label>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <label class="flex items-center gap-1.5"><input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Ignore case</label>
        <label class="flex items-center gap-1.5"><input type="checkbox" checked={ignoreWs} onChange={(e) => setIgnoreWs((e.target as HTMLInputElement).checked)} class="accent-brand-600" /> Ignore whitespace</label>
        <span class="ml-auto font-medium"><span class="text-emerald-700">+{diff.added}</span> · <span class="text-red-700">−{diff.removed}</span> · <span class="text-slate-500">{diff.unchanged} unchanged</span></span>
      </div>

      <div class="mt-3 overflow-auto rounded-xl border border-slate-200 bg-white font-mono text-sm">
        {diff.rows.map((r) => (
          r.type === 'eq'
            ? <div class="flex"><span class="w-6 select-none border-r border-slate-100 px-1 text-center text-slate-300"> </span><span class="whitespace-pre-wrap px-2 py-0.5 text-slate-600">{r.a || ' '}</span></div>
            : r.type === 'del'
            ? <div class="flex bg-red-50"><span class="w-6 select-none border-r border-red-100 px-1 text-center font-bold text-red-500">−</span><span class="whitespace-pre-wrap px-2 py-0.5 text-red-800">{r.a || ' '}</span></div>
            : <div class="flex bg-emerald-50"><span class="w-6 select-none border-r border-emerald-100 px-1 text-center font-bold text-emerald-600">+</span><span class="whitespace-pre-wrap px-2 py-0.5 text-emerald-800">{r.b || ' '}</span></div>
        ))}
      </div>
      <p class="mt-3 text-xs text-slate-500">Exact line-by-line comparison via a longest-common-subsequence diff. 🔒 Both texts are compared entirely in your browser — nothing is uploaded, which matters for contracts, code and drafts.</p>
    </div>
  );
}
