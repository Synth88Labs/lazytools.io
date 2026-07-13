import assert from 'node:assert';
import {
  arithmeticSequence, geometricSequence,
  vecMagnitude, vecAdd, vecSub, vecDot, vecCross, vecAngle, vecScale,
} from '../src/lib/math-extra.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Arithmetic: 2, 5, 8, ... (a1=2, d=3), n=5 → nth=14, sum=40
let s = arithmeticSequence(2, 3, 5)!;
near(s.nth, 14);
near(s.sum, 40);
assert.deepStrictEqual(s.terms, [2, 5, 8, 11, 14]);
// negative d
near(arithmeticSequence(10, -2, 6)!.nth, 0);
// guards
assert.strictEqual(arithmeticSequence(1, 1, 0), null);
assert.strictEqual(arithmeticSequence(1, 1, 2.5), null);

// Geometric: 3, 6, 12, ... (a1=3, r=2), n=4 → nth=24, sum=45
s = geometricSequence(3, 2, 4)!;
near(s.nth, 24);
near(s.sum, 45);
assert.deepStrictEqual(s.terms, [3, 6, 12, 24]);
// r = 1 → sum = a1*n
near(geometricSequence(5, 1, 4)!.sum, 20);
// r = 0.5 convergent partial sum: 1 + 0.5 + 0.25 + 0.125 = 1.875
near(geometricSequence(1, 0.5, 4)!.sum, 1.875);

// Vectors
near(vecMagnitude([3, 4]), 5);
near(vecMagnitude([2, 3, 6]), 7);
assert.deepStrictEqual(vecAdd([1, 2, 3], [4, 5, 6]), [5, 7, 9]);
assert.deepStrictEqual(vecSub([4, 5, 6], [1, 2, 3]), [3, 3, 3]);
assert.deepStrictEqual(vecScale([1, -2, 3], 2), [2, -4, 6]);
near(vecDot([1, 2, 3], [4, 5, 6])!, 32);
// cross: x × y = z
assert.deepStrictEqual(vecCross([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
assert.strictEqual(vecCross([1, 2], [3, 4]), null); // 2D → null
// angle: perpendicular → 90°, parallel → 0° (acos near ±1 has float noise, use a loose tol)
near(vecAngle([1, 0], [0, 1])!, 90);
assert.ok(vecAngle([1, 1], [2, 2])! < 1e-3, 'parallel vectors ~0°');
near(vecAngle([1, 0, 0], [1, 1, 0])!, 45, 1e-6);
// dimension mismatch
assert.strictEqual(vecAdd([1, 2], [1, 2, 3]), null);
assert.strictEqual(vecDot([1, 2], [1, 2, 3]), null);

console.log('math-seq-vec: all assertions passed');
