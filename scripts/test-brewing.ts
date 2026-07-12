/**
 * Node test for src/lib/brewing.ts — run:
 *   node --experimental-strip-types scripts/test-brewing.ts
 * Values cross-checked against Brewer's Friend / standard brewing references.
 */
import {
  abvSimple, abvAccurate, attenuation, caloriesPer12oz, brixToSg, sgToBrix,
  hydrometerCorrect, ibuTinseth, tinsethUtilization, residualCo2, primingSugar,
  strikeTemp, diluteToGravity, refractometerFg, PRIMING_SUGARS,
} from '../src/lib/brewing.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// --- ABV: OG 1.050, FG 1.010 → simple (0.040)×131.25 = 5.25%
ok('ABV simple 1.050→1.010 = 5.25%', near(abvSimple(1.050, 1.010)!, 5.25, 1e-9), abvSimple(1.050, 1.010));
// accurate a touch higher than simple for normal beers
ok('ABV accurate ~5.3%', abvAccurate(1.050, 1.010)! > 5.2 && abvAccurate(1.050, 1.010)! < 5.5, abvAccurate(1.050, 1.010));
ok('ABV invalid range', abvSimple(1.5, 1.0) === null);
ok('ABV accurate og<=fg null', abvAccurate(1.010, 1.010) === null);

// --- Attenuation: (0.040/0.050)×100 = 80%
ok('attenuation 80%', near(attenuation(1.050, 1.010)!, 80, 1e-9));

// --- Calories per 12oz for 1.050→1.010 ≈ 165 (standard alcohol+carbs formula)
const cal = caloriesPer12oz(1.050, 1.010)!;
ok('calories 1.050→1.010 ≈ 160-170', cal > 158 && cal < 172, cal.toFixed(1));

// --- Brix↔SG: 12 Brix ≈ 1.0484; round trip
const sg = brixToSg(12)!;
ok('12 Brix ≈ 1.048', sg > 1.047 && sg < 1.050, sg.toFixed(4));
ok('SG→Brix round trip', near(sgToBrix(sg)!, 12, 0.15), sgToBrix(sg));
ok('1.050 SG ≈ 12.4 Brix', sgToBrix(1.050)! > 12 && sgToBrix(1.050)! < 12.7, sgToBrix(1.050));

// --- Hydrometer correction: reading 1.050 at 70°F, cal 60°F → slightly higher
const hc = hydrometerCorrect(1.050, 70, 60)!;
ok('hydrometer 70°F reads low, corrects up', hc > 1.050 && hc < 1.052, hc.toFixed(4));
ok('hydrometer at cal temp = reading', near(hydrometerCorrect(1.050, 60, 60)!, 1.050, 1e-9));

// --- Tinseth utilization: gravity 1.050, 60 min ≈ 0.231
const util = tinsethUtilization(1.050, 60);
ok('Tinseth util 1.050/60min ≈ 0.23', util > 0.22 && util < 0.24, util.toFixed(4));
// IBU: 28g hops, 10% AA, 60 min, 1.050 boil, 20 L ≈ 32 IBU
const ibu = ibuTinseth([{ grams: 28, alphaPct: 10, boilMinutes: 60 }], 1.050, 20)!;
ok('IBU 28g 10% 60min 20L ≈ 30-35', ibu > 30 && ibu < 36, ibu.toFixed(1));
// multiple additions sum
const ibu2 = ibuTinseth([{ grams: 28, alphaPct: 10, boilMinutes: 60 }, { grams: 28, alphaPct: 5, boilMinutes: 15 }], 1.050, 20)!;
ok('IBU multiple additions > single', ibu2 > ibu);

// --- Residual CO2 at 68°F ≈ 0.86 vols
ok('residual CO2 68°F ≈ 0.86', near(residualCo2(68), 3.0378 - 0.050062 * 68 + 0.00026555 * 68 * 68, 1e-9), residualCo2(68).toFixed(3));
// priming: target 2.4 vols, 68°F, 20 L, corn sugar 4.0 g/L/vol
const prime = primingSugar(2.4, 68, 20, 4.0)!;
ok('priming co2 to add ≈ 1.54', near(prime.co2ToAdd, 2.4 - residualCo2(68), 1e-9), prime.co2ToAdd.toFixed(3));
ok('priming grams ≈ 123', near(prime.grams, prime.co2ToAdd * 20 * 4.0, 1e-9), prime.grams.toFixed(1));
ok('priming grams positive & sane', prime.grams > 100 && prime.grams < 140);

// --- Strike temp: mash 152°F, grain 65°F, ratio 1.5 qt/lb
// Tw = (0.2/1.5)(152−65)+152 = 0.13333×87 + 152 = 11.6 + 152 = 163.6°F
ok('strike temp ≈ 163.6°F', near(strikeTemp(152, 65, 1.5)!, (0.2 / 1.5) * 87 + 152, 1e-9), strikeTemp(152, 65, 1.5)!.toFixed(1));
ok('strike invalid ratio', strikeTemp(152, 65, 0) === null);

// --- Dilution: 20 L at 1.060 → target 1.050
// P1=60, P2=50, finalVol=60×20/50=24 L, add 4 L
const dil = diluteToGravity(20, 1.060, 1.050)!;
ok('dilute final vol 24 L', near(dil.finalVolL, 24, 1e-9), dil.finalVolL);
ok('dilute add 4 L', near(dil.waterToAddL, 4, 1e-9));
ok('dilute target>current null', diluteToGravity(20, 1.050, 1.060) === null);

// --- Refractometer (Terrill cubic): OG brix 12, FG brix 7 → FG ~1.014
const rfg = refractometerFg(12, 7)!;
ok('refractometer FG ~1.010-1.018', rfg > 1.010 && rfg < 1.018, rfg.toFixed(4));
// higher final brix (less fermented) → higher FG
ok('refractometer higher final brix → higher FG', refractometerFg(12, 10)! > refractometerFg(12, 7)!);

// --- Priming sugars table (stoichiometric factors)
ok('priming sugars = 3', PRIMING_SUGARS.length === 3);
ok('corn sugar 4.4', PRIMING_SUGARS[0].gPerLPerVol === 4.4);
ok('sucrose < corn sugar (more fermentable/g)', PRIMING_SUGARS[1].gPerLPerVol < PRIMING_SUGARS[0].gPerLPerVol);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
