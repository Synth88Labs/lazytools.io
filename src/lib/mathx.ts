/** Exact-arithmetic helpers for the Mathematics tools. BigInt/rational throughout — no floating point where it matters. */

// ---------- BigInt basics ----------

export function absB(a: bigint): bigint {
  return a < 0n ? -a : a;
}

export function gcdB(a: bigint, b: bigint): bigint {
  a = absB(a);
  b = absB(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcmB(a: bigint, b: bigint): bigint {
  if (a === 0n || b === 0n) return 0n;
  return absB(a / gcdB(a, b) * b);
}

/** Euclidean algorithm steps for display: [a, b, quotient, remainder][] */
export function gcdSteps(a: bigint, b: bigint): { a: bigint; b: bigint; q: bigint; r: bigint }[] {
  a = absB(a);
  b = absB(b);
  if (a < b) [a, b] = [b, a];
  const steps: { a: bigint; b: bigint; q: bigint; r: bigint }[] = [];
  while (b) {
    const q = a / b, r = a % b;
    steps.push({ a, b, q, r });
    [a, b] = [b, r];
  }
  return steps;
}

/** Integer square root (floor). */
export function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error('negative');
  if (n < 2n) return n;
  let x = n, y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}

// ---------- rationals ----------

export class Rat {
  n: bigint; // numerator (carries sign)
  d: bigint; // denominator > 0

  constructor(n: bigint, d: bigint = 1n) {
    if (d === 0n) throw new Error('Division by zero');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcdB(n, d) || 1n;
    this.n = n / g;
    this.d = d / g;
  }

  static parse(sRaw: string): Rat {
    const s = sRaw.trim();
    // mixed number: "1 2/3" or "-1 2/3"
    const mixed = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
    if (mixed) {
      const w = BigInt(mixed[1]!), num = BigInt(mixed[2]!), den = BigInt(mixed[3]!);
      const sign = mixed[1]!.startsWith('-') ? -1n : 1n;
      return new Rat(sign * (absB(w) * den + num), den);
    }
    const frac = s.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
    if (frac) return new Rat(BigInt(frac[1]!), BigInt(frac[2]!));
    const dec = s.match(/^(-?)(\d+)(?:\.(\d+))?$/);
    if (dec) {
      const sign = dec[1] === '-' ? -1n : 1n;
      const whole = BigInt(dec[2]!);
      const fracPart = dec[3] ?? '';
      const den = 10n ** BigInt(fracPart.length);
      return new Rat(sign * (whole * den + BigInt(fracPart || '0')), den);
    }
    throw new Error(`Not a number: "${s}" — use forms like 3, -1.25, 3/4 or 1 2/3`);
  }

  add(o: Rat) { return new Rat(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o: Rat) { return new Rat(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o: Rat) { return new Rat(this.n * o.n, this.d * o.d); }
  div(o: Rat) { if (o.n === 0n) throw new Error('Division by zero'); return new Rat(this.n * o.d, this.d * o.n); }
  neg() { return new Rat(-this.n, this.d); }
  isZero() { return this.n === 0n; }
  isInt() { return this.d === 1n; }
  sign() { return this.n < 0n ? -1 : this.n > 0n ? 1 : 0; }

  /** "7/4" or "7" */
  toFrac(): string {
    return this.d === 1n ? String(this.n) : `${this.n}/${this.d}`;
  }

  /** "1 3/4" style (falls back to plain) */
  toMixed(): string {
    if (this.d === 1n) return String(this.n);
    const w = this.n / this.d;
    const rem = absB(this.n % this.d);
    return w === 0n ? `${this.n < 0n ? '-' : ''}${rem}/${this.d}` : `${w} ${rem}/${this.d}`;
  }

  /** decimal with up to `places` digits, exact-marked when terminating */
  toDecimal(places = 12): { text: string; exact: boolean } {
    const sign = this.n < 0n ? '-' : '';
    let n = absB(this.n);
    const whole = n / this.d;
    let rem = n % this.d;
    if (rem === 0n) return { text: sign + String(whole), exact: true };
    let digits = '';
    for (let i = 0; i < places && rem !== 0n; i++) {
      rem *= 10n;
      digits += String(rem / this.d);
      rem %= this.d;
    }
    return { text: `${sign}${whole}.${digits}`, exact: rem === 0n };
  }
}

/** Repeating decimal "0.1(6)" or "1.2(45)" → exact rational. Also plain decimals. */
export function repeatingToRat(sRaw: string): Rat {
  const s = sRaw.trim();
  const m = s.match(/^(-?)(\d+)(?:\.(\d*))?\((\d+)\)$/);
  if (!m) return Rat.parse(s);
  const [, signS, wholeS, fixedS = '', repS] = m;
  const sign = signS === '-' ? -1n : 1n;
  const fixedLen = BigInt(fixedS!.length);
  const repLen = BigInt(repS!.length);
  // value = whole.fixed(rep) → ((whole·10^f + fixed)·(10^r −1) + rep) / (10^f·(10^r −1))
  const tenF = 10n ** fixedLen;
  const tenR = 10n ** repLen;
  const base = BigInt(wholeS!) * tenF + BigInt(fixedS || '0');
  const num = base * (tenR - 1n) + BigInt(repS!);
  const den = tenF * (tenR - 1n);
  return new Rat(sign * num, den);
}

// ---------- primes & factorization ----------

function mulmod(a: bigint, b: bigint, m: bigint): bigint {
  return (a * b) % m;
}
export function powmod(b: bigint, e: bigint, m: bigint): bigint {
  let r = 1n;
  b %= m;
  while (e > 0n) {
    if (e & 1n) r = mulmod(r, b, m);
    b = mulmod(b, b, m);
    e >>= 1n;
  }
  return r;
}

/** Deterministic Miller–Rabin for n < 3.3·10^24 (fixed witness set). */
export function isPrime(n: bigint): boolean {
  if (n < 2n) return false;
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n % p === 0n) return n === p;
  }
  let d = n - 1n, r = 0n;
  while ((d & 1n) === 0n) { d >>= 1n; r++; }
  outer: for (const a of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    let x = powmod(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    for (let i = 1n; i < r; i++) {
      x = mulmod(x, x, n);
      if (x === n - 1n) continue outer;
    }
    return false;
  }
  return true;
}

function pollardRho(n: bigint): bigint {
  if ((n & 1n) === 0n) return 2n;
  for (let c = 1n; ; c++) {
    let x = 2n, y = 2n, d = 1n;
    while (d === 1n) {
      x = (mulmod(x, x, n) + c) % n;
      y = (mulmod(y, y, n) + c) % n;
      y = (mulmod(y, y, n) + c) % n;
      d = gcdB(absB(x - y), n);
    }
    if (d !== n) return d;
  }
}

/** Prime factorization as [prime, exponent][] — practical for inputs up to ~10^18. */
export function factorize(nIn: bigint): [bigint, bigint][] {
  let n = nIn;
  const out = new Map<string, { p: bigint; e: bigint }>();
  const push = (p: bigint) => {
    const k = String(p);
    const cur = out.get(k) ?? { p, e: 0n };
    cur.e++;
    out.set(k, cur);
  };
  for (const p of [2n, 3n, 5n]) while (n % p === 0n) { push(p); n /= p; }
  let f = 7n;
  const wheel = [4n, 2n, 4n, 2n, 4n, 6n, 2n, 6n];
  let wi = 0;
  while (f * f <= n && f < 100000n) {
    while (n % f === 0n) { push(f); n /= f; }
    f += wheel[wi]!;
    wi = (wi + 1) % 8;
  }
  const stack = [n];
  while (stack.length) {
    const m = stack.pop()!;
    if (m === 1n) continue;
    if (isPrime(m)) { push(m); continue; }
    const d = pollardRho(m);
    stack.push(d, m / d);
  }
  return [...out.values()].sort((a, b) => (a.p < b.p ? -1 : 1)).map((x) => [x.p, x.e]);
}

/** Extract the largest square factor: n = k²·m → [k, m]. (n ≥ 0) */
export function extractSquare(n: bigint): [bigint, bigint] {
  if (n === 0n) return [0n, 0n];
  let k = 1n, m = 1n;
  for (const [p, e] of factorize(n)) {
    k *= p ** (e / 2n);
    m *= p ** (e % 2n);
  }
  return [k, m];
}

// ---------- combinatorics ----------

export function factorialB(n: number): bigint {
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}
export function nPr(n: number, r: number): bigint {
  let out = 1n;
  for (let i = 0n; i < BigInt(r); i++) out *= BigInt(n) - i;
  return out;
}
export function nCr(n: number, r: number): bigint {
  if (r > n - r) r = n - r;
  let out = 1n;
  for (let i = 1n; i <= BigInt(r); i++) out = (out * (BigInt(n) - BigInt(r) + i)) / i;
  return out;
}

// ---------- long division ----------

export interface DivisionStep {
  /** digit of the dividend brought down (or '' for the first chunk) */
  digit: string;
  /** working value after bring-down */
  partial: bigint;
  /** quotient digit chosen */
  q: bigint;
  /** q × divisor subtracted */
  product: bigint;
  /** remainder after subtraction */
  rem: bigint;
}

export interface LongDivision {
  quotient: bigint;
  remainder: bigint;
  steps: DivisionStep[];
  /** decimal continuation digits (post-point), with repetend bounds if periodic */
  decimalDigits: string;
  repeatStart: number; // index into decimalDigits, -1 if terminating/none
  truncated: boolean;
}

/** Classic long-division working: integer phase digit by digit, then decimal phase with repetend detection. */
export function longDivision(dividend: bigint, divisor: bigint, maxDecimals = 60): LongDivision {
  if (divisor === 0n) throw new Error('Division by zero');
  if (dividend < 0n || divisor < 0n) throw new Error('Use non-negative integers (apply signs at the end).');
  const digits = String(dividend).split('');
  const steps: DivisionStep[] = [];
  let cur = 0n;
  let quotient = 0n;
  for (const d of digits) {
    cur = cur * 10n + BigInt(d);
    const q = cur / divisor;
    const product = q * divisor;
    const rem = cur - product;
    steps.push({ digit: d, partial: cur, q, product, rem });
    quotient = quotient * 10n + q;
    cur = rem;
  }
  // decimal phase with cycle detection on remainders
  let decimalDigits = '';
  let repeatStart = -1;
  let truncated = false;
  if (cur !== 0n) {
    const seen = new Map<string, number>();
    let rem = cur;
    while (rem !== 0n) {
      const key = String(rem);
      if (seen.has(key)) { repeatStart = seen.get(key)!; break; }
      if (decimalDigits.length >= maxDecimals) { truncated = true; break; }
      seen.set(key, decimalDigits.length);
      rem *= 10n;
      decimalDigits += String(rem / divisor);
      rem %= divisor;
    }
  }
  return { quotient, remainder: cur, steps, decimalDigits, repeatStart, truncated };
}

// ---------- extended Euclid & modular arithmetic ----------

export interface EgcdRow {
  a: bigint; b: bigint; q: bigint; r: bigint; x: bigint; y: bigint;
}

/** Extended Euclidean algorithm with the full back-substitution table: g = gcd, and x·a + y·b = g. */
export function egcd(aIn: bigint, bIn: bigint): { g: bigint; x: bigint; y: bigint; rows: EgcdRow[] } {
  let [old_r, r] = [aIn, bIn];
  let [old_x, x] = [1n, 0n];
  let [old_y, y] = [0n, 1n];
  const rows: EgcdRow[] = [];
  while (r !== 0n) {
    const q = old_r / r;
    rows.push({ a: old_r, b: r, q, r: old_r - q * r, x, y });
    [old_r, r] = [r, old_r - q * r];
    [old_x, x] = [x, old_x - q * x];
    [old_y, y] = [y, old_y - q * y];
  }
  return { g: old_r, x: old_x, y: old_y, rows };
}

/** Modular inverse of a mod n (throws when gcd(a,n) ≠ 1). */
export function modInverse(a: bigint, n: bigint): bigint {
  const { g, x } = egcd(((a % n) + n) % n, n);
  if (g !== 1n) throw new Error(`No inverse: gcd(${a}, ${n}) = ${g} ≠ 1 — inverses exist only when a and n are coprime.`);
  return ((x % n) + n) % n;
}

export interface PowmodStep {
  bit: string;
  op: 'square' | 'square+multiply' | 'init';
  acc: bigint;
}

/** Square-and-multiply trace for a^e mod n (MSB-first), for teaching displays. */
export function powmodTrace(base: bigint, exp: bigint, mod: bigint): { result: bigint; steps: PowmodStep[] } {
  if (mod <= 0n) throw new Error('Modulus must be positive.');
  const bits = exp.toString(2);
  let acc = 1n;
  const b = ((base % mod) + mod) % mod;
  const steps: PowmodStep[] = [];
  for (const bit of bits) {
    const isFirst = steps.length === 0;
    acc = (acc * acc) % mod;
    if (bit === '1') acc = (acc * b) % mod;
    steps.push({ bit, op: isFirst ? 'init' : bit === '1' ? 'square+multiply' : 'square', acc });
  }
  return { result: acc, steps };
}

// ---------- exact radicals of rationals ----------

/** √(r) for a non-negative rational, as coef·√radicand with radicand square-free: √(p/q) = √(pq)/q. */
export function sqrtRatSimplified(r: Rat): { coef: Rat; radicand: bigint } {
  if (r.sign() < 0) throw new Error('Square root of a negative number is not real.');
  if (r.isZero()) return { coef: new Rat(0n), radicand: 1n };
  const [k, m] = extractSquare(r.n * r.d);
  return { coef: new Rat(k, r.d), radicand: m };
}

/** Format coef·√radicand for display: "6√5", "√2/3", "4" (radicand 1). */
export function radicalToString(coef: Rat, radicand: bigint): string {
  if (coef.isZero()) return '0';
  if (radicand === 1n) return coef.toFrac();
  const surd = `√${radicand}`;
  if (coef.n === 1n && coef.d === 1n) return surd;
  if (coef.n === -1n && coef.d === 1n) return `-${surd}`;
  if (coef.d === 1n) return `${coef.n}${surd}`;
  const numPart = coef.n === 1n ? surd : coef.n === -1n ? `-${surd}` : `${coef.n}${surd}`;
  return `${numPart}/${coef.d}`;
}

// ---------- roman numerals ----------

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

export function toRoman(nIn: number): string {
  if (!Number.isInteger(nIn) || nIn < 1 || nIn > 3999) throw new Error('Standard Roman numerals cover 1–3999.');
  let n = nIn;
  let out = '';
  for (const [v, sym] of ROMAN) while (n >= v) { out += sym; n -= v; }
  return out;
}

export function fromRoman(sRaw: string): number {
  const s = sRaw.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(s)) throw new Error('Only the letters M, D, C, L, X, V, I are valid.');
  const val: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = val[s[i]!]!, next = val[s[i + 1] ?? ''] ?? 0;
    total += cur < next ? -cur : cur;
  }
  if (total < 1 || total > 3999 || toRoman(total) !== s) throw new Error(`"${s}" is not a well-formed Roman numeral (its canonical spelling is ${total >= 1 && total <= 3999 ? toRoman(total) : 'out of range'}).`);
  return total;
}

