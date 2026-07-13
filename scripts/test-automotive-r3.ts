import assert from 'node:assert';
import { fuelRange, tirePressureAtTemp, ATM_PSI } from '../src/lib/automotive.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-3) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// Fuel range
near(fuelRange(15, 30, 'mpg')!, 450);        // 15 gal × 30 mpg = 450 mi
near(fuelRange(50, 12, 'kmL')!, 600);        // 50 L × 12 km/L = 600 km
near(fuelRange(50, 8, 'l100km')!, 625);      // 50 L ÷ 8 × 100 = 625 km
// bigger tank / better economy → more range
assert.ok(fuelRange(20, 30, 'mpg')! > fuelRange(15, 30, 'mpg')!);
// guards
assert.strictEqual(fuelRange(0, 30, 'mpg'), null);
assert.strictEqual(fuelRange(15, 0, 'mpg'), null);

// Tire pressure vs temperature — same temp → unchanged
near(tirePressureAtTemp(32, 70, 70)!, 32);
// warming raises pressure, cooling lowers it
assert.ok(tirePressureAtTemp(32, 70, 100)! > 32);
assert.ok(tirePressureAtTemp(32, 70, 40)! < 32);
// ~1 psi per 10°F rule of thumb: 32 psi cooled 30°F drops ~2.6 psi (0.9 psi/10°F)
const drop = 32 - tirePressureAtTemp(32, 70, 40)!;
assert.ok(drop > 2.0 && drop < 3.2, `drop ${drop}`);
// exact Gay-Lussac check: 32 psi from 70°F to 100°F
const expected = (32 + ATM_PSI) * ((100 + 459.67) / (70 + 459.67)) - ATM_PSI;
near(tirePressureAtTemp(32, 70, 100)!, expected);
// guard
assert.strictEqual(tirePressureAtTemp(0, 70, 100), null);

console.log('automotive-r3: all assertions passed');
