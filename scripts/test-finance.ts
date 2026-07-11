import { futureValue, loanPayment, payoff, simulateDebts, cagr, rule72, aprToApy, apyToApr, realReturn, npv } from '../src/lib/finance.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol: number, msg: string) => {
  if (Math.abs(a - b) <= tol) pass++; else { fail++; console.log(`FAIL ${msg}: got ${a}, expected ${b}`); }
};

// compound interest, lump only: $1000 at 5% monthly for 10y -> 1000*(1+.05/12)^120
const fv1 = futureValue(1000, 0.05, 10, 12, 0, 12);
approx(fv1.fv, 1000 * Math.pow(1 + 0.05 / 12, 120), 0.01, 'FV lump');
// with $100/mo contributions, 5%, 10y
const fv2 = futureValue(0, 0.05, 10, 12, 100, 12);
approx(fv2.fv, 100 * ((Math.pow(1 + 0.05 / 12, 120) - 1) / (0.05 / 12)), 0.01, 'FV annuity');
approx(fv2.totalContributed, 12000, 0.01, 'FV total contributed');

// loan payment: $200k, 6%, 30y -> ~1199.10
approx(loanPayment(200000, 0.06, 30), 1199.10, 0.5, 'loan payment');
// 0% loan
approx(loanPayment(12000, 0, 1), 1000, 1e-9, 'loan 0%');

// payoff: $5000 at 18% APR, $150/mo -> ~47 months
const po = payoff(5000, 0.18, 150);
approx(po!.months, 47, 1, 'cc payoff months');
if (payoff(5000, 0.18, 70) === null) pass++; else { fail++; console.log('FAIL cc payoff never (interest > payment)'); }

// debt simulation: avalanche should cost <= snowball interest
const debts = [
  { name: 'Card A', balance: 5000, apr: 0.22, minPayment: 100 },
  { name: 'Card B', balance: 2000, apr: 0.12, minPayment: 50 },
  { name: 'Loan C', balance: 8000, apr: 0.08, minPayment: 150 },
];
const snow = simulateDebts(debts, 200, 'snowball')!;
const aval = simulateDebts(debts, 200, 'avalanche')!;
if (snow && aval) pass++; else { fail++; console.log('FAIL debt sim returned'); }
if (aval.totalInterest <= snow.totalInterest + 1) pass++; else { fail++; console.log(`FAIL avalanche interest (${aval.totalInterest}) should be <= snowball (${snow.totalInterest})`); }
// snowball clears smallest (Card B, 2000) first
if (snow.order[0].name === 'Card B') pass++; else { fail++; console.log(`FAIL snowball order first = ${snow.order[0].name}`); }
// avalanche clears highest APR (Card A, 22%) first
if (aval.order[0].name === 'Card A') pass++; else { fail++; console.log(`FAIL avalanche order first = ${aval.order[0].name}`); }
// both clear all debts
if (snow.months > 0 && aval.months > 0) pass++; else { fail++; }

// closed-form helpers
approx(cagr(1000, 2000, 10), Math.pow(2, 0.1) - 1, 1e-9, 'CAGR double in 10y');
approx(rule72(0.08), 9, 1e-9, 'rule of 72 at 8%');
approx(aprToApy(0.12, 12), Math.pow(1.01, 12) - 1, 1e-9, 'APR->APY');
approx(apyToApr(aprToApy(0.12, 12), 12), 0.12, 1e-9, 'APY->APR round trip');
approx(realReturn(0.07, 0.03), (1.07 / 1.03) - 1, 1e-9, 'real return');
approx(npv(0.1, [-1000, 500, 500, 500]), -1000 + 500 / 1.1 + 500 / 1.21 + 500 / 1.331, 1e-6, 'NPV');

console.log(`\nsnowball: ${snow.months} mo, $${snow.totalInterest.toFixed(0)} interest`);
console.log(`avalanche: ${aval.months} mo, $${aval.totalInterest.toFixed(0)} interest`);
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
