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
    'mph-to-knots': {
      slug: 'mph-to-knots',
      exampleValue: 25,
      note: 'Mph-to-knots converts land speeds to the nautical unit used by boats and aircraft: 25 mph is 21.7 knots. One mph is 0.869 knots, so knots are always the smaller number.',
    },
    'knots-to-kmh': {
      slug: 'knots-to-kmh',
      exampleValue: 20,
      note: 'One knot is exactly 1.852 km/h (one nautical mile per hour), so a 20-knot wind is 37 km/h. Weather services outside the US often publish marine winds in knots and land winds in km/h — this is the bridge between them.',
    },
    'kmh-to-knots': {
      slug: 'kmh-to-knots',
      exampleValue: 50,
      note: 'Divide km/h by 1.852: a 50 km/h wind is 27 knots. Sailors use this to translate land forecasts to the knots their instruments show.',
    },
    'mps-to-kmh': {
      slug: 'mps-to-kmh',
      exampleValue: 10,
      note: 'Meters-per-second to km/h is an exact ×3.6: a 10 m/s sprint is 36 km/h. Scientific wind reports use m/s while road signs use km/h — a 25 m/s storm gust is 90 km/h.',
    },
    'kmh-to-mps': {
      slug: 'kmh-to-mps',
      exampleValue: 100,
      note: 'Divide km/h by 3.6 for m/s: 100 km/h is 27.78 m/s. Physics problems want m/s, so this is the first step in most kinematics homework involving vehicle speeds.',
    },
    'mps-to-mph': {
      slug: 'mps-to-mph',
      exampleValue: 10,
      note: 'One meter per second is 2.237 mph, so 10 m/s is 22.4 mph. Elite sprinters average over 10 m/s in a 100 m race — faster than the speed limit in many residential zones.',
    },
  },
};
