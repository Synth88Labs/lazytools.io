import type { Quantity } from './types.ts';

/**
 * Base unit: coulomb (C = one ampere-second). 1 ampere-hour = 3600 C (exact);
 * 1 milliampere-hour = 3.6 C. Battery capacity is quoted in mAh or Ah.
 */
export const charge: Quantity = {
  id: 'charge',
  name: 'Electric Charge',
  slug: 'charge',
  baseUnit: 'c',
  icon: '🔋',
  description:
    'Convert electric charge and battery-capacity units — coulomb, millicoulomb, microcoulomb, ampere-hour and milliampere-hour. 1 Ah = 3600 C; battery capacity is measured in mAh.',
  units: [
    { id: 'c', name: 'Coulomb', plural: 'coulombs', symbol: 'C', slug: 'coulomb', factor: 1, system: 'si', definition: 'The SI unit of electric charge — the charge carried by a one-ampere current in one second. It equals about 6.24×10¹⁸ elementary charges.' },
    { id: 'mc', name: 'Millicoulomb', plural: 'millicoulombs', symbol: 'mC', slug: 'millicoulomb', factor: 1e-3, system: 'si', definition: 'One-thousandth of a coulomb (10⁻³ C). Used for small charges in electronics and capacitor work.' },
    { id: 'uc', name: 'Microcoulomb', plural: 'microcoulombs', symbol: 'µC', slug: 'microcoulomb', factor: 1e-6, system: 'si', definition: 'One-millionth of a coulomb (10⁻⁶ C). A typical static-electricity or small-capacitor charge is in the microcoulomb range.' },
    { id: 'kc', name: 'Kilocoulomb', plural: 'kilocoulombs', symbol: 'kC', slug: 'kilocoulomb', factor: 1e3, system: 'si', definition: 'One thousand coulombs (10³ C). A large charge — a fully charged car battery moves tens of kilocoulombs over its life.' },
    { id: 'ah', name: 'Ampere-hour', plural: 'ampere-hours', symbol: 'Ah', slug: 'ampere-hour', factor: 3600, system: 'other', definition: 'The charge from one ampere flowing for one hour — exactly 3600 coulombs. Car and deep-cycle battery capacity is rated in ampere-hours.' },
    { id: 'mah', name: 'Milliampere-hour', plural: 'milliampere-hours', symbol: 'mAh', slug: 'milliampere-hour', factor: 3.6, system: 'other', definition: 'One-thousandth of an ampere-hour (3.6 C). The standard rating for phone, laptop and small-battery capacity — a phone battery is around 3,000–5,000 mAh.' },
  ],
  popularPairs: [
    ['mah', 'c'], ['c', 'mah'],
    ['ah', 'c'], ['ah', 'mah'], ['mah', 'ah'], ['c', 'uc'],
  ],
  pairMeta: {
    'mah-to-c': { slug: 'mah-to-c', exampleValue: 3000, note: 'Milliampere-hours to coulombs multiplies by 3.6: a 3,000 mAh phone battery holds 10,800 C of charge. Battery capacity is quoted in mAh, but the underlying SI charge is the coulomb.', tableValues: [100, 500, 1000, 2000, 3000, 4000, 5000, 10000, 20000] },
    'c-to-mah': { slug: 'c-to-mah', exampleValue: 3600, note: 'Coulombs to milliampere-hours divides by 3.6: 3,600 C is 1,000 mAh (which is also 1 Ah). Use it to turn an SI charge into the mAh figure batteries are labelled with.', tableValues: [36, 360, 3600, 7200, 18000, 36000, 72000] },
    'ah-to-c': { slug: 'ah-to-c', exampleValue: 1, note: 'Ampere-hours to coulombs multiplies by 3,600: 1 Ah is 3,600 C. A 100 Ah deep-cycle battery therefore stores 360,000 C of charge.' },
    'ah-to-mah': { slug: 'ah-to-mah', exampleValue: 1, note: 'Ampere-hours to milliampere-hours multiplies by 1,000: 1 Ah is 1,000 mAh. Large batteries are rated in Ah, small ones in mAh — this is the everyday battery conversion.' },
    'mah-to-ah': { slug: 'mah-to-ah', exampleValue: 5000, note: 'Milliampere-hours to ampere-hours divides by 1,000: a 5,000 mAh power bank is 5 Ah. Handy for comparing a phone-battery rating with a car-battery one.' },
    'c-to-uc': { slug: 'c-to-uc', exampleValue: 1, note: 'Coulombs to microcoulombs multiplies by 1,000,000: 1 C is a million µC. The microcoulomb suits the tiny charges in electronics and electrostatics.' },
  },
};
