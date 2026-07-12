import type { Quantity } from './types.ts';

/** Base unit: kg/m³. 1 g/cm³ = 1000 kg/m³; 1 lb/ft³ = 0.45359237/0.3048³ kg/m³ (exact). */
export const density: Quantity = {
  id: 'density',
  name: 'Density',
  slug: 'density',
  baseUnit: 'kg-m3',
  icon: '⚖️',
  description:
    'Convert density units — kilograms per cubic metre, grams per cubic centimetre, g/mL, kg/L, pounds per cubic foot and per cubic inch. Water is 1 g/cm³ = 1000 kg/m³.',
  units: [
    { id: 'kg-m3', name: 'Kilogram per cubic metre', plural: 'kilograms per cubic metre', symbol: 'kg/m³', slug: 'kg-m3', factor: 1, system: 'si', definition: 'The SI unit of density — mass in kilograms per cubic metre. Water is 1,000 kg/m³; air at sea level about 1.225 kg/m³.' },
    { id: 'g-cm3', name: 'Gram per cubic centimetre', plural: 'grams per cubic centimetre', symbol: 'g/cm³', slug: 'g-cm3', factor: 1000, system: 'metric', definition: 'One gram per cubic centimetre equals 1,000 kg/m³. Water is 1 g/cm³ by definition, which makes this a convenient reference unit.' },
    { id: 'g-ml', name: 'Gram per millilitre', plural: 'grams per millilitre', symbol: 'g/mL', slug: 'g-ml', factor: 1000, system: 'metric', definition: 'Numerically identical to g/cm³ (1 mL = 1 cm³), so 1 g/mL = 1,000 kg/m³. Common for liquids in the lab and kitchen.' },
    { id: 'kg-l', name: 'Kilogram per litre', plural: 'kilograms per litre', symbol: 'kg/L', slug: 'kg-l', factor: 1000, system: 'metric', definition: 'One kilogram per litre is 1,000 kg/m³ — the same as g/cm³. Water is 1 kg/L.' },
    { id: 'g-l', name: 'Gram per litre', plural: 'grams per litre', symbol: 'g/L', slug: 'g-l', factor: 1, system: 'metric', definition: 'One gram per litre equals 1 kg/m³. Used for dilute solutions and gas densities.' },
    { id: 'lb-ft3', name: 'Pound per cubic foot', plural: 'pounds per cubic foot', symbol: 'lb/ft³', slug: 'lb-ft3', factor: 0.45359237 / (0.3048 ** 3), system: 'us', definition: 'The US density unit, about 16.018 kg/m³. Water is about 62.4 lb/ft³; building materials and soils are often specified this way.' },
    { id: 'lb-in3', name: 'Pound per cubic inch', plural: 'pounds per cubic inch', symbol: 'lb/in³', slug: 'lb-in3', factor: 0.45359237 / (0.0254 ** 3), system: 'us', definition: 'About 27,680 kg/m³ — a large unit used for metals. Steel is roughly 0.284 lb/in³.' },
  ],
  popularPairs: [
    ['kg-m3', 'g-cm3'], ['g-cm3', 'kg-m3'],
    ['kg-m3', 'lb-ft3'], ['lb-ft3', 'kg-m3'], ['g-cm3', 'lb-ft3'], ['kg-m3', 'g-l'],
  ],
  pairMeta: {
    'kg-m3-to-g-cm3': { slug: 'kg-m3-to-g-cm3', exampleValue: 1000, note: 'Kilograms per cubic metre to grams per cubic centimetre divides by 1,000: water at 1,000 kg/m³ is exactly 1 g/cm³. Because water is the reference, g/cm³ values double as "times denser than water" (aluminium 2.7, steel ~7.85).' },
    'g-cm3-to-kg-m3': { slug: 'g-cm3-to-kg-m3', exampleValue: 2.7, note: 'Grams per cubic centimetre to kilograms per cubic metre multiplies by 1,000: aluminium at 2.7 g/cm³ is 2,700 kg/m³. This converts the compact reference figure into SI for engineering formulas.' },
    'kg-m3-to-lb-ft3': { slug: 'kg-m3-to-lb-ft3', exampleValue: 1000, note: 'Kilograms per cubic metre to pounds per cubic foot divides by about 16.018: water at 1,000 kg/m³ is about 62.4 lb/ft³. US construction and geotechnical specs use lb/ft³ (sometimes "pcf").' },
    'lb-ft3-to-kg-m3': { slug: 'lb-ft3-to-kg-m3', exampleValue: 62.4, note: 'Pounds per cubic foot to kilograms per cubic metre multiplies by about 16.018: 62.4 lb/ft³ (water) is 1,000 kg/m³. Use it to bring US material densities into SI.' },
    'g-cm3-to-lb-ft3': { slug: 'g-cm3-to-lb-ft3', exampleValue: 1, note: 'Grams per cubic centimetre to pounds per cubic foot multiplies by about 62.43: 1 g/cm³ (water) is 62.43 lb/ft³. Handy for cross-checking a material\'s density between metric datasheets and US specs.' },
    'kg-m3-to-g-l': { slug: 'kg-m3-to-g-l', exampleValue: 1.225, note: 'Kilograms per cubic metre and grams per litre are numerically equal (both 1/1000 of g/cm³ scaling): air at 1.225 kg/m³ is 1.225 g/L. Gas densities are often quoted in g/L.' },
  },
};
