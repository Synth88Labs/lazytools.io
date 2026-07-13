import assert from 'node:assert';
import { aquariumStocking, heaterWatts } from '../src/lib/pets.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Stocking: 20 gal tank → net 17 gal → 17 inches capacity
let s = aquariumStocking(20, 0)!;
near(s.netGallons, 17);
near(s.maxInchesRule, 17);
assert.strictEqual(s.status, 'understocked');

// 10 inches in a 20 gal → 10/17 = 58.8% → ok
s = aquariumStocking(20, 10)!;
near(s.percent, (10 / 17) * 100);
assert.strictEqual(s.status, 'ok');

// Fully stocked band (91–100%)
s = aquariumStocking(20, 16)!; // 16/17 = 94% → fully stocked
assert.strictEqual(s.status, 'fully stocked');
// Overstocked
s = aquariumStocking(20, 25)!; // 25/17 = 147% → overstocked
assert.strictEqual(s.status, 'overstocked');
// Understocked boundary (<50%)
s = aquariumStocking(20, 8)!; // 8/17 = 47% → understocked
assert.strictEqual(s.status, 'understocked');
// guards
assert.strictEqual(aquariumStocking(0, 5), null);

// Heater wattage by temp-rise band
near(heaterWatts(20, 4)!, 50);   // ≤5°F → 2.5 W/gal
near(heaterWatts(20, 8)!, 70);   // ≤10°F → 3.5 W/gal
near(heaterWatts(20, 15)!, 100); // >10°F → 5 W/gal
// bigger rise → more watts for same tank
assert.ok(heaterWatts(20, 15)! > heaterWatts(20, 4)!);
assert.strictEqual(heaterWatts(0, 10), null);

console.log('pets-aquarium: all assertions passed');
