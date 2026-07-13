import assert from 'node:assert';
import { businessDays, timeBetween } from '../src/lib/time-compute.ts';

// Mon 2026-07-13 → Fri 2026-07-17: 5 days, all weekdays, 5 business days
let b = businessDays('2026-07-13', '2026-07-17')!;
assert.strictEqual(b.totalDays, 5);
assert.strictEqual(b.weekdays, 5);
assert.strictEqual(b.weekendDays, 0);
assert.strictEqual(b.businessDays, 5);

// Mon 2026-07-13 → Sun 2026-07-19: 7 days, 5 weekdays, 2 weekend
b = businessDays('2026-07-13', '2026-07-19')!;
assert.strictEqual(b.totalDays, 7);
assert.strictEqual(b.weekdays, 5);
assert.strictEqual(b.weekendDays, 2);

// with 1 holiday
assert.strictEqual(businessDays('2026-07-13', '2026-07-17', 1)!.businessDays, 4);
// order-independent
assert.strictEqual(businessDays('2026-07-17', '2026-07-13')!.businessDays, 5);
// same day (a Monday) → 1 business day
assert.strictEqual(businessDays('2026-07-13', '2026-07-13')!.businessDays, 1);
// same day on a weekend (Sat 2026-07-18) → 0 business days
assert.strictEqual(businessDays('2026-07-18', '2026-07-18')!.businessDays, 0);
// invalid
assert.strictEqual(businessDays('nope', '2026-07-17'), null);

// Time between
let t = timeBetween('09:00', '17:30')!;
assert.strictEqual(t.totalMinutes, 510);
assert.strictEqual(t.hours, 8);
assert.strictEqual(t.minutes, 30);
assert.strictEqual(t.decimalHours, 8.5);
// crossing midnight
t = timeBetween('22:00', '06:00')!;
assert.strictEqual(t.totalMinutes, 480); // 8h
assert.strictEqual(t.hours, 8);
// overnight flag on equal times → 24h
assert.strictEqual(timeBetween('08:00', '08:00', true)!.totalMinutes, 1440);
// equal times without overnight → 0
assert.strictEqual(timeBetween('08:00', '08:00')!.totalMinutes, 0);
// invalid
assert.strictEqual(timeBetween('25:00', '10:00'), null);
assert.strictEqual(timeBetween('9', '10:00'), null);

console.log('time-r2: all assertions passed');
