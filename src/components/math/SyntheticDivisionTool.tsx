import { useState } from 'preact/hooks';
import { Rat, syntheticDivision, polyLongDivision } from '../../lib/mathx';

const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

const sup = (n: number) => String(n).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');

function polyToString(coeffs: Rat[]): string {
  const deg = coeffs.length - 1;
  const parts: string[] = [];
  coeffs.forEach((c, i) => {
    if (c.isZero()) return;
    const p = deg - i;
    const mag = c.sign() < 0 ? c.neg() : c;
    const magTxt = mag.toFrac();
    const xPart = p === 0 ? '' : p === 1 ? 'x' : `x${sup(p)}`;
    const coefTxt = xPart && magTxt === '1' ? '' : magTxt;
    parts.push(`${parts.length === 0 ? (c.sign() < 0 ? '−' : '') : c.sign() < 0 ? ' − ' : ' + '}${coefTxt}${xPart}`);
  });
  return parts.join('') || '0';
}

export default function SyntheticDivisionTool() {
  const [mode, setMode] = useState<'synthetic' | 'long'>('synthetic');
  const [coefStr, setCoefStr] = useState('1, -6, 11, -6');
  const [rStr, setRStr] = useState('2');
  const [divStr, setDivStr] = useState('1, 0, 1');
  const [pStr, setPStr] = useState('2, 0, 3, 0, -1');

  let result: ReturnType<typeof syntheticDivision> | null = null;
  let longResult: ReturnType<typeof polyLongDivision> | null = null;
  let coeffs: Rat[] = [];
  let pCoeffs: Rat[] = [];
  let dCoeffs: Rat[] = [];
  let r: Rat | null = null;
  let error = '';
  try {
    if (mode === 'synthetic') {
      coeffs = coefStr.split(',').map((s) => Rat.parse(s.trim()));
      if (coeffs.length > 12) throw new Error('Keep the polynomial to degree 11 or below so the table stays readable.');
      r = Rat.parse(rStr);
      result = syntheticDivision(coeffs, r);
    } else {
      pCoeffs = pStr.split(',').map((s) => Rat.parse(s.trim()));
      dCoeffs = divStr.split(',').map((s) => Rat.parse(s.trim()));
      if (pCoeffs.length > 12 || dCoeffs.length > 12) throw new Error('Keep both polynomials to degree 11 or below.');
      longResult = polyLongDivision(pCoeffs, dCoeffs);
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-4 flex gap-2">
        <button type="button" class={tabCls(mode === 'synthetic')} onClick={() => setMode('synthetic')}>Synthetic (÷ (x − r))</button>
        <button type="button" class={tabCls(mode === 'long')} onClick={() => setMode('long')}>Polynomial long division</button>
      </div>

      {mode === 'long' && (
        <div>
          <div class="flex flex-wrap items-end gap-3">
            <label class="block min-w-64 flex-1">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dividend coefficients (highest degree first)</span>
              <input class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none" value={pStr} onInput={(e) => setPStr((e.target as HTMLInputElement).value)} placeholder="2, 0, 3, 0, -1" />
            </label>
            <label class="block min-w-48 flex-1">
              <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Divisor coefficients</span>
              <input class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none" value={divStr} onInput={(e) => setDivStr((e.target as HTMLInputElement).value)} placeholder="1, 0, 1" />
            </label>
          </div>
          {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}
          {longResult && (
            <>
              <p class="mt-4 text-sm text-slate-600">
                <span class="font-mono font-semibold text-slate-900">{polyToString(pCoeffs)}</span> ÷ <span class="font-mono font-semibold text-slate-900">{polyToString(dCoeffs)}</span>:
              </p>
              <div class="mt-3 flex flex-wrap gap-3">
                <div class="rounded-xl bg-white px-5 py-3 ring-1 ring-slate-200">
                  <p class="font-mono text-xl font-extrabold text-brand-700">{polyToString(longResult.quotient)}</p>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">quotient</p>
                </div>
                <div class="rounded-xl bg-white px-5 py-3 ring-1 ring-slate-200">
                  <p class="font-mono text-xl font-extrabold text-slate-800">{polyToString(longResult.remainder)}</p>
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">remainder</p>
                </div>
              </div>
              <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
                <ol class="mt-2 list-decimal space-y-1 pl-5">
                  {longResult.steps.map((s) => (
                    <li>
                      Divide the leading terms → quotient term <span class="font-mono font-bold">{polyToString([s.factor[0], ...Array(s.factor[1]).fill(new Rat(0n))])}</span>; multiply the divisor by it, subtract → remainder so far: <span class="font-mono">{polyToString(s.after)}</span>
                    </li>
                  ))}
                  <li>The remainder's degree is below the divisor's — stop. Result: quotient <span class="font-mono font-bold">{polyToString(longResult.quotient)}</span>, remainder <span class="font-mono font-bold">{polyToString(longResult.remainder)}</span>.</li>
                </ol>
              </div>
            </>
          )}
          <p class="mt-4 text-xs text-slate-500">Exact rational coefficients at every step — works for any divisor degree, where synthetic division needs (x − r). Runs locally.</p>
        </div>
      )}

      {mode === 'synthetic' && (<div>
      <div class="flex flex-wrap items-end gap-3">
        <label class="block min-w-64 flex-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Coefficients, highest degree first (use 0 for missing terms)</span>
          <input
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
            value={coefStr}
            onInput={(e) => setCoefStr((e.target as HTMLInputElement).value)}
            placeholder="1, -6, 11, -6"
          />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Divide by (x − r), r =</span>
          <input
            class="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
            value={rStr}
            onInput={(e) => setRStr((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {result && r && (
        <>
          <p class="mt-4 text-sm text-slate-600">
            Dividing <span class="font-mono font-semibold text-slate-900">{polyToString(coeffs)}</span> by <span class="font-mono font-semibold text-slate-900">(x {r.sign() < 0 ? '+' : '−'} {r.sign() < 0 ? r.neg().toFrac() : r.toFrac()})</span>:
          </p>

          <div class="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
            <table class="font-mono text-lg">
              <tbody>
                <tr>
                  <td class="border-r-2 border-slate-400 px-3 py-1 font-bold text-brand-700">{r.toFrac()}</td>
                  {result.top.map((c) => <td class="px-4 py-1 text-right text-slate-800">{c.toFrac()}</td>)}
                </tr>
                <tr>
                  <td class="border-r-2 border-slate-400 px-3 py-1"></td>
                  {result.middle.map((c) => <td class="px-4 py-1 text-right text-slate-500">{c ? c.toFrac() : ''}</td>)}
                </tr>
                <tr class="border-t-2 border-slate-400">
                  <td class="border-r-2 border-slate-400 px-3 py-1"></td>
                  {result.bottom.map((c, i) => (
                    <td class={`px-4 py-1 text-right font-bold ${i === result!.bottom.length - 1 ? 'text-red-700' : 'text-slate-900'}`}>{c.toFrac()}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 ring-1 ring-slate-200">
              <p class="font-mono text-xl font-extrabold text-brand-700">{polyToString(result.quotient)}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">quotient</p>
            </div>
            <div class="rounded-xl bg-white px-5 py-3 ring-1 ring-slate-200">
              <p class="font-mono text-xl font-extrabold text-slate-800">{result.remainder.toFrac()}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">remainder = p({r.toFrac()})</p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">How to read the table</p>
            <p class="mt-1">Bring the first coefficient down. Then repeatedly: multiply the bottom number by r (middle row) and add it to the next coefficient (bottom row). The last bottom number is the remainder — which by the remainder theorem equals p(r){result.remainder.isZero() ? `, and it's 0 here, so (x − ${r.toFrac()}) is a factor.` : '.'}</p>
          </div>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">Exact rational arithmetic — r can be a fraction like 1/2 (testing the rational-root candidates). Runs locally.</p>
      </div>)}
    </div>
  );
}
