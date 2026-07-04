import type { Quantity } from './types';

export const dataStorage: Quantity = {
  id: 'data',
  name: 'Data Storage',
  slug: 'data-storage',
  baseUnit: 'b',
  icon: '💾',
  description:
    'Convert between bits, bytes, kilobytes, megabytes, gigabytes and terabytes — in both decimal (1 MB = 1,000,000 bytes, used by drive makers) and binary (1 MiB = 1,048,576 bytes, used by operating systems) standards. The two standards are why a "1 TB" drive shows as ~931 GB in Windows.',
  units: [
    {
      id: 'bit', name: 'Bit', plural: 'bits', symbol: 'bit', slug: 'bits', factor: 0.125, system: 'si',
      definition: 'A bit is the smallest unit of digital information — a single 0 or 1. Network speeds (Mbps, Gbps) are measured in bits per second, which is why a 100 Mbps connection downloads at most 12.5 MB/s.',
    },
    {
      id: 'b', name: 'Byte', plural: 'bytes', symbol: 'B', slug: 'bytes', factor: 1, system: 'si',
      definition: 'A byte (B) is 8 bits — historically the storage needed for one text character. File sizes and storage capacities are measured in bytes and their multiples.',
    },
    {
      id: 'kb', name: 'Kilobyte', plural: 'kilobytes', symbol: 'KB', slug: 'kb', factor: 1000, system: 'si',
      definition: 'A kilobyte (KB) is 1,000 bytes in the SI decimal standard. A short email is a few kilobytes; a typical web page weighs a few hundred.',
    },
    {
      id: 'mb', name: 'Megabyte', plural: 'megabytes', symbol: 'MB', slug: 'mb', factor: 1000000, system: 'si',
      definition: 'A megabyte (MB) is 1,000,000 bytes (decimal standard). A smartphone photo is typically 2–5 MB; an MP3 song about 1 MB per minute.',
    },
    {
      id: 'gb', name: 'Gigabyte', plural: 'gigabytes', symbol: 'GB', slug: 'gb', factor: 1000000000, system: 'si',
      definition: 'A gigabyte (GB) is 1,000,000,000 bytes (decimal standard). Storage devices and mobile data plans are sold in gigabytes; an hour of HD streaming uses roughly 3 GB.',
    },
    {
      id: 'tb', name: 'Terabyte', plural: 'terabytes', symbol: 'TB', slug: 'tb', factor: 1000000000000, system: 'si',
      definition: 'A terabyte (TB) is 1,000 gigabytes (decimal standard). Hard drives and cloud storage tiers are commonly 1–4 TB; a 1 TB drive appears as about 931 GiB in Windows.',
    },
    {
      id: 'kib', name: 'Kibibyte', plural: 'kibibytes', symbol: 'KiB', slug: 'kib', factor: 1024, system: 'other',
      definition: 'A kibibyte (KiB) is 1,024 bytes — the binary unit operating systems traditionally called a "kilobyte". The Ki prefix (2¹⁰) was standardized in 1998 to end the ambiguity.',
    },
    {
      id: 'mib', name: 'Mebibyte', plural: 'mebibytes', symbol: 'MiB', slug: 'mib', factor: 1048576, system: 'other',
      definition: 'A mebibyte (MiB) is 1,048,576 bytes (2²⁰). RAM sizes and OS-reported file sizes are effectively mebibytes even when labeled "MB".',
    },
    {
      id: 'gib', name: 'Gibibyte', plural: 'gibibytes', symbol: 'GiB', slug: 'gib', factor: 1073741824, system: 'other',
      definition: 'A gibibyte (GiB) is 1,073,741,824 bytes (2³⁰) — about 7.4% larger than a decimal gigabyte. The gap between GB and GiB explains "missing" drive space.',
    },
    {
      id: 'tib', name: 'Tebibyte', plural: 'tebibytes', symbol: 'TiB', slug: 'tib', factor: 1099511627776, system: 'other',
      definition: 'A tebibyte (TiB) is 2⁴⁰ bytes. A "1 TB" drive (decimal) holds only 0.909 TiB, which operating systems may display as ~931 GB.',
    },
  ],
  popularPairs: [
    ['mb', 'gb'], ['gb', 'mb'],
    ['kb', 'mb'], ['mb', 'kb'],
    ['gb', 'tb'], ['tb', 'gb'],
    ['b', 'mb'], ['mb', 'b'],
    ['gib', 'gb'], ['gb', 'gib'],
    ['bit', 'b'],
  ],
  pairMeta: {
    'mb-to-gb': {
      slug: 'mb-to-gb',
      exampleValue: 512,
      note: 'MB-to-GB uses the decimal standard: 1 GB = 1,000 MB, so 512 MB is 0.512 GB. If your operating system shows different numbers, it is reporting binary mebibytes/gibibytes (1 GiB = 1,024 MiB) while drive makers use decimal — both are "correct", they just use different standards.',
      faqs: [
        { q: 'Is 1 GB equal to 1000 MB or 1024 MB?', a: 'Under the SI decimal standard used by storage manufacturers, 1 GB = 1,000 MB. The 1,024 figure belongs to the binary units (1 GiB = 1,024 MiB) that operating systems traditionally reported. This page converts using the decimal standard.' },
      ],
    },
    'gb-to-tb': {
      slug: 'gb-to-tb',
      exampleValue: 500,
      note: '1 TB = 1,000 GB (decimal standard), so 500 GB is 0.5 TB. Cloud storage plans and drives are marketed in decimal units; Windows reports binary units, so a 2 TB drive shows as about 1.82 "TB" (really TiB).',
    },
  },
};
