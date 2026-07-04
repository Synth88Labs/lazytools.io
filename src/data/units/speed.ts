import type { Quantity } from './types.ts';

export const speed: Quantity = {
  id: 'speed',
  name: 'Speed',
  slug: 'speed',
  baseUnit: 'mps',
  icon: '🚀',
  description:
    'Convert between miles per hour, kilometers per hour, knots, meters per second and feet per second. Useful for driving abroad, aviation, sailing and physics — 1 mph = 1.60934 km/h exactly.',
  units: [
    {
      id: 'mps', name: 'Meter per second', plural: 'meters per second', symbol: 'm/s', slug: 'mps', factor: 1, system: 'si',
      definition: 'Meters per second (m/s) is the SI unit of speed. Physics calculations and wind speeds in scientific contexts use m/s; 1 m/s equals exactly 3.6 km/h.',
    },
    {
      id: 'kmh', name: 'Kilometer per hour', plural: 'kilometers per hour', symbol: 'km/h', slug: 'kmh', factor: 1 / 3.6, system: 'metric',
      definition: 'Kilometers per hour (km/h) is the standard road-speed unit in most countries. 100 km/h equals 62.14 mph or 27.78 m/s.',
    },
    {
      id: 'mph', name: 'Mile per hour', plural: 'miles per hour', symbol: 'mph', slug: 'mph', factor: 0.44704, system: 'imperial',
      definition: 'Miles per hour (mph) is the road-speed unit of the United States and United Kingdom. 1 mph is exactly 1.609344 km/h.',
    },
    {
      id: 'kn', name: 'Knot', plural: 'knots', symbol: 'kn', slug: 'knots', factor: 1852 / 3600, system: 'other',
      definition: 'A knot (kn) is one nautical mile per hour, exactly 1.852 km/h. Aircraft, ships and wind speeds in meteorology are measured in knots.',
    },
    {
      id: 'fps', name: 'Foot per second', plural: 'feet per second', symbol: 'ft/s', slug: 'fps', factor: 0.3048, system: 'imperial',
      definition: 'Feet per second (ft/s) is a US customary speed unit, exactly 0.3048 m/s. Projectile velocities and some engineering specs use ft/s.',
    },
    {
      id: 'mach', name: 'Mach (sea level)', plural: 'Mach', symbol: 'Ma', slug: 'mach', factor: 340.29, system: 'other',
      definition: 'Mach number expresses speed relative to the speed of sound — Mach 1 ≈ 340.29 m/s (1,225 km/h) at sea level and 15 °C. The true value varies with altitude and temperature.',
    },
  ],
  popularPairs: [
    ['mph', 'kmh'], ['kmh', 'mph'],
    ['kn', 'mph'], ['mph', 'kn'],
    ['kn', 'kmh'], ['kmh', 'kn'],
    ['mps', 'kmh'], ['kmh', 'mps'],
    ['mps', 'mph'],
  ],
  pairMeta: {
    'mph-to-kmh': {
      slug: 'mph-to-kmh',
      exampleValue: 70,
      note: 'Mph-to-km/h converts US/UK speed limits for the rest of the world. Common limits: 30 mph = 48 km/h, 55 mph = 88.5 km/h, 70 mph = 112.7 km/h. Quick estimate: add 60% (multiply by 1.6).',
      tableValues: [10, 20, 30, 40, 50, 55, 60, 65, 70, 75, 80, 90, 100, 120, 150, 200],
    },
    'kmh-to-mph': {
      slug: 'kmh-to-mph',
      exampleValue: 100,
      note: 'Km/h-to-mph is the reverse driving conversion: 50 km/h = 31.1 mph (city), 100 km/h = 62.1 mph (highway), 130 km/h = 80.8 mph (autobahn advisory). Quick estimate: multiply by 0.6.',
      tableValues: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 200, 300],
    },
    'knots-to-mph': {
      slug: 'knots-to-mph',
      exampleValue: 20,
      note: 'Knots-to-mph matters for sailing, aviation and hurricane reports. A 20-knot wind is 23 mph; hurricane force (64 kn) is 73.6 mph. One knot is 1.15078 mph.',
    },
  },
};
