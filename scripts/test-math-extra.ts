/**
 * Node test for src/lib/math-extra.ts — run:
 *   node --experimental-strip-types scripts/test-math-extra.ts
 */
import { solveTriangle, matAdd, matMul, matDet, matInverse, matTranspose, matScale, logBase } from '../src/lib/math-extra.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${JSON.stringify(got)})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// ── Triangle: SSS 3-4-5 right triangle ──
{
  const { solutions: [t] } = solveTriangle({ a: 3, b: 4, c: 5 });
  ok('SSS C = 90°', near(t.C, 90, 1e-6), t.C);
  ok('SSS A ≈ 36.87°', near(t.A, 36.8699, 1e-3), t.A);
  ok('SSS B ≈ 53.13°', near(t.B, 53.1301, 1e-3), t.B);
  ok('SSS area = 6', near(t.area, 6, 1e-6), t.area);
  ok('SSS perimeter = 12', near(t.perimeter, 12), t.perimeter);
}
// invalid SSS
ok('SSS triangle inequality → error', !!solveTriangle({ a: 1, b: 1, c: 5 }).error);

// ── SAS: a=3, b=4, included C=90 → c=5 ──
{
  const { solutions: [t] } = solveTriangle({ a: 3, b: 4, C: 90 });
  ok('SAS c = 5', near(t.c, 5, 1e-6), t.c);
  ok('SAS area = 6', near(t.area, 6, 1e-6), t.area);
}

// ── ASA/AAS: A=30, B=60, side a=1 → C=90, b=√3, c=2 ──
{
  const { solutions: [t] } = solveTriangle({ A: 30, B: 60, a: 1 });
  ok('AAS C = 90', near(t.C, 90, 1e-6), t.C);
  ok('AAS b = √3', near(t.b, Math.sqrt(3), 1e-6), t.b);
  ok('AAS c = 2', near(t.c, 2, 1e-6), t.c);
}

// ── ASA: side between two angles. A=36.87, B=53.13, c=5 → a=3,b=4 ──
{
  const { solutions: [t] } = solveTriangle({ A: 36.8699, B: 53.1301, c: 5 });
  ok('ASA a ≈ 3', near(t.a, 3, 1e-3), t.a);
  ok('ASA b ≈ 4', near(t.b, 4, 1e-3), t.b);
}

// ── SSA ambiguous: a=7, b=10, A=30° → two solutions ──
{
  const res = solveTriangle({ a: 7, b: 10, A: 30 });
  ok('SSA ambiguous → 2 solutions', res.solutions.length === 2, res.solutions.length);
  // both should have a=7, A=30
  ok('SSA both keep a=7', res.solutions.every((t) => near(t.a, 7, 1e-6)));
  ok('SSA both keep A=30', res.solutions.every((t) => near(t.A, 30, 1e-6)));
}
// SSA no solution: a too short
ok('SSA no solution → error', !!solveTriangle({ a: 1, b: 10, A: 30 }).error);

// too few
ok('two values → error', !!solveTriangle({ a: 3, b: 4 }).error);
ok('three angles → error', !!solveTriangle({ A: 60, B: 60, C: 60 }).error);

// ── Matrices ──
ok('matAdd', JSON.stringify(matAdd([[1, 2], [3, 4]], [[5, 6], [7, 8]])) === JSON.stringify([[6, 8], [10, 12]]));
ok('matMul 2x2', JSON.stringify(matMul([[1, 2], [3, 4]], [[5, 6], [7, 8]])) === JSON.stringify([[19, 22], [43, 50]]), matMul([[1, 2], [3, 4]], [[5, 6], [7, 8]]));
ok('matMul dim mismatch → null', matMul([[1, 2, 3]], [[1, 2]]) === null);
ok('matTranspose', JSON.stringify(matTranspose([[1, 2, 3], [4, 5, 6]])) === JSON.stringify([[1, 4], [2, 5], [3, 6]]));
ok('matScale', JSON.stringify(matScale([[1, 2], [3, 4]], 2)) === JSON.stringify([[2, 4], [6, 8]]));
ok('matDet 2x2', matDet([[1, 2], [3, 4]]) === -2);
ok('matDet 3x3', matDet([[6, 1, 1], [4, -2, 5], [2, 8, 7]]) === -306, matDet([[6, 1, 1], [4, -2, 5], [2, 8, 7]]));
ok('matDet identity 3x3 = 1', matDet([[1, 0, 0], [0, 1, 0], [0, 0, 1]]) === 1);
// inverse: A·A⁻¹ = I
{
  const A = [[4, 7], [2, 6]];
  const inv = matInverse(A)!;
  ok('matInverse 2x2 correct', near(inv[0][0], 0.6) && near(inv[0][1], -0.7) && near(inv[1][0], -0.2) && near(inv[1][1], 0.4), inv);
  const prod = matMul(A, inv)!;
  ok('A·A⁻¹ = I', near(prod[0][0], 1) && near(prod[1][1], 1) && near(prod[0][1], 0, 1e-9) && near(prod[1][0], 0, 1e-9), prod);
}
ok('singular matrix inverse → null', matInverse([[1, 2], [2, 4]]) === null);
// 3x3 inverse round-trip
{
  const A = [[1, 2, 3], [0, 1, 4], [5, 6, 0]];
  const inv = matInverse(A)!;
  const prod = matMul(A, inv)!;
  ok('3x3 A·A⁻¹ ≈ I', [0, 1, 2].every((i) => [0, 1, 2].every((j) => near(prod[i][j], i === j ? 1 : 0, 1e-9))), prod);
}

// ── Logarithm ──
ok('log2(8) = 3', near(logBase(8, 2), 3));
ok('log10(1000) = 3', near(logBase(1000, 10), 3));
ok('ln(e) = 1', near(logBase(Math.E, Math.E), 1));
ok('log5(125) = 3', near(logBase(125, 5), 3));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
