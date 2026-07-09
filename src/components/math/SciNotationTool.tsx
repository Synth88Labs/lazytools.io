import { useState } from 'preact/hooks';

const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

/** Exact string-based conversion decimal → scientific (no float rounding). */
function toSci(sRaw: string): { mant: string; exp: number } {
  const s = sRaw.trim().replace(/,/g, '');
  const m = s.match(/^(-?)(\d*)\.?(\d*)$/);
  if (!m || (!m[2] && !m[3])) throw new Error('Enter a plain decimal number like 300000000 or 0.00042.');
  const sign = m[1] === '-' ? '-' : '';
  const digitsAll = (m[2] ?? '') + (m[3] ?? '');
  const pointPos = (m[2] ?? '').length; // digits before the decimal point
  const firstSig = digitsAll.search(/[1-9]/);
  if (firstSig === -1) return { mant: '0', exp: 0 };
  const lastSig = digitsAll.search(/[1-9]0*$/) === -1 ? digitsAll.length - 1 : digitsAll.replace(/0+$/, '').length - 1;
  const sig = digitsAll.slice(firstSig, lastSig + 1);
  const exp = pointPos - firstSig - 1;
  const mant = sig.length === 1 ? sig : `${sig[0]}.${sig.slice(1)}`;
  return { mant: sign + mant, exp };
}

/** Exact string-based conversion mantissa/exponent → plain decimal. */
function fromSci(mantRaw: string, expRaw: string): string {
  const mant = mantRaw.trim().replace(/,/g, '');
  const exp = parseInt(expRaw.trim(), 10);
  const m = mant.match(/^(-?)(\d+)\.?(\d*)$/);
  if (!m || !Number.isFinite(exp)) throw new Error('Mantissa like 4.2 and a whole-number exponent, please.');
  if (Math.abs(exp) > 1000) throw new Error('Keep the exponent within ±1000 for a readable result.');
  const sign = m[1]!;
  const digits = m[2]! + (m[3] ?? '');
  const pointPos = m[2]!.length + exp; // where the point lands in `digits`
  let out: string;
  if (pointPos <= 0) out = '0.' + '0'.repeat(-pointPos) + digits;
  else if (pointPos >= digits.length) out = digits + '0'.repeat(pointPos - digits.length);
  else out = digits.slice(0, pointPos) + '.' + digits.slice(pointPos);
  out = out.replace(/^0+(?=\d)/, '').replace(/\.$/, '');
  if (out.includes('.')) out = out.replace(/0+$/, '').replace(/\.$/, '');
  return sign + out;
}

const sup = (n: number) => String(n).split('').map((ch) => (ch === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(ch)])).join('');

export default function SciNotationTool() {
  const [mode, setMode] = useState<'to' | 'from'>('to');
  const [plain, setPlain] = useState('299792458');
  const [mant, setMant] = useState('6.022');
  const [exp, setExp] = useState('23');

  let out: { sci: string; e: string; plainOut?: string } | null = null;
  let error = '';
  try {
    if (mode === 'to') {
      const r = toSci(plain);
      out = { sci: `${r.mant} × 10${sup(r.exp)}`, e: `${r.mant}e${r.exp}` };
    } else {
      const p = fromSci(mant, exp);
      out = { sci: `${mant.trim()} × 10${sup(parseInt(exp, 10) || 0)}`, e: `${mant.trim()}e${exp.trim()}`, plainOut: p };
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2">
        <button type="button" class={tabCls(mode === 'to')} onClick={() => setMode('to')}>Number → scientific</button>
        <button type="button" class={tabCls(mode === 'from')} onClick={() => setMode('from')}>Scientific → number</button>
      </div>

      {mode === 'to' ? (
        <label class="mt-4 block max-w-sm">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Plain number</span>
          <input class={inputCls} value={plain} onInput={(e) => setPlain((e.target as HTMLInputElement).value)} placeholder="0.00042" />
        </label>
      ) : (
        <div class="mt-4 flex max-w-sm items-end gap-2">
          <label class="block flex-1">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mantissa</span>
            <input class={inputCls} value={mant} onInput={(e) => setMant((e.target as HTMLInputElement).value)} placeholder="6.022" />
          </label>
          <span class="pb-2 font-bold text-slate-500">× 10^</span>
          <label class="block w-24">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Exponent</span>
            <input class={inputCls} value={exp} onInput={(e) => setExp((e.target as HTMLInputElement).value)} placeholder="23" />
          </label>
        </div>
      )}

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {out && (
        <div class="mt-4 flex flex-wrap gap-3">
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-brand-700">{out.sci}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">scientific notation</p>
          </div>
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{out.e}</p>
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">e-notation</p>
          </div>
          {out.plainOut && (
            <div class="max-w-full rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
              <p class="break-all font-mono text-2xl font-extrabold text-slate-800">{out.plainOut}</p>
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">plain number</p>
            </div>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Conversion is done on the digits themselves, not via floating point — so 123456789012345678901 keeps every digit instead of becoming 1.2345678901234568e20. Runs locally.
      </p>
    </div>
  );
}
