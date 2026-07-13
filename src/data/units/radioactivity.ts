import type { Quantity } from './types.ts';

/**
 * Base unit: becquerel (Bq = one nuclear decay per second). 1 curie = 3.7×10¹⁰
 * Bq (exact by definition); 1 rutherford = 10⁶ Bq. SI prefixes: kBq = 10³,
 * MBq = 10⁶, GBq = 10⁹.
 */
export const radioactivity: Quantity = {
  id: 'radioactivity',
  name: 'Radioactivity',
  slug: 'radioactivity',
  baseUnit: 'bq',
  icon: '☢️',
  description:
    'Convert radioactivity (activity) units — becquerel, kilobecquerel, megabecquerel, gigabecquerel, curie, millicurie and microcurie. 1 curie = 3.7×10¹⁰ Bq.',
  units: [
    { id: 'bq', name: 'Becquerel', plural: 'becquerels', symbol: 'Bq', slug: 'becquerel', factor: 1, system: 'si', definition: 'The SI unit of radioactivity — one nuclear decay (disintegration) per second. A very small unit: a banana is about 15 Bq, a human body around 4,000 Bq.' },
    { id: 'kbq', name: 'Kilobecquerel', plural: 'kilobecquerels', symbol: 'kBq', slug: 'kilobecquerel', factor: 1e3, system: 'si', definition: 'One thousand becquerels (10³ Bq). A convenient scale for environmental and food-safety measurements.' },
    { id: 'mbq', name: 'Megabecquerel', plural: 'megabecquerels', symbol: 'MBq', slug: 'megabecquerel', factor: 1e6, system: 'si', definition: 'One million becquerels (10⁶ Bq). Nuclear-medicine doses are usually given in megabecquerels — e.g. a few hundred MBq for a scan.' },
    { id: 'gbq', name: 'Gigabecquerel', plural: 'gigabecquerels', symbol: 'GBq', slug: 'gigabecquerel', factor: 1e9, system: 'si', definition: 'One billion becquerels (10⁹ Bq). Used for stronger medical and industrial sources.' },
    { id: 'ci', name: 'Curie', plural: 'curies', symbol: 'Ci', slug: 'curie', factor: 3.7e10, system: 'other', definition: 'The traditional unit, defined as exactly 3.7×10¹⁰ Bq — originally the activity of one gram of radium-226. Still common in the US and in older literature.' },
    { id: 'mci', name: 'Millicurie', plural: 'millicuries', symbol: 'mCi', slug: 'millicurie', factor: 3.7e7, system: 'other', definition: 'One-thousandth of a curie (3.7×10⁷ Bq = 37 MBq). A typical unit for nuclear-medicine doses in countries using the curie.' },
    { id: 'uci', name: 'Microcurie', plural: 'microcuries', symbol: 'µCi', slug: 'microcurie', factor: 3.7e4, system: 'other', definition: 'One-millionth of a curie (3.7×10⁴ Bq = 37 kBq). Used for small check sources and laboratory quantities.' },
    { id: 'rd', name: 'Rutherford', plural: 'rutherfords', symbol: 'Rd', slug: 'rutherford', factor: 1e6, system: 'other', definition: 'An old unit equal to 10⁶ decays per second (1 MBq). Largely obsolete but occasionally seen in historical texts.' },
  ],
  popularPairs: [
    ['ci', 'bq'], ['bq', 'ci'],
    ['mci', 'mbq'], ['mbq', 'mci'], ['uci', 'kbq'], ['gbq', 'ci'],
  ],
  pairMeta: {
    'ci-to-bq': { slug: 'ci-to-bq', exampleValue: 1, note: 'Curie to becquerels multiplies by 3.7×10¹⁰: 1 Ci is 37 billion Bq. The curie is the older unit and the becquerel the SI one, so this converts historical or US figures into SI activity.', tableValues: [0.000001, 0.00001, 0.001, 0.01, 0.1, 1, 10, 100] },
    'bq-to-ci': { slug: 'bq-to-ci', exampleValue: 37e9, note: 'Becquerels to curies divides by 3.7×10¹⁰: 37 GBq is 1 Ci. Because the becquerel is so small, everyday activities come out as tiny fractions of a curie.', tableValues: [37000, 37e6, 3.7e7, 37e7, 3.7e9, 37e9, 3.7e10] },
    'mci-to-mbq': { slug: 'mci-to-mbq', exampleValue: 1, note: 'Millicurie to megabecquerels multiplies by 37: 1 mCi is 37 MBq. This is the everyday nuclear-medicine conversion — a dose written in mCi in one country is written in MBq in another.' },
    'mbq-to-mci': { slug: 'mbq-to-mci', exampleValue: 37, note: 'Megabecquerels to millicuries divides by 37: 37 MBq is 1 mCi. Convert an SI medical activity back into the millicurie figure used with the curie system.' },
    'uci-to-kbq': { slug: 'uci-to-kbq', exampleValue: 1, note: 'Microcurie to kilobecquerels multiplies by 37: 1 µCi is 37 kBq. Useful for small laboratory check sources quoted in microcuries.' },
    'gbq-to-ci': { slug: 'gbq-to-ci', exampleValue: 37, note: 'Gigabecquerels to curies divides by 37: 37 GBq is 1 Ci. Bridges the SI unit used for strong sources and the traditional curie.' },
  },
};
