import { useState } from 'preact/hooks';
import { Rat, factorize, extractSquare, radicalToString, nthRootSimplified, absB } from '../../lib/mathx';

const rootSym = (k: number) => (k === 2 ? '√' : k === 3 ? '∛' : k === 4 ? '∜' : `${k}√`);

const inputCls = 'w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

const sup = (e: bigint) => String(e).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');

export default function RadicalSimplifierTool() {
  const [mode, setMode] = useState<'simplify' | 'nth' | 'rationalize' | 'combine'>('simplify');
  const [n, setN] = useState('180');
  const [nthN, setNthN] = useState('54');
  const [nthK, setNthK] = useState('3');
  // rationalize c / (a + b√m)
  const [rc, setRc] = useState('1');
  const [ra, setRa] = useState('2');
  const [rb, setRb] = useState('1');
  const [rm, setRm] = useState('3');
  // combine p√x ± q√y
  const [p, setP] = useState('3');
  const [x, setX] = useState('8');
  const [op, setOp] = useState<'+' | '-' | '×'>('+');
  const [q, setQ] = useState('5');
  const [y, setY] = useState('18');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    if (mode === 'simplify') {
      const s = n.trim().replace(/[,\s]/g, '');
      if (!/^\d+$/.test(s) || s === '0') throw new Error('Enter a positive whole number.');
      if (s.length > 15) throw new Error('Keep it to 15 digits so factorization stays instant.');
      const N = BigInt(s);
      const [k, m] = extractSquare(N);
      const factors = factorize(N);
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            √{s} = {radicalToString(new Rat(k), m)}
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Prime-factorize: {s} = <span class="font-mono">{factors.map(([pp, e]) => e === 1n ? String(pp) : `${pp}${sup(e)}`).join(' × ')}</span></li>
              <li>Pull each pair of primes out of the root (a pair p² contributes p outside): outside = <span class="font-mono">{String(k)}</span>, left inside = <span class="font-mono">{String(m)}</span></li>
              <li>√{s} = √({k}² × {String(m)}) = <span class="font-mono font-bold">{radicalToString(new Rat(k), m)}</span>{m === 1n ? ' — a perfect square' : ''}</li>
            </ol>
          </div>
        </>
      );
    } else if (mode === 'nth') {
      const s = nthN.trim().replace(/[,\s]/g, '');
      const k = parseInt(nthK.trim(), 10);
      if (!/^\d+$/.test(s) || s === '0') throw new Error('Enter a positive whole number for the radicand.');
      if (!Number.isInteger(k) || k < 2 || k > 10) throw new Error('Root index from 2 to 10.');
      if (s.length > 15) throw new Error('Keep the radicand to 15 digits.');
      const N = BigInt(s);
      const [out, inside] = nthRootSimplified(N, k);
      const factors = factorize(N);
      const disp = inside === 1n ? String(out) : `${out === 1n ? '' : out}${rootSym(k)}${inside}`;
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {rootSym(k)}{s} = {disp}
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Prime-factorize: {s} = <span class="font-mono">{factors.map(([pp, e]) => e === 1n ? String(pp) : `${pp}^${e}`).join(' × ')}</span></li>
              <li>Each group of {k} identical primes leaves the root as one factor: outside = <span class="font-mono">{String(out)}</span>, left inside = <span class="font-mono">{String(inside)}</span></li>
              <li>{rootSym(k)}{s} = <span class="font-mono font-bold">{disp}</span>{inside === 1n ? ` — a perfect ${k === 2 ? 'square' : k === 3 ? 'cube' : `${k}th power`}` : ''}</li>
            </ol>
          </div>
        </>
      );
    } else if (mode === 'rationalize') {
      const C = Rat.parse(rc), A = Rat.parse(ra), B = Rat.parse(rb);
      const M = BigInt(rm.trim());
      if (M <= 0n) throw new Error('The radicand m must be a positive integer.');
      // c / (a + b√m) × (a − b√m)/(a − b√m) = c(a − b√m) / (a² − b²m)
      const den = A.mul(A).sub(B.mul(B).mul(new Rat(M)));
      if (den.isZero()) throw new Error('a² − b²·m = 0 — the denominator is zero after rationalizing (a + b√m must not be 0).');
      const coefA = C.mul(A).div(den); // rational part
      const coefB = C.mul(B).div(den).neg(); // coefficient of √m
      const [k2, m2] = extractSquare(M);
      const surdCoef = coefB.mul(new Rat(k2));
      const surdTxt = surdCoef.isZero() ? '' : ` ${surdCoef.sign() < 0 ? '−' : '+'} ${radicalToString(new Rat(absB(surdCoef.n), surdCoef.d), m2)}`;
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {C.toFrac()} / ({A.toFrac()} + {B.toFrac()}√{String(M)}) = {coefA.isZero() && surdTxt ? surdTxt.replace(/^ [+−] /, surdCoef.sign() < 0 ? '−' : '') : coefA.toFrac() + surdTxt}
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (multiply by the conjugate)</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>Multiply top and bottom by the conjugate ({A.toFrac()} − {B.toFrac()}√{String(M)}) — the difference of squares removes the root from the denominator.</li>
              <li>Denominator: a² − b²·m = {A.mul(A).toFrac()} − {B.mul(B).toFrac()}·{String(M)} = <span class="font-mono">{den.toFrac()}</span></li>
              <li>Numerator: c·a − c·b·√m = {C.mul(A).toFrac()} − {C.mul(B).toFrac()}√{String(M)}, then divide through and simplify the surd.</li>
            </ol>
          </div>
        </>
      );
    } else {
      const P = Rat.parse(p), Q = Rat.parse(q);
      const X = BigInt(x.trim()), Y = BigInt(y.trim());
      if (X <= 0n || Y <= 0n) throw new Error('Radicands must be positive integers.');
      const [kx, mx] = extractSquare(X);
      const [ky, my] = extractSquare(Y);
      const cx = P.mul(new Rat(kx)), cy = Q.mul(new Rat(ky));
      if (op === '×') {
        const prod = cx.mul(cy);
        const [kp, mp] = extractSquare(mx * my);
        const finalCoef = prod.mul(new Rat(kp));
        body = (
          <>
            <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
              {p}√{x} × {q}√{y} = {radicalToString(finalCoef, mp)}
            </p>
            <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
              <ol class="mt-2 list-decimal space-y-1 pl-5">
                <li>Simplify each surd first: {p}√{x} = {radicalToString(cx, mx)} and {q}√{y} = {radicalToString(cy, my)}</li>
                <li>Multiply coefficients and radicands: {cx.toFrac()}·{cy.toFrac()} · √({String(mx)}·{String(my)}) = {prod.toFrac()}√{String(mx * my)}</li>
                <li>Simplify the remaining surd: <span class="font-mono font-bold">{radicalToString(finalCoef, mp)}</span></li>
              </ol>
            </div>
          </>
        );
      } else {
        const like = mx === my;
        const sum = op === '+' ? cx.add(cy) : cx.sub(cy);
        body = (
          <>
            <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
              {p}√{x} {op} {q}√{y} = {like ? radicalToString(sum, mx) : `${radicalToString(cx, mx)} ${op} ${radicalToString(cy, my)}`}
            </p>
            <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
              <ol class="mt-2 list-decimal space-y-1 pl-5">
                <li>Simplify each surd: {p}√{x} = {radicalToString(cx, mx)} and {q}√{y} = {radicalToString(cy, my)}</li>
                {like ? (
                  <li>The radicands match (√{String(mx)}), so combine like terms: ({cx.toFrac()} {op} {cy.toFrac()})√{String(mx)} = <span class="font-mono font-bold">{radicalToString(sum, mx)}</span></li>
                ) : (
                  <li>The simplified radicands differ (√{String(mx)} vs √{String(my)}) — unlike surds cannot be combined; the simplified sum above is the final exact form.</li>
                )}
              </ol>
            </div>
          </>
        );
      }
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'simplify')} onClick={() => setMode('simplify')}>Simplify √n</button>
        <button type="button" class={tabCls(mode === 'nth')} onClick={() => setMode('nth')}>Cube & nth roots</button>
        <button type="button" class={tabCls(mode === 'rationalize')} onClick={() => setMode('rationalize')}>Rationalize c/(a+b√m)</button>
        <button type="button" class={tabCls(mode === 'combine')} onClick={() => setMode('combine')}>Combine surds</button>
      </div>

      {mode === 'simplify' && (
        <label class="mt-4 flex items-center gap-2 text-2xl font-bold text-slate-500">
          √<input class={inputCls} value={n} onInput={(e) => setN((e.target as HTMLInputElement).value)} aria-label="radicand" />
        </label>
      )}
      {mode === 'nth' && (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
          <label class="flex items-center gap-1">
            <span class="text-sm font-semibold">index k =</span>
            <input class="w-16 rounded-lg border border-slate-300 bg-white px-2 py-2 text-center font-mono text-lg" value={nthK} onInput={(e) => setNthK((e.target as HTMLInputElement).value)} aria-label="root index" />
          </label>
          <span>{rootSym(parseInt(nthK, 10) || 3)}</span>
          <input class={inputCls} value={nthN} onInput={(e) => setNthN((e.target as HTMLInputElement).value)} aria-label="radicand for nth root" />
        </div>
      )}
      {mode === 'rationalize' && (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={rc} onInput={(e) => setRc((e.target as HTMLInputElement).value)} aria-label="numerator c" />
          <span>/ (</span>
          <input class={inputCls} value={ra} onInput={(e) => setRa((e.target as HTMLInputElement).value)} aria-label="a" />
          <span>+</span>
          <input class={inputCls} value={rb} onInput={(e) => setRb((e.target as HTMLInputElement).value)} aria-label="b" />
          <span>√</span>
          <input class={inputCls} value={rm} onInput={(e) => setRm((e.target as HTMLInputElement).value)} aria-label="m" />
          <span>)</span>
        </div>
      )}
      {mode === 'combine' && (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={p} onInput={(e) => setP((e.target as HTMLInputElement).value)} aria-label="first coefficient" />
          <span>√</span>
          <input class={inputCls} value={x} onInput={(e) => setX((e.target as HTMLInputElement).value)} aria-label="first radicand" />
          <select class="rounded-lg border border-slate-300 bg-white px-2 py-2 text-lg font-bold" value={op} onChange={(e) => setOp((e.target as HTMLSelectElement).value as typeof op)}>
            {['+', '-', '×'].map((o) => <option value={o}>{o}</option>)}
          </select>
          <input class={inputCls} value={q} onInput={(e) => setQ((e.target as HTMLInputElement).value)} aria-label="second coefficient" />
          <span>√</span>
          <input class={inputCls} value={y} onInput={(e) => setY((e.target as HTMLInputElement).value)} aria-label="second radicand" />
        </div>
      )}

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">Exact symbolic results — √180 becomes 6√5 via prime factorization, never 13.416…. Runs locally.</p>
    </div>
  );
}
