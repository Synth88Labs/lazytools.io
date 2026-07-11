import { parseTire, tireDims, speedoError, hpFromTorque, torqueFromHp, displacementCc, CI_PER_LITRE, compressionRatio, fuelFromUsMpg, fuelFromL100, roadSpeed, engineRpm, wheelGeometry, offsetFromBackspacing } from '../src/lib/automotive.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Tire parsing
const t = parseTire('225/45R17');
ok('parse 225/45R17', t !== null && t.width === 225 && t.aspect === 45 && t.wheel === 17);
ok('parse P225/45ZR17', parseTire('P225/45ZR17')?.width === 225);
ok('parse with spaces', parseTire('225/45 R17')?.wheel === 17);
ok('reject garbage', parseTire('hello') === null);

// Tire dims: 225/45R17 -> sidewall 101.25mm, diameter = 17*25.4 + 2*101.25 = 431.8 + 202.5 = 634.3mm = 24.97in
const d = tireDims({ width: 225, aspect: 45, wheel: 17 });
ok('225/45R17 sidewall 101.25mm', approx(d.sidewallMm, 101.25, 0.01));
ok('225/45R17 diameter 634.3mm', approx(d.diameterMm, 634.3, 0.1));
ok('225/45R17 diameter 24.97in', approx(d.diameterIn, 24.97, 0.05));
ok('revs per mile ~808', approx(d.revsPerMile, 807.6, 2));

// Speedo error: bigger tire -> true speed higher
const d2 = tireDims({ width: 245, aspect: 45, wheel: 17 }); // bigger
const se = speedoError(d, d2, 100);
ok('bigger tire reads slow (true > indicated)', se.trueSpeed > 100);
ok('speedo pct positive', se.pctDiff > 0);

// HP/torque: 400 lb-ft at 5252 rpm = 400 hp
ok('400 lb-ft @ 5252 rpm = 400 hp', approx(hpFromTorque(400, 5252), 400, 0.1));
ok('torque round trip', approx(torqueFromHp(hpFromTorque(300, 4000), 4000), 300, 0.01));

// Displacement: 5.0L V8 ~ bore 94mm stroke 90mm... check a known: bore 100 stroke 100 1cyl = pi/4*100*100*100/1000 = 785.4cc
ok('bore100 stroke100 1cyl = 785.4cc', approx(displacementCc(100, 100, 1), 785.398, 0.1));
ok('1.0L in ci ~61', approx(1 * CI_PER_LITRE, 61.02, 0.1));

// Compression ratio: swept 500, clearance 50 -> (550)/50 = 11
ok('compression 500/50cc = 11:1', approx(compressionRatio(500, 50)!, 11, 0.001));

// Fuel economy: 30 US mpg = 7.84 L/100km
const f = fuelFromUsMpg(30);
ok('30 US mpg = 7.84 L/100km', approx(f.l100km, 7.84, 0.02));
ok('30 US mpg ~ 36 UK mpg', approx(f.ukMpg, 36.03, 0.1));
const f2 = fuelFromL100(5);
ok('5 L/100km = 47.04 US mpg', approx(f2.usMpg, 47.04, 0.05));
ok('fuel round trip', approx(fuelFromUsMpg(f2.usMpg).l100km, 5, 0.001));

// Gear/speed: 3000 rpm, total ratio 12, tire dia 634.3mm
const rs = roadSpeed(3000, 12, 634.3);
ok('roadSpeed positive', rs !== null && rs.kmh > 0);
ok('rpm round trip', rs !== null && approx(engineRpm(rs.kmh, 12, 634.3), 3000, 1));

// Wheel geometry: 8in wide, +45mm offset -> backspacing = 8*25.4/2 + 45 = 101.6 + 45 = 146.6mm
const w = wheelGeometry(8, 45);
ok('8in +45 offset backspacing 146.6mm', approx(w.backspacingMm, 146.6, 0.1));
ok('offset round trip', approx(offsetFromBackspacing(8, w.backspacingIn), 45, 0.1));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