// ---------- statistics ----------

export interface Stats {
  n: number;
  sum: number;
  mean: number;
  median: number;
  modes: number[];
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  varPop: number;
  varSample: number;
  sdPop: number;
  sdSample: number;
}

function medianOf(sorted: number[]): number {
  const n = sorted.length;
  return n % 2 ? sorted[(n - 1) / 2]! : (sorted[n / 2 - 1]! + sorted[n / 2]!) / 2;
}

export function computeStats(values: number[]): Stats {
  const xs = [...values].sort((a, b) => a - b);
  const n = xs.length;
  const sum = xs.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = medianOf(xs);
  // modes
  const freq = new Map<number, number>();
  for (const x of xs) freq.set(x, (freq.get(x) ?? 0) + 1);
  const maxF = Math.max(...freq.values());
  const modes = maxF > 1 ? [...freq.entries()].filter(([, f]) => f === maxF).map(([v]) => v) : [];
  // quartiles: median-of-halves, excluding the median for odd n (Moore & McCabe)
  const lower = xs.slice(0, Math.floor(n / 2));
  const upper = xs.slice(Math.ceil(n / 2));
  const q1 = lower.length ? medianOf(lower) : xs[0]!;
  const q3 = upper.length ? medianOf(upper) : xs[n - 1]!;
  const ss = xs.reduce((a, x) => a + (x - mean) * (x - mean), 0);
  const varPop = ss / n;
  const varSample = n > 1 ? ss / (n - 1) : 0;
  return {
    n, sum, mean, median, modes,
    min: xs[0]!, max: xs[n - 1]!, range: xs[n - 1]! - xs[0]!,
    q1, q3, iqr: q3 - q1,
    varPop, varSample,
    sdPop: Math.sqrt(varPop), sdSample: Math.sqrt(varSample),
  };
}
