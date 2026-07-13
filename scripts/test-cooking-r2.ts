import assert from 'node:assert';
import { slowCookerConvert, riceWater, RICE_TYPES, getRiceType } from '../src/lib/cooking.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Slow cooker bands
assert.deepStrictEqual(slowCookerConvert(20), { lowHours: [4, 6], highHours: [1.5, 2.5] });
assert.deepStrictEqual(slowCookerConvert(30), { lowHours: [4, 6], highHours: [1.5, 2.5] });
assert.deepStrictEqual(slowCookerConvert(40), { lowHours: [6, 8], highHours: [3, 4] });
assert.deepStrictEqual(slowCookerConvert(90), { lowHours: [8, 10], highHours: [4, 6] });
assert.strictEqual(slowCookerConvert(0), null);
// Low always takes longer than High
const r = slowCookerConvert(40)!;
assert.ok(r.lowHours[0] > r.highHours[0]);

// Rice water
let rice = riceWater(2, 'white')!;
near(rice.water, 4);      // 2 cups × 2:1
near(rice.yield, 6);      // 2 × 3
assert.strictEqual(rice.minutes, 18);
rice = riceWater(1, 'brown')!;
near(rice.water, 2.5);
assert.strictEqual(rice.minutes, 45);
rice = riceWater(3, 'basmati')!;
near(rice.water, 4.5);    // 3 × 1.5
// guards
assert.strictEqual(riceWater(1, 'nope'), null);
assert.strictEqual(riceWater(0, 'white'), null);

// data integrity
assert.ok(RICE_TYPES.length >= 6);
for (const t of RICE_TYPES) {
  assert.ok(t.waterRatio > 0 && t.minutes > 0 && t.yieldRatio > 1, `bad rice ${t.id}`);
  assert.strictEqual(getRiceType(t.id), t);
}
// brown needs more water & time than white
assert.ok(getRiceType('brown')!.waterRatio > getRiceType('white')!.waterRatio);
assert.ok(getRiceType('brown')!.minutes > getRiceType('white')!.minutes);

console.log('cooking-r2: all assertions passed');
