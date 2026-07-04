import type { Quantity } from './types';

// Base unit: Celsius. baseValue = value * factor + offset
export const temperature: Quantity = {
  id: 'temperature',
  name: 'Temperature',
  slug: 'temperature',
  baseUnit: 'c',
  icon: '🌡️',
  description:
    'Convert between Celsius, Fahrenheit and Kelvin using the exact defining formulas (°F = °C × 9/5 + 32; K = °C + 273.15). Temperature scales use offsets, not simple multiplication, so a dedicated converter avoids the most common conversion mistakes.',
  units: [
    {
      id: 'c', name: 'Celsius', plural: 'degrees Celsius', symbol: '°C', slug: 'celsius', factor: 1, offset: 0, system: 'metric',
      definition: 'Degrees Celsius (°C) set 0° at the freezing point of water and 100° at its boiling point (at standard pressure). It is the everyday temperature scale in almost every country.',
    },
    {
      id: 'f', name: 'Fahrenheit', plural: 'degrees Fahrenheit', symbol: '°F', slug: 'fahrenheit', factor: 5 / 9, offset: -160 / 9, system: 'us',
      definition: 'Degrees Fahrenheit (°F) place water’s freezing point at 32° and boiling point at 212°. It is the everyday temperature scale in the United States.',
    },
    {
      id: 'k', name: 'Kelvin', plural: 'kelvins', symbol: 'K', slug: 'kelvin', factor: 1, offset: -273.15, system: 'si',
      definition: 'The kelvin (K) is the SI base unit of temperature, starting at absolute zero (0 K = −273.15 °C). A change of 1 K equals a change of 1 °C; kelvins are standard in science and engineering.',
    },
    {
      id: 'r', name: 'Rankine', plural: 'degrees Rankine', symbol: '°R', slug: 'rankine', factor: 5 / 9, offset: -273.15, system: 'other',
      definition: 'Degrees Rankine (°R) form an absolute scale using Fahrenheit-sized degrees: 0 °R is absolute zero. It appears mainly in US thermodynamics engineering.',
    },
  ],
  popularPairs: [
    ['c', 'f'], ['f', 'c'],
    ['c', 'k'], ['k', 'c'],
    ['f', 'k'], ['k', 'f'],
  ],
  pairMeta: {
    'celsius-to-fahrenheit': {
      slug: 'celsius-to-fahrenheit',
      formulaText: '°F = (°C × 9/5) + 32 — multiply the Celsius temperature by 9/5 (i.e. 1.8), then add 32.',
      reverseFormulaText: '°C = (°F − 32) × 5/9',
      exampleValue: 20,
      tableValues: [-40, -30, -20, -10, 0, 5, 10, 15, 20, 25, 30, 35, 37, 40, 50, 100, 180, 200, 220],
      note: 'Celsius-to-Fahrenheit is the most common temperature conversion — weather, cooking and body temperature. Anchor points worth memorizing: 0 °C = 32 °F (freezing), 20 °C = 68 °F (room temperature), 37 °C = 98.6 °F (body temperature), 100 °C = 212 °F (boiling). Mental shortcut: double the Celsius and add 30 (20 °C → 70 °F, close to the exact 68 °F). Note that −40° is the same in both scales.',
      faqs: [
        { q: 'What is a fever of 38 °C in Fahrenheit?', a: '38 °C is 100.4 °F — the common medical threshold for a fever.' },
        { q: 'What is 180 °C in Fahrenheit for baking?', a: '180 °C equals 356 °F. Recipes usually round this to 350 °F, the standard moderate oven temperature.' },
      ],
    },
    'fahrenheit-to-celsius': {
      slug: 'fahrenheit-to-celsius',
      formulaText: '°C = (°F − 32) × 5/9 — subtract 32 from the Fahrenheit temperature, then multiply by 5/9.',
      reverseFormulaText: '°F = (°C × 9/5) + 32',
      exampleValue: 98.6,
      tableValues: [-40, 0, 32, 50, 59, 68, 77, 86, 95, 98.6, 100, 104, 212, 350, 400, 450],
      note: 'Fahrenheit-to-Celsius converts US weather, oven and body temperatures for the rest of the world. Key anchors: 32 °F = 0 °C, 68 °F = 20 °C, 98.6 °F = 37 °C, 212 °F = 100 °C. Mental shortcut: subtract 30 and halve (86 °F → 28 ≈ 30 °C exact).',
      faqs: [
        { q: 'What is 350 °F in Celsius for baking?', a: '350 °F is 176.7 °C, usually rounded to 180 °C in metric recipes.' },
      ],
    },
    'celsius-to-kelvin': {
      slug: 'celsius-to-kelvin',
      formulaText: 'K = °C + 273.15 — add 273.15 to the Celsius temperature.',
      reverseFormulaText: '°C = K − 273.15',
      exampleValue: 25,
      tableValues: [-273.15, -100, -40, 0, 20, 25, 37, 100, 1000],
      note: 'Celsius-to-Kelvin is a pure offset: add 273.15. Kelvin is required in science because it starts at absolute zero, making ratios of temperatures physically meaningful. Standard lab temperature of 25 °C is 298.15 K.',
    },
    'kelvin-to-celsius': {
      slug: 'kelvin-to-celsius',
      formulaText: '°C = K − 273.15 — subtract 273.15 from the kelvin value.',
      reverseFormulaText: 'K = °C + 273.15',
      exampleValue: 300,
      tableValues: [0, 100, 200, 273.15, 293.15, 300, 310.15, 373.15, 1000],
    },
    'fahrenheit-to-kelvin': {
      slug: 'fahrenheit-to-kelvin',
      formulaText: 'K = (°F − 32) × 5/9 + 273.15 — convert to Celsius first, then add 273.15.',
      reverseFormulaText: '°F = (K − 273.15) × 9/5 + 32',
      exampleValue: 72,
      tableValues: [-40, 0, 32, 68, 72, 98.6, 212],
    },
    'kelvin-to-fahrenheit': {
      slug: 'kelvin-to-fahrenheit',
      formulaText: '°F = (K − 273.15) × 9/5 + 32 — convert to Celsius first, then apply the Fahrenheit formula.',
      reverseFormulaText: 'K = (°F − 32) × 5/9 + 273.15',
      exampleValue: 300,
      tableValues: [0, 255.37, 273.15, 293.15, 300, 310.15, 373.15],
    },
  },
};
