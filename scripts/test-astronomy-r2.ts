import assert from 'node:assert';
import {
  keplerPeriodYears, keplerAxisAU, schwarzschildRadiusM, schwarzschildRadiusFromSolar,
  M_SUN_KG,
} from '../src/lib/astronomy.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-3) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// Kepler: Earth at 1 AU → 1 year
near(keplerPeriodYears(1), 1);
// Mars at 1.524 AU → ~1.881 years (known value)
rel(keplerPeriodYears(1.524)!, 1.881, 2e-3);
// Jupiter at 5.203 AU → ~11.86 years
rel(keplerPeriodYears(5.203)!, 11.86, 3e-3);
// inverse round-trip
near(keplerAxisAU(keplerPeriodYears(2.5)!)!, 2.5);
// central mass scaling: double the mass shortens the period by √2
near(keplerPeriodYears(1, 4)!, 0.5); // √(1/4)=0.5
// guards
assert.strictEqual(keplerPeriodYears(0), null);
assert.strictEqual(keplerAxisAU(-1), null);

// Schwarzschild: 1 solar mass ≈ 2953 m
rel(schwarzschildRadiusFromSolar(1)!, 2953, 2e-3);
// Earth mass (5.972e24 kg) ≈ 8.87 mm
rel(schwarzschildRadiusM(5.972e24)!, 0.00887, 5e-3);
// linear in mass: 10 solar masses = 10× the radius
near(schwarzschildRadiusFromSolar(10)! / schwarzschildRadiusFromSolar(1)!, 10);
// consistency between the two entry points
near(schwarzschildRadiusFromSolar(3)!, schwarzschildRadiusM(3 * M_SUN_KG)!);
// guards
assert.strictEqual(schwarzschildRadiusM(0), null);

console.log('astronomy-r2: all assertions passed');
