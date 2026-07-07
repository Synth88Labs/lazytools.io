import type { Quantity } from './types.ts';

export const volume: Quantity = {
  id: 'volume',
  name: 'Volume & Cooking',
  slug: 'volume',
  baseUnit: 'l',
  icon: '🥛',
  description:
    'Convert between liters, milliliters, gallons, cups, tablespoons and other volume units — including the US kitchen measures used in recipes. US and UK gallons differ (3.785 L vs 4.546 L), a frequent source of errors this converter avoids.',
  units: [
    {
      id: 'ml', name: 'Milliliter', plural: 'milliliters', symbol: 'mL', slug: 'ml', factor: 0.001, system: 'metric',
      definition: 'A milliliter (mL) is one thousandth of a liter, identical to one cubic centimeter (cc). Medicine doses and small liquid amounts are measured in milliliters.',
    },
    {
      id: 'l', name: 'Liter', plural: 'liters', symbol: 'L', slug: 'liters', factor: 1, system: 'metric',
      definition: 'A liter (L) is exactly one cubic decimeter — a 10 cm cube of volume. Beverages and fuel are sold by the liter in most of the world.',
    },
    {
      id: 'm3', name: 'Cubic meter', plural: 'cubic meters', symbol: 'm³', slug: 'cubic-meters', factor: 1000, system: 'si',
      definition: 'A cubic meter (m³) is 1,000 liters — the SI unit of volume. Water utilities, shipping and concrete are measured in cubic meters.',
    },
    {
      id: 'tsp', name: 'Teaspoon (US)', plural: 'teaspoons', symbol: 'tsp', slug: 'tsp', factor: 0.00492892159375, system: 'us',
      definition: 'A US teaspoon (tsp) is exactly 4.92892 mL — one third of a tablespoon. Recipe amounts of spices, salt and baking powder are given in teaspoons.',
    },
    {
      id: 'tbsp', name: 'Tablespoon (US)', plural: 'tablespoons', symbol: 'tbsp', slug: 'tbsp', factor: 0.01478676478125, system: 'us',
      definition: 'A US tablespoon (tbsp) is exactly 14.7868 mL — three teaspoons, or 1/16 of a US cup. It is the standard recipe measure for oils, butter and sauces.',
    },
    {
      id: 'floz', name: 'Fluid ounce (US)', plural: 'fluid ounces', symbol: 'fl oz', slug: 'fl-oz', factor: 0.0295735295625, system: 'us',
      definition: 'A US fluid ounce (fl oz) is exactly 29.5735 mL — 1/8 of a US cup. Drink sizes and cosmetics are commonly labeled in fluid ounces. (The UK fluid ounce is slightly smaller: 28.41 mL.)',
    },
    {
      id: 'cup', name: 'Cup (US)', plural: 'cups', symbol: 'cup', slug: 'cups', factor: 0.2365882365, system: 'us',
      definition: 'A US cup is exactly 236.588 mL — 8 US fluid ounces or 16 tablespoons. It is the foundational measure of American recipes. (A metric cup, used in Australia, is 250 mL.)',
    },
    {
      id: 'pt', name: 'Pint (US)', plural: 'pints', symbol: 'pt', slug: 'pints', factor: 0.473176473, system: 'us',
      definition: 'A US pint (pt) is 2 cups, exactly 473.176 mL. Beer, milk and ice cream are sold by the pint. (An imperial UK pint is larger: 568 mL.)',
    },
    {
      id: 'qt', name: 'Quart (US)', plural: 'quarts', symbol: 'qt', slug: 'quarts', factor: 0.946352946, system: 'us',
      definition: 'A US quart (qt) is a quarter gallon, exactly 946.353 mL — just under a liter. Motor oil and milk cartons are common quart-sized products.',
    },
    {
      id: 'gal', name: 'Gallon (US)', plural: 'gallons', symbol: 'gal', slug: 'gallons', factor: 3.785411784, system: 'us',
      definition: 'A US gallon (gal) is exactly 3.785411784 liters (231 cubic inches). Fuel in the United States is sold by the US gallon.',
    },
    {
      id: 'ukgal', name: 'Gallon (UK)', plural: 'UK gallons', symbol: 'gal (UK)', slug: 'uk-gallons', factor: 4.54609, system: 'uk',
      definition: 'An imperial (UK) gallon is exactly 4.54609 liters — about 20% larger than the US gallon. UK fuel economy figures (miles per gallon) use this gallon.',
    },
    {
      id: 'cuft', name: 'Cubic foot', plural: 'cubic feet', symbol: 'ft³', slug: 'cubic-feet', factor: 28.316846592, system: 'imperial',
      definition: 'A cubic foot (ft³) is exactly 28.3168 liters. Refrigerator capacities, natural gas and storage spaces are measured in cubic feet.',
    },
    {
      id: 'cuin', name: 'Cubic inch', plural: 'cubic inches', symbol: 'in³', slug: 'cubic-inches', factor: 0.016387064, system: 'imperial',
      definition: 'A cubic inch (in³) is exactly 16.387064 mL. Engine displacements in the US were traditionally quoted in cubic inches.',
    },
  ],
  popularPairs: [
    ['l', 'gal'], ['gal', 'l'],
    ['ml', 'floz'], ['floz', 'ml'],
    ['cup', 'ml'], ['ml', 'cup'],
    ['tbsp', 'ml'], ['ml', 'tbsp'],
    ['tsp', 'ml'],
    ['cup', 'floz'], ['floz', 'cup'],
    ['l', 'ml'], ['ml', 'l'],
    ['qt', 'l'], ['l', 'qt'],
    ['cup', 'tbsp'],
  ],
  pairMeta: {
    'cups-to-ml': {
      slug: 'cups-to-ml',
      exampleValue: 2,
      note: 'Cups-to-milliliters is the essential conversion for following American recipes with metric measuring tools. 1 US cup = 236.59 mL (often rounded to 240 mL on nutrition labels). Note that an Australian/metric cup is 250 mL and a UK cup in older recipes is 284 mL — this page uses the US cup.',
      faqs: [
        { q: 'Is a cup 250 ml or 236 ml?', a: 'A US customary cup is 236.59 mL. The "metric cup" used in Australia and New Zealand is exactly 250 mL. American recipes mean the 236.59 mL cup.' },
      ],
    },
    'liters-to-gallons': {
      slug: 'liters-to-gallons',
      exampleValue: 50,
      note: 'Liters-to-gallons usually comes up for fuel. A 50-liter car tank holds 13.21 US gallons. Remember the US gallon (3.785 L) differs from the UK gallon (4.546 L) — this page converts to US gallons.',
    },
    'ml-to-fl-oz': {
      slug: 'ml-to-fl-oz',
      exampleValue: 500,
      note: 'Milliliters-to-fluid-ounces is common for drinks and cosmetics (airline liquid limits are 100 mL / 3.4 fl oz). A 500 mL bottle is 16.91 US fl oz.',
    },
    'tbsp-to-ml': {
      slug: 'tbsp-to-ml',
      exampleValue: 3,
      note: 'One US tablespoon is 14.79 mL, usually rounded to 15 mL — which is exactly the metric tablespoon in most countries. Australian tablespoons are 20 mL, a notable recipe pitfall.',
    },
    'gallons-to-liters': {
      slug: 'gallons-to-liters',
      exampleValue: 15,
      note: 'Gallons-to-liters converts US fuel quantities and tank sizes to metric: a 15-gallon tank holds 56.78 L. One US gallon is exactly 3.785411784 L; the UK gallon is a different, larger unit (4.546 L).',
    },
    'fl-oz-to-ml': {
      slug: 'fl-oz-to-ml',
      exampleValue: 12,
      note: 'Fluid-ounces-to-milliliters decodes US drink and cosmetic sizes: a 12 fl oz soda can is 354.9 mL, and the TSA carry-on liquid limit of 3.4 fl oz is the familiar 100 mL.',
    },
    'ml-to-cups': {
      slug: 'ml-to-cups',
      exampleValue: 250,
      note: 'Milliliters-to-cups converts metric recipes for US measuring cups: 250 mL is 1.057 US cups — so treating a metric cup (250 mL) as a US cup (236.6 mL) overshoots by about 6%, enough to matter in baking.',
    },
    'ml-to-tbsp': {
      slug: 'ml-to-tbsp',
      exampleValue: 30,
      note: 'Milliliters-to-tablespoons: 30 mL is 2.03 US tablespoons. The 15 mL ≈ 1 tbsp rule works for cooking, and medicine cups marked in mL map the same way — 30 mL of syrup is two tablespoons.',
    },
    'tsp-to-ml': {
      slug: 'tsp-to-ml',
      exampleValue: 2,
      note: 'One US teaspoon is 4.93 mL — close enough to the 5 mL metric teaspoon that dosing spoons treat them as equal. 2 tsp is 9.86 mL. For medicines, use a proper measuring device rather than cutlery: household teaspoons vary from 3 to 7 mL.',
    },
    'cups-to-fl-oz': {
      slug: 'cups-to-fl-oz',
      exampleValue: 1.5,
      note: 'A US cup is exactly 8 US fluid ounces, so 1.5 cups is 12 fl oz. This is definitional — no rounding — which is why American recipes switch freely between the two.',
    },
    'fl-oz-to-cups': {
      slug: 'fl-oz-to-cups',
      exampleValue: 16,
      note: 'Divide fluid ounces by 8: 16 fl oz is 2 cups (one US pint). Drink bottles labeled in fl oz map neatly — a 32 fl oz sports bottle is 4 cups.',
    },
    'liters-to-ml': {
      slug: 'liters-to-ml',
      exampleValue: 1.5,
      note: 'Multiply liters by 1,000: a 1.5 L bottle is 1,500 mL. Most useful for splitting bottles into servings — 1.5 L of soda is six 250 mL glasses.',
    },
    'ml-to-liters': {
      slug: 'ml-to-liters',
      exampleValue: 750,
      note: 'Divide milliliters by 1,000: a standard 750 mL wine bottle is 0.75 L. Handy for comparing unit prices when shelf labels mix mL and L.',
    },
    'quarts-to-liters': {
      slug: 'quarts-to-liters',
      exampleValue: 5,
      note: 'A US quart is 0.946 L — just under a liter. Engine oil is the classic case: a 5-quart oil change is 4.73 L, so five 1 L bottles leave a little spare.',
    },
    'liters-to-quarts': {
      slug: 'liters-to-quarts',
      exampleValue: 2,
      note: 'One liter is 1.057 US quarts, so 2 L is 2.11 qt. Cookware sold in quarts runs slightly smaller than the same number in liters — a 6 qt slow cooker is 5.68 L.',
    },
    'cups-to-tbsp': {
      slug: 'cups-to-tbsp',
      exampleValue: 0.25,
      note: 'A US cup is exactly 16 tablespoons, so a quarter cup is 4 tbsp and half a cup is 8 tbsp. This is the standard trick for scaling a recipe down when the smaller measuring cups are dirty.',
    },
  },
};
