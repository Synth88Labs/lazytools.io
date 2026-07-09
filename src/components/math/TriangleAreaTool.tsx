import { useState } from 'preact/hooks';
import { Rat, heronExact, radicalToString } from '../../lib/mathx';

const inputCls = 'w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

export default function TriangleAreaTool() {
  const [aStr, setAStr] = useState('3');
  const [bStr, setBStr] = useState('5');
  const [cStr, setCStr] = useState('6');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    const a = Rat.parse(aStr), b = Rat.parse(bStr), c = Rat.parse(cStr);
    const { coef, radicand, sixteenASq } = heronExact(a, b, c);
    const exact = radicalToString(coef, radicand);
    const approxA = (Number(coef.n) / Number(coef.d)) * Math.sqrt(Number(radicand));
    const s = a.add(b).add(c).div(new Rat(2n));
    const perim = a.add(b).add(c);
    body = (
      <>
        <div class="mt-5 flex flex-wrap gap-3">
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-2 ring-brand-200">
            <p class="font-mono text-3xl font-extrabold text-brand-700">A = {exact}</p>
            {radicand !== 1n && <p class="text-xs text-slate-500">≈ {approxA.toPrecision(8).replace(/\.?0+$/, '')}</p>}
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">area (exact{radicand !== 1n ? ' simplified radical' : ''})</p>
          </div>
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{perim.toFrac()}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">perimeter</p>
          </div>
          <div class="rounded-xl bg-white px-5 py-3 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{s.toFrac()}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">semi-perimeter s</p>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working (Heron's formula, integer-safe form)</p>
          <ol class="mt-2 list-decimal space-y-1 pl-5">
            <li>16A² = (a+b+c)(−a+b+c)(a−b+c)(a+b−c) — Heron's formula with the fractions cleared</li>
            <li>16A² = ({a.add(b).add(c).toFrac()})({b.add(c).sub(a).toFrac()})({a.add(c).sub(b).toFrac()})({a.add(b).sub(c).toFrac()}) = <strong class="font-mono">{sixteenASq.toFrac()}</strong></li>
            <li>A = √({sixteenASq.toFrac()}) / 4 = <strong class="font-mono">{exact}</strong>{radicand !== 1n ? ' — simplified radical form' : ' — a whole area (Heronian triangle!)'}</li>
          </ol>
        </div>
      </>
    );
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-2 text-lg font-bold text-slate-500">
        <span>Sides:</span>
        <input class={inputCls} value={aStr} onInput={(e) => setAStr((e.target as HTMLInputElement).value)} aria-label="side a" />
        <input class={inputCls} value={bStr} onInput={(e) => setBStr((e.target as HTMLInputElement).value)} aria-label="side b" />
        <input class={inputCls} value={cStr} onInput={(e) => setCStr((e.target as HTMLInputElement).value)} aria-label="side c" />
      </div>
      <p class="mt-1.5 text-xs text-slate-500">Sides accept integers, decimals and fractions. The triangle inequality is checked before computing.</p>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">
        Exact areas: sides 3, 5, 6 give exactly 2√14, and 3-4-5 gives exactly 6 — where every decimal calculator prints 7.4833…. Runs locally.
      </p>
    </div>
  );
}
