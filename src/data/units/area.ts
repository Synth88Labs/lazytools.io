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
    'square-meters-to-square-feet': {
      slug: 'square-meters-to-square-feet',
      exampleValue: 100,
      note: 'Square-meters-to-square-feet makes metric property listings readable for US/Indian buyers: a 100 m² apartment is 1,076 ft². One square meter is 10.764 ft² — roughly, multiply by 10.75.',
    },
    'hectares-to-acres': {
      slug: 'hectares-to-acres',
      exampleValue: 50,
      note: 'One hectare is 2.471 acres, so a 50 ha farm is 123.6 acres. Hectares dominate agricultural statistics worldwide while US/UK farmland is still traded in acres.',
    },
    'square-feet-to-acres': {
      slug: 'square-feet-to-acres',
      exampleValue: 20000,
      note: 'Divide square feet by 43,560: a 20,000 ft² parcel is 0.459 acres. Useful for reading lot sizes in listings that quote square feet against zoning minimums stated in acres.',
    },
    'square-km-to-square-miles': {
      slug: 'square-km-to-square-miles',
      exampleValue: 100,
      note: 'One square kilometer is 0.3861 square miles, so 100 km² is 38.6 mi². Geographic statistics use both — a quick sanity check: a square mile is about 2.6 km², not 1.6 (the linear factor squared, a classic error).',
    },
    'square-miles-to-square-km': {
      slug: 'square-miles-to-square-km',
      exampleValue: 10,
      note: 'One square mile is 2.59 km² — the linear miles-to-km factor (1.609) squared. A 10 mi² county district is 25.9 km².',
    },
    'square-yards-to-square-meters': {
      slug: 'square-yards-to-square-meters',
      exampleValue: 100,
      note: 'A square yard — known as a "gaj" in South Asian real estate — is exactly 0.8361 m², so a 100 gaj plot is 83.6 m². Carpet sold by the square yard converts the same way.',
    },
    'square-meters-to-square-yards': {
      slug: 'square-meters-to-square-yards',
      exampleValue: 100,
      note: 'One square meter is 1.196 square yards, so 100 m² is 119.6 yd² (gaj). Property dealers in India and Pakistan quote plots in gaj while official records often use square meters.',
    },
    'square-feet-to-square-yards': {
      slug: 'square-feet-to-square-yards',
      exampleValue: 900,
      note: 'Nine square feet make one square yard, so 900 ft² is exactly 100 yd². Flooring and carpet estimates commonly need this — measure rooms in feet, buy carpet in square yards.',
    },
    'square-yards-to-square-feet': {
      slug: 'square-yards-to-square-feet',
      exampleValue: 100,
      note: 'Multiply square yards by 9: a 100 gaj (yd²) plot is 900 ft². The ×9 is exact, since a yard is exactly 3 feet.',
    },
  },
};
