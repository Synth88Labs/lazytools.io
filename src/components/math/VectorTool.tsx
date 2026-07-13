import { useMemo, useState } from 'preact/hooks';
import { vecMagnitude, vecAdd, vecSub, vecDot, vecCross, vecAngle } from '../../lib/math-extra';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) ? n : 0; };
const fmt = (x: number, d = 4) => Number(x.toFixed(d)).toString();
const vstr = (v: number[]) => `(${v.map((x) => fmt(x)).join(', ')})`;

export default function VectorTool() {
  const [dim, setDim] = useState<2 | 3>(3);
  const [a, setA] = useState(['1', '2', '2']);
  const [b, setB] = useState(['2', '0', '3']);

  const va = a.slice(0, dim).map(num);
  const vb = b.slice(0, dim).map(num);

  const r = useMemo(() => ({
    magA: vecMagnitude(va), magB: vecMagnitude(vb),
    add: vecAdd(va, vb), sub: vecSub(va, vb),
    dot: vecDot(va, vb), cross: dim === 3 ? vecCross(va, vb) : null,
    angle: vecAngle(va, vb),
  }), [a, b, dim]);

  const inp = 'w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;
  const setComp = (which: 'a' | 'b', i: number, val: string) => {
    (which === 'a' ? setA : setB)((prev) => prev.map((x, j) => (j === i ? val : x)));
  };
  const row = (label: string, vec: string[], which: 'a' | 'b') => (
    <div class="flex items-center gap-2">
      <span class="w-6 font-mono text-sm font-bold text-slate-700">{label}</span>
      <span class="text-slate-400">(</span>
      {Array.from({ length: dim }, (_, i) => (
        <input type="number" step="any" value={vec[i]} onInput={(e) => setComp(which, i, (e.target as HTMLInputElement).value)} class={inp} />
      ))}
      <span class="text-slate-400">)</span>
    </div>
  );
  const cell = (label: string, val: string) => (
    <div class="rounded-lg bg-white p-3 ring-1 ring-slate-200"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p><p class="mt-0.5 font-mono text-base font-bold text-slate-800">{val}</p></div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex gap-2">
        {([2, 3] as const).map((d) => <button onClick={() => setDim(d)} class={tog(dim === d)}>{d}D</button>)}
      </div>
      <div class="space-y-2">
        {row('a', a, 'a')}
        {row('b', b, 'b')}
      </div>

      <div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {cell('|a| (magnitude)', fmt(r.magA))}
        {cell('|b| (magnitude)', fmt(r.magB))}
        {cell('a · b (dot product)', r.dot != null ? fmt(r.dot) : '—')}
        {cell('a + b', r.add ? vstr(r.add) : '—')}
        {cell('a − b', r.sub ? vstr(r.sub) : '—')}
        {cell('Angle (a, b)', r.angle != null ? `${fmt(r.angle, 2)}°` : '—')}
        {dim === 3 && cell('a × b (cross product)', r.cross ? vstr(r.cross) : '—')}
      </div>

      <p class="mt-4 text-xs text-slate-500">Magnitude is √(x² + y² + …). The dot product a·b = Σaᵢbᵢ relates to the angle by a·b = |a||b|cosθ (zero means perpendicular). The cross product a × b (3D only) is a vector perpendicular to both, with magnitude |a||b|sinθ. 🔒 In your browser.</p>
    </div>
  );
}
