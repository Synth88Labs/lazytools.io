/**
 * Pets & Animals math. These are published veterinary formulas and reference
 * values (epigenetic dog-age clock, RER/MER energy equations, gestation
 * periods) — each cited on its tool page. Aquarium volume is pure geometry.
 * Do not invent constants; verify against a veterinary source.
 */

/* ---------------- Dog age ---------------- */

/**
 * Epigenetic dog-age clock (Wang et al., Cell Systems 2020, UCSD/Ideker lab):
 * human_age = 16 × ln(dog_age_years) + 31. Valid for dogs older than ~1.
 */
export function dogAgeEpigenetic(dogYears: number): number | null {
  if (dogYears <= 0) return null;
  return 16 * Math.log(dogYears) + 31;
}

export type DogSize = 'small' | 'medium' | 'large' | 'giant';
/**
 * Per-year human-equivalent increment after age 2, by size. NOTE: only the
 * medium-dog value (+5/yr, with year 1 = 15 and year 2 = +9) is the confirmed
 * AVMA/AKC figure; the size-differentiated increments are a widely-used industry
 * convention (larger breeds age faster), not an official standard.
 */
const DOG_INCREMENT: Record<DogSize, number> = { small: 4, medium: 5, large: 6, giant: 7.5 };
/**
 * Traditional size-based guideline: year 1 ≈ 15, year 2 ≈ +9 (24), then a
 * per-year increment that grows with body size (larger dogs age faster).
 */
export function dogAgeTraditional(dogYears: number, size: DogSize): number | null {
  if (dogYears <= 0) return null;
  if (dogYears <= 1) return dogYears * 15;
  if (dogYears <= 2) return 15 + (dogYears - 1) * 9;
  return 24 + (dogYears - 2) * DOG_INCREMENT[size];
}
export const DOG_SIZES: { id: DogSize; label: string }[] = [
  { id: 'small', label: 'Small (up to ~9 kg / 20 lb)' },
  { id: 'medium', label: 'Medium (~9 to 23 kg / 20 to 50 lb)' },
  { id: 'large', label: 'Large (~23 to 41 kg / 50 to 90 lb)' },
  { id: 'giant', label: 'Giant (over ~41 kg / 90 lb)' },
];

/* ---------------- Cat age ---------------- */

/**
 * Standard cat-to-human chart (AAHA/AAFP/icatcare): year 1 ≈ 15, year 2 ≈ 24
 * (+9), then +4 human years per cat year thereafter.
 */
export function catAge(catYears: number): number | null {
  if (catYears <= 0) return null;
  if (catYears <= 1) return catYears * 15;
  if (catYears <= 2) return 15 + (catYears - 1) * 9;
  return 24 + (catYears - 2) * 4;
}

/* ---------------- Energy / food ---------------- */

/** Resting Energy Requirement (kcal/day) = 70 × (weight_kg)^0.75. */
export function rer(weightKg: number): number { return 70 * Math.pow(weightKg, 0.75); }

export interface MerFactor { id: string; label: string; factor: number }
/** Maintenance Energy Requirement multipliers for DOGS (MER = factor × RER). */
export const DOG_MER: MerFactor[] = [
  { id: 'neutered', label: 'Neutered adult', factor: 1.6 },
  { id: 'intact', label: 'Intact adult', factor: 1.8 },
  { id: 'weightloss', label: 'Weight loss', factor: 1.0 },
  { id: 'weightgain', label: 'Weight gain', factor: 1.7 },
  { id: 'light', label: 'Light work / active', factor: 2.0 },
  { id: 'moderate', label: 'Moderate work', factor: 3.0 },
  { id: 'heavy', label: 'Heavy / sled work', factor: 5.0 },
  { id: 'puppy-young', label: 'Puppy, 0 to 4 months', factor: 3.0 },
  { id: 'puppy-old', label: 'Puppy, 4 months-adult', factor: 2.0 },
];
/** MER multipliers for CATS (WSAVA/veterinary-nutrition convention). */
export const CAT_MER: MerFactor[] = [
  { id: 'neutered', label: 'Neutered adult', factor: 1.2 },
  { id: 'intact', label: 'Intact adult', factor: 1.4 },
  { id: 'obese-prone', label: 'Obese-prone / inactive', factor: 1.0 },
  { id: 'weightloss', label: 'Weight loss', factor: 1.0 },
  { id: 'kitten', label: 'Kitten (growth)', factor: 2.5 },
];

export function mer(weightKg: number, factor: number): number { return rer(weightKg) * factor; }

