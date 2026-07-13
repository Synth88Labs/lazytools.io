import assert from 'node:assert';
import { rampLength, firewoodCords } from '../src/lib/home.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-4) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// Ramp: 30 in rise at 1:12 → run 360 in, length √(30²+360²), ADA compliant
let r = rampLength(30, 12)!;
near(r.run, 360);
near(r.length, Math.sqrt(30 * 30 + 360 * 360));
assert.strictEqual(r.adaCompliant, true);
// 1:12 slope angle ≈ 4.76°
assert.ok(Math.abs(r.angleDeg - 4.764) < 0.01);
// steeper than 1:12 (e.g. 1:8) → not ADA compliant, bigger angle
r = rampLength(30, 8)!;
assert.strictEqual(r.adaCompliant, false);
assert.ok(rampLength(30, 8)!.angleDeg > rampLength(30, 12)!.angleDeg);
// guards
assert.strictEqual(rampLength(0, 12), null);
assert.strictEqual(rampLength(30, 0), null);

// Firewood: full cord 4×4×8 = 128 ft³ → 1 cord
let f = firewoodCords(8, 4, 4)!;
near(f.cubicFeet, 128);
near(f.cords, 1);
// double the stack → 2 cords
near(firewoodCords(16, 4, 4)!.cords, 2);
// face cord (16-inch logs): 8×4×1.3333 = 42.67 ft³ → 1 face cord
rel(firewoodCords(8, 4, 16 / 12)!.faceCords16, 1, 1e-6);
// guards
assert.strictEqual(firewoodCords(0, 4, 4), null);

console.log('home-r3: all assertions passed');
