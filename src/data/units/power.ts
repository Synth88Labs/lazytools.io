import type { Quantity } from './types.ts';

export const power: Quantity = {
  id: 'power',
  name: 'Power',
  slug: 'power',
  baseUnit: 'w',
  icon: '🔌',
  description:
    'Convert between watts, kilowatts, horsepower and BTU/h. Car engines, appliances and HVAC systems are rated in different power units — 1 hp = 745.7 W.',
  units: [
    {
      id: 'w', name: 'Watt', plural: 'watts', symbol: 'W', slug: 'watts', factor: 1, system: 'si',
      definition: 'The watt (W) is the SI unit of power — one joule per second. Light bulbs, chargers and speakers are rated in watts.',
    },
    {
      id: 'kw', name: 'Kilowatt', plural: 'kilowatts', symbol: 'kW', slug: 'kw', factor: 1000, system: 'si',
      definition: 'A kilowatt (kW) is 1,000 watts. Electric vehicle motors, home appliances and solar systems are rated in kilowatts; 1 kW ≈ 1.34 hp.',
    },
    {
      id: 'mw', name: 'Megawatt', plural: 'megawatts', symbol: 'MW', slug: 'mw', factor: 1000000, system: 'si',
      definition: 'A megawatt (MW) is one million watts. Power plants and wind turbines are rated in megawatts; 1 MW supplies roughly 750–1,000 homes.',
    },
    {
      id: 'hp', name: 'Horsepower (mechanical)', plural: 'horsepower', symbol: 'hp', slug: 'hp', factor: 745.6998715822702, system: 'us',
      definition: 'Mechanical horsepower (hp) is exactly 745.6998715823 watts — 550 foot-pounds per second, defined by James Watt. US and UK car engines are rated in this horsepower.',
    },
    {
      id: 'ps', name: 'Metric horsepower', plural: 'metric horsepower', symbol: 'PS', slug: 'metric-hp', factor: 735.49875, system: 'metric',
      definition: 'Metric horsepower (PS, from German "Pferdestärke") is exactly 735.49875 watts — about 1.4% smaller than mechanical hp. European and Japanese car specs commonly use PS.',
    },
    {
      id: 'btuh', name: 'BTU per hour', plural: 'BTU per hour', symbol: 'BTU/h', slug: 'btu-per-hour', factor: 1055.05585262 / 3600, system: 'us',
      definition: 'BTU per hour (BTU/h) is the US rating unit for heating and cooling equipment, about 0.293 watts. A 12,000 BTU/h air conditioner equals 3.52 kW of cooling.',
    },
  ],
  popularPairs: [
    ['hp', 'kw'], ['kw', 'hp'],
    ['ps', 'kw'], ['kw', 'ps'],
    ['w', 'kw'],
    ['btuh', 'kw'], ['kw', 'btuh'],
  ],
  pairMeta: {
    'hp-to-kw': {
      slug: 'hp-to-kw',
      exampleValue: 300,
      note: 'Horsepower-to-kilowatts is the standard engine-spec conversion — EV motors and official EU figures use kW while US car culture uses hp. A 300 hp engine is 223.7 kW. Quick estimate: multiply hp by 0.75.',
      tableValues: [50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000],
      faqs: [
        { q: 'Is hp or PS bigger?', a: 'Mechanical hp (745.7 W) is about 1.4% larger than metric PS (735.5 W). A 300 PS engine is 296 hp — marketing materials sometimes blur the two.' },
      ],
    },
    'kw-to-hp': {
      slug: 'kw-to-hp',
      exampleValue: 150,
      note: 'Kw-to-hp converts EV and European engine ratings to familiar horsepower: a 150 kW electric motor is 201.2 hp. 1 kW = 1.341 hp.',
      tableValues: [10, 50, 75, 100, 110, 150, 200, 250, 300, 500],
    },
  },
};
