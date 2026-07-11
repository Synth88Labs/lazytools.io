/** Personal-finance tools registry. Educational calculators — not financial advice. */

export interface FinanceToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'compound' | 'debt' | 'savings' | 'loan' | 'creditcard' | 'cagr' | 'rule72' | 'roi' | 'breakeven' | 'aprapy';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const FIN_TOOLS: FinanceToolDef[] = [
  {
    slug: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    icon: '📈',
    widget: 'compound',
    description: 'See how savings and investments grow with compound interest and regular monthly contributions — future value, interest earned and a growth chart. Free, in-browser.',
    lead: 'Enter a starting amount, return rate, time and monthly contribution to see the future value — with the interest earned and a growth chart.',
    how: 'Compound interest earns returns on your returns. The future value is FV = P(1+i)ⁿ for the lump sum, plus a contributions term for regular deposits: contribution × [((1+i)ⁿ − 1) / i], where i is the periodic rate and n the number of periods. The tool adds the two, and shows how much you contributed versus how much came from growth.',
    note: 'The rate you enter is assumed constant — real investment returns vary year to year, so treat the result as an illustration, not a promise. This is an educational tool, not financial advice.',
    faqs: [
      { q: 'How does compound interest work?', a: 'You earn interest on your original money and on the interest already added, so growth accelerates over time. FV = P(1+i)ⁿ; with regular deposits you add an annuity term for the contributions.' },
      { q: 'How do I include monthly contributions?', a: 'Enter a monthly deposit and the tool adds the future value of that stream: contribution × [((1+i)ⁿ − 1) / i]. Regular investing is what drives most long-term growth.' },
      { q: 'What does compounding frequency change?', a: 'More frequent compounding (daily vs annually) slightly increases the result because interest is added and starts earning sooner. The difference is small at typical rates.' },
      { q: 'Why does starting early matter so much?', a: 'Because compounding is exponential — an extra decade lets the interest compound on itself far longer. A small amount invested early often beats a larger amount invested late.' },
      { q: 'Is the projected return guaranteed?', a: 'No. The calculator assumes a fixed rate; actual markets fluctuate. Use it to compare scenarios, not as a guarantee. It is educational, not financial advice.' },
    ],
    keywords: ['compound interest calculator', 'investment calculator', 'compound interest with contributions', 'savings growth calculator', 'future value calculator', 'compound growth'],
  },
  {
    slug: 'debt-payoff-calculator',
    name: 'Debt Payoff Calculator (Snowball vs Avalanche)',
    icon: '🏔️',
    widget: 'debt',
    description: 'Compare the debt snowball and avalanche methods across all your debts — see the payoff date, total interest and which saves more. Runs in your browser; nothing uploaded.',
    lead: 'List your debts and an extra monthly amount, and compare the snowball (smallest balance first) and avalanche (highest APR first) methods — payoff date, total interest and which wins.',
    how: 'The tool simulates every month: it charges interest on each balance, pays the minimums, then throws the extra payment — plus the freed-up minimums from any cleared debts — at one focus debt. The snowball targets the smallest balance first (for motivating quick wins); the avalanche targets the highest APR first (to minimise interest). It reports the debt-free date and total interest for each.',
    note: 'The avalanche always costs the least interest mathematically; the snowball can be easier to stick with because you clear whole debts sooner. Your debt figures never leave your browser. Educational — not financial advice.',
    faqs: [
      { q: 'What is the difference between the debt snowball and avalanche?', a: 'The snowball pays off the smallest balance first for quick, motivating wins; the avalanche pays off the highest-interest debt first to minimise total interest. Both put every spare dollar toward one debt at a time.' },
      { q: 'Which method saves the most money?', a: 'The avalanche — paying the highest APR first always minimises interest. The snowball usually costs a little more but can be easier to maintain, and the best plan is the one you actually follow.' },
      { q: 'How does the extra payment help?', a: 'Above the minimums, every extra dollar goes to one focus debt, clearing it faster; its freed-up minimum then rolls onto the next debt (the “snowball” effect), accelerating each payoff.' },
      { q: 'What if my minimum payments don’t cover the interest?', a: 'Then the balance grows and never clears — the tool flags this. You need to pay more than the monthly interest for the debt to shrink.' },
      { q: 'Is my financial data safe?', a: 'Yes — the whole simulation runs in your browser. Your balances, rates and payments are never sent anywhere.' },
    ],
    keywords: ['debt payoff calculator', 'debt snowball calculator', 'debt avalanche calculator', 'snowball vs avalanche', 'pay off debt calculator', 'debt free calculator'],
  },
  {
    slug: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    icon: '🎯',
    widget: 'savings',
    description: 'Find out how much to save each month to reach a goal by a target date, given your current savings and expected return. Free, in-browser.',
    lead: 'Enter your goal, what you’ve saved, an expected return and a time frame, and get the monthly amount you need to save to reach it.',
    how: 'The tool grows your current savings at the given rate, subtracts that from the goal to find the shortfall, then solves for the monthly deposit that fills it: contribution = shortfall × i / ((1+i)ⁿ − 1), where i is the monthly rate and n the number of months.',
    note: 'A higher assumed return lowers the required deposit but adds risk; a cash savings rate is safer but needs bigger contributions. Educational — not financial advice.',
    faqs: [
      { q: 'How much should I save each month to reach my goal?', a: 'It depends on the goal, your current savings, the time frame and the return. The tool solves the exact monthly deposit so your savings plus contributions (compounded) reach the target on time.' },
      { q: 'Does my current balance count?', a: 'Yes — it’s grown at the expected rate over the period and subtracted from the goal, so you only need to save the remaining shortfall.' },
      { q: 'What return rate should I use?', a: 'For a short-term goal, a conservative cash/savings rate; for a long horizon, a diversified-investment estimate. Higher assumed returns reduce the required deposit but carry more risk.' },
      { q: 'What if I’m already on track?', a: 'If your current savings alone will reach the goal at the given rate, the tool says so and the required extra contribution is zero.' },
      { q: 'Is this financial advice?', a: 'No — it’s an educational planning tool. It assumes a fixed return; real returns vary.' },
    ],
    keywords: ['savings goal calculator', 'how much to save each month', 'savings calculator', 'monthly savings calculator', 'save for goal calculator', 'savings target'],
  },
  {
    slug: 'loan-payoff-calculator',
    name: 'Loan Payoff Calculator',
    icon: '🏦',
    widget: 'loan',
    description: 'Calculate a loan’s monthly payment, total interest and payoff time — and see how much extra payments save. Free, in-browser.',
    lead: 'Enter the loan amount, rate and term to get the monthly payment and total interest — then add an extra monthly amount to see how much time and interest you save.',
    how: 'The monthly payment on an amortising loan is PMT = P·i / (1 − (1+i)⁻ⁿ), where P is the principal, i the monthly rate and n the number of payments. Adding an extra amount each month pays down the principal faster; the tool re-simulates the payoff to show the new term and interest saved.',
    note: 'Even a small extra payment can save meaningful interest and years, because it attacks the principal directly. Check your loan allows overpayments without penalty. Educational — not financial advice.',
    faqs: [
      { q: 'How is a loan’s monthly payment calculated?', a: 'PMT = P·i / (1 − (1+i)⁻ⁿ), where P is the amount borrowed, i the monthly interest rate (annual ÷ 12) and n the number of monthly payments. This is the standard amortization formula.' },
      { q: 'How much do extra payments save?', a: 'A lot, because extra money goes straight to principal, which then stops accruing interest. The tool shows the reduced payoff time and the interest saved for any extra monthly amount.' },
      { q: 'What is total interest?', a: 'The sum of all interest over the life of the loan — the monthly payment times the number of payments, minus the amount borrowed.' },
      { q: 'Does a shorter term cost less?', a: 'Yes — a shorter term means higher monthly payments but far less total interest, because you’re borrowing the money for less time.' },
      { q: 'Is this the same as a mortgage calculator?', a: 'The maths is the same amortization. This is a general loan tool; for a home loan with taxes and insurance, use a dedicated mortgage calculator.' },
    ],
    keywords: ['loan payoff calculator', 'loan calculator', 'loan payment calculator', 'extra payment calculator', 'amortization calculator', 'pay off loan early'],
  },
  {
    slug: 'credit-card-payoff-calculator',
    name: 'Credit Card Payoff Calculator',
    icon: '💳',
    widget: 'creditcard',
    description: 'See how long it takes to pay off a credit card and the total interest — or find the payment needed to clear it by a target date. Free, in-browser.',
    lead: 'Enter your card balance and APR, then either a monthly payment (to see the payoff time and interest) or a target number of months (to see the payment needed).',
    how: 'Interest is charged monthly on the balance at APR ÷ 12. Given a fixed payment, the tool simulates month by month until the balance clears, reporting the time and total interest. Given a target number of months, it solves for the payment using the amortization formula.',
    note: 'Paying only the minimum on a high-APR card can take years and cost more than the original balance. Any extra you pay attacks the balance directly. Educational — not financial advice.',
    faqs: [
      { q: 'How long will it take to pay off my credit card?', a: 'It depends on the balance, APR and monthly payment. Enter those and the tool simulates the payoff month by month, showing the time and total interest. Higher payments clear it far faster.' },
      { q: 'Why does paying the minimum cost so much?', a: 'The minimum is often barely above the monthly interest, so almost nothing goes to the balance. On a high-APR card that can mean years of payments and interest exceeding the original balance.' },
      { q: 'How much should I pay to clear the card by a date?', a: 'Switch to “pay off in X months” and the tool solves the required monthly payment using the loan amortization formula.' },
      { q: 'What if my payment is too low?', a: 'If the payment barely covers the monthly interest, the balance never clears — the tool warns you and shows the minimum needed to make progress.' },
      { q: 'Is my balance private?', a: 'Yes — everything runs in your browser and nothing is uploaded.' },
    ],
    keywords: ['credit card payoff calculator', 'credit card interest calculator', 'pay off credit card', 'credit card payment calculator', 'how long to pay off credit card'],
  },
  {
    slug: 'cagr-calculator',
    name: 'CAGR Calculator',
    icon: '📊',
    widget: 'cagr',
    description: 'Calculate the compound annual growth rate (CAGR) between a start and end value over a number of years — plus total return and growth multiple. Free, in-browser.',
    lead: 'Enter a starting value, ending value and number of years to get the CAGR — the smoothed annual growth rate — along with the total return.',
    how: 'The compound annual growth rate is CAGR = (ending ÷ starting)^(1/years) − 1. It’s the constant annual rate that would take the start value to the end value over the period, smoothing out the ups and downs so you can compare investments of different lengths.',
    note: 'CAGR hides volatility — it says nothing about the bumpy path in between, only the start and end. Educational — not financial advice.',
    faqs: [
      { q: 'How do I calculate CAGR?', a: 'CAGR = (ending value ÷ starting value)^(1/years) − 1. Growing $10,000 to $18,000 over 5 years is (1.8)^(0.2) − 1 ≈ 12.5% per year.' },
      { q: 'What is CAGR used for?', a: 'To express an investment’s growth as a single annual rate, so you can compare returns over different time periods on an equal footing.' },
      { q: 'How is CAGR different from total return?', a: 'Total return is the overall percentage gain; CAGR is the equivalent smoothed annual rate. A 80% total return over 5 years is a CAGR of about 12.5%.' },
      { q: 'Does CAGR account for volatility?', a: 'No — it only uses the start and end values, ignoring the path between. Two investments with the same CAGR can have very different risk.' },
      { q: 'Can CAGR be negative?', a: 'Yes — if the ending value is below the starting value, CAGR is negative, showing an average annual loss.' },
    ],
    keywords: ['cagr calculator', 'compound annual growth rate', 'annualized return calculator', 'cagr formula', 'growth rate calculator', 'investment growth rate'],
  },
  {
    slug: 'rule-of-72-calculator',
    name: 'Rule of 72 Calculator',
    icon: '⏳',
    widget: 'rule72',
    description: 'Estimate how long it takes money to double at a given interest rate with the Rule of 72 — and see the exact doubling time. Free, in-browser.',
    lead: 'Enter an annual rate and the Rule of 72 estimates the doubling time — shown alongside the Rule of 70 and the exact figure.',
    how: 'The Rule of 72 is a mental-math shortcut: divide 72 by the annual percentage rate to estimate the years to double your money. The tool also shows the Rule of 70 (often used for continuous growth) and the exact doubling time, ln(2) ÷ ln(1 + rate).',
    note: 'The Rule of 72 is most accurate around 6–10%; far from that range the exact figure diverges. Educational — not financial advice.',
    faqs: [
      { q: 'What is the Rule of 72?', a: 'A shortcut for estimating how long an investment takes to double: years ≈ 72 ÷ annual percentage rate. At 8%, money doubles in about 72 ÷ 8 = 9 years.' },
      { q: 'How accurate is the Rule of 72?', a: 'Very close around 6–10%. Outside that range, use the Rule of 70 or 69.3, or the exact formula ln(2) ÷ ln(1 + rate), which the tool also shows.' },
      { q: 'Why 72 and not 70?', a: '72 has many small divisors (2, 3, 4, 6, 8, 9, 12), making the mental division easy, and it’s a good approximation for annual compounding. 70 is closer for continuous compounding.' },
      { q: 'Can I use it for inflation?', a: 'Yes — dividing 72 by an inflation rate estimates how long until prices double (or your money’s purchasing power halves).' },
      { q: 'What is the exact doubling time?', a: 'ln(2) ÷ ln(1 + rate). At 8% that’s about 9.01 years, very close to the Rule of 72’s estimate of 9.' },
    ],
    keywords: ['rule of 72 calculator', 'doubling time calculator', 'rule of 72', 'how long to double money', 'rule of 70', 'money doubling calculator'],
  },
  {
    slug: 'roi-calculator',
    name: 'ROI Calculator',
    icon: '💰',
    widget: 'roi',
    description: 'Calculate return on investment (ROI) as a percentage from the amount invested and the final value — plus the net gain and annualized return. Free, in-browser.',
    lead: 'Enter what you invested and what you got back to get the ROI percentage, the net gain and (with a time period) the annualized return.',
    how: 'Return on investment is ROI = (final value − amount invested) ÷ amount invested × 100. If you enter the holding period, the tool also gives the annualized return (CAGR), which lets you compare investments held for different lengths of time.',
    note: 'Simple ROI ignores time, so a 50% return over one year and over ten years look the same — always check the annualized figure for a fair comparison. Educational — not financial advice.',
    faqs: [
      { q: 'How do I calculate ROI?', a: 'ROI = (final value − amount invested) ÷ amount invested × 100. Turning $10,000 into $13,500 is a $3,500 gain, or 35% ROI.' },
      { q: 'What is a good ROI?', a: 'It depends on the investment, risk and time frame — there’s no universal figure. Compare against alternatives and always factor in how long the money was tied up.' },
      { q: 'Why should I annualize ROI?', a: 'Because simple ROI ignores time. A 35% return in 1 year is far better than 35% over 10 years; the annualized (CAGR) figure makes them comparable.' },
      { q: 'Can ROI be negative?', a: 'Yes — if the final value is less than the amount invested, the ROI is negative, showing a loss.' },
      { q: 'Does ROI include costs?', a: 'Only if you include them — subtract fees, taxes and other costs from the final value (or add to the investment) for a true net ROI.' },
    ],
    keywords: ['roi calculator', 'return on investment calculator', 'roi formula', 'investment return calculator', 'annualized roi', 'net gain calculator'],
  },
  {
    slug: 'break-even-calculator',
    name: 'Break-Even Calculator',
    icon: '⚖️',
    widget: 'breakeven',
    description: 'Calculate the break-even point — the units and revenue you need to cover costs — from fixed costs, unit price and variable cost. Free, in-browser.',
    lead: 'Enter your fixed costs, price per unit and variable cost per unit to find the break-even point: the units and revenue needed to cover all costs.',
    how: 'Break-even units = fixed costs ÷ (price − variable cost per unit). The denominator is the contribution margin — the profit each unit adds toward the fixed costs. Below the break-even point you make a loss; above it, each sale is profit.',
    note: 'If the price doesn’t exceed the variable cost, every sale loses money and there’s no break-even — the tool flags this. Educational — not financial advice.',
    faqs: [
      { q: 'How do I calculate the break-even point?', a: 'Break-even units = fixed costs ÷ (price per unit − variable cost per unit). With $10,000 fixed costs, a $40 price and $15 variable cost, you break even at 10,000 ÷ 25 = 400 units.' },
      { q: 'What is the contribution margin?', a: 'The price minus the variable cost per unit — the amount each sale contributes toward fixed costs and then profit. A bigger margin means fewer units to break even.' },
      { q: 'What are fixed vs variable costs?', a: 'Fixed costs (rent, salaries, equipment) don’t change with output; variable costs (materials, per-unit labour) rise with each unit made. Break-even balances the two against revenue.' },
      { q: 'What if the price is below the variable cost?', a: 'Then you lose money on every unit and can never break even. You must raise the price or cut the variable cost — the tool warns you.' },
      { q: 'Why is break-even useful?', a: 'It tells you the minimum sales to avoid a loss, helping set prices, plan production and decide whether a product or venture is viable.' },
    ],
    keywords: ['break even calculator', 'break-even point calculator', 'break even analysis', 'contribution margin calculator', 'break even units', 'fixed cost calculator'],
  },
  {
    slug: 'apr-to-apy-calculator',
    name: 'APR to APY Calculator',
    icon: '🔁',
    widget: 'aprapy',
    description: 'Convert between APR (nominal rate) and APY (effective annual yield) for any compounding frequency. Free, in-browser.',
    lead: 'Convert a nominal APR into the effective annual yield (APY) — or back — for any compounding frequency, so you can compare rates on an equal footing.',
    how: 'APY includes the effect of compounding: APY = (1 + APR/n)ⁿ − 1, where n is the number of compounding periods per year. Because interest earns interest during the year, the APY is always at least the APR. The tool converts either way for daily, monthly, quarterly or annual compounding.',
    note: 'Savings accounts usually quote APY (the higher, more attractive figure); loans quote APR. Converting to a common basis is the only fair way to compare offers. Educational — not financial advice.',
    faqs: [
      { q: 'What is the difference between APR and APY?', a: 'APR is the nominal annual rate, ignoring in-year compounding; APY (effective annual yield) includes compounding, so it’s always equal to or higher than the APR. APY = (1 + APR/n)ⁿ − 1.' },
      { q: 'How do I convert APR to APY?', a: 'APY = (1 + APR/n)ⁿ − 1, where n is the compounding periods per year. A 12% APR compounded monthly is an APY of about 12.68%.' },
      { q: 'Why do savings accounts quote APY?', a: 'Because APY is the higher, more attractive figure and reflects what you actually earn with compounding. Loans quote APR, which looks lower — always compare like with like.' },
      { q: 'Does more frequent compounding help?', a: 'Yes, slightly — daily compounding gives a marginally higher APY than monthly for the same APR, because interest is added and re-earns sooner.' },
      { q: 'Which should I use to compare offers?', a: 'Convert everything to APY (or everything to APR) at the same compounding frequency, then compare. Mixing the two is misleading.' },
    ],
    keywords: ['apr to apy calculator', 'apy calculator', 'apr apy converter', 'effective annual rate calculator', 'nominal vs effective rate', 'apy from apr'],
  },
];

export const getFinanceTool = (slug: string) => FIN_TOOLS.find((t) => t.slug === slug);
