import { resistorFromBands, capacitorCodePf, awgDiameterMm, awg, rcTau, rcCutoff, capReactance, timer555Astable, timer555Monostable, ledResistor, voltageDivider, batteryLifeHours } from '../src/lib/electronics.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.02) => Math.abs(a - b) <= Math.max(tol, Math.abs(b) * 0.01);
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Resistor 4-band: Brown Black Red Gold = 10 × 100 = 1000Ω ±5%
const r1 = resistorFromBands(['Brown', 'Black', 'Red', 'Gold']);
ok('4-band Brn-Blk-Red-Gold = 1kΩ', r1 !== null && r1.ohms === 1000);
ok('tolerance ±5%', r1 !== null && r1.tolerance === 5);
// Yellow Violet Orange Gold = 47 × 1000 = 47kΩ
const r2 = resistorFromBands(['Yellow', 'Violet', 'Orange', 'Gold']);
ok('47kΩ', r2 !== null && r2.ohms === 47000);
// 5-band: Brown Black Black Red Brown = 100 × 100 = 10kΩ ±1%
const r3 = resistorFromBands(['Brown', 'Black', 'Black', 'Red', 'Brown']);
ok('5-band = 10kΩ ±1%', r3 !== null && r3.ohms === 10000 && r3.tolerance === 1);
// 6-band adds tempco
const r4 = resistorFromBands(['Red', 'Red', 'Black', 'Brown', 'Brown', 'Red']);
ok('6-band tempco = 50ppm', r4 !== null && r4.tempco === 50);

// Capacitor codes
ok('104 = 100000 pF', capacitorCodePf('104') === 100000);
ok('223 = 22000 pF', capacitorCodePf('223') === 22000);
ok('471 = 470 pF', capacitorCodePf('471') === 470);

// AWG: diameter formula. AWG 24 ≈ 0.511 mm; AWG 10 ≈ 2.588 mm
ok('AWG 24 diameter ~0.511mm', approx(awgDiameterMm(24), 0.5106, 0.005));
ok('AWG 10 diameter ~2.588mm', approx(awgDiameterMm(10), 2.588, 0.01));
// AWG 12 area ~3.31 mm², resistance ~5.2 Ω/km
const a12 = awg(12);
ok('AWG 12 area ~3.31mm²', approx(a12.areaMm2, 3.31, 0.05));
ok('AWG 12 resistance ~5.2Ω/km', approx(a12.ohmPerKm, 5.2, 0.3));

// RC: R=1kΩ C=1µF -> tau=1ms, cutoff=159.15 Hz
ok('RC tau 1k×1µF = 1ms', approx(rcTau(1000, 1e-6), 1e-3, 1e-6));
ok('RC cutoff 1k×1µF = 159.15Hz', approx(rcCutoff(1000, 1e-6), 159.15, 0.5));
// Xc at 1kHz, 1µF -> 159.15Ω
ok('Xc 1kHz 1µF = 159.15Ω', approx(capReactance(1000, 1e-6), 159.15, 0.5));

// 555 astable: R1=1k R2=10k C=10µF -> f = 1.44/(21000×10µF)=1.44/0.21=6.857Hz
const t555 = timer555Astable(1000, 10000, 10e-6);
ok('555 astable f ~6.86Hz', approx(t555.freq, 6.857, 0.05));
ok('555 duty ~52.4%', approx(t555.duty * 100, 52.38, 0.2));
// Monostable R=100k C=10µF -> t = 1.1×100000×10µF = 1.1s
ok('555 monostable = 1.1s', approx(timer555Monostable(100000, 10e-6), 1.1, 0.001));

// LED resistor: 5V supply, 2V LED, 20mA -> (3)/0.02 = 150Ω, P = 0.02²×150 = 0.06W
const led = ledResistor(5, 2, 20);
ok('LED resistor = 150Ω', approx(led.ohms, 150, 0.1));
ok('LED resistor power = 0.06W', approx(led.power, 0.06, 0.001));

// Voltage divider: 12V, R1=R2 -> 6V
ok('divider 12V equal = 6V', approx(voltageDivider(12, 1000, 1000), 6, 0.001));
ok('divider 9V R1=1k R2=2k = 6V', approx(voltageDivider(9, 1000, 2000), 6, 0.001));

// Battery: 2000mAh / 100mA × 0.8 = 16h
ok('battery 2000mAh/100mA = 16h', approx(batteryLifeHours(2000, 100), 16, 0.01));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
