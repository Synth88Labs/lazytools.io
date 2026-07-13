import type { Quantity } from './types.ts';

/**
 * Base unit: square metre per second (m²/s), the SI unit of kinematic
 * viscosity. 1 stokes = 1 cm²/s = 10⁻⁴ m²/s (exact, CGS); 1 centistokes =
 * 1 mm²/s = 10⁻⁶ m²/s. Oil grades are quoted in centistokes.
 */
export const kinematicViscosity: Quantity = {
  id: 'kinematic-viscosity',
  name: 'Kinematic Viscosity',
  slug: 'kinematic-viscosity',
  baseUnit: 'm2s',
  icon: '💧',
  description:
    'Convert kinematic viscosity units — square metre per second, square millimetre per second, stokes and centistokes. 1 cSt = 1 mm²/s; oil viscosity grades are given in centistokes.',
  units: [
    { id: 'm2s', name: 'Square metre / second', plural: 'square metres per second', symbol: 'm²/s', slug: 'square-metre-per-second', factor: 1, system: 'si', definition: 'The SI unit of kinematic viscosity — dynamic viscosity divided by density. Most liquids are a tiny fraction of 1 m²/s (water is about 1×10⁻⁶ m²/s).' },
    { id: 'mm2s', name: 'Square millimetre / second', plural: 'square millimetres per second', symbol: 'mm²/s', slug: 'square-millimetre-per-second', factor: 1e-6, system: 'si', definition: 'One millionth of a m²/s (10⁻⁶ m²/s), numerically identical to the centistokes. The practical SI unit — water at 20 °C is about 1 mm²/s.' },
    { id: 'st', name: 'Stokes', plural: 'stokes', symbol: 'St', slug: 'stokes', factor: 1e-4, system: 'other', definition: 'The CGS unit of kinematic viscosity — one square centimetre per second, exactly 10⁻⁴ m²/s. Named after George Stokes.' },
    { id: 'cst', name: 'Centistokes', plural: 'centistokes', symbol: 'cSt', slug: 'centistokes', factor: 1e-6, system: 'other', definition: 'One-hundredth of a stokes, equal to 1 mm²/s. The standard unit for lubricants — engine oils are typically rated by their centistokes at 40 °C and 100 °C.' },
  ],
  popularPairs: [
    ['cst', 'm2s'], ['m2s', 'cst'],
    ['st', 'm2s'], ['cst', 'mm2s'], ['st', 'cst'], ['cst', 'st'],
  ],
  pairMeta: {
    'cst-to-m2s': { slug: 'cst-to-m2s', exampleValue: 100, note: 'Centistokes to square metres per second divides by 1,000,000: 100 cSt is 1×10⁻⁴ m²/s. Oil data sheets quote centistokes, while fluid-mechanics equations use SI m²/s, so this is the common bridge.', tableValues: [1, 5, 10, 40, 100, 220, 460, 1000, 1500] },
    'm2s-to-cst': { slug: 'm2s-to-cst', exampleValue: 0.0001, note: 'Square metres per second to centistokes multiplies by 1,000,000: 1×10⁻⁴ m²/s is 100 cSt. Water\'s 1×10⁻⁶ m²/s becomes a tidy 1 cSt.', tableValues: [0.000001, 0.00001, 0.0001, 0.001, 0.01] },
    'st-to-m2s': { slug: 'st-to-m2s', exampleValue: 1, note: 'Stokes to square metres per second multiplies by 0.0001: 1 St is 1×10⁻⁴ m²/s. Converts the CGS stokes into SI units.' },
    'cst-to-mm2s': { slug: 'cst-to-mm2s', exampleValue: 1, note: 'Centistokes and square millimetres per second are the same size: 1 cSt = 1 mm²/s exactly. A 1-to-1 relationship, handy to confirm when a value is quoted in one unit and needed in the other.' },
    'st-to-cst': { slug: 'st-to-cst', exampleValue: 1, note: 'Stokes to centistokes multiplies by 100: 1 St is 100 cSt. Bridges the two CGS-family units.' },
    'cst-to-st': { slug: 'cst-to-st', exampleValue: 100, note: 'Centistokes to stokes divides by 100: 100 cSt is 1 St. The reverse of the stokes-to-centistokes conversion.' },
  },
};
