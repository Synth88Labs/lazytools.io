/** Mortgage refinance break-even math (client-side, educational, not advice). */

/** Fixed monthly payment to amortize `principal` at `annualRatePct` over `months`. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (months <= 0) return 0;
  const i = annualRatePct / 100 / 12;
  if (i === 0) return principal / months;
  return (principal * i) / (1 - Math.pow(1 + i, -months));
}

export interface RefinanceInput {
  balance: number;        // current loan balance
  currentRate: number;    // current APR %
  remainingMonths: number; // months left on the current loan
  newRate: number;        // refinanced APR %
  newMonths: number;      // new loan term in months
  closingCosts: number;   // refinance closing costs
}

export interface RefinanceResult {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;   // current - new (positive = cheaper monthly)
  breakEvenMonths: number | null; // closing costs / monthly savings (null if no monthly saving)
  currentTotalRemaining: number;  // payment * remaining months
  newTotalCost: number;           // new payment * new term + closing costs
  lifetimeSavings: number;        // current total - new total cost (can be negative)
  worthIt: boolean;               // monthly saving AND recoups closing costs within the new term
}

export function refinance(inp: RefinanceInput): RefinanceResult {
  const currentPayment = monthlyPayment(inp.balance, inp.currentRate, inp.remainingMonths);
  const newPayment = monthlyPayment(inp.balance, inp.newRate, inp.newMonths);
  const monthlySavings = currentPayment - newPayment;
  const breakEvenMonths = monthlySavings > 0 ? inp.closingCosts / monthlySavings : null;
  const currentTotalRemaining = currentPayment * inp.remainingMonths;
  const newTotalCost = newPayment * inp.newMonths + inp.closingCosts;
  const lifetimeSavings = currentTotalRemaining - newTotalCost;
  const worthIt = monthlySavings > 0 && breakEvenMonths !== null && breakEvenMonths <= inp.newMonths;
  return { currentPayment, newPayment, monthlySavings, breakEvenMonths, currentTotalRemaining, newTotalCost, lifetimeSavings, worthIt };
}
