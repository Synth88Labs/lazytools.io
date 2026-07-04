import type { CalcDef, CalcField } from './types.ts';

export type { CalcDef, CalcField };

export const CALCULATORS: CalcDef[] = [
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    icon: '％',
    description:
      'Calculate X% of any number instantly, with the working shown. Free percentage calculator that runs 100% in your browser — nothing uploaded.',
    lead: 'To find X% of a number, multiply the number by X ÷ 100 — so 15% of 80 is 80 × 0.15 = 12.',
    fields: [
      { id: 'percent', label: 'Percentage', type: 'number', suffix: '%', placeholder: '15', defaultValue: '15' },
      { id: 'of', label: 'Of the value', type: 'number', placeholder: '80', defaultValue: '80' },
    ],
    computeId: 'percentage',
    formula: 'result = value × (percentage ÷ 100). "Percent" literally means "per hundred" — 15% is 15 parts of every 100.',
    example: '15% of 80 → 80 × 0.15 = 12.',
    note: 'Handy reversal: X% of Y always equals Y% of X. Awkward problems flip into easy ones — 8% of 50 is the same as 50% of 8, which is instantly 4.',
    faqs: [
      { q: 'How do I calculate a percentage of a number?', a: 'Divide the percentage by 100 and multiply: 20% of 250 = 250 × 0.20 = 50.' },
      { q: 'How do I find what percent one number is of another?', a: 'Divide the part by the whole and multiply by 100: 30 out of 120 = 30 ÷ 120 × 100 = 25%.' },
      { q: 'What is the fastest mental percentage trick?', a: 'Anchor on 10%: move the decimal one place (10% of 340 = 34), then scale — 5% is half of that, 20% is double, 15% is one-and-a-half times. And remember X% of Y = Y% of X.' },
    ],
    keywords: ['percentage calculator', 'percent of a number', 'how to calculate percentage', 'what is 15 of 80'],
  },
  {
    slug: 'percentage-change-calculator',
    name: 'Percentage Change Calculator',
    icon: '📈',
    description:
      'Calculate percentage increase or decrease between two values, with the formula shown. Free, instant, 100% in your browser.',
    lead: 'Percentage change = (new − old) ÷ old × 100 — going from 80 to 100 is a 25% increase.',
    fields: [
      { id: 'from', label: 'Original value', type: 'number', placeholder: '80', defaultValue: '80' },
      { id: 'to', label: 'New value', type: 'number', placeholder: '100', defaultValue: '100' },
    ],
    computeId: 'percentageChange',
    formula:
      'change % = (new value − original value) ÷ |original value| × 100. Positive results are increases, negative are decreases.',
    example: 'From 80 to 100 → (100 − 80) ÷ 80 × 100 = 25% increase.',
    note: 'Mind the asymmetry: a 25% increase from 80 reaches 100, but getting back from 100 to 80 is only a 20% decrease. Percentage changes are always relative to the starting value, which is why a 50% loss needs a 100% gain to recover.',
    faqs: [
      { q: 'What is the percentage change formula?', a: '(new − old) ÷ old × 100. Example: 250 → 300 is (300 − 250) ÷ 250 × 100 = 20% increase.' },
      { q: 'What is the difference between percentage change and percentage points?', a: 'If interest rises from 4% to 6%, that is a 2 percentage-point rise but a 50% relative increase. Points subtract the raw percentages; percentage change is relative to the start.' },
      { q: 'Why do a 50% drop and a 50% gain not cancel out?', a: 'Because each change applies to a different base: 100 → 50 (−50%) → 75 (+50% of 50). After a 50% loss you need a 100% gain to break even.' },
    ],
    keywords: ['percentage change calculator', 'percent increase calculator', 'percent decrease', 'percentage difference'],
  },
  {
    slug: 'emi-calculator',
    name: 'EMI Calculator',
    icon: '🏦',
    description:
      'Calculate loan EMI (equated monthly installment), total interest and total repayment from principal, rate and tenure. Private — runs in your browser.',
    lead: 'EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where r is the monthly rate and n the number of months.',
    fields: [
      { id: 'principal', label: 'Loan amount', type: 'number', placeholder: '1000000', defaultValue: '1000000' },
      { id: 'rate', label: 'Interest rate (yearly)', type: 'number', suffix: '% p.a.', placeholder: '9', defaultValue: '9', step: 0.05 },
      { id: 'months', label: 'Tenure', type: 'number', suffix: 'months', placeholder: '240', defaultValue: '240' },
    ],
    computeId: 'emi',
    formula:
      'EMI = P × r × (1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is principal, r the monthly interest rate (yearly rate ÷ 12 ÷ 100) and n the tenure in months. The same formula banks use for home, car and personal loans.',
    example: 'A 1,000,000 loan at 9% for 240 months → EMI ≈ 8,997; total interest ≈ 1,159,342.',
    note: 'The sobering part is the interest total: on a typical 20-year home loan, total interest often exceeds the principal itself. Shortening tenure raises the EMI but collapses total interest — the calculator lets you see both trade-offs instantly, without sharing your finances with any website server.',
    faqs: [
      { q: 'What does EMI stand for?', a: 'Equated Monthly Installment — a fixed monthly payment combining interest and principal so the loan fully amortizes by the end of the tenure.' },
      { q: 'Why does most of my early EMI go to interest?', a: 'Interest is charged on the outstanding balance, which is largest at the start. Early payments are interest-heavy; the principal share grows every month as the balance falls.' },
      { q: 'Does this match my bank’s EMI exactly?', a: 'It uses the standard reducing-balance formula that virtually all banks use. Small differences can appear from processing fees, disbursement dates or daily-vs-monthly rests.' },
    ],
    keywords: ['emi calculator', 'loan emi', 'home loan calculator', 'monthly installment calculator', 'loan repayment'],
  },
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    icon: '🩺',
    description:
      'Calculate Body Mass Index from height and weight with WHO categories — processed entirely in your browser, never uploaded.',
    lead: 'BMI = weight (kg) ÷ height (m)² — a 70 kg person at 175 cm has a BMI of 22.9.',
    fields: [
      { id: 'height', label: 'Height', type: 'number', suffix: 'cm', placeholder: '175', defaultValue: '175' },
      { id: 'weight', label: 'Weight', type: 'number', suffix: 'kg', placeholder: '70', defaultValue: '70' },
    ],
    computeId: 'bmi',
    formula:
      'BMI = weight in kilograms ÷ (height in meters)². WHO adult ranges: under 18.5 underweight · 18.5–24.9 normal · 25–29.9 overweight · 30+ obesity.',
    example: '70 kg at 175 cm → 70 ÷ 1.75² = 22.9 (normal range).',
    note: 'BMI is a population screening measure, not a diagnosis: it cannot distinguish muscle from fat, so athletes often read "overweight" while lean-mass poor individuals can read "normal". Health data is exactly the kind of input you shouldn’t hand to random web servers — this calculator never transmits yours anywhere.',
    faqs: [
      { q: 'What is a healthy BMI?', a: 'For adults, the WHO defines the normal range as 18.5–24.9. The calculator also shows the weight range that corresponds to normal BMI at your height.' },
      { q: 'Is BMI accurate for athletes?', a: 'Not particularly — muscle is denser than fat, so muscular people often score 25+ while being very lean. Waist measurements and body-fat percentage are better signals in that case.' },
      { q: 'Does the formula differ for imperial units?', a: 'The imperial form is weight (lb) ÷ height (in)² × 703. Convert first with the lbs-to-kg tool if needed; both routes give the same BMI.' },
    ],
    keywords: ['bmi calculator', 'body mass index', 'healthy weight calculator', 'bmi formula'],
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    icon: '🎂',
    description:
      'Calculate exact age in years, months and days from a date of birth — plus total months, weeks and days. Runs entirely in your browser.',
    lead: 'Your exact age is the calendar difference between today and your date of birth — in years, months and days, not just years.',
    fields: [{ id: 'dob', label: 'Date of birth', type: 'date' }],
    computeId: 'age',
    formula:
      'Age counts completed calendar years, then completed months, then leftover days — borrowing from the previous month/year when the day or month hasn’t been reached yet, exactly like official age reckoning.',
    example: 'Born 2000-03-15, checked on 2026-07-04 → 26 years, 3 months, 19 days.',
    note: 'Forms, visa applications and school admissions often want age "as on" a specific date in years-months-days — this is that computation, done locally on your device (a birthdate is personal data; it never leaves your browser here).',
    faqs: [
      { q: 'How is age in years, months and days calculated?', a: 'Subtract calendar components with borrowing: if today’s day-of-month is before your birth day, borrow the previous month’s length; if the month is earlier, borrow a year. The result matches official age-on-date reckoning.' },
      { q: 'How many days old am I?', a: 'The calculator shows total elapsed days (date difference ÷ 86,400 seconds), alongside total completed months and approximate weeks.' },
      { q: 'Does it handle leap-year birthdays?', a: 'Yes — February 29 birthdays age normally; in non-leap years the completed year ticks over on March 1, consistent with most legal conventions.' },
    ],
    keywords: ['age calculator', 'how old am i', 'age in days', 'date of birth calculator', 'age in years months days'],
  },
  {
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    icon: '🧾',
    description:
      'Calculate the tip, total bill and per-person split instantly. Free tip calculator that works offline in your browser.',
    lead: 'Tip = bill × tip% ÷ 100 — an 18% tip on an 85 bill is 15.30, making the total 100.30.',
    fields: [
      { id: 'bill', label: 'Bill amount', type: 'number', placeholder: '85', defaultValue: '85' },
      { id: 'percent', label: 'Tip', type: 'number', suffix: '%', placeholder: '18', defaultValue: '18' },
      { id: 'split', label: 'Split between', type: 'number', suffix: 'people', placeholder: '1', defaultValue: '1', min: 1 },
    ],
    computeId: 'tip',
    formula: 'tip = bill × (tip% ÷ 100); total = bill + tip; per person = total ÷ number of people.',
    example: '85 bill, 18% tip, split by 2 → tip 15.30, total 100.30, per person 50.15.',
    note: 'US customary ranges: 15% baseline, 18–20% for good service, 10% for counter service. Mental shortcut: 10% is the decimal shift, 20% doubles it, and 15% is one-and-a-half times the 10% figure.',
    faqs: [
      { q: 'How much is a 20% tip?', a: 'Move the decimal one place left and double it: on a 64 bill, 10% is 6.40, so 20% is 12.80.' },
      { q: 'Do I tip on the pre-tax or post-tax amount?', a: 'Convention (and most etiquette guides) says pre-tax, though many people simply tip on the total. On a typical 8% tax the difference is about 1.5% of the bill.' },
      { q: 'How do we split an uneven bill fairly?', a: 'Enter the full bill, tip percentage and headcount — the per-person figure includes the tip. For itemized fairness, each person can run their own subtotal through the calculator.' },
    ],
    keywords: ['tip calculator', 'tip split calculator', 'how much to tip', '20 percent tip'],
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    icon: '🏷️',
    description:
      'Calculate the sale price and savings from any discount percentage — with stacked-discount math explained. Runs in your browser.',
    lead: 'Final price = original × (1 − discount% ÷ 100) — 30% off a 2,499 item is 1,749.30.',
    fields: [
      { id: 'price', label: 'Original price', type: 'number', placeholder: '2499', defaultValue: '2499' },
      { id: 'percent', label: 'Discount', type: 'number', suffix: '% off', placeholder: '30', defaultValue: '30' },
    ],
    computeId: 'discount',
    formula: 'savings = price × (discount ÷ 100); final price = price − savings = price × (1 − discount ÷ 100).',
    example: '30% off 2,499 → save 749.70, pay 1,749.30.',
    note: 'Stacked discounts multiply, they don’t add: "30% off + extra 20% off" is 0.70 × 0.80 = 0.56 — a 44% total discount, not 50%. Retailers rely on that gap.',
    faqs: [
      { q: 'How do I calculate 30% off a price?', a: 'Multiply the price by 0.70 (keeping 70%): 30% off 150 = 150 × 0.7 = 105. Or compute the saving (150 × 0.3 = 45) and subtract.' },
      { q: 'Do stacked discounts add up?', a: 'No — they compound on the reduced price. 20% off then another 20% off is 0.8 × 0.8 = 0.64, a 36% total discount, not 40%.' },
      { q: 'How do I find the original price after a discount?', a: 'Divide by the kept fraction: paid 84 after 30% off → 84 ÷ 0.70 = 120 original.' },
    ],
    keywords: ['discount calculator', 'sale price calculator', 'percent off calculator', '30 percent off'],
  },
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    icon: '📊',
    description:
      'Calculate future value, interest earned and growth multiple with yearly, quarterly or monthly compounding — private and instant.',
    lead: 'Future value = P × (1 + r/n)^(n×t) — money grows on its own interest, which is why 8% for 30 years turns 1 into 10.06.',
    fields: [
      { id: 'principal', label: 'Starting amount', type: 'number', placeholder: '100000', defaultValue: '100000' },
      { id: 'rate', label: 'Interest rate (yearly)', type: 'number', suffix: '% p.a.', placeholder: '8', defaultValue: '8', step: 0.1 },
      { id: 'years', label: 'Time', type: 'number', suffix: 'years', placeholder: '10', defaultValue: '10' },
      {
        id: 'freq', label: 'Compounding', type: 'select', defaultValue: '1',
        options: [
          { value: '1', label: 'Yearly' },
          { value: '4', label: 'Quarterly' },
          { value: '12', label: 'Monthly' },
          { value: '365', label: 'Daily' },
        ],
      },
    ],
    computeId: 'compoundInterest',
    formula:
      'FV = P × (1 + r/n)^(n×t), where r is the yearly rate as a decimal, n the compounding periods per year and t the years. More frequent compounding raises the effective yield slightly.',
    example: '100,000 at 8% for 10 years, yearly compounding → 215,892 (interest 115,892).',
    note: 'The rule of 72 gives the doubling time in your head: 72 ÷ rate ≈ years to double. At 8%, money doubles roughly every 9 years — so 10× in 30 years isn’t magic, it’s three doublings plus change.',
    faqs: [
      { q: 'What is the compound interest formula?', a: 'FV = P(1 + r/n)^(nt). For 5,000 at 6% monthly-compounded for 3 years: 5,000 × (1 + 0.06/12)^36 = 5,983.' },
      { q: 'What is the rule of 72?', a: 'Divide 72 by the annual rate to estimate doubling time: at 6%, ~12 years; at 12%, ~6 years. Accurate within a few percent for rates between 4% and 15%.' },
      { q: 'How much difference does compounding frequency make?', a: 'Less than most expect: 8% for 10 years grows 100,000 to 215,892 yearly-compounded vs 222,196 monthly-compounded — about 3% more. Rate and time dominate; frequency fine-tunes.' },
    ],
    keywords: ['compound interest calculator', 'future value calculator', 'rule of 72', 'investment growth calculator'],
  },
  {
    slug: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    icon: '🧮',
    description:
      'Calculate simple interest and total repayment: SI = P × R × T ÷ 100. Free, instant, and computed entirely in your browser.',
    lead: 'Simple interest = principal × rate × time ÷ 100 — interest accrues only on the original amount, never on interest.',
    fields: [
      { id: 'principal', label: 'Principal', type: 'number', placeholder: '50000', defaultValue: '50000' },
      { id: 'rate', label: 'Interest rate (yearly)', type: 'number', suffix: '% p.a.', placeholder: '7', defaultValue: '7', step: 0.1 },
      { id: 'years', label: 'Time', type: 'number', suffix: 'years', placeholder: '3', defaultValue: '3' },
    ],
    computeId: 'simpleInterest',
    formula: 'SI = P × R × T ÷ 100; total = principal + SI. Interest is charged only on the original principal each period.',
    example: '50,000 at 7% for 3 years → interest 10,500; total 60,500.',
    note: 'Simple interest survives in short-term lending, some auto loans, bonds’ coupon math and school syllabi; most savings and mortgages compound instead. Same inputs at 7%/3 years compounded yearly would yield 11,252 — the gap widens fast with time.',
    faqs: [
      { q: 'What is the simple interest formula?', a: 'SI = P × R × T ÷ 100, with rate per year and time in years. 20,000 at 5% for 2 years = 2,000 interest.' },
      { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is charged only on the principal every period; compound interest is charged on principal plus accumulated interest, so it grows faster over time.' },
      { q: 'How do I get the time in months?', a: 'Use fractional years: 9 months = 0.75 years. SI on 10,000 at 8% for 9 months = 10,000 × 8 × 0.75 ÷ 100 = 600.' },
    ],
    keywords: ['simple interest calculator', 'si formula', 'principal rate time', 'interest calculator'],
  },
  {
    slug: 'hourly-to-salary-calculator',
    name: 'Hourly to Salary Calculator',
    icon: '💼',
    description:
      'Convert an hourly wage to weekly, monthly and annual salary (and back) based on your working hours. Private, in-browser.',
    lead: 'Annual salary = hourly rate × hours per week × 52 — 25 an hour at 40 h/week is 52,000 a year.',
    fields: [
      { id: 'rate', label: 'Hourly rate', type: 'number', placeholder: '25', defaultValue: '25', step: 0.5 },
      { id: 'hours', label: 'Hours per week', type: 'number', suffix: 'h', placeholder: '40', defaultValue: '40' },
    ],
    computeId: 'hourlyToSalary',
    formula:
      'weekly = rate × hours; annual = weekly × 52; monthly = annual ÷ 12. The quick two-way approximation at 40 h/week: salary ≈ hourly × 2,080, or hourly ≈ salary ÷ 2,000.',
    example: '25/hour at 40 h/week → 1,000 weekly, 4,333 monthly, 52,000 annually.',
    note: 'The doubling shortcut: at 40 hours/week, annual salary ≈ hourly rate × 2,000 — so 25/hour ≈ 50k and 50/hour ≈ 100k. Gross figures only; taxes, unpaid leave and overtime change take-home pay.',
    faqs: [
      { q: 'How much is 25 dollars an hour annually?', a: 'At 40 hours/week for 52 weeks: 25 × 40 × 52 = 52,000 per year (gross).' },
      { q: 'How do I convert salary back to an hourly rate?', a: 'Divide by 2,080 (52 weeks × 40 hours): a 75,000 salary ≈ 36.06/hour. The ÷2,000 shortcut gives a quick 37.50 estimate.' },
      { q: 'Does this include taxes or overtime?', a: 'No — results are gross pay from rate × hours. Overtime, deductions and unpaid weeks shift real take-home; enter adjusted hours to model them.' },
    ],
    keywords: ['hourly to salary calculator', 'salary calculator', '25 an hour is how much a year', 'wage to salary'],
  },
];

export function getCalc(slug: string): CalcDef | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
