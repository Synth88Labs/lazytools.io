import { useMemo, useState } from 'preact/hooks';
import { proteinMolecularWeight, AA_RESIDUE_MASS } from '../../lib/biology';

/** Clean a protein sequence: keep the 20 standard one-letter codes, uppercase. */
function cleanProtein(raw: string): string {
  return raw.split('\n').filter((l) => !l.trim().startsWith('>')).join('').toUpperCase().replace(/[^A-Z]/g, '');
}
const fmt = (x: number) => x.toLocaleString('en-US', { maximumFractionDigits: 1 });

export default function ProteinMwTool() {
  const [raw, setRaw] = useState('MASKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTL');
  const seq = useMemo(() => cleanProtein(raw), [raw]);
  const { mw, residues } = useMemo(() => proteinMolecularWeight(seq), [seq]);
  const invalid = seq.length - residues;

  // composition tally
  const comp = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of seq) if (AA_RESIDUE_MASS[a] != null) c[a] = (c[a] || 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [seq]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Protein sequence (one-letter amino acids)</span>
        <textarea
          class="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)}
        />
      </label>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
          <p class="text-2xl font-extrabold text-brand-800">{fmt(mw)} Da</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">molecular weight ({fmt(mw / 1000)} kDa)</p>
        </div>
        <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
          <p class="text-2xl font-extrabold text-slate-800">{residues}</p>
          <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">residues{invalid > 0 ? ` · ${invalid} unrecognised skipped` : ''}</p>
        </div>
      </div>

      {comp.length > 0 && (
        <div class="mt-3 flex flex-wrap gap-1.5">
          {comp.map(([a, n]) => (
            <span class="rounded-md bg-white px-2 py-1 font-mono text-xs text-slate-600 ring-1 ring-slate-200">{a}×{n}</span>
          ))}
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Sum of average residue masses + one water (18.02 Da). This is the unmodified-chain mass — post-translational modifications and disulfide bonds shift it. 🔒 Computed in your browser.</p>
    </div>
  );
}
