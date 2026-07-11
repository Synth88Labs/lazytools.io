import { useMemo, useState } from 'preact/hooks';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : null; };
const fmt = (x: number) => Number(x.toPrecision(6)).toString();

/** Given any two of V,I,R,P, compute the other two. */
function solveOhm(V: number | null, I: number | null, R: number | null, P: number | null) {
  const known = [V, I, R, P].filter((x) => x != null).length;
  if (known < 2) return null;
  // derive V and I first from whichever pair
  for (let i = 0; i < 4; i++) {
    if (V == null && I != null && R != null) V = I * R;
    if (V == null && P != null && I != null && I !== 0) V = P / I;
    if (V == null && P != null && R != null && P * R >= 0) V = Math.sqrt(P * R);
    if (I == null && V != null && R != null && R !== 0) I = V / R;
    if (I == null && P != null && V != null && V !== 0) I = P / V;
    if (I == null && P != null && R != null && R !== 0 && P / R >= 0) I = Math.sqrt(P / R);
    if (R == null && V != null && I != null && I !== 0) R = V / I;
    if (P == null && V != null && I != null) P = V * I;
  }
  if (V == null || I == null || R == null || P == null) return null;
  return { V, I, R, P };
}

export default function OhmsLawTool() {
  const [V, setV] = useState('12');
  const [I, setI] = useState('');
  const [R, setR] = useState('4');
  const [P, setP] = useState('');

  const { result, count } = useMemo(() => {
    const v = num(V), i = num(I), r = num(R), p = num(P);
    const c = [v, i, r, p].filter((x) => x != null).length;
    return { result: c >= 2 ? solveOhm(v, i, r, p) : null, count: c };
  }, [V, I, R, P]);

  const field = (val: string, set: (v: string) => void, sym: string, name: string, unit: string) => (
    <label class="block">
      <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"><span class="font-mono text-brand-700">{sym}</span> {name} <span class="text-slate-400">({unit})</span></span>
      <input type="number" step="any" value={val} onInput={(e) => set((e.target as HTMLInputElement).value)}
        class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200" />
    </label>
  );

  const cell = (sym: string, name: string, unit: string, val: number | undefined, given: boolean) => (
    <div class={`rounded-xl p-4 text-center ${given ? 'bg-white ring-1 ring-slate-200' : 'bg-white ring-2 ring-brand-200'}`}>
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{sym} — {name}</p>
      <p class={`mt-1 font-mono text-xl font-bold ${given ? 'text-slate-700' : 'text-brand-800'}`}>{val != null ? fmt(val) : '—'} <span class="text-xs font-normal text-slate-400">{unit}</span></p>
    </div>
  );

  const givenV = num(V) != null, givenI = num(I) != null, givenR = num(R) != null, givenP = num(P) != null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Enter any two of V, I, R, P</p>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {field(V, setV, 'V', 'voltage', 'volts')}
        {field(I, setI, 'I', 'current', 'amps')}
        {field(R, setR, 'R', 'resistance', 'Ω')}
        {field(P, setP, 'P', 'power', 'watts')}
      </div>

      {count > 2 && <p class="mt-3 text-sm text-amber-700">Enter exactly two values (you have {count}); the tool derives the other two.</p>}

      {result && count === 2 && (
        <>
          <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cell('V', 'voltage', 'V', result.V, givenV)}
            {cell('I', 'current', 'A', result.I, givenI)}
            {cell('R', 'resistance', 'Ω', result.R, givenR)}
            {cell('P', 'power', 'W', result.P, givenP)}
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 text-center text-xs font-mono text-slate-500">
            <span class="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-200">V = I·R</span>
            <span class="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-200">P = V·I</span>
            <span class="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-200">P = I²·R</span>
            <span class="rounded-lg bg-white px-2 py-1.5 ring-1 ring-slate-200">P = V²/R</span>
          </div>
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">
        The Ohm’s-law / power wheel: 12 relations between voltage, current, resistance and power. 🔒 Computed in your browser.
      </p>
    </div>
  );
}
