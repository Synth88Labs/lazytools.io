import type { Quantity } from './types.ts';

/**
 * Base unit: tesla (T). 1 gauss = 10⁻⁴ T (exact, CGS); 1 milligauss = 10⁻⁷ T;
 * 1 nanotesla (gamma) = 10⁻⁹ T. Metric prefixes: mT = 10⁻³, µT = 10⁻⁶.
 */
export const magneticField: Quantity = {
  id: 'magnetic-field',
  name: 'Magnetic Field',
  slug: 'magnetic-field',
  baseUnit: 't',
  icon: '🧲',
  description:
    'Convert magnetic flux density (magnetic field) units — tesla, gauss, millitesla, microtesla, milligauss and nanotesla. 1 tesla = 10,000 gauss.',
  units: [
    { id: 't', name: 'Tesla', plural: 'teslas', symbol: 'T', slug: 'tesla', factor: 1, system: 'si', definition: 'The SI unit of magnetic flux density. A fridge magnet is a few millitesla; an MRI scanner runs at 1.5–3 T. Earth\'s field is only about 50 microtesla.' },
    { id: 'mt', name: 'Millitesla', plural: 'milliteslas', symbol: 'mT', slug: 'millitesla', factor: 1e-3, system: 'si', definition: 'One-thousandth of a tesla (10⁻³ T), equal to 10 gauss. Handy for everyday magnets, which sit in the single-to-hundreds of millitesla range.' },
    { id: 'ut', name: 'Microtesla', plural: 'microteslas', symbol: 'µT', slug: 'microtesla', factor: 1e-6, system: 'si', definition: 'One-millionth of a tesla (10⁻⁶ T). Earth\'s magnetic field at the surface is about 25–65 µT, so this unit suits geomagnetic and biomagnetic measurements.' },
    { id: 'g', name: 'Gauss', plural: 'gauss', symbol: 'G', slug: 'gauss', factor: 1e-4, system: 'other', definition: 'The CGS unit of magnetic flux density — exactly 10⁻⁴ tesla, so 1 T = 10,000 G. Still widely used for magnet ratings and Earth\'s field (~0.5 G).' },
    { id: 'mg', name: 'Milligauss', plural: 'milligauss', symbol: 'mG', slug: 'milligauss', factor: 1e-7, system: 'other', definition: 'One-thousandth of a gauss (10⁻⁷ T). EMF meters and power-line field measurements are usually quoted in milligauss.' },
    { id: 'nt', name: 'Nanotesla', plural: 'nanoteslas', symbol: 'nT', slug: 'nanotesla', factor: 1e-9, system: 'si', definition: 'One-billionth of a tesla (10⁻⁹ T), also called a gamma (γ) in geophysics. Used for small variations in Earth\'s field and magnetic surveying.' },
  ],
  popularPairs: [
    ['t', 'g'], ['g', 't'],
    ['mt', 'g'], ['ut', 'mg'], ['g', 'mg'], ['t', 'mt'],
  ],
  pairMeta: {
    't-to-g': { slug: 't-to-g', exampleValue: 1.5, note: 'Tesla to gauss multiplies by 10,000: a 1.5 T MRI magnet is 15,000 G. The tesla is the modern SI unit while gauss lingers in magnet catalogues and physics, so this is the common bridge between them.', tableValues: [0.001, 0.01, 0.1, 0.5, 1, 1.5, 3, 5, 10] },
    'g-to-t': { slug: 'g-to-t', exampleValue: 10000, note: 'Gauss to tesla divides by 10,000: 10,000 G is 1 T, and Earth\'s ~0.5 G field is about 50 µT. Use it to convert a gauss magnet rating into SI tesla.', tableValues: [1, 10, 100, 1000, 5000, 10000, 15000, 30000, 100000] },
    'mt-to-g': { slug: 'mt-to-g', exampleValue: 100, note: 'Millitesla to gauss multiplies by 10: 100 mT is 1,000 G. Everyday magnets are often specified in millitesla in one place and gauss in another, so this conversion comes up a lot.' },
    'ut-to-mg': { slug: 'ut-to-mg', exampleValue: 50, note: 'Microtesla to milligauss multiplies by 10: Earth\'s ~50 µT field is about 500 mG. Bridges the SI unit used for geomagnetic data and the milligauss used by EMF meters.' },
    'g-to-mg': { slug: 'g-to-mg', exampleValue: 1, note: 'Gauss to milligauss multiplies by 1,000: 1 G is 1,000 mG. Milligauss gives readable numbers for the small fields around appliances and power lines.' },
    't-to-mt': { slug: 't-to-mt', exampleValue: 1.5, note: 'Tesla to millitesla multiplies by 1,000: a 1.5 T field is 1,500 mT. A convenient step down for describing strong permanent magnets and electromagnets.' },
  },
};
