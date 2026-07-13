export const SITE = {
  name: 'LazyTools',
  domain: 'lazytools.io',
  url: 'https://lazytools.io',
  tagline: 'Free online tools that never upload your data',
  description:
    'LazyTools is a collection of free, privacy-first online tools. Every tool runs locally in your browser — the files and values you enter are never uploaded to any server.',
  github: 'https://github.com/Synth88Labs/lazytools.io',
  parent: { name: 'Synth88 Labs Inc.', url: 'https://synth88.com' },
  email: 'synth88labs@gmail.com',
} as const;

export interface CategoryDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  status: 'live' | 'coming-soon';
}

/** The approved 12-category plan (docs/category-research.md). */
export const CATEGORIES: CategoryDef[] = [
  { slug: 'units', name: 'Unit Converters', icon: '📐', description: 'Convert length, weight, temperature, volume and more — instantly.', status: 'live' },
  { slug: 'calc', name: 'Calculators', icon: '🧮', description: 'Percentage, finance, health and everyday calculators.', status: 'live' },
  { slug: 'finance', name: 'Finance', icon: '💵', description: 'Compound interest, debt payoff, savings goal, ROI — exact, private, educational (not advice).', status: 'live' },
  { slug: 'math', name: 'Mathematics', icon: '➗', description: 'Exact math: fractions with steps, primes, quadratics, statistics.', status: 'live' },
  { slug: 'biology', name: 'Biology & Lab', icon: '🧬', description: 'DNA sequence tools, dilution, Punnett squares, Hardy–Weinberg, primer Tm — exact and private.', status: 'live' },
  { slug: 'statistics', name: 'Statistics', icon: '📈', description: 'Normal distribution, binomial probability, confidence intervals, p-values — exact, with plain-English interpretation.', status: 'live' },
  { slug: 'chemistry', name: 'Chemistry & Lab', icon: '⚗️', description: 'Molar mass, chemical equation balancer, molarity, ideal gas, pH — exact, deterministic, with the working shown.', status: 'live' },
  { slug: 'physics', name: 'Physics', icon: '🧲', description: 'SUVAT & projectile motion, Newton\'s laws, energy, gravitation, waves, Ohm\'s law, E=mc² — exact, with the working shown.', status: 'live' },
  { slug: 'size', name: 'Size Converters', icon: '💍', description: 'Ring, shoe and bra sizes across US, UK, EU and more.', status: 'live' },
  { slug: 'home', name: 'Home & DIY', icon: '🛠️', description: 'Paint, tile, concrete, mulch and wallpaper material estimators — metric or imperial.', status: 'live' },
  { slug: 'cooking', name: 'Cooking & Kitchen', icon: '🍳', description: 'Grams to cups, oven temperature, butter, recipe scaler and USDA meat temps — sourced and private.', status: 'live' },
  { slug: 'automotive', name: 'Automotive', icon: '🚗', description: 'Tire size, gear ratio, engine displacement, horsepower and fuel economy — exact, in your browser.', status: 'live' },
  { slug: 'fitness', name: 'Fitness & Exercise', icon: '🏃', description: 'Running pace, one-rep max, heart-rate zones, race predictor and calories burned — sourced formulas.', status: 'live' },
  { slug: 'pets', name: 'Pets & Animals', icon: '🐾', description: 'Dog & cat age, feeding portions, gestation due dates, aquarium volume — vet-sourced formulas.', status: 'live' },
  { slug: 'garden', name: 'Gardening & Plants', icon: '🌱', description: 'Plant spacing, raised-bed soil, fertilizer, watering, planting dates and compost — metric or imperial.', status: 'live' },
  { slug: 'music', name: 'Music & Audio', icon: '🎵', description: 'Note frequencies, BPM to delay time, tap tempo, metronome, intervals and transposing — for musicians.', status: 'live' },
  { slug: 'weather', name: 'Weather & Atmosphere', icon: '🌦️', description: 'Heat index, wind chill, dew point, wet-bulb and feels-like temperature — official NWS formulas.', status: 'live' },
  { slug: 'astronomy', name: 'Astronomy & Space', icon: '🔭', description: 'Moon phase, sunrise & sunset, weight & age on other planets, light-time and telescope optics.', status: 'live' },
  { slug: 'photography', name: 'Photography', icon: '📸', description: 'Depth of field, field of view, crop factor, exposure, hyperfocal distance and print size.', status: 'live' },
  { slug: 'electronics', name: 'Electronics & Circuits', icon: '🔌', description: 'Resistor color & SMD codes, LED resistor, voltage divider, 555 timer, RC & LC filters, wire gauge, battery life.', status: 'live' },
  { slug: 'travel', name: 'Travel & Trips', icon: '🧳', description: 'Flight distance & time, layover check, jet lag, tip-by-country, road-trip time, budget and luggage size.', status: 'live' },
  { slug: '3d-printing', name: '3D Printing', icon: '🖨️', description: 'Filament weight/length & cost, print electricity, model scaling, E-steps & flow calibration, resin cost.', status: 'live' },
  { slug: 'solar', name: 'Solar & Energy', icon: '☀️', description: 'Solar panel output, off-grid load, battery bank & inverter sizing, appliance cost, payback, voltage drop.', status: 'live' },
  { slug: 'brewing', name: 'Homebrewing', icon: '🍺', description: 'ABV, IBU, priming sugar, Brix↔gravity, hydrometer & refractometer correction, strike water, dilution.', status: 'live' },
  { slug: 'photo', name: 'Photo Size Maker', icon: '🪪', description: 'Passport, visa & ID photos for 80+ countries — crop, check and export in your browser.', status: 'live' },
  { slug: 'dev', name: 'Developer Tools', icon: '👨‍💻', description: 'Formatters, encoders, hashes and other dev utilities.', status: 'live' },
  { slug: 'file', name: 'File Converters', icon: '🔄', description: 'CSV, JSON, XML, YAML and Markdown conversion.', status: 'live' },
  { slug: 'text', name: 'Text Tools', icon: '✍️', description: 'Counters, case converters, sorting and clean-up.', status: 'live' },
  { slug: 'generate', name: 'Generators', icon: '✨', description: 'QR codes, passwords, UUIDs and more.', status: 'live' },
  { slug: 'time', name: 'Date & Time', icon: '📅', description: 'Timestamps, date math and timezone tools.', status: 'live' },
  { slug: 'calendar', name: 'Calendars', icon: '🗓️', description: 'Convert between world calendars — Hijri, Hebrew, Persian, Julian and more.', status: 'live' },
  { slug: 'color', name: 'Color Tools', icon: '🎨', description: 'Color conversion, contrast and palettes.', status: 'live' },
  { slug: 'cipher', name: 'Codes & Ciphers', icon: '📡', description: 'Morse code, NATO alphabet, binary and classic ciphers.', status: 'live' },
  { slug: 'productivity', name: 'Productivity', icon: '🚀', description: 'Pomodoro, planners, trackers and decision tools — saved locally.', status: 'live' },
  { slug: 'network', name: 'Network & IT', icon: '🌐', description: 'Subnet calculators, CIDR, chmod, cron and MAC tools.', status: 'live' },
  { slug: 'security', name: 'Privacy & Security', icon: '🔐', description: 'Metadata cleaners, encryption and password tools.', status: 'live' },
  { slug: 'image', name: 'Image Tools', icon: '🖼️', description: 'Compress, convert and resize images locally.', status: 'live' },
  { slug: 'pdf', name: 'PDF Tools', icon: '📄', description: 'Merge, split and rotate PDFs in your browser.', status: 'live' },
  { slug: 'video', name: 'Audio & Video', icon: '🎬', description: 'Trim, convert and adjust audio privately.', status: 'live' },
];

