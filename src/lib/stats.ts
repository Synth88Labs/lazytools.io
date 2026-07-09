/**
 * Statistical special functions and distribution CDF/PDF/quantiles for the Statistics category.
 * Pure JS, double precision. Accuracy targeted to ~1e-10 for the core functions where feasible;
 * tails and extreme parameters degrade gracefully — every tool that uses these states its limits.
 *
 * References: Abramowitz & Stegun; Numerical Recipes (incomplete beta/gamma via continued fractions);
 * Acklam's inverse-normal rational approximation refined by one Halley step.
 */

// ---------- log-gamma (Lanczos) ----------

const LG = [
  676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012,
  9.9843695780195716e-6, 1.5056327351493116e-7,
];

export function logGamma(z: number): number {
  if (z < 0.5) {
    // reflection
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < LG.length; i++) x += LG[i]! / (z + i + 1);
  const t = z + LG.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function gammaFn(z: number): number {
  return Math.exp(logGamma(z));
}

export function logBeta(a: number, b: number): number {
  return logGamma(a) + logGamma(b) - logGamma(a + b);
}

// ---------- error function ----------

/** erf via Abramowitz-Stegun 7.1.26 refined; ~1e-9 accuracy. */
export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  // use high-accuracy rational (Numerical Recipes erfc style)
  const t = 1 / (1 + 0.5 * x);
  const tau = t * Math.exp(
    -x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
    t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
    t * (-0.82215223 + t * 0.17087277))))))))
  );
  return sign * (1 - tau);
}

// ---------- normal distribution ----------

export function normalPdf(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/** Standard normal CDF Φ(z). */
export function normalCdf(x: number, mu = 0, sigma = 1): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
}

/** Inverse standard normal (quantile) — Acklam's algorithm + one Halley refinement. */
export function normalInv(p: number, mu = 0, sigma = 1): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425, phigh = 1 - plow;
  let x: number;
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) / ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else if (p <= phigh) {
    const q = p - 0.5, r = q * q;
    x = (((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q / (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) / ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  }
  // one Halley step
  const e = normalCdf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
  x = x - u / (1 + x * u / 2);
  return mu + sigma * x;
}

// ---------- incomplete gamma (regularized) ----------

/** Lower regularized incomplete gamma P(a, x). */
export function gammaP(a: number, x: number): number {
  if (x < 0 || a <= 0) return NaN;
  if (x === 0) return 0;
  if (x < a + 1) {
    // series
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 500; n++) {
      ap++;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-15) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  }
  return 1 - gammaQContinued(a, x);
}

/** Upper regularized incomplete gamma Q(a, x) via continued fraction. */
function gammaQContinued(a: number, x: number): number {
  const tiny = 1e-300;
  let b = x + 1 - a, c = 1 / tiny, d = 1 / b, h = d;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < tiny) d = tiny;
    c = b + an / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-15) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

export function gammaQ(a: number, x: number): number {
  return 1 - gammaP(a, x);
}

// ---------- incomplete beta (regularized) ----------

/** Regularized incomplete beta I_x(a, b). */
export function betaI(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lbeta = logBeta(a, b);
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lbeta) / a;
  if (x < (a + 1) / (a + b + 2)) {
    return front * betaCF(x, a, b);
  }
  return 1 - Math.exp(b * Math.log(1 - x) + a * Math.log(x) - lbeta) / b * betaCF(1 - x, b, a);
}

function betaCF(x: number, a: number, b: number): number {
  const tiny = 1e-300;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let h = d;
  for (let m = 1; m < 500; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c; if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return h;
}

// ---------- Student t ----------

/** Two-tailed / lower CDF of Student's t with df degrees of freedom. */
export function tCdf(t: number, df: number): number {
  const x = df / (df + t * t);
  const ib = 0.5 * betaI(x, df / 2, 0.5);
  return t > 0 ? 1 - ib : ib;
}

/** Inverse t (quantile) by bisection on tCdf. */
export function tInv(p: number, df: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  let lo = -1e4, hi = 1e4;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- chi-square ----------

export function chiSqCdf(x: number, df: number): number {
  if (x <= 0) return 0;
  return gammaP(df / 2, x / 2);
}
export function chiSqInv(p: number, df: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  let lo = 0, hi = 1e6;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (chiSqCdf(mid, df) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- F distribution ----------

export function fCdf(x: number, d1: number, d2: number): number {
  if (x <= 0) return 0;
  return betaI(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2);
}
export function fInv(p: number, d1: number, d2: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  let lo = 0, hi = 1e6;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (fCdf(mid, d1, d2) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------- discrete distributions ----------

/** exact binomial coefficient as float (uses logGamma to avoid overflow for large n). */
export function binomCoefLog(n: number, k: number): number {
  return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
}

export function binomPmf(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return Math.exp(binomCoefLog(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}
/** P(X <= k) for binomial. */
export function binomCdf(k: number, n: number, p: number): number {
  let s = 0;
  for (let i = 0; i <= k; i++) s += binomPmf(i, n, p);
  return Math.min(1, s);
}

export function poissonPmf(k: number, lambda: number): number {
  if (k < 0) return 0;
  return Math.exp(-lambda + k * Math.log(lambda) - logGamma(k + 1));
}
export function poissonCdf(k: number, lambda: number): number {
  let s = 0;
  for (let i = 0; i <= k; i++) s += poissonPmf(i, lambda);
  return Math.min(1, s);
}

export function geometricPmf(k: number, p: number): number {
  // k = number of trials until first success (k >= 1)
  if (k < 1) return 0;
  return p * Math.pow(1 - p, k - 1);
}

// ---------- regression ----------

export interface Regression {
  slope: number;
  intercept: number;
  r: number;
  r2: number;
  n: number;
  meanX: number;
  meanY: number;
  sxx: number;
  syy: number;
  sxy: number;
  seSlope: number;
  seIntercept: number;
  residualSE: number;
}

export function linearRegression(xs: number[], ys: number[]): Regression {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i]! - meanX) ** 2;
    syy += (ys[i]! - meanY) ** 2;
    sxy += (xs[i]! - meanX) * (ys[i]! - meanY);
  }
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const r = sxy / Math.sqrt(sxx * syy);
  const ssRes = syy - slope * sxy;
  const residualSE = n > 2 ? Math.sqrt(ssRes / (n - 2)) : 0;
  const seSlope = residualSE / Math.sqrt(sxx);
  const seIntercept = residualSE * Math.sqrt(1 / n + meanX * meanX / sxx);
  return { slope, intercept, r, r2: r * r, n, meanX, meanY, sxx, syy, sxy, seSlope, seIntercept, residualSE };
}
