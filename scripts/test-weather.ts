import { cToF, fToC, heatIndexF, windChillF, dewPointC, relHumidity, wetBulbC, feelsLikeF, beaufort, cloudBaseFt } from '../src/lib/weather.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 1) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Temp conversions
ok('100C = 212F', approx(cToF(100), 212, 0.001));
ok('32F = 0C', approx(fToC(32), 0, 0.001));

// Heat index: NWS example 96°F, 65% RH ≈ 121°F
ok('HI 96F 65% ~121', approx(heatIndexF(96, 65), 121, 1.5));
// 90°F, 70% ~ 105°F
ok('HI 90F 70% ~105', approx(heatIndexF(90, 70), 105, 2));
// below 80 returns ~ actual (simple)
ok('HI 75F 50% ~ near 75', approx(heatIndexF(75, 50), 75, 3));

// Wind chill: NWS example 0°F, 15 mph ≈ -19°F
ok('WC 0F 15mph ~ -19', approx(windChillF(0, 15), -19, 1.5));
// 40°F, 10 mph ~ 34°F
ok('WC 40F 10mph ~34', approx(windChillF(40, 10), 34, 1.5));
ok('WC calm returns T', windChillF(30, 2) === 30);

// Dew point: 30°C, 50% RH ≈ 18.4°C
ok('Td 30C 50% ~18.4', approx(dewPointC(30, 50), 18.4, 0.5));
// 20°C, 100% RH = 20°C (saturated)
ok('Td 20C 100% = 20', approx(dewPointC(20, 100), 20, 0.1));

// RH inverse: T=30, Td=18.4 -> ~50%
ok('RH from 30/18.4 ~50%', approx(relHumidity(30, 18.4), 50, 1.5));
ok('RH T=Td = 100%', approx(relHumidity(25, 25), 100, 0.1));

// Wet bulb (Stull): 25°C, 50% RH ≈ 18.0°C
ok('Tw 25C 50% ~18.0', approx(wetBulbC(25, 50), 18.0, 0.5));
// 30°C, 100% = 30 (saturated -> wet bulb = dry bulb)
ok('Tw 30C 100% ~30', approx(wetBulbC(30, 100), 30, 0.7));

// Feels-like: 95F 60% -> heat index basis, warmer
const fl = feelsLikeF(95, 60, 5);
ok('feels-like hot uses heat index', fl.basis === 'heat index' && fl.value > 95);
const fl2 = feelsLikeF(20, 40, 20);
ok('feels-like cold uses wind chill', fl2.basis === 'wind chill' && fl2.value < 20);
const fl3 = feelsLikeF(65, 50, 5);
ok('feels-like mild = actual', fl3.basis === 'actual temperature' && fl3.value === 65);

// Beaufort
ok('beaufort 0mph = calm force0', beaufort(0).force === 0);
ok('beaufort 20mph = fresh breeze force5', beaufort(20).force === 5);
ok('beaufort 75mph = hurricane force12', beaufort(75).force === 12);

// Cloud base: 70F temp, 50F dewpoint -> (20/4.4)*1000 = 4545 ft
ok('cloud base 70/50 = 4545ft', approx(cloudBaseFt(70, 50), 4545, 5));
ok('cloud base saturated = 0', cloudBaseFt(60, 60) === 0);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