/** Purpose-driven theme groups for the header mega-menu and the /tools/ overview. */
export interface CategoryGroup {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  categories: string[]; // category slugs, in display order
}
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    slug: 'everyday', name: 'Everyday & Money', icon: '🧮',
    blurb: 'Converters, calculators, finance and planning',
    categories: ['units', 'calc', 'finance', 'size', 'time', 'calendar', 'travel', 'text', 'productivity'],
  },
  {
    slug: 'science', name: 'Science & Engineering', icon: '🔬',
    blurb: 'Exact math, stats and the STEM cluster',
    categories: ['math', 'statistics', 'physics', 'chemistry', 'biology', 'astronomy', 'electronics'],
  },
  {
    slug: 'home', name: 'Home & Lifestyle', icon: '🏡',
    blurb: 'DIY, garden, kitchen, car, pets and hobbies',
    categories: ['home', 'garden', 'cooking', 'pets', 'automotive', 'solar', 'brewing', '3d-printing', 'weather', 'fitness'],
  },
  {
    slug: 'media', name: 'Media & Files', icon: '🎨',
    blurb: 'Color, music, photos, images, PDFs and converters',
    categories: ['color', 'music', 'photography', 'photo', 'image', 'video', 'pdf', 'file'],
  },
  {
    slug: 'dev', name: 'Developer & Privacy', icon: '⌨️',
    blurb: 'Dev utilities, network, ciphers, generators, security',
    categories: ['dev', 'network', 'cipher', 'generate', 'security'],
  },
];

/** Map a category slug to its group (or null). */
export function groupForCategory(slug: string): CategoryGroup | null {
  return CATEGORY_GROUPS.find((g) => g.categories.includes(slug)) ?? null;
}
