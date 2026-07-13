import type { Quantity } from './types.ts';

/**
 * Base unit: candela per square metre (cd/m²), universally called the "nit"
 * for display brightness. 1 stilb = 1 cd/cm² = 10⁴ nits; 1 foot-lambert =
 * 1/(π·0.3048²) ≈ 3.4263 nits. Metric prefixes give millinit and kilonit.
 */
export const luminance: Quantity = {
  id: 'luminance',
  name: 'Luminance (Brightness)',
  slug: 'luminance',
  baseUnit: 'nit',
  icon: '🔆',
  description:
    'Convert luminance (display brightness) units — nit (candela per square metre), kilonit, millinit, stilb and foot-lambert. Phone and TV brightness is measured in nits.',
  units: [
    { id: 'nit', name: 'Nit (cd/m²)', plural: 'nits', symbol: 'nit', slug: 'nit', factor: 1, system: 'si', definition: 'One candela per square metre — the standard unit of display brightness. A phone in sunlight hits 1,000+ nits; a typical laptop is 250–400; an HDR TV can reach 1,500 or more.' },
    { id: 'cdm2', name: 'Candela / square metre', plural: 'candelas per square metre', symbol: 'cd/m²', slug: 'candela-per-square-metre', factor: 1, system: 'si', definition: 'The SI name for the nit — exactly the same unit (1 cd/m² = 1 nit). Spec sheets use either name interchangeably for screen brightness.' },
    { id: 'knit', name: 'Kilonit', plural: 'kilonits', symbol: 'knit', slug: 'kilonit', factor: 1e3, system: 'si', definition: 'One thousand nits (10³ cd/m²). A tidy unit for very bright HDR displays and outdoor signage — a 1,600-nit TV is 1.6 knits.' },
    { id: 'mnit', name: 'Millinit', plural: 'millinits', symbol: 'mnit', slug: 'millinit', factor: 1e-3, system: 'si', definition: 'One-thousandth of a nit (10⁻³ cd/m²). Used for very dim luminances near the low end of what the eye can see.' },
    { id: 'sb', name: 'Stilb', plural: 'stilbs', symbol: 'sb', slug: 'stilb', factor: 1e4, system: 'other', definition: 'The CGS unit — one candela per square centimetre, equal to 10,000 nits. Rarely used today but seen in older optics literature.' },
    { id: 'fl', name: 'Foot-lambert', plural: 'foot-lamberts', symbol: 'fL', slug: 'foot-lambert', factor: 1 / (0.3048 ** 2 * Math.PI), system: 'us', definition: 'A US photometric unit for the luminance of a perfectly diffusing surface, about 3.426 nits. Still quoted for cinema and projector-screen brightness (SMPTE recommends ~14 fL).' },
  ],
  popularPairs: [
    ['nit', 'fl'], ['fl', 'nit'],
    ['nit', 'knit'], ['nit', 'sb'], ['knit', 'nit'], ['fl', 'knit'],
  ],
  pairMeta: {
    'nit-to-fl': { slug: 'nit-to-fl', exampleValue: 100, note: 'Nits to foot-lamberts divides by about 3.426: a 100-nit projector image is roughly 29 fL. Home-cinema and SMPTE brightness targets are often stated in foot-lamberts while display specs use nits, so this is the bridge.', tableValues: [1, 48, 100, 250, 400, 500, 1000, 1500, 4000] },
    'fl-to-nit': { slug: 'fl-to-nit', exampleValue: 14, note: 'Foot-lamberts to nits multiplies by about 3.426: the SMPTE cinema reference of 14 fL is about 48 nits. Use it to turn a projector-screen brightness target into nits.', tableValues: [1, 5, 14, 16, 30, 48, 100, 200, 500] },
    'nit-to-knit': { slug: 'nit-to-knit', exampleValue: 1600, note: 'Nits to kilonits divides by 1,000: a 1,600-nit HDR TV is 1.6 knits. Kilonits keep the numbers small for very bright displays.' },
    'nit-to-sb': { slug: 'nit-to-sb', exampleValue: 10000, note: 'Nits to stilbs divides by 10,000: 10,000 nits is 1 stilb. The stilb is an old CGS unit; this converts a modern nit figure to it.' },
    'knit-to-nit': { slug: 'knit-to-nit', exampleValue: 1, note: 'Kilonits to nits multiplies by 1,000: 1 knit is 1,000 nits. Convert a kilonit spec back to the nits most displays are rated in.' },
    'fl-to-knit': { slug: 'fl-to-knit', exampleValue: 100, note: 'Foot-lamberts to kilonits: multiply by ~3.426 then divide by 1,000, so 100 fL is about 0.343 knits. A niche but occasionally handy projector conversion.' },
  },
};
