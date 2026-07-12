/**
 * Node test for src/lib/equilibrium.ts — run:
 *   node --experimental-strip-types scripts/test-equilibrium.ts
 * Cross-checked against canonical general-chemistry worked examples.
 */
import {
  weakAcidPh, weakBasePh, kaToPka, pkaToKa, molarSolubility, kspFromSolubility,
  molarSolubilityCommonIon, reactionQuotient, solveEquilibrium, enthalpyOfReaction, hessSum,
} from '../src/lib/equilibrium.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// --- Weak acid: 0.1 M acetic acid, Ka = 1.8e-5 → pH ≈ 2.87 (textbook)
const aa = weakAcidPh(1.8e-5, 0.1)!;
ok('acetic 0.1M pH ≈ 2.87', near(aa.ph, 2.87, 0.01), aa.ph.toFixed(3));
ok('acetic [H+] ≈ 1.33e-3', near(aa.h, 1.333e-3, 1e-5), aa.h.toExponential(3));
ok('acetic % ionization ≈ 1.33%', near(aa.ionizationPct, 1.333, 0.02), aa.ionizationPct.toFixed(3));
ok('weak acid invalid', weakAcidPh(0, 0.1) === null);

// --- Weak base: 0.1 M ammonia, Kb = 1.8e-5 → pOH ≈ 2.87, pH ≈ 11.13
const nb = weakBasePh(1.8e-5, 0.1)!;
ok('ammonia 0.1M pH ≈ 11.13', near(nb.ph, 11.13, 0.01), nb.ph.toFixed(3));
ok('ammonia pOH ≈ 2.87', near(nb.poh, 2.87, 0.01));

// --- pKa helpers: acetic pKa ≈ 4.74
ok('pKa acetic ≈ 4.74', near(kaToPka(1.8e-5), 4.745, 0.01), kaToPka(1.8e-5));
ok('pKa→Ka round trip', near(pkaToKa(kaToPka(1.8e-5)), 1.8e-5, 1e-12));

// --- Ksp / molar solubility
// AgCl (1:1), Ksp 1.8e-10 → s = 1.34e-5
ok('AgCl solubility 1.34e-5', near(molarSolubility(1.8e-10, 1, 1)!, 1.342e-5, 1e-7), molarSolubility(1.8e-10, 1, 1)!.toExponential(3));
// Ag2CrO4 (2:1), Ksp 1.1e-12 → s ≈ 6.5e-5
ok('Ag2CrO4 solubility ≈ 6.5e-5', near(molarSolubility(1.1e-12, 2, 1)!, 6.50e-5, 1e-6), molarSolubility(1.1e-12, 2, 1)!.toExponential(3));
// round-trip Ksp from s
ok('Ksp from s round trip (AgCl)', near(kspFromSolubility(1.342e-5, 1, 1)!, 1.8e-10, 1e-12));
ok('Ksp from s round trip (Ag2CrO4)', near(kspFromSolubility(molarSolubility(1.1e-12, 2, 1)!, 2, 1)!, 1.1e-12, 1e-15));
// common ion suppresses solubility: AgCl in 0.1 M NaCl → s ≈ Ksp/0.1 = 1.8e-9
const ci = molarSolubilityCommonIon(1.8e-10, 1, 1, 0.1)!;
ok('AgCl common-ion s ≈ 1.8e-9', near(ci, 1.8e-9, 1e-10), ci.toExponential(3));
ok('common-ion < pure water', ci < molarSolubility(1.8e-10, 1, 1)!);

// --- Reaction quotient
// H2 + I2 ⇌ 2HI with [H2]=[I2]=1, [HI]=2 → Q = 4/1 = 4
ok('Q = 4', near(reactionQuotient([{coeff:1,conc:1},{coeff:1,conc:1}], [{coeff:2,conc:2}])!, 4));

// --- ICE solver: H2 + I2 ⇌ 2HI, Kc=50, init [H2]=[I2]=1, [HI]=0 → [HI]≈1.56
const eq = solveEquilibrium([{coeff:1,conc:1},{coeff:1,conc:1}], [{coeff:2,conc:0}], 50)!;
ok('H2+I2 ICE [HI] ≈ 1.56', near(eq.products[0], 1.559, 0.005), eq.products[0].toFixed(3));
ok('H2+I2 ICE [H2] ≈ 0.221', near(eq.reactants[0], 0.2205, 0.005), eq.reactants[0].toFixed(3));
ok('ICE direction forward (Q0=0<Kc)', eq.direction === 'forward');
// verify it actually satisfies Kc
const qCheck = Math.pow(eq.products[0], 2) / (eq.reactants[0] * eq.reactants[1]);
ok('ICE satisfies Kc=50', near(qCheck, 50, 0.1), qCheck.toFixed(2));
// reverse case: start all product side
const eqR = solveEquilibrium([{coeff:1,conc:0.2205},{coeff:1,conc:0.2205}], [{coeff:2,conc:1.559}], 50)!;
ok('near-equilibrium xi ≈ 0', Math.abs(eqR.xi) < 0.01, eqR.xi);

// --- Enthalpy of reaction (Hess): CH4 + 2O2 → CO2 + 2H2O(l)
// ΔHf: CH4 -74.8, O2 0, CO2 -393.5, H2O -285.8 → ΔHrxn = -890.3 kJ/mol
const dh = enthalpyOfReaction(
  [{coeff:1,hf:-74.8},{coeff:2,hf:0}],
  [{coeff:1,hf:-393.5},{coeff:2,hf:-285.8}]
);
ok('methane combustion ΔH ≈ -890.3', near(dh, -890.3, 0.1), dh.toFixed(1));

// --- Hess by steps: reverse a step and scale
ok('hess sum steps', near(hessSum([{deltaH:-100,multiplier:1},{deltaH:50,multiplier:-2}]), -200));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
