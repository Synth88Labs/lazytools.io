import { useState, useMemo } from 'preact/hooks';
import { solveTriangle, type TriangleSolution } from '../../lib/math-extra';

const inp = 'w-20 rounded-lg border border-slate-300 bg-white px-2 py-2 text-center font-mono text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const fmt = (x: number) => Number(x.toPrecision(5)).toString();
const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };

function Diagram({ t }: { t: TriangleSolution }) {
  const A = t.A * Math.PI / 180;
  // A=(0,0), B=(c,0), C=(b cosA, b sinA)
  const pts = [[0, 0], [t.c, 0], [t.b * Math.cos(A), t.b * Math.sin(A)]];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = maxX - minX || 1, h = maxY - minY || 1, scale = 180 / Math.max(w, h), pad = 24;
  const P = pts.map(([x, y]) => [pad + (x - minX) * scale, pad + (maxY - y) * scale]);
  const labels = ['A', 'B', 'C'];
  return (
    <svg viewBox={`0 0 ${180 * (w / Math.max(w, h)) + pad * 2} ${180 * (h / Math.max(w, h)) + pad * 2}`} class="max-h-56 w-full max-w-xs" role="img" aria-label="Triangle diagram">
      <polygon points={P.map((p) => p.join(',')).join(' ')} fill="#dbeafe" stroke="#2563eb" stroke-width="2" />
      {P.map((p, i) => <><circle cx={p[0]} cy={p[1]} r="3" fill="#1d4ed8" /><text x={p[0]} y={p[1]} dx={i === 1 ? 8 : -10} dy={i === 2 ? -6 : 14} font-size="12" font-weight="700" fill="#1e3a8a">{labels[i]}</text></>)}
    </svg>
  );
}

export default function TriangleSolverTool() {
  const [v, setV] = useState<Record<string, string>>({ a: '3', b: '4', c: '5', A: '', B: '', C: '' });
  const set = (k: string) => (e: Event) => setV((s) => ({ ...s, [k]: (e.target as HTMLInputElement).value }));

  const res = useMemo(() => solveTriangle({ a: num(v.a), b: num(v.b), c: num(v.c), A: num(v.A), B: num(v.B), C: num(v.C) }), [v]);

  const Field = ({ k, label }: { k: string; label: string }) => (
    <label class="flex flex-col items-center gap-1"><span class="text-xs font-semibold text-slate-500">{label}</span><input value={v[k]} onInput={set(k)} placeholder="?" class={inp} type="number" step="any" /></label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Enter any 3 values (at least one side). Angles in degrees.</p>
      <div class="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-6">
        <Field k="a" label="side a" /><Field k="b" label="side b" /><Field k="c" label="side c" />
        <Field k="A" label="angle A°" /><Field k="B" label="angle B°" /><Field k="C" label="angle C°" />
      </div>

      {res.error ? (
        <p class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 ring-1 ring-amber-200">{res.error}</p>
      ) : res.solutions.length ? (
        <div class="mt-4 space-y-4">
          {res.solutions.length > 1 && <p class="text-sm font-semibold text-amber-700">Ambiguous case (SSA): {res.solutions.length} possible triangles.</p>}
          {res.solutions.map((t, i) => (
            <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
              {res.solutions.length > 1 && <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Solution {i + 1}</p>}
              <div class="flex flex-wrap items-center gap-4">
                <div class="grid grid-cols-3 gap-x-4 gap-y-1 font-mono text-sm">
                  <span>a = <b class="text-brand-800">{fmt(t.a)}</b></span><span>b = <b class="text-brand-800">{fmt(t.b)}</b></span><span>c = <b class="text-brand-800">{fmt(t.c)}</b></span>
                  <span>A = <b class="text-brand-800">{fmt(t.A)}°</b></span><span>B = <b class="text-brand-800">{fmt(t.B)}°</b></span><span>C = <b class="text-brand-800">{fmt(t.C)}°</b></span>
                  <span class="col-span-3 mt-1 border-t border-slate-100 pt-1 text-slate-600">area = <b>{fmt(t.area)}</b> · perimeter = <b>{fmt(t.perimeter)}</b></span>
                </div>
                <div class="flex-1"><Diagram t={t} /></div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <p class="mt-4 text-xs text-slate-500">Solves from any valid combination — three sides (SSS), two sides and the included angle (SAS), two angles and a side (ASA/AAS), or two sides and a non-included angle (SSA, which can give two triangles). Uses the laws of sines and cosines; angles sum to 180°. 🔒 In your browser.</p>
    </div>
  );
}
