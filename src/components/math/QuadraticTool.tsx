import { useState } from 'preact/hooks';
import { absB } from '../../lib/mathx';
import { solveQuadratic, type Solved } from '../../lib/quadratic';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

export default function QuadraticTool() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-3');
  const [c, setC] = useState('-10');

  let s: Solved | null = null;
  let error = '';
  try {
    s = solveQuadratic(a, b, c);
  } catch (e) {
    error = (e as Error).message;
  }

  const KIND_LABEL = {
    rational: 'two rational roots (D is a perfect square)',
    irrational: 'two irrational real roots',
    complex: 'two complex roots (D < 0)',
    double: 'one repeated (double) root — D = 0',
  } as const;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2 text-xl font-bold text-slate-600">
        <input class={inputCls} value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} aria-label="coefficient a" />
        <span>x² +</span>
        <input class={inputCls} value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} aria-label="coefficient b" />
        <span>x +</span>
        <input class={inputCls} value={c} onInput={(e) => setC((e.target as HTMLInputElement).value)} aria-label="coefficient c" />
        <span>= 0</span>
      </div>
      <p class="mt-1.5 text-xs text-slate-500">Coefficients accept integers, decimals and fractions (e.g. 1/2). Negative b or c: type the minus sign.</p>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {s && (
        <>
          <div class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
            <p class="text-sm font-semibold text-slate-600">{KIND_LABEL[s.kind]}</p>
            <p class="mt-1 font-mono text-2xl font-extrabold text-brand-800">
              x = {s.roots.join('  ,  ')}
            </p>
            {(s.kind === 'irrational' || s.kind === 'complex' || s.roots.some((r) => r.includes('/'))) && (
              <p class="mt-1 font-mono text-sm text-slate-600">≈ {s.approx.join('  ,  ')}</p>
            )}
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Cleared to integer coefficients: {String(s.aI)}x² {s.bI < 0n ? '−' : '+'} {String(absB(s.bI))}x {s.cI < 0n ? '−' : '+'} {String(absB(s.cI))} = 0</li>
              <li>Discriminant D = b² − 4ac = ({String(s.bI)})² − 4·{String(s.aI)}·{String(s.cI)} = <strong>{String(s.D)}</strong></li>
              <li>Quadratic formula: x = (−b ± √D) / 2a = ({String(-s.bI)} ± √{String(s.D)}) / {String(2n * s.aI)}</li>
              <li>Simplified exactly to the roots above. Vertex of the parabola: {s.vertex}</li>
            </ol>
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Roots come out exact — simplified fractions and radicals like (3 + √89)/2, not just decimals. Runs locally.</p>
    </div>
  );
}
