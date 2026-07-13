import assert from 'node:assert';
import { geometricMean, harmonicMean, oddsToProbability, probabilityToOdds } from '../src/lib/stats-descriptive.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Geometric mean of 1,2,4,8 = (1·2·4·8)^(1/4) = 64^(1/4) = 2.8284
near(geometricMean([1, 2, 4, 8])!, Math.pow(64, 1 / 4));
near(geometricMean([4, 9])!, 6);          // √36 = 6
near(geometricMean([2, 2, 2])!, 2);
// harmonic mean of 1,2,4 = 3 / (1 + 0.5 + 0.25) = 3/1.75 = 1.714
near(harmonicMean([1, 2, 4])!, 3 / 1.75);
near(harmonicMean([2, 6])!, 3);            // 2/(1/2+1/6)=2/(2/3)=3
// AM ≥ GM ≥ HM for positive data
const d = [2, 4, 8];
const am = d.reduce((s, x) => s + x, 0) / d.length;
assert.ok(am >= geometricMean(d)! && geometricMean(d)! >= harmonicMean(d)!);
// guards: non-positive
assert.strictEqual(geometricMean([1, -2, 3]), null);
assert.strictEqual(harmonicMean([1, 0, 3]), null);
assert.strictEqual(geometricMean([]), null);

// Odds → probability: 1:1 = 50%, 3:1 = 75%, 1:4 = 20%
let o = oddsToProbability(1, 1)!;
near(o.percent, 50); near(o.decimalOdds, 2); assert.strictEqual(o.forA, 1); assert.strictEqual(o.forB, 1);
o = oddsToProbability(3, 1)!;
near(o.percent, 75); near(o.decimalOdds, 4 / 3);
o = oddsToProbability(1, 4)!;
near(o.percent, 20); near(o.decimalOdds, 5);
// simplify: 6:4 → 3:2
o = oddsToProbability(6, 4)!;
assert.strictEqual(o.forA, 3); assert.strictEqual(o.forB, 2);
// guards
assert.strictEqual(oddsToProbability(0, 0), null);

// Probability → odds: 75% = 3:1, decimal 1.333
let po = probabilityToOdds(75)!;
assert.strictEqual(po.forA, 3); assert.strictEqual(po.forB, 1);
near(po.decimalOdds, 1 / 0.75);
po = probabilityToOdds(20)!;
assert.strictEqual(po.forA, 1); assert.strictEqual(po.forB, 4);
near(po.decimalOdds, 5);
// guards
assert.strictEqual(probabilityToOdds(0), null);
assert.strictEqual(probabilityToOdds(100), null);

console.log('stats-r3: all assertions passed');
