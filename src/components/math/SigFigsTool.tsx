import { useState } from 'preact/hooks';
import { sigFigCount, sigFigRound } from '../../lib/mathx';

export default function SigFigsTool() {
  const [numStr, setNumStr] = useState('0.004560');
  const [nStr, setNStr] = useState('2');

  let analysis: ReturnType<typeof sigFigCount> | null = null;
  let rounded = '';
  let error = '';
  try {
    analysis = sigFigCount(numStr);
    const n = parseInt(nStr.trim(), 10);
    if (Number.isInteger(n) && n >= 1 && n <= 30) rounded = sigFigRound(numStr, n);
  } catch (e) {
    error = (e as Error).message;
  }

  const MARK_CLS = {
    sig: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    not: 'bg-slate-100 text-slate-400 border-slate-200',
    ambiguous: 'bg-amber-100 text-amber-800 border-amber-300',
    other: 'text-slate-500 border-transparent',
  } as const;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Number</span>
          <input
            class="w-48 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
            value={numStr}
            onInput={(e) => setNumStr((e.target as HTMLInputElement).value)}
          />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Round to (sig figs)</span>
          <input
            class="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
            value={nStr}
            onInput={(e) => setNStr((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {analysis && (
        <>
          <div class="mt-5 flex flex-wrap items-center gap-4">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="font-mono text-3xl font-extrabold text-brand-700">{analysis.count}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">significant figures</p>
            </div>
            {rounded && (
              <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
                <p class="font-mono text-3xl font-extrabold text-slate-800">{rounded}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">rounded to {nStr} sig figs</p>
              </div>
            )}
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Digit-by-digit</p>
            <p class="mt-2 flex flex-wrap gap-1 font-mono text-2xl">
              {analysis.marks.map(([ch, kind]) => (
                <span class={`rounded border px-1.5 py-0.5 ${MARK_CLS[kind]}`}>{ch}</span>
              ))}
            </p>
            <p class="mt-2 text-xs text-slate-500">
              <span class="mr-3"><span class="rounded border border-emerald-300 bg-emerald-100 px-1">green</span> significant</span>
              <span class="mr-3"><span class="rounded border border-slate-200 bg-slate-100 px-1 text-slate-400">grey</span> leading zero (placeholder)</span>
              <span><span class="rounded border border-amber-300 bg-amber-100 px-1 text-amber-800">amber</span> ambiguous trailing zero</span>
            </p>
            {analysis.note && <p class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{analysis.note}</p>}
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">The rules applied</p>
            <ul class="mt-2 list-disc space-y-1 pl-5">
              <li>Non-zero digits are always significant.</li>
              <li>Zeros between non-zero digits are significant (105 has three).</li>
              <li>Leading zeros never are — they only place the decimal point (0.004560 starts counting at the 4).</li>
              <li>Trailing zeros are significant only with a decimal point (100.0 has four; 1200 is ambiguous — use scientific notation to be explicit).</li>
            </ul>
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Counting and rounding are done on the digit string itself — no floating-point re-formatting to corrupt the answer. Runs locally.</p>
    </div>
  );
}
