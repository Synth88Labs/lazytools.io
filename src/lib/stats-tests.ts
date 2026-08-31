/**
 * Hypothesis tests for the /statistics/ category: Student's t-test (one-sample,
 * two-sample independent, pooled or Welch, and paired), the chi-square test
 * (goodness-of-fit and independence), and a Poisson probability summary. Built
 * on the exact distribution functions in stats.ts (tCdf, chiSqCdf, poisson*).
 */
import { tCdf, chiSqCdf, poissonPmf, poissonCdf, normalCdf, fCdf } from './stats.ts';

export type Tail = 'two' | 'left' | 'right';

/** p-value from a z statistic (standard normal), for the chosen tail. */
export function zPValue(z: number, tail: Tail): number {
  if (tail === 'two') return 2 * (1 - normalCdf(Math.abs(z)));
  if (tail === 'right') return 1 - normalCdf(z);
  return normalCdf(z); // left
}

export interface ZTestResult { z: number; p: number; se: number; }

/** One-sample z-test (population σ known): is the sample mean different from μ₀? */
export function zTestOneSample(mean: number, sigma: number, n: number, mu0: number, tail: Tail = 'two'): ZTestResult | null {
  if (n < 1 || sigma <= 0) return null;
  const se = sigma / Math.sqrt(n);
  const z = (mean - mu0) / se;
  return { z, p: zPValue(z, tail), se };
}

/** Two-sample z-test with known population σ's. */
export function zTestTwoSample(m1: number, sigma1: number, n1: number, m2: number, sigma2: number, n2: number, tail: Tail = 'two'): ZTestResult | null {
  if (n1 < 1 || n2 < 1 || sigma1 <= 0 || sigma2 <= 0) return null;
  const se = Math.sqrt((sigma1 * sigma1) / n1 + (sigma2 * sigma2) / n2);
  if (se === 0) return null;
  const z = (m1 - m2) / se;
  return { z, p: zPValue(z, tail), se };
}

export interface CohensDResult { d: number; pooledSd: number; magnitude: string; }

/** Cohen's d effect size for two independent groups (pooled SD). */
export function cohensD(m1: number, sd1: number, n1: number, m2: number, sd2: number, n2: number): CohensDResult | null {
  if (n1 < 2 || n2 < 2 || sd1 < 0 || sd2 < 0) return null;
  const sp = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2));
  if (sp === 0) return null;
  const d = (m1 - m2) / sp;
  const a = Math.abs(d);
  // Cohen's conventional benchmarks.
  const magnitude = a < 0.2 ? 'negligible' : a < 0.5 ? 'small' : a < 0.8 ? 'medium' : 'large';
  return { d, pooledSd: sp, magnitude };
}

export interface TwoPropResult { z: number; p: number; p1: number; p2: number; pooled: number; diff: number; }

/** Two-proportion z-test (e.g. A/B conversion test): x successes of n in each group. */
export function twoProportionZTest(x1: number, n1: number, x2: number, n2: number, tail: Tail = 'two'): TwoPropResult | null {
  if (n1 < 1 || n2 < 1 || x1 < 0 || x2 < 0 || x1 > n1 || x2 > n2) return null;
  const p1 = x1 / n1, p2 = x2 / n2;
  const pooled = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / n1 + 1 / n2));
  if (se === 0) return null;
  const z = (p1 - p2) / se;
  return { z, p: zPValue(z, tail), p1, p2, pooled, diff: p1 - p2 };
}

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

/* ---------------- One-way ANOVA ---------------- */

export interface AnovaResult {
  f: number; dfBetween: number; dfWithin: number; p: number;
  ssBetween: number; ssWithin: number; msBetween: number; msWithin: number;
  grandMean: number; groupMeans: number[]; nTotal: number; k: number;
}
/** One-way ANOVA across k groups (k ≥ 2, each with ≥ 1 value, total > k). */
export function oneWayAnova(groups: number[][]): AnovaResult | null {
  const clean = groups.filter((g) => g.length > 0);
  const k = clean.length;
  if (k < 2) return null;
  const nTotal = clean.reduce((a, g) => a + g.length, 0);
  if (nTotal <= k) return null; // need residual df ≥ 1
  const groupMeans = clean.map((g) => g.reduce((a, b) => a + b, 0) / g.length);
  const grandMean = clean.flat().reduce((a, b) => a + b, 0) / nTotal;
  let ssBetween = 0, ssWithin = 0;
  clean.forEach((g, i) => {
    ssBetween += g.length * Math.pow(groupMeans[i] - grandMean, 2);
    for (const x of g) ssWithin += Math.pow(x - groupMeans[i], 2);
  });
  const dfBetween = k - 1;
  const dfWithin = nTotal - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;
  if (msWithin === 0) return null; // no within-group variance → F undefined
  const f = msBetween / msWithin;
  return { f, dfBetween, dfWithin, p: 1 - fCdf(f, dfBetween, dfWithin), ssBetween, ssWithin, msBetween, msWithin, grandMean, groupMeans, nTotal, k };
}

/* ---------------- Mann-Whitney U (Wilcoxon rank-sum) ---------------- */

export interface MannWhitneyResult {
  u: number; u1: number; u2: number; z: number; p: number;
  n1: number; n2: number; rankSum1: number; meanU: number; sdU: number;
}
/**
 * Mann-Whitney U test (a.k.a. Wilcoxon rank-sum), the non-parametric two-sample
 * test. Uses average ranks for ties and the normal approximation (with a tie
 * correction) for the p-value, appropriate for moderate-to-large samples.
 */
