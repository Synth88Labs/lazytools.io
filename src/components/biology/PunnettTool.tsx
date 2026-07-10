import { useMemo, useState } from 'preact/hooks';
import { punnett } from '../../lib/biology';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-center text-lg font-bold tracking-widest text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 font-mono';

/** Greatest common divisor for reducing ratios. */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
function ratio(counts: number[]): string {
  const g = counts.reduce((a, b) => gcd(a, b) || b, 0) || 1;
  return counts.map((c) => c / g).join(' : ');
}

export default function PunnettTool() {
  const [p1, setP1] = useState('Aa');
  const [p2, setP2] = useState('Aa');

  const result = useMemo(() => {
    try {
      const clean = (g: string) => g.replace(/[^A-Za-z]/g, '').slice(0, 6);
      const a = clean(p1), b = clean(p2);
      if (!a || !b || a.length % 2 || b.length % 2 || a.length !== b.length) return null;
      return punnett(a, b);
    } catch { return null; }
  }, [p1, p2]);

  // Order genotypes/phenotypes canonically (most-dominant first) so ratios read the
  // conventional way — 1:2:1 for AA:Aa:aa, not sorted by frequency.
  const upper = (s: string) => (s.match(/[A-Z]/g) || []).length;
  const canonSort = (a: [string, number], b: [string, number]) => upper(b[0]) - upper(a[0]) || (a[0] < b[0] ? -1 : 1);
  const genoEntries = result ? Object.entries(result.genoTally).sort(canonSort) : [];
  const phenoEntries = result ? Object.entries(result.phenoTally).sort(canonSort) : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Parent 1 genotype</span><input class={inputCls} value={p1} onInput={(e) => setP1((e.target as HTMLInputElement).value)} /></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Parent 2 genotype</span><input class={inputCls} value={p2} onInput={(e) => setP2((e.target as HTMLInputElement).value)} /></label>
      </div>
      <p class="mt-2 text-xs text-slate-500">Uppercase = dominant, lowercase = recessive. Try <code>Aa</code> × <code>Aa</code> (monohybrid), <code>AaBb</code> × <code>AaBb</code> (dihybrid), or <code>AaBbCc</code> (trihybrid).</p>

      {!result ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Enter two genotypes with the same, even number of letters (e.g. both <code>Aa</code>, or both <code>AaBb</code>).</p>
      ) : (
        <>
          <div class="mt-5 overflow-auto">
            <table class="mx-auto border-collapse text-center font-mono text-sm">
              <thead>
                <tr>
                  <th class="p-1"></th>
                  {result.gametes2.map((g) => <th class="border border-slate-300 bg-brand-50 px-3 py-2 font-bold text-brand-800">{g}</th>)}
                </tr>
              </thead>
              <tbody>
                {result.grid.map((row, i) => (
                  <tr>
                    <th class="border border-slate-300 bg-brand-50 px-3 py-2 font-bold text-brand-800">{result.gametes1[i]}</th>
                    {row.map((cell) => <td class="border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-sm font-semibold text-slate-900">Genotype ratio</p>
              <p class="mt-1 font-mono text-lg font-bold text-brand-800">{ratio(genoEntries.map((e) => e[1]))}</p>
              <ul class="mt-2 space-y-1 text-sm text-slate-600">
                {genoEntries.map(([g, n]) => <li><span class="font-mono font-semibold text-slate-800">{g}</span> — {n}/{result.total} ({((n / result.total) * 100).toFixed(1)}%)</li>)}
              </ul>
            </div>
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="text-sm font-semibold text-slate-900">Phenotype ratio</p>
              <p class="mt-1 font-mono text-lg font-bold text-brand-800">{ratio(phenoEntries.map((e) => e[1]))}</p>
              <ul class="mt-2 space-y-1 text-sm text-slate-600">
                {phenoEntries.map(([g, n]) => <li><span class="font-mono font-semibold text-slate-800">{g}</span> — {n}/{result.total} ({((n / result.total) * 100).toFixed(1)}%)</li>)}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
