/** Physics compute — SUVAT kinematics solver. Deterministic; positive-root convention on √. */

export interface Suvat { u?: number; v?: number; a?: number; s?: number; t?: number }
export interface SuvatSolution { u: number; v: number; a: number; s: number; t: number; note?: string }

const has = (x: number | undefined): x is number => x != null && isFinite(x);

/**
 * Solve the SUVAT equations given exactly three of {u, v, a, s, t}.
 * Returns all five, or null if not solvable. Uses the positive root for v/u where ambiguous.
 */
export function solveSuvat(input: Suvat): SuvatSolution | null {
  let { u, v, a, s, t } = input;
  const known = [u, v, a, s, t].filter(has).length;
  if (known < 3) return null;
  let note: string | undefined;

  // iterate the five equations until all are filled (handles the 10 cases uniformly)
  for (let pass = 0; pass < 6; pass++) {
    // v = u + at
    if (!has(v) && has(u) && has(a) && has(t)) v = u + a * t;
    if (!has(u) && has(v) && has(a) && has(t)) u = v - a * t;
    if (!has(a) && has(v) && has(u) && has(t) && t !== 0) a = (v - u) / t;
    if (!has(t) && has(v) && has(u) && has(a) && a !== 0) t = (v - u) / a;

    // s = ½(u+v)t
    if (!has(s) && has(u) && has(v) && has(t)) s = 0.5 * (u + v) * t;
    if (!has(t) && has(s) && has(u) && has(v) && u + v !== 0) t = (2 * s) / (u + v);
    if (!has(u) && has(s) && has(v) && has(t) && t !== 0) u = (2 * s) / t - v;
    if (!has(v) && has(s) && has(u) && has(t) && t !== 0) v = (2 * s) / t - u;

    // v² = u² + 2as
    if (!has(v) && has(u) && has(a) && has(s)) { const v2 = u * u + 2 * a * s; if (v2 >= 0) { v = Math.sqrt(v2); note = 'positive root taken for v'; } }
    if (!has(u) && has(v) && has(a) && has(s)) { const u2 = v * v - 2 * a * s; if (u2 >= 0) { u = Math.sqrt(u2); note = 'positive root taken for u'; } }
    if (!has(a) && has(v) && has(u) && has(s) && s !== 0) a = (v * v - u * u) / (2 * s);
    if (!has(s) && has(v) && has(u) && has(a) && a !== 0) s = (v * v - u * u) / (2 * a);

    // s = ut + ½at²
    if (!has(s) && has(u) && has(t) && has(a)) s = u * t + 0.5 * a * t * t;
    if (!has(a) && has(s) && has(u) && has(t) && t !== 0) a = (2 * (s - u * t)) / (t * t);
    if (!has(u) && has(s) && has(t) && has(a) && t !== 0) u = (s - 0.5 * a * t * t) / t;

    // s = vt − ½at²
    if (!has(s) && has(v) && has(t) && has(a)) s = v * t - 0.5 * a * t * t;
    if (!has(v) && has(s) && has(t) && has(a) && t !== 0) v = (s + 0.5 * a * t * t) / t;

    if ([u, v, a, s, t].every(has)) break;
  }

  if (![u, v, a, s, t].every(has)) return null;
  return { u: u!, v: v!, a: a!, s: s!, t: t!, note };
}
