/**
 * Homebrewing math. Established brewing formulas — ABV from gravity, Brix↔SG,
 * hydrometer/refractometer correction, the Tinseth IBU model, priming sugar,
 * and strike-water temperature. Constants trace to standard references (Palmer
 * "How to Brew", Glenn Tinseth's utilization model, Sean Terrill's refractometer
 * work); cited on each tool page. Do not invent values — verify against them.
 */

/** ABV, simple estimate: (OG − FG) × 131.25. Good to ~ ±0.2% at normal strengths. */
export function abvSimple(og: number, fg: number): number | null {
  if (og < 0.9 || fg < 0.9 || og > 1.2 || fg > 1.2) return null;
  return (og - fg) * 131.25;
}

/**
 * ABV, more accurate at higher gravities (Novotný / commonly-cited alternate):
 *   ABV = (76.08 · (OG−FG) / (1.775−OG)) · (FG / 0.794)
 */
export function abvAccurate(og: number, fg: number): number | null {
  if (og < 0.9 || fg < 0.9 || og > 1.2 || fg > 1.2 || og <= fg) return null;
  return (76.08 * (og - fg) / (1.775 - og)) * (fg / 0.794);
}

/** Apparent attenuation (%) — how much of the sugar fermented. */
export function attenuation(og: number, fg: number): number | null {
  if (og <= 1 || fg < 0.9) return null;
  return ((og - fg) / (og - 1)) * 100;
}

/** Approximate calories per 12 oz (355 mL) serving from OG and FG (standard homebrew estimate). */
export function caloriesPer12oz(og: number, fg: number): number | null {
  if (og <= fg || og < 1) return null;
  const calAlcohol = 1881.22 * fg * (og - fg) / (1.775 - og);
  const calCarbs = 3550.0 * fg * (0.1808 * og + 0.8192 * fg - 1.0004);
  return calAlcohol + calCarbs;
}

/** Specific gravity from °Brix (standard cubic). */
export function brixToSg(brix: number): number | null {
  if (brix < 0 || brix > 44) return null;
  return brix / (258.6 - (brix / 258.2) * 227.1) + 1;
}

/** °Brix from specific gravity (standard cubic). */
export function sgToBrix(sg: number): number | null {
  if (sg < 0.98 || sg > 1.2) return null;
  return ((182.4601 * sg - 775.6821) * sg + 1262.7794) * sg - 669.5622;
}

/**
 * Hydrometer temperature correction. Reading and temperatures in the chosen
 * unit; returns the corrected specific gravity referenced to the calibration
 * temperature. Uses the standard density polynomial (°F internally).
 */
const densityFactorF = (tF: number) =>
  1.00130346 - 1.34722124e-4 * tF + 2.04052596e-6 * tF * tF - 2.32820948e-9 * tF * tF * tF;

export function hydrometerCorrect(reading: number, sampleTempF: number, calibrationTempF = 60): number | null {
  if (reading < 0.9 || reading > 1.2) return null;
  return reading * (densityFactorF(sampleTempF) / densityFactorF(calibrationTempF));
}

/**
 * Tinseth IBU. hops: array of { grams, alphaPct, boilMinutes }. Boil gravity is
 * the average wort gravity during the boil; volume in litres (post-boil).
 */
export interface HopAddition { grams: number; alphaPct: number; boilMinutes: number; }
export function tinsethUtilization(boilGravity: number, minutes: number): number {
  const bigness = 1.65 * Math.pow(0.000125, boilGravity - 1);
  const timeFactor = (1 - Math.exp(-0.04 * minutes)) / 4.15;
  return bigness * timeFactor;
}
export function ibuTinseth(hops: HopAddition[], boilGravity: number, volumeL: number): number | null {
  if (boilGravity < 1 || volumeL <= 0) return null;
  let ibu = 0;
  for (const h of hops) {
    if (h.grams < 0 || h.alphaPct < 0 || h.boilMinutes < 0) continue;
    const mglAA = (h.grams * (h.alphaPct / 100) * 1000) / volumeL;
    ibu += tinsethUtilization(boilGravity, h.boilMinutes) * mglAA;
  }
  return ibu;
}

