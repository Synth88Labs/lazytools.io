import { zTestOneSample, zTestTwoSample, cohensD, twoProportionZTest, zPValue } from '../src/lib/stats-tests.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

// ---- zPValue sanity (standard normal) ----
ok('z=1.96 two-tailed p≈0.05', near(zPValue(1.96, 'two'), 0.05, 0.001));
ok('z=1.645 right p≈0.05', near(zPValue(1.645, 'right'), 0.05, 0.001));
ok('z=0 two-tailed p=1', near(zPValue(0, 'two'), 1, 1e-6));

// ---- one-sample z-test ----
const z1 = zTestOneSample(105, 15, 25, 100, 'two')!;
ok('one-sample z=1.667', near(z1.z, 1.6667, 0.001));
ok('one-sample SE=3', near(z1.se, 3, 1e-9));
ok('one-sample p≈0.0956', near(z1.p, 0.0956, 0.002));
ok('z-test rejects sigma≤0', zTestOneSample(1, 0, 10, 0) === null);

// ---- two-sample z-test ----
const z2 = zTestTwoSample(100, 10, 50, 95, 12, 50, 'two')!;
ok('two-sample z≈2.263', near(z2.z, 2.263, 0.005));
ok('two-sample p≈0.0236', near(z2.p, 0.0236, 0.002));

// ---- Cohen's d ----
const d1 = cohensD(100, 15, 30, 90, 15, 30)!;
ok('cohen d=0.667', near(d1.d, 0.6667, 0.001));
ok('cohen pooled sd=15', near(d1.pooledSd, 15, 1e-9));
ok('cohen magnitude medium', d1.magnitude === 'medium');
const d2 = cohensD(100, 20, 40, 60, 20, 40)!;
ok('cohen d=2.0 large', near(d2.d, 2, 0.001) && d2.magnitude === 'large');
ok('cohen small', cohensD(50, 10, 30, 47, 10, 30)!.magnitude === 'small'); // d=0.3

// ---- two-proportion z-test (A/B) ----
const tp = twoProportionZTest(40, 200, 60, 200, 'two')!;
ok('two-prop p1=0.2 p2=0.3', near(tp.p1, 0.2) && near(tp.p2, 0.3));
ok('two-prop pooled=0.25', near(tp.pooled, 0.25, 1e-9));
ok('two-prop z≈-2.309', near(tp.z, -2.309, 0.005));
ok('two-prop p≈0.0209', near(tp.p, 0.0209, 0.002));
ok('two-prop rejects x>n', twoProportionZTest(300, 200, 10, 200) === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
