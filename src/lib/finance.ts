/**
 * Personal-finance math — deterministic, no live data. Educational, not advice.
 * All rates are decimals (0.05 = 5%). Monthly compounding unless noted.
 */

/** Future value of a lump sum plus recurring end-of-period contributions. */
export function futureValue(
  principal: number, annualRate: number, years: number,
  compoundsPerYear = 12, contribution = 0, contribPerYear = 12,
): { fv: number; totalContributed: number; totalInterest: number } {
  const n = compoundsPerYear;
  const i = annualRate / n;
  const N = Math.round(years * n);
  const lumpFV = principal * Math.pow(1 + i, N);
  // contributions made contribPerYear times a year; approximate to the compounding period
  const perPeriodContribution = (contribution * contribPerYear) / n;
  const contribFV = i === 0
    ? perPeriodContribution * N
    : perPeriodContribution * ((Math.pow(1 + i, N) - 1) / i);
  const fv = lumpFV + contribFV;
  const totalContributed = principal + perPeriodContribution * N;
  return { fv, totalContributed, totalInterest: fv - totalContributed };
}

/** Monthly payment for a fully-amortising loan. */
export function loanPayment(principal: number, annualRate: number, years: number): number {
  const i = annualRate / 12;
  const N = Math.round(years * 12);
  if (i === 0) return principal / N;
  return (principal * i) / (1 - Math.pow(1 + i, -N));
}

/** Months and total interest to pay off a balance at a fixed monthly payment. */
export function payoff(balance: number, annualRate: number, monthlyPayment: number): { months: number; totalInterest: number; totalPaid: number } | null {
  const i = annualRate / 12;
  if (monthlyPayment <= balance * i) return null; // never pays off
  let bal = balance, months = 0, interest = 0;
  while (bal > 0 && months < 100000) {
    const int = bal * i;
    interest += int;
    bal = bal + int - monthlyPayment;
    months++;
    if (bal < 0) { interest += bal; bal = 0; } // last payment overshoots; refund the negative
  }
  const totalPaid = balance + interest;
  return { months, totalInterest: interest, totalPaid };
}

export interface Debt { name: string; balance: number; apr: number; minPayment: number }
export interface DebtResult {
  order: { name: string; payoffMonth: number; interestPaid: number }[];
  months: number;
  totalInterest: number;
  totalPaid: number;
}

/** Simulate paying off multiple debts with the snowball or avalanche method + an extra monthly amount. */
export function simulateDebts(debts: Debt[], extra: number, strategy: 'snowball' | 'avalanche'): DebtResult | null {
  const list = debts.map((d) => ({ ...d, bal: d.balance, interestPaid: 0, payoffMonth: 0 }));
  if (list.some((d) => d.bal > 0 && d.minPayment <= (d.bal * d.apr) / 12)) {
    // a min payment doesn't even cover interest — only solvable if extra helps; check overall below
  }
  let month = 0, totalInterest = 0;
  const sortActive = () => {
    const active = list.filter((d) => d.bal > 0);
    active.sort((a, b) => (strategy === 'snowball' ? a.bal - b.bal : b.apr - a.apr));
    return active;
  };
  while (list.some((d) => d.bal > 0) && month < 12000) {
    month++;
    // accrue interest
    for (const d of list) {
      if (d.bal <= 0) continue;
      const int = (d.bal * d.apr) / 12;
      d.interestPaid += int;
      totalInterest += int;
      d.bal += int;
    }
    // Constant total budget: all original minimums + extra. Cleared debts' minimums
    // stay in the budget and roll onto the focus debt (the snowball effect).
    let budget = extra + list.reduce((s, d) => s + d.minPayment, 0);
    // pay minimums first (only on debts that still have a balance)
    for (const d of list) {
      if (d.bal <= 0) continue;
      const pay = Math.min(d.minPayment, d.bal);
      d.bal -= pay; budget -= pay;
      if (d.bal <= 0.005) { d.bal = 0; if (!d.payoffMonth) d.payoffMonth = month; }
    }
    // throw remaining budget at the focus debt(s) in order
    const active = sortActive();
    for (const d of active) {
      if (budget <= 0) break;
      const pay = Math.min(budget, d.bal);
      d.bal -= pay; budget -= pay;
      if (d.bal <= 0.005) { d.bal = 0; if (!d.payoffMonth) d.payoffMonth = month; }
    }
    // safety: if nothing was paid down this month, it's unsolvable
    if (month > 11999) return null;
  }
  if (list.some((d) => d.bal > 0)) return null;
  const totalPaid = debts.reduce((s, d) => s + d.balance, 0) + totalInterest;
  return {
    order: list.map((d) => ({ name: d.name, payoffMonth: d.payoffMonth, interestPaid: d.interestPaid }))
      .sort((a, b) => a.payoffMonth - b.payoffMonth),
    months: month,
    totalInterest,
    totalPaid,
  };
}

// ---- simple closed-form helpers ----

export const cagr = (start: number, end: number, years: number) =>
  start > 0 && years > 0 ? Math.pow(end / start, 1 / years) - 1 : NaN;

export const rule72 = (rate: number) => (rate > 0 ? 72 / (rate * 100) : NaN);

export const aprToApy = (apr: number, compoundsPerYear = 12) => Math.pow(1 + apr / compoundsPerYear, compoundsPerYear) - 1;
export const apyToApr = (apy: number, compoundsPerYear = 12) => compoundsPerYear * (Math.pow(1 + apy, 1 / compoundsPerYear) - 1);

export const realReturn = (nominal: number, inflation: number) => (1 + nominal) / (1 + inflation) - 1;

export const npv = (rate: number, cashflows: number[]) =>
  cashflows.reduce((s, cf, t) => s + cf / Math.pow(1 + rate, t), 0);
