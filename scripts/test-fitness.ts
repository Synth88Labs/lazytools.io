import { pace, epley1RM, brzycki1RM, repWeight, maxHrTraditional, maxHrTanaka, karvonen, riegel, cooperVo2, caloriesBurned, stepsDistance, strideFromHeight, distanceFromPace, timeFromPace } from '../src/lib/fitness.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Pace: 10 km in 50:00 (3000s) -> 5:00/km = 300 s/km; 8:03/mile ~483s
const p = pace(10000, 3000);
ok('10k in 50min = 300 s/km', p !== null && approx(p.secPerKm, 300, 0.1));
ok('10k in 50min = 12 km/h', p !== null && approx(p.kmh, 12, 0.01));
ok('sec/mile ~482.8', p !== null && approx(p.secPerMile, 482.8, 0.5));
ok('pace round trip distance', approx(distanceFromPace(300, 3000), 10000, 1));
ok('pace round trip time', approx(timeFromPace(300, 10000), 3000, 1));

// 1RM: 100kg x 5 reps. Epley = 100*(1+5/30)=116.67; Brzycki = 100*36/32=112.5
ok('Epley 100x5 = 116.7', approx(epley1RM(100, 5), 116.67, 0.05));
ok('Brzycki 100x5 = 112.5', approx(brzycki1RM(100, 5)!, 112.5, 0.05));
ok('Epley 1 rep = weight', epley1RM(80, 1) === 80);
ok('Brzycki 37 reps invalid', brzycki1RM(100, 37) === null);
// repWeight inverse of Epley: at 5 reps from 116.67 1RM should give ~100
ok('repWeight inverse', approx(repWeight(epley1RM(100, 5), 5), 100, 0.01));

// Max HR: age 30 -> traditional 190, Tanaka 208-21=187
ok('traditional maxHR age30 = 190', maxHrTraditional(30) === 190);
ok('Tanaka maxHR age30 = 187', approx(maxHrTanaka(30), 187, 0.01));
// Karvonen: max190 rest60 intensity0.7 -> (130)*0.7+60 = 151
ok('Karvonen 70% = 151', approx(karvonen(190, 60, 0.7), 151, 0.01));

// Riegel: 5k in 25:00 (1500s) -> 10k prediction = 1500*(10000/5000)^1.06 = 1500*2^1.06
const r10 = riegel(1500, 5000, 10000);
ok('Riegel 5k->10k', r10 !== null && approx(r10, 1500 * Math.pow(2, 1.06), 0.1));
ok('Riegel 5k->10k ~ 3127s', r10 !== null && approx(r10, 3127, 2));

// Cooper: 2400m in 12min -> (2400-504.9)/44.73 = 42.37
ok('Cooper 2400m = 42.4 VO2', approx(cooperVo2(2400), 42.37, 0.05));

// Calories: MET 8, 70kg, 30min -> 8*3.5*70/200 * 30 = 294
ok('calories MET8 70kg 30min = 294', approx(caloriesBurned(8, 70, 30), 294, 0.5));

// Steps: 10000 steps * 0.75m stride = 7500m = 7.5km
const sd = stepsDistance(10000, 0.75);
ok('10000 steps x 0.75m = 7.5km', approx(sd.km, 7.5, 0.001));
ok('stride from 180cm ~0.745m', approx(strideFromHeight(180), 0.745, 0.005));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
