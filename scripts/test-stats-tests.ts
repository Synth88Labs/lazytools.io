/**
 * Node test for src/lib/stats-tests.ts — run:
 *   node --experimental-strip-types scripts/test-stats-tests.ts
 * Cross-checked against standard statistical references.
 */
import {
  tTestOneSample, tTestPaired, tTestTwoSample, chiSqGoodnessOfFit,
  chiSqIndependence, poissonSummary, tPValue,
} from '../src/lib/stats-tests.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-3) => Math.abs(a - b) <= tol;

// --- One-sample t: mean 105, sd 15, n 25, mu0 100 → t = 5/(15/5) = 1.667, df 24
const t1 = tTestOneSample(105, 15, 25, 100)!;
ok('one-sample t = 1.667', near(t1.t, 5 / 3, 1e-3), t1.t);
ok('one-sample df = 24', t1.df === 24);
ok('one-sample two-tailed p ≈ 0.108', near(t1.p, 0.108, 3e-3), t1.p.toFixed(4));
// right-tailed half of two-tailed
ok('right-tailed p ≈ 0.054', near(tTestOneSample(105, 15, 25, 100, 'right')!.p, 0.108 / 2, 3e-3));
ok('one-sample invalid n', tTestOneSample(105, 15, 1, 100) === null);

// --- Paired: mean diff 2.5, sd 4, n 20 → t = 2.5/(4/sqrt20) = 2.795, df 19
const tp = tTestPaired(2.5, 4, 20)!;
ok('paired t ≈ 2.795', near(tp.t, 2.5 / (4 / Math.sqrt(20)), 1e-3), tp.t);
ok('paired df 19', tp.df === 19);
ok('paired p < 0.05', tp.p < 0.05, tp.p.toFixed(4));

// --- Two-sample Welch: m1=10 sd1=2 n1=30, m2=12 sd2=3 n2=30
const tw = tTestTwoSample(10, 2, 30, 12, 3, 30)!;
// t = (10-12)/sqrt(4/30+9/30) = -2/sqrt(0.4333) = -2/0.6583 = -3.038
ok('Welch t ≈ -3.038', near(tw.t, -2 / Math.sqrt(4 / 30 + 9 / 30), 1e-3), tw.t.toFixed(3));
ok('Welch df between 50-58', tw.df > 50 && tw.df < 58, tw.df.toFixed(2));
ok('Welch p < 0.01', tw.p < 0.01, tw.p.toFixed(5));
// pooled version: df = 58
const tpo = tTestTwoSample(10, 2, 30, 12, 3, 30, { pooled: true })!;
ok('pooled df = 58', tpo.df === 58);

// --- Chi-square GOF: observed [8,9,10,11,12,10], expected all 10 → χ²=1.0, df 5
const g = chiSqGoodnessOfFit([8, 9, 10, 11, 12, 10], [10, 10, 10, 10, 10, 10])!;
ok('GOF chi-sq = 1.0', near(g.chiSq, (4 + 1 + 0 + 1 + 4 + 0) / 10, 1e-9), g.chiSq);
ok('GOF df = 5', g.df === 5);
ok('GOF p high (>0.9)', g.p > 0.9, g.p.toFixed(3));
// perfect fit → 0
ok('GOF perfect fit chi=0', chiSqGoodnessOfFit([10, 10], [10, 10])!.chiSq === 0);
ok('GOF invalid expected', chiSqGoodnessOfFit([10, 10], [10, 0]) === null);

// --- Chi-square independence: 2x2 table [[10,20],[30,40]]
// row totals 30,70; col totals 40,60; grand 100
// E11=12, E12=18, E21=28, E22=42 → chi = (4/12)+(4/18)+(4/28)+(4/42) = 0.333+0.222+0.143+0.095 = 0.794, df=1
const ind = chiSqIndependence([[10, 20], [30, 40]])!;
ok('independence chi ≈ 0.794', near(ind.chiSq, 0.7936, 1e-3), ind.chiSq.toFixed(4));
ok('independence df = 1', ind.df === 1);
ok('independence expected E11=12', near(ind.expected![0][0], 12, 1e-9));
ok('independence p reasonable', ind.p > 0.3 && ind.p < 0.5, ind.p.toFixed(3));
ok('independence invalid ragged', chiSqIndependence([[1, 2], [3]]) === null);

// --- Poisson: λ=3, k=2 → P(X=2) = e^-3 * 9/2 = 0.2240
const ps = poissonSummary(3, 2)!;
ok('poisson P(X=2) ≈ 0.2240', near(ps.pEqual, 0.2240, 1e-3), ps.pEqual.toFixed(4));
ok('poisson mean=variance=3', ps.mean === 3 && ps.variance === 3);
ok('poisson sd = sqrt3', near(ps.sd, Math.sqrt(3), 1e-9));
ok('poisson P(X>=2) > P(X=2)', ps.pGreaterEqual > ps.pEqual);
ok('poisson cdf consistency', near(ps.pLessEqual + ps.pGreater, 1, 1e-9));
ok('poisson invalid k', poissonSummary(3, -1) === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
