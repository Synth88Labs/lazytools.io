import { monthlyPayment, refinance } from '../src/lib/refinance.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;

// Standard amortization reference: $200,000 at 6% for 30 years → ~$1,199.10/mo
ok('payment 200k@6%/360 ≈ 1199.10', near(monthlyPayment(200000, 6, 360), 1199.10, 0.5));
// $300,000 at 6.8% over 27 years (324 mo)
const cur = monthlyPayment(300000, 6.8, 324);
ok('payment 300k@6.8%/324 ≈ 2025', near(cur, 2025, 3));
// 0% edge case: straight division
ok('0% payment = P/n', monthlyPayment(1200, 0, 12) === 100);

// Refinance: 300k, 6.8% 27yr → 5.5% 30yr, $4,500 closing
const r = refinance({ balance: 300000, currentRate: 6.8, remainingMonths: 324, newRate: 5.5, newMonths: 360, closingCosts: 4500 });
ok('new payment < current', r.newPayment < r.currentPayment);
ok('monthly savings positive', r.monthlySavings > 0);
ok('break-even is closing/savings', near(r.breakEvenMonths!, 4500 / r.monthlySavings, 0.01));
ok('worthIt true (recoups within term)', r.worthIt === true);

// No-saving case: refinancing to a HIGHER rate → no monthly saving, break-even null
const r2 = refinance({ balance: 300000, currentRate: 5.0, remainingMonths: 300, newRate: 7.0, newMonths: 360, closingCosts: 4000 });
ok('higher rate → no saving', r2.monthlySavings < 0 && r2.breakEvenMonths === null && r2.worthIt === false);

console.log(`refinance: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
