/**
 * Node test for src/lib/travel.ts — run:
 *   node --experimental-strip-types scripts/test-travel.ts
 * Verifies the pure-math tools against hand-checked / reference values.
 */
import {
  haversineKm, initialBearing, compassPoint, flightTimeMinutes, hoursMinutes,
  roadTrip, addMinutesToClock, layoverMinutes, jetLagDays, timeZoneDelta,
  luggageLitres, linearCm, budgetPerDay, budgetPerPersonPerDay, tip,
  EARTH_RADIUS_KM, TIP_CUSTOMS,
} from '../src/lib/travel.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// --- Great-circle distance: JFK (40.6413,-73.7781) → LHR (51.4700,-0.4543)
// Reference great-circle ≈ 5540–5555 km.
const JFK = { lat: 40.6413, lon: -73.7781 };
const LHR = { lat: 51.4700, lon: -0.4543 };
const d = haversineKm(JFK, LHR);
ok('JFK→LHR distance ~5550 km', d > 5530 && d < 5560, d.toFixed(1));

// LAX → JFK ≈ 3970–3990 km
const LAX = { lat: 33.9416, lon: -118.4085 };
const dLA = haversineKm(LAX, JFK);
ok('LAX→JFK distance ~3980 km', dLA > 3960 && dLA < 4000, dLA.toFixed(1));

// Same point = 0
ok('same point = 0', near(haversineKm(JFK, JFK), 0));

// Equator quarter: (0,0)→(0,90) = quarter circumference = π/2 · R
ok('quarter equator', near(haversineKm({lat:0,lon:0}, {lat:0,lon:90}), (Math.PI/2)*EARTH_RADIUS_KM, 1e-6));

// Pole-to-pole meridian: (90,0)→(-90,0) = half circumference
ok('pole to pole', near(haversineKm({lat:90,lon:0}, {lat:-90,lon:0}), Math.PI*EARTH_RADIUS_KM, 1e-6));

// --- Bearing: due east along equator from (0,0) to (0,10) = 90°
ok('bearing due east', near(initialBearing({lat:0,lon:0}, {lat:0,lon:10}), 90, 1e-6));
// due north (0,0)→(10,0) = 0°
ok('bearing due north', near(initialBearing({lat:0,lon:0}, {lat:10,lon:0}), 0, 1e-6));
ok('compass 90 = E', compassPoint(90) === 'E');
ok('compass 0 = N', compassPoint(0) === 'N');
ok('compass 45 = NE', compassPoint(45) === 'NE');

// --- Flight time: 830 km/h, +30 min overhead. 830 km → 60+30 = 90 min
ok('flight time 830km = 90min', near(flightTimeMinutes(830), 90));
ok('flight time 0 = 0', flightTimeMinutes(0) === 0);
const hm = hoursMinutes(90);
ok('hoursMinutes 90 = 1h30', hm.h === 1 && hm.m === 30);
// JFK→LHR ~5550 km at 830 km/h + 30 min ≈ 7h11
const hm2 = hoursMinutes(flightTimeMinutes(5550));
ok('JFK→LHR ~7h11', hm2.h === 7 && hm2.m >= 0 && hm2.m <= 25, `${hm2.h}h${hm2.m}`);

// --- Road trip: 300 km @ 100 km/h + 20 min break = 180 + 20 = 200 min
const rt = roadTrip(300, 100, 20)!;
ok('road trip driving 180', near(rt.drivingMin, 180));
ok('road trip total 200', near(rt.totalMin, 200));
ok('road trip invalid', roadTrip(0, 100) === null);

// --- Clock math
const ac = addMinutesToClock('23:30', 90)!;
ok('23:30 + 90 = 01:00 +1d', ac.time === '01:00' && ac.dayOffset === 1, `${ac.time}/${ac.dayOffset}`);
const ac2 = addMinutesToClock('10:00', 45)!;
ok('10:00 + 45 = 10:45', ac2.time === '10:45' && ac2.dayOffset === 0);
ok('bad clock', addMinutesToClock('99:99', 10) === null);

// --- Layover
ok('layover 14:00→15:30 = 90', layoverMinutes('14:00', '15:30') === 90);
ok('layover overnight', layoverMinutes('23:00', '01:00', true) === 120);

// --- Jet lag: 6 zones west = 6 days; east = 9 days (×1.5)
ok('jetlag 6 west = 6', jetLagDays(6, 'west').days === 6);
ok('jetlag 6 east = 9', jetLagDays(6, 'east').days === 9, jetLagDays(6, 'east').days);
const tz = timeZoneDelta(-5, 1); // NY(-5) → London(+1)? actually London +0/+1; test delta
ok('tz delta 6 east', tz.zones === 6 && tz.direction === 'east');
const tzw = timeZoneDelta(1, -8);
ok('tz delta 9 west', tzw.zones === 9 && tzw.direction === 'west');

// --- Luggage
ok('luggage 55×40×20 = 44 L', near(luggageLitres(55, 40, 20)!, 44));
ok('linear sum', linearCm(55, 40, 20) === 115);
ok('luggage invalid', luggageLitres(0, 40, 20) === null);

// --- Budget
ok('budget/day 2000/10 = 200', budgetPerDay(2000, 10) === 200);
ok('budget/person/day', budgetPerPersonPerDay(2000, 10, 2) === 100);
ok('budget invalid', budgetPerDay(2000, 0) === null);

// --- Tip
const t = tip(80, 20, 4)!;
ok('tip 80 @20% = 16', near(t.tip, 16));
ok('tip total 96', near(t.total, 96));
ok('tip per person 24', near(t.perPerson, 24));
ok('tip invalid', tip(-1, 20) === null);

// --- Tip customs table sanity
ok('tip customs has 14', TIP_CUSTOMS.length === 14, TIP_CUSTOMS.length);
ok('Japan no tip', TIP_CUSTOMS.find(c => c.country === 'Japan')!.high === 0);
ok('USA 15-20', TIP_CUSTOMS.find(c => c.country === 'United States')!.low === 15);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
