/**
 * Cooking & Kitchen shared data + helpers. Everything is deterministic and runs
 * in the browser. Volume-unit millilitre values are the site's canonical exact
 * factors (see src/data/units/volume.ts — NIST/BIPM based). Ingredient densities
 * are sourced from King Arthur Baking's Ingredient Weight Chart (see the /cooking/
 * grams-to-cups page for the citation); each is grams per US customary cup
 * (236.588 mL). Do NOT invent values here — every number must trace to a source.
 */

/** Millilitres per unit of volume. */
export const VOLUME_ML = {
  ml: 1,
  litre: 1000,
  // US customary
  us_tsp: 4.92892159375,
  us_tbsp: 14.78676478125,
  us_floz: 29.5735295625,
  us_cup: 236.5882365,
  us_pint: 473.176473,
  us_quart: 946.352946,
  us_gallon: 3785.411784,
  // Metric spoons/cup (Australia/NZ/EU)
  metric_tsp: 5,
  metric_tbsp: 15,
  metric_cup: 250,
  au_tbsp: 20, // Australian tablespoon — a common recipe pitfall
  // Imperial (UK)
  imp_tsp: 5.91939047,
  imp_tbsp: 17.7581714,
  imp_floz: 28.4130625,
  imp_cup: 284.130625,
  imp_pint: 568.26125,
  imp_quart: 1136.5225,
  imp_gallon: 4546.09,
} as const;

export interface Ingredient {
  id: string;
  name: string;
  gPerCup: number; // grams per US customary cup (236.588 mL)
  note?: string;
}

/**
 * Grams per US customary cup. Verified against King Arthur Baking's Ingredient
 * Weight Chart (kingarthurbaking.com/learn/ingredient-weight-chart), the US
 * baking standard, except where noted. Salts differ sharply by brand/crystal
 * size, so those carry their own notes.
 */
export const INGREDIENTS: Ingredient[] = [
  { id: 'flour-ap', name: 'Flour, all-purpose', gPerCup: 120 },
  { id: 'flour-bread', name: 'Flour, bread', gPerCup: 120 },
  { id: 'flour-cake', name: 'Flour, cake', gPerCup: 120 },
  { id: 'flour-whole-wheat', name: 'Flour, whole wheat', gPerCup: 113 },
  { id: 'sugar-granulated', name: 'Sugar, granulated (white)', gPerCup: 198 },
  { id: 'sugar-brown', name: 'Sugar, brown (packed)', gPerCup: 213 },
  { id: 'sugar-powdered', name: "Sugar, confectioners' (powdered)", gPerCup: 113 },
  { id: 'butter', name: 'Butter', gPerCup: 226 },
  { id: 'milk', name: 'Milk, whole', gPerCup: 227 },
  { id: 'water', name: 'Water', gPerCup: 227 },
  { id: 'honey', name: 'Honey', gPerCup: 336 },
  { id: 'maple-syrup', name: 'Maple syrup', gPerCup: 312 },
  { id: 'oil', name: 'Vegetable oil', gPerCup: 198, note: 'Olive oil is a touch heavier (~200 g/cup).' },
  { id: 'cocoa', name: 'Cocoa powder, unsweetened', gPerCup: 84 },
  { id: 'oats', name: 'Oats, old-fashioned rolled', gPerCup: 89 },
  { id: 'rice-white', name: 'Rice, long-grain (uncooked)', gPerCup: 198 },
  { id: 'cornstarch', name: 'Cornstarch', gPerCup: 112 },
  { id: 'cocoa-chips', name: 'Chocolate chips, semisweet', gPerCup: 170 },
  { id: 'salt-table', name: 'Salt, table', gPerCup: 288, note: 'Salt and leaveners are normally measured by the teaspoon, not the cup — kosher salt weighs far less per volume and differs sharply by brand.' },
  { id: 'salt-kosher-diamond', name: 'Salt, Diamond Crystal kosher', gPerCup: 128, note: "Morton kosher salt is nearly double (256 g/cup) — the two brands are NOT interchangeable by volume." },
  { id: 'salt-kosher-morton', name: 'Salt, Morton kosher', gPerCup: 256 },
  { id: 'baking-soda', name: 'Baking soda', gPerCup: 288 },
  { id: 'baking-powder', name: 'Baking powder', gPerCup: 192 },
  { id: 'walnuts', name: 'Walnuts, chopped', gPerCup: 113 },
  { id: 'peanut-butter', name: 'Peanut butter', gPerCup: 270 },
  { id: 'sour-cream', name: 'Sour cream / yogurt', gPerCup: 227 },
];

export const getIngredient = (id: string) => INGREDIENTS.find((i) => i.id === id);

/** Butter equivalences. 1 US stick = 1/2 cup = 8 tbsp = 4 oz = 113 g (US). */
export const BUTTER = {
  gPerStick: 113,
  tbspPerStick: 8,
  cupPerStick: 0.5,
  ozPerStick: 4,
} as const;

