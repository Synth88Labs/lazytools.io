import type { Quantity } from './types.ts';

/**
 * Base unit: lux (lx = lumen per square metre). 1 foot-candle = 1 lm/ft² =
 * 1/0.3048² lux ≈ 10.7639 lux (exact); 1 phot = 1 lm/cm² = 10⁴ lux;
 * 1 nox = 1 millilux; 1 kilolux = 10³ lux.
 */
export const illuminance: Quantity = {
  id: 'illuminance',
  name: 'Illuminance',
  slug: 'illuminance',
  baseUnit: 'lx',
  icon: '💡',
  description:
    'Convert illuminance (light level) units — lux, foot-candles, kilolux, phot and nox. 1 foot-candle ≈ 10.764 lux; used in lighting design, photography and horticulture.',
  units: [
    { id: 'lx', name: 'Lux', plural: 'lux', symbol: 'lx', slug: 'lux', factor: 1, system: 'si', definition: 'The SI unit of illuminance — one lumen per square metre. A brightly lit office is about 500 lux; direct sunlight can exceed 100,000 lux.' },
    { id: 'fc', name: 'Foot-candle', plural: 'foot-candles', symbol: 'fc', slug: 'foot-candle', factor: 1 / (0.3048 ** 2), system: 'us', definition: 'One lumen per square foot, about 10.764 lux. Common in US and lighting-industry practice; 1 fc is roughly the light of one candle at one foot.' },
    { id: 'klx', name: 'Kilolux', plural: 'kilolux', symbol: 'klx', slug: 'kilolux', factor: 1e3, system: 'si', definition: 'One thousand lux — a convenient unit for bright conditions like overcast daylight (about 1–2 klx) or full sun (up to ~100 klx).' },
    { id: 'ph', name: 'Phot', plural: 'phots', symbol: 'ph', slug: 'phot', factor: 1e4, system: 'other', definition: 'The CGS unit of illuminance — one lumen per square centimetre, equal to 10,000 lux. Rarely used today outside older optics literature.' },
    { id: 'nox', name: 'Nox', plural: 'nox', symbol: 'nox', slug: 'nox', factor: 1e-3, system: 'other', definition: 'One millilux (0.001 lux) — a historical unit for very low light levels such as those near the threshold of vision.' },
  ],
  popularPairs: [
    ['lx', 'fc'], ['fc', 'lx'],
    ['klx', 'lx'], ['lx', 'klx'], ['fc', 'klx'], ['ph', 'lx'],
  ],
  pairMeta: {
    'lx-to-fc': { slug: 'lx-to-fc', exampleValue: 500, note: 'Lux to foot-candles divides by about 10.764: a 500-lux office is roughly 46 fc. Lighting specs jump between the two depending on region — Europe quotes lux, the US often foot-candles — so this is the everyday lighting conversion.', tableValues: [50, 100, 300, 500, 750, 1000, 10000, 50000, 100000] },
    'fc-to-lx': { slug: 'fc-to-lx', exampleValue: 50, note: 'Foot-candles to lux multiplies by about 10.764: 50 fc is about 538 lux. Use it to turn a US lighting recommendation (say 30–50 fc for an office) into the lux figure most meters and standards elsewhere use.', tableValues: [1, 5, 10, 30, 50, 100, 500, 1000, 10000] },
    'klx-to-lx': { slug: 'klx-to-lx', exampleValue: 10, note: 'Kilolux to lux multiplies by 1,000: 10 klx is 10,000 lux — about the brightness of a bright, overcast day. Kilolux keeps daylight-level numbers manageable.' },
    'lx-to-klx': { slug: 'lx-to-klx', exampleValue: 100000, note: 'Lux to kilolux divides by 1,000: 100,000 lux (direct summer sun) is 100 klx. Handy when a sensor reports large lux values.' },
    'fc-to-klx': { slug: 'fc-to-klx', exampleValue: 1000, note: 'Foot-candles to kilolux multiplies by about 0.01076: 1,000 fc is about 10.76 klx. Bridges US foot-candle figures and metric kilolux for bright outdoor levels.' },
    'ph-to-lx': { slug: 'ph-to-lx', exampleValue: 1, note: 'Phot to lux multiplies by 10,000: 1 phot is 10,000 lux. The phot is an old CGS unit; this converts it to modern SI lux.' },
  },
};
