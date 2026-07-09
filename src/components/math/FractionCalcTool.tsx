import { useState } from 'preact/hooks';
import { Rat, lcmB } from '../../lib/mathx';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

export default function FractionCalcTool() {
  const [aStr, setAStr] = useState('1 1/2');
  const [bStr, setBStr] = useState('3/4');
  const [op, setOp] = useState<'+' | '-' | '×' | '÷'>('+');

  let result: Rat | null = null;
  let steps: string[] = [];
  let error = '';
  try {
    const a = Rat.parse(aStr);
    const b = Rat.parse(bStr);
    if (op === '+' || op === '-') {
      const l = lcmB(a.d, b.d);
      const an = a.n * (l / a.d), bn = b.n * (l / b.d);
      result = op === '+' ? a.add(b) : a.sub(b);
      steps = [
        `Write both fractions over the common denominator ${l}: ${a.toFrac()} = ${an}/${l} and ${b.toFrac()} = ${bn}/${l}`,
        `${op === '+' ? 'Add' : 'Subtract'} the numerators: ${an} ${op} ${bn} = ${op === '+' ? an + bn : an - bn}, giving ${op === '+' ? an + bn : an - bn}/${l}`,
        `Simplify to lowest terms: ${result.toFrac()}`,
      ];
    } else if (op === '×') {
      result = a.mul(b);
      steps = [
        `Multiply numerators and denominators: (${a.n} × ${b.n}) / (${a.d} × ${b.d}) = ${a.n * b.n}/${a.d * b.d}`,
        `Simplify to lowest terms: ${result.toFrac()}`,
      ];
    } else {
      result = a.div(b);
      steps = [
        `Dividing is multiplying by the reciprocal: ${a.toFrac()} × ${b.d}/${b.n}`,
        `Multiply: (${a.n} × ${b.d}) / (${a.d} × ${b.n}) = ${a.n * b.d}/${a.d * b.n}`,
        `Simplify to lowest terms: ${result.toFrac()}`,
      ];
    }
  } catch (e) {
    error = (e as Error).message;
  }

  const dec = result?.toDecimal(12);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block w-40">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">First fraction</span>
          <input class={inputCls} value={aStr} onInput={(e) => setAStr((e.target as HTMLInputElement).value)} placeholder="1 1/2" />
        </label>
        <select class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg font-bold" value={op} onChange={(e) => setOp((e.target as HTMLSelectElement).value as typeof op)}>
          {['+', '-', '×', '÷'].map((o) => <option value={o}>{o}</option>)}
        </select>
        <label class="block w-40">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Second fraction</span>
          <input class={inputCls} value={bStr} onInput={(e) => setBStr((e.target as HTMLInputElement).value)} placeholder="3/4" />
        </label>
      </div>
      <p class="mt-1.5 text-xs text-slate-500">Accepts fractions (3/4), mixed numbers (1 2/3), integers and decimals (2.5).</p>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {result && (
        <>
          <div class="mt-5 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="font-mono text-3xl font-extrabold text-brand-700">{result.toFrac()}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">exact fraction</p>
            </div>
            {result.toMixed() !== result.toFrac() && (
              <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
                <p class="font-mono text-3xl font-extrabold text-slate-800">{result.toMixed()}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">mixed number</p>
              </div>
            )}
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="font-mono text-3xl font-extrabold text-slate-800">{dec!.exact ? dec!.text : `≈ ${dec!.text}…`}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">decimal{dec!.exact ? ' (exact)' : ' (rounded)'}</p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {steps.map((s) => <li>{s}</li>)}
            </ol>
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Computed with exact integer arithmetic — no floating-point rounding, ever. Runs locally.</p>
    </div>
  );
}
