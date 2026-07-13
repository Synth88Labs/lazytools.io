/**
 * Additional math: triangle solving (law of sines/cosines), matrix operations
 * (determinant, inverse, multiply…) and logarithms. Pure mathematical
 * identities — no sourced data. Node-tested in scripts/test-math-extra.ts.
 */

/* ───────────────────────── Triangle solver ───────────────────────── */

export interface TriangleInput { a?: number | null; b?: number | null; c?: number | null; A?: number | null; B?: number | null; C?: number | null; }
export interface TriangleSolution { a: number; b: number; c: number; A: number; B: number; C: number; area: number; perimeter: number; }

const R = Math.PI / 180, DEG = 180 / Math.PI;

/** Solve a triangle from any valid set of ≥3 values (sides a/b/c, angles A/B/C in degrees). */
export function solveTriangle(inp: TriangleInput): { solutions: TriangleSolution[]; error?: string } {
  const s: (number | null)[] = [inp.a, inp.b, inp.c].map((v) => (v != null && v > 0 ? v : null));
  const ang: (number | null)[] = [inp.A, inp.B, inp.C].map((v) => (v != null && v > 0 ? v * R : null));
  const nS = s.filter((x) => x != null).length;
  const nA = ang.filter((x) => x != null).length;
  if (nS + nA < 3) return { solutions: [], error: 'Enter at least 3 values, including at least one side.' };
  if (nS === 0) return { solutions: [], error: 'Three angles fix the shape but not the size — enter at least one side.' };
  const angSum = ang.filter((x): x is number => x != null).reduce((p, q) => p + q, 0);
  if (nA >= 2 && angSum >= Math.PI - 1e-12) return { solutions: [], error: 'The given angles must sum to less than 180°.' };

  const build = (S: number[], AN: number[]): TriangleSolution => ({
    a: S[0], b: S[1], c: S[2], A: AN[0] * DEG, B: AN[1] * DEG, C: AN[2] * DEG,
    area: 0.5 * S[0] * S[1] * Math.sin(AN[2]), perimeter: S[0] + S[1] + S[2],
  });

  // SSS
  if (nS === 3) {
    const [a, b, c] = s as number[];
    if (a + b <= c || a + c <= b || b + c <= a) return { solutions: [], error: 'Those side lengths cannot form a triangle (triangle inequality).' };
    const A = Math.acos((b * b + c * c - a * a) / (2 * b * c));
    const B = Math.acos((a * a + c * c - b * b) / (2 * a * c));
    return { solutions: [build([a, b, c], [A, B, Math.PI - A - B])] };
  }

  // ASA / AAS — two or more angles + a side
  if (nA >= 2) {
    const angs = ang.slice() as (number | null)[];
    const known = [0, 1, 2].filter((i) => angs[i] != null);
    if (known.length === 2) angs[[0, 1, 2].find((i) => angs[i] == null)!] = Math.PI - (angs[known[0]]! + angs[known[1]]!);
    if (angs.some((x) => x == null || x <= 0)) return { solutions: [], error: 'The given angles must sum to 180°.' };
    const si = s.findIndex((x) => x != null);
    const k = (s[si] as number) / Math.sin(angs[si] as number);
    const S = [0, 1, 2].map((i) => (s[i] != null ? (s[i] as number) : k * Math.sin(angs[i] as number)));
    return { solutions: [build(S, angs as number[])] };
  }

  // nA === 1, nS === 2 → SAS (included) or SSA (ambiguous)
  const ai = ang.findIndex((x) => x != null);
  const knownSides = [0, 1, 2].filter((i) => s[i] != null);
  if (!knownSides.includes(ai)) {
    // known angle opposite the unknown side → included angle → SAS
    const [i, j] = knownSides;
    const cSide = Math.sqrt((s[i] as number) ** 2 + (s[j] as number) ** 2 - 2 * (s[i] as number) * (s[j] as number) * Math.cos(ang[ai] as number));
    const S = s.slice(); S[ai] = cSide;
    return solveTriangle({ a: S[0], b: S[1], c: S[2] });
  }
  // SSA: known angle ai opposite known side s[ai]; other known side = other
  const other = knownSides.find((i) => i !== ai)!;
  const X = ang[ai] as number, x = s[ai] as number, y = s[other] as number;
  const sinY = (y * Math.sin(X)) / x;
  if (sinY > 1 + 1e-9) return { solutions: [], error: 'No triangle fits those values (the side is too short to reach — SSA).' };
  const Y1 = Math.asin(Math.min(1, sinY));
  const zi = [0, 1, 2].find((i) => i !== ai && i !== other)!;
  const cand = Math.abs(Math.PI - 2 * Y1) < 1e-9 ? [Y1] : [Y1, Math.PI - Y1];
  const sols: TriangleSolution[] = [];
  for (const Y of cand) {
    if (Y <= 0 || X + Y >= Math.PI - 1e-9) continue;
    const angs: number[] = []; angs[ai] = X; angs[other] = Y; angs[zi] = Math.PI - X - Y;
    const k = x / Math.sin(X);
    const S = [0, 1, 2].map((i) => (i === ai || i === other ? (s[i] as number) : k * Math.sin(angs[i])));
    sols.push(build(S, angs));
  }
  return sols.length ? { solutions: sols } : { solutions: [], error: 'No triangle fits those values.' };
}

/* ───────────────────────── Matrix operations ───────────────────────── */

