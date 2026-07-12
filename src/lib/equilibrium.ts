/**
 * Chemical equilibrium & thermochemistry math for the /chemistry/ category.
 * Weak acid/base pH (ICE quadratic), Ksp ↔ molar solubility, the equilibrium
 * constant / reaction-quotient ICE solver, and enthalpy of reaction (Hess's
 * law) from formation enthalpies. Pure algebra with user-entered constants —
 * no invented data. Standard general-chemistry conventions (IUPAC/textbook).
 */

/**
 * Weak monoprotic acid: HA ⇌ H⁺ + A⁻, Ka = x²/(C−x). Solve the quadratic
 * x² + Ka·x − Ka·C = 0 exactly. Returns [H⁺], pH, and % ionization.
 */
export function weakAcidPh(ka: number, conc: number): { h: number; ph: number; ionizationPct: number } | null {
  if (ka <= 0 || conc <= 0) return null;
  const x = (-ka + Math.sqrt(ka * ka + 4 * ka * conc)) / 2; // positive root
  if (x <= 0 || x > conc) return null;
  return { h: x, ph: -Math.log10(x), ionizationPct: (x / conc) * 100 };
}

/**
 * Weak base: B + H₂O ⇌ BH⁺ + OH⁻, Kb = x²/(C−x). Returns [OH⁻], pOH, pH
 * (at 25 °C, pKw = 14) and % ionization.
 */
export function weakBasePh(kb: number, conc: number): { oh: number; poh: number; ph: number; ionizationPct: number } | null {
  if (kb <= 0 || conc <= 0) return null;
  const x = (-kb + Math.sqrt(kb * kb + 4 * kb * conc)) / 2;
  if (x <= 0 || x > conc) return null;
  const poh = -Math.log10(x);
  return { oh: x, poh, ph: 14 - poh, ionizationPct: (x / conc) * 100 };
}

/** pKa ↔ Ka helpers. */
export const kaToPka = (ka: number) => -Math.log10(ka);
export const pkaToKa = (pka: number) => Math.pow(10, -pka);

/**
 * Molar solubility of a salt AₐBᵦ ⇌ a·Aⁿ⁺ + b·Bᵐ⁻ in pure water from Ksp.
 *   Ksp = (a·s)^a · (b·s)^b = a^a · b^b · s^(a+b)
 *   s = (Ksp / (a^a · b^b))^(1/(a+b))
 */
export function molarSolubility(ksp: number, a: number, b: number): number | null {
  if (ksp <= 0 || a < 1 || b < 1) return null;
  const denom = Math.pow(a, a) * Math.pow(b, b);
  return Math.pow(ksp / denom, 1 / (a + b));
}

/** Ksp from a measured molar solubility s (inverse of the above). */
export function kspFromSolubility(s: number, a: number, b: number): number | null {
  if (s <= 0 || a < 1 || b < 1) return null;
  return Math.pow(a * s, a) * Math.pow(b * s, b);
}

/**
 * Molar solubility with a common ion already present (concentration `common`
 * of the a-type ion). Solves Ksp = (common + a·s)^a · (b·s)^b for s by
 * bisection. The common-ion effect suppresses solubility.
 */
export function molarSolubilityCommonIon(ksp: number, a: number, b: number, common: number): number | null {
  if (ksp <= 0 || a < 1 || b < 1 || common < 0) return null;
  if (common === 0) return molarSolubility(ksp, a, b);
  const f = (s: number) => Math.pow(common + a * s, a) * Math.pow(b * s, b) - ksp;
  let lo = 0, hi = molarSolubility(ksp, a, b)!; // solubility without common ion is an upper bound
  // ensure sign change
  if (f(hi) < 0) { hi *= 10; }
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}

export interface Species { coeff: number; conc: number; }
/**
 * Reaction quotient Q for aA + bB ⇌ cC + dD (any species may be absent by
 * passing an empty list). Q = ∏[products]^coeff / ∏[reactants]^coeff.
 */
export function reactionQuotient(reactants: Species[], products: Species[]): number | null {
  let num = 1, den = 1;
  for (const p of products) { if (p.conc < 0) return null; num *= Math.pow(p.conc, p.coeff); }
  for (const r of reactants) { if (r.conc < 0) return null; den *= Math.pow(r.conc, r.coeff); }
  if (den === 0) return num === 0 ? null : Infinity;
  return num / den;
}

/**
 * ICE solver: given initial concentrations and Kc, find the extent of reaction
 * ξ and the equilibrium concentrations. Concentrations at equilibrium:
 *   [reactant_i] = R0_i − coeff_i·ξ ,  [product_j] = P0_j + coeff_j·ξ
 * Q(ξ) is monotincreasing in ξ, so bisect for Q(ξ) = Kc within the physical
 * range that keeps all concentrations ≥ 0.
 */
export function solveEquilibrium(reactants: Species[], products: Species[], kc: number): {
  xi: number; reactants: number[]; products: number[]; direction: 'forward' | 'reverse' | 'equilibrium';
} | null {
  if (kc <= 0) return null;
  // Physical range for ξ: forward limited by reactants, reverse limited by products.
  let xiMax = Infinity, xiMin = -Infinity;
  for (const r of reactants) xiMax = Math.min(xiMax, r.conc / r.coeff);
  for (const p of products) xiMin = Math.max(xiMin, -p.conc / p.coeff);
  if (!isFinite(xiMax)) xiMax = 1e6;
  if (!isFinite(xiMin)) xiMin = -1e6;
  if (xiMax <= xiMin) return null;

  const concAt = (xi: number) => ({
    r: reactants.map((s) => s.conc - s.coeff * xi),
    p: products.map((s) => s.conc + s.coeff * xi),
  });
  const qAt = (xi: number) => {
    const { r, p } = concAt(xi);
    let num = 1, den = 1;
    products.forEach((s, i) => { num *= Math.pow(Math.max(0, p[i]), s.coeff); });
    reactants.forEach((s, i) => { den *= Math.pow(Math.max(0, r[i]), s.coeff); });
    if (den === 0) return Infinity;
    return num / den;
  };

  // Initial Q to report direction.
  const q0 = reactionQuotient(reactants, products);
  const direction: 'forward' | 'reverse' | 'equilibrium' =
    q0 == null ? 'forward' : Math.abs(q0 - kc) < 1e-12 ? 'equilibrium' : q0 < kc ? 'forward' : 'reverse';

  // Bisect Q(ξ) = Kc on (xiMin, xiMax), nudging off the open ends.
  const eps = (xiMax - xiMin) * 1e-9;
  let lo = xiMin + eps, hi = xiMax - eps;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (qAt(mid) > kc) hi = mid; else lo = mid;
  }
  const xi = (lo + hi) / 2;
  const { r, p } = concAt(xi);
  return { xi, reactants: r, products: p, direction };
}

export interface EnthalpyTerm { coeff: number; hf: number; }
/**
 * Standard enthalpy of reaction from formation enthalpies (Hess's law):
 *   ΔH°rxn = Σ(coeff·ΔHf products) − Σ(coeff·ΔHf reactants)
 */
export function enthalpyOfReaction(reactants: EnthalpyTerm[], products: EnthalpyTerm[]): number {
  const sum = (arr: EnthalpyTerm[]) => arr.reduce((acc, t) => acc + t.coeff * t.hf, 0);
  return sum(products) - sum(reactants);
}

/** Hess's law by summing reaction steps (each optionally reversed/scaled). */
export function hessSum(steps: { deltaH: number; multiplier: number }[]): number {
  return steps.reduce((acc, s) => acc + s.deltaH * s.multiplier, 0);
}
