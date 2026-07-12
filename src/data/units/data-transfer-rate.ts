import type { Quantity } from './types.ts';

/** Base unit: bit per second (bps). 1 byte = 8 bits; SI prefixes are decimal (×1000), IEC binary (×1024). */
export const dataTransferRate: Quantity = {
  id: 'data-transfer-rate',
  name: 'Data Transfer Rate',
  slug: 'data-transfer-rate',
  baseUnit: 'bps',
  icon: '📶',
  description:
    'Convert data-transfer rates — bits and bytes per second, kbps, Mbps, Gbps, MB/s and more. Internet plans are sold in megabits (Mbps) while downloads show megabytes per second (MB/s): 1 byte = 8 bits, so divide by 8.',
  units: [
    { id: 'bps', name: 'Bit per second', plural: 'bits per second', symbol: 'bit/s', slug: 'bps', factor: 1, system: 'si', definition: 'One bit per second — the base SI unit of data rate. Network and connection speeds build on it with the kilo/mega/giga prefixes.' },
    { id: 'kbps', name: 'Kilobit per second', plural: 'kilobits per second', symbol: 'kbit/s', slug: 'kbps', factor: 1e3, system: 'si', definition: 'A kilobit per second is 1,000 bits/s. Audio streams and older broadband are quoted in kbps; a 320 kbps MP3, for instance.' },
    { id: 'mbps', name: 'Megabit per second', plural: 'megabits per second', symbol: 'Mbit/s', slug: 'mbps', factor: 1e6, system: 'si', definition: 'A megabit per second is 1,000,000 bits/s — the unit internet plans are sold in ("100 Mbps"). Divide by 8 for megabytes per second.' },
    { id: 'gbps', name: 'Gigabit per second', plural: 'gigabits per second', symbol: 'Gbit/s', slug: 'gbps', factor: 1e9, system: 'si', definition: 'A gigabit per second is 1,000 Mbps — the speed of fibre plans and Ethernet ("gigabit internet"). One Gbps is 125 MB/s.' },
    { id: 'kb-s', name: 'Kilobyte per second', plural: 'kilobytes per second', symbol: 'kB/s', slug: 'kb-s', factor: 8e3, system: 'si', definition: 'A kilobyte per second is 8 kilobits/s (1,000 bytes/s). Download managers often show progress in kB/s or MB/s.' },
    { id: 'mb-s', name: 'Megabyte per second', plural: 'megabytes per second', symbol: 'MB/s', slug: 'mb-s', factor: 8e6, system: 'si', definition: 'A megabyte per second is 8 megabits/s (1,000,000 bytes/s). It\'s what your browser or download shows — an 80 Mbps line tops out near 10 MB/s.' },
    { id: 'gb-s', name: 'Gigabyte per second', plural: 'gigabytes per second', symbol: 'GB/s', slug: 'gb-s', factor: 8e9, system: 'si', definition: 'A gigabyte per second is 8 Gbps (1,000,000,000 bytes/s) — the realm of SSDs and memory buses rather than internet links.' },
    { id: 'mib-s', name: 'Mebibyte per second', plural: 'mebibytes per second', symbol: 'MiB/s', slug: 'mib-s', factor: 8 * 1024 * 1024, system: 'other', definition: 'A mebibyte per second is 8 × 1,048,576 bits/s — the binary (×1024) cousin of MB/s used by some operating systems. 1 MiB/s ≈ 1.049 MB/s.' },
  ],
  popularPairs: [
    ['mbps', 'mb-s'], ['mb-s', 'mbps'],
    ['gbps', 'gb-s'], ['gbps', 'mbps'], ['mbps', 'gbps'],
    ['mbps', 'kbps'], ['kb-s', 'kbps'], ['mb-s', 'mib-s'],
  ],
  pairMeta: {
    'mbps-to-mb-s': {
      slug: 'mbps-to-mb-s',
      exampleValue: 100,
      note: 'This is the conversion everyone actually wants: your internet plan is sold in megabits (Mbps) but your downloads show megabytes per second (MB/s), and 1 byte = 8 bits — so you divide by 8. A 100 Mbps plan tops out around 12.5 MB/s, and that\'s normal, not a fault. Overhead usually shaves a little more off.',
      tableValues: [10, 25, 50, 100, 200, 300, 500, 1000],
      faqs: [
        { q: 'Why is my download speed lower than my internet plan?', a: 'Because plans are measured in megabits (Mbps) and downloads in megabytes per second (MB/s). There are 8 bits in a byte, so 100 Mbps is only 12.5 MB/s even before real-world overhead. It\'s the units, not necessarily a slow connection.' },
      ],
    },
    'mb-s-to-mbps': { slug: 'mb-s-to-mbps', exampleValue: 12.5, note: 'Going the other way — megabytes per second back to megabits — you multiply by 8. So a 12.5 MB/s download corresponds to a 100 Mbps line. Useful when a file-transfer tool reports MB/s and you want to compare it against an internet plan quoted in Mbps.' },
    'gbps-to-gb-s': { slug: 'gbps-to-gb-s', exampleValue: 1, note: 'Gigabits per second to gigabytes per second is again a divide-by-8: a 1 Gbps link moves 0.125 GB/s (125 MB/s) of actual data. Fibre and 10G Ethernet are rated in Gbps; storage throughput is usually in GB/s.' },
    'gbps-to-mbps': { slug: 'gbps-to-mbps', exampleValue: 1, note: 'One gigabit per second is exactly 1,000 megabits per second — a straight ×1000, since these are both decimal SI units. "Gigabit internet" is 1,000 Mbps; a 2.5 Gbps port is 2,500 Mbps.' },
    'mbps-to-gbps': { slug: 'mbps-to-gbps', exampleValue: 500, note: 'Megabits to gigabits divides by 1,000: a 500 Mbps plan is 0.5 Gbps, and 1,000 Mbps is exactly 1 Gbps. Handy when comparing a fast cable plan against fibre quoted in gigabits.' },
    'mbps-to-kbps': { slug: 'mbps-to-kbps', exampleValue: 5, note: 'Megabits to kilobits multiplies by 1,000: 5 Mbps is 5,000 kbps. This shows up when a stream or codec is rated in kbps (a 5 Mbps video ≈ 5,000 kbps) and you want it in the megabit terms of your connection.' },
    'kb-s-to-kbps': { slug: 'kb-s-to-kbps', exampleValue: 100, note: 'Kilobytes per second to kilobits per second multiplies by 8: a 100 kB/s download is 800 kbps. Download tools show kB/s; bitrates and older connection speeds are in kbps.' },
    'mb-s-to-mib-s': { slug: 'mb-s-to-mib-s', exampleValue: 100, note: 'This one is decimal-versus-binary, not bits-versus-bytes. A megabyte (MB) is 1,000,000 bytes but a mebibyte (MiB) is 1,048,576 bytes, so 100 MB/s is about 95.4 MiB/s. Some operating systems label the binary unit "MB/s" while meaning MiB/s, which is where the small discrepancy comes from.' },
  },
};
