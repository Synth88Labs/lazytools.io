import assert from 'node:assert';
import { carbonationPressurePsi, mcu, srmFromMcu, srmToEbc } from '../src/lib/brewing.ts';

const rel = (a: number, b: number, tol = 5e-3) => assert.ok(Math.abs(a - b) / Math.abs(b) < tol, `${a} !~ ${b}`);
const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Carbonation: 2.5 volumes at 38°F ≈ 11.2 PSI
rel(carbonationPressurePsi(38, 2.5)!, 11.22, 1e-2);
// Warmer beer needs more pressure for the same carbonation
assert.ok(carbonationPressurePsi(50, 2.5)! > carbonationPressurePsi(38, 2.5)!);
// Higher target volumes → more pressure
assert.ok(carbonationPressurePsi(38, 3.0)! > carbonationPressurePsi(38, 2.5)!);
// guard
assert.strictEqual(carbonationPressurePsi(38, 0), null);

// MCU: 10 °L malt, 9 lb, 5 gal → 18 MCU
near(mcu(10, 9, 5)!, 18);
assert.strictEqual(mcu(10, 9, 0), null);

// SRM via Morey: MCU 18 → 1.4922 × 18^0.6859 ≈ 10.6
rel(srmFromMcu(18), 1.4922 * Math.pow(18, 0.6859), 1e-9);
assert.ok(Math.abs(srmFromMcu(18) - 10.6) < 0.3);
// pale (low MCU) < amber < dark
assert.ok(srmFromMcu(3) < srmFromMcu(18) && srmFromMcu(18) < srmFromMcu(60));
// EBC conversion
near(srmToEbc(10), 19.7);

console.log('brewing-r2: all assertions passed');