/* ---------------- Gestation ---------------- */

export interface Species { id: string; name: string; days: number; range: string }
/** Average gestation periods (days). */
export const GESTATION: Species[] = [
  { id: 'dog', name: 'Dog', days: 63, range: '58 to 68' },
  { id: 'cat', name: 'Cat', days: 65, range: '63 to 67' },
  { id: 'rabbit', name: 'Rabbit', days: 31, range: '28 to 33' },
  { id: 'guinea-pig', name: 'Guinea pig', days: 65, range: '59 to 72' },
  { id: 'hamster', name: 'Hamster (Syrian)', days: 16, range: '16 to 19' },
  { id: 'rat', name: 'Rat', days: 22, range: '21 to 23' },
  { id: 'mouse', name: 'Mouse', days: 20, range: '19 to 21' },
  { id: 'ferret', name: 'Ferret', days: 42, range: '41 to 43' },
  { id: 'horse', name: 'Horse', days: 340, range: '330 to 345' },
  { id: 'cow', name: 'Cow', days: 283, range: '279 to 287' },
  { id: 'pig', name: 'Pig', days: 114, range: '112 to 115' },
  { id: 'sheep', name: 'Sheep', days: 147, range: '144 to 151' },
  { id: 'goat', name: 'Goat', days: 150, range: '145 to 155' },
];
export const getSpecies = (id: string) => GESTATION.find((s) => s.id === id);

/* ---------------- Aquarium (pure geometry) ---------------- */

const L_PER_GAL_US = 3.785411784;
const L_PER_GAL_UK = 4.54609;
/** Rectangular tank volume from dimensions (cm) → litres and gallons. */
export function aquariumVolume(lCm: number, wCm: number, hCm: number) {
  const litres = (lCm * wCm * hCm) / 1000; // cm³ → L
  return { litres, usGal: litres / L_PER_GAL_US, ukGal: litres / L_PER_GAL_UK };
}
/** Convert inches-based tank to litres/gallons. */
export function aquariumVolumeIn(lIn: number, wIn: number, hIn: number) {
  return aquariumVolume(lIn * 2.54, wIn * 2.54, hIn * 2.54);
}

/* ---------------- Water intake ---------------- */

/** Daily water intake guideline (ml). Dogs ≈ 50 ml/kg, cats ≈ 50 ml/kg. */
export function waterIntakeMl(weightKg: number, mlPerKg: number): number { return weightKg * mlPerKg; }

/* ---------------- Dog crate size ---------------- */

/** Recommended crate: dog length + margin, dog height + margin (guideline). */
export function crateSize(lengthCm: number, heightCm: number, marginCm = 7.5) {
  return { length: lengthCm + marginCm, height: heightCm + marginCm };
}

/* ---------------- Dog chocolate toxicity ---------------- */

/**
 * Theobromine content by chocolate type, in mg per gram. Theobromine is the
 * methylxanthine that poisons dogs (caffeine adds a little more). Values are
 * mid-range figures from the Merck Veterinary Manual and Pet Poison Helpline;
 * real products vary, so this is an estimate, not a diagnosis.
 */
export const THEOBROMINE_MG_PER_G: Record<string, { label: string; mg: number }> = {
  white: { label: 'White chocolate', mg: 0.009 },
  milk: { label: 'Milk chocolate', mg: 2.06 },
  dark: { label: 'Dark / semisweet chocolate', mg: 5.36 },
  baking: { label: 'Baking (unsweetened) chocolate', mg: 14.1 },
  cocoa: { label: 'Cocoa powder', mg: 26.0 },
  cocoaMulch: { label: 'Cocoa bean mulch', mg: 9.1 },
};

export type ChocRisk = 'none' | 'mild' | 'moderate' | 'severe' | 'lethal';
export interface ChocResult {
  theobromineMg: number;
  dosePerKg: number;
  risk: ChocRisk;
}
/**
 * Estimate a dog's theobromine dose (mg per kg body weight) from a chocolate
 * type, amount eaten and the dog's weight, and band the risk. Published
 * veterinary thresholds (theobromine, per kg): signs from ~20 mg/kg, serious
 * cardiac/neurologic effects ~40 to 50 mg/kg, seizures ~60 mg/kg, potentially
 * fatal ~100 to 200 mg/kg. Not a substitute for a vet or poison-control call.
 */
