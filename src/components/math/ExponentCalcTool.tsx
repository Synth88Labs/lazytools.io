import { useState } from 'preact/hooks';
import { Rat, ratPow, nthRootSimplified, absB } from '../../lib/mathx';

const inputCls = 'w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

function bigDisplay(s: string): string {
  return s.length > 60 ? `${s.slice(0, 30)}…${s.slice(-15)}` : s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const rootSym = (k: number) => (k === 2 ? '√' : k === 3 ? '∛' : k === 4 ? '∜' : `${k}√`);

export default function ExponentCalcTool() {
  const [baseStr, setBaseStr] = useState('2');
  const [expStr, setExpStr] = useState('100');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    const base = Rat.parse(baseStr);
    const expTrim = expStr.trim();
    const fracExp = expTrim.match(/^(-?\d+)\s*\/\s*(\d+)$/);
    if (fracExp) {
      // fractional exponent p/k → k-th root of base^p, simplified (integer base required)
      const p = parseInt(fracExp[1]!, 10), k = parseInt(fracExp[2]!, 10);
      if (k < 2 || k > 20) throw new Error('Keep the root index between 2 and 20.');
      if (Math.abs(p) > 50) throw new Error('Keep the numerator of the exponent within ±50.');
      if (!base.isInt() || base.sign() < 0) throw new Error('For fractional exponents, use a non-negative whole-number base (roots of fractions and negatives get hairy — simplify those by hand first).');
      const powered = ratPow(base, Math.abs(p));
      const [outside, inside] = nthRootSimplified(powered.n, k);
      const surd = inside === 1n ? String(outside) : `${outside === 1n ? '' : outside}${rootSym(k)}${inside}`;
      const display = p < 0 ? (inside === 1n ? `1/${outside}` : `1/(${surd})`) : surd;
      const approx = Math.pow(Number(base.n), p / k);
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {baseStr}^({expTrim}) = {display} <span class="text-base font-semibold text-slate-600">≈ {approx.toPrecision(8)}</span>
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <ol class="mt-2 list-decimal space-y-1 pl-5">
              <li>A fractional exponent is a root: x^({p}/{k}) = {rootSym(k)}(x^{Math.abs(p)}){p < 0 ? ', inverted for the negative sign' : ''}</li>
              <li>{baseStr}^{Math.abs(p)} = {bigDisplay(powered.toFrac())}</li>
              <li>Simplify the {k === 2 ? 'square' : k === 3 ? 'cube' : `${k}th`} root by extracting {k}th-power factors: <strong class="font-mono">{display}</strong>{inside === 1n ? ' — a perfect power' : ''}</li>
            </ol>
          </div>
        </>
      );
    } else {
      const e = parseInt(expTrim, 10);
      if (!Number.isInteger(e) || Math.abs(e) > 10000) throw new Error('Enter a whole-number exponent within ±10000, or a fraction like 1/3.');
      if (base.isZero() && e < 0) throw new Error('0 to a negative power is undefined (division by zero).');
      const r = ratPow(base, e);
      const digits = String(absB(r.n)).length;
      const denDigits = String(r.d).length;
      const decRes = r.toDecimal(10);
      body = (
        <>
          <p class="mt-5 break-all rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-xl font-extrabold leading-relaxed text-brand-800">
            {baseStr}^{expTrim} = {r.d === 1n ? (digits > 3000 ? `a ${digits}-digit integer (too long to print)` : String(r.n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')) : `${bigDisplay(String(r.n))}/${bigDisplay(String(r.d))}`}
          </p>
          <div class="mt-3 flex flex-wrap gap-3">
            {r.d === 1n && (
              <div class="rounded-xl bg-white px-4 py-2.5 text-center ring-1 ring-slate-200">
                <p class="font-mono text-2xl font-extrabold text-slate-800">{digits.toLocaleString('en-US')}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">digits — every one exact</p>
              </div>
            )}
            {r.d !== 1n && (
              <div class="rounded-xl bg-white px-4 py-2.5 text-center ring-1 ring-slate-200">
                <p class="font-mono text-xl font-extrabold text-slate-800">{decRes.exact ? decRes.text : `≈ ${decRes.text}…`}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">decimal</p>
              </div>
            )}
          </div>
          {e < 0 && (
            <p class="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
              A negative exponent is a reciprocal: {baseStr}^{e} = 1 / {baseStr}^{-e} = <strong class="font-mono">{r.toFrac()}</strong> — an exact fraction, not 0.125000001.
            </p>
          )}
        </>
      );
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
        <input class={inputCls} value={baseStr} onInput={(e) => setBaseStr((e.target as HTMLInputElement).value)} aria-label="base" />
        <span>^</span>
        <input class={inputCls} value={expStr} onInput={(e) => setExpStr((e.target as HTMLInputElement).value)} aria-label="exponent" />
      </div>
      <p class="mt-1.5 text-xs text-slate-500">Base: integer, decimal or fraction (3/2). Exponent: whole number (±10000) or a fraction like 1/3 for roots.</p>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">
        Every case exact: 2^100 with all 31 digits (calculators overflow to 1.267e30), 2^−3 = 1/8 (not 0.125…1), 54^(1/3) = 3∛2 (not 3.7798). Runs locally.
      </p>
    </div>
  );
}