/** Convert an amount of butter between units. Returns all equivalents in grams basis. */
export function butterConvert(amount: number, from: 'stick' | 'tbsp' | 'cup' | 'gram' | 'oz') {
  const gramsPer: Record<typeof from, number> = {
    stick: BUTTER.gPerStick,
    tbsp: BUTTER.gPerStick / BUTTER.tbspPerStick, // 14.125 g
    cup: BUTTER.gPerStick / BUTTER.cupPerStick, // 226 g
    gram: 1,
    oz: BUTTER.gPerStick / BUTTER.ozPerStick, // 28.25 g
  } as const;
  const grams = amount * gramsPer[from];
  return {
    grams,
    sticks: grams / BUTTER.gPerStick,
    tbsp: grams / gramsPer.tbsp,
    cups: grams / gramsPer.cup,
    oz: grams / gramsPer.oz,
  };
}

/**
 * Oven-temperature reference. Fahrenheit ↔ Celsius is exact (C = (F−32)×5/9);
 * gas marks are the conventional UK values (Gas Mark 4 = 350 °F = 180 °C).
 */
export interface OvenRow { gas: number; f: number; c: number; desc: string }
export const OVEN_TABLE: OvenRow[] = [
  { gas: 0.25, f: 225, c: 110, desc: 'Very cool / very slow' },
  { gas: 0.5, f: 250, c: 120, desc: 'Very cool / very slow' },
  { gas: 1, f: 275, c: 140, desc: 'Cool / slow' },
  { gas: 2, f: 300, c: 150, desc: 'Cool / slow' },
  { gas: 3, f: 325, c: 160, desc: 'Warm / moderately slow' },
  { gas: 4, f: 350, c: 180, desc: 'Moderate' },
  { gas: 5, f: 375, c: 190, desc: 'Moderately hot' },
  { gas: 6, f: 400, c: 200, desc: 'Moderately hot' },
  { gas: 7, f: 425, c: 220, desc: 'Hot' },
  { gas: 8, f: 450, c: 230, desc: 'Hot' },
  { gas: 9, f: 475, c: 240, desc: 'Very hot' },
];

export const fToC = (f: number) => ((f - 32) * 5) / 9;
export const cToF = (c: number) => (c * 9) / 5 + 32;
/** Fan/convection ovens run ~20 °C (about 25–50 °F) cooler than conventional. */
export const fanC = (conventionalC: number) => conventionalC - 20;

/**
 * Yeast conversions. Active dry and instant are interchangeable 1:1 by weight
 * (Red Star's conversion chart); some bakers use ~25% less instant, noted in the
 * UI as practice rather than a sourced figure. Fresh (cake) yeast ≈ 2.5× active
 * dry by weight (King Arthur: fresh × 0.4 = active dry). 1 packet active dry =
 * ¼ oz = 7 g = 2¼ tsp (Red Star).
 */
export const YEAST = {
  activeDryToInstant: 1,
  activeDryToFresh: 2.5,
  packetGrams: 7,
  packetTsp: 2.25,
} as const;

export function yeastConvert(grams: number, from: 'active-dry' | 'instant' | 'fresh') {
  // normalise to active-dry grams
  let activeDry: number;
  if (from === 'active-dry') activeDry = grams;
  else if (from === 'instant') activeDry = grams / YEAST.activeDryToInstant;
  else activeDry = grams / YEAST.activeDryToFresh;
  return {
    activeDry,
    instant: activeDry * YEAST.activeDryToInstant,
    fresh: activeDry * YEAST.activeDryToFresh,
  };
}

/**
 * USDA safe minimum internal cooking temperatures (FoodSafety.gov).
 * These are food-safety minimums, not doneness preferences.
 */
export interface MeatTemp { food: string; f: number; c: number; rest?: string }
export const MEAT_TEMPS: MeatTemp[] = [
  { food: 'Poultry (chicken, turkey, duck) — whole & ground', f: 165, c: 74 },
  { food: 'Ground meats (beef, pork, lamb, veal)', f: 160, c: 71 },
  { food: 'Beef, pork, lamb, veal — steaks, chops, roasts', f: 145, c: 63, rest: 'Rest 3 minutes before carving' },
  { food: 'Ham, fresh or smoked (uncooked)', f: 145, c: 63, rest: 'Rest 3 minutes' },
  { food: 'Fish & shellfish', f: 145, c: 63 },
  { food: 'Eggs & egg dishes', f: 160, c: 71 },
  { food: 'Leftovers & casseroles', f: 165, c: 74 },
];

/** Common doneness temperatures for red meat (cook's reference, below well-done). */
export const DONENESS: { label: string; f: number; c: number; note?: string }[] = [
  { label: 'Rare', f: 125, c: 52, note: 'Below the USDA 145 °F safe minimum — cook at your own risk.' },
  { label: 'Medium-rare', f: 135, c: 57, note: 'Below the USDA 145 °F safe minimum.' },
  { label: 'Medium', f: 145, c: 63, note: 'Meets the USDA safe minimum (with a 3-minute rest).' },
  { label: 'Medium-well', f: 150, c: 66 },
  { label: 'Well done', f: 160, c: 71 },
];