export type Matrix = number[][];
const dims = (M: Matrix) => ({ r: M.length, c: M[0]?.length ?? 0 });

export function matAdd(A: Matrix, B: Matrix): Matrix | null {
  if (A.length !== B.length || A[0].length !== B[0].length) return null;
  return A.map((row, i) => row.map((v, j) => v + B[i][j]));
}
export function matSub(A: Matrix, B: Matrix): Matrix | null {
  if (A.length !== B.length || A[0].length !== B[0].length) return null;
  return A.map((row, i) => row.map((v, j) => v - B[i][j]));
}
export function matScale(A: Matrix, k: number): Matrix { return A.map((row) => row.map((v) => v * k)); }
export function matTranspose(A: Matrix): Matrix { return A[0].map((_, j) => A.map((row) => row[j])); }
export function matMul(A: Matrix, B: Matrix): Matrix | null {
  if (dims(A).c !== dims(B).r) return null;
  const { r } = dims(A), { c } = dims(B), n = dims(A).c;
  return Array.from({ length: r }, (_, i) => Array.from({ length: c }, (_, j) => {
    let sum = 0; for (let k = 0; k < n; k++) sum += A[i][k] * B[k][j]; return sum;
  }));
}
/** Determinant of a square matrix (recursive cofactor expansion). */
export function matDet(A: Matrix): number | null {
  const n = A.length;
  if (n === 0 || A.some((row) => row.length !== n)) return null;
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = A.slice(1).map((row) => row.filter((_, k) => k !== j));
    det += (j % 2 === 0 ? 1 : -1) * A[0][j] * (matDet(minor) as number);
  }
  return det;
}
/** Inverse of a square matrix via Gauss–Jordan; null if singular or non-square. */
export function matInverse(A: Matrix): Matrix | null {
  const n = A.length;
  if (n === 0 || A.some((row) => row.length !== n)) return null;
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-12) return null; // singular
    [M[col], M[piv]] = [M[piv], M[col]];
    const d = M[col][col];
    for (let j = 0; j < 2 * n; j++) M[col][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[col][j];
    }
  }
  return M.map((row) => row.slice(n));
}

/* ───────────────────────── Logarithm ───────────────────────── */

/** log base `base` of `x`, via change of base. */
export function logBase(x: number, base: number): number { return Math.log(x) / Math.log(base); }

/* ---------------- Sequences & series ---------------- */

export interface SeqResult {
  nth: number;
  sum: number;
  terms: number[];
}
/**
 * Arithmetic sequence: aₙ = a₁ + (n−1)d, with sum Sₙ = n/2·(2a₁ + (n−1)d).
 * Returns the nth term, the sum of the first n terms, and up to the first
 * `maxTerms` terms for display. n must be a positive integer.
 */
export function arithmeticSequence(a1: number, d: number, n: number, maxTerms = 20): SeqResult | null {
  if (!Number.isFinite(a1) || !Number.isFinite(d) || !Number.isInteger(n) || n < 1) return null;
  const nth = a1 + (n - 1) * d;
  const sum = (n / 2) * (2 * a1 + (n - 1) * d);
  const count = Math.min(n, maxTerms);
  const terms = Array.from({ length: count }, (_, i) => a1 + i * d);
  return { nth, sum, terms };
}
/**
 * Geometric sequence: aₙ = a₁·r^(n−1), with sum Sₙ = a₁(1−rⁿ)/(1−r) (or a₁·n
 * when r = 1). Returns nth term, sum of first n terms, and the first terms.
 */
export function geometricSequence(a1: number, r: number, n: number, maxTerms = 20): SeqResult | null {
  if (!Number.isFinite(a1) || !Number.isFinite(r) || !Number.isInteger(n) || n < 1) return null;
  const nth = a1 * Math.pow(r, n - 1);
  const sum = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r);
  const count = Math.min(n, maxTerms);
  const terms = Array.from({ length: count }, (_, i) => a1 * Math.pow(r, i));
  return { nth, sum, terms };
}

/* ---------------- Vectors (2D / 3D) ---------------- */

export type Vec = number[];
const same = (a: Vec, b: Vec) => a.length === b.length;
export const vecMagnitude = (v: Vec) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));
export function vecAdd(a: Vec, b: Vec): Vec | null { return same(a, b) ? a.map((x, i) => x + b[i]) : null; }
export function vecSub(a: Vec, b: Vec): Vec | null { return same(a, b) ? a.map((x, i) => x - b[i]) : null; }
export const vecScale = (v: Vec, k: number): Vec => v.map((x) => x * k);
export function vecDot(a: Vec, b: Vec): number | null { return same(a, b) ? a.reduce((s, x, i) => s + x * b[i], 0) : null; }
/** 3D cross product a × b. Returns null unless both are 3-component vectors. */
export function vecCross(a: Vec, b: Vec): Vec | null {
  if (a.length !== 3 || b.length !== 3) return null;
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
/** Angle between two vectors in degrees, via cosθ = (a·b)/(|a||b|). */
export function vecAngle(a: Vec, b: Vec): number | null {
  const dot = vecDot(a, b);
  if (dot == null) return null;
  const m = vecMagnitude(a) * vecMagnitude(b);
  if (m === 0) return null;
  const cos = Math.max(-1, Math.min(1, dot / m));
  return (Math.acos(cos) * 180) / Math.PI;
}
