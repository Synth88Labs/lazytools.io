import { useMemo, useState } from 'preact/hooks';
import { cleanSeq, complement, reverseComplement, transcribe, translate, gcContent, isRNA, AA_NAMES } from '../../lib/biology';

type Mode = 'revcomp' | 'complement' | 'transcribe' | 'translate';
const tabCls = (a: boolean) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${a ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

export default function SequenceTool() {
  const [raw, setRaw] = useState('ATGGCCTTCAGCGACTAA');
  const [mode, setMode] = useState<Mode>('revcomp');
  const [frame, setFrame] = useState(0);
  const [copied, setCopied] = useState(false);

  const seq = useMemo(() => cleanSeq(raw), [raw]);
  const rna = isRNA(seq);
  const gc = useMemo(() => gcContent(seq), [seq]);

  const output = useMemo(() => {
    if (!seq) return '';
    if (mode === 'revcomp') return reverseComplement(seq, rna);
    if (mode === 'complement') return complement(seq, rna);
    if (mode === 'transcribe') return transcribe(seq);
    return translate(seq, frame).protein;
  }, [seq, mode, frame, rna]);

  const proteinExpanded = mode === 'translate'
    ? [...output].map((a) => (AA_NAMES[a] ? AA_NAMES[a][0] : 'Xaa')).join('-')
    : '';

  function copy() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1200); });
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">DNA / RNA sequence (FASTA headers & spaces ignored)</span>
        <textarea
          class="h-28 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false}
          onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)}
        />
      </label>
      <p class="mt-1 text-xs text-slate-500">{seq.length} nt · GC {gc.gcPct.toFixed(1)}% · {rna ? 'RNA' : 'DNA'} · 🔒 stays in your browser</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'revcomp')} onClick={() => setMode('revcomp')}>Reverse complement</button>
        <button type="button" class={tabCls(mode === 'complement')} onClick={() => setMode('complement')}>Complement</button>
        <button type="button" class={tabCls(mode === 'transcribe')} onClick={() => setMode('transcribe')}>Transcribe → mRNA</button>
        <button type="button" class={tabCls(mode === 'translate')} onClick={() => setMode('translate')}>Translate → protein</button>
      </div>

      {mode === 'translate' && (
        <div class="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <span class="font-medium">Reading frame</span>
          {[0, 1, 2].map((f) => (
            <button type="button" onClick={() => setFrame(f)} class={`rounded-md px-2.5 py-1 text-sm ${frame === f ? 'bg-brand-100 font-semibold text-brand-800' : 'bg-white ring-1 ring-slate-200'}`}>+{f + 1}</button>
          ))}
        </div>
      )}

      <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
        <div class="flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {mode === 'revcomp' ? 'Reverse complement (5′→3′)' : mode === 'complement' ? 'Complement' : mode === 'transcribe' ? 'mRNA' : `Protein (frame +${frame + 1})`}
          </p>
          <button type="button" onClick={copy} class="rounded-lg bg-brand-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-brand-800">{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <p class="mt-2 break-all font-mono text-sm text-slate-900">{output || '—'}</p>
        {mode === 'translate' && output && <p class="mt-2 break-all font-mono text-xs text-slate-500">{proteinExpanded}</p>}
        {mode === 'translate' && <p class="mt-2 text-xs text-slate-400">* = stop codon · read in codons of three from frame +{frame + 1}</p>}
      </div>
    </div>
  );
}
