import assert from 'node:assert';
import { describe, percentile, modes, parseNumbers, zScore } from '../src/lib/stats-descriptive.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// parse
assert.deepStrictEqual(parseNumbers('1, 2 3\n4;5'), [1, 2, 3, 4, 5]);
assert.deepStrictEqual(parseNumbers('x 7 -2.5'), [7, -2.5]);

// describe: 2,4,4,4,5,5,7,9 (classic example) — pop SD = 2, sample SD = sqrt(32/7)
const d = describe([2, 4, 4, 4, 5, 5, 7, 9])!;
near(d.mean, 5);
near(d.median, 4.5);
assert.deepStrictEqual(d.mode, [4]);
near(d.min, 2); near(d.max, 9); near(d.range, 7);
near(d.variancePop, 4);
near(d.stdDevPop, 2);
near(d.varianceSample, 32 / 7);
near(d.sum, 40); assert.strictEqual(d.count, 8);

// quartiles (Excel INC) for 1..10 → Q1=3.25, median=5.5, Q3=7.75
const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
near(percentile(sorted, 0.25), 3.25);
near(percentile(sorted, 0.5), 5.5);
near(percentile(sorted, 0.75), 7.75);

// median of even vs odd
near(describe([1, 2, 3])!.median, 2);
near(describe([1, 2, 3, 4])!.median, 2.5);

// modes: multi-modal, and no-mode
assert.deepStrictEqual(modes([1, 1, 2, 2, 3]), [1, 2]);
assert.deepStrictEqual(modes([1, 2, 3]), []); // all unique → no mode

// single value
const one = describe([42])!;
near(one.mean, 42); near(one.median, 42); near(one.stdDevSample, 0);

// empty
assert.strictEqual(describe([]), null);

// z-score
near(zScore(85, 70, 10)!, 1.5);
assert.strictEqual(zScore(1, 0, 0), null);

console.log('stats-descriptive: all assertions passed');
