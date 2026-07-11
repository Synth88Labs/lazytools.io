/** Physics constants — CODATA / SI 2019 exact values where defined. Pinned. */

export const G_EARTH = 9.80665;   // standard gravity, m/s²
export const G_MOON = 1.62;       // m/s²
export const G_MARS = 3.72076;    // m/s²

export const G_GRAV = 6.6743e-11; // gravitational constant, N·m²/kg² (CODATA 2018)
export const C_LIGHT = 299792458; // speed of light, m/s (exact, SI)
export const H_PLANCK = 6.62607015e-34; // Planck constant, J·s (exact, SI 2019)
export const K_B = 1.380649e-23;  // Boltzmann constant, J/K (exact, SI 2019)
export const E_CHARGE = 1.602176634e-19; // elementary charge, C (exact, SI 2019)
export const N_A = 6.02214076e23; // Avogadro constant, /mol (exact, SI 2019)
export const EPSILON_0 = 8.8541878128e-12; // vacuum permittivity, F/m
export const M_ELECTRON = 9.1093837015e-31; // kg
export const M_PROTON = 1.67262192369e-27;  // kg

/** eV ⇄ J */
export const eVtoJ = (eV: number) => eV * E_CHARGE;
export const JtoeV = (J: number) => J / E_CHARGE;

export const GRAVITY_PRESETS: { label: string; value: number }[] = [
  { label: 'Earth (9.80665)', value: G_EARTH },
  { label: 'Moon (1.62)', value: G_MOON },
  { label: 'Mars (3.721)', value: G_MARS },
];

/** Common refractive indices (physical constants, overridable). */
export const REFRACTIVE_INDEX: { label: string; value: number }[] = [
  { label: 'Vacuum / air (1.00)', value: 1.0 },
  { label: 'Water (1.33)', value: 1.33 },
  { label: 'Glass (1.50)', value: 1.5 },
  { label: 'Diamond (2.42)', value: 2.42 },
];
