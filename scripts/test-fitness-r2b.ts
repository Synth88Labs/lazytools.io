import assert from 'node:assert';
import { swimPace, calorieDeficit, KCAL_PER_KG_FAT, KCAL_PER_LB_FAT } from '../src/lib/fitness.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Swim: 1500 m in 1800 s (30 min) → 120 s/100m, speed 0.8333 m/s
let s = swimPace(1500, 1800)!;
near(s.per100m, 120);
near(s.speedMs, 1500 / 1800);
near(s.per100yd, (1800 / 1500) * 91.44);
// faster time → lower per-100 pace
assert.ok(swimPace(1500, 1500)!.per100m < swimPace(1500, 1800)!.per100m);
// guards
assert.strictEqual(swimPace(0, 100), null);
assert.strictEqual(swimPace(100, 0), null);

// Calorie deficit: lose 5 kg in 70 days → total 38,500 kcal, daily 550, weekly 0.5 kg
let d = calorieDeficit(5, 70, 'kg')!;
near(d.totalDeficit, 5 * KCAL_PER_KG_FAT);
near(d.totalDeficit, 38500);
near(d.dailyDeficit, 550);
near(d.weeklyRate, 0.5);
// lb: lose 10 lb in 70 days → total 35,000, daily 500, weekly 1 lb
d = calorieDeficit(10, 70, 'lb')!;
near(d.totalDeficit, 10 * KCAL_PER_LB_FAT);
near(d.dailyDeficit, 500);
near(d.weeklyRate, 1);
// guards
assert.strictEqual(calorieDeficit(0, 70, 'kg'), null);
assert.strictEqual(calorieDeficit(5, 0, 'kg'), null);

console.log('fitness-r2b: all assertions passed');
