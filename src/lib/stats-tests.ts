/**
 * Hypothesis tests for the /statistics/ category: Student's t-test (one-sample,
 * two-sample independent — pooled or Welch — and paired), the chi-square test
 * (goodness-of-fit and independence), and a Poisson probability summary. Built
 * on the exact distribution functions in stats.ts (tCdf, chiSqCdf, poisson*).
 */
import { tCdf, chiSqCdf, poissonPmf, poissonCdf } from './stats.ts';

export type Tail = 'two' | 'left' | 'right';

/** p-value from a t statistic and df, for the chosen tail. */
export function tPValue(t: number, df: number, tail: Tail): number {
  const upper = 1 - tCdf(t, df); // P(T > t)
  if (tail === 'two') return 2 * (1 - tCdf(Math.abs(t), df));
  if (tail === 'right') return upper;
  return tCdf(t, df); // left: P(T < t)
}

export interface TTestResult { t: number; df: number; p: number; }

/** One-sample t-test: is the sample mean different from μ₀? */
export function tTestOneSample(mean: number, sd: number, n: number, mu0: number, tail: Tail = 'two'): TTestResult | null {
  if (n < 2 || sd < 0) return null;
  const se = sd / Math.sqrt(n);
  if (se === 0) return null;
  const t = (mean - mu0) / se;
  const df = n - 1;
  return { t, df, p: tPValue(t, df, tail) };
}

/** Paired t-test = one-sample t-test on the differences against 0. */
export function tTestPaired(meanDiff: number, sdDiff: number, n: number, tail: Tail = 'two'): TTestResult | null {
  return tTestOneSample(meanDiff, sdDiff, n, 0, tail);
}

/**
 * Two-sample independent t-test. `pooled` = Student's (equal-variance) test;
 * otherwise Welch's (unequal-variance, the safer default).
 */
export function tTestTwoSample(m1: number, sd1: number, n1: number, m2: number, sd2: number, n2: number, opts: { pooled?: boolean; tail?: Tail } = {}): TTestResult | null {
  if (n1 < 2 || n2 < 2 || sd1 < 0 || sd2 < 0) return null;
  const v1 = sd1 * sd1, v2 = sd2 * sd2;
  const tail = opts.tail ?? 'two';
  if (opts.pooled) {
    const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
    const se = Math.sqrt(sp2 * (1 / n1 + 1 / n2));
    if (se === 0) return null;
    const t = (m1 - m2) / se;
    const df = n1 + n2 - 2;
    return { t, df, p: tPValue(t, df, tail) };
  }
  // Welch
  const se = Math.sqrt(v1 / n1 + v2 / n2);
  if (se === 0) return null;
  const t = (m1 - m2) / se;
  const num = Math.pow(v1 / n1 + v2 / n2, 2);
  const den = Math.pow(v1 / n1, 2) / (n1 - 1) + Math.pow(v2 / n2, 2) / (n2 - 1);
  const df = num / den;
  return { t, df, p: tPValue(t, df, tail) };
}

export interface ChiSqResult { chiSq: number; df: number; p: number; expected?: number[][]; }

/** Chi-square goodness-of-fit. Expected may be counts or will be derived from equal/weighted probabilities. */
export function chiSqGoodnessOfFit(observed: number[], expected: number[]): ChiSqResult | null {
  if (observed.length < 2 || observed.length !== expected.length) return null;
  let chi = 0;
  for (let i = 0; i < observed.length; i++) {
    if (expected[i] <= 0) return null;
    chi += Math.pow(observed[i] - expected[i], 2) / expected[i];
  }
  const df = observed.length - 1;
  return { chiSq: chi, df, p: 1 - chiSqCdf(chi, df) };
}

/** Chi-square test of independence on an r×c contingency table. */
export function chiSqIndependence(table: number[][]): ChiSqResult | null {
  const r = table.length;
  if (r < 2) return null;
  const c = table[0].length;
  if (c < 2 || table.some((row) => row.length !== c)) return null;
  const rowTotals = table.map((row) => row.reduce((a, b) => a + b, 0));
  const colTotals = Array.from({ length: c }, (_, j) => table.reduce((a, row) => a + row[j], 0));
  const grand = rowTotals.reduce((a, b) => a + b, 0);
  if (grand <= 0) return null;
  let chi = 0;
  const expected: number[][] = [];
  for (let i = 0; i < r; i++) {
    expected[i] = [];
    for (let j = 0; j < c; j++) {
      const e = (rowTotals[i] * colTotals[j]) / grand;
      expected[i][j] = e;
      if (e > 0) chi += Math.pow(table[i][j] - e, 2) / e;
    }
  }
  const df = (r - 1) * (c - 1);
  return { chiSq: chi, df, p: 1 - chiSqCdf(chi, df), expected };
}

export interface PoissonSummary {
  pEqual: number; pLess: number; pLessEqual: number; pGreater: number; pGreaterEqual: number;
  mean: number; variance: number; sd: number;
}

/** Poisson probabilities for a count k given rate λ, plus the distribution's moments. */
export function poissonSummary(lambda: number, k: number): PoissonSummary | null {
  if (lambda <= 0 || k < 0 || !Number.isInteger(k)) return null;
  const pEqual = poissonPmf(k, lambda);
  const pLessEqual = poissonCdf(k, lambda);
  const pLess = k === 0 ? 0 : poissonCdf(k - 1, lambda);
  return {
    pEqual,
    pLess,
    pLessEqual,
    pGreater: 1 - pLessEqual,
    pGreaterEqual: 1 - pLess,
    mean: lambda,
    variance: lambda,
    sd: Math.sqrt(lambda),
  };
}
