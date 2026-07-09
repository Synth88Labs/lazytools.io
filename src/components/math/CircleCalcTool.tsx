import { useState } from 'preact/hooks';
import { Rat, absB } from '../../lib/mathx';

const inputCls = 'w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';

/** "coef·π" display with exact fraction coefficient. */
function piForm(coef: Rat): string {
  if (coef.isZero()) return '0';
  const sign = coef.sign() < 0 ? '−' : '';
  const n = absB(coef.n);
  const numTxt = n === 1n ? 'π' : `${n}π`;
  return coef.d === 1n ? `${sign}${numTxt}` : `${sign}${numTxt}/${coef.d}`;
}
const approx = (coef: Rat) => ((Number(coef.n) / Number(coef.d)) * Math.PI).toPrecision(8).replace(/\.?0+$/, '');

export default function CircleCalcTool() {
  const [mode, setMode] = useState<'radius' | 'diameter'>('radius');
  const [rStr, setRStr] = useState('6');
  const [thetaStr, setThetaStr] = useState('60');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    const input = Rat.parse(rStr);
    if (input.sign() <= 0) throw new Error('Enter a positive radius/diameter.');
    const r = mode === 'radius' ? input : input.div(new Rat(2n));
    const area = r.mul(r); // × π
    const circ = r.mul(new Rat(2n)); // × π
    let theta: Rat | null = null;
    try { theta = thetaStr.trim() ? Rat.parse(thetaStr) : null; } catch { theta = null; }
    const arc = theta ? theta.div(new Rat(180n)).mul(r) : null; // × π
    const sector = theta ? theta.div(new Rat(360n)).mul(r).mul(r) : null; // × π

    body = (
      <>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
            <p class="font-mono text-2xl font-extrabold text-brand-700">{piForm(area)}</p>
            <p class="text-xs text-slate-500">≈ {approx(area)}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">area (πr²)</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{piForm(circ)}</p>
            <p class="text-xs text-slate-500">≈ {approx(circ)}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">circumference (2πr)</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{r.toFrac()}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">radius</p>
          </div>
          <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
            <p class="font-mono text-2xl font-extrabold text-slate-800">{r.mul(new Rat(2n)).toFrac()}</p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">diameter</p>
          </div>
        </div>

        {theta && arc && sector && (
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="font-mono text-2xl font-extrabold text-slate-800">{piForm(arc)}</p>
              <p class="text-xs text-slate-500">≈ {approx(arc)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">arc length for {thetaStr}° (θ/360 · 2πr)</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class="font-mono text-2xl font-extrabold text-slate-800">{piForm(sector)}</p>
              <p class="text-xs text-slate-500">≈ {approx(sector)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">sector area for {thetaStr}° (θ/360 · πr²)</p>
            </div>
          </div>
        )}

        <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li>Area = πr² = π · ({r.toFrac()})² = <strong class="font-mono">{piForm(area)}</strong></li>
            <li>Circumference = 2πr = 2π · {r.toFrac()} = <strong class="font-mono">{piForm(circ)}</strong></li>
            {theta && arc && <li>Arc = (θ/360) · 2πr = ({thetaStr}/360) · {piForm(circ)} = <strong class="font-mono">{piForm(arc)}</strong></li>}
          </ul>
        </div>
      </>
    );
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-end gap-3">
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">
            <select class="mr-1 rounded border border-slate-300 bg-white px-1 py-0.5 text-xs" value={mode} onChange={(e) => setMode((e.target as HTMLSelectElement).value as typeof mode)}>
              <option value="radius">Radius</option>
              <option value="diameter">Diameter</option>
            </select>
          </span>
          <input class={inputCls} value={rStr} onInput={(e) => setRStr((e.target as HTMLInputElement).value)} aria-label={mode} />
        </label>
        <label class="block">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Central angle θ° (optional, for arc/sector)</span>
          <input class={inputCls} value={thetaStr} onInput={(e) => setThetaStr((e.target as HTMLInputElement).value)} aria-label="central angle in degrees" />
        </label>
      </div>

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      <p class="mt-4 text-xs text-slate-500">
        Answers "in terms of π" — r = 6 gives area 36π, exactly what the homework asks for — with decimals alongside. Runs locally.
      </p>
    </div>
  );
}
