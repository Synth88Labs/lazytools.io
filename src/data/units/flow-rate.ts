import type { Quantity } from './types.ts';

/** Base unit: m³/s. 1 US gal = 3.785411784 L; 1 ft³ = 0.3048³ m³ (exact). */
export const flowRate: Quantity = {
  id: 'flow-rate',
  name: 'Volumetric Flow Rate',
  slug: 'flow-rate',
  baseUnit: 'm3-s',
  icon: '🚰',
  description:
    'Convert volumetric flow-rate units — litres per second and minute, cubic metres per hour, US gallons per minute (GPM), cubic feet per minute (CFM) and per second.',
  units: [
    { id: 'm3-s', name: 'Cubic metre per second', plural: 'cubic metres per second', symbol: 'm³/s', slug: 'm3-s', factor: 1, system: 'si', definition: 'The SI unit of volumetric flow — a cubic metre passing a point each second. A large unit: rivers and industrial flows.' },
    { id: 'm3-h', name: 'Cubic metre per hour', plural: 'cubic metres per hour', symbol: 'm³/h', slug: 'm3-h', factor: 1 / 3600, system: 'si', definition: 'A cubic metre per hour is 1/3600 m³/s. Pumps, HVAC and water systems are often rated in m³/h.' },
    { id: 'l-s', name: 'Litre per second', plural: 'litres per second', symbol: 'L/s', slug: 'l-s', factor: 1e-3, system: 'metric', definition: 'One litre per second is 0.001 m³/s. A common unit for pumps and plumbing flows.' },
    { id: 'l-min', name: 'Litre per minute', plural: 'litres per minute', symbol: 'L/min', slug: 'l-min', factor: 1e-3 / 60, system: 'metric', definition: 'A litre per minute is 1/60 L/s. Taps, showers and small pumps are rated in L/min.' },
    { id: 'gpm', name: 'US gallon per minute', plural: 'US gallons per minute', symbol: 'GPM', slug: 'gpm', factor: 0.003785411784 / 60, system: 'us', definition: 'US gallons per minute — the standard US pump and plumbing rate. One GPM is about 3.785 L/min.' },
    { id: 'cfm', name: 'Cubic foot per minute', plural: 'cubic feet per minute', symbol: 'CFM', slug: 'cfm', factor: (0.3048 ** 3) / 60, system: 'us', definition: 'Cubic feet per minute — the US airflow unit for fans, HVAC and compressors. One CFM is about 1.699 m³/h or 0.472 L/s.' },
    { id: 'ft3-s', name: 'Cubic foot per second', plural: 'cubic feet per second', symbol: 'ft³/s', slug: 'ft3-s', factor: 0.3048 ** 3, system: 'us', definition: 'Cubic feet per second ("cusec") — used for river and channel discharge. One ft³/s is about 28.32 L/s.' },
  ],
  popularPairs: [
    ['l-min', 'gpm'], ['gpm', 'l-min'],
    ['m3-h', 'l-min'], ['l-s', 'gpm'], ['cfm', 'l-s'], ['m3-h', 'gpm'],
  ],
  pairMeta: {
    'l-min-to-gpm': { slug: 'l-min-to-gpm', exampleValue: 10, note: 'Litres per minute to US gallons per minute divides by about 3.785: a 10 L/min tap is about 2.64 GPM. This is the everyday plumbing conversion between metric and US flow ratings.' },
    'gpm-to-l-min': { slug: 'gpm-to-l-min', exampleValue: 5, note: 'US gallons per minute to litres per minute multiplies by about 3.785: a 5 GPM pump delivers about 18.9 L/min. Use it to compare a US-rated pump against metric fixture demands.' },
    'm3-h-to-l-min': { slug: 'm3-h-to-l-min', exampleValue: 10, note: 'Cubic metres per hour to litres per minute multiplies by 1000/60 ≈ 16.67: a 10 m³/h pump is about 167 L/min. Pumps are often specced in m³/h but sized against per-minute demand.' },
    'l-s-to-gpm': { slug: 'l-s-to-gpm', exampleValue: 1, note: 'Litres per second to US gallons per minute multiplies by about 15.85: 1 L/s is about 15.85 GPM. Larger flows are quoted in L/s (metric) or GPM (US).' },
    'cfm-to-l-s': { slug: 'cfm-to-l-s', exampleValue: 100, note: 'Cubic feet per minute to litres per second multiplies by about 0.4719: a 100 CFM fan moves about 47.2 L/s of air. The bridge between US and metric airflow (ventilation, extractor) ratings.' },
    'm3-h-to-gpm': { slug: 'm3-h-to-gpm', exampleValue: 10, note: 'Cubic metres per hour to US gallons per minute multiplies by about 4.403: a 10 m³/h pump is about 44 GPM. Common when matching a metric pump curve to US system requirements.' },
  },
};
