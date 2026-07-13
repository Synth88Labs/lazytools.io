import assert from 'node:assert';
import { quarterMileET, quarterMileMph, fuelUsed, tripFuelCost } from '../src/lib/automotive.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Quarter mile: 300 hp, 3000 lb → ET = 5.825 * (10)^(1/3), MPH = 234 * (0.1)^(1/3)
near(quarterMileET(300, 3000)!, 5.825 * Math.cbrt(10));
near(quarterMileMph(300, 3000)!, 234 * Math.cbrt(0.1));
// sanity: ~12.5 s, ~108.6 mph for that ratio
assert.ok(Math.abs(quarterMileET(300, 3000)! - 12.55) < 0.1);
assert.ok(Math.abs(quarterMileMph(300, 3000)! - 108.6) < 0.5);
// more power → quicker ET, higher trap
assert.ok(quarterMileET(400, 3000)! < quarterMileET(300, 3000)!);
assert.ok(quarterMileMph(400, 3000)! > quarterMileMph(300, 3000)!);
// guards
assert.strictEqual(quarterMileET(0, 3000), null);
assert.strictEqual(quarterMileMph(300, 0), null);

// Fuel used
near(fuelUsed(300, 30, 'mpg')!, 10);           // 300 mi ÷ 30 mpg = 10 gal
near(fuelUsed(500, 20, 'kmL')!, 25);           // 500 km ÷ 20 km/L = 25 L
near(fuelUsed(500, 8, 'l100km')!, 40);         // 500 km × 8 L/100km ÷ 100 = 40 L
assert.strictEqual(fuelUsed(300, 0, 'mpg'), null);

// Trip cost
near(tripFuelCost(300, 30, 'mpg', 3.5)!, 35);      // 10 gal × 3.5
near(tripFuelCost(500, 8, 'l100km', 1.8)!, 72);    // 40 L × 1.8
assert.strictEqual(tripFuelCost(300, 30, 'mpg', -1), null);

console.log('automotive-r2: all assertions passed');
