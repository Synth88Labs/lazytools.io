import { useState } from 'preact/hooks';
import { Rat, degToPiFraction, dmsToDegrees, absB } from '../../lib/mathx';

const inputCls = 'w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none';
const tabCls = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-brand-700'}`;

function piFracToString(f: Rat): string {
  if (f.isZero()) return '0';
  const sign = f.sign() < 0 ? '−' : '';
  const n = absB(f.n);
  const numPart = n === 1n ? 'π' : `${n}π`;
  return f.d === 1n ? `${sign}${numPart}` : `${sign}${numPart}/${f.d}`;
}

const COMMON: [string, string][] = [['30', 'π/6'], ['45', 'π/4'], ['60', 'π/3'], ['90', 'π/2'], ['180', 'π'], ['270', '3π/2'], ['360', '2π']];

export default function DegreesRadiansTool() {
  const [mode, setMode] = useState<'d2r' | 'r2d' | 'dms'>('d2r');
  const [deg, setDeg] = useState('135');
  const [piCoef, setPiCoef] = useState('5/6');
  const [dd, setDd] = useState('30');
  const [dm, setDm] = useState('15');
  const [ds, setDs] = useState('50');

  let body: preact.JSX.Element | null = null;
  let error = '';
  try {
    if (mode === 'd2r') {
      const d = Rat.parse(deg);
      const f = degToPiFraction(d);
      const dec = (Number(d.n) / Number(d.d)) * (Math.PI / 180);
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {deg}° = {piFracToString(f)} rad <span class="text-base font-semibold text-slate-600">≈ {dec.toFixed(6)}</span>
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <p class="mt-1">Multiply by π/180 and reduce the fraction: {deg}° × π/180 = {d.toFrac()}π/180 = <strong class="font-mono">{piFracToString(f)}</strong>. The exact π form is what trigonometry and calculus expect — sin(π/4), not sin(0.7854).</p>
          </div>
        </>
      );
    } else if (mode === 'r2d') {
      const c = Rat.parse(piCoef);
      const degrees = c.mul(new Rat(180n));
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {piFracToString(c)} rad = {degrees.toFrac()}°
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <p class="mt-1">π radians is 180°, so multiply the coefficient by 180: ({c.toFrac()}) × 180° = <strong class="font-mono">{degrees.toFrac()}°</strong>, exactly.</p>
          </div>
        </>
      );
    } else {
      const D = Rat.parse(dd), M = Rat.parse(dm), S = Rat.parse(ds);
      if (M.sign() < 0 || S.sign() < 0) throw new Error('Minutes and seconds must be non-negative (put the sign on the degrees).');
      const decDeg = dmsToDegrees(D, M, S);
      const decTxt = decDeg.toDecimal(8);
      body = (
        <>
          <p class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 font-mono text-2xl font-extrabold text-brand-800">
            {dd}° {dm}′ {ds}″ = {decDeg.toFrac()}° {decTxt.exact ? '=' : '≈'} {decTxt.text}°
          </p>
          <div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Working</p>
            <p class="mt-1">A minute is 1/60 of a degree and a second 1/3600: {dd} + {dm}/60 + {ds}/3600 = <strong class="font-mono">{decDeg.toFrac()}°</strong> — kept exact as a fraction, the way GPS coordinates should be converted.</p>
          </div>
        </>
      );
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap gap-2">
        <button type="button" class={tabCls(mode === 'd2r')} onClick={() => setMode('d2r')}>Degrees → radians</button>
        <button type="button" class={tabCls(mode === 'r2d')} onClick={() => setMode('r2d')}>Radians → degrees</button>
        <button type="button" class={tabCls(mode === 'dms')} onClick={() => setMode('dms')}>DMS → decimal</button>
      </div>

      {mode === 'd2r' && (
        <label class="mt-4 flex items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={deg} onInput={(e) => setDeg((e.target as HTMLInputElement).value)} aria-label="degrees" />°
        </label>
      )}
      {mode === 'r2d' && (
        <label class="mt-4 flex items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={piCoef} onInput={(e) => setPiCoef((e.target as HTMLInputElement).value)} aria-label="coefficient of pi" />
          <span>× π rad — e.g. 5/6 for 5π/6</span>
        </label>
      )}
      {mode === 'dms' && (
        <div class="mt-4 flex flex-wrap items-center gap-2 text-xl font-bold text-slate-500">
          <input class={inputCls} value={dd} onInput={(e) => setDd((e.target as HTMLInputElement).value)} aria-label="degrees" />°
          <input class={inputCls} value={dm} onInput={(e) => setDm((e.target as HTMLInputElement).value)} aria-label="minutes" />′
          <input class={inputCls} value={ds} onInput={(e) => setDs((e.target as HTMLInputElement).value)} aria-label="seconds" />″
        </div>
      )}

      {error ? <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{error}</p> : body}

      {mode === 'd2r' && (
        <div class="mt-4">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Common angles</span>
          <div class="mt-1.5 flex flex-wrap gap-2">
            {COMMON.map(([d, r]) => (
              <button type="button" class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 font-mono text-xs text-slate-600 transition hover:border-brand-400 hover:text-brand-700" onClick={() => setDeg(d)}>
                {d}° = {r}
              </button>
            ))}
          </div>
        </div>
      )}
      <p class="mt-4 text-xs text-slate-500">Exact π fractions — 45° is π/4, never 0.7853981634. Runs locally.</p>
    </div>
  );
}
