export const SITE = {
  name: 'LazyTools',
  domain: 'lazytools.io',
  url: 'https://lazytools.io',
  tagline: 'Free online tools that never upload your data',
  description:
    'LazyTools is a collection of free, privacy-first online tools. Everything runs locally in your browser — your files and data are never uploaded to any server.',
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
  { slug: 'size', name: 'Size Converters', icon: '💍', description: 'Ring, shoe and bra sizes across US, UK, EU and more.', status: 'live' },
  { slug: 'dev', name: 'Developer Tools', icon: '👨‍💻', description: 'Formatters, encoders, hashes and other dev utilities.', status: 'live' },
  { slug: 'file', name: 'File Converters', icon: '🔄', description: 'CSV, JSON, XML, YAML and Markdown conversion.', status: 'live' },
  { slug: 'text', name: 'Text Tools', icon: '✍️', description: 'Counters, case converters, sorting and clean-up.', status: 'live' },
  { slug: 'generate', name: 'Generators', icon: '✨', description: 'QR codes, passwords, UUIDs and more.', status: 'live' },
  { slug: 'time', name: 'Date & Time', icon: '📅', description: 'Timestamps, date math and timezone tools.', status: 'live' },
  { slug: 'calendar', name: 'Calendars', icon: '🗓️', description: 'Convert between world calendars — Hijri, Hebrew, Persian, Julian and more.', status: 'live' },
  { slug: 'color', name: 'Color Tools', icon: '🎨', description: 'Color conversion, contrast and palettes.', status: 'live' },
  { slug: 'security', name: 'Privacy & Security', icon: '🔐', description: 'Metadata cleaners, encryption and password tools.', status: 'live' },
  { slug: 'image', name: 'Image Tools', icon: '🖼️', description: 'Compress, convert and resize images locally.', status: 'live' },
  { slug: 'pdf', name: 'PDF Tools', icon: '📄', description: 'Merge, split and rotate PDFs in your browser.', status: 'live' },
  { slug: 'video', name: 'Audio & Video', icon: '🎬', description: 'Trim, convert and adjust audio privately.', status: 'live' },
];
