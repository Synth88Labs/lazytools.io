import type { Quantity } from './types.ts';

/** Base unit: newton-metre (N·m). 1 lbf = 0.45359237×9.80665 N; 1 ft = 0.3048 m (exact). */
export const torque: Quantity = {
  id: 'torque',
  name: 'Torque',
  slug: 'torque',
  baseUnit: 'nm',
  icon: '🔧',
  description:
    'Convert torque units — newton-metres, kilonewton-metres, pound-feet, pound-inches, kilogram-force metres and ounce-inches. 1 lbf·ft ≈ 1.3558 N·m.',
  units: [
    { id: 'nm', name: 'Newton-metre', plural: 'newton-metres', symbol: 'N·m', slug: 'nm', factor: 1, system: 'si', definition: 'The SI unit of torque — one newton of force at one metre from the axis. Engine and fastener torque is specified in N·m across most of the world.' },
    { id: 'knm', name: 'Kilonewton-metre', plural: 'kilonewton-metres', symbol: 'kN·m', slug: 'knm', factor: 1e3, system: 'si', definition: 'A kilonewton-metre is 1,000 N·m — used for large machinery, structural connections and heavy industrial torque.' },
    { id: 'lbf-ft', name: 'Pound-foot', plural: 'pound-feet', symbol: 'lbf·ft', slug: 'lbf-ft', factor: 0.45359237 * 9.80665 * 0.3048, system: 'us', definition: 'A pound-foot is the torque of one pound-force at one foot — the US car-spec unit (often written "ft-lb"). One lbf·ft is about 1.3558 N·m.' },
    { id: 'lbf-in', name: 'Pound-inch', plural: 'pound-inches', symbol: 'lbf·in', slug: 'lbf-in', factor: (0.45359237 * 9.80665 * 0.3048) / 12, system: 'us', definition: 'A pound-inch is one-twelfth of a pound-foot (about 0.113 N·m) — used for small fasteners and precision assemblies.' },
    { id: 'kgf-m', name: 'Kilogram-force metre', plural: 'kilogram-force metres', symbol: 'kgf·m', slug: 'kgf-m', factor: 9.80665, system: 'metric', definition: 'A kilogram-force metre is the torque of one kilogram-force at one metre — 9.80665 N·m exactly. Older European and Japanese specs use it.' },
    { id: 'ozf-in', name: 'Ounce-inch', plural: 'ounce-inches', symbol: 'ozf·in', slug: 'ozf-in', factor: (0.45359237 * 9.80665 * 0.3048) / 12 / 16, system: 'us', definition: 'An ounce-inch is one-sixteenth of a pound-inch (about 0.00706 N·m) — the unit for small electric-motor and hobby-servo torque.' },
  ],
  popularPairs: [
    ['nm', 'lbf-ft'], ['lbf-ft', 'nm'],
    ['nm', 'kgf-m'], ['lbf-ft', 'lbf-in'], ['nm', 'lbf-in'], ['kgf-m', 'nm'],
  ],
  pairMeta: {
    'nm-to-lbf-ft': { slug: 'nm-to-lbf-ft', exampleValue: 100, note: 'Newton-metres to pound-feet divides by about 1.3558: a 100 N·m spec is about 73.8 lbf·ft. This is the everyday conversion for torque wrenches, since manuals may give N·m while your wrench reads ft-lb (the same thing as lbf·ft).' , tableValues: [10, 20, 25, 40, 50, 80, 100, 150, 200, 300] },
    'lbf-ft-to-nm': { slug: 'lbf-ft-to-nm', exampleValue: 80, note: 'Pound-feet to newton-metres multiplies by about 1.3558: an 80 lbf·ft lug-nut spec is about 108 N·m. Use it when a US manual lists ft-lb but your torque wrench is set in N·m.' , tableValues: [5, 10, 15, 20, 25, 50, 75, 80, 100, 150] },
    'nm-to-kgf-m': { slug: 'nm-to-kgf-m', exampleValue: 100, note: 'Newton-metres to kilogram-force metres divides by 9.80665 (standard gravity): 100 N·m is about 10.2 kgf·m. Older Japanese and European service data often list kgf·m (sometimes written "kg-m").' },
    'lbf-ft-to-lbf-in': { slug: 'lbf-ft-to-lbf-in', exampleValue: 10, note: 'Pound-feet to pound-inches multiplies by 12, since there are 12 inches in a foot: 10 lbf·ft is 120 lbf·in. Small-fastener specs are often in lbf·in while bigger ones are in lbf·ft.' },
    'nm-to-lbf-in': { slug: 'nm-to-lbf-in', exampleValue: 5, note: 'Newton-metres to pound-inches multiplies by about 8.851: a 5 N·m spec is about 44.3 lbf·in. Common for electronics, bicycle and precision assembly work where torque is small.' },
    'kgf-m-to-nm': { slug: 'kgf-m-to-nm', exampleValue: 10, note: 'Kilogram-force metres to newton-metres multiplies by 9.80665: 10 kgf·m is 98.07 N·m. This converts vintage or JDM torque specs into modern N·m.' },
  },
};
