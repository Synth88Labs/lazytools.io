import { useState } from 'preact/hooks';
import { Rat, nCr, absB } from '../../lib/mathx';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

/** One term of (Ax + B)^n: C(n,k)·A^(n−k)·B^k · x^(n−k) */
function term(A: Rat, B: Rat, n: number, k: number): { coef: Rat; power: number } {
  const c = new Rat(nCr(n, k));
  let coef = c;
  for (let i = 0; i < n - k; i++) coef = coef.mul(A);
  for (let i = 0; i < k; i++) coef = coef.mul(B);
  return { coef, power: n - k };
}

const sup = (n: number) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');

export default function BinomialExpansionTool() {
  const [aStr, setAStr] = useState('2');
  const [bStr, setBStr] = useState('-3');
  const [nStr, setNStr] = useState('4');
  const [kStr, setKStr] = useState('2');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    const A = Rat.parse(aStr), B = Rat.parse(bStr);
    const n = parseInt(nStr.trim(), 10);
    if (!Number.isInteger(n) || n < 1 || n > 200) throw new Error('The exponent n must be a whole number from 1 to 200.');
    if (A.isZero()) throw new Error('A must be non-zero (otherwise there is no x term to expand).');

    const showAll = n <= 12;
    const terms = showAll ? Array.from({ length: n + 1 }, (_, k) => ({ k, ...term(A, B, n, k) })) : [];
    const fmtTerm = (coef: Rat, power: number, first: boolean) => {
      const sign = coef.sign() < 0 ? ' − ' : first ? '' : ' + ';
      const mag = new Rat(absB(coef.n), coef.d);
      const magTxt = mag.toFrac();
      const xPart = power === 0 ? '' : power === 1 ? 'x' : `x${sup(power)}`;
      const coefTxt = xPart && magTxt === '1' ? '' : magTxt;
      return `${sign}${coefTxt}${xPart || (coefTxt ? '' : magTxt)}`;
    };

    // single-term finder (1-based "term number" convention: term r+1 has k=r)
    const kNum = parseInt(kStr.trim(), 10);
    const kOk = Number.isInteger(kNum) && kNum >= 0 && kNum <= n;
    const single = kOk ? term(A, B, n, kNum) : null;

    const pascal = n <= 30 ? Array.from({ length: n + 1 }, (_, k) => String(nCr(n, k))) : null;

    body = (
      <>
        {showAll ? (
          <p class="mt-5 break-words rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-lg font-bold leading-relaxed text-brand-800">
            ({aStr.trim()}x {B.sign() < 0 ? '−' : '+'} {new Rat(absB(B.n), B.d).toFrac()}){sup(n)} = {terms.map((t, i) => fmtTerm(t.coef, t.power, i === 0)).join('')}
          </p>
        ) : (
          <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            Full expansion has {n + 1} terms — too long to display readably. Use the term finder below; every coefficient is still computed exactly.
          </p>
        )}

        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Term finder — term with x{sup(n)}⁻ᵏ (choose k = 0…{n})</p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-sm font-semibold text-slate-600">k =</span>
            <input class={inputCls} value={kStr} onInput={(e) => setKStr((e.target as HTMLInputElement).value)} aria-label="k" />
            {single && (
              <span class="font-mono text-lg font-bold text-slate-900">
                → C({n},{kNum})·({aStr.trim()})^{n - kNum}·({bStr.trim()})^{kNum} · x{sup(single.power)} = {single.coef.toFrac()}{single.power > 0 ? `x${sup(single.power)}` : ''}
              </span>
            )}
            {!kOk && <span class="text-sm text-amber-700">k must be between 0 and {n}</span>}
          </div>
        </div>

        {pascal && (
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Pascal's triangle row {n} (the binomial coefficients)</p>
            <p class="mt-2 break-words font-mono text-sm text-slate-800">{pascal.join('  ')}</p>
          </div>
        )}
      </>
    );
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
        <span>(</span>
        <input class={inputCls} value={aStr} onInput={(e) => setAStr((e.target as HTMLInputElement).value)} aria-label="A" />
        <span>x +</span>
        <input class={inputCls} value={bStr} onInput={(e) => setBStr((e.target as HTMLInputElement).value)} aria-label="B" />
        <span>) ^</span>
        <input class={inputCls} value={nStr} onInput={(e) => setNStr((e.target as HTMLInputElement).value)} aria-label="n" />
      </div>
      <p class="mt-1.5 text-xs text-slate-500">A and B accept integers, decimals and fractions; negative B: type the minus sign. Full expansion shown for n ≤ 12.</p>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">Coefficients are exact BigInt/rational values via the binomial theorem — (2x − 3)⁴ expands with every sign and coefficient right. Runs locally.</p>
    </div>
  );
}
