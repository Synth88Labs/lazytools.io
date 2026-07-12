/**
 * Personal-finance planning math for the /finance/ category: mortgage payment
 * and amortization, home affordability (28/36 DTI rule), retirement projection
 * with the 4% rule, and the 50/30/20 budget split. Standard financial formulas;
 * rule-of-thumb benchmarks (28/36, 4% safe withdrawal, 50/30/20) are cited on
 * each tool page. Educational, not financial advice.
 */

/** Monthly principal & interest for a fully-amortizing loan. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number | null {
  if (principal <= 0 || years <= 0 || annualRatePct < 0) return null;
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (r === 0) return principal / n;
  const f = Math.pow(1 + r, n);
  return (principal * r * f) / (f - 1);
}

/** Loan amount affordable for a given monthly P&I payment (inverse amortization). */
export function loanFromPayment(payment: number, annualRatePct: number, years: number): number | null {
  if (payment <= 0 || years <= 0 || annualRatePct < 0) return null;
  const r = annualRatePct / 100 / 12;
  const n = Math.round(years * 12);
  if (r === 0) return payment * n;
  const f = Math.pow(1 + r, n);
  return (payment * (f - 1)) / (r * f);
}

export interface MortgageResult {
  principalInterest: number;
  monthlyTotal: number; // PITI + HOA + PMI
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  yearlyBalance: { year: number; balance: number }[];
  // with extra payment:
  extra?: { payoffMonths: number; totalInterest: number; interestSaved: number; monthsSaved: number };
}

/**
 * Full mortgage picture: monthly PITI, total interest, an amortization curve,
 * and (if an extra monthly principal payment is given) the accelerated payoff.
 */
export function mortgage(i: {
  principal: number; annualRatePct: number; years: number;
  annualTax?: number; annualInsurance?: number; monthlyPmi?: number; monthlyHoa?: number;
  extraMonthly?: number;
}): MortgageResult | null {
  const pi = monthlyPayment(i.principal, i.annualRatePct, i.years);
  if (pi == null) return null;
  const r = i.annualRatePct / 100 / 12;
  const n = Math.round(i.years * 12);
  const escrow = (i.annualTax ?? 0) / 12 + (i.annualInsurance ?? 0) / 12 + (i.monthlyPmi ?? 0) + (i.monthlyHoa ?? 0);

  // Baseline amortization → yearly balance + total interest.
  const yearly: { year: number; balance: number }[] = [{ year: 0, balance: i.principal }];
  let bal = i.principal, totalInterest = 0;
  for (let m = 1; m <= n; m++) {
    const interest = bal * r;
    const principalPart = pi - interest;
    bal = Math.max(0, bal - principalPart);
    totalInterest += interest;
    if (m % 12 === 0) yearly.push({ year: m / 12, balance: bal });
  }

  const res: MortgageResult = {
    principalInterest: pi,
    monthlyTotal: pi + escrow,
    totalInterest,
    totalPaid: pi * n,
    payoffMonths: n,
    yearlyBalance: yearly,
  };

  // Extra-payment scenario.
  if (i.extraMonthly && i.extraMonthly > 0) {
    let b = i.principal, ti = 0, months = 0;
    const pay = pi + i.extraMonthly;
    while (b > 0 && months < n * 2) {
      const interest = b * r;
      let principalPart = pay - interest;
      if (principalPart >= b) { ti += interest; b = 0; months++; break; }
      b -= principalPart; ti += interest; months++;
    }
    res.extra = {
      payoffMonths: months,
      totalInterest: ti,
      interestSaved: totalInterest - ti,
      monthsSaved: n - months,
    };
  }
  return res;
}

/**
 * Home affordability via the 28/36 rule: housing costs ≤ 28% of gross income
 * (front-end), total debt payments ≤ 36% (back-end). Returns the max monthly
 * housing payment, max loan and max home price.
 */
export function affordability(i: {
  grossMonthlyIncome: number; monthlyDebts: number; downPayment: number;
  annualRatePct: number; years: number; monthlyTaxInsHoa: number;
  frontEnd?: number; backEnd?: number;
}): { maxHousingPayment: number; maxPrincipalInterest: number; maxLoan: number; maxHomePrice: number; limitedBy: string } | null {
  if (i.grossMonthlyIncome <= 0) return null;
  const front = (i.frontEnd ?? 0.28) * i.grossMonthlyIncome;
  const back = (i.backEnd ?? 0.36) * i.grossMonthlyIncome - Math.max(0, i.monthlyDebts);
  const maxHousing = Math.max(0, Math.min(front, back));
  const limitedBy = back < front ? 'total debt (36% back-end)' : 'housing costs (28% front-end)';
  const maxPI = Math.max(0, maxHousing - Math.max(0, i.monthlyTaxInsHoa));
  const maxLoan = maxPI > 0 ? (loanFromPayment(maxPI, i.annualRatePct, i.years) ?? 0) : 0;
  return {
    maxHousingPayment: maxHousing,
    maxPrincipalInterest: maxPI,
    maxLoan,
    maxHomePrice: maxLoan + Math.max(0, i.downPayment),
    limitedBy,
  };
}

/**
 * Retirement projection: future value of current savings plus monthly
 * contributions (incl. employer match) at an assumed annual return, and the
 * "your number" from the 4% safe-withdrawal rule (25× annual expenses).
 */
export function retirement(i: {
  currentAge: number; retirementAge: number; currentSavings: number;
  monthlyContribution: number; employerMatchMonthly: number;
  annualReturnPct: number; annualExpensesInRetirement: number; withdrawalRatePct?: number;
}): { years: number; projectedBalance: number; contributed: number; growth: number; targetNumber: number; onTrack: boolean; shortfall: number } | null {
  const years = i.retirementAge - i.currentAge;
  if (years <= 0 || i.annualReturnPct < 0) return null;
  const r = i.annualReturnPct / 100 / 12;
  const n = Math.round(years * 12);
  const monthly = Math.max(0, i.monthlyContribution) + Math.max(0, i.employerMatchMonthly);
  const fvLump = i.currentSavings * Math.pow(1 + r, n);
  const fvContrib = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r);
  const projectedBalance = fvLump + fvContrib;
  const contributed = i.currentSavings + monthly * n;
  const wr = (i.withdrawalRatePct ?? 4) / 100;
  const targetNumber = wr > 0 ? i.annualExpensesInRetirement / wr : Infinity;
  return {
    years,
    projectedBalance,
    contributed,
    growth: projectedBalance - contributed,
    targetNumber,
    onTrack: projectedBalance >= targetNumber,
    shortfall: Math.max(0, targetNumber - projectedBalance),
  };
}

/** 50/30/20 budget split of monthly take-home pay. */
export function budget503020(takeHome: number, split: { needs: number; wants: number; savings: number } = { needs: 0.5, wants: 0.3, savings: 0.2 }): { needs: number; wants: number; savings: number } | null {
  if (takeHome < 0) return null;
  return { needs: takeHome * split.needs, wants: takeHome * split.wants, savings: takeHome * split.savings };
}
