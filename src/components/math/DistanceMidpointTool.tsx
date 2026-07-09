import { useState } from 'preact/hooks';
import { Rat, sqrtRatSimplified, radicalToString } from '../../lib/mathx';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

export default function DistanceMidpointTool() {
  const [mode, setMode] = useState<'points' | 'pyth'>('points');
  const [x1, setX1] = useState('-2');
  const [y1, setY1] = useState('1');
  const [x2, setX2] = useState('4');
  const [y2, setY2] = useState('5');
  const [legA, setLegA] = useState('3');
  const [legB, setLegB] = useState('6');
  const [pythMode, setPythMode] = useState<'hyp' | 'leg'>('hyp');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    if (mode === 'pyth') {
      try {
      const A = Rat.parse(legA), B = Rat.parse(legB);
      if (A.sign() <= 0 || B.sign() <= 0) throw new Error('Enter positive lengths.');
      const d2 = pythMode === 'hyp' ? A.mul(A).add(B.mul(B)) : (() => {
        const diff = B.mul(B).sub(A.mul(A));
        if (diff.sign() <= 0) throw new Error('The hypotenuse must be longer than the leg.');
        return diff;
      })();
      const { coef, radicand } = sqrtRatSimplified(d2);
      const exact = radicalToString(coef, radicand);
      const approx = Math.sqrt(Number(d2.n) / Number(d2.d));
      body = (
        <>
          <div class="mt-5 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-2 ring-brand-200">
              <p class="font-mono text-3xl font-extrabold text-brand-700">{pythMode === 'hyp' ? 'c' : 'b'} = {exact}</p>
              {radicand !== 1n && <p class="text-xs text-slate-500">≈ {approx.toPrecision(8).replace(/\.?0+$/, '')}</p>}
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{pythMode === 'hyp' ? 'hypotenuse (exact)' : 'missing leg (exact)'}</p>
            </div>
          </div>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (Pythagorean theorem)</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              {pythMode === 'hyp' ? (
                <>
                  <li>c² = a² + b² = ({A.toFrac()})² + ({B.toFrac()})² = {A.mul(A).toFrac()} + {B.mul(B).toFrac()} = <strong>{d2.toFrac()}</strong></li>
                  <li>c = √{d2.toFrac()} = <span class="font-mono font-bold">{exact}</span>{radicand !== 1n ? ' — simplified radical form' : ' — a Pythagorean triple!'}</li>
                </>
              ) : (
                <>
                  <li>b² = c² − a² = ({B.toFrac()})² − ({A.toFrac()})² = {B.mul(B).toFrac()} − {A.mul(A).toFrac()} = <strong>{d2.toFrac()}</strong></li>
                  <li>b = √{d2.toFrac()} = <span class="font-mono font-bold">{exact}</span></li>
                </>
              )}
            </ol>
          </div>
        </>
      );
      } catch (pe) { error = (pe as Error).message; }
      return (
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
          <div class="mb-4 flex gap-2">
            <button type="button" class={tabCls(false)} onClick={() => setMode('points')}>Distance & midpoint (points)</button>
            <button type="button" class={tabCls(true)} onClick={() => setMode('pyth')}>Right triangle (Pythagoras)</button>
          </div>
          <div class="flex flex-wrap items-end gap-3">
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{pythMode === 'hyp' ? 'Leg a' : 'Leg a'}</span>
              <input class={inputCls} value={legA} onInput={(e) => setLegA((e.target as HTMLInputElement).value)} aria-label="leg a" />
            </label>
            <label class="block">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{pythMode === 'hyp' ? 'Leg b' : 'Hypotenuse c'}</span>
              <input class={inputCls} value={legB} onInput={(e) => setLegB((e.target as HTMLInputElement).value)} aria-label={pythMode === 'hyp' ? 'leg b' : 'hypotenuse'} />
            </label>
            <select class="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm font-semibold" value={pythMode} onChange={(e) => setPythMode((e.target as HTMLSelectElement).value as typeof pythMode)}>
              <option value="hyp">find hypotenuse</option>
              <option value="leg">find missing leg</option>
            </select>
          </div>
          {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}
          <p class="mt-4 text-xs text-slate-500">Exact radical answers — legs 3 and 6 give c = 3√5, not 6.7082. Runs locally.</p>
        </div>
      );
    }
    const X1 = Rat.parse(x1), Y1 = Rat.parse(y1), X2 = Rat.parse(x2), Y2 = Rat.parse(y2);
    const dx = X2.sub(X1), dy = Y2.sub(Y1);
    const d2 = dx.mul(dx).add(dy.mul(dy));
    const { coef, radicand } = sqrtRatSimplified(d2);
    const exact = radicalToString(coef, radicand);
    const approx = Math.sqrt(Number(d2.n) / Number(d2.d));
    const mx = X1.add(X2).div(new Rat(2n));
    const my = Y1.add(Y2).div(new Rat(2n));
    body = (
      <>
        <div class="mt-5 flex flex-wrap gap-3">
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-3xl font-extrabold text-brand-700">d = {exact}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">distance (exact{radicand !== 1n ? `, ≈ ${approx.toFixed(6)}` : ''})</p>
          </div>
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-3xl font-extrabold text-slate-800">({mx.toFrac()}, {my.toFrac()})</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">midpoint (exact)</p>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
          <ol class="mt-2 list-decimal space-y-1 pl-5">
            <li>Differences: Δx = {X2.toFrac()} − {X1.toFrac()} = {dx.toFrac()}, Δy = {Y2.toFrac()} − {Y1.toFrac()} = {dy.toFrac()}</li>
            <li>Pythagoras: d² = Δx² + Δy² = {dx.mul(dx).toFrac()} + {dy.mul(dy).toFrac()} = <strong>{d2.toFrac()}</strong></li>
            <li>Take the root and simplify: d = √{d2.toFrac()} = <span class="font-mono font-bold">{exact}</span>{radicand !== 1n ? ' (simplified radical form — the form homework answers expect)' : ''}</li>
            <li>Midpoint = averages of the coordinates: ((x₁+x₂)/2, (y₁+y₂)/2) = ({mx.toFrac()}, {my.toFrac()})</li>
          </ol>
        </div>
      </>
    );
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-4 flex gap-2">
        <button type="button" class={tabCls(true)} onClick={() => setMode('points')}>Distance & midpoint (points)</button>
        <button type="button" class={tabCls(false)} onClick={() => setMode('pyth')}>Right triangle (Pythagoras)</button>
      </div>
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

      <p class="mt-4 text-xs text-slate-500">Distance comes out in simplified radical form — 2√13, not 7.2111 — with the decimal alongside. Runs locally.</p>
    </div>
  );
}
