import assert from 'node:assert';
import {
  seriesResistance, parallelResistance, seriesCapacitance, parallelCapacitance,
  seriesInductance, parallelInductance, ohmsLaw,
} from '../src/lib/electronics.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Series resistance — simple sum
near(seriesResistance([100, 220, 330]), 650);
// Two equal resistors in parallel = half
near(parallelResistance([100, 100]), 50);
// Classic 6+3 parallel = 2
near(parallelResistance([6, 3]), 2);
// Three equal 300Ω in parallel = 100
near(parallelResistance([300, 300, 300]), 100);

// Capacitors: parallel adds, series reciprocal (opposite of resistors)
near(parallelCapacitance([1e-6, 2e-6, 3e-6]), 6e-6);
near(seriesCapacitance([2e-6, 2e-6]), 1e-6);       // two equal in series = half
near(seriesCapacitance([6e-6, 3e-6]), 2e-6);

// Inductors: series adds, parallel reciprocal (same as resistors)
near(seriesInductance([1e-3, 2e-3]), 3e-3);
near(parallelInductance([10e-3, 10e-3]), 5e-3);

// Ohm's law — every pair path
let r = ohmsLaw(12, 2, null, null)!;      // V,I
near(r.r, 6); near(r.p, 24);
r = ohmsLaw(12, null, 6, null)!;          // V,R
near(r.i, 2); near(r.p, 24);
r = ohmsLaw(12, null, null, 24)!;         // V,P
near(r.i, 2); near(r.r, 6);
r = ohmsLaw(null, 2, 6, null)!;           // I,R
near(r.v, 12); near(r.p, 24);
r = ohmsLaw(null, 2, null, 24)!;          // I,P
near(r.v, 12); near(r.r, 6);
r = ohmsLaw(null, null, 6, 24)!;          // R,P
near(r.v, 12); near(r.i, 2);

// Guards: wrong number of knowns, unsolvable
assert.strictEqual(ohmsLaw(12, null, null, null), null);       // only 1
assert.strictEqual(ohmsLaw(12, 2, 6, null), null);             // 3
assert.strictEqual(ohmsLaw(null, null, -5, 10), null);         // negative R

console.log('electronics-r2: all assertions passed');
