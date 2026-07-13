import type { Quantity } from './types.ts';

/**
 * Base unit: pascal-second (Pa·s), the SI unit of dynamic viscosity.
 * 1 poise = 0.1 Pa·s (exact, CGS); 1 centipoise = 1 mPa·s = 10⁻³ Pa·s;
 * 1 micropoise = 10⁻⁷ Pa·s. Water at 20 °C is about 1 cP.
 */
export const viscosity: Quantity = {
  id: 'viscosity',
  name: 'Dynamic Viscosity',
  slug: 'viscosity',
  baseUnit: 'pas',
  icon: '🫗',
  description:
    'Convert dynamic viscosity units — pascal-second, millipascal-second, poise, centipoise and micropoise. Water is about 1 cP; 1 poise = 0.1 Pa·s.',
  units: [
    { id: 'pas', name: 'Pascal-second', plural: 'pascal-seconds', symbol: 'Pa·s', slug: 'pascal-second', factor: 1, system: 'si', definition: 'The SI unit of dynamic viscosity — one pascal of shear stress producing a velocity gradient of one per second. Water is about 0.001 Pa·s; honey is a few Pa·s.' },
    { id: 'mpas', name: 'Millipascal-second', plural: 'millipascal-seconds', symbol: 'mPa·s', slug: 'millipascal-second', factor: 1e-3, system: 'si', definition: 'One-thousandth of a pascal-second (10⁻³ Pa·s), numerically identical to the centipoise. The everyday unit for thin liquids — water at 20 °C is almost exactly 1 mPa·s.' },
    { id: 'p', name: 'Poise', plural: 'poise', symbol: 'P', slug: 'poise', factor: 0.1, system: 'other', definition: 'The CGS unit of dynamic viscosity, exactly 0.1 Pa·s. Named after Poiseuille; still common in older fluid-mechanics and lubricant literature.' },
    { id: 'cp', name: 'Centipoise', plural: 'centipoise', symbol: 'cP', slug: 'centipoise', factor: 1e-3, system: 'other', definition: 'One-hundredth of a poise, equal to 1 mPa·s. The most-used practical unit — water is ~1 cP, motor oil tens to hundreds, honey around 10,000 cP.' },
    { id: 'up', name: 'Micropoise', plural: 'micropoise', symbol: 'µP', slug: 'micropoise', factor: 1e-7, system: 'other', definition: 'One-millionth of a poise (10⁻⁷ Pa·s). Suited to very low viscosities such as gases — air is about 180 µP.' },
  ],
  popularPairs: [
    ['cp', 'pas'], ['pas', 'cp'],
    ['p', 'pas'], ['cp', 'mpas'], ['pas', 'p'], ['cp', 'p'],
  ],
  pairMeta: {
    'cp-to-pas': { slug: 'cp-to-pas', exampleValue: 100, note: 'Centipoise to pascal-seconds divides by 1,000: 100 cP is 0.1 Pa·s. Data sheets often quote viscosity in centipoise while engineering calculations want SI pascal-seconds, so this is the common bridge.', tableValues: [1, 10, 50, 100, 500, 1000, 5000, 10000, 100000] },
    'pas-to-cp': { slug: 'pas-to-cp', exampleValue: 1, note: 'Pascal-seconds to centipoise multiplies by 1,000: 1 Pa·s is 1,000 cP. Water (0.001 Pa·s) becomes a tidy 1 cP, which is why the centipoise is so widely used.', tableValues: [0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10] },
    'p-to-pas': { slug: 'p-to-pas', exampleValue: 1, note: 'Poise to pascal-seconds multiplies by 0.1: 1 P is exactly 0.1 Pa·s. Converts the CGS poise used in older references into modern SI units.' },
    'cp-to-mpas': { slug: 'cp-to-mpas', exampleValue: 1, note: 'Centipoise and millipascal-second are the same size: 1 cP = 1 mPa·s exactly. This "conversion" is 1-to-1 — useful confirmation when a value is quoted in one unit and needed in the other.' },
    'pas-to-p': { slug: 'pas-to-p', exampleValue: 1, note: 'Pascal-seconds to poise multiplies by 10: 1 Pa·s is 10 P. Handy when comparing an SI figure with a lubricant spec given in poise.' },
    'cp-to-p': { slug: 'cp-to-p', exampleValue: 100, note: 'Centipoise to poise divides by 100 (since a centipoise is one-hundredth of a poise): 100 cP is 1 P. Bridges the two CGS-family units.' },
  },
};
