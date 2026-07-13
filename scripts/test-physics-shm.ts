import assert from 'node:assert';
import { pendulumPeriod, pendulumLength, springPeriod, G_EARTH } from '../src/lib/physics-extra.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-4) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// Pendulum: 1 m at g = 9.80665 → T ≈ 2.006 s
rel(pendulumPeriod(1)!.period, 2 * Math.PI * Math.sqrt(1 / G_EARTH), 1e-9);
assert.ok(Math.abs(pendulumPeriod(1)!.period - 2.006) < 0.002);
// frequency is reciprocal of period
near(pendulumPeriod(1)!.frequency, 1 / pendulumPeriod(1)!.period);
// longer pendulum → longer period
assert.ok(pendulumPeriod(4)!.period > pendulumPeriod(1)!.period);
// 4× length → 2× period
rel(pendulumPeriod(4)!.period, 2 * pendulumPeriod(1)!.period, 1e-9);
// inverse round-trip: length → period → length
near(pendulumLength(pendulumPeriod(2.5)!.period)!, 2.5);
// guards
assert.strictEqual(pendulumPeriod(0), null);
assert.strictEqual(pendulumLength(-1), null);

// Spring: m = 0.5 kg, k = 200 N/m → T = 2π√(0.0025) = 2π·0.05 ≈ 0.3142 s
rel(springPeriod(0.5, 200)!.period, 2 * Math.PI * Math.sqrt(0.5 / 200), 1e-9);
assert.ok(Math.abs(springPeriod(0.5, 200)!.period - 0.3142) < 0.001);
// stiffer spring → shorter period
assert.ok(springPeriod(0.5, 400)!.period < springPeriod(0.5, 200)!.period);
// heavier mass → longer period
assert.ok(springPeriod(1, 200)!.period > springPeriod(0.5, 200)!.period);
assert.strictEqual(springPeriod(0.5, 0), null);

console.log('physics-shm: all assertions passed');
