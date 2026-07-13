import assert from 'node:assert';
import { solveSDT, addMinutesToClock, timeZoneDelta } from '../src/lib/travel.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Speed–distance–time
near(solveSDT(null, 60, 2)!.distance, 120);        // 60 km/h × 2 h
near(solveSDT(300, null, 5)!.speed, 60);           // 300 km ÷ 5 h
near(solveSDT(300, 60, null)!.hours, 5);           // 300 km ÷ 60 km/h
// guards: wrong count, unsolvable
assert.strictEqual(solveSDT(300, null, null), null);   // only 1
assert.strictEqual(solveSDT(300, 60, 5), null);        // 3
assert.strictEqual(solveSDT(300, null, 0), null);      // divide by zero
assert.strictEqual(solveSDT(300, 0, null), null);      // zero speed

// Timezone converter building blocks
// New York (UTC−5) 14:30 → London (UTC+0): +5 h → 19:30, same day
let r = addMinutesToClock('14:30', (0 - -5) * 60)!;
assert.strictEqual(r.time, '19:30');
assert.strictEqual(r.dayOffset, 0);
// LA (−8) 20:00 → Tokyo (+9): +17 h → 13:00 next day
r = addMinutesToClock('20:00', (9 - -8) * 60)!;
assert.strictEqual(r.time, '13:00');
assert.strictEqual(r.dayOffset, 1);
// Tokyo (+9) 06:00 → LA (−8): −17 h → 13:00 previous day
r = addMinutesToClock('06:00', (-8 - 9) * 60)!;
assert.strictEqual(r.time, '13:00');
assert.strictEqual(r.dayOffset, -1);

// timeZoneDelta
assert.deepStrictEqual(timeZoneDelta(-5, 1), { zones: 6, direction: 'east' });
assert.deepStrictEqual(timeZoneDelta(9, -8), { zones: 17, direction: 'west' });
assert.strictEqual(timeZoneDelta(2, 2).direction, 'same');

console.log('travel-r2: all assertions passed');
