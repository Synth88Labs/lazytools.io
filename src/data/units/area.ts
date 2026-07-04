import type { Quantity } from './types.ts';

export const area: Quantity = {
  id: 'area',
  name: 'Area',
  slug: 'area',
  baseUnit: 'sqm',
  icon: '🗺️',
  description:
    'Convert between square meters, square feet, acres, hectares and other area units. Real-estate and land measurements are the most common use — 1 square meter equals 10.7639 square feet.',
  units: [
    {
      id: 'sqcm', name: 'Square centimeter', plural: 'square centimeters', symbol: 'cm²', slug: 'square-cm', factor: 0.0001, system: 'metric',
      definition: 'A square centimeter (cm²) is the area of a 1 cm × 1 cm square. It is used for small surfaces such as labels, screens and wounds in medicine.',
    },
    {
      id: 'sqm', name: 'Square meter', plural: 'square meters', symbol: 'm²', slug: 'square-meters', factor: 1, system: 'si',
      definition: 'A square meter (m²) is the SI unit of area — a 1 m × 1 m square. Apartment and house sizes are quoted in square meters in most of the world.',
    },
    {
      id: 'ha', name: 'Hectare', plural: 'hectares', symbol: 'ha', slug: 'hectares', factor: 10000, system: 'metric',
      definition: 'A hectare (ha) is 10,000 square meters — a 100 m × 100 m square, about 2.47 acres. It is the standard metric unit for land and farm area.',
    },
    {
      id: 'sqkm', name: 'Square kilometer', plural: 'square kilometers', symbol: 'km²', slug: 'square-km', factor: 1000000, system: 'metric',
      definition: 'A square kilometer (km²) is one million square meters (100 hectares). City and country areas are measured in square kilometers.',
    },
    {
      id: 'sqin', name: 'Square inch', plural: 'square inches', symbol: 'in²', slug: 'square-inches', factor: 0.00064516, system: 'imperial',
      definition: 'A square inch (in²) is the area of a 1 in × 1 in square, exactly 6.4516 cm². It appears in screen areas, pizza sizes and pressure units (psi).',
    },
    {
      id: 'sqft', name: 'Square foot', plural: 'square feet', symbol: 'ft²', slug: 'square-feet', factor: 0.09290304, system: 'imperial',
      definition: 'A square foot (ft²) is the area of a 1 ft × 1 ft square, exactly 0.09290304 m². US and Indian real estate is priced per square foot.',
    },
    {
      id: 'sqyd', name: 'Square yard', plural: 'square yards', symbol: 'yd²', slug: 'square-yards', factor: 0.83612736, system: 'imperial',
      definition: 'A square yard (yd²) is 9 square feet, exactly 0.83612736 m². Carpet and fabric are often sold by the square yard; in South Asia it is known as the "gaj".',
    },
    {
      id: 'acre', name: 'Acre', plural: 'acres', symbol: 'ac', slug: 'acres', factor: 4046.8564224, system: 'imperial',
      definition: 'An acre is 43,560 square feet, exactly 4,046.8564224 m² — roughly the area of an American football field without the end zones. It is the customary land unit in the US and UK.',
    },
    {
      id: 'sqmi', name: 'Square mile', plural: 'square miles', symbol: 'mi²', slug: 'square-miles', factor: 2589988.110336, system: 'imperial',
      definition: 'A square mile (mi²) is 640 acres, about 2.59 km². It is used for large land areas such as cities and counties in the US and UK.',
    },
  ],
  popularPairs: [
    ['sqft', 'sqm'], ['sqm', 'sqft'],
    ['acre', 'ha'], ['ha', 'acre'],
    ['acre', 'sqft'], ['sqft', 'acre'],
    ['sqkm', 'sqmi'], ['sqmi', 'sqkm'],
    ['sqyd', 'sqm'], ['sqm', 'sqyd'],
    ['sqft', 'sqyd'], ['sqyd', 'sqft'],
  ],
  pairMeta: {
    'square-feet-to-square-meters': {
      slug: 'square-feet-to-square-meters',
      exampleValue: 1000,
      note: 'Square-feet-to-square-meters is the standard real-estate conversion between US/Indian listings and metric countries. A 1,000 ft² apartment is 92.9 m². Quick estimate: divide square feet by 10 and subtract 7%.',
      faqs: [
        { q: 'How many square meters is a 1,200 sq ft apartment?', a: 'A 1,200 ft² apartment is 111.48 m², using 1 ft² = 0.092903 m².' },
      ],
    },
    'acres-to-hectares': {
      slug: 'acres-to-hectares',
      exampleValue: 100,
      note: 'Acres-to-hectares converts between imperial and metric land measurement. One acre is 0.4047 hectares, so a 100-acre farm is 40.47 ha. One hectare is about 2.47 acres.',
    },
    'acres-to-square-feet': {
      slug: 'acres-to-square-feet',
      exampleValue: 0.25,
      note: 'An acre is exactly 43,560 square feet. Residential lots are often fractions of an acre: a quarter-acre lot is 10,890 ft².',
    },
  },
};
