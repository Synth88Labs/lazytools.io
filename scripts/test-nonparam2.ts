import { kruskalWallis, wilcoxonSignedRank } from '../src/lib/stats-tests.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

// ---- Kruskal-Wallis ----
// Complete separation, 3 groups of 3: ranks 1-3, 4-6, 7-9
// R = 6, 15, 24 ; N=9 ; H = 12/(9*10)*(36/3+225/3+576/3) - 3*10
//   = 0.13333*(12+75+192) - 30 = 0.13333*279 - 30 = 37.2 - 30 = 7.2
const kw = kruskalWallis([[1, 2, 3], [4, 5, 6], [7, 8, 9]])!;
ok('kw df=2', kw.df === 2);
ok('kw N=9', kw.nTotal === 9);
ok('kw rank sums 6,15,24', JSON.stringify(kw.rankSums) === JSON.stringify([6, 15, 24]));
ok('kw H=7.2', near(kw.h, 7.2, 0.001));
ok('kw p≈0.0273', near(kw.p, 0.0273, 0.003)); // chiSq(2) at 7.2
ok('kw rejects <2 groups', kruskalWallis([[1, 2, 3]]) === null);
// identical groups → H≈0, p≈1
const kw2 = kruskalWallis([[5, 6, 7], [5, 6, 7], [5, 6, 7]])!;
ok('kw identical H≈0', near(kw2.h, 0, 0.01) && kw2.p > 0.9);

// ---- Wilcoxon signed-rank ----
// Pairs where every difference is positive: a all > b → W- = 0
// a=[10,12,14,16], b=[8,9,11,12] → diffs 2,3,3,4 ; |d| ranks: 2→1, 3→2.5, 3→2.5, 4→4
// all positive → W+ = 1+2.5+2.5+4 = 10 ; W- = 0 ; W = 0 ; n=4 ; meanW = 4*5/4 = 5
const wx = wilcoxonSignedRank([10, 12, 14, 16], [8, 9, 11, 12], 'two')!;
ok('wx n=4', wx.n === 4);
ok('wx W+ =10', near(wx.wPlus, 10, 1e-9));
ok('wx W- =0', near(wx.wMinus, 0, 1e-9));
ok('wx W=0', wx.w === 0);
ok('wx meanW=5', near(wx.meanW, 5, 1e-9));
// zero differences are dropped
const wx2 = wilcoxonSignedRank([5, 6, 7, 8], [5, 4, 9, 8], 'two')!;
// diffs: 0(drop), 2, -2, 0(drop) → n=2 ; |d| ranks 1.5,1.5 ; W+ = 1.5, W- = 1.5
ok('wx2 drops zeros → n=2', wx2.n === 2);
ok('wx2 W+ = W- = 1.5', near(wx2.wPlus, 1.5) && near(wx2.wMinus, 1.5));
ok('wx rejects mismatched lengths', wilcoxonSignedRank([1, 2], [1]) === null);
ok('wx rejects all-zero diffs', wilcoxonSignedRank([3, 3], [3, 3]) === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
