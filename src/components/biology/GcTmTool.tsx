import { useMemo, useState } from 'preact/hooks';
import { cleanSeq, gcContent, meltingTemp, baseCounts } from '../../lib/biology';

export default function GcTmTool() {
  const [raw, setRaw] = useState('GCGGATCCATGGCCAAGCTT');
  const seq = useMemo(() => cleanSeq(raw), [raw]);
  const gc = useMemo(() => gcContent(seq), [seq]);
  const tm = useMemo(() => meltingTemp(seq), [seq]);
  const bc = useMemo(() => baseCounts(seq), [seq]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">DNA sequence or primer</span>
        <textarea
          class="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)}
        />
      </label>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-3xl font-extrabold text-brand-800">{gc.gcPct.toFixed(1)}%</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">GC content</p>
          <p class="mt-1 font-mono text-xs text-slate-400">(G+C) ÷ length = ({gc.gc}) ÷ {gc.length}</p>
        </div>
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-3xl font-extrabold text-brand-800">{tm.tm.toFixed(1)} °C</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Melting temperature (Tm)</p>
          <p class="mt-1 font-mono text-xs text-slate-400">{tm.method}</p>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-4 gap-2 text-center">
        {([['A', bc.a], ['T/U', bc.t], ['G', bc.g], ['C', bc.c]] as [string, number][]).map(([b, n]) => (
          <div class="rounded-lg bg-white p-2 ring-1 ring-slate-200"><p class="font-mono text-lg font-bold text-slate-800">{n}</p><p class="text-xs text-slate-500">{b}</p></div>
        ))}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        {seq.length < 14
          ? 'Short oligo (<14 nt): the Wallace rule Tm = 2(A+T) + 4(G+C) is used.'
          : 'Longer sequence (≥14 nt): the salt-adjusted GC formula Tm = 64.9 + 41(G+C − 16.4)/length is used.'}
        {' '}For final primer design, a nearest-neighbour thermodynamic Tm is more accurate. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
