/**
 * Node test for src/lib/finance-planning.ts — run:
 *   node --experimental-strip-types scripts/test-finance-planning.ts
 */
import {
  monthlyPayment, loanFromPayment, mortgage, affordability, retirement, budget503020,
} from '../src/lib/finance-planning.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;
const rel = (a: number, b: number, tol = 1e-4) => Math.abs(a - b) <= tol * Math.abs(b);

// --- Monthly payment: $300k, 6%, 30yr → ~$1,798.65
ok('P&I 300k/6%/30yr ≈ 1798.65', rel(monthlyPayment(300000, 6, 30)!, 1798.65, 1e-4), monthlyPayment(300000, 6, 30));
// zero interest
ok('P&I 0% = principal/n', near(monthlyPayment(120000, 0, 10)!, 1000));
// inverse round-trip
ok('loanFromPayment round-trip', rel(loanFromPayment(1798.65, 6, 30)!, 300000, 1e-3), loanFromPayment(1798.65, 6, 30));
ok('P&I invalid', monthlyPayment(0, 6, 30) === null);

// --- Mortgage full: total interest for 300k/6%/30yr ≈ 1798.65*360 - 300000 ≈ 347,514
const m = mortgage({ principal: 300000, annualRatePct: 6, years: 30, annualTax: 3600, annualInsurance: 1200, monthlyHoa: 100 })!;
ok('mortgage P&I ≈ 1798.65', rel(m.principalInterest, 1798.65, 1e-4));
ok('mortgage total interest ≈ 347.5k', rel(m.totalInterest, 1798.65 * 360 - 300000, 2e-3), m.totalInterest.toFixed(0));
// PITI = P&I + tax/12(300) + ins/12(100) + hoa(100) = 1798.65+500 = 2298.65
ok('mortgage PITI ≈ 2298.65', rel(m.monthlyTotal, 1798.65 + 300 + 100 + 100, 1e-3), m.monthlyTotal.toFixed(2));
ok('mortgage yearly balance last ≈ 0', m.yearlyBalance[m.yearlyBalance.length - 1].balance < 1, m.yearlyBalance[m.yearlyBalance.length - 1].balance);
ok('mortgage payoff 360 months', m.payoffMonths === 360);

// extra payment saves interest and time
const me = mortgage({ principal: 300000, annualRatePct: 6, years: 30, extraMonthly: 200 })!;
ok('extra payment defined', me.extra != null);
ok('extra saves interest', me.extra!.interestSaved > 0);
ok('extra shortens term', me.extra!.monthsSaved > 0 && me.extra!.payoffMonths < 360, me.extra!.payoffMonths);

// --- Affordability: income 8000/mo, debts 500, 20% back-end limits
// front = 0.28*8000 = 2240; back = 0.36*8000 - 500 = 2380; min = 2240 (front-limited)
const a = affordability({ grossMonthlyIncome: 8000, monthlyDebts: 500, downPayment: 60000, annualRatePct: 6, years: 30, monthlyTaxInsHoa: 400 })!;
ok('afford max housing 2240', near(a.maxHousingPayment, 2240, 1e-6), a.maxHousingPayment);
ok('afford limited by front-end', a.limitedBy.includes('front'));
ok('afford max P&I = 1840', near(a.maxPrincipalInterest, 2240 - 400, 1e-6));
ok('afford max loan positive', a.maxLoan > 250000 && a.maxLoan < 320000, a.maxLoan.toFixed(0));
ok('afford home price = loan + down', near(a.maxHomePrice, a.maxLoan + 60000, 1e-6));
// high debts → back-end limits
const a2 = affordability({ grossMonthlyIncome: 8000, monthlyDebts: 1500, downPayment: 60000, annualRatePct: 6, years: 30, monthlyTaxInsHoa: 400 })!;
ok('high debt → back-end limited', a2.limitedBy.includes('back') && a2.maxHousingPayment < a.maxHousingPayment);

// --- Retirement: 30 yrs, 50k now, 1000/mo + 200 match, 7% return, 40k expenses
const rt = retirement({ currentAge: 35, retirementAge: 65, currentSavings: 50000, monthlyContribution: 1000, employerMatchMonthly: 200, annualReturnPct: 7, annualExpensesInRetirement: 40000 })!;
ok('retirement 30 years', rt.years === 30);
ok('retirement number = 25x expenses', near(rt.targetNumber, 1000000, 1e-6), rt.targetNumber);
ok('retirement balance > contributed (growth)', rt.projectedBalance > rt.contributed);
ok('retirement balance reasonable', rt.projectedBalance > 1_500_000 && rt.projectedBalance < 2_200_000, rt.projectedBalance.toFixed(0));
ok('retirement on track', rt.onTrack === true);
// underfunded case
const rt2 = retirement({ currentAge: 55, retirementAge: 65, currentSavings: 20000, monthlyContribution: 200, employerMatchMonthly: 0, annualReturnPct: 5, annualExpensesInRetirement: 50000 })!;
ok('underfunded not on track', rt2.onTrack === false && rt2.shortfall > 0);

// --- Budget 50/30/20: 5000 → 2500/1500/1000
const b = budget503020(5000)!;
ok('budget needs 2500', near(b.needs, 2500));
ok('budget wants 1500', near(b.wants, 1500));
ok('budget savings 1000', near(b.savings, 1000));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
