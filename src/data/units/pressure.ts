import type { Quantity } from './types';

export const pressure: Quantity = {
  id: 'pressure',
  name: 'Pressure',
  slug: 'pressure',
  baseUnit: 'pa',
  icon: '🎈',
  description:
    'Convert between PSI, bar, pascal, atmospheres and mmHg. Tire pressures, weather systems and medical readings all use different pressure units — 1 bar = 14.5038 psi.',
  units: [
    {
      id: 'pa', name: 'Pascal', plural: 'pascals', symbol: 'Pa', slug: 'pascal', factor: 1, system: 'si',
      definition: 'The pascal (Pa) is the SI unit of pressure — one newton per square meter. It is small in everyday terms: atmospheric pressure is about 101,325 Pa.',
    },
    {
      id: 'kpa', name: 'Kilopascal', plural: 'kilopascals', symbol: 'kPa', slug: 'kpa', factor: 1000, system: 'si',
      definition: 'A kilopascal (kPa) is 1,000 pascals. Tire pressures in many countries and weather reports in Canada use kilopascals; standard atmosphere is 101.325 kPa.',
    },
    {
      id: 'mpa', name: 'Megapascal', plural: 'megapascals', symbol: 'MPa', slug: 'mpa', factor: 1000000, system: 'si',
      definition: 'A megapascal (MPa) is one million pascals, used for material strength (concrete, steel) and hydraulic systems.',
    },
    {
      id: 'bar', name: 'Bar', plural: 'bars', symbol: 'bar', slug: 'bar', factor: 100000, system: 'metric',
      definition: 'A bar is exactly 100,000 Pa — within 2% of one atmosphere. European tire pressures and scuba tank ratings are given in bar.',
    },
    {
      id: 'psi', name: 'Pound per square inch', plural: 'pounds per square inch', symbol: 'psi', slug: 'psi', factor: 6894.757293168, system: 'us',
      definition: 'PSI (pound-force per square inch) is the US customary pressure unit, about 6,894.76 Pa. US tire pressures (typically 30–35 psi) and plumbing systems use psi.',
    },
    {
      id: 'atm', name: 'Atmosphere', plural: 'atmospheres', symbol: 'atm', slug: 'atm', factor: 101325, system: 'other',
      definition: 'A standard atmosphere (atm) is exactly 101,325 Pa — the average sea-level air pressure. Diving depth pressure is often expressed in atmospheres.',
    },
    {
      id: 'torr', name: 'Torr', plural: 'torr', symbol: 'Torr', slug: 'torr', factor: 101325 / 760, system: 'other',
      definition: 'A torr is 1/760 of a standard atmosphere (about 133.322 Pa), essentially equal to one millimeter of mercury. Vacuum systems are specified in torr.',
    },
    {
      id: 'mmhg', name: 'Millimeter of mercury', plural: 'millimeters of mercury', symbol: 'mmHg', slug: 'mmhg', factor: 133.322387415, system: 'other',
      definition: 'A millimeter of mercury (mmHg) is 133.322 Pa. Blood pressure worldwide is measured in mmHg — a healthy reading is around 120/80 mmHg.',
    },
    {
      id: 'inhg', name: 'Inch of mercury', plural: 'inches of mercury', symbol: 'inHg', slug: 'inhg', factor: 3386.389, system: 'us',
      definition: 'An inch of mercury (inHg) is 3,386.39 Pa. US weather barometric pressure (~29.92 inHg standard) and aviation altimeter settings use inches of mercury.',
    },
  ],
  popularPairs: [
    ['psi', 'bar'], ['bar', 'psi'],
    ['kpa', 'psi'], ['psi', 'kpa'],
    ['bar', 'kpa'], ['kpa', 'bar'],
    ['atm', 'psi'],
    ['mmhg', 'kpa'],
  ],
  pairMeta: {
    'psi-to-bar': {
      slug: 'psi-to-bar',
      exampleValue: 32,
      note: 'PSI-to-bar is the classic tire-pressure conversion between US and European specifications. A typical car tire at 32 psi is 2.21 bar. 1 bar = 14.5038 psi, so dividing psi by 14.5 gives bar.',
      tableValues: [1, 5, 10, 15, 20, 25, 28, 30, 32, 35, 40, 50, 60, 80, 100, 150, 200, 3000],
      faqs: [
        { q: 'What is normal tire pressure in psi and bar?', a: 'Most passenger cars specify 30–35 psi, which is 2.07–2.41 bar. Check the sticker inside the driver-side door for your vehicle’s exact spec.' },
      ],
    },
    'bar-to-psi': {
      slug: 'bar-to-psi',
      exampleValue: 2.4,
      note: 'Bar-to-psi converts European tire and equipment pressures to US units: 2.4 bar is 34.8 psi. A scuba tank rated 232 bar is 3,365 psi.',
      tableValues: [0.5, 1, 1.5, 2, 2.2, 2.4, 2.5, 3, 4, 5, 10, 50, 100, 200, 232, 300],
    },
  },
};
