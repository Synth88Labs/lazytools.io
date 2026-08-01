import { dayOfYear, weekdayInfo, addBusinessDays, isLeapYear, daysInYear } from '../src/lib/time-compute.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- leap year ----
ok('2024 leap', isLeapYear(2024) === true);
ok('2023 not leap', isLeapYear(2023) === false);
ok('2000 leap (÷400)', isLeapYear(2000) === true);
ok('1900 not leap (÷100)', isLeapYear(1900) === false);
ok('daysInYear leap', daysInYear(2024) === 366 && daysInYear(2023) === 365);

// ---- day of year ----
const jan1 = dayOfYear(new Date(2023, 0, 1));
ok('Jan 1 = day 1', jan1.dayOfYear === 1);
ok('Jan 1 days remaining 364', jan1.daysRemaining === 364);
const dec31 = dayOfYear(new Date(2023, 11, 31));
ok('Dec 31 (non-leap) = 365', dec31.dayOfYear === 365 && dec31.daysRemaining === 0);
const dec31Leap = dayOfYear(new Date(2024, 11, 31));
ok('Dec 31 (leap) = 366', dec31Leap.dayOfYear === 366);
const mar1Leap = dayOfYear(new Date(2024, 2, 1));
ok('Mar 1 leap = day 61', mar1Leap.dayOfYear === 61); // 31 Jan + 29 Feb + 1
const mar1 = dayOfYear(new Date(2023, 2, 1));
ok('Mar 1 non-leap = day 60', mar1.dayOfYear === 60); // 31 + 28 + 1
ok('percent elapsed ~ half by Jul 2', Math.abs(dayOfYear(new Date(2023, 6, 2)).percentElapsed - 50) < 1);

// ---- weekday ----
const w1 = weekdayInfo(new Date(2023, 0, 1)); // 2023-01-01 is a Sunday
ok('2023-01-01 is Sunday', w1.weekday === 'Sunday' && w1.isoDow === 7 && w1.isWeekend === true);
const w2 = weekdayInfo(new Date(2024, 1, 29)); // 2024-02-29 is a Thursday
ok('2024-02-29 is Thursday', w2.weekday === 'Thursday' && w2.isoDow === 4 && w2.isWeekend === false);
const w3 = weekdayInfo(new Date(2023, 0, 10), new Date(2023, 0, 1));
ok('days from today signed', w3.daysFromToday === 9);

// ---- add business days ----
// Fri 2024-03-01 + 1 business day = Mon 2024-03-04 (skip Sat/Sun)
const b1 = addBusinessDays(new Date(2024, 2, 1), 1);
ok('Fri +1 biz = Mon', b1.getFullYear() === 2024 && b1.getMonth() === 2 && b1.getDate() === 4);
// Mon 2024-03-04 + 5 business days = Mon 2024-03-11
const b2 = addBusinessDays(new Date(2024, 2, 4), 5);
ok('Mon +5 biz = next Mon', b2.getDate() === 11);
// Mon 2024-03-04 - 1 business day = Fri 2024-03-01
const b3 = addBusinessDays(new Date(2024, 2, 4), -1);
ok('Mon -1 biz = prev Fri', b3.getDate() === 1);
ok('+0 biz = same day', addBusinessDays(new Date(2024, 2, 4), 0).getDate() === 4);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
