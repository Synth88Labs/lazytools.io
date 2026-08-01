import { oneWayAnova, mannWhitneyU } from '../src/lib/stats-tests.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

// ---- One-way ANOVA ----
// Classic textbook example: 3 groups
// A: 1,2,3  B: 2,3,4  C: 4,5,6 ; grand mean = 3.333...
const an = oneWayAnova([[1, 2, 3], [2, 3, 4], [4, 5, 6]])!;
// group means: 2, 3, 5 ; grand mean 10/3=3.3333
// SSB = 3*(2-3.333)^2 + 3*(3-3.333)^2 + 3*(5-3.333)^2 = 3*1.7778 + 3*0.1111 + 3*2.7778 = 5.333+0.333+8.333 = 14
// SSW = each group var*... A:(1-2)^2+(2-2)^2+(3-2)^2=2 ; B same=2 ; C:(4-5)^2+0+(6-5)^2=2 → SSW=6
ok('anova df between=2', an.dfBetween === 2);
ok('anova df within=6', an.dfWithin === 6);
ok('anova SSB=14', near(an.ssBetween, 14, 0.01));
ok('anova SSW=6', near(an.ssWithin, 6, 0.01));
ok('anova MSB=7', near(an.msBetween, 7, 0.01));
ok('anova MSW=1', near(an.msWithin, 1, 0.01));
ok('anova F=7', near(an.f, 7, 0.01));
ok('anova p≈0.0272', near(an.p, 0.0272, 0.003)); // F(2,6)=7 → p≈0.0272
ok('anova group means', JSON.stringify(an.groupMeans) === JSON.stringify([2, 3, 5]));
ok('anova rejects <2 groups', oneWayAnova([[1, 2, 3]]) === null);
ok('anova rejects zero within-var', oneWayAnova([[5, 5], [5, 5]]) === null);

// identical groups → F≈0, p≈1
const an2 = oneWayAnova([[1, 2, 3], [1, 2, 3], [1, 2, 3]])!;
ok('anova identical groups F=0', near(an2.f, 0, 1e-9) && near(an2.p, 1, 1e-6));

// ---- Mann-Whitney U ----
// A: 1,2,3,4  B: 5,6,7,8 (complete separation) → U1 = 0 or 16
const mw = mannWhitneyU([1, 2, 3, 4], [5, 6, 7, 8], 'two')!;
ok('mw n1/n2', mw.n1 === 4 && mw.n2 === 4);
ok('mw U=0 (separated)', mw.u === 0);
ok('mw meanU=8', near(mw.meanU, 8, 1e-9));
// U1 for A: rankSum1 = 1+2+3+4=10 ; U1 = 10 - 4*5/2 = 10-10 = 0
ok('mw u1=0', near(mw.u1, 0, 1e-9));
ok('mw significant (p<0.05)', mw.p < 0.05);

// Identical distributions → U near mean, p near 1
const mw2 = mannWhitneyU([1, 2, 3, 4], [1, 2, 3, 4], 'two')!;
ok('mw identical → p high', mw2.p > 0.9);

// Known small example with ties handled: A:[1,3,5], B:[2,4,6]
// combined sorted: 1(A)2(B)3(A)4(B)5(A)6(B) ranks 1..6, rankSum1=1+3+5=9, U1=9-3*4/2=9-6=3, U2=9-3=6, U=3, meanU=4.5
const mw3 = mannWhitneyU([1, 3, 5], [2, 4, 6], 'two')!;
ok('mw3 rankSum1=9', near(mw3.rankSum1, 9, 1e-9));
ok('mw3 U=3', mw3.u === 3);
ok('mw3 meanU=4.5', near(mw3.meanU, 4.5, 1e-9));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