export function chocolateToxicity(type: string, amountG: number, dogKg: number): ChocResult | null {
  const t = THEOBROMINE_MG_PER_G[type];
  if (!t || amountG <= 0 || dogKg <= 0) return null;
  const theobromineMg = t.mg * amountG;
  const dosePerKg = theobromineMg / dogKg;
  let risk: ChocRisk = 'none';
  if (dosePerKg >= 100) risk = 'lethal';
  else if (dosePerKg >= 60) risk = 'severe';
  else if (dosePerKg >= 40) risk = 'moderate';
  else if (dosePerKg >= 20) risk = 'mild';
  return { theobromineMg, dosePerKg, risk };
}

/* ---------------- Aquarium stocking ---------------- */

export interface StockingResult {
  netGallons: number;
  maxInchesRule: number;   // 1 inch of fish per net gallon
  usedInches: number;
  percent: number;
  status: 'understocked' | 'ok' | 'fully stocked' | 'overstocked';
}
/**
 * Freshwater stocking estimate by the classic "1 inch of adult fish per (net)
 * gallon" guideline. Net volume is ~85% of the tank's rated volume once
 * substrate and décor are accounted for. A rough guide only, real capacity
 * depends on fish body mass, waste output, filtration and surface area.
 */
export function aquariumStocking(grossGallons: number, totalFishInches: number): StockingResult | null {
  if (grossGallons <= 0 || totalFishInches < 0) return null;
  const netGallons = grossGallons * 0.85;
  const maxInchesRule = netGallons; // 1 inch per net gallon
  const percent = maxInchesRule > 0 ? (totalFishInches / maxInchesRule) * 100 : 0;
  let status: StockingResult['status'];
  if (percent < 50) status = 'understocked';
  else if (percent <= 90) status = 'ok';
  else if (percent <= 100) status = 'fully stocked';
  else status = 'overstocked';
  return { netGallons, maxInchesRule, usedInches: totalFishInches, percent, status };
}

/* ---------------- Aquarium heater wattage ---------------- */

/**
 * Suggested aquarium heater wattage from tank volume (US gallons) and the
 * temperature rise needed above room temperature (°F). Uses the standard
 * hobby guideline of roughly 2.5 to 5 watts per gallon scaled by the rise:
 * ~2.5 W/gal for a small rise, ~3.5 for moderate, ~5 for a large rise.
 */
export function heaterWatts(gallons: number, tempRiseF: number): number | null {
  if (gallons <= 0 || tempRiseF < 0) return null;
  let perGal: number;
  if (tempRiseF <= 5) perGal = 2.5;
  else if (tempRiseF <= 10) perGal = 3.5;
  else perGal = 5;
  return gallons * perGal;
}

/* ---------------- Puppy adult-weight predictor ---------------- */

/**
 * Percent of adult weight a puppy has typically reached by a given age, by
 * size class. Interpolated between anchor points (age in weeks → % of adult
 * weight), based on published breed-size growth curves. Approximate, real
 * growth varies by breed and individual.
 */
const GROWTH: Record<string, [number, number][]> = {
  small:  [[6, 22], [10, 40], [16, 60], [26, 85], [40, 98], [52, 100]],
  medium: [[6, 17], [12, 40], [16, 50], [26, 75], [40, 90], [52, 98], [78, 100]],
  large:  [[6, 12], [16, 40], [26, 65], [40, 80], [52, 90], [78, 98], [104, 100]],
  giant:  [[6, 10], [16, 35], [26, 55], [40, 68], [52, 80], [78, 92], [104, 100]],
};

function interpPct(table: [number, number][], ageWeeks: number): number {
  if (ageWeeks <= table[0][0]) return table[0][1];
  const last = table[table.length - 1];
  if (ageWeeks >= last[0]) return last[1];
  for (let i = 1; i < table.length; i++) {
    const [a1, p1] = table[i - 1], [a2, p2] = table[i];
    if (ageWeeks <= a2) return p1 + ((p2 - p1) * (ageWeeks - a1)) / (a2 - a1);
  }
  return last[1];
}

/**
 * Predict a puppy's adult weight from its current age, current weight and size
 * class: adult = current weight ÷ (percent of adult weight already reached).
 */
export function puppyAdultWeight(currentWeight: number, ageWeeks: number, sizeClass: string): { adult: number; pct: number } | null {
  const table = GROWTH[sizeClass];
  if (!table || currentWeight <= 0 || ageWeeks <= 0) return null;
  const pct = interpPct(table, ageWeeks);
  return { adult: currentWeight / (pct / 100), pct };
}

export { L_PER_GAL_US, L_PER_GAL_UK };
