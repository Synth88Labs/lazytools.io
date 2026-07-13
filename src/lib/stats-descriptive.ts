/**
 * Descriptive statistics for a numeric data set — the summary numbers behind a
 * "5-number summary" plus mean, variance and standard deviation. Quartiles and
 * percentiles use linear interpolation between order statistics (the inclusive
 * "R-7" method, matching Excel's PERCENTILE.INC), the most common convention.
 */

export interface Describe {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[]; // may be multi-modal; empty-ish → all values unique returns all? no: returns [] when no repeat
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  variancePop: number;
  varianceSample: number;
  stdDevPop: number;
  stdDevSample: number;
}

/** Parse a free-form string (commas, spaces, newlines, tabs) into numbers. */
export function parseNumbers(s: string): number[] {
  return s.split(/[\s,;]+/).map((t) => parseFloat(t)).filter((n) => Number.isFinite(n));
}

/** Percentile (p in [0,1]) by linear interpolation on the sorted data (R-7 / Excel INC). */
export function percentile(sorted: number[], p: number): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  if (n === 1) return sorted[0];
  const rank = p * (n - 1);
  const lo = Math.floor(rank);
  const frac = rank - lo;
  if (lo + 1 >= n) return sorted[n - 1];
  return sorted[lo] + frac * (sorted[lo + 1] - sorted[lo]);
}

/** The most frequent value(s); returns [] if every value is unique (no mode). */
export function modes(data: number[]): number[] {
  const counts = new Map<number, number>();
  for (const x of data) counts.set(x, (counts.get(x) ?? 0) + 1);
  let max = 0;
  for (const c of counts.values()) if (c > max) max = c;
  if (max <= 1) return []; // all unique → no mode
  return [...counts.entries()].filter(([, c]) => c === max).map(([v]) => v).sort((a, b) => a - b);
}

/** Full descriptive summary. Returns null for an empty data set. */
export function describe(data: number[]): Describe | null {
  const n = data.length;
  if (n === 0) return null;
  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = percentile(sorted, 0.5);
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const ss = data.reduce((a, b) => a + (b - mean) ** 2, 0);
  const variancePop = ss / n;
  const varianceSample = n > 1 ? ss / (n - 1) : 0;
  return {
    count: n, sum, mean, median, mode: modes(data),
    min: sorted[0], max: sorted[n - 1], range: sorted[n - 1] - sorted[0],
    q1, q3, iqr: q3 - q1,
    variancePop, varianceSample,
    stdDevPop: Math.sqrt(variancePop), stdDevSample: Math.sqrt(varianceSample),
  };
}

/** Standard score: how many standard deviations x is from the mean. */
export function zScore(x: number, mean: number, sd: number): number | null {
  return sd > 0 ? (x - mean) / sd : null;
}

/* ---------------- Geometric & harmonic means ---------------- */

/** Geometric mean = (∏xᵢ)^(1/n) = exp(mean(ln xᵢ)). Requires all values > 0. */
export function geometricMean(data: number[]): number | null {
  if (data.length === 0 || data.some((x) => x <= 0)) return null;
  const sumLn = data.reduce((s, x) => s + Math.log(x), 0);
  return Math.exp(sumLn / data.length);
}
/** Harmonic mean = n ÷ Σ(1/xᵢ). Requires all values > 0. */
export function harmonicMean(data: number[]): number | null {
  if (data.length === 0 || data.some((x) => x <= 0)) return null;
  const sumRecip = data.reduce((s, x) => s + 1 / x, 0);
  return data.length / sumRecip;
}

/* ---------------- Odds ↔ probability ---------------- */

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export interface OddsResult {
  probability: number;   // 0..1
  percent: number;       // 0..100
  decimalOdds: number;   // betting decimal odds = 1/p
  forA: number;          // simplified "for : against"
  forB: number;
}
/** Probability (0..1) and equivalent odds from "for : against" odds. */
export function oddsToProbability(forVal: number, againstVal: number): OddsResult | null {
  if (forVal < 0 || againstVal < 0 || forVal + againstVal <= 0) return null;
  const p = forVal / (forVal + againstVal);
  const g = gcd(forVal, againstVal);
  return { probability: p, percent: p * 100, decimalOdds: p > 0 ? 1 / p : Infinity, forA: forVal / g, forB: againstVal / g };
}
/** Odds and decimal odds from a probability given as a percentage (0..100). */
export function probabilityToOdds(percent: number): OddsResult | null {
  if (percent <= 0 || percent >= 100) return null;
  const p = percent / 100;
  // odds for:against = p : (1-p); scale to integers then simplify
  const scale = 1e6;
  const a = Math.round(p * scale);
  const b = Math.round((1 - p) * scale);
  const g = gcd(a, b);
  return { probability: p, percent, decimalOdds: 1 / p, forA: a / g, forB: b / g };
}
