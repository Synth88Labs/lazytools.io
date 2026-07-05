/**
 * Compact search index built from the tool registry at build time,
 * bundled into the SearchBox island. Everything runs client-side.
 */
import { QUANTITIES, allPairs, titleNoun } from '../data/units';
import { CALCULATORS } from '../data/calc/index';
import { SIZE_TOOLS } from '../data/size/index';
import { TEXT_TOOLS } from '../data/text/index';
import { COLOR_TOOLS } from '../data/color/index';

export interface SearchUnit {
  id: string;
  name: string;
  symbol: string;
  factor: number;
  offset?: number;
  aliases: string[];
}

export interface SearchQuantity {
  id: string;
  name: string;
  slug: string;
  units: SearchUnit[];
  /** pair slug lookup: `${fromId}>${toId}` → url slug */
  pairs: Record<string, string>;
}

export interface SearchPage {
  title: string;
  url: string;
  keywords: string[];
}

/** Common search phrasings not derivable from the unit fields. */
const EXTRA_ALIASES: Record<string, string[]> = {
  'length:m': ['metre', 'metres'],
  'length:km': ['kilometre', 'kilometres', 'kms'],
  'length:in': ['"'],
  'length:ft': ["'", 'foots'],
  'weight:kg': ['kilo', 'kilos', 'kgs'],
  'weight:lb': ['pound', 'lbs'],
  'weight:t': ['ton', 'tons', 'tonne'],
  'temperature:c': ['centigrade', '°c', 'c'],
  'temperature:f': ['°f', 'f'],
  'temperature:k': ['k'],
  'volume:l': ['litre', 'litres'],
  'volume:floz': ['fl oz', 'ounce liquid', 'fluid oz'],
  'volume:gal': ['gallon us', 'gal'],
  'speed:kmh': ['kph', 'km/h', 'kmph'],
  'speed:mps': ['m/s', 'meters per second'],
  'speed:kn': ['knot'],
  'area:sqft': ['sq ft', 'sqft', 'ft2', 'ft²'],
  'area:sqm': ['sq m', 'sqm', 'm2', 'm²'],
  'area:sqkm': ['sq km', 'km2', 'km²'],
  'area:sqmi': ['sq mi', 'sq miles'],
  'area:sqyd': ['sq yd', 'gaj'],
  'time:h': ['hr', 'hrs'],
  'time:min': ['mins'],
  'time:s': ['sec', 'secs'],
  'time:yr': ['yrs'],
  'data:mb': ['megs', 'mbs'],
  'data:gb': ['gig', 'gigs', 'gbs'],
  'pressure:psi': ['pound per square inch'],
  'pressure:atm': ['atmosphere', 'atmospheres'],
  'energy:kcal': ['food calorie', 'food calories', 'cal food'],
  'energy:kwh': ['kilowatt hour', 'kilowatt hours', 'unit of electricity'],
  'power:hp': ['horse power', 'bhp'],
  'power:w': ['watt', 'watts'],
};

export function buildSearchQuantities(): SearchQuantity[] {
  return QUANTITIES.map((q) => {
    const pairs: Record<string, string> = {};
    for (const p of allPairs().filter((p) => p.quantity.id === q.id)) {
      pairs[`${p.from.id}>${p.to.id}`] = p.slug;
    }
    return {
      id: q.id,
      name: q.name,
      slug: q.slug,
      units: q.units.map((u) => ({
        id: u.id,
        name: u.name,
        symbol: u.symbol,
        factor: u.factor,
        offset: u.offset,
        aliases: [
          ...new Set(
            [
              u.name.toLowerCase(),
              u.plural.toLowerCase(),
              u.symbol.toLowerCase(),
              u.slug.replace(/-/g, ' '),
              ...(EXTRA_ALIASES[`${q.id}:${u.id}`] ?? []),
            ].filter(Boolean)
          ),
        ],
      })),
      pairs,
    };
  });
}

export function buildSearchPages(): SearchPage[] {
  const pages: SearchPage[] = [];
  for (const p of allPairs()) {
    pages.push({
      title: `${titleNoun(p.from)} to ${titleNoun(p.to)} Converter`,
      url: `/units/${p.slug}/`,
      keywords: [
        p.from.slug.replace(/-/g, ' '),
        p.to.slug.replace(/-/g, ' '),
        p.from.symbol.toLowerCase(),
        p.to.symbol.toLowerCase(),
        p.from.plural.toLowerCase(),
        p.to.plural.toLowerCase(),
        'convert',
        'converter',
        p.quantity.name.toLowerCase(),
      ],
    });
  }
  for (const q of QUANTITIES) {
    pages.push({
      title: `${q.name} Converter`,
      url: `/units/${q.slug}/`,
      keywords: [q.name.toLowerCase(), 'unit', 'converter', 'convert', ...q.units.map((u) => u.plural.toLowerCase())],
    });
  }
  for (const c of CALCULATORS) {
    pages.push({
      title: c.name,
      url: `/calc/${c.slug}/`,
      keywords: [...c.keywords, 'calculator', 'calculate', c.name.toLowerCase()],
    });
  }
  for (const t of SIZE_TOOLS) {
    pages.push({
      title: t.name,
      url: `/size/${t.slug}/`,
      keywords: [...t.keywords, 'size', 'converter', t.name.toLowerCase()],
    });
  }
  for (const t of TEXT_TOOLS) {
    pages.push({ title: t.name, url: `/text/${t.slug}/`, keywords: [...t.keywords, 'text', t.name.toLowerCase()] });
  }
  for (const t of COLOR_TOOLS) {
    pages.push({ title: t.name, url: `/color/${t.slug}/`, keywords: [...t.keywords, 'color', t.name.toLowerCase()] });
  }
  pages.push(
    { title: 'All Text Tools', url: '/text/', keywords: ['text tools', 'text', 'words', 'characters', 'lines'] },
    { title: 'All Color Tools', url: '/color/', keywords: ['color tools', 'color', 'hex', 'rgb', 'contrast'] },
    { title: 'All Size Converters', url: '/size/', keywords: ['size', 'sizes', 'sizing', 'ring', 'shoe', 'bra', 'clothing'] },
    { title: 'All Calculators', url: '/calc/', keywords: ['calculator', 'calculators', 'calculate', 'math'] },
    { title: 'All Tools Directory', url: '/tools/', keywords: ['all tools', 'directory', 'list', 'tools'] },
    { title: 'Unit Converters', url: '/units/', keywords: ['unit', 'units', 'measurement', 'converter', 'convert'] },
    { title: 'How LazyTools Protects Your Privacy', url: '/how-it-works/', keywords: ['privacy', 'how it works', 'offline', 'browser', 'upload', 'safe', 'secure'] },
    { title: 'About LazyTools', url: '/about/', keywords: ['about', 'who', 'team'] },
    { title: 'Contact', url: '/contact/', keywords: ['contact', 'email', 'support', 'help', 'request a tool'] }
  );
  return pages;
}
