import { plantsInArea, seedsInRow, bedVolume, fertilizerLbs, waterNeeded, dli, ppfdForDli, blendedCN, getMaterial, getCrop } from '../src/lib/garden.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Spacing: 100 sqft, 1 ft spacing -> square 100, triangular ~115
const ps = plantsInArea(100, 1);
ok('100 sqft @1ft square = 100', ps!.square === 100);
ok('triangular > square', ps!.triangular > ps!.square);
ok('triangular ~115', approx(ps!.triangular, 115, 1));

// Seed row: 10 ft row, 0.5 ft spacing -> 21 per row
const sr = seedsInRow(10, 0.5);
ok('10ft row @0.5 = 21 seeds', sr!.perRow === 21);
const sr2 = seedsInRow(10, 0.5, 4, 1);
ok('with 4ft bed @1ft rows = 5 rows', sr2!.rows === 5);
ok('total = 21*5 = 105', sr2!.total === 105);

// Bed volume: 2m x 1m x 0.3m = 0.6 m3 = 600 L
const bv = bedVolume(2, 1, 0.3, true);
ok('bed 2x1x0.3m = 0.6 m3', approx(bv.m3, 0.6, 0.001));
ok('= 600 litres', approx(bv.litres, 600, 0.5));
// imperial: 8x4x0.5 ft = 16 ft3
const bvi = bedVolume(8, 4, 0.5, false);
ok('bed 8x4x0.5ft = 16 ft3', approx(bvi.ft3, 16, 0.01));

// Fertilizer: 1 lb N/1000, 5000 sqft, 20% N -> 5 lb N, 25 lb product
const f = fertilizerLbs(1, 5000, 20);
ok('fert 5 lb N', approx(f!.lbsN, 5, 0.01));
ok('fert 25 lb product', approx(f!.lbsProduct, 25, 0.01));

// Water: 100 sqft, 1 inch -> 62.3 gal
const w = waterNeeded(100, 1, false);
ok('100sqft 1inch = 62.3 gal', approx(w.usGal, 62.3, 0.1));
// metric: 10 m2, 25 mm -> 250 L
const wm = waterNeeded(10, 25, true);
ok('10m2 25mm = 250 L', approx(wm.litres, 250, 0.1));

// DLI: PPFD 300, 16h -> 300*16*3600/1e6 = 17.28
ok('DLI 300ppfd 16h = 17.28', approx(dli(300, 16), 17.28, 0.01));
ok('DLI round trip', approx(ppfdForDli(dli(300, 16), 16)!, 300, 0.5));

// Compost blend: equal parts cn=20 and cn=60 -> 40
ok('blend 20 & 60 equal = 40', approx(blendedCN([{ cn: 20, parts: 1 }, { cn: 60, parts: 1 }])!, 40, 0.01));
ok('material lookup', getMaterial('straw')!.cn === 75);

// Crop lookup
ok('tomato starts indoors -7', getCrop('tomato')!.startIndoors === -7);
ok('beans direct sow +1', getCrop('beans')!.directSow === 1);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
