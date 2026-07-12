import type { Quantity } from './types.ts';

/** Base unit: hertz (Hz = 1/s). 1 Hz = 60 RPM = 2π rad/s. Pure identities. */
export const frequency: Quantity = {
  id: 'frequency',
  name: 'Frequency',
  slug: 'frequency',
  baseUnit: 'hz',
  icon: '〰️',
  description:
    'Convert frequency units — hertz, kilohertz, megahertz, gigahertz, revolutions per minute (RPM) and radians per second. 1 Hz = 60 RPM = 2π rad/s.',
  units: [
    { id: 'hz', name: 'Hertz', plural: 'hertz', symbol: 'Hz', slug: 'hz', factor: 1, system: 'si', definition: 'One hertz is one cycle per second — the SI unit of frequency. Mains power is 50 or 60 Hz; audible sound spans roughly 20 Hz to 20 kHz.' },
    { id: 'khz', name: 'Kilohertz', plural: 'kilohertz', symbol: 'kHz', slug: 'khz', factor: 1e3, system: 'si', definition: 'A kilohertz is 1,000 Hz. AM radio and audio sample-rate components sit in the kHz range (CD audio samples at 44.1 kHz).' },
    { id: 'mhz', name: 'Megahertz', plural: 'megahertz', symbol: 'MHz', slug: 'mhz', factor: 1e6, system: 'si', definition: 'A megahertz is 1,000,000 Hz. FM radio, older CPU clocks and RF bands are quoted in MHz.' },
    { id: 'ghz', name: 'Gigahertz', plural: 'gigahertz', symbol: 'GHz', slug: 'ghz', factor: 1e9, system: 'si', definition: 'A gigahertz is 1,000 MHz — the clock speed of modern processors and the band of Wi-Fi (2.4/5 GHz) and mobile networks.' },
    { id: 'rpm', name: 'Revolution per minute', plural: 'revolutions per minute', symbol: 'RPM', slug: 'rpm', factor: 1 / 60, system: 'other', definition: 'One revolution per minute is 1/60 Hz. Engine and motor speeds are given in RPM; 3,000 RPM is 50 Hz.' },
    { id: 'rad-s', name: 'Radian per second', plural: 'radians per second', symbol: 'rad/s', slug: 'rad-s', factor: 1 / (2 * Math.PI), system: 'si', definition: 'Angular frequency: one radian per second is 1/(2π) Hz. A full turn is 2π radians, so 1 Hz = 2π ≈ 6.283 rad/s.' },
    { id: 'bpm', name: 'Beat per minute', plural: 'beats per minute', symbol: 'BPM', slug: 'bpm', factor: 1 / 60, system: 'other', definition: 'One beat per minute is 1/60 Hz — the musical and heart-rate unit. 120 BPM is exactly 2 Hz.' },
  ],
  popularPairs: [
    ['hz', 'khz'], ['khz', 'mhz'], ['mhz', 'ghz'],
    ['hz', 'rpm'], ['rpm', 'hz'], ['hz', 'rad-s'], ['ghz', 'mhz'],
  ],
  pairMeta: {
    'hz-to-rpm': { slug: 'hz-to-rpm', exampleValue: 50, note: 'Hertz to revolutions per minute multiplies by 60, because there are 60 seconds in a minute: 50 Hz is 3,000 RPM. This is the bridge between electrical frequency and mechanical rotation speed — a 2-pole motor on 50 Hz mains spins near 3,000 RPM.' },
    'rpm-to-hz': { slug: 'rpm-to-hz', exampleValue: 3000, note: 'Revolutions per minute to hertz divides by 60: a 3,000 RPM shaft turns at 50 Hz, and a 7,200 RPM drive at 120 Hz. Useful for converting a rotation speed into a frequency for vibration or balancing analysis.' },
    'hz-to-khz': { slug: 'hz-to-khz', exampleValue: 44100, note: 'Hertz to kilohertz divides by 1,000: the 44,100 Hz CD sample rate is 44.1 kHz, and 20,000 Hz (the top of human hearing) is 20 kHz. A straightforward decimal prefix shift.' },
    'khz-to-mhz': { slug: 'khz-to-mhz', exampleValue: 1000, note: 'Kilohertz to megahertz divides by 1,000: 1,000 kHz is 1 MHz. AM radio dials in kHz while FM is in MHz, so this converts between the two bands.' },
    'mhz-to-ghz': { slug: 'mhz-to-ghz', exampleValue: 2400, note: 'Megahertz to gigahertz divides by 1,000: the 2,400 MHz Wi-Fi band is 2.4 GHz, and a 3,600 MHz CPU is 3.6 GHz. Same quantity, friendlier number.' },
    'ghz-to-mhz': { slug: 'ghz-to-mhz', exampleValue: 5, note: 'Gigahertz to megahertz multiplies by 1,000: 5 GHz Wi-Fi is 5,000 MHz. Handy when a datasheet lists a band edge in MHz but the product is marketed in GHz.' },
    'hz-to-rad-s': { slug: 'hz-to-rad-s', exampleValue: 1, note: 'Hertz to radians per second multiplies by 2π (≈6.283), since one cycle is 2π radians of phase. So 1 Hz is 6.283 rad/s, and 50 Hz mains is about 314 rad/s — the ω that appears in AC and rotational-motion equations.' },
  },
};