export function mannWhitneyU(a: number[], b: number[], tail: Tail = 'two'): MannWhitneyResult | null {
  const n1 = a.length, n2 = b.length;
  if (n1 < 1 || n2 < 1) return null;
  const all = [...a.map((v) => ({ v, g: 1 })), ...b.map((v) => ({ v, g: 2 }))].sort((x, y) => x.v - y.v);
  // Average ranks, handling ties.
  const ranks = new Array(all.length);
  let i = 0;
  const tieGroups: number[] = [];
  while (i < all.length) {
    let j = i;
    while (j + 1 < all.length && all[j + 1].v === all[i].v) j++;
    const avg = (i + j) / 2 + 1; // 1-based average rank
    for (let t = i; t <= j; t++) ranks[t] = avg;
    if (j > i) tieGroups.push(j - i + 1);
    i = j + 1;
  }
  let rankSum1 = 0;
  all.forEach((x, idx) => { if (x.g === 1) rankSum1 += ranks[idx]; });
  const u1 = rankSum1 - (n1 * (n1 + 1)) / 2;
  const u2 = n1 * n2 - u1;
  const u = Math.min(u1, u2);
  const meanU = (n1 * n2) / 2;
  const N = n1 + n2;
  // Variance with tie correction.
  const tieTerm = tieGroups.reduce((acc, c) => acc + (c * c * c - c), 0);
  const varU = (n1 * n2 / 12) * ((N + 1) - tieTerm / (N * (N - 1)));
  const sdU = Math.sqrt(varU);
  if (sdU === 0) return null;
  // z with continuity correction toward the mean.
  const diff = u1 - meanU;
  const cc = diff === 0 ? 0 : Math.sign(diff) * 0.5;
  const z = (diff - cc) / sdU;
  return { u, u1, u2, z, p: zPValue(z, tail), n1, n2, rankSum1, meanU, sdU };
}

/** Average ranks (1-based) of `values`, plus the tie-group sizes. */
function averageRanks(values: number[]): { ranks: number[]; tieGroups: number[] } {
  const idx = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array(values.length);
  const tieGroups: number[] = [];
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1].v === idx[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let t = i; t <= j; t++) ranks[idx[t].i] = avg;
    if (j > i) tieGroups.push(j - i + 1);
    i = j + 1;
  }
  return { ranks, tieGroups };
}

/* ---------------- Kruskal-Wallis H test ---------------- */

export interface KruskalResult { h: number; df: number; p: number; nTotal: number; k: number; rankSums: number[]; }
/** Kruskal-Wallis H test: non-parametric one-way ANOVA across k groups (ranks). */
export function kruskalWallis(groups: number[][]): KruskalResult | null {
  const clean = groups.filter((g) => g.length > 0);
  const k = clean.length;
  if (k < 2) return null;
  const flat: number[] = [];
  const owner: number[] = [];
  clean.forEach((g, gi) => g.forEach((v) => { flat.push(v); owner.push(gi); }));
  const N = flat.length;
  if (N <= k) return null;
  const { ranks, tieGroups } = averageRanks(flat);
  const rankSums = new Array(k).fill(0);
  ranks.forEach((r, i) => { rankSums[owner[i]] += r; });
  let h = (12 / (N * (N + 1))) * clean.reduce((acc, g, gi) => acc + (rankSums[gi] * rankSums[gi]) / g.length, 0) - 3 * (N + 1);
  // Tie correction.
  const tieTerm = tieGroups.reduce((acc, c) => acc + (c * c * c - c), 0);
  const cFactor = 1 - tieTerm / (N * N * N - N);
  if (cFactor > 0) h = h / cFactor;
  const df = k - 1;
  return { h, df, p: 1 - chiSqCdf(h, df), nTotal: N, k, rankSums };
}

/* ---------------- Wilcoxon signed-rank test (paired) ---------------- */

export interface WilcoxonResult { w: number; wPlus: number; wMinus: number; z: number; p: number; n: number; meanW: number; sdW: number; }
/**
 * Wilcoxon signed-rank test for paired data. Ranks the absolute non-zero
 * differences (average ranks for ties), sums the positive- and negative-signed
 * ranks, and uses the normal approximation with a tie correction.
 */
export function wilcoxonSignedRank(a: number[], b: number[], tail: Tail = 'two'): WilcoxonResult | null {
  if (a.length !== b.length || a.length < 1) return null;
  const diffs = a.map((v, i) => v - b[i]).filter((d) => d !== 0);
  const n = diffs.length;
  if (n < 1) return null;
  const { ranks, tieGroups } = averageRanks(diffs.map(Math.abs));
  let wPlus = 0, wMinus = 0;
  diffs.forEach((d, i) => { if (d > 0) wPlus += ranks[i]; else wMinus += ranks[i]; });
  const w = Math.min(wPlus, wMinus);
  const meanW = (n * (n + 1)) / 4;
  const tieTerm = tieGroups.reduce((acc, c) => acc + (c * c * c - c), 0);
  const varW = (n * (n + 1) * (2 * n + 1)) / 24 - tieTerm / 48;
  const sdW = Math.sqrt(varW);
  if (sdW === 0) return null;
  const diff = wPlus - meanW;
  const cc = diff === 0 ? 0 : Math.sign(diff) * 0.5;
  const z = (diff - cc) / sdW;
  return { w, wPlus, wMinus, z, p: zPValue(z, tail), n, meanW, sdW };
}
