/** Statistics tool registry. One entry drives a /statistics/ page. */

export interface StatToolDef {
  slug: string;
  name: string;
  icon: string;
  widget: 'normal' | 'binomial' | 'ci' | 'sample-size' | 'pvalue' | 'regression';
  description: string;
  lead: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const STAT_TOOLS: StatToolDef[] = [
  {
    slug: 'normal-distribution-calculator',
    name: 'Normal Distribution Calculator',
    icon: '🔔',
    widget: 'normal',
    description: 'Compute normal-distribution probabilities and z-scores — P(X<x), P(X>x), P(a<X<b), z↔p both ways — with a shaded bell curve. Exact, in your browser.',
    lead: 'Find normal-distribution probabilities and z-scores — the area below, above or between values — with a shaded bell curve, from any mean and standard deviation.',
    how: 'Enter a mean and standard deviation, then a value (or z-score). The calculator uses the exact normal cumulative distribution function (via the error function) to give the probability below, above, or between your values, and shows a shaded bell curve. It also converts a z-score to a p-value and back, and finds the value at a given percentile (the inverse).',
    note: 'The normal CDF has no elementary closed form, so a chatbot only estimates it — this uses a high-accuracy erf implementation for exact results, and shows the shaded area so you can see what the probability means.',
    faqs: [
      { q: 'How do I find the probability from a z-score?', a: 'The p-value for a z-score is the area under the standard normal curve. P(Z < z) is the cumulative probability; for a two-tailed test use 2 × P(Z > |z|). Enter your z-score and this tool gives the exact area below, above and in both tails.' },
      { q: 'What is a z-score?', a: 'A z-score measures how many standard deviations a value is from the mean: z = (x − μ) / σ. A z of +1.96 is 1.96 SD above the mean and marks the 97.5th percentile.' },
      { q: 'How do I find P(a < X < b)?', a: 'It is the area between two values: P(X < b) − P(X < a). Enter both bounds and the tool computes and shades the region between them.' },
      { q: 'How do I find the value at a given percentile?', a: 'Use the inverse (quantile) mode: enter a probability like 0.95 and the tool returns the value x such that P(X < x) equals it — for the standard normal that is z ≈ 1.645.' },
      { q: 'Is the calculation exact?', a: 'It uses a high-accuracy approximation of the error function (erf), accurate to about 7 decimal places — far beyond what any statistical table or manual estimate provides, and everything runs in your browser.' },
      { q: 'What is the empirical (68–95–99.7) rule?', a: 'About 68% of a normal distribution lies within 1 SD of the mean, 95% within 2 SD, and 99.7% within 3 SD. You can verify these exactly by entering the corresponding bounds.' },
    ],
    keywords: ['normal distribution calculator', 'z score to p value', 'z score calculator', 'normal probability calculator', 'bell curve calculator', 'p value from z score', 'gaussian calculator'],
  },
  {
    slug: 'binomial-probability-calculator',
    name: 'Binomial Probability Calculator',
    icon: '🎯',
    widget: 'binomial',
    description: 'Compute binomial probabilities — P(X=k), P(X≤k), P(X≥k) — with exact BigInt coefficients, plus mean and standard deviation. In your browser.',
    lead: 'Compute binomial probabilities for n trials with success probability p — exactly P(X=k), P(X≤k), P(X≥k) — plus the mean and standard deviation.',
    how: 'For n independent trials each with success probability p, the binomial distribution gives the chance of exactly k successes: P(X=k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ. This tool computes the binomial coefficient C(n,k) with exact BigInt arithmetic, so results stay precise even for large n, and reports the exact, at-most, and at-least probabilities along with the mean (np) and standard deviation (√(np(1−p))).',
    note: 'On brand with our exact-math tools: the binomial coefficients use BigInt, so there is no floating-point overflow or rounding that plagues naive implementations at large n.',
    faqs: [
      { q: 'What is the binomial probability formula?', a: 'P(X=k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ, where n is the number of trials, p the probability of success on each, k the number of successes, and C(n,k) the binomial coefficient (n choose k).' },
      { q: 'What is the difference between P(X=k), P(X≤k) and P(X≥k)?', a: 'P(X=k) is exactly k successes; P(X≤k) is k or fewer (the cumulative probability); P(X≥k) is k or more (1 − P(X≤k−1)). This tool reports all three.' },
      { q: 'When can I use the binomial distribution?', a: 'When you have a fixed number of independent trials (n), each with two outcomes and the same success probability (p) — for example coin flips, defect rates, or yes/no survey responses.' },
      { q: 'What are the mean and standard deviation?', a: 'The mean (expected number of successes) is np, and the standard deviation is √(np(1−p)). For n=20, p=0.5 that is a mean of 10 and SD of about 2.24.' },
      { q: 'Why use BigInt coefficients?', a: 'Binomial coefficients grow astronomically — C(100,50) has 30 digits. Computing them with ordinary floating-point numbers loses precision; BigInt keeps the calculation exact.' },
      { q: 'Is this the same as a normal approximation?', a: 'No — this computes the exact binomial probability. For very large n the normal approximation is often used, but here you get the precise value.' },
    ],
    keywords: ['binomial probability calculator', 'binomial distribution calculator', 'binomial calculator', 'p x=k binomial', 'n choose k probability', 'binomial cdf calculator'],
  },
  {
    slug: 'confidence-interval-calculator',
    name: 'Confidence Interval Calculator',
    icon: '📐',
    widget: 'ci',
    description: 'Calculate a confidence interval for a mean (z or t) or a proportion — from summary statistics — with the margin of error and interpretation. In your browser.',
    lead: 'Build a confidence interval for a population mean or proportion from your sample statistics, with the margin of error and a plain-English interpretation.',
    how: 'For a mean with known population SD, the interval is x̄ ± z·(σ/√n); with unknown SD it uses the t-distribution: x̄ ± t·(s/√n). For a proportion it is p̂ ± z·√(p̂(1−p̂)/n). Enter your sample statistics and confidence level, and the tool computes the critical value (exact z or t), the margin of error, and the interval.',
    note: 'The critical value is exact — the t critical uses the inverse of the regularized incomplete beta function, not a rounded table lookup — so the interval is precise for any degrees of freedom and confidence level.',
    faqs: [
      { q: 'What is a confidence interval?', a: 'A range, computed from a sample, that is likely to contain the true population value. A 95% confidence interval means that if you repeated the sampling many times, about 95% of the intervals would contain the true parameter.' },
      { q: 'When do I use z versus t?', a: 'Use z when the population standard deviation is known (rare) or the sample is large. Use the t-distribution when the population SD is unknown and estimated from the sample — which is the usual case. This tool picks the right one based on your input.' },
      { q: 'What is the margin of error?', a: 'The half-width of the interval: the critical value times the standard error. The interval is the estimate plus or minus the margin of error, so a smaller margin means a more precise estimate.' },
      { q: 'How do I get a narrower interval?', a: 'Increase the sample size (the margin shrinks with √n), lower the confidence level (e.g. 90% instead of 99%), or reduce variability. The sample-size calculator works this backwards from a target margin.' },
      { q: 'What does 95% confidence actually mean?', a: 'It is a statement about the procedure, not a single interval: 95% of intervals built this way capture the true value. It does not mean there is a 95% probability the true value is in this particular interval.' },
      { q: 'Is my data uploaded?', a: 'No — the calculation runs entirely in your browser.' },
    ],
    keywords: ['confidence interval calculator', 'confidence interval for mean', 'confidence interval for proportion', 'margin of error calculator', '95 confidence interval', 't interval calculator'],
  },
  {
    slug: 'sample-size-calculator',
    name: 'Sample Size Calculator',
    icon: '👥',
    widget: 'sample-size',
    description: 'Calculate the sample size needed for a survey or study — for a proportion or a mean — from your confidence level and margin of error. In your browser.',
    lead: 'Find the sample size you need for a given confidence level and margin of error — for estimating a proportion (survey) or a mean.',
    how: 'For a proportion, the required sample size is n = z²·p(1−p) / E², where z is the critical value for your confidence level, p the expected proportion (0.5 is the safe, most-conservative choice), and E the margin of error. For a mean, n = (z·σ / E)². An optional finite-population correction reduces n when you are sampling a large fraction of a small population.',
    note: 'The go-to tool before running a survey: it tells you how many responses you need for the precision you want. Uses the exact normal critical value for your confidence level.',
    faqs: [
      { q: 'How do I calculate sample size for a survey?', a: 'Use n = z²·p(1−p) / E². For 95% confidence (z ≈ 1.96), a 5% margin of error (E = 0.05), and the conservative p = 0.5, you need about 385 responses. Enter your values to get the exact figure.' },
      { q: 'What value should I use for the expected proportion?', a: 'If you have no prior estimate, use 0.5 — it maximises the required sample size, so your margin of error is guaranteed to be no worse than planned. If you expect a proportion far from 0.5 (say 0.1), the required sample is smaller.' },
      { q: 'What is the margin of error?', a: 'The precision you want — the ± range around your estimate. A 3% margin needs a larger sample than a 5% margin; halving the margin roughly quadruples the required sample.' },
      { q: 'What is the finite-population correction?', a: 'When your sample is a large fraction of a small population, you need fewer respondents than the basic formula suggests. The correction adjusts n downward using the total population size.' },
      { q: 'Why does higher confidence need a bigger sample?', a: 'A higher confidence level (99% vs 95%) uses a larger critical value z, which increases the required sample size. More confidence in a narrower margin costs more data.' },
      { q: 'Does the population size matter?', a: 'Surprisingly little for large populations — a 95%/5% survey needs about 385 responses whether the population is 20,000 or 20 million. It only matters (via the finite-population correction) when the sample is a large share of a small population.' },
    ],
    keywords: ['sample size calculator', 'survey sample size', 'sample size for proportion', 'sample size for mean', 'how many people to survey', 'statistical sample size'],
  },
  {
    slug: 'p-value-calculator',
    name: 'P-Value Calculator',
    icon: '🧮',
    widget: 'pvalue',
    description: 'Convert a test statistic (z, t, χ² or F) to a p-value — one- or two-tailed — using exact distribution functions. For hypothesis testing, in your browser.',
    lead: 'Turn a test statistic — z, t, chi-square or F — into a p-value, one-tailed or two-tailed, using exact distribution functions.',
    how: 'Choose the distribution your test statistic comes from, enter the statistic (and degrees of freedom for t, χ² and F), and the tool returns the p-value from the exact cumulative distribution function. For z and t you can pick a left, right, or two-tailed alternative; χ² and F tests are right-tailed. A verdict compares the p-value to your significance level (α).',
    note: 'The exact special functions (error function, regularized incomplete gamma and beta) are the same ones behind statistical software — so the p-value is precise, not a table approximation that a chatbot would round or get wrong.',
    faqs: [
      { q: 'How do I convert a z-score to a p-value?', a: 'The p-value is the tail area beyond the statistic. For a right-tailed z-test it is P(Z > z); for two-tailed it is 2 × P(Z > |z|). Choose the distribution "z" and your tail, and the tool computes it exactly.' },
      { q: 'What is a p-value?', a: 'The probability of observing a test statistic at least as extreme as yours if the null hypothesis were true. A small p-value (typically ≤ 0.05) is evidence against the null hypothesis.' },
      { q: 'When is a result statistically significant?', a: 'When the p-value is at or below your chosen significance level α (commonly 0.05). This tool shows the verdict — reject or fail to reject the null hypothesis — against your α.' },
      { q: 'What is the difference between one-tailed and two-tailed?', a: 'A one-tailed test looks for an effect in a single direction (only larger, or only smaller); a two-tailed test looks for any difference. Two-tailed p-values are double the one-tailed value for symmetric distributions.' },
      { q: 'Which distribution should I choose?', a: 'z for large-sample or known-variance tests, t for small-sample mean tests (with degrees of freedom), χ² for goodness-of-fit and independence tests, and F for ANOVA and variance ratios.' },
      { q: 'Why not just read a table?', a: 'Tables are coarse and require interpolation; this computes the exact p-value for any statistic and degrees of freedom, with no rounding — and it runs entirely in your browser.' },
    ],
    keywords: ['p value calculator', 'p value from z score', 'p value from t', 'chi square p value', 'f test p value', 't test p value calculator', 'test statistic to p value'],
  },
  {
    slug: 'linear-regression-calculator',
    name: 'Linear Regression & Correlation Calculator',
    icon: '📉',
    widget: 'regression',
    description: 'Fit a least-squares line to paired data — slope, intercept, equation, r, r² — with a scatter plot and the fitted line. In your browser.',
    lead: 'Fit a least-squares regression line to your paired (x, y) data — slope, intercept, the equation, correlation r and r² — with a scatter plot and the fitted line.',
    how: 'Paste your x and y values and the calculator finds the least-squares line y = a + bx that minimises the squared vertical distances to the points. It reports the slope and intercept, the regression equation, Pearson’s correlation coefficient r and the coefficient of determination r² (the share of variance explained), and draws a scatter plot with the fitted line so you can see the fit.',
    note: 'The visual differentiator: a scatter plot with the fitted line, plus the exact coefficients and r² — the kind of at-a-glance fit a chatbot can’t draw and often miscomputes.',
    faqs: [
      { q: 'What is linear regression?', a: 'A method that fits a straight line y = a + bx to paired data by minimising the sum of squared vertical distances from the points to the line (least squares). The slope b and intercept a describe the best-fit relationship.' },
      { q: 'What do r and r² mean?', a: 'r is Pearson’s correlation coefficient (−1 to +1), measuring the strength and direction of the linear relationship. r² (r squared) is the proportion of the variance in y explained by x — an r² of 0.8 means the line explains 80% of the variation.' },
      { q: 'How do I read the regression equation?', a: 'y = a + bx: a is the predicted y when x is 0 (the intercept), and b is the change in y per one-unit increase in x (the slope). Plug in an x to predict its y.' },
      { q: 'Does correlation imply causation?', a: 'No. A strong r means x and y move together, not that one causes the other — a lurking third variable or coincidence can produce correlation. Regression describes association, not cause.' },
      { q: 'How much data do I need?', a: 'At least two points define a line, but more points give a more reliable fit and a meaningful r². Paste as many paired values as you have; the tool handles them all.' },
      { q: 'Is my data uploaded?', a: 'No — the fit, statistics and chart are all computed in your browser.' },
    ],
    keywords: ['linear regression calculator', 'least squares calculator', 'correlation coefficient calculator', 'r squared calculator', 'regression line calculator', 'scatter plot calculator', 'pearson correlation'],
  },
];

export const getStatTool = (slug: string) => STAT_TOOLS.find((t) => t.slug === slug);
