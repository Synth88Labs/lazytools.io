import { useMemo, useState } from 'preact/hooks';
import { chiSqGoodnessOfFit, chiSqIndependence } from '../../lib/stats-tests';

const parseRow = (s: string) => s.trim().split(/[\s,]+/).map(Number).filter((n) => isFinite(n));
const parseGrid = (s: string) => s.split(/\r?\n/).map(parseRow).filter((r) => r.length > 0);
const fmt = (n: number, d = 4) => n.toLocaleString('en-US', { maximumFractionDigits: d });

type Mode = 'gof' | 'independence';

export default function ChiSquareTool() {
  const [mode, setMode] = useState<Mode>('gof');
  const [alpha, setAlpha] = useState('0.05');
  const [observed, setObserved] = useState('8, 9, 10, 11, 12, 10');
  const [expected, setExpected] = useState('10, 10, 10, 10, 10, 10');
  const [table, setTable] = useState('10 20\n30 40');

  const r = useMemo(() => {
    if (mode === 'gof') {
      const o = parseRow(observed), e = parseRow(expected);
      return chiSqGoodnessOfFit(o, e);
    }
    return chiSqIndependence(parseGrid(table));
  }, [mode, observed, expected, table]);

  const a = parseFloat(alpha) || 0.05;
  const sig = r ? r.p < a : false;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('gof')} class={`rounded-lg px-3 py-1 ${mode === 'gof' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Goodness-of-fit</button>
        <button onClick={() => setMode('independence')} class={`rounded-lg px-3 py-1 ${mode === 'independence' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Independence</button>
      </div>

      {mode === 'gof' ? (
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Observed counts</span><input type="text" value={observed} onInput={(e) => setObserved((e.target as HTMLInputElement).value)} class={inp} /></label>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Expected counts</span><input type="text" value={expected} onInput={(e) => setExpected((e.target as HTMLInputElement).value)} class={inp} /></label>
        </div>
      ) : (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Contingency table — one row per line, values separated by spaces or commas</span>
          <textarea rows={4} value={table} onInput={(e) => setTable((e.target as HTMLTextAreaElement).value)} class={ta} /></label>
      )}
      <label class="mt-2 inline-block text-sm text-slate-600">α <input type="number" step="0.01" value={alpha} onInput={(e) => setAlpha((e.target as HTMLInputElement).value)} class={`${inp} inline-block w-20`} /></label>

      {r ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">χ² statistic</p><p class="mt-1 text-3xl font-extrabold text-brand-800">{fmt(r.chiSq, 3)}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Degrees of freedom</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.df}</p></div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">p-value</p><p class="mt-1 text-2xl font-extrabold text-slate-700">{r.p < 0.0001 ? r.p.toExponential(2) : fmt(r.p, 4)}</p></div>
          </div>
          <div class={`mt-3 rounded-xl p-4 ring-2 ${sig ? 'bg-emerald-50 ring-emerald-200' : 'bg-slate-100 ring-slate-200'}`}>
            <p class={`text-sm font-semibold ${sig ? 'text-emerald-800' : 'text-slate-700'}`}>{sig ? `Significant at α = ${a}` : `Not significant at α = ${a}`}</p>
            <p class={`mt-1 text-sm ${sig ? 'text-emerald-700' : 'text-slate-600'}`}>{mode === 'gof'
              ? (sig ? `p = ${fmt(r.p, 4)} < ${a}: the observed counts differ significantly from what was expected — the distribution does not fit.`
                : `p = ${fmt(r.p, 4)} ≥ ${a}: the observed counts are consistent with the expected distribution.`)
              : (sig ? `p = ${fmt(r.p, 4)} < ${a}: the two variables are significantly associated (not independent).`
                : `p = ${fmt(r.p, 4)} ≥ ${a}: no significant association — the variables appear independent.`)}</p>
          </div>
          {r.expected && (
            <details class="mt-3 rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200">
              <summary class="cursor-pointer font-semibold text-slate-700">Expected counts</summary>
              <div class="mt-2 overflow-x-auto"><table class="text-sm"><tbody>{r.expected.map((row) => <tr>{row.map((v) => <td class="px-3 py-1 font-mono text-slate-600">{v.toFixed(2)}</td>)}</tr>)}</tbody></table></div>
            </details>
          )}
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">{mode === 'gof' ? 'Enter matching lists of observed and expected counts.' : 'Enter a table with at least 2 rows and 2 columns.'}</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The chi-square test compares observed counts to what a hypothesis predicts: χ² = Σ (O − E)² ÷ E. Goodness-of-fit checks whether one categorical variable follows an expected distribution (df = categories − 1); the independence test checks whether two variables in a contingency table are related (df = (rows − 1)(cols − 1), with expected counts from the row and column totals). It needs counts, not percentages, and expected counts should generally be 5 or more. 🔒 In your browser.</p>
    </div>
  );
}
