import { useState, useMemo } from 'preact/hooks';
import { matAdd, matSub, matMul, matDet, matInverse, matTranspose, type Matrix } from '../../lib/math-extra';

type Op = 'det' | 'inv' | 'trans' | 'add' | 'sub' | 'mul';
const UNARY: Op[] = ['det', 'inv', 'trans'];
const OPS: { id: Op; label: string }[] = [
  { id: 'det', label: 'Determinant |A|' }, { id: 'inv', label: 'Inverse A⁻¹' }, { id: 'trans', label: 'Transpose Aᵀ' },
  { id: 'add', label: 'A + B' }, { id: 'sub', label: 'A − B' }, { id: 'mul', label: 'A × B' },
];

const blank = (n: number, seed: Matrix): Matrix => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => seed[i]?.[j] ?? (i === j ? 1 : 0)));
const fmt = (x: number) => Number(Number(x.toPrecision(6)).toString());

function Grid({ M, n, onSet }: { M: Matrix; n: number; onSet: (i: number, j: number, v: string) => void }) {
  return (
    <div class="inline-grid gap-1" style={`grid-template-columns: repeat(${n}, minmax(0, 1fr))`}>
      {Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (
        <input type="number" step="any" value={String(M[i][j])} onInput={(e) => onSet(i, j, (e.target as HTMLInputElement).value)}
          class="w-14 rounded-md border border-slate-300 bg-white px-1 py-1.5 text-center font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none" />
      )))}
    </div>
  );
}

export default function MatrixCalcTool() {
  const [n, setN] = useState(2);
  const [op, setOp] = useState<Op>('det');
  const [A, setA] = useState<Matrix>([[1, 2], [3, 4]]);
  const [B, setB] = useState<Matrix>([[5, 6], [7, 8]]);
  const binary = !UNARY.includes(op);

  const setCell = (which: 'A' | 'B') => (i: number, j: number, v: string) => {
    const num = parseFloat(v) || 0;
    (which === 'A' ? setA : setB)((M) => M.map((row, ri) => row.map((c, ci) => (ri === i && ci === j ? num : c))));
  };
  const resize = (nn: number) => { setN(nn); setA((M) => blank(nn, M)); setB((M) => blank(nn, M)); };

  const result = useMemo(() => {
    try {
      switch (op) {
        case 'det': return { scalar: matDet(A) };
        case 'inv': return { matrix: matInverse(A) };
        case 'trans': return { matrix: matTranspose(A) };
        case 'add': return { matrix: matAdd(A, B) };
        case 'sub': return { matrix: matSub(A, B) };
        case 'mul': return { matrix: matMul(A, B) };
      }
    } catch { return { error: true }; }
  }, [op, A, B, n]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex gap-1">
          <span class="pr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Size</span>
          {[2, 3].map((sz) => <button onClick={() => resize(sz)} class={`rounded-lg px-3 py-1 text-sm font-semibold ring-1 ${n === sz ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-slate-600 ring-slate-200'}`}>{sz}×{sz}</button>)}
        </div>
        <select value={op} onChange={(e) => setOp((e.target as HTMLSelectElement).value as Op)} class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
          {OPS.map((o) => <option value={o.id}>{o.label}</option>)}
        </select>
      </div>

      <div class="mt-4 flex flex-wrap items-start gap-6">
        <div><p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Matrix A</p><Grid M={A} n={n} onSet={setCell('A')} /></div>
        {binary && <div><p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Matrix B</p><Grid M={B} n={n} onSet={setCell('B')} /></div>}
      </div>

      <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
        <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Result</p>
        {result?.scalar != null ? (
          <p class="font-mono text-3xl font-extrabold text-brand-800">{fmt(result.scalar)}</p>
        ) : result?.matrix ? (
          <div class="inline-grid gap-1" style={`grid-template-columns: repeat(${result.matrix[0].length}, minmax(0, 1fr))`}>
            {result.matrix.flatMap((row, i) => row.map((v, j) => <span key={`${i}-${j}`} class="w-16 rounded-md bg-brand-50 px-1 py-1.5 text-center font-mono text-sm font-semibold text-brand-800 ring-1 ring-brand-100">{fmt(v)}</span>))}
          </div>
        ) : (
          <p class="text-sm text-rose-700">{op === 'inv' ? 'This matrix is singular (determinant 0) — it has no inverse.' : 'Undefined for these matrices.'}</p>
        )}
      </div>

      <p class="mt-4 text-xs text-slate-500">Determinant by cofactor expansion; inverse by Gauss–Jordan elimination (a singular matrix, determinant 0, has none). Multiplication is row-by-column. All exact arithmetic runs in your browser. 🔒</p>
    </div>
  );
}
