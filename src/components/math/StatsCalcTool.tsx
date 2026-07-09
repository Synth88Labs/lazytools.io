import { useState } from 'preact/hooks';
import { computeStats } from '../../lib/mathx';

const fmt = (x: number) => (Number.isInteger(x) ? String(x) : x.toPrecision(8).replace(/\.?0+$/, ''));

export default function StatsCalcTool() {
  const [input, setInput] = useState('12, 15, 11, 15, 18, 22, 15, 9, 14');
  const [zStr, setZStr] = useState('');

  const values = input.split(/[\s,;\n]+/).filter(Boolean).map(Number).filter((x) => Number.isFinite(x));
  const stats = values.length >= 1 ? computeStats(values) : null;
  const zVal = Number(zStr);
  const zOk = zStr.trim() !== '' && Number.isFinite(zVal) && stats && stats.sdPop > 0;

  const rows: [string, string][] = stats
    ? [
        ['Count (n)', String(stats.n)],
        ['Sum', fmt(stats.sum)],
        ['Mean (average)', fmt(stats.mean)],
        ['Median', fmt(stats.median)],
        ['Mode', stats.modes.length ? stats.modes.map(fmt).join(', ') : 'none (all values unique)'],
        ['Minimum · Maximum', `${fmt(stats.min)} · ${fmt(stats.max)}`],
        ['Range', fmt(stats.range)],
        ['Q1 · Q3 (quartiles)', `${fmt(stats.q1)} · ${fmt(stats.q3)}`],
        ['IQR (interquartile range)', fmt(stats.iqr)],
        ['Variance (population, σ²)', fmt(stats.varPop)],
        ['Std. deviation (population, σ)', fmt(stats.sdPop)],
        ['Variance (sample, s²)', fmt(stats.varSample)],
        ['Std. deviation (sample, s)', fmt(stats.sdSample)],
      ]
    : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Your data — numbers separated by commas, spaces or new lines</span>
        <textarea
          class="mt-1 h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-brand-500 focus:outline-none"
          value={input}
          onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
          placeholder="12, 15, 11, 15, 18…"
        />
      </label>

      {!stats && <p class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Enter at least one number.</p>}

      {stats && (
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-sm">
            <tbody class="divide-y divide-slate-100">
              {rows.map(([k, v]) => (
                <tr>
                  <th scope="row" class="w-64 px-4 py-2 font-semibold text-slate-600">{k}</th>
                  <td class="px-4 py-2 font-mono text-slate-800">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {stats && (
        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Z-score of a value — how many standard deviations from the mean?</p>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <input
              class="w-32 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-center font-mono text-sm"
              value={zStr}
              onInput={(e) => setZStr((e.target as HTMLInputElement).value)}
              placeholder="e.g. 20"
              aria-label="value for z-score"
            />
            {zOk && (
              <span class="font-mono text-sm text-slate-800">
                z = ({fmt(zVal)} − {fmt(stats.mean)}) / σ → <strong>{((zVal - stats.mean) / stats.sdPop).toFixed(4)}</strong> (population)
                {stats.sdSample > 0 && <> · <strong>{((zVal - stats.mean) / stats.sdSample).toFixed(4)}</strong> (sample)</>}
              </span>
            )}
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Quartiles use the median-of-halves method (Moore &amp; McCabe). Sample statistics divide by n−1 (Bessel's correction) — use them when your data is a sample of a larger population; population statistics divide by n. Computed locally.
      </p>
    </div>
  );
}
