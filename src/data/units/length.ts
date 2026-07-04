import type { Quantity } from './types.ts';

export const length: Quantity = {
  id: 'length',
  name: 'Length & Distance',
  slug: 'length',
  baseUnit: 'm',
  icon: '📏',
  description:
    'Convert between metric and imperial length units — millimeters, centimeters, meters, kilometers, inches, feet, yards and miles. All conversions use exact internationally agreed factors (1 inch = 25.4 mm exactly, since 1959).',
  units: [
    {
      id: 'mm', name: 'Millimeter', plural: 'millimeters', symbol: 'mm', slug: 'mm', factor: 0.001, system: 'metric',
      definition: 'A millimeter (mm) is one thousandth of a meter, the SI base unit of length. It is commonly used for small measurements such as paper thickness, screw sizes and rainfall.',
    },
    {
      id: 'cm', name: 'Centimeter', plural: 'centimeters', symbol: 'cm', slug: 'cm', factor: 0.01, system: 'metric',
      definition: 'A centimeter (cm) is one hundredth of a meter. It is the everyday metric unit for body measurements, clothing sizes and small objects; 2.54 cm equal exactly 1 inch.',
    },
    {
      id: 'm', name: 'Meter', plural: 'meters', symbol: 'm', slug: 'meters', factor: 1, system: 'si',
      definition: 'The meter (m) is the SI base unit of length, defined by the distance light travels in a vacuum in 1/299,792,458 of a second. It underpins every other length unit in the metric system.',
    },
    {
      id: 'km', name: 'Kilometer', plural: 'kilometers', symbol: 'km', slug: 'km', factor: 1000, system: 'metric',
      definition: 'A kilometer (km) is 1,000 meters. It is the standard unit for road distances and geographic measurements in most countries; 1 km equals about 0.621 miles.',
    },
    {
      id: 'in', name: 'Inch', plural: 'inches', symbol: 'in', slug: 'inches', factor: 0.0254, system: 'imperial',
      definition: 'An inch (in) is an imperial and US customary unit defined as exactly 25.4 millimeters since 1959. Twelve inches make one foot; screens, wheels and paper sizes are commonly measured in inches.',
    },
    {
      id: 'ft', name: 'Foot', plural: 'feet', symbol: 'ft', slug: 'feet', factor: 0.3048, system: 'imperial',
      definition: 'A foot (ft) is an imperial and US customary unit equal to 12 inches or exactly 0.3048 meters. It is widely used for human height, room dimensions and altitude.',
    },
    {
      id: 'yd', name: 'Yard', plural: 'yards', symbol: 'yd', slug: 'yards', factor: 0.9144, system: 'imperial',
      definition: 'A yard (yd) equals 3 feet or exactly 0.9144 meters. It is used for fabric, sports fields (notably American football) and landscaping measurements.',
    },
    {
      id: 'mi', name: 'Mile', plural: 'miles', symbol: 'mi', slug: 'miles', factor: 1609.344, system: 'imperial',
      definition: 'A mile (mi) is an imperial unit equal to 5,280 feet or exactly 1,609.344 meters. It remains the standard road-distance unit in the United States and the United Kingdom.',
    },
    {
      id: 'nmi', name: 'Nautical mile', plural: 'nautical miles', symbol: 'nmi', slug: 'nautical-miles', factor: 1852, system: 'other',
      definition: 'A nautical mile (nmi) is exactly 1,852 meters, historically one minute of latitude. It is the standard distance unit in aviation and marine navigation; one knot is one nautical mile per hour.',
    },
    {
      id: 'um', name: 'Micrometer', plural: 'micrometers', symbol: 'µm', slug: 'micrometers', factor: 0.000001, system: 'metric',
      definition: 'A micrometer (µm), also called a micron, is one millionth of a meter. It is used for cell sizes, fine particles and semiconductor manufacturing dimensions.',
    },
  ],
  popularPairs: [
    ['cm', 'in'], ['in', 'cm'],
    ['mm', 'in'], ['in', 'mm'],
    ['ft', 'm'], ['m', 'ft'],
    ['km', 'mi'], ['mi', 'km'],
    ['cm', 'ft'], ['ft', 'cm'],
    ['in', 'ft'], ['ft', 'in'],
    ['yd', 'm'], ['m', 'yd'],
    ['cm', 'm'], ['m', 'cm'],
  ],
  pairMeta: {
    'cm-to-inches': {
      slug: 'cm-to-inches',
      exampleValue: 170,
      note: 'Centimeters-to-inches is the most common length conversion for body height, clothing and screen sizes. Since 1 inch is defined as exactly 2.54 cm, dividing centimeters by 2.54 always gives an exact result — for example, an average adult height of 170 cm is 66.93 inches (about 5 feet 7 inches).',
      faqs: [
        { q: 'How tall is 170 cm in inches and feet?', a: '170 cm equals 66.93 inches, which is 5 feet 6.9 inches — commonly rounded to 5′ 7″.' },
      ],
    },
    'inches-to-cm': {
      slug: 'inches-to-cm',
      exampleValue: 32,
      note: 'Inches-to-centimeters comes up constantly with screen sizes (TVs and monitors are sold by diagonal inches worldwide) and US product dimensions. A 32-inch TV has an 81.28 cm diagonal, since 1 inch equals exactly 2.54 cm.',
    },
    'feet-to-meters': {
      slug: 'feet-to-meters',
      exampleValue: 100,
      note: 'Feet-to-meters is standard in construction, aviation and real estate. One foot is exactly 0.3048 meters, so a 100-foot building is 30.48 m tall. Aviation altitudes are still given in feet almost everywhere in the world.',
    },
    'km-to-miles': {
      slug: 'km-to-miles',
      exampleValue: 42.195,
      note: 'Kilometers-to-miles is the classic travel and running conversion. A marathon of 42.195 km equals 26.22 miles. A quick mental trick: multiply kilometers by 0.6 for a close estimate (the exact factor is 0.621371).',
      faqs: [
        { q: 'How many miles is a 5K and a 10K run?', a: 'A 5K is 3.11 miles and a 10K is 6.21 miles, using the exact factor 1 km = 0.621371 miles.' },
      ],
    },
    'miles-to-km': {
      slug: 'miles-to-km',
      exampleValue: 60,
      note: 'Miles-to-kilometers converts US/UK road distances and speed limits for the rest of the world. 60 miles is 96.56 km — which is why a 60 mph speed limit roughly equals 100 km/h.',
    },
  },
};
