import { useState } from 'preact/hooks';
import { Rat, completeSquare, absB } from '../../lib/mathx';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

export default function CompletingSquareTool() {
  const [a, setA] = useState('2');
  const [b, setB] = useState('-4');
  const [c, setC] = useState('5');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    const A = Rat.parse(a), B = Rat.parse(b), C = Rat.parse(c);
    const { h, k } = completeSquare(A, B, C);
    const hAbs = new Rat(absB(h.n), h.d);
    const kAbs = new Rat(absB(k.n), k.d);
    const aTxt = A.toFrac() === '1' ? '' : A.toFrac() === '-1' ? '-' : A.toFrac();
    const inner = h.isZero() ? 'x' : `x ${h.sign() > 0 ? '+' : '−'} ${hAbs.toFrac()}`;
    const kTxt = k.isZero() ? '' : ` ${k.sign() > 0 ? '+' : '−'} ${kAbs.toFrac()}`;
    const vertexForm = `${aTxt}(${inner})²${kTxt}`;
    const bOverA = B.div(A);
    const halfSq = h.mul(h);
    body = (
      <>
        <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
          {vertexForm}
        </p>
        <div class="mt-3 flex flex-wrap gap-3">
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">({h.neg().toFrac()}, {k.toFrac()})</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">vertex (h, k)</p>
          </div>
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">x = {h.neg().toFrac()}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">axis of symmetry</p>
          </div>
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{A.sign() > 0 ? 'minimum' : 'maximum'} {k.toFrac()}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">extreme value</p>
          </div>
        </div>
        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (completing the square)</p>
          <ol class="mt-2 list-decimal space-y-1 pl-5">
            <li>Factor a out of the x-terms: {a}(x² {bOverA.sign() < 0 ? '−' : '+'} {new Rat(absB(bOverA.n), bOverA.d).toFrac()}x) {C.sign() < 0 ? '−' : '+'} {new Rat(absB(C.n), C.d).toFrac()}</li>
            <li>Take half of the x-coefficient, {bOverA.toFrac()} ÷ 2 = {h.toFrac()}, and square it: {halfSq.toFrac()}</li>
            <li>Add and subtract it inside, regroup: {a}(x {h.sign() > 0 ? '+' : '−'} {hAbs.toFrac()})² − {a}·{halfSq.toFrac()} {C.sign() < 0 ? '−' : '+'} {new Rat(absB(C.n), C.d).toFrac()}</li>
            <li>Collect the constants: k = {C.toFrac()} − {A.mul(halfSq).toFrac()} = <strong class="font-mono">{k.toFrac()}</strong> → <strong class="font-mono">{vertexForm}</strong></li>
          </ol>
        </div>
      </>
    );
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2 text-xl font-bold text-slate-600">
        <input class={inputCls} value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} aria-label="a" />
        <span>x² +</span>
        <input class={inputCls} value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} aria-label="b" />
        <span>x +</span>
        <input class={inputCls} value={c} onInput={(e) => setC((e.target as HTMLInputElement).value)} aria-label="c" />
      </div>
      <p class="mt-1.5 text-xs text-slate-500">Coefficients accept integers, decimals and fractions. Need the roots too? Use the <a href="/math/quadratic-equation-solver/" class="font-medium text-brand-700 underline decoration-slate-300 underline-offset-2">quadratic solver</a>.</p>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">Vertex form with exact fractions — 2x² − 4x + 5 becomes 2(x − 1)² + 3, every constant exact. Runs locally.</p>
    </div>
  );
}
