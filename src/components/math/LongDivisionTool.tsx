import { useState } from 'preact/hooks';
import { longDivision } from '../../lib/mathx';

const inputCls = 'w-44 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

export default function LongDivisionTool() {
  const [aStr, setAStr] = useState('7439');
  const [bStr, setBStr] = useState('12');

  let result: ReturnType<typeof longDivision> | null = null;
  let error = '';
  try {
    const a = aStr.trim().replace(/[,\s]/g, ''), b = bStr.trim().replace(/[,\s]/g, '');
    if (!/^\d+$/.test(a) || !/^\d+$/.test(b)) throw new Error('Enter two non-negative whole numbers.');
    if (a.length > 30) throw new Error('Keep the dividend to 30 digits or fewer so the working stays readable.');
    result = longDivision(BigInt(a), BigInt(b));
  } catch (e) {
    error = (e as Error).message;
  }

  const dec = result
    ? result.remainder === 0n
      ? ''
      : result.repeatStart >= 0
        ? `${result.decimalDigits.slice(0, result.repeatStart)}(${result.decimalDigits.slice(result.repeatStart)})`
        : result.decimalDigits + (result.truncated ? '…' : '')
    : '';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Dividend</span>
          <input class={inputCls} value={aStr} onInput={(e) => setAStr((e.target as HTMLInputElement).value)} />
        </label>
        <span class="pb-2 text-xl font-bold text-slate-500">÷</span>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Divisor</span>
          <input class={inputCls} value={bStr} onInput={(e) => setBStr((e.target as HTMLInputElement).value)} />
        </label>
      </div>

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {result && (
        <>
          <div class="mt-5 flex flex-wrap gap-3">
            <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="break-all font-mono text-3xl font-extrabold text-brand-700">{String(result.quotient)}{result.remainder !== 0n && <span class="text-xl text-slate-500"> r {String(result.remainder)}</span>}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">quotient · remainder</p>
            </div>
            {result.remainder !== 0n && (
              <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
                <p class="break-all font-mono text-3xl font-extrabold text-slate-800">{String(result.quotient)}.{dec}</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{result.repeatStart >= 0 ? 'exact decimal — repetend in ( )' : result.truncated ? 'decimal (first 60 digits)' : 'exact decimal'}</p>
              </div>
            )}
          </div>

          <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th class="px-3 py-2">Step</th>
                  <th class="px-3 py-2">Bring down</th>
                  <th class="px-3 py-2 text-right">Working value</th>
                  <th class="px-3 py-2 text-right">÷ {bStr.trim()} →</th>
                  <th class="px-3 py-2 text-right">Subtract</th>
                  <th class="px-3 py-2 text-right">Remainder</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                {result.steps.map((s, i) => (
                  <tr class={s.q === 0n && s.partial < BigInt(bStr.trim() || '1') && i === 0 ? 'text-slate-400' : ''}>
                    <td class="px-3 py-1.5 text-slate-500">{i + 1}</td>
                    <td class="px-3 py-1.5 font-bold text-brand-700">{s.digit}</td>
                    <td class="px-3 py-1.5 text-right text-slate-800">{String(s.partial)}</td>
                    <td class="px-3 py-1.5 text-right font-bold text-slate-900">{String(s.q)}</td>
                    <td class="px-3 py-1.5 text-right text-slate-600">− {String(s.product)}</td>
                    <td class="px-3 py-1.5 text-right text-slate-800">{String(s.rem)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="mt-2 text-xs text-slate-500">
            Read each row as one long-division step: bring down the next digit, divide the working value by the divisor to get the next quotient digit, subtract, carry the remainder. The quotient digits down the "→" column spell {String(result.quotient)}.
          </p>
        </>
      )}
      <p class="mt-4 text-xs text-slate-500">BigInt arithmetic — 30-digit dividends divide exactly. Repeating decimals are detected and shown with the repetend in parentheses. Runs locally.</p>
    </div>
  );
}
