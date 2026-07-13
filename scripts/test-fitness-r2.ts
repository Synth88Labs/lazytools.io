import assert from 'node:assert';
import {
  navyBodyFat, bodyFatCategory, bmrMifflin, tdee, ACTIVITY_FACTORS,
} from '../src/lib/fitness.ts';

const rel = (a: number, b: number, tol = 1e-3) => assert.ok(Math.abs(a - b) / Math.abs(b) < tol, `${a} !~ ${b}`);
const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Navy body fat — male: 70in height, 15in neck, 34in waist ≈ 17.5%
rel(navyBodyFat('male', 70, 15, 34)!, 17.50, 3e-3);
// female: 65in height, 13in neck, 28in waist, 38in hip ≈ 25.9%
rel(navyBodyFat('female', 65, 13, 28, 38)!, 25.93, 3e-3);
// guards: waist ≤ neck (male), missing hip (female)
assert.strictEqual(navyBodyFat('male', 70, 34, 30), null);
assert.strictEqual(navyBodyFat('female', 65, 13, 28), null); // hip defaults 0
assert.strictEqual(navyBodyFat('male', 0, 15, 34), null);

// categories
assert.strictEqual(bodyFatCategory('male', 10), 'Athletes');
assert.strictEqual(bodyFatCategory('male', 30), 'Above average');
assert.strictEqual(bodyFatCategory('female', 20), 'Athletes');

// BMR Mifflin-St Jeor
near(bmrMifflin('male', 80, 180, 30)!, 1780);
near(bmrMifflin('female', 65, 165, 30)!, 1370.25);
assert.strictEqual(bmrMifflin('male', 0, 180, 30), null);

// TDEE
near(tdee(1780, 1.55), 2759);
// activity factors present and sane
assert.strictEqual(ACTIVITY_FACTORS.length, 5);
assert.strictEqual(ACTIVITY_FACTORS[0].factor, 1.2);
assert.strictEqual(ACTIVITY_FACTORS[4].factor, 1.9);

console.log('fitness-r2: all assertions passed');
