/**
 * Node test for the SMD-resistor decoder and LC-resonance helpers in
 * src/lib/electronics.ts — run:
 *   node --experimental-strip-types scripts/test-electronics-extra.ts
 */
import { decodeSmd, lcResonance, lcImpedance, EIA96, fmtOhms } from '../src/lib/electronics.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${JSON.stringify(got)})` : '')); }
}
const rel = (a: number, b: number, tol = 1e-4) => Math.abs(a - b) <= tol * Math.abs(b);

// --- EIA-96 table integrity: length + anchor values (catches a shift/typo)
ok('EIA96 length 96', EIA96.length === 96, EIA96.length);
ok('EIA96 01 = 100', EIA96[0] === 100);
ok('EIA96 30 = 200', EIA96[29] === 200);
ok('EIA96 47 = 301', EIA96[46] === 301);
ok('EIA96 68 = 499', EIA96[67] === 499);
ok('EIA96 96 = 976', EIA96[95] === 976);

// --- 3-digit codes
ok('103 = 10kΩ', decodeSmd('103')!.ohms === 10000, decodeSmd('103'));
ok('470 = 47Ω (not 470!)', decodeSmd('470')!.ohms === 47, decodeSmd('470'));
ok('221 = 220Ω', decodeSmd('221')!.ohms === 220);
ok('105 = 1MΩ', decodeSmd('105')!.ohms === 1e6);
ok('3-digit format label', decodeSmd('103')!.format === '3-digit');

// --- 4-digit (1%) codes
ok('1002 = 10kΩ', decodeSmd('1002')!.ohms === 10000, decodeSmd('1002'));
ok('4700 = 470Ω', decodeSmd('4700')!.ohms === 470);
ok('1000 = 100Ω', decodeSmd('1000')!.ohms === 100);
ok('4-digit format label', decodeSmd('1002')!.format === '4-digit (1%)');

// --- R-notation decimals
ok('R47 = 0.47Ω', decodeSmd('R47')!.ohms === 0.47, decodeSmd('R47'));
ok('4R7 = 4.7Ω', decodeSmd('4R7')!.ohms === 4.7, decodeSmd('4R7'));
ok('47R0 = 47Ω', decodeSmd('47R0')!.ohms === 47);
ok('0R5 = 0.5Ω', decodeSmd('0R5')!.ohms === 0.5);

// --- EIA-96 codes: value = EIA96[code] × letter-multiplier
ok('01C = 10kΩ (100×100)', decodeSmd('01C')!.ohms === 10000, decodeSmd('01C'));
ok('68X = 49.9Ω (499×0.1)', rel(decodeSmd('68X')!.ohms, 49.9), decodeSmd('68X'));
ok('22A = 165Ω', decodeSmd('22A')!.ohms === 165);
ok('01A = 100Ω', decodeSmd('01A')!.ohms === 100);
ok('96F = 97.6MΩ (976×1e5)', decodeSmd('96F')!.ohms === 976 * 1e5);
ok('EIA-96 format label', decodeSmd('01C')!.format === 'EIA-96 (1%)');

// --- zero-ohm jumpers
ok('0 = 0Ω jumper', decodeSmd('0')!.ohms === 0 && decodeSmd('0')!.format === 'Zero-ohm jumper');
ok('00 = 0Ω', decodeSmd('00')!.ohms === 0);
ok('000 = 0Ω', decodeSmd('000')!.ohms === 0);

// --- garbage
ok('empty → null', decodeSmd('') === null);
ok('99Q (bad letter) → null', decodeSmd('99Q') === null);
ok('abc → null', decodeSmd('abc') === null);

// --- lowercase / whitespace tolerance
ok('lowercase 68x', rel(decodeSmd(' 68x ')!.ohms, 49.9));

// --- LC resonance: f = 1/(2π√(LC))
// L = 100 µH, C = 100 pF → f ≈ 1.5915 MHz
ok('LC 100µH·100pF ≈ 1.5915MHz', rel(lcResonance(100e-6, 100e-12), 1.59155e6, 1e-4), lcResonance(100e-6, 100e-12));
// L = 1 mH, C = 1 µF → f ≈ 5032.9 Hz
ok('LC 1mH·1µF ≈ 5032.9Hz', rel(lcResonance(1e-3, 1e-6), 5032.92, 1e-4), lcResonance(1e-3, 1e-6));
// characteristic impedance √(L/C): 100µH/100pF → 1000Ω
ok('Z0 100µH/100pF = 1kΩ', rel(lcImpedance(100e-6, 100e-12), 1000), lcImpedance(100e-6, 100e-12));

// --- fmtOhms sanity (existing helper reused by the new tool)
ok('fmtOhms 10000 = 10 kΩ', fmtOhms(10000) === '10 kΩ', fmtOhms(10000));
ok('fmtOhms 0.47 = 0.47 Ω', fmtOhms(0.47) === '0.47 Ω', fmtOhms(0.47));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
