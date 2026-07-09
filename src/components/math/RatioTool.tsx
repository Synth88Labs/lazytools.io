import { useState } from 'preact/hooks';
import { Rat, gcdB } from '../../lib/mathx';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

export default function RatioTool() {
  const [mode, setMode] = useState<'solve' | 'simplify'>('solve');
  const [a, setA] = useState('3');
  const [b, setB] = useState('4');
  const [c, setC] = useState('9');
  const [sA, setSA] = useState('48');
  const [sB, setSB] = useState('36');

  let solveOut: { x: Rat; cross: string } | null = null;
  let simplifyOut: { l: bigint; r: bigint } | null = null;
  let error = '';
  try {
    if (mode === 'solve') {
      const ra = Rat.parse(a), rb = Rat.parse(b), rc = Rat.parse(c);
      if (ra.isZero()) throw new Error('The first term cannot be zero.');
      const x = rb.mul(rc).div(ra);
      solveOut = { x, cross: `x = (${rb.toFrac()} × ${rc.toFrac()}) ÷ ${ra.toFrac()}` };
    } else {
      if (!/^\d+$/.test(sA.trim()) || !/^\d+$/.test(sB.trim())) throw new Error('Enter two positive integers.');
      const l = BigInt(sA.trim()), r = BigInt(sB.trim());
      if (l === 0n && r === 0n) throw new Error('At least one side must be non-zero.');
      const g = gcdB(l, r) || 1n;
      simplifyOut = { l: l / g, r: r / g };
    }
  } catch (e) {
    error = (e as Error).message;
  }

  const dec = solveOut?.x.toDecimal(10);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2">
        <button type="button" class={tabCls(mode === 'solve')} onClick={() => setMode('solve')}>Solve a : b = c : x</button>
        <button type="button" class={tabCls(mode === 'simplify')} onClick={() => setMode('simplify')}>Simplify a ratio</button>
      </div>

      {mode === 'solve' ? (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-2xl font-bold text-slate-500">
          <input class={inputCls} value={a} onInput={(e) => setA((e.target as HTMLInputElement).value)} aria-label="a" />
          :
          <input class={inputCls} value={b} onInput={(e) => setB((e.target as HTMLInputElement).value)} aria-label="b" />
          =
          <input class={inputCls} value={c} onInput={(e) => setC((e.target as HTMLInputElement).value)} aria-label="c" />
          :
          <span class="rounded-lg bg-brand-50 px-4 py-2 font-mono text-brand-800 ring-2 ring-brand-200">{solveOut ? solveOut.x.toFrac() : '?'}</span>
        </div>
      ) : (
        <div class="mt-4 flex items-center gap-2 text-2xl font-bold text-slate-500">
          <input class={inputCls} value={sA} onInput={(e) => setSA((e.target as HTMLInputElement).value)} aria-label="left" />
          :
          <input class={inputCls} value={sB} onInput={(e) => setSB((e.target as HTMLInputElement).value)} aria-label="right" />
          {simplifyOut && <span class="ml-2">= <span class="rounded-lg bg-brand-50 px-4 py-2 font-mono text-brand-800 ring-2 ring-brand-200">{String(simplifyOut.l)} : {String(simplifyOut.r)}</span></span>}
        </div>
      )}

      {error && <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p>}

      {mode === 'solve' && solveOut && (
        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (cross-multiplication)</p>
          <p class="mt-1 font-mono">{solveOut.cross} = {solveOut.x.toFrac()}{!dec!.exact || solveOut.x.d !== 1n ? ` ${dec!.exact ? '=' : '≈'} ${dec!.text}` : ''}</p>
        </div>
      )}
      <p class="mt-4 text-xs text-slate-500">Exact rational arithmetic — 2 : 3 = 5 : x gives x = 15/2, not 7.4999…. Recipes, map scales, aspect ratios, mixing. Runs locally.</p>
    </div>
  );
}
