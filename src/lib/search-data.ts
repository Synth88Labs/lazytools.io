/**
 * Compact search index built from the tool registry at build time,
 * bundled into the SearchBox island. Everything runs client-side.
 */
import { QUANTITIES, allPairs, titleNoun } from '../data/units';
import { CALCULATORS } from '../data/calc/index';
import { SIZE_TOOLS } from '../data/size/index';
import { TEXT_TOOLS } from '../data/text/index';
import { COLOR_TOOLS } from '../data/color/index';
import { FILE_TOOLS } from '../data/file/index';
import { DEV_TOOLS } from '../data/dev/index';
import { GEN_TOOLS } from '../data/generate/index';
import { TIME_TOOLS } from '../data/time/index';
import { SECURITY_TOOLS } from '../data/security/index';
import { IMAGE_TOOLS } from '../data/image/index';
import { PDF_TOOLS } from '../data/pdf/index';
import { AUDIO_TOOLS } from '../data/video/index';
import { allPairs as zonePairs } from '../data/time/zones';
import { CALENDAR_TOOLS } from '../data/calendar/index';
import { CIPHER_TOOLS } from '../data/cipher/index';
import { PRODUCTIVITY_TOOLS } from '../data/productivity/index';
import { NETWORK_TOOLS } from '../data/network/index';
import { MATH_TOOLS } from '../data/math/index';
import { PHOTO_SPECS } from '../data/photo/index';
import { BIO_TOOLS } from '../data/biology/index';
import { STAT_TOOLS } from '../data/statistics/index';
import { CHEM_TOOLS } from '../data/chemistry/index';
import { PHYS_TOOLS } from '../data/physics/index';
import { HOME_TOOLS } from '../data/home/index';
import { FIN_TOOLS } from '../data/finance/index';
import { COOKING_TOOLS } from '../data/cooking/index';
import { AUTO_TOOLS } from '../data/automotive/index';
import { FITNESS_TOOLS } from '../data/fitness/index';

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
  for (const t of FILE_TOOLS) {
    pages.push({ title: t.name, url: `/file/${t.slug}/`, keywords: [...t.keywords, 'converter', t.name.toLowerCase()] });
  }
  for (const t of DEV_TOOLS) {
    pages.push({ title: t.name, url: `/dev/${t.slug}/`, keywords: [...t.keywords, 'developer', t.name.toLowerCase()] });
  }
  for (const t of GEN_TOOLS) {
    pages.push({ title: t.name, url: `/generate/${t.slug}/`, keywords: [...t.keywords, 'generator', t.name.toLowerCase()] });
  }
  for (const t of TIME_TOOLS) {
    pages.push({ title: t.name, url: `/time/${t.slug}/`, keywords: [...t.keywords, 'date', 'time', t.name.toLowerCase()] });
  }
  for (const p of zonePairs()) {
    const A = p.a.abbr.toUpperCase(), B = p.b.abbr.toUpperCase();
    pages.push({
      title: `${A} to ${B} Time Converter`,
      url: `/time/zones/${p.slug}/`,
      keywords: [`${p.a.abbr} to ${p.b.abbr}`, `${p.b.abbr} to ${p.a.abbr}`, `${p.a.abbr} ${p.b.abbr}`, 'timezone', 'time zone', 'time difference', p.a.cities.split(',')[0].toLowerCase().trim(), p.b.cities.split(',')[0].toLowerCase().trim()],
    });
  }
  for (const t of CALENDAR_TOOLS) {
    pages.push({ title: t.name, url: `/calendar/${t.slug}/`, keywords: [...t.keywords, 'calendar', 'converter', t.name.toLowerCase()] });
  }
  for (const t of CIPHER_TOOLS) {
    pages.push({ title: t.name, url: `/cipher/${t.slug}/`, keywords: [...t.keywords, 'cipher', 'code', 'converter', t.name.toLowerCase()] });
  }
  for (const t of PRODUCTIVITY_TOOLS) {
    pages.push({ title: t.name, url: `/productivity/${t.slug}/`, keywords: [...t.keywords, 'productivity', t.name.toLowerCase()] });
  }
  for (const t of NETWORK_TOOLS) {
    pages.push({ title: t.name, url: `/network/${t.slug}/`, keywords: [...t.keywords, 'network', 'it', t.name.toLowerCase()] });
  }
  for (const t of MATH_TOOLS) {
    pages.push({ title: t.name, url: `/math/${t.slug}/`, keywords: [...t.keywords, 'math', 'mathematics', t.name.toLowerCase()] });
  }
  for (const t of SECURITY_TOOLS) {
    pages.push({ title: t.name, url: `/security/${t.slug}/`, keywords: [...t.keywords, 'privacy', 'security', t.name.toLowerCase()] });
  }
  for (const t of IMAGE_TOOLS) {
    pages.push({ title: t.name, url: `/image/${t.slug}/`, keywords: [...t.keywords, 'image', 'photo', t.name.toLowerCase()] });
  }
  for (const s of PHOTO_SPECS) {
    pages.push({ title: `${s.label} Maker`, url: `/photo/${s.slug}/`, keywords: [s.label.toLowerCase(), `${s.country.toLowerCase()} ${s.docType} photo`, `${s.docType} photo size`, `${s.country.toLowerCase()} passport photo`, 'photo maker', 'photo size', s.country.toLowerCase()] });
  }
  for (const t of BIO_TOOLS) {
    pages.push({ title: t.name, url: `/biology/${t.slug}/`, keywords: [...t.keywords, 'biology', 'lab', t.name.toLowerCase()] });
  }
  for (const t of STAT_TOOLS) {
    pages.push({ title: t.name, url: `/statistics/${t.slug}/`, keywords: [...t.keywords, 'statistics', 'stats', t.name.toLowerCase()] });
  }
  for (const t of CHEM_TOOLS) {
    pages.push({ title: t.name, url: `/chemistry/${t.slug}/`, keywords: [...t.keywords, 'chemistry', 'chem', t.name.toLowerCase()] });
  }
  for (const t of PHYS_TOOLS) {
    pages.push({ title: t.name, url: `/physics/${t.slug}/`, keywords: [...t.keywords, 'physics', t.name.toLowerCase()] });
  }
  for (const t of HOME_TOOLS) {
    pages.push({ title: t.name, url: `/home/${t.slug}/`, keywords: [...t.keywords, 'home', 'diy', 'home improvement', t.name.toLowerCase()] });
  }
  for (const t of FIN_TOOLS) {
    pages.push({ title: t.name, url: `/finance/${t.slug}/`, keywords: [...t.keywords, 'finance', 'money', t.name.toLowerCase()] });
  }
  for (const t of COOKING_TOOLS) {
    pages.push({ title: t.name, url: `/cooking/${t.slug}/`, keywords: [...t.keywords, 'cooking', 'kitchen', 'baking', 'recipe', t.name.toLowerCase()] });
  }
  for (const t of AUTO_TOOLS) {
    pages.push({ title: t.name, url: `/automotive/${t.slug}/`, keywords: [...t.keywords, 'automotive', 'car', 'vehicle', t.name.toLowerCase()] });
  }
  for (const t of FITNESS_TOOLS) {
    pages.push({ title: t.name, url: `/fitness/${t.slug}/`, keywords: [...t.keywords, 'fitness', 'exercise', 'running', 'workout', t.name.toLowerCase()] });
  }
  for (const t of PDF_TOOLS) {
    pages.push({ title: t.name, url: `/pdf/${t.slug}/`, keywords: [...t.keywords, 'pdf', t.name.toLowerCase()] });
  }
  for (const t of AUDIO_TOOLS) {
    pages.push({ title: t.name, url: `/video/${t.slug}/`, keywords: [...t.keywords, 'audio', 'sound', t.name.toLowerCase()] });
  }
  pages.push(
    { title: 'All Privacy & Security Tools', url: '/security/', keywords: ['privacy', 'security', 'exif', 'encrypt', 'metadata', 'checksum'] },
    { title: 'All Image Tools', url: '/image/', keywords: ['image tools', 'compress image', 'resize', 'convert image', 'photo'] },
    { title: 'Photo Size Maker', url: '/photo/', keywords: ['passport photo', 'visa photo', 'id photo', 'photo size maker', 'passport photo maker', 'photo tool', '2x2 photo', '35x45 photo'] },
    { title: 'All Biology & Lab Tools', url: '/biology/', keywords: ['biology', 'lab', 'dna', 'sequence', 'reverse complement', 'dilution', 'punnett square', 'hardy weinberg', 'molarity', 'pcr', 'primer tm', 'genetics'] },
    { title: 'All Statistics Calculators', url: '/statistics/', keywords: ['statistics', 'stats', 'normal distribution', 'z score', 'p value', 'binomial', 'confidence interval', 'sample size', 'regression', 'correlation', 'hypothesis test'] },
    { title: 'All Chemistry & Lab Tools', url: '/chemistry/', keywords: ['chemistry', 'chem', 'molar mass', 'molecular weight', 'equation balancer', 'balance equation', 'molarity', 'ideal gas', 'pv=nrt', 'specific heat', 'ph', 'percent composition', 'stoichiometry'] },
    { title: 'All Physics Calculators', url: '/physics/', keywords: ['physics', 'suvat', 'kinematics', 'projectile motion', 'newtons second law', 'f=ma', 'kinetic energy', 'potential energy', 'momentum', 'ohms law', 'wavelength', 'snells law', 'gravitation', 'e=mc2', 'free fall', 'work power'] },
    { title: 'All Home & DIY Calculators', url: '/home/', keywords: ['home', 'diy', 'home improvement', 'paint calculator', 'tile calculator', 'flooring', 'concrete calculator', 'mulch', 'soil', 'wallpaper', 'material estimator'] },
    { title: 'All Finance Calculators', url: '/finance/', keywords: ['finance', 'money', 'compound interest', 'debt payoff', 'snowball', 'avalanche', 'savings goal', 'loan payoff', 'credit card payoff', 'cagr', 'roi', 'rule of 72', 'break even', 'apr apy', 'investment calculator'] },
    { title: 'All Cooking & Kitchen Tools', url: '/cooking/', keywords: ['cooking', 'kitchen', 'baking', 'recipe', 'grams to cups', 'cups to grams', 'oven temperature', 'gas mark', 'butter converter', 'recipe scaler', 'bakers percentage', 'yeast converter', 'coffee ratio', 'meat temperature', 'measurement converter'] },
    { title: 'All Automotive Tools', url: '/automotive/', keywords: ['automotive', 'car', 'vehicle', 'tire size', 'tyre size', 'speedometer error', 'gear ratio', 'rpm calculator', 'engine displacement', 'compression ratio', 'horsepower', 'torque', 'fuel economy', 'mpg', 'l/100km', 'wheel offset', 'backspacing'] },
    { title: 'All Fitness & Exercise Tools', url: '/fitness/', keywords: ['fitness', 'exercise', 'running', 'workout', 'pace calculator', 'running pace', 'one rep max', '1rm', 'heart rate zones', 'karvonen', 'race time predictor', 'vo2 max', 'cooper test', 'calories burned', 'met', 'steps to distance'] },
    { title: 'All PDF Tools', url: '/pdf/', keywords: ['pdf tools', 'merge pdf', 'split pdf', 'rotate pdf'] },
    { title: 'All Audio Tools', url: '/video/', keywords: ['audio tools', 'trim audio', 'mp3', 'wav', 'volume'] },
    { title: 'All Developer Tools', url: '/dev/', keywords: ['developer tools', 'dev', 'encode', 'decode', 'hash', 'regex'] },
    { title: 'All Generators', url: '/generate/', keywords: ['generators', 'generate', 'password', 'uuid', 'qr code', 'random'] },
    { title: 'All Date & Time Tools', url: '/time/', keywords: ['date', 'time', 'timestamp', 'timezone', 'age', 'calendar'] },
    { title: 'Time-Zone Pair Converters', url: '/time/zones/', keywords: ['timezone', 'time zone', 'converter', 'ist', 'est', 'pst', 'gmt', 'meeting planner'] },
    { title: 'All Calendar Tools', url: '/calendar/', keywords: ['calendar', 'calendars', 'converter', 'hijri', 'hebrew', 'persian', 'julian', 'nepali', 'bikram sambat', 'date converter'] },
    { title: 'All Codes & Ciphers', url: '/cipher/', keywords: ['cipher', 'ciphers', 'code', 'codes', 'morse', 'nato', 'binary', 'caesar', 'encode', 'decode'] },
    { title: 'All Productivity Tools', url: '/productivity/', keywords: ['productivity', 'pomodoro', 'timer', 'planner', 'habit', 'eisenhower', 'meeting', 'focus'] },
    { title: 'All Network & IT Tools', url: '/network/', keywords: ['network', 'networking', 'subnet', 'cidr', 'ip', 'ipv6', 'chmod', 'cron', 'mac address', 'sysadmin'] },
    { title: 'All Mathematics Tools', url: '/math/', keywords: ['math', 'mathematics', 'fraction', 'prime', 'quadratic', 'statistics', 'roman numerals', 'gcd', 'lcm', 'exact'] },
    { title: 'All File Converters', url: '/file/', keywords: ['file converter', 'csv', 'json', 'yaml', 'xml', 'data converter'] },
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
