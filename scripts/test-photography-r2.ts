import assert from 'node:assert';
import { maxShutterSeconds, flashAperture, flashDistance, flashGnAtIso } from '../src/lib/photography.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// 500 rule, 24mm full-frame (crop 1) = 20.83 s
near(maxShutterSeconds(24, 1, 500), 500 / 24);
// 24mm on APS-C (1.5x) → effective 36mm → 500/36 = 13.9 s
near(maxShutterSeconds(24, 1.5, 500), 500 / 36);
// 300 rule stricter
near(maxShutterSeconds(24, 1, 300), 300 / 24);
// guards
assert.strictEqual(maxShutterSeconds(0, 1), 0);
assert.strictEqual(maxShutterSeconds(24, 0), 0);

// Flash: GN 56, distance 5 m → f/11.2
near(flashAperture(56, 5), 11.2);
// GN 56 at f/8 → 7 m reach
near(flashDistance(56, 8), 7);
// round-trip: aperture then distance
near(flashDistance(56, flashAperture(56, 5)), 5);
// GN scales with sqrt(ISO): ISO 400 doubles GN
near(flashGnAtIso(28, 400), 56);
near(flashGnAtIso(28, 100), 28);
// guards
assert.strictEqual(flashAperture(56, 0), 0);
assert.strictEqual(flashDistance(56, 0), 0);

console.log('photography-r2: all assertions passed');
