/** Mathematics tools registry — exact-arithmetic calculators that show their working. */

export interface MathToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'fraction' | 'dec-frac' | 'gcd-lcm' | 'prime' | 'ratio' | 'quadratic' | 'stats' | 'roman' | 'sci-notation' | 'perm-comb';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const MATH_TOOLS: MathToolDef[] = [
  {
    slug: 'fraction-calculator',
    name: 'Fraction Calculator',
    icon: '➗',
    description:
      'Add, subtract, multiply and divide fractions and mixed numbers — exact results in lowest terms, with the working shown step by step. No floating-point rounding, in your browser.',
    lead: '1 1/2 + 3/4 = 9/4 = 2 1/4 — exactly, with the steps shown. Fractions, mixed numbers and decimals in; simplified fraction, mixed number and decimal out.',
    widget: 'fraction',
    how: 'Every input — a fraction like 3/4, a mixed number like 1 2/3, an integer or a decimal — is converted to an exact rational number (a pair of arbitrary-precision integers), and the arithmetic happens on those. Addition and subtraction go through the least common denominator, multiplication multiplies straight across, division multiplies by the reciprocal — and each route shows its working as numbered steps, the way it\'s taught. The result appears three ways at once: simplified fraction, mixed number, and decimal (marked exact when it terminates, rounded when it doesn\'t).',
    note: 'Why exact matters: a floating-point calculator answering 1/3 + 1/3 + 1/3 gets 0.9999999999999999 — close, but wrong, and visibly wrong when the numbers feed a recipe scale-up or a homework answer. Rational arithmetic has no such drift: thirds stay thirds. The steps display doubles as a checking aid for schoolwork — the answer alone teaches nothing; the working is the point.',
    faqs: [
      { q: 'What input formats are accepted?', a: 'Proper and improper fractions (3/4, 7/2), mixed numbers with a space (1 2/3), negative values (-5/6), whole numbers, and decimals (2.5 becomes 5/2 exactly). Both operands accept any of these, mixed freely.' },
      { q: 'How do you add fractions with different denominators?', a: 'Rewrite both over the least common denominator, then add numerators. 1/2 + 1/3 → 3/6 + 2/6 = 5/6. The tool shows exactly this working for your numbers.' },
      { q: 'Why does my calculator show 0.9999999999 for 1/3 + 2/3?', a: 'Because it computes in binary floating point, which cannot represent 1/3 exactly, so tiny errors accumulate. This tool keeps numbers as exact fractions — 1/3 + 2/3 is exactly 1.' },
      { q: 'Does it simplify to lowest terms?', a: 'Always — results are reduced by the greatest common divisor and shown as a fraction, a mixed number (when the value exceeds 1), and a decimal marked exact or rounded.' },
      { q: 'Is my input sent anywhere?', a: 'No — all arithmetic runs in your browser and the page works offline.' },
    ],
    keywords: ['fraction calculator', 'adding fractions', 'multiply fractions', 'divide fractions', 'mixed number calculator', 'fraction calculator with steps', 'simplify fractions'],
  },
  {
    slug: 'decimal-to-fraction',
    name: 'Decimal ⇄ Fraction Converter',
    icon: '🔁',
    description:
      'Convert decimals to exact fractions — including repeating decimals like 0.1(6) = 1/6 — and fractions to exact decimals with the repeating part identified. In your browser.',
    lead: '0.625 = 5/8, and 0.1666… = 1/6 exactly — this converter handles repeating decimals properly in both directions, showing the repetend in parentheses.',
    widget: 'dec-frac',
    how: 'Decimal to fraction: a terminating decimal like 0.625 becomes 625/1000 and reduces to 5/8; a repeating decimal written with parentheses — 0.1(6) for 0.1666… — is converted with the exact algebraic identity (multiply by powers of ten, subtract, solve), so 0.(142857) comes back as precisely 1/7. Fraction to decimal: long division runs with cycle detection on the remainders, so the tool doesn\'t just print digits — it identifies where the expansion starts repeating and writes the repetend in parentheses. Every fraction\'s decimal either terminates (when the reduced denominator has only factors 2 and 5) or repeats; this shows which, exactly.',
    note: 'The parenthesis notation is the key to exactness: 0.33 and 0.(3) are different numbers — 33/100 versus 1/3 — and a converter that ignores the difference quietly gives the wrong fraction. If you\'re converting a measured decimal (0.33 from a ruler), the terminating interpretation is what you want; if you\'re converting a mathematical one (0.333… from dividing by 3), write it as 0.(3).',
    faqs: [
      { q: 'How do I enter a repeating decimal?', a: 'Put the repeating digits in parentheses: 0.(3) for 0.333…, 0.1(6) for 0.1666…, 1.2(45) for 1.2454545…. The conversion is then exact — 0.(3) gives 1/3, not 3333/10000.' },
      { q: 'How does decimal-to-fraction conversion work?', a: 'Terminating: put the digits over the matching power of ten and reduce (0.625 = 625/1000 = 5/8). Repeating: use the classic identity — for x = 0.(3), 10x − x = 3, so x = 3/9 = 1/3. The tool applies the general form of that algebra.' },
      { q: 'Which fractions give terminating decimals?', a: 'Exactly those whose reduced denominator contains no prime factors other than 2 and 5. 3/8 terminates (0.375); 1/6 cannot (0.1(6)) because of the factor 3.' },
      { q: 'How long can the repeating part be?', a: 'Up to one less than the denominator — 1/7 repeats every 6 digits, 1/97 every 96. The tool detects repetends up to 400 digits and says so if yours is longer.' },
      { q: 'Is anything uploaded?', a: 'No — conversion is exact integer arithmetic in your browser, offline-capable.' },
    ],
    keywords: ['decimal to fraction', 'fraction to decimal', 'repeating decimal to fraction', 'convert 0.625 to fraction', 'recurring decimal converter', 'decimal to fraction calculator'],
  },
  {
    slug: 'gcd-lcm-calculator',
    name: 'GCD & LCM Calculator',
    icon: '🧮',
    description:
      'Greatest common divisor and least common multiple of two or more numbers — with the Euclidean algorithm steps shown, at any size (BigInt). In your browser.',
    lead: 'GCD(48, 180, 36) = 12 and LCM = 720 — for any list of numbers, any size, with the Euclidean algorithm written out step by step.',
    widget: 'gcd-lcm',
    how: 'The greatest common divisor is computed with the Euclidean algorithm — repeatedly replacing the larger number by its remainder on division by the smaller until the remainder is zero; the last non-zero remainder is the GCD. The tool shows those division steps line by line for the first pair, then folds in any further numbers (gcd(gcd(a,b),c)…). The least common multiple comes from the identity LCM(a,b) = a×b ÷ GCD(a,b), likewise folded across the list. Everything runs on arbitrary-precision integers, so 50-digit inputs are as exact as 2-digit ones.',
    note: 'Where these show up in real life: LCM is the "when do they coincide" number — two bus lines every 12 and 18 minutes meet every 36; it\'s also the least common denominator when adding fractions. GCD is the "largest equal split" — the biggest tile that fits a 48×180 floor exactly is 12. The Euclidean steps aren\'t decoration: they\'re the standard exam method, shown for your actual numbers.',
    faqs: [
      { q: 'What are GCD and LCM?', a: 'The GCD (greatest common divisor, also HCF) is the largest integer dividing all the given numbers. The LCM (least common multiple) is the smallest positive integer they all divide. GCD(48,180)=12; LCM(48,180)=720.' },
      { q: 'How does the Euclidean algorithm work?', a: 'Divide the larger by the smaller, keep the remainder, repeat with (smaller, remainder) until the remainder is 0. The last non-zero remainder is the GCD. For 180 and 48: 180=3×48+36, 48=1×36+12, 36=3×12+0 → GCD 12.' },
      { q: 'Can I enter more than two numbers?', a: 'Yes — any list, separated by commas or spaces. GCD and LCM fold across the list pairwise: GCD(a,b,c) = GCD(GCD(a,b),c), and likewise for LCM.' },
      { q: 'How are GCD and LCM related?', a: 'For two numbers, GCD × LCM = a × b. That identity is how the tool computes LCM — and a handy way to check any answer.' },
      { q: 'Is there a size limit?', a: 'Practically none — arithmetic uses BigInt, so hundred-digit inputs are exact. Ordinary calculators silently lose precision beyond 15–16 digits; this doesn\'t.' },
    ],
    keywords: ['gcd calculator', 'lcm calculator', 'greatest common divisor', 'least common multiple', 'hcf calculator', 'euclidean algorithm steps', 'gcd of two numbers'],
  },
  {
    slug: 'prime-factorizer',
    name: 'Prime Factorizer & Prime Checker',
    icon: '🔢',
    description:
      'Factor any number into primes (360 = 2³ × 3² × 5) and test primality — exact up to ~10¹⁹ via Miller–Rabin and Pollard\'s rho, in your browser.',
    lead: 'Is 1,000,000,007 prime? (Yes.) What is 360 as a product of primes? (2³ × 3² × 5.) Exact answers up to 19-digit numbers, plus divisor counts.',
    widget: 'prime',
    how: 'Primality is decided by the deterministic Miller–Rabin test — with a fixed witness set proven correct for every number below 3.3×10²⁴, it\'s a mathematical verdict, not a probability. Factorization strips small primes by trial division, then applies Pollard\'s rho algorithm to whatever remains, which cracks the large factors of 19-digit numbers in milliseconds. From the factorization the tool also derives the number of divisors — (e₁+1)(e₂+1)… over the prime exponents — and their sum. All of it is exact BigInt arithmetic in your browser.',
    note: 'The reason a real algorithm matters: ask a chatbot whether a 10-digit number is prime and you get a confident answer you cannot distinguish from a guess — primality is exactly the kind of question language models answer fluently and unreliably. Miller–Rabin with deterministic witnesses is the opposite: a proof-backed verdict. And the difficulty of factoring big numbers is not a bug but the foundation of RSA cryptography — which is also why this tool caps at ~10¹⁹: beyond that, factoring hard numbers stops being a browser job.',
    faqs: [
      { q: 'What is prime factorization?', a: 'Writing a number as a product of primes: 360 = 2³ × 3² × 5. By the fundamental theorem of arithmetic, this decomposition exists and is unique for every integer above 1 — it\'s the number\'s fingerprint.' },
      { q: 'How large a number can it handle?', a: 'Up to 19 digits (~10¹⁹). Primality testing is instant at that size; factoring uses Pollard\'s rho, which handles even the worst case (a product of two 9–10 digit primes) in well under a second.' },
      { q: 'How is primality tested?', a: 'Deterministic Miller–Rabin with the witness set {2,3,5,…,37}, proven sufficient for all n below 3.3×10²⁴ — so within this tool\'s range the answer is certain, not probabilistic.' },
      { q: 'What are the divisor count and divisor sum for?', a: 'Classic number theory shortcuts derived from the factorization: 360 = 2³×3²×5 has (3+1)(2+1)(1+1) = 24 divisors. Useful for homework, puzzles and spotting highly-composite numbers.' },
      { q: 'Is my number sent anywhere?', a: 'No — all computation is local and works offline.' },
    ],
    keywords: ['prime factorization calculator', 'prime checker', 'is this number prime', 'prime factors of a number', 'factorize number', 'miller rabin', 'divisors calculator'],
  },
  {
    slug: 'ratio-calculator',
    name: 'Ratio Calculator',
    icon: '⚖️',
    description:
      'Solve proportions (a : b = c : x), simplify ratios to lowest terms, and scale quantities — exact cross-multiplication with the working shown. In your browser.',
    lead: 'If 3 : 4 = 9 : x, then x = 12 — solved exactly by cross-multiplication, with fractions kept as fractions. Plus one-click ratio simplification (48 : 36 = 4 : 3).',
    widget: 'ratio',
    how: 'The solver treats a : b = c : x as the equation a/b = c/x and cross-multiplies: x = b×c ÷ a, computed in exact rational arithmetic so the answer comes back as a fraction when it is one (2 : 3 = 5 : x gives x = 15/2, displayed with its decimal). The simplifier divides both sides of a ratio by their greatest common divisor to reach lowest terms. Inputs accept integers, decimals and fractions, so "1.5 : 2.25" and "3/4 : 9/8" both work.',
    note: 'Ratios are the arithmetic of scaling: recipes (3 cups flour to 4 of water, how much for 9 cups flour?), map scales, screen aspect ratios (1920 : 1080 simplifies to 16 : 9 — try it), paint mixing, gear ratios. The classic error is scaling one side and eyeballing the other; cross-multiplication is the two-line method that never misses, and the tool shows it for your numbers.',
    faqs: [
      { q: 'How do I solve a proportion like 3 : 4 = 9 : x?', a: 'Cross-multiply: 3x = 4 × 9, so x = 36/3 = 12. The tool does exactly this and shows the line of working — with exact fractions when the answer isn\'t whole.' },
      { q: 'How do I simplify a ratio?', a: 'Divide both parts by their greatest common divisor. 48 : 36 → both divide by 12 → 4 : 3. Switch to the "Simplify" tab and it happens instantly.' },
      { q: 'Why is 1920 : 1080 the same as 16 : 9?', a: 'Because both parts share the factor 120: 1920÷120 = 16 and 1080÷120 = 9. That\'s what "same aspect ratio" means — the simplified ratios match.' },
      { q: 'Can ratios contain decimals or fractions?', a: 'Yes — every input is converted to an exact rational first, so 1.5 : 2.25 solves precisely (it\'s 2 : 3), with no floating-point residue.' },
      { q: 'Is anything uploaded?', a: 'No — the math runs locally and offline.' },
    ],
    keywords: ['ratio calculator', 'solve proportion', 'simplify ratio', 'aspect ratio calculator', 'cross multiplication', 'equivalent ratios', 'ratio solver'],
  },
  {
    slug: 'quadratic-equation-solver',
    name: 'Quadratic Equation Solver',
    icon: '📈',
    description:
      'Solve ax² + bx + c = 0 exactly: simplified fractions and radicals like (3 + √89)/2, discriminant analysis, vertex, and the full working — including complex roots. In your browser.',
    lead: 'x² − 3x − 10 = 0 → x = 5 or x = −2, exactly — and when roots aren\'t rational you get the simplified radical form (3 ± √89)/2, not just a decimal.',
    widget: 'quadratic',
    how: 'Coefficients (integers, decimals or fractions) are first cleared to integers, then the discriminant D = b² − 4ac decides the character of the roots: a perfect square gives two rational roots (shown as simplified fractions), a positive non-square gives irrational roots — which the tool presents in exact simplified surd form by extracting the largest square factor from D — a zero discriminant gives one repeated root, and a negative one gives a complex conjugate pair (a ± bi). Every case shows the numbered working: the integerized equation, the discriminant computation, the quadratic formula with your values, and the parabola\'s vertex.',
    note: 'The exact surd form is what most online solvers skip: x² − 3x − 20 = 0 has roots (3 ± √89)/2, and "5.216990…" is a shadow of that answer — unusable if the next line of your homework needs the exact value. Extracting square factors matters too: √72 should appear as 6√2. The discriminant is worth internalizing: it tells you how many real roots exist before you solve anything.',
    faqs: [
      { q: 'What is the quadratic formula?', a: 'For ax² + bx + c = 0: x = (−b ± √(b² − 4ac)) / 2a. The expression under the root, D = b² − 4ac, is the discriminant — its sign determines whether the roots are two real numbers, one repeated, or a complex pair.' },
      { q: 'What does the discriminant tell me?', a: 'D > 0: two distinct real roots (rational if D is a perfect square). D = 0: one repeated root. D < 0: no real roots — a complex conjugate pair. The tool reports which case yours is.' },
      { q: 'Why show roots as radicals instead of decimals?', a: 'Because (3 + √89)/2 is the answer, while 6.2169… is an approximation of it. Exact form matters for algebra homework, further symbolic manipulation, and checking by substitution. Decimals are shown alongside for practical use.' },
      { q: 'Does it handle complex roots?', a: 'Yes — when D < 0 the roots appear as an exact conjugate pair like (1 ± √7·i)/2, with decimal approximations.' },
      { q: 'Can coefficients be fractions or decimals?', a: 'Yes — 0.5x² + x − 1/3 = 0 works: coefficients are cleared to integers exactly (multiply by the common denominator) before solving, so no precision is lost.' },
    ],
    keywords: ['quadratic equation solver', 'quadratic formula calculator', 'solve quadratic with steps', 'discriminant calculator', 'exact roots radical form', 'complex roots quadratic'],
  },
  {
    slug: 'statistics-calculator',
    name: 'Statistics Calculator',
    icon: '📊',
    description:
      'Mean, median, mode, range, quartiles, IQR, variance and standard deviation (sample and population) for any data list — pasted straight in, computed in your browser.',
    lead: 'Paste your numbers, get the full descriptive-statistics table: mean, median, mode, quartiles, IQR, and both flavors of variance and standard deviation — with the sample/population distinction made explicit.',
    widget: 'stats',
    how: 'Paste or type any list of numbers (commas, spaces or line breaks all work) and every descriptive statistic updates live: count, sum, mean, median, mode(s), min/max and range, the quartiles Q1 and Q3 with the interquartile range, and variance and standard deviation in both conventions — population (dividing by n) and sample (dividing by n−1, Bessel\'s correction). Quartiles use the median-of-halves method (Moore & McCabe), stated on the page because different textbooks define quartiles slightly differently and the method changes the answer.',
    note: 'The sample-vs-population distinction is the most common statistics mistake outside classrooms: divide by n when your data IS the whole population (all 30 students in the class), by n−1 when it\'s a sample standing in for something bigger (30 customers out of thousands). Excel\'s STDEV defaults to the sample version; many calculators default to population — knowing which you\'re getting is half the battle, so this tool always shows both, labeled.',
    faqs: [
      { q: 'What\'s the difference between sample and population standard deviation?', a: 'Population σ divides the squared deviations by n; sample s divides by n−1 (Bessel\'s correction), which compensates for a sample underestimating spread. Use sample statistics when your data is a subset standing in for a larger population.' },
      { q: 'How are the quartiles computed?', a: 'Median-of-halves (Moore & McCabe): split the sorted data at the median (excluding it when n is odd); Q1 is the median of the lower half, Q3 of the upper. Other textbooks interpolate differently — check which your course uses.' },
      { q: 'What if there\'s no mode?', a: 'If every value occurs once, there is no mode and the tool says so. If several values tie for the highest frequency, all of them are listed (multimodal data).' },
      { q: 'What is the IQR used for?', a: 'The interquartile range (Q3 − Q1) is the spread of the middle 50% — robust to outliers, and the basis of the common outlier rule: flag values beyond Q1 − 1.5·IQR or Q3 + 1.5·IQR.' },
      { q: 'Is my data uploaded?', a: 'No — everything computes in your browser and works offline, which matters when the numbers are grades, salaries or measurements you\'d rather keep local.' },
    ],
    keywords: ['statistics calculator', 'mean median mode calculator', 'standard deviation calculator', 'variance calculator', 'quartile calculator', 'iqr calculator', 'descriptive statistics'],
  },
  {
    slug: 'roman-numerals',
    name: 'Roman Numeral Converter',
    icon: '🏛️',
    description:
      'Convert numbers to Roman numerals and back (2026 = MMXXVI) — live in both directions, with malformed numerals rejected and corrected. In your browser.',
    lead: '2026 = MMXXVI. Type in either box and the other updates — with proper validation, so "IIII" and "IC" are flagged with their canonical spellings instead of silently accepted.',
    widget: 'roman',
    how: 'Number to numeral uses the standard subtractive notation: work down through M (1000), CM (900), D (500), CD (400), C, XC, L, XL, X, IX, V, IV, I, appending symbols greedily — 2026 becomes MM + XX + VI. Numeral to number reads left to right, subtracting a symbol when a larger one follows it (IX = 9) and adding otherwise — then the tool re-encodes the result and compares: if your input wasn\'t the canonical spelling ("IIII", "VX", "IC"), it\'s rejected with the correct form suggested, rather than silently interpreted. Standard notation covers 1–3999.',
    note: 'The validation is the differentiator: most converters happily accept "IIII" or even nonsense like "IC" (99 is XCIX — subtractive pairs only allow I before V/X, X before L/C, C before D/M). Strictness matters when you\'re checking an inscription, a movie copyright year (MCMXCIX = 1999), or a Super Bowl number. Above 3999 the Romans used an overline (vinculum) multiplying by 1000 — outside standard notation, so this tool stops at 3999 and says so.',
    faqs: [
      { q: 'What are the Roman numeral symbols?', a: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000. A smaller symbol before a larger one subtracts, in six allowed pairs only: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.' },
      { q: 'Why is 1999 MCMXCIX and not MIM?', a: 'Subtractive pairs are restricted: I may precede only V and X, X only L and C, C only D and M. So 1999 = M + CM + XC + IX. "MIM" breaks the rule, and this converter will tell you so.' },
      { q: 'What\'s the largest standard Roman numeral?', a: 'MMMCMXCIX = 3999. Larger numbers historically used a vinculum (overline meaning ×1000) — a different notation beyond the standard system this tool implements.' },
      { q: 'Why does it reject numerals other converters accept?', a: 'It re-encodes your input\'s value and requires the spellings to match — the definition of well-formed. Loose inputs like IIII (clock faces aside) get the canonical form suggested rather than a silent guess.' },
      { q: 'Does it work offline?', a: 'Yes — conversion is pure local logic.' },
    ],
    keywords: ['roman numerals converter', 'roman numeral translator', '2026 in roman numerals', 'roman numerals 1 to 100', 'convert roman numerals to numbers', 'mcmxcix meaning'],
  },
  {
    slug: 'scientific-notation',
    name: 'Scientific Notation Converter',
    icon: '🔬',
    description:
      'Convert numbers to and from scientific notation (299792458 = 2.99792458 × 10⁸) — digit-exact string conversion, no floating-point mangling, plus e-notation. In your browser.',
    lead: '299,792,458 = 2.99792458 × 10⁸ — converted on the digits themselves, so a 21-digit number keeps all 21 digits instead of being rounded by floating point.',
    widget: 'sci-notation',
    how: 'Both directions work on the digit string, not on a floating-point value. Number → scientific: find the first significant digit, place the decimal point after it, count how many places the point moved — that count is the exponent (positive for large numbers, negative for small ones like 0.00042 = 4.2 × 10⁻⁴). Scientific → number: shift the mantissa\'s decimal point by the exponent, padding zeros as needed. Because no float conversion ever happens, 123456789012345678901 converts exactly — a float-based tool would corrupt it to …78901 ≈ …79000 territory (doubles hold only ~15–17 significant digits). E-notation (2.998e8) is shown alongside, since that\'s what code and spreadsheets speak.',
    note: 'Scientific notation is really about significant figures: writing 2.99792458 × 10⁸ m/s asserts nine of them. When converting measured values, keep only the digits you actually know — the notation makes the claim visible. The ×10ⁿ form and e-notation are the same thing in different clothes; calculators and programming languages use e-notation because superscripts don\'t fit in ASCII.',
    faqs: [
      { q: 'How do I convert a number to scientific notation?', a: 'Move the decimal point until exactly one non-zero digit is left of it; the number of places moved is the exponent — positive if the original number was ≥ 10, negative if it was < 1. 0.00042 → 4.2 × 10⁻⁴ (moved 4 right).' },
      { q: 'What is e-notation?', a: 'The plain-text form of scientific notation used by calculators and code: 2.998e8 means 2.998 × 10⁸, and 4.2e-4 means 4.2 × 10⁻⁴. The tool shows both.' },
      { q: 'Why "digit-exact" — what goes wrong otherwise?', a: 'Converting via floating point limits you to ~15–17 significant digits: 123456789012345678901 silently becomes 123456789012345677312. This tool moves the decimal point in the digit string itself, so every digit survives.' },
      { q: 'What about significant figures?', a: 'Scientific notation displays them explicitly — 2.99792458 × 10⁸ claims nine. This converter preserves exactly the digits you type (trailing zeros after the point included in the mantissa you enter); deciding how many to keep is a judgment about your measurement, not the converter\'s.' },
      { q: 'Does it run locally?', a: 'Yes — pure string arithmetic in your browser, offline-capable.' },
    ],
    keywords: ['scientific notation converter', 'convert to scientific notation', 'e notation', 'standard form converter', 'scientific notation calculator', '10 to the power converter'],
  },
  {
    slug: 'permutations-combinations',
    name: 'Permutations & Combinations Calculator',
    icon: '🎲',
    description:
      'nCr, nPr and factorials computed exactly with big integers — C(52,5) = 2,598,960 poker hands, and 1000! digit-perfect where calculators overflow. In your browser.',
    lead: 'How many 5-card poker hands? C(52, 5) = 2,598,960 — exactly. Combinations, permutations and factorials with arbitrary-precision integers, formulas shown.',
    widget: 'perm-comb',
    how: 'Combinations C(n, r) count selections where order doesn\'t matter (poker hands, lottery picks, committee choices); permutations P(n, r) count arrangements where it does (podium finishes, passwords from distinct symbols). Both formulas — C = n!/(r!(n−r)!) and P = n!/(n−r)! — are computed with exact big-integer arithmetic using overflow-free running products, and n! itself is shown when it fits on screen. Ordinary calculators die at 170! (floating-point overflow); here 1000! simply appears, all 2,568 digits of it (abbreviated for readability, digit count stated).',
    note: 'The order-matters question is the whole subject: from 5 people, picking a committee of 2 gives C(5,2) = 10, but picking a president and a vice-president gives P(5,2) = 20 — same people, double the count, because (Alice, Bob) ≠ (Bob, Alice) when the roles differ. Get that question right and the formula picks itself. A cross-check worth knowing: C(n,r) = C(n,n−r) — choosing 5 cards to keep is the same as choosing 47 to discard.',
    faqs: [
      { q: 'What\'s the difference between permutations and combinations?', a: 'Combinations ignore order (a poker hand is the same 5 cards however dealt); permutations count order (gold-silver-bronze among 3 of 8 runners). C(52,5) = 2,598,960 but P(52,5) = 311,875,200.' },
      { q: 'What are the formulas?', a: 'C(n,r) = n! / (r!(n−r)!) and P(n,r) = n! / (n−r)!, where n! = n×(n−1)×…×1. They\'re shown on the page with your numbers substituted.' },
      { q: 'Why do normal calculators fail at large factorials?', a: 'They compute in 64-bit floating point, which overflows past ~1.8×10³⁰⁸ — reached at 171!. This tool uses arbitrary-precision integers, so 1000! (2,568 digits) is computed exactly.' },
      { q: 'What are the odds of winning a 6-of-49 lottery?', a: 'One in C(49,6) = 13,983,816. Type n=49, r=6 and see it — combinations, because the draw order doesn\'t matter.' },
      { q: 'Is anything sent to a server?', a: 'No — exact BigInt arithmetic in your browser, offline-capable.' },
    ],
    keywords: ['permutations and combinations calculator', 'ncr calculator', 'npr calculator', 'factorial calculator', 'combinations formula', 'how many combinations', 'binomial coefficient'],
  },
];
