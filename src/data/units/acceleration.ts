import type { Quantity } from './types.ts';

/**
 * Base unit: metre per second squared (m/s²). Standard gravity g = 9.80665 m/s²
 * (exact, CGPM); 1 ft/s² = 0.3048 m/s²; 1 gal (Galileo) = 0.01 m/s²;
 * 1 km/h/s = 1000/3600 m/s²; 1 mph/s = 1609.344/3600 m/s².
 */
export const acceleration: Quantity = {
  id: 'acceleration',
  name: 'Acceleration',
  slug: 'acceleration',
  baseUnit: 'ms2',
  icon: '🚀',
  description:
    'Convert acceleration units — metres per second squared, standard gravity (g-force), feet per second squared, gal, km/h per second and mph per second. 1 g = 9.80665 m/s².',
  units: [
    { id: 'ms2', name: 'Metre per second²', plural: 'metres per second²', symbol: 'm/s²', slug: 'm-s2', factor: 1, system: 'si', definition: 'The SI unit of acceleration — the rate of change of velocity of one metre per second, each second. Earth\'s gravity is about 9.81 m/s².' },
    { id: 'g', name: 'Standard gravity (g)', plural: 'g', symbol: 'g', slug: 'g', factor: 9.80665, system: 'other', definition: 'The standard acceleration due to gravity, exactly 9.80665 m/s². "g-force" expresses acceleration as a multiple of this — a 2 g turn pushes you at twice your weight.' },
    { id: 'fts2', name: 'Foot per second²', plural: 'feet per second²', symbol: 'ft/s²', slug: 'ft-s2', factor: 0.3048, system: 'us', definition: 'The imperial/US unit — one foot per second, per second, exactly 0.3048 m/s². Standard gravity is about 32.174 ft/s².' },
    { id: 'gal', name: 'Gal (Galileo)', plural: 'gals', symbol: 'Gal', slug: 'gal', factor: 0.01, system: 'other', definition: 'The CGS unit, one centimetre per second², exactly 0.01 m/s². Used in geodesy and gravimetry, where the milligal measures tiny variations in Earth\'s gravity.' },
    { id: 'kmhs', name: 'km/h per second', plural: 'km/h per second', symbol: 'km/h/s', slug: 'kmh-s', factor: 1000 / 3600, system: 'metric', definition: 'How many km/h the speed gains each second — intuitive for vehicles. 0 to 100 km/h in 5 s averages 20 km/h/s ≈ 5.56 m/s².' },
    { id: 'mphs', name: 'mph per second', plural: 'mph per second', symbol: 'mph/s', slug: 'mph-s', factor: 1609.344 / 3600, system: 'us', definition: 'How many mph the speed gains each second. A car doing 0–60 mph in 6 s averages 10 mph/s ≈ 4.47 m/s².' },
    { id: 'ins2', name: 'Inch per second²', plural: 'inches per second²', symbol: 'in/s²', slug: 'in-s2', factor: 0.0254, system: 'us', definition: 'One inch per second, per second, exactly 0.0254 m/s². Occasionally used for small mechanisms and actuators.' },
  ],
  popularPairs: [
    ['ms2', 'g'], ['g', 'ms2'],
    ['ms2', 'fts2'], ['fts2', 'ms2'], ['g', 'fts2'], ['kmhs', 'ms2'], ['mphs', 'ms2'], ['g', 'mphs'],
  ],
  pairMeta: {
    'ms2-to-g': { slug: 'ms2-to-g', exampleValue: 9.80665, note: 'Metres per second² to g divides by 9.80665: 9.81 m/s² is 1 g, and 19.6 m/s² is 2 g. Expressing acceleration in g is how pilots, drivers and engineers describe the load a body feels — 1 g is your normal weight.', tableValues: [1, 5, 9.80665, 15, 20, 30, 50, 100] },
    'g-to-ms2': { slug: 'g-to-ms2', exampleValue: 1, note: 'g to metres per second² multiplies by 9.80665: 1 g is 9.81 m/s², 3 g is 29.4 m/s². Convert a g-force figure (a rollercoaster, a fighter jet, a crash test) into SI acceleration this way.', tableValues: [0.5, 1, 2, 3, 5, 6, 9, 10] },
    'ms2-to-fts2': { slug: 'ms2-to-fts2', exampleValue: 10, note: 'Metres per second² to feet per second² divides by 0.3048: 10 m/s² is about 32.8 ft/s². Standard gravity is 9.80665 m/s², which is the same as 32.174 ft/s².' },
    'fts2-to-ms2': { slug: 'fts2-to-ms2', exampleValue: 32.174, note: 'Feet per second² to metres per second² multiplies by 0.3048: 32.174 ft/s² is 9.80665 m/s² (standard gravity). Use it to bring US-engineering acceleration figures into SI.' },
    'g-to-fts2': { slug: 'g-to-fts2', exampleValue: 1, note: 'g to feet per second² multiplies by 32.174: 1 g is 32.174 ft/s². Handy in US aerospace and mechanical work where g-loads convert to imperial acceleration.' },
    'kmhs-to-ms2': { slug: 'kmhs-to-ms2', exampleValue: 20, note: 'km/h per second to metres per second² multiplies by 1000/3600 (÷3.6): gaining 20 km/h each second is about 5.56 m/s². This links the intuitive "km/h gained per second" to the physics unit.' },
    'mphs-to-ms2': { slug: 'mphs-to-ms2', exampleValue: 10, note: 'mph per second to metres per second² multiplies by about 0.447: gaining 10 mph each second is about 4.47 m/s². A 0–60 mph in 6 s car averages 10 mph/s.' },
    'g-to-mphs': { slug: 'g-to-mphs', exampleValue: 1, note: '1 g equals about 21.9 mph per second — so a sustained 1 g launch would add roughly 22 mph every second. A useful feel for how brutal high-g acceleration really is.' },
  },
};
