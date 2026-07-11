import { parseFormula, molarMass, balanceEquation, parseEquation } from '../src/lib/chemistry.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol: number, msg: string) => {
  if (Math.abs(a - b) <= tol) pass++; else { fail++; console.log(`FAIL ${msg}: got ${a}, expected ${b} (±${tol})`); }
};
const eq = (a: unknown, b: unknown, msg: string) => { if (a === b) pass++; else { fail++; console.log(`FAIL ${msg}: got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); } };
const throws = (fn: () => void, msg: string) => { try { fn(); fail++; console.log(`FAIL ${msg}: expected throw`); } catch { pass++; } };

// --- parser ---
eq(JSON.stringify(parseFormula('H2O')), JSON.stringify({ H: 2, O: 1 }), 'H2O');
eq(JSON.stringify(parseFormula('Ca(NO3)2')), JSON.stringify({ Ca: 1, N: 2, O: 6 }), 'Ca(NO3)2');
eq(JSON.stringify(parseFormula('Fe2(SO4)3')), JSON.stringify({ Fe: 2, S: 3, O: 12 }), 'Fe2(SO4)3');
// hydrate: CuSO4·5H2O
eq(JSON.stringify(parseFormula('CuSO4·5H2O')), JSON.stringify({ Cu: 1, S: 1, O: 9, H: 10 }), 'CuSO4.5H2O');
// nested brackets
eq(JSON.stringify(parseFormula('K4[Fe(CN)6]')), JSON.stringify({ K: 4, Fe: 1, C: 6, N: 6 }), 'K4[Fe(CN)6]');
// two-letter greedy: Co vs C+o — Co is cobalt
eq(JSON.stringify(parseFormula('CoCl2')), JSON.stringify({ Co: 1, Cl: 2 }), 'CoCl2');
throws(() => parseFormula('Xx2'), 'unknown element throws');
throws(() => parseFormula('H2(O'), 'unbalanced paren throws');

// --- molar mass (reference values) ---
approx(molarMass('H2O').molarMass, 18.015, 0.01, 'MW H2O');
approx(molarMass('NaCl').molarMass, 58.44, 0.01, 'MW NaCl');
approx(molarMass('C6H12O6').molarMass, 180.156, 0.02, 'MW glucose');
approx(molarMass('H2SO4').molarMass, 98.07, 0.02, 'MW H2SO4');
approx(molarMass('CuSO4·5H2O').molarMass, 249.68, 0.05, 'MW copper sulfate pentahydrate');
approx(molarMass('Ca(OH)2').molarMass, 74.09, 0.02, 'MW Ca(OH)2');
// percent composition: water is 11.19% H, 88.81% O
const w = molarMass('H2O');
const hPct = w.breakdown.find((r) => r.symbol === 'H')!.percent;
approx(hPct, 11.19, 0.05, 'H2O %H');

// --- equation balancer (reference stoichiometry) ---
const coefs = (s: string) => {
  const r = balanceEquation(s);
  return [...r.reactants.map((x) => x.coef), ...r.products.map((x) => x.coef)];
};
eq(JSON.stringify(coefs('H2 + O2 -> H2O')), JSON.stringify([2, 1, 2]), 'balance H2+O2');
eq(JSON.stringify(coefs('CH4 + O2 -> CO2 + H2O')), JSON.stringify([1, 2, 1, 2]), 'balance combustion CH4');
eq(JSON.stringify(coefs('Fe + O2 -> Fe2O3')), JSON.stringify([4, 3, 2]), 'balance iron rust');
eq(JSON.stringify(coefs('C2H6 + O2 -> CO2 + H2O')), JSON.stringify([2, 7, 4, 6]), 'balance ethane combustion');
eq(JSON.stringify(coefs('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2')), JSON.stringify([2, 16, 2, 2, 8, 5]), 'balance KMnO4 redox');
eq(JSON.stringify(coefs('Al + HCl -> AlCl3 + H2')), JSON.stringify([2, 6, 2, 3]), 'balance Al+HCl');
// = separator
eq(JSON.stringify(coefs('N2 + H2 = NH3')), JSON.stringify([1, 3, 2]), 'balance ammonia');

// parseEquation errors
throws(() => parseEquation('H2 + O2'), 'no arrow throws');

console.log(`\nMW glucose = ${molarMass('C6H12O6').molarMass.toFixed(3)}`);
console.log(`balanced: ${balanceEquation('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2').balancedString}`);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
