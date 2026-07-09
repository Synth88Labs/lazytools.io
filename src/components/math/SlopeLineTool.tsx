import { useState } from 'preact/hooks';
import { Rat, gcdB, lcmB, absB } from '../../lib/mathx';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

export default function SlopeLineTool() {
  const [x1, setX1] = useState('1');
  const [y1, setY1] = useState('2');
  const [x2, setX2] = useState('4');
  const [y2, setY2] = useState('4');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    const X1 = Rat.parse(x1), Y1 = Rat.parse(y1), X2 = Rat.parse(x2), Y2 = Rat.parse(y2);
    const dx = X2.sub(X1), dy = Y2.sub(Y1);
    if (dx.isZero() && dy.isZero()) throw new Error('The two points are identical — a line needs two distinct points.');
    if (dx.isZero()) {
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            Vertical line: x = {X1.toFrac()}
          </p>
          <p class="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            The x-coordinates are equal, so the slope is <strong>undefined</strong> (rise over a zero run) — a vertical line. It has no slope-intercept form; its equation is simply x = {X1.toFrac()}.
          </p>
        </>
      );
    } else {
      const mSlope = dy.div(dx);
      const bInt = Y1.sub(mSlope.mul(X1));
      // standard form: multiply y = mx + b by lcm of denominators → Ax + By = C with integers
      const L = lcmB(mSlope.d, bInt.d);
      let A = -mSlope.n * (L / mSlope.d), B = L, C = bInt.n * (L / bInt.d);
      const g = gcdB(gcdB(absB(A), absB(B)), absB(C)) || 1n;
      A /= g; B /= g; C /= g;
      if (A < 0n || (A === 0n && B < 0n)) { A = -A; B = -B; C = -C; }
      const mTxt = mSlope.toFrac();
      const slopePart = mSlope.n === 0n ? '' : mTxt === '1' ? 'x' : mTxt === '-1' ? '-x' : `${mSlope.d === 1n ? mSlope.n : `(${mTxt})`}x`;
      const bPart = bInt.isZero() ? (slopePart ? '' : '0') : `${slopePart ? (bInt.sign() < 0 ? ' − ' : ' + ') : bInt.sign() < 0 ? '-' : ''}${new Rat(absB(bInt.n), bInt.d).toFrac()}`;
      body = (
        <>
          <div class="mt-5 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="font-mono text-3xl font-extrabold text-brand-700">m = {mTxt}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">slope (exact)</p>
            </div>
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="font-mono text-3xl font-extrabold text-slate-800">b = {bInt.toFrac()}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">y-intercept</p>
            </div>
          </div>
          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <tbody class="divide-y divide-slate-100">
                <tr><th class="w-48 px-4 py-2 font-semibold text-slate-600">Slope-intercept form</th><td class="px-4 py-2 font-mono text-slate-800">y = {slopePart}{bPart}</td></tr>
                <tr><th class="px-4 py-2 font-semibold text-slate-600">Point-slope form</th><td class="px-4 py-2 font-mono text-slate-800">y − {Y1.toFrac()} = {mTxt === '1' ? '' : mTxt === '-1' ? '-' : `(${mTxt})`}(x − {X1.toFrac()})</td></tr>
                <tr><th class="px-4 py-2 font-semibold text-slate-600">Standard form</th><td class="px-4 py-2 font-mono text-slate-800">{String(A)}x {B < 0n ? '−' : '+'} {String(absB(B))}y = {String(C)}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Slope = rise ÷ run = (y₂ − y₁) / (x₂ − x₁) = ({Y2.toFrac()} − {Y1.toFrac()}) / ({X2.toFrac()} − {X1.toFrac()}) = {dy.toFrac()} / {dx.toFrac()} = <strong>{mTxt}</strong></li>
              <li>Intercept from y₁ = m·x₁ + b: b = {Y1.toFrac()} − ({mTxt})·({X1.toFrac()}) = <strong>{bInt.toFrac()}</strong></li>
              <li>Standard form clears the fractions and reduces by the common factor.</li>
            </ol>
          </div>
        </>
      );
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-500">
        <span>Point 1: (</span>
        <input class={inputCls} value={x1} onInput={(e) => setX1((e.target as HTMLInputElement).value)} aria-label="x1" />
        <span>,</span>
        <input class={inputCls} value={y1} onInput={(e) => setY1((e.target as HTMLInputElement).value)} aria-label="y1" />
        <span>)&nbsp;&nbsp;Point 2: (</span>
        <input class={inputCls} value={x2} onInput={(e) => setX2((e.target as HTMLInputElement).value)} aria-label="x2" />
        <span>,</span>
        <input class={inputCls} value={y2} onInput={(e) => setY2((e.target as HTMLInputElement).value)} aria-label="y2" />
        <span>)</span>
      </div>
      <p class="mt-1.5 text-xs text-slate-500">Coordinates accept integers, decimals and fractions (1/2).</p>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">Exact fractions throughout — the slope through (1, 2) and (4, 4) is 2/3, not 0.6667. Runs locally.</p>
    </div>
  );
}
