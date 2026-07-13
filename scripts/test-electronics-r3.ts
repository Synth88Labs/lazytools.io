import assert from 'node:assert';
import {
  capReactance, indReactance,
  dbFromPowerRatio, dbFromAmplitudeRatio, powerRatioFromDb, amplitudeRatioFromDb,
} from '../src/lib/electronics.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-4) => assert.ok(Math.abs(a - b) / Math.abs(b) < tol, `${a} !~ ${b}`);

// Reactance: Xc = 1/(2πfC). 1µF at 1kHz ≈ 159.15 Ω
rel(capReactance(1000, 1e-6), 1 / (2 * Math.PI * 1000 * 1e-6), 1e-9);
assert.ok(Math.abs(capReactance(1000, 1e-6) - 159.155) < 0.01);
// Xl = 2πfL. 10mH at 1kHz ≈ 62.83 Ω
rel(indReactance(1000, 10e-3), 2 * Math.PI * 1000 * 10e-3, 1e-9);
assert.ok(Math.abs(indReactance(1000, 10e-3) - 62.832) < 0.01);
// higher frequency: Xc falls, Xl rises
assert.ok(capReactance(2000, 1e-6) < capReactance(1000, 1e-6));
assert.ok(indReactance(2000, 10e-3) > indReactance(1000, 10e-3));

// Decibels — power: 2× power ≈ +3.01 dB, 10× ≈ 10 dB
near(dbFromPowerRatio(10)!, 10);
assert.ok(Math.abs(dbFromPowerRatio(2)! - 3.0103) < 1e-3);
// amplitude: 2× voltage ≈ +6.02 dB, 10× = 20 dB
near(dbFromAmplitudeRatio(10)!, 20);
assert.ok(Math.abs(dbFromAmplitudeRatio(2)! - 6.0206) < 1e-3);
// inverse round-trips
rel(powerRatioFromDb(dbFromPowerRatio(7)!), 7, 1e-9);
rel(amplitudeRatioFromDb(dbFromAmplitudeRatio(3)!), 3, 1e-9);
// 0 dB = ratio 1; -3 dB power ≈ half
near(powerRatioFromDb(0), 1);
assert.ok(Math.abs(powerRatioFromDb(-3.0103) - 0.5) < 1e-3);
// guards
assert.strictEqual(dbFromPowerRatio(0), null);
assert.strictEqual(dbFromAmplitudeRatio(-2), null);

console.log('electronics-r3: all assertions passed');
