import { rotationToLandOn, winnerIndexAt } from '../src/lib/wheel.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// The core guarantee: the rotation that targets index t lands exactly on t.
for (const count of [1, 2, 3, 4, 6, 8, 12, 50]) {
  let allMatch = true;
  for (let t = 0; t < count; t++) {
    for (const turns of [0, 1, 5, 9]) {
      if (winnerIndexAt(rotationToLandOn(t, count, turns), count) !== t) allMatch = false;
    }
  }
  ok(`round-trip lands on target (count ${count})`, allMatch);
}

// winnerIndexAt basics (count 4, 90° segments; segment 0 spans the top).
ok('rot 0 -> index 0', winnerIndexAt(0, 4) === 0);
ok('full turns -> index 0', winnerIndexAt(3600, 4) === 0);
ok('index in range', winnerIndexAt(12345.6, 7) >= 0 && winnerIndexAt(12345.6, 7) < 7);
ok('negative rotation handled', winnerIndexAt(-90, 4) === winnerIndexAt(270, 4));

// rotationToLandOn always includes the requested full turns (long spin animation).
ok('turns add 360 each', rotationToLandOn(0, 8, 5) >= 5 * 360);
ok('distinct targets give distinct final angles', rotationToLandOn(1, 8, 5) !== rotationToLandOn(2, 8, 5));

// invalid counts
let threw = false; try { winnerIndexAt(10, 0); } catch { threw = true; }
ok('rejects count 0', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
