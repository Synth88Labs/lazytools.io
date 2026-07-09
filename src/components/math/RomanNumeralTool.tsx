import { useState } from 'preact/hooks';
import { toRoman, fromRoman } from '../../lib/mathx';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-2xl text-slate-900 focus:border-brand-500 focus:outline-none';

export default function RomanNumeralTool() {
  const [numStr, setNumStr] = useState('2026');
  const [romStr, setRomStr] = useState('MMXXVI');
  const [last, setLast] = useState<'num' | 'rom'>('num');

  let roman = '', num = '', error = '';
  try {
    if (last === 'num') {
      const n = parseInt(numStr.trim(), 10);
      if (!Number.isFinite(n)) throw new Error('Enter a whole number from 1 to 3999.');
      roman = toRoman(n);
      num = String(n);
    } else {
      const n = fromRoman(romStr);
      num = String(n);
      roman = toRoman(n);
    }
  } catch (e) {
    error = (e as Error).message;
  }

  const YEARS = [['MCMXCIX', '1999'], ['MM', '2000'], ['MMXXIV', '2024'], ['MMXXVI', '2026'], ['MCMLXXVII', '1977'], ['MDCCLXXVI', '1776']];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Number (1–3999)</span>
          <input class={inputCls} value={last === 'num' ? numStr : num} onInput={(e) => { setNumStr((e.target as HTMLInputElement).value); setLast('num'); }} placeholder="2026" />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Roman numeral</span>
          <input class={inputCls} value={last === 'rom' ? romStr : roman} onInput={(e) => { setRomStr((e.target as HTMLInputElement).value); setLast('rom'); }} placeholder="MMXXVI" style="text-transform:uppercase" />
        </label>
      </div>

      {error ? (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>
      ) : (
        <p class="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-xl font-extrabold text-brand-800">
          {num} = {roman}
        </p>
      )}

      <div class="mt-4">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Common years</span>
        <div class="mt-1.5 flex flex-wrap gap-2">
          {YEARS.map(([r, n]) => (
            <button
              type="button"
              class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
              onClick={() => { setNumStr(n!); setLast('num'); }}
            >
              {n} = {r}
            </button>
          ))}
        </div>
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Standard (subtractive) notation: I=1, V=5, X=10, L=50, C=100, D=500, M=1000; IV=4, IX=9, XL=40, XC=90, CD=400, CM=900. Malformed numerals like "IIII" or "IC" are rejected with the canonical spelling suggested. Converts locally.
      </p>
    </div>
  );
}
