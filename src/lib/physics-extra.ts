/**
 * Additional physics for the /physics/ category: Coulomb's law (electrostatics),
 * 1D collisions (elastic/inelastic via coefficient of restitution), special
 * relativity (Lorentz factor and its consequences), and standing waves /
 * harmonics. Pure textbook formulas; physical constants are CODATA/exact.
 */

/** Coulomb constant k = 1/(4πε₀), N·m²/C² (CODATA). */
export const COULOMB_K = 8.9875517873681764e9;
/** Speed of light in vacuum, m/s (exact, SI definition). */
export const SPEED_OF_LIGHT = 299792458;

/**
 * Coulomb's law: F = k·q₁·q₂ / r². Magnitude plus sign (attractive when the
 * product of charges is negative, repulsive when positive).
 */
export function coulombForce(q1: number, q2: number, r: number): { force: number; magnitude: number; attractive: boolean } | null {
  if (r <= 0) return null;
  const f = (COULOMB_K * q1 * q2) / (r * r);
  return { force: f, magnitude: Math.abs(f), attractive: q1 * q2 < 0 };
}

/** Separation r that produces a given force magnitude between two charges. */
export function coulombDistance(q1: number, q2: number, forceMag: number): number | null {
  if (forceMag <= 0) return null;
  return Math.sqrt((COULOMB_K * Math.abs(q1 * q2)) / forceMag);
}

/** Electric field magnitude from a point charge q at distance r: E = k·q / r². */
export function electricField(q: number, r: number): number | null {
  if (r <= 0) return null;
  return (COULOMB_K * q) / (r * r);
}

/**
 * 1D two-body collision with coefficient of restitution e (1 = perfectly
 * elastic, 0 = perfectly inelastic). Momentum is always conserved.
 *   v₁ = (m₁u₁ + m₂u₂ + m₂·e·(u₂−u₁)) / (m₁+m₂)
 *   v₂ = (m₁u₁ + m₂u₂ + m₁·e·(u₁−u₂)) / (m₁+m₂)
 */
export function collision1d(m1: number, u1: number, m2: number, u2: number, e = 1): {
  v1: number; v2: number; keBefore: number; keAfter: number; keLost: number; momentum: number;
} | null {
  if (m1 <= 0 || m2 <= 0 || e < 0 || e > 1) return null;
  const p = m1 * u1 + m2 * u2;
  const M = m1 + m2;
  const v1 = (p + m2 * e * (u2 - u1)) / M;
  const v2 = (p + m1 * e * (u1 - u2)) / M;
  const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const keAfter = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  return { v1, v2, keBefore, keAfter, keLost: keBefore - keAfter, momentum: p };
}

/**
 * Special relativity from a speed v (m/s). Returns the Lorentz factor γ and the
 * standard consequences per unit proper time / proper length / rest mass.
 *   γ = 1/√(1 − (v/c)²)
 */
export function relativity(v: number): { beta: number; gamma: number } | null {
  if (v < 0 || v >= SPEED_OF_LIGHT) return null;
  const beta = v / SPEED_OF_LIGHT;
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  return { beta, gamma };
}

/** Dilated time for a proper time interval. */
export const dilatedTime = (properTime: number, gamma: number) => properTime * gamma;
/** Contracted length for a proper (rest) length. */
export const contractedLength = (properLength: number, gamma: number) => properLength / gamma;
/** Relativistic momentum p = γmv. */
export const relativisticMomentum = (mass: number, v: number, gamma: number) => gamma * mass * v;
/** Total relativistic energy E = γmc². */
export const totalEnergy = (mass: number, gamma: number) => gamma * mass * SPEED_OF_LIGHT * SPEED_OF_LIGHT;
/** Relativistic kinetic energy KE = (γ−1)mc². */
export const relativisticKE = (mass: number, gamma: number) => (gamma - 1) * mass * SPEED_OF_LIGHT * SPEED_OF_LIGHT;

export type Medium = 'string' | 'openPipe' | 'closedPipe';
/**
 * Standing-wave harmonics. A string fixed at both ends and an open pipe both
 * support fₙ = n·v/(2L) for n = 1,2,3…; a pipe closed at one end supports only
 * odd harmonics fₙ = n·v/(4L) for n = 1,3,5…
 */
export function harmonics(medium: Medium, waveSpeed: number, length: number, count = 5): { n: number; frequency: number; wavelength: number }[] | null {
  if (waveSpeed <= 0 || length <= 0 || count < 1) return null;
  const out: { n: number; frequency: number; wavelength: number }[] = [];
  if (medium === 'closedPipe') {
    for (let i = 0, n = 1; i < count; i++, n += 2) {
      out.push({ n, frequency: (n * waveSpeed) / (4 * length), wavelength: (4 * length) / n });
    }
  } else {
    for (let n = 1; n <= count; n++) {
      out.push({ n, frequency: (n * waveSpeed) / (2 * length), wavelength: (2 * length) / n });
    }
  }
  return out;
}

/** Fundamental frequency (first harmonic) for a medium. */
export function fundamental(medium: Medium, waveSpeed: number, length: number): number | null {
  if (waveSpeed <= 0 || length <= 0) return null;
  return medium === 'closedPipe' ? waveSpeed / (4 * length) : waveSpeed / (2 * length);
}
