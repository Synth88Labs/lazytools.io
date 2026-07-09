import { useState } from 'preact/hooks';
import { percentileValue, percentileRank, percentileNearestRank, percentileExc } from '../../lib/mathx';

const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;
const fmt = (x: number) => (Number.isInteger(x) ? String(x) : x.toPrecision(6).replace(/\.?0+$/, ''));

export default function PercentileTool() {
  const [mode, setMode] = useState<'value' | 'rank'>('value');
  const [dataStr, setDataStr] = useState('15, 20, 35, 40, 50');
  const [pStr, setPStr] = useState('40');
  const [xStr, setXStr] = useState('35');

  const data = dataStr.split(/[\s,;\n]+/).filter(Boolean).map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  let body: preact.JSX.Element | null = null;
  let error = '';
  if (data.length < 2) error = 'Enter at least two numbers.';
  else if (mode === 'value') {
    const p = Number(pStr);
    if (!Number.isFinite(p) || p < 0 || p > 100) error = 'Enter a percentile between 0 and 100.';
    else {
      const vInc = percentileValue(data, p);
      const vNear = percentileNearestRank(data, p);
      const vExc = percentileExc(data, p);
      const rank = (p / 100) * (data.length - 1);
      body = (
        <>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="font-mono text-2xl font-extrabold text-brand-700">{fmt(vInc)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Linear interpolation</p>
              <p class="text-xs text-slate-400">Excel PERCENTILE.INC · R-7 · NumPy default</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(vNear)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Nearest rank</p>
              <p class="text-xs text-slate-400">classic textbook definition</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="font-mono text-2xl font-extrabold text-slate-800">{fmt(vExc)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Exclusive interpolation</p>
              <p class="text-xs text-slate-400">Excel PERCENTILE.EXC · R-6 · Minitab</p>
            </div>
          </div>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (linear interpolation shown)</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Sort the {data.length} values: <span class="font-mono">{data.map(fmt).join(', ')}</span></li>
              <li>Rank position = (p/100)·(n − 1) = ({fmt(p)}/100)·{data.length - 1} = <strong>{fmt(rank)}</strong> (zero-based)</li>
              <li>{Number.isInteger(rank) ? `Whole rank → take the value at position ${rank}: ${fmt(vInc)}` : `Interpolate between positions ${Math.floor(rank)} (${fmt(data[Math.floor(rank)]!)}) and ${Math.ceil(rank)} (${fmt(data[Math.ceil(rank)]!)}): ${fmt(vInc)}`}</li>
            </ol>
            <p class="mt-2 text-xs text-slate-500">The three methods disagree on small datasets by design — this is the #1 source of "my answer doesn't match Excel" confusion. Match the method your course or spreadsheet uses.</p>
          </div>
        </>
      );
    }
  } else {
    const x = Number(xStr);
    if (!Number.isFinite(x)) error = 'Enter a number to rank.';
    else {
      const pr = percentileRank(data, x);
      const below = data.filter((v) => v < x).length;
      const equal = data.filter((v) => v === x).length;
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {fmt(x)} is at the {fmt(pr)}th percentile
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (midpoint method)</p>
            <p class="mt-1">
              {below} of {data.length} values are below {fmt(x)} and {equal} equal it. Percentile rank = (below + equal/2) ÷ n × 100 = ({below} + {equal}/2) ÷ {data.length} × 100 = <strong class="font-mono">{fmt(pr)}%</strong>.
            </p>
          </div>
        </>
      );
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your data — commas, spaces or new lines</span>
        <textarea
          class="mt-1 h-20 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
          value={dataStr}
          onInput={(e) => setDataStr((e.target as HTMLTextAreaElement).value)}
        />
      </label>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" class={tabCls(mode === 'value')} onClick={() => setMode('value')}>Find percentile value</button>
        <button type="button" class={tabCls(mode === 'rank')} onClick={() => setMode('rank')}>Find rank of a value</button>
        {mode === 'value' ? (
          <label class="ml-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
            P<input class="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center font-mono" value={pStr} onInput={(e) => setPStr((e.target as HTMLInputElement).value)} aria-label="percentile" />
          </label>
        ) : (
          <label class="ml-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
            value<input class="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center font-mono" value={xStr} onInput={(e) => setXStr((e.target as HTMLInputElement).value)} aria-label="value" />
          </label>
        )}
      </div>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">Method stated on every answer — percentile definitions differ between textbooks, and knowing which one you're using is half the mark. Runs locally.</p>
    </div>
  );
}
