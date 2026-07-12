import { useMemo, useState } from 'preact/hooks';
import { ENZYMES, digest, findSites, cleanSeq } from '../../lib/biology';

const DEFAULT_SELECTED = ['EcoRI', 'BamHI', 'HindIII'];

export default function RestrictionDigestTool() {
  const [raw, setRaw] = useState('GAATTCGGATCCAAGCTTGGGCCCTCTAGACCCGGGAAAAAAGAATTCTTTTTT');
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const [circular, setCircular] = useState(false);

  const seq = useMemo(() => cleanSeq(raw), [raw]);
  const result = useMemo(() => digest(seq, selected, circular), [seq, selected, circular]);

  // per-enzyme site counts across ALL enzymes (the "cutter map")
  const siteCounts = useMemo(() => ENZYMES.map((e) => ({ name: e.name, site: e.site, count: findSites(seq, e.site).length })), [seq]);

  const toggle = (name: string) => setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">DNA sequence (5′→3′)</span>
        <textarea class="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} />
      </label>
      <p class="mt-1 text-xs text-slate-500">{seq.length} bp · {selected.length} enzyme{selected.length === 1 ? '' : 's'} selected</p>

      <div class="mt-3 flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Enzymes</span>
        <button onClick={() => setSelected(ENZYMES.map((e) => e.name))} class="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">All</button>
        <button onClick={() => setSelected([])} class="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600 hover:border-brand-400">None</button>
        <label class="ml-auto flex items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={circular} onChange={(e) => setCircular((e.target as HTMLInputElement).checked)} /> circular (plasmid)
        </label>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        {ENZYMES.map((e) => {
          const n = siteCounts.find((s) => s.name === e.name)!.count;
          const on = selected.includes(e.name);
          return (
            <button onClick={() => toggle(e.name)} title={`${e.site} · ${e.ends}`}
              class={`rounded-lg px-2 py-1 font-mono text-xs font-semibold ring-1 ${on ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-400'}`}>
              {e.name}{n > 0 ? <span class={on ? 'text-brand-100' : 'text-emerald-600'}> ·{n}</span> : ''}
            </button>
          );
        })}
      </div>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{result.cuts.length} cut{result.cuts.length === 1 ? '' : 's'} → {result.fragments.length} fragment{result.fragments.length === 1 ? '' : 's'}</p>
          <p class="mt-1 font-mono text-sm text-slate-800">{result.fragments.length ? result.fragments.map((f) => `${f} bp`).join('  ·  ') : '—'}</p>
          {result.cuts.length === 0 && seq.length > 0 && <p class="mt-1 text-xs text-slate-500">No selected enzyme cuts this sequence — it stays intact ({seq.length} bp).</p>}
        </div>
        <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cut positions ({circular ? 'circular' : 'linear'})</p>
          {result.cuts.length ? (
            <ul class="mt-1 max-h-28 space-y-0.5 overflow-y-auto text-xs text-slate-700">
              {result.cuts.map((c) => (
                <li class="font-mono">{c.enzyme} — site @ {c.site}, cuts after base {c.cutAt}</li>
              ))}
            </ul>
          ) : <p class="mt-1 text-xs text-slate-400">—</p>}
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">Finds each enzyme's recognition site (IUPAC ambiguity supported) in your sequence and reports the cut positions and resulting fragment sizes. The <span class="font-mono">·N</span> on a chip is how many sites that enzyme has. Recognition sites and cut points are standard NEB/REBASE values. Enter a circular sequence as a plasmid to wrap the fragments. 🔒 Computed in your browser.</p>
    </div>
  );
}
