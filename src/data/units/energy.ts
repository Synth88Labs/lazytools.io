import type { Quantity } from './types.ts';

export const energy: Quantity = {
  id: 'energy',
  name: 'Energy',
  slug: 'energy',
  baseUnit: 'j',
  icon: '⚡',
  description:
    'Convert between joules, calories, kilowatt-hours and BTU. Food energy, electricity bills and heating capacity each use different units — 1 food Calorie (kcal) = 4,184 joules.',
  units: [
    {
      id: 'j', name: 'Joule', plural: 'joules', symbol: 'J', slug: 'joules', factor: 1, system: 'si',
      definition: 'The joule (J) is the SI unit of energy — the work done by a one-newton force over one meter. All other energy units are defined in joules.',
    },
    {
      id: 'kj', name: 'Kilojoule', plural: 'kilojoules', symbol: 'kJ', slug: 'kj', factor: 1000, system: 'si',
      definition: 'A kilojoule (kJ) is 1,000 joules. Food energy on labels in Australia, NZ and the EU is stated in kilojoules alongside or instead of kilocalories.',
    },
    {
      id: 'cal', name: 'Calorie (small)', plural: 'calories', symbol: 'cal', slug: 'calories', factor: 4.184, system: 'other',
      definition: 'A small (gram) calorie (cal) is exactly 4.184 joules — the energy to heat 1 gram of water by 1 °C. Note that food "Calories" are actually kilocalories (1,000 small calories).',
    },
    {
      id: 'kcal', name: 'Kilocalorie', plural: 'kilocalories', symbol: 'kcal', slug: 'kcal', factor: 4184, system: 'other',
      definition: 'A kilocalorie (kcal) is 4,184 joules — identical to the food "Calorie" (capital C) on US nutrition labels. A 2,000-Calorie diet is 2,000 kcal or 8,368 kJ.',
    },
    {
      id: 'wh', name: 'Watt-hour', plural: 'watt-hours', symbol: 'Wh', slug: 'wh', factor: 3600, system: 'si',
      definition: 'A watt-hour (Wh) is 3,600 joules — one watt sustained for an hour. Phone and laptop battery capacities are commonly given in watt-hours.',
    },
    {
      id: 'kwh', name: 'Kilowatt-hour', plural: 'kilowatt-hours', symbol: 'kWh', slug: 'kwh', factor: 3600000, system: 'si',
      definition: 'A kilowatt-hour (kWh) is 3.6 million joules — the unit on your electricity bill. Running a 1,000 W appliance for one hour uses exactly 1 kWh.',
    },
    {
      id: 'btu', name: 'British thermal unit', plural: 'BTU', symbol: 'BTU', slug: 'btu', factor: 1055.05585262, system: 'us',
      definition: 'A British thermal unit (BTU) is about 1,055 joules — the energy to heat one pound of water by 1 °F. Air conditioners and heaters are rated in BTU per hour.',
    },
    {
      id: 'ftlb', name: 'Foot-pound', plural: 'foot-pounds', symbol: 'ft⋅lb', slug: 'ft-lb', factor: 1.3558179483314004, system: 'us',
      definition: 'A foot-pound (ft⋅lb) is the energy of one pound-force acting over one foot, about 1.3558 joules. Torque wrench settings and muzzle energies use foot-pounds.',
    },
  ],
  popularPairs: [
    ['kcal', 'kj'], ['kj', 'kcal'],
    ['cal', 'kcal'], ['kcal', 'cal'],
    ['kwh', 'btu'], ['btu', 'kwh'],
    ['j', 'kj'],
    ['kcal', 'kwh'],
  ],
  pairMeta: {
    'kcal-to-kj': {
      slug: 'kcal-to-kj',
      exampleValue: 2000,
      note: 'Kcal-to-kJ converts between the two food-energy units on nutrition labels. US labels use Calories (kcal); Australian, NZ and EU labels use kilojoules. A 2,000 kcal daily intake is 8,368 kJ. Multiply kcal by 4.184 for kJ.',
      faqs: [
        { q: 'Are food Calories the same as kcal?', a: 'Yes — a food Calorie (capital C) is exactly one kilocalorie (kcal), which is 4.184 kJ. A 250-Calorie snack is 250 kcal or 1,046 kJ.' },
      ],
    },
    'kwh-to-btu': {
      slug: 'kwh-to-btu',
      exampleValue: 1,
      note: '1 kWh equals 3,412.14 BTU. This conversion sizes heating and cooling: a 12,000 BTU/h air conditioner (one "ton" of cooling) consumes roughly 3.5 kWh per hour of runtime at typical efficiency.',
    },
  },
};
