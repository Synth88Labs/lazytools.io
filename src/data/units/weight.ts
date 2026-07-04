import type { Quantity } from './types';

export const weight: Quantity = {
  id: 'weight',
  name: 'Weight & Mass',
  slug: 'weight',
  baseUnit: 'kg',
  icon: '⚖️',
  description:
    'Convert between kilograms, grams, pounds, ounces, stones and tons. All factors follow the international pound definition (1 lb = 0.45359237 kg exactly, since 1959).',
  units: [
    {
      id: 'mg', name: 'Milligram', plural: 'milligrams', symbol: 'mg', slug: 'mg', factor: 0.000001, system: 'metric',
      definition: 'A milligram (mg) is one thousandth of a gram. It is the standard unit for medication dosages and nutritional micronutrients.',
    },
    {
      id: 'g', name: 'Gram', plural: 'grams', symbol: 'g', slug: 'g', factor: 0.001, system: 'metric',
      definition: 'A gram (g) is one thousandth of a kilogram. It is the everyday metric unit for cooking ingredients, nutrition labels and postal weights.',
    },
    {
      id: 'kg', name: 'Kilogram', plural: 'kilograms', symbol: 'kg', slug: 'kg', factor: 1, system: 'si',
      definition: 'The kilogram (kg) is the SI base unit of mass, defined since 2019 by fixing the Planck constant. It is the standard unit for body weight and goods in most of the world.',
    },
    {
      id: 't', name: 'Metric ton', plural: 'metric tons', symbol: 't', slug: 'tonnes', factor: 1000, system: 'metric',
      definition: 'A metric ton or tonne (t) is 1,000 kilograms (about 2,204.6 pounds). It is used for vehicles, freight and industrial quantities.',
    },
    {
      id: 'oz', name: 'Ounce', plural: 'ounces', symbol: 'oz', slug: 'oz', factor: 0.028349523125, system: 'us',
      definition: 'An ounce (oz) is 1/16 of a pound, exactly 28.349523125 grams. It is common for food portions, postal weights and body weight changes in the US.',
    },
    {
      id: 'lb', name: 'Pound', plural: 'pounds', symbol: 'lb', slug: 'lbs', factor: 0.45359237, system: 'us',
      definition: 'A pound (lb) is defined as exactly 0.45359237 kilograms. It is the standard body-weight and grocery unit in the United States.',
    },
    {
      id: 'st', name: 'Stone', plural: 'stones', symbol: 'st', slug: 'stone', factor: 6.35029318, system: 'uk',
      definition: 'A stone (st) equals 14 pounds or exactly 6.35029318 kilograms. Body weight in the United Kingdom and Ireland is customarily given in stones and pounds.',
    },
    {
      id: 'uston', name: 'US ton', plural: 'US tons', symbol: 'ton (US)', slug: 'us-tons', factor: 907.18474, system: 'us',
      definition: 'A US ton (short ton) is 2,000 pounds, exactly 907.18474 kilograms. It is the customary ton used in the United States.',
    },
    {
      id: 'ct', name: 'Carat', plural: 'carats', symbol: 'ct', slug: 'carats', factor: 0.0002, system: 'other',
      definition: 'A carat (ct) is exactly 200 milligrams. It is the standard unit for gemstone and diamond weights worldwide.',
    },
  ],
  popularPairs: [
    ['kg', 'lb'], ['lb', 'kg'],
    ['g', 'oz'], ['oz', 'g'],
    ['kg', 'st'], ['st', 'kg'],
    ['lb', 'st'], ['st', 'lb'],
    ['oz', 'lb'], ['lb', 'oz'],
    ['g', 'kg'], ['kg', 'g'],
    ['g', 'lb'], ['lb', 'g'],
  ],
  pairMeta: {
    'kg-to-lbs': {
      slug: 'kg-to-lbs',
      exampleValue: 70,
      note: 'Kilograms-to-pounds is the most searched weight conversion, usually for body weight, luggage allowances and gym plates. A quick mental estimate: double the kilograms and add 10% — 70 kg → 140 + 14 = 154 lbs (exact: 154.32 lbs).',
      faqs: [
        { q: 'What is 1 kg in lbs for gym weights?', a: '1 kg is 2.2046 lbs. A 20 kg Olympic barbell is 44.09 lbs, and a 100 kg total is 220.46 lbs.' },
        { q: 'How many kg is a 23 kg airline baggage allowance in pounds?', a: '23 kg is 50.71 lbs — which is why many airlines list the checked-bag limit as 50 lbs.' },
      ],
    },
    'lbs-to-kg': {
      slug: 'lbs-to-kg',
      exampleValue: 150,
      note: 'Pounds-to-kilograms converts US body weights and product weights to metric. Since 1 lb = 0.45359237 kg exactly, 150 lbs is 68.04 kg. A quick estimate is to halve the pounds and subtract 10%: 150 → 75 − 7.5 ≈ 67.5 kg.',
    },
    'kg-to-stone': {
      slug: 'kg-to-stone',
      exampleValue: 80,
      note: 'Kilograms-to-stone is primarily a UK and Ireland body-weight conversion. One stone is 14 lbs (6.35029 kg), so 80 kg is 12.6 stone, customarily read as "12 stone 8" (12 st 8.4 lb).',
    },
    'g-to-oz': {
      slug: 'g-to-oz',
      exampleValue: 250,
      note: 'Grams-to-ounces appears constantly in cooking when converting between metric and US recipes. 250 g of an ingredient is 8.82 oz; a typical "1 cup of flour" is about 120 g or 4.23 oz.',
    },
  },
};
