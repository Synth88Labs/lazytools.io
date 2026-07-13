import assert from 'node:assert';
import { solarTilt, arrayWiring } from '../src/lib/solar.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Tilt at 40° latitude: yearRound = 40*0.76+3.1 = 33.5, summer = 25, winter = 55
let t = solarTilt(40);
near(t.yearRound, 33.5);
near(t.summer, 25);
near(t.winter, 55);
// Low latitude (<25): 20 → 20*0.87 = 17.4
near(solarTilt(20).yearRound, 17.4);
// Southern hemisphere uses |lat|
near(solarTilt(-40).yearRound, 33.5);
// Summer never negative, winter capped at 90
near(solarTilt(10).summer, 0);   // 10-15 → clamp 0
near(solarTilt(80).winter, 90);  // 80+15=95 → clamp 90

// Array wiring: 3 series × 2 parallel of 300W panels (Voc 40, Isc 9)
let a = arrayWiring(3, 2, 40, 9, 300)!;
assert.strictEqual(a.panels, 6);
near(a.voc, 120);   // 40 × 3
near(a.isc, 18);    // 9 × 2
near(a.power, 1800); // 300 × 6
// single panel
a = arrayWiring(1, 1, 37, 8.5, 250)!;
near(a.voc, 37); near(a.isc, 8.5); near(a.power, 250);
// guards
assert.strictEqual(arrayWiring(0, 2, 40, 9, 300), null);
assert.strictEqual(arrayWiring(3, 2, 0, 9, 300), null);

console.log('solar-r2: all assertions passed');
