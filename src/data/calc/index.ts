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
      { id: 'annual', label: 'Or reverse: annual salary → hourly', type: 'number', placeholder: '75000', defaultValue: '' },
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

  // ---------- health & fitness ----------
  {
    slug: 'tdee-calculator',
    name: 'TDEE & Calorie Calculator',
    icon: '🍎',
    description:
      'Calculate your TDEE (total daily energy expenditure) and BMR, plus calorie targets for weight loss, maintenance and gain — Mifflin–St Jeor equation, in your browser.',
    lead: 'Your TDEE is BMR × an activity factor — the calories you burn in a day. Below it you lose weight, above it you gain.',
    fields: [
      { id: 'units', label: 'Units', type: 'select', defaultValue: 'metric', options: [{ value: 'metric', label: 'Metric (kg, cm)' }, { value: 'imperial', label: 'Imperial (lb, in)' }] },
      { id: 'sex', label: 'Sex', type: 'select', defaultValue: 'male', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
      { id: 'age', label: 'Age', type: 'number', suffix: 'yr', placeholder: '30', defaultValue: '30' },
      { id: 'height', label: 'Height', type: 'number', suffix: 'cm/in', placeholder: '175', defaultValue: '175' },
      { id: 'weight', label: 'Weight', type: 'number', suffix: 'kg/lb', placeholder: '75', defaultValue: '75' },
      { id: 'activity', label: 'Activity level', type: 'select', defaultValue: 'moderate', options: [
        { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
        { value: 'light', label: 'Light (1–3 days/week)' },
        { value: 'moderate', label: 'Moderate (3–5 days/week)' },
        { value: 'active', label: 'Active (6–7 days/week)' },
        { value: 'veryactive', label: 'Very active (hard daily/physical job)' },
      ] },
    ],
    computeId: 'tdee',
    formula:
      'BMR (Mifflin–St Jeor) = 10×kg + 6.25×cm − 5×age + 5 (men) or − 161 (women). TDEE = BMR × activity factor (1.2 sedentary … 1.9 very active). A ~500 kcal daily deficit ≈ 0.5 kg/week of fat loss.',
    example: 'A 30-year-old man, 175 cm, 75 kg, moderately active: BMR ≈ 1,674, TDEE ≈ 2,595 kcal/day.',
    note: 'These are estimates — the Mifflin–St Jeor equation is the most accurate general population formula, but individual metabolism varies ±10%. Use the TDEE as a starting point, track your weight for 2–3 weeks, and adjust calories by ~100–200 if the trend isn\'t what you want. Not medical advice.',
    faqs: [
      { q: 'What is the difference between BMR and TDEE?', a: 'BMR (basal metabolic rate) is the calories your body burns at complete rest — just keeping you alive. TDEE (total daily energy expenditure) is BMR multiplied by an activity factor, so it includes movement, exercise and digestion. TDEE is the number that matters for setting calorie goals.' },
      { q: 'How many calories should I eat to lose weight?', a: 'Eat below your TDEE. A deficit of about 500 kcal/day yields roughly 0.5 kg (1 lb) of fat loss per week — a sustainable rate. The calculator shows targets for mild loss, standard loss, maintenance and gain.' },
      { q: 'Which formula does this use?', a: 'Mifflin–St Jeor, the equation research finds most accurate for the general population — more reliable than the older Harris–Benedict formula.' },
      { q: 'How accurate is a TDEE estimate?', a: 'It\'s a good starting point, typically within ~10% for most people. Metabolism, body composition and activity vary, so treat it as an estimate: track your weight for a few weeks and fine-tune.' },
      { q: 'What activity level should I pick?', a: 'Be honest and slightly conservative — most people overestimate. "Moderate" means genuine exercise 3–5 days a week; a desk job with occasional walks is closer to "light" or "sedentary".' },
    ],
    keywords: ['tdee calculator', 'calorie calculator', 'bmr calculator', 'maintenance calories', 'how many calories to lose weight', 'mifflin st jeor'],
  },
  {
    slug: 'body-fat-calculator',
    name: 'Body Fat Percentage Calculator',
    icon: '📏',
    description:
      'Estimate body fat percentage with the U.S. Navy circumference method — tape measurements only, no calipers. Runs in your browser.',
    lead: 'The U.S. Navy method estimates body fat from a few tape measurements — neck, waist (and hip for women) plus height.',
    fields: [
      { id: 'units', label: 'Units', type: 'select', defaultValue: 'metric', options: [{ value: 'metric', label: 'Metric (cm)' }, { value: 'imperial', label: 'Imperial (in)' }] },
      { id: 'sex', label: 'Sex', type: 'select', defaultValue: 'male', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
      { id: 'height', label: 'Height', type: 'number', suffix: 'cm/in', placeholder: '175', defaultValue: '175' },
      { id: 'neck', label: 'Neck circumference', type: 'number', suffix: 'cm/in', placeholder: '38', defaultValue: '38' },
      { id: 'waist', label: 'Waist circumference', type: 'number', suffix: 'cm/in', placeholder: '85', defaultValue: '85' },
      { id: 'hip', label: 'Hip circumference (women only)', type: 'number', suffix: 'cm/in', placeholder: '95', defaultValue: '95' },
    ],
    computeId: 'bodyFat',
    formula:
      'U.S. Navy method (log₁₀, measurements in cm). Men: 495 ÷ (1.0324 − 0.19077·log(waist − neck) + 0.15456·log(height)) − 450. Women add the hip and use different constants. Measure the waist at the navel and the neck below the larynx.',
    example: 'A man 175 cm tall with a 38 cm neck and 85 cm waist estimates at roughly 18% body fat.',
    note: 'The tape method is convenient but approximate — expect ±3–4% versus a DEXA scan, and it can mis-estimate very lean or very heavy builds. Measure relaxed (don\'t suck in), snug but not compressing, and take each measurement twice. General fitness categories: for men, ~6–13% athletic, 14–17% fitness, 18–24% average; women run ~8% higher. Not medical advice.',
    faqs: [
      { q: 'How does the U.S. Navy body fat method work?', a: 'It estimates body fat from body-circumference measurements — neck and waist for men, plus hips for women — together with height, using a formula the U.S. Navy validated against more precise methods. No calipers or scales needed, just a tape measure.' },
      { q: 'How accurate is the tape-measure method?', a: 'Reasonably, for tracking trends: typically within 3–4 percentage points of a DEXA scan. It\'s less accurate at the extremes (very lean or very high body fat). Consistency matters more than absolute accuracy — measure the same way each time.' },
      { q: 'Where exactly do I measure?', a: 'Neck: just below the larynx, tape sloping slightly down at the front. Waist: at the navel for men, at the narrowest point for women. Hips (women): at the widest point. Stand relaxed and breathe normally — don\'t suck in.' },
      { q: 'What is a healthy body fat percentage?', a: 'Rough guides: men 10–20% and women 18–28% are commonly considered healthy, with athletes lower. Essential fat (the minimum) is about 3–5% for men and 10–13% for women. These are general ranges, not medical thresholds.' },
    ],
    keywords: ['body fat calculator', 'body fat percentage', 'navy body fat calculator', 'how to measure body fat', 'body fat tape measure'],
  },
  {
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    icon: '⚖️',
    description:
      'Estimate ideal body weight by four classic formulas (Devine, Robinson, Miller, Hamwi) plus the healthy BMI range for your height. In your browser.',
    lead: 'There is no single "ideal" weight — this shows four established formulas and the healthy BMI range, so you get a sensible band rather than one number.',
    fields: [
      { id: 'units', label: 'Units', type: 'select', defaultValue: 'metric', options: [{ value: 'metric', label: 'Metric (cm, kg)' }, { value: 'imperial', label: 'Imperial (in, lb)' }] },
      { id: 'sex', label: 'Sex', type: 'select', defaultValue: 'male', options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }] },
      { id: 'height', label: 'Height', type: 'number', suffix: 'cm/in', placeholder: '175', defaultValue: '175' },
    ],
    computeId: 'idealWeight',
    formula:
      'The classic formulas take a base weight at 5 ft (60 in) plus a per-inch increment: Devine (men 50 kg + 2.3 kg/in), Robinson, Miller and Hamwi use slightly different constants. The healthy BMI range is 18.5–24.9 × height² (metres).',
    example: 'A man 175 cm (69 in) tall: Devine ≈ 70.7 kg; healthy BMI range ≈ 56.7–76.3 kg.',
    note: 'These formulas date from the 1960s–80s and were built for medication dosing and insurance tables, not as health targets — they ignore muscle, frame size and body composition entirely (a muscular athlete can be "overweight" by every one). The healthy BMI range is usually the more useful guide, and even that is a population tool, not a diagnosis. Not medical advice.',
    faqs: [
      { q: 'Is there one correct ideal weight?', a: 'No. The four formulas here give slightly different numbers, and none accounts for muscle mass or frame size. Treat the results as a rough band, and lean on the healthy BMI range — 18.5 to 24.9 — as the more practical target.' },
      { q: 'What is the Devine formula?', a: 'The most widely used: for men, 50 kg + 2.3 kg for each inch over 5 feet; for women, 45.5 kg + 2.3 kg/inch. It was created in 1974 for calculating drug dosages and remains the clinical standard for that.' },
      { q: 'Why do the formulas disagree?', a: 'They were derived from different datasets and eras (Hamwi 1964, Devine 1974, Robinson and Miller 1983), each fitting a slightly different curve. The spread between them is the honest margin of uncertainty in any single "ideal weight" number.' },
      { q: 'Should I use ideal weight or BMI?', a: 'For most people the healthy BMI range is more useful because it gives a range and adapts to height directly. Ideal-weight formulas are handy for a quick single figure and for medical dosing, but neither replaces a body-composition assessment.' },
    ],
    keywords: ['ideal weight calculator', 'ideal body weight', 'devine formula', 'healthy weight for height', 'how much should i weigh'],
  },
  {
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    icon: '🥗',
    description:
      'Split a daily calorie target into protein, carb and fat grams by diet style (balanced, low-carb, high-protein, keto). Instant, in your browser.',
    lead: 'Macros come from your calorie target and a percentage split — protein and carbs are 4 kcal/gram, fat is 9.',
    fields: [
      { id: 'calories', label: 'Daily calories', type: 'number', suffix: 'kcal', placeholder: '2000', defaultValue: '2000' },
      { id: 'split', label: 'Diet style', type: 'select', defaultValue: 'balanced', options: [
        { value: 'balanced', label: 'Balanced (30 / 40 / 30)' },
        { value: 'lowcarb', label: 'Low-carb (40 / 20 / 40)' },
        { value: 'highprotein', label: 'High-protein (40 / 35 / 25)' },
        { value: 'keto', label: 'Keto (25 / 5 / 70)' },
      ] },
    ],
    computeId: 'macro',
    formula:
      'Grams = (calories × percentage) ÷ kcal-per-gram. Protein and carbohydrate provide 4 kcal/g; fat provides 9 kcal/g. Pair this with the TDEE calculator to set the calorie number first.',
    example: '2,000 kcal on a balanced 30/40/30 split → 150 g protein, 200 g carbs, 67 g fat.',
    note: 'Set your calorie target first (the TDEE calculator does that), then choose a split. A common evidence-based approach: anchor protein around 1.6–2.2 g per kg of bodyweight for muscle retention, then divide the rest between carbs and fat by preference. The "best" split is largely the one you\'ll actually stick to. Not medical or dietary advice.',
    faqs: [
      { q: 'How do I calculate my macros?', a: 'Start from a daily calorie target, then split it by percentage into protein, carbs and fat. Convert each to grams: divide protein and carb calories by 4, and fat calories by 9 (their energy densities). This tool does it for four common splits.' },
      { q: 'What is a good macro split?', a: 'A balanced 30/40/30 (protein/carb/fat) works for most people. Prioritise adequate protein — around 1.6–2.2 g/kg bodyweight — for muscle; distribute the rest by preference and performance. Low-carb, high-protein and keto splits suit different goals and tastes.' },
      { q: 'Why is fat 9 calories per gram?', a: 'Fat is more energy-dense than protein or carbohydrate, which each provide 4 kcal per gram. That\'s why the same calorie target yields far fewer grams of fat than of carbs — it\'s not a smaller portion by energy, just by weight.' },
      { q: 'Do I need to hit my macros exactly?', a: 'No — think of them as targets, not rules. Hitting your protein goal and staying near your calorie total matters most; the carb/fat split has more flexibility. Consistency over days beats precision at every meal.' },
    ],
    keywords: ['macro calculator', 'macronutrient calculator', 'protein carbs fat calculator', 'iifym calculator', 'keto macro calculator'],
  },
  {
    slug: 'due-date-calculator',
    name: 'Pregnancy Due Date Calculator',
    icon: '🤰',
    description:
      'Estimate your due date from your last menstrual period using Naegele\'s rule, with current gestational age and trimester. Private — the date never leaves your browser.',
    lead: 'The classic estimate adds 280 days (40 weeks) to the first day of your last period — adjusted for your cycle length.',
    fields: [
      { id: 'lmp', label: 'First day of last period', type: 'date', defaultValue: '' },
      { id: 'cycle', label: 'Average cycle length', type: 'number', suffix: 'days', placeholder: '28', defaultValue: '28' },
    ],
    computeId: 'dueDate',
    formula:
      'Naegele\'s rule: due date = first day of last menstrual period + 280 days (40 weeks). For cycles other than 28 days, add or subtract the difference (a 30-day cycle adds 2 days). Gestational age is counted from that first day, so "weeks pregnant" starts about two weeks before conception.',
    example: 'Last period starting Jan 1 with a 28-day cycle gives a due date of about October 8.',
    note: 'This is an estimate — only about 4% of babies arrive exactly on the due date, and a full-term birth is anything from 37 to 42 weeks. An early-pregnancy ultrasound gives a more accurate date and takes precedence over the LMP calculation. This tool is informational, not medical advice — and because it runs entirely in your browser, the date you enter is never uploaded anywhere.',
    faqs: [
      { q: 'How is a due date calculated?', a: 'By Naegele\'s rule: add 280 days (40 weeks) to the first day of your last menstrual period. Gestational age is measured from that day, which is why you\'re counted as "2 weeks pregnant" around conception — the clock starts before the egg is fertilised.' },
      { q: 'How accurate is a due date?', a: 'It\'s an estimate. Only around 4% of births land on the exact due date; most happen within a week either side, and 37–42 weeks is all considered full term. A first-trimester ultrasound dates the pregnancy more precisely and is used in preference to the last-period calculation when they differ.' },
      { q: 'What if my cycle isn\'t 28 days?', a: 'The tool adjusts: a longer cycle pushes the due date later and a shorter one earlier, because ovulation (and so conception) shifts. Enter your average cycle length for a better estimate.' },
      { q: 'Is the date I enter kept private?', a: 'Yes — the calculation runs entirely in your browser and the page works offline. Nothing you type is sent to any server, which for something this personal is the point.' },
    ],
    keywords: ['due date calculator', 'pregnancy due date', 'when is my baby due', 'gestational age calculator', 'naegele rule'],
  },

  // ---------- finance depth ----------
  {
    slug: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    icon: '🏠',
    description:
      'Calculate your monthly mortgage payment and see the full amortization schedule — how each payment splits between principal and interest — with CSV export. In your browser.',
    lead: 'Your monthly payment is fixed, but early payments are mostly interest — the amortization schedule shows exactly how that shifts over the life of the loan.',
    fields: [],
    computeId: 'mortgage',
    widget: 'mortgage',
    formula:
      'Monthly payment M = P × r(1+r)ⁿ ÷ ((1+r)ⁿ − 1), where P is the principal, r the monthly interest rate (annual ÷ 12) and n the number of monthly payments. Each month, interest = balance × r and the rest of the payment reduces the principal.',
    example: 'A 300,000 loan at 6% over 30 years costs about 1,799/month, with roughly 347,500 in total interest.',
    note: 'The eye-opening part is the amortization schedule: on a 30-year loan, the first payment can be ~75% interest and only ~25% principal, flipping over the years. That\'s why a single extra payment early on saves disproportionate interest, and why the "total interest" figure often rivals the loan itself. This tool covers principal and interest only — property tax, insurance and HOA fees are separate.',
    faqs: [
      { q: 'How is a mortgage payment calculated?', a: 'With the standard amortizing-loan formula: the monthly payment is the principal times the monthly rate times (1+rate)^months, divided by ((1+rate)^months − 1). It\'s set so the loan reaches exactly zero after the final payment, keeping the payment constant throughout.' },
      { q: 'Why are early mortgage payments mostly interest?', a: 'Because interest each month is charged on the remaining balance, which is highest at the start. Early on, most of your fixed payment goes to interest and little to principal; as the balance falls, the split gradually reverses. The amortization schedule shows this month by month.' },
      { q: 'How much does an extra payment save?', a: 'A lot, especially early — because it removes principal that would otherwise accrue interest for decades. Even one extra payment in year one can shave months off the term and thousands in interest. Try it against the schedule to see the effect.' },
      { q: 'Does this include taxes and insurance?', a: 'No — it calculates principal and interest (P&I) only. Your actual monthly housing cost also includes property tax, homeowners insurance and sometimes HOA or PMI, which lenders bundle into an escrow payment.' },
      { q: 'Can I export the schedule?', a: 'Yes — download the full amortization table as a CSV to open in a spreadsheet. Everything is computed in your browser, so your loan figures never leave your device.' },
    ],
    keywords: ['mortgage calculator', 'monthly mortgage payment', 'amortization schedule', 'home loan calculator', 'mortgage amortization', 'mortgage payment breakdown'],
  },
  {
    slug: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    icon: '🚗',
    description:
      'Calculate your car loan monthly payment, factoring in down payment, trade-in and sales tax. Free, private, in your browser.',
    lead: 'The monthly payment is based on the amount you actually finance — the price plus tax, minus your down payment and trade-in.',
    fields: [
      { id: 'price', label: 'Vehicle price', type: 'number', placeholder: '30000', defaultValue: '30000' },
      { id: 'down', label: 'Down payment', type: 'number', placeholder: '5000', defaultValue: '5000' },
      { id: 'tradein', label: 'Trade-in value', type: 'number', placeholder: '0', defaultValue: '0' },
      { id: 'taxrate', label: 'Sales tax', type: 'number', suffix: '%', placeholder: '7', defaultValue: '7', step: 0.1 },
      { id: 'rate', label: 'Interest rate (APR)', type: 'number', suffix: '%', placeholder: '6.5', defaultValue: '6.5', step: 0.1 },
      { id: 'months', label: 'Loan term', type: 'number', suffix: 'months', placeholder: '60', defaultValue: '60' },
    ],
    computeId: 'autoLoan',
    formula:
      'Amount financed = price + sales tax − down payment − trade-in. Monthly payment uses the standard loan formula on that amount at the APR ÷ 12 monthly rate over the term. In many places sales tax applies to the price after the trade-in is deducted.',
    example: 'A 30,000 car with 5,000 down, 7% tax and 6.5% APR over 60 months is about 483/month.',
    note: 'Two things inflate the true cost: a long term (72–84 months) lowers the monthly payment but piles on interest and risks owing more than the car is worth, and dealer add-ons rolled into the loan quietly grow the financed amount. The APR — not the "interest rate" — is what to compare between offers, since it includes fees.',
    faqs: [
      { q: 'How is a car loan payment calculated?', a: 'First find the amount financed: vehicle price plus sales tax, minus your down payment and any trade-in. Then apply the standard loan formula at the monthly interest rate (APR ÷ 12) over the number of months. The result is your fixed monthly payment.' },
      { q: 'Does a trade-in reduce sales tax?', a: 'In many U.S. states, yes — sales tax is charged on the price after the trade-in value is subtracted, which lowers your tax. This calculator applies tax to the post-trade-in price. Rules vary by state, so confirm locally.' },
      { q: 'Is a longer loan term cheaper?', a: 'Only per month, not overall. Stretching to 72 or 84 months shrinks the payment but increases total interest and keeps you "underwater" (owing more than the car is worth) for longer. A larger down payment and a shorter term cost less in the end.' },
      { q: 'What is APR versus interest rate?', a: 'The APR includes certain loan fees on top of the base interest rate, so it reflects the true annual cost better. When comparing financing offers, compare APRs — a low headline rate with high fees can be worse than a higher rate with none.' },
    ],
    keywords: ['auto loan calculator', 'car loan calculator', 'car payment calculator', 'car loan with trade in', 'monthly car payment'],
  },
  {
    slug: 'markup-margin-calculator',
    name: 'Markup & Margin Calculator',
    icon: '🏷️',
    description:
      'Convert between cost, price, markup and profit margin — and see why the two percentages differ. Free, instant, in your browser.',
    lead: 'Markup is profit as a percentage of cost; margin is the same profit as a percentage of price — so they are never equal.',
    fields: [
      { id: 'cost', label: 'Cost (what you pay)', type: 'number', placeholder: '60', defaultValue: '60' },
      { id: 'price', label: 'Selling price', type: 'number', placeholder: '100', defaultValue: '100' },
    ],
    computeId: 'markupMargin',
    formula:
      'Profit = price − cost. Markup % = profit ÷ cost × 100 (based on what you paid). Margin % = profit ÷ price × 100 (based on what you charge). Because price is larger than cost, margin is always the smaller percentage.',
    example: 'Cost 60, price 100 → 40 profit, 66.7% markup, 40% margin.',
    note: 'Confusing the two is a classic profit-killer: a "50% markup" is only a 33% margin, so pricing for a target margin using the markup number leaves you short. To hit a margin, price = cost ÷ (1 − margin); for a 40% margin on a 60 cost, price = 60 ÷ 0.6 = 100. Markup is convenient at the till; margin is what your accounts actually report.',
    faqs: [
      { q: 'What is the difference between markup and margin?', a: 'Both measure the same profit, against different bases. Markup is profit as a percentage of cost (what you paid); margin is profit as a percentage of the selling price (what you charge). Since the price is higher than the cost, the margin percentage is always lower than the markup.' },
      { q: 'How do I convert markup to margin?', a: 'Margin = markup ÷ (1 + markup). A 50% markup is a 33.3% margin; a 100% markup (doubling the price) is a 50% margin. The reverse: markup = margin ÷ (1 − margin).' },
      { q: 'How do I price for a target margin?', a: 'Divide the cost by (1 − target margin). For a 40% margin on a $60 item: 60 ÷ (1 − 0.40) = 60 ÷ 0.60 = $100. Pricing off the markup number instead would undershoot your intended margin.' },
      { q: 'Which should I use — markup or margin?', a: 'Retailers often think in markup because it\'s applied directly to cost. But margin is what appears in financial statements and what investors compare, so know both — and never assume a markup figure equals the margin.' },
    ],
    keywords: ['markup calculator', 'margin calculator', 'profit margin calculator', 'markup vs margin', 'markup to margin', 'gross margin calculator'],
  },
  {
    slug: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    icon: '🧾',
    description:
      'Add sales tax or VAT to a price, or work backwards to the pre-tax amount, at any rate. Free, private, in your browser.',
    lead: 'Enter a rate that fits where you are — sales tax and VAT both work the same way: amount × rate, added on top.',
    fields: [
      { id: 'amount', label: 'Amount', type: 'number', placeholder: '100', defaultValue: '100' },
      { id: 'rate', label: 'Tax / VAT rate', type: 'number', suffix: '%', placeholder: '8', defaultValue: '8', step: 0.1 },
    ],
    computeId: 'salesTax',
    formula:
      'Tax = amount × rate ÷ 100; total = amount + tax. To reverse a tax-inclusive price to its pre-tax value: pre-tax = total ÷ (1 + rate ÷ 100). Enter whatever rate applies to you — the calculator is rate-agnostic, so it works for any state, country or VAT band.',
    example: '100 at 8% → 8 tax, 108 total. Reversed: 108 including 8% tax comes from a 100 pre-tax price.',
    note: 'Because you type the rate, this works for U.S. state and local sales tax, UK/EU VAT (20%, 5%, etc.), GST and any other percentage tax. The reverse figure is the useful one for receipts and invoices — it recovers the net price from a gross, tax-inclusive total. We deliberately don\'t hard-code rates, since they change and vary by location; use your current local rate.',
    faqs: [
      { q: 'How do I add sales tax to a price?', a: 'Multiply the price by the tax rate as a decimal, then add it: $100 at 8% is 100 × 0.08 = $8 tax, for a $108 total. This calculator shows the tax and total instantly for any rate you enter.' },
      { q: 'How do I find the pre-tax price from a total?', a: 'Divide the tax-inclusive total by (1 + rate). A $108 total that includes 8% tax came from 108 ÷ 1.08 = $100 pre-tax. The calculator shows this reverse figure automatically — handy for invoices and expense reports.' },
      { q: 'Does this work for VAT and GST too?', a: 'Yes — VAT, GST and sales tax are all percentage taxes that work the same arithmetic way. Just enter the applicable rate (20% UK standard VAT, 5% reduced, etc.). The tool doesn\'t assume any jurisdiction.' },
      { q: 'Why don\'t you fill in my local tax rate automatically?', a: 'Because rates change and vary widely by state, city and country — a hard-coded rate would quickly be wrong for someone. Entering your own current rate keeps the answer accurate wherever you are.' },
    ],
    keywords: ['sales tax calculator', 'vat calculator', 'reverse sales tax calculator', 'add tax to price', 'gst calculator', 'tax inclusive price'],
  },
  {
    slug: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    icon: '⛽',
    description:
      'Estimate the fuel cost of a trip from distance, fuel economy and price — supports MPG (US/UK), L/100km and km/L. Free, in your browser.',
    lead: 'Trip fuel cost is simply the fuel your journey uses times the price per unit — the only trick is matching your economy units.',
    fields: [
      { id: 'distance', label: 'Distance', type: 'number', suffix: 'mi/km', placeholder: '300', defaultValue: '300' },
      { id: 'efficiency', label: 'Fuel economy', type: 'number', placeholder: '30', defaultValue: '30' },
      { id: 'units', label: 'Economy units', type: 'select', defaultValue: 'mpg-us', options: [
        { value: 'mpg-us', label: 'MPG (US gallons)' },
        { value: 'mpg-uk', label: 'MPG (imperial gallons)' },
        { value: 'l100km', label: 'L/100 km' },
        { value: 'kmpl', label: 'km per litre' },
      ] },
      { id: 'price', label: 'Fuel price (per gallon/litre)', type: 'number', placeholder: '3.50', defaultValue: '3.50', step: 0.01 },
    ],
    computeId: 'fuelCost',
    formula:
      'Fuel used = distance ÷ economy (or distance × economy ÷ 100 for L/100 km); cost = fuel used × price per unit. Keep distance and economy in the same system — miles with MPG, kilometres with L/100 km or km/L.',
    example: 'A 300-mile trip at 30 MPG with fuel at 3.50/gallon uses 10 gallons and costs about 35.',
    note: 'Real-world economy runs below the sticker figure — city driving, cold starts, roof racks, heavy loads and highway speeds above ~60 mph all cut it, often 10–20%. For a trip budget, use your car\'s actual observed economy (fill-to-fill) rather than the rated number, and add a little headroom. Choose the units your dashboard and pump use to avoid a MPG/L-per-100 km mix-up.',
    faqs: [
      { q: 'How do I calculate the fuel cost of a trip?', a: 'Work out the fuel your trip needs, then multiply by the price. For MPG: fuel = distance ÷ MPG; for L/100 km: fuel = distance × (L/100 km) ÷ 100. A 300-mile trip at 30 MPG uses 10 gallons — times the pump price gives the cost.' },
      { q: 'What\'s the difference between US and UK MPG?', a: 'The gallon. A US gallon is 3.785 litres and an imperial (UK) gallon is 4.546 litres — about 20% larger — so the same car reads a higher MPG in UK figures. Pick the right one, or your estimate will be off by a fifth.' },
      { q: 'How do I convert L/100 km to MPG?', a: 'They\'re inverse measures: MPG (US) ≈ 235.2 ÷ (L/100 km). So 8 L/100 km ≈ 29 MPG. This calculator lets you just pick your unit instead of converting by hand.' },
      { q: 'Why is my real fuel economy worse than the rating?', a: 'Official figures come from controlled tests. Real driving adds cold starts, city stop-go, high speeds, air conditioning, cargo and terrain — commonly cutting economy 10–20%. Use your own fill-to-fill average for trip budgeting.' },
    ],
    keywords: ['fuel cost calculator', 'gas cost calculator', 'trip fuel cost', 'petrol cost calculator', 'mpg cost calculator', 'fuel economy cost'],
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    icon: '🎓',
    description:
      'Calculate your GPA from course grades and credit hours on a 4.0 scale, and work out the grade you need on a final. Add as many courses as you like — in your browser.',
    lead: 'Your GPA is a credit-weighted average of grade points — a heavier course counts more, which is why credits matter as much as grades.',
    fields: [],
    computeId: 'gpa',
    widget: 'gpa',
    formula:
      'GPA = Σ(grade points × credit hours) ÷ Σ(credit hours), on the standard 4.0 scale (A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0, with ± variations). Because it\'s weighted by credits, a 4-credit A pulls your GPA up more than a 1-credit A.',
    example: 'An A (4.0) in a 3-credit class and a B (3.0) in a 4-credit class gives (12 + 12) ÷ 7 = 3.43.',
    note: 'Two things trip people up. First, weighting: a top grade in a small class moves your GPA less than a middling grade in a big one — plan effort by credits, not just by course. Second, recovery math: once you have many credits banked, a single bad grade barely moves the average, but so does a single great one — which is why the final-grade-needed tool is useful for setting a realistic target. Scales vary by institution (some use A+ = 4.3); this uses the common 4.0 scale.',
    faqs: [
      { q: 'How is GPA calculated?', a: 'Multiply each course\'s grade points (A = 4.0, B = 3.0, and so on) by its credit hours, add those up, and divide by the total credit hours. It\'s a weighted average, so courses worth more credits influence the GPA more.' },
      { q: 'What grade do I need on my final?', a: 'It depends on your current grade in the class and the final\'s weight. The needed score = (target − current × (1 − weight)) ÷ weight. This calculator has a mode that does it for you — enter your current grade, the target and the final\'s weight.' },
      { q: 'What are grade points on a 4.0 scale?', a: 'A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D = 1.0, F = 0.0. Some schools use a plain scale without pluses and minuses, and a few cap A+ at 4.3 — check your institution\'s scale.' },
      { q: 'Does a bad grade ruin my GPA?', a: 'Less than you\'d fear once you have credits banked — a single grade is diluted by all the others. Early on, each grade carries more weight. The math cuts both ways, which is why steady solid grades beat one perfect term followed by a slump.' },
    ],
    keywords: ['gpa calculator', 'college gpa calculator', 'grade point average', 'final grade calculator', 'what grade do i need on my final', 'weighted gpa'],
  },
  {
    slug: 'test-grade-calculator',
    name: 'Test Grade Calculator (EZ Grader)',
    icon: '💯',
    description: 'Turn the number of correct answers into a percentage score and letter grade instantly — a fast EZ-grader for teachers and students. Runs in your browser.',
    lead: 'Score = correct ÷ total × 100. Enter how many were right out of the total and get the percentage, the letter grade and how many were missed.',
    fields: [
      { id: 'correct', label: 'Correct answers', type: 'number', placeholder: '45', defaultValue: '45', min: 0 },
      { id: 'total', label: 'Total questions', type: 'number', placeholder: '50', defaultValue: '50', min: 1 },
    ],
    computeId: 'testGrade',
    formula: 'Percentage = (correct ÷ total) × 100. The letter grade maps the percentage onto the common US scale (A 93–100, A− 90–92, B+ 87–89, … , D 60–69, F below 60).',
    example: '45 correct out of 50 → 45 ÷ 50 × 100 = 90%, an A−, with 5 missed.',
    note: 'The letter-grade bands here are the widely used US convention, but scales vary by school, country and course — some use straight A/B/C without pluses and minuses, and cut-offs differ. Use the percentage as the reliable figure and apply your own institution\'s letter bands.',
    faqs: [
      { q: 'How do I calculate a test grade?', a: 'Divide the number of correct answers by the total number of questions and multiply by 100. 45 out of 50 is 45 ÷ 50 × 100 = 90%.' },
      { q: 'What percentage is a passing grade?', a: 'Commonly 60% (a D) is the minimum passing grade on the US scale, though many courses and countries set the pass mark higher — 50%, 65% or 70%. Check your syllabus; this tool shows the percentage so you can apply any threshold.' },
      { q: 'How many can I get wrong and still get an A?', a: 'You need 90% for an A−, so on a 50-question test you can miss 5 (45/50 = 90%). On a 20-question test you can miss 2 (18/20 = 90%). The tool shows your percentage as you change the numbers.' },
      { q: 'What letter grade is 75%?', a: 'On the standard US scale, 75% is a C (73–76%). 77% would be a C+ and 70% a C−. Bands vary by school, so treat this as the common convention.' },
      { q: 'Is this the same as a GPA?', a: 'No — this converts one test\'s correct answers to a percentage and letter. A GPA averages letter grades across courses on a 4.0 scale; use the GPA calculator for that.' },
    ],
    keywords: ['test grade calculator', 'ez grader', 'grade calculator', 'grade percentage calculator', 'score calculator', 'points to grade', 'exam grade calculator'],
  },
  {
    slug: 'unit-price-calculator',
    name: 'Unit Price Calculator (Price Per Unit)',
    icon: '🏷️',
    description: 'Compare two package sizes by price per unit to find the better value — enter each price and quantity and see which is cheaper and by how much. In your browser.',
    lead: 'Unit price = price ÷ quantity. Enter two options and the calculator shows the cost per unit of each and which is the better buy.',
    fields: [
      { id: 'priceA', label: 'Item A — price', type: 'number', placeholder: '3.00', defaultValue: '3', min: 0 },
      { id: 'qtyA', label: 'Item A — quantity/size', type: 'number', placeholder: '12', defaultValue: '12', min: 0 },
      { id: 'priceB', label: 'Item B — price (optional)', type: 'number', placeholder: '5.00', defaultValue: '5', min: 0 },
      { id: 'qtyB', label: 'Item B — quantity/size', type: 'number', placeholder: '24', defaultValue: '24', min: 0 },
    ],
    computeId: 'unitPrice',
    formula: 'Unit price = price ÷ quantity. Compare the two unit prices; the lower one is the better value, and the percentage difference shows by how much.',
    example: '$3 for 12 = $0.25 each; $5 for 24 ≈ $0.208 each → the 24-pack is about 17% cheaper per unit.',
    note: 'Use the same unit for both quantities (both in ounces, both in count, both in millilitres) so the comparison is fair. The bigger package is usually — but not always — the better unit price; this is the quick way to catch the exceptions on the shelf.',
    faqs: [
      { q: 'How do I calculate price per unit?', a: 'Divide the price by the quantity: a $3 pack of 12 is 3 ÷ 12 = $0.25 per unit. Comparing price per unit is how you tell which package size is the real bargain.' },
      { q: 'Is the bigger size always cheaper per unit?', a: 'Usually, but not always — retailers sometimes price the larger pack at a higher unit cost, especially on promotions of the smaller size. That\'s exactly why comparing the unit price matters.' },
      { q: 'What units should I use?', a: 'Whatever is on the label, as long as both items use the same one — count, ounces, grams, litres. If one is in ounces and the other in grams, convert first so you\'re comparing like with like.' },
      { q: 'How do I compare price per 100 g?', a: 'Enter the price and the weight in grams, and the unit price is per gram; multiply by 100 for per-100 g. Keeping both items in grams lets you compare directly.' },
      { q: 'Does a lower unit price always mean buy it?', a: 'Only if you\'ll use it before it spoils and can afford the upfront cost. Unit price finds the cheapest per unit; whether the bigger pack is worth it also depends on waste and cash flow.' },
    ],
    keywords: ['unit price calculator', 'price per unit calculator', 'cost per unit', 'price per ounce calculator', 'unit price comparison', 'better value calculator', 'price per 100g'],
  },
  {
    slug: 'overtime-pay-calculator',
    name: 'Overtime Pay Calculator',
    icon: '⏰',
    description: 'Calculate total pay from regular and overtime hours at a time-and-a-half (or custom) rate — regular pay, overtime pay and the total. In your browser.',
    lead: 'Overtime pay = hourly rate × multiplier × overtime hours. Enter your rate and hours to get regular pay, overtime pay and the total.',
    fields: [
      { id: 'rate', label: 'Hourly rate', type: 'number', placeholder: '20', defaultValue: '20', min: 0 },
      { id: 'regHours', label: 'Regular hours', type: 'number', placeholder: '40', defaultValue: '40', min: 0 },
      { id: 'otHours', label: 'Overtime hours', type: 'number', placeholder: '10', defaultValue: '10', min: 0 },
      { id: 'multiplier', label: 'Overtime multiplier', type: 'number', suffix: '×', placeholder: '1.5', defaultValue: '1.5', min: 1, step: 0.5 },
    ],
    computeId: 'overtimePay',
    formula: 'Regular pay = rate × regular hours. Overtime pay = rate × multiplier × overtime hours (multiplier 1.5 for the common "time and a half"). Total = regular + overtime.',
    example: '$20/h, 40 regular + 10 overtime at 1.5× → 800 + (20 × 1.5 × 10) = 800 + 300 = $1,100.',
    note: 'US federal law (FLSA) requires at least 1.5× the regular rate for hours over 40 in a workweek for non-exempt employees; some states or contracts add daily overtime or double time (2×) — set the multiplier to match your rules. This estimates gross pay before taxes and deductions.',
    faqs: [
      { q: 'How do I calculate overtime pay?', a: 'Multiply your hourly rate by the overtime multiplier (usually 1.5) and by the number of overtime hours. At $20/h, 10 overtime hours at time-and-a-half is 20 × 1.5 × 10 = $300, on top of your regular pay.' },
      { q: 'What is time and a half?', a: 'Overtime paid at 1.5 times the regular hourly rate — the standard US federal minimum for hours over 40 per week. A $20/h rate becomes $30/h for those overtime hours.' },
      { q: 'When does overtime start?', a: 'Under US federal law (FLSA), after 40 hours in a workweek for non-exempt employees. Some states (like California) also require overtime after 8 hours in a day, and double time in some cases — check your local rules and set the multiplier accordingly.' },
      { q: 'What is double time?', a: 'Overtime paid at 2× the regular rate, required in some states or contracts for very long shifts or holidays. Enter 2 as the multiplier to calculate it.' },
      { q: 'Is this gross or net pay?', a: 'Gross — before taxes, insurance and other deductions. Your take-home pay will be lower once withholding is applied.' },
    ],
    keywords: ['overtime pay calculator', 'time and a half calculator', 'overtime calculator', 'ot pay calculator', 'double time calculator', 'how to calculate overtime', 'overtime rate'],
  },
];

export function getCalc(slug: string): CalcDef | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