/** Residual CO2 (volumes) dissolved in beer at a given temperature (°F). */
export function residualCo2(tempF: number): number {
  return 3.0378 - 0.050062 * tempF + 0.00026555 * tempF * tempF;
}

/**
 * Priming sugar types: grams per litre needed to add 1 volume of CO2, derived
 * from CO2 stoichiometry (1 vol·L ≈ 1.96 g CO2). Corn sugar is dextrose
 * monohydrate (~91% fermentable → higher factor); DME is approximate. Published
 * factors vary a little between sources.
 */
export const PRIMING_SUGARS: { name: string; gPerLPerVol: number }[] = [
  { name: 'Corn sugar (dextrose)', gPerLPerVol: 4.4 },
  { name: 'Table sugar (sucrose)', gPerLPerVol: 3.83 },
  { name: 'Dry malt extract (DME)', gPerLPerVol: 5.9 },
];

/**
 * Priming sugar for bottle conditioning.
 *   CO2 to add = target volumes − residual (from temperature)
 *   grams = CO2-to-add × volume(L) × grams-per-litre-per-volume for the sugar
 */
export function primingSugar(targetVols: number, beerTempF: number, volumeL: number, gPerLPerVol: number): { co2ToAdd: number; grams: number } | null {
  if (targetVols < 0 || volumeL <= 0 || gPerLPerVol <= 0) return null;
  const co2ToAdd = Math.max(0, targetVols - residualCo2(beerTempF));
  return { co2ToAdd, grams: co2ToAdd * volumeL * gPerLPerVol };
}

/**
 * Strike water temperature (single infusion), Palmer:
 *   Tw = (0.2 / R)·(mashTarget − grainTemp) + mashTarget
 * R = water-to-grain ratio (quarts per pound); temps in °F.
 */
export function strikeTemp(mashTargetF: number, grainTempF: number, ratioQtPerLb: number): number | null {
  if (ratioQtPerLb <= 0) return null;
  return (0.2 / ratioQtPerLb) * (mashTargetF - grainTempF) + mashTargetF;
}

/**
 * Blend/dilution: adjust gravity by adding water (or concentrating).
 * Uses gravity points (SG−1)×1000, conserved: P1·V1 = P2·V2.
 * Given current volume+gravity and a target gravity, returns the final volume
 * (water to add = final − current). Or given water added, the resulting gravity.
 */
export function diluteToGravity(currentVolL: number, currentSg: number, targetSg: number): { finalVolL: number; waterToAddL: number } | null {
  if (currentVolL <= 0 || currentSg <= 1 || targetSg <= 1 || targetSg > currentSg) return null;
  const p1 = (currentSg - 1) * 1000;
  const p2 = (targetSg - 1) * 1000;
  const finalVolL = (p1 * currentVolL) / p2;
  return { finalVolL, waterToAddL: finalVolL - currentVolL };
}

/**
 * Refractometer FG correction. Alcohol skews refractometer readings, so a wort
 * correction factor (WCF, ~1.04) is applied and a cubic estimates FG from the
 * original and final Brix. Uses the widely-used cubic (Sean Terrill / Bonham).
 */
export function refractometerFg(originalBrix: number, finalBrix: number, wcf = 1.04): number | null {
  if (originalBrix < 0 || finalBrix < 0) return null;
  const oi = originalBrix / wcf;
  const fi = finalBrix / wcf;
  // Terrill cubic (coefficients per seanterrill.com; last term is 0.000063293, i.e. 0.63293e-4)
  return 1.0 - 0.0044993 * oi + 0.011774 * fi + 0.00027581 * oi * oi - 0.0012717 * fi * fi - 0.00000728 * oi * oi * oi + 0.000063293 * fi * fi * fi;
}
