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
    'mm-to-inches': {
      slug: 'mm-to-inches',
      exampleValue: 10,
      note: 'Millimeters-to-inches comes up with metric hardware, jewelry and rainfall. Since 1 inch is exactly 25.4 mm, divide millimeters by 25.4: a 10 mm bolt is 0.394 in, and a 13 mm wrench is nearly identical to a 1/2-inch one (12.7 mm) — close enough that the two are often confused.',
    },
    'inches-to-mm': {
      slug: 'inches-to-mm',
      exampleValue: 0.5,
      note: 'Inches-to-millimeters matters for fasteners, plumbing and CAD work where US specs meet metric parts. Multiply inches by exactly 25.4: a 1/2-inch pipe fitting is 12.7 mm, and 3/8 in is 9.525 mm.',
    },
    'meters-to-feet': {
      slug: 'meters-to-feet',
      exampleValue: 3000,
      note: 'Meters-to-feet converts elevations, building heights and dive depths. One meter is 3.2808 feet, so a 3,000 m mountain is 9,842.5 ft. Quick estimate: multiply meters by 3.3 (or by 3 and add 10%).',
    },
    'cm-to-feet': {
      slug: 'cm-to-feet',
      exampleValue: 180,
      note: 'Centimeters-to-feet is almost always a height question. One foot is exactly 30.48 cm, so 180 cm is 5.906 ft — read on a tape measure as 5 feet 10.9 inches. For height, the feet-and-inches form matters more than the decimal.',
      faqs: [
        { q: 'What is 180 cm in feet and inches?', a: '180 cm is 5.906 feet, which is 5 feet 10.9 inches — usually stated as 5′ 11″.' },
      ],
    },
    'feet-to-cm': {
      slug: 'feet-to-cm',
      exampleValue: 6,
      note: 'Feet-to-centimeters converts US heights and room dimensions to metric. One foot is exactly 30.48 cm, so 6 ft is 182.88 cm. For feet-and-inches heights, convert the inches part separately: 5 ft 8 in = (5 × 30.48) + (8 × 2.54) = 172.72 cm.',
    },
    'inches-to-feet': {
      slug: 'inches-to-feet',
      exampleValue: 65,
      note: 'Divide inches by 12 to get feet: 65 inches is 5.417 ft, i.e. 5 feet 5 inches. This conversion appears with US height listings and lumber lengths, where measurements often arrive in total inches.',
    },
    'feet-to-inches': {
      slug: 'feet-to-inches',
      exampleValue: 5.5,
      note: 'Multiply feet by 12: 5.5 ft is 66 inches. Useful for turning decimal-feet measurements (common in surveying and real-estate listings) back into the feet-and-inches a tape measure shows.',
    },
    'yards-to-meters': {
      slug: 'yards-to-meters',
      exampleValue: 100,
      note: 'A yard is exactly 0.9144 m — just 8.6% shorter than a meter. A 100-yard American-football field is 91.44 m, and fabric sold by the yard is a little less material than the same number of meters.',
    },
    'meters-to-yards': {
      slug: 'meters-to-yards',
      exampleValue: 100,
      note: 'One meter is 1.0936 yards, so the 100 m Olympic sprint is 109.36 yd. Golfers use this constantly: a 150 m marker plays as 164 yd.',
    },
    'cm-to-meters': {
      slug: 'cm-to-meters',
      exampleValue: 175,
      note: 'Divide centimeters by 100: 175 cm is 1.75 m. The main use is switching between the cm heights on medical forms and the meter heights used in BMI formulas — BMI needs meters, and using centimeters is the most common BMI calculation error.',
    },
    'meters-to-cm': {
      slug: 'meters-to-cm',
      exampleValue: 1.75,
      note: 'Multiply meters by 100: 1.75 m is 175 cm. Furniture and appliance specs often mix the two — a 0.6 m counter depth is the familiar 60 cm.',
    },
  },
};
