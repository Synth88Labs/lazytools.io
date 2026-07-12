import type { Quantity } from './types.ts';

/** Base unit: newton (N). 1 lbf = 0.45359237×9.80665 N; 1 kgf = 9.80665 N; 1 dyne = 1e-5 N (exact). */
export const force: Quantity = {
  id: 'force',
  name: 'Force',
  slug: 'force',
  baseUnit: 'n',
  icon: '💪',
  description:
    'Convert force units — newtons, kilonewtons, pound-force, kilogram-force (kilopond), dyne, ounce-force and poundal. 1 lbf ≈ 4.4482 N; 1 kgf = 9.80665 N.',
  units: [
    { id: 'n', name: 'Newton', plural: 'newtons', symbol: 'N', slug: 'n', factor: 1, system: 'si', definition: 'The SI unit of force — the force that accelerates one kilogram at one metre per second squared. A small apple weighs about 1 N.' },
    { id: 'kn', name: 'Kilonewton', plural: 'kilonewtons', symbol: 'kN', slug: 'kn', factor: 1e3, system: 'si', definition: 'A kilonewton is 1,000 N — used in structural and mechanical engineering. Roughly the weight of 102 kg under gravity.' },
    { id: 'lbf', name: 'Pound-force', plural: 'pounds-force', symbol: 'lbf', slug: 'lbf', factor: 0.45359237 * 9.80665, system: 'us', definition: 'The force of gravity on one pound of mass — about 4.4482 N. US engineering and thrust figures use pound-force (often just "pounds").' },
    { id: 'kgf', name: 'Kilogram-force', plural: 'kilograms-force', symbol: 'kgf', slug: 'kgf', factor: 9.80665, system: 'metric', definition: 'The force of gravity on one kilogram — exactly 9.80665 N (also called a kilopond, kp). Common in older metric engineering.' },
    { id: 'dyn', name: 'Dyne', plural: 'dynes', symbol: 'dyn', slug: 'dyne', factor: 1e-5, system: 'other', definition: 'The CGS unit of force — the force to accelerate one gram at one cm/s². One dyne is exactly 10⁻⁵ N; 100,000 dyne make a newton.' },
    { id: 'ozf', name: 'Ounce-force', plural: 'ounces-force', symbol: 'ozf', slug: 'ozf', factor: (0.45359237 * 9.80665) / 16, system: 'us', definition: 'One-sixteenth of a pound-force, about 0.278 N — used for small springs, actuators and touch forces.' },
    { id: 'pdl', name: 'Poundal', plural: 'poundals', symbol: 'pdl', slug: 'poundal', factor: 0.45359237 * 0.3048, system: 'other', definition: 'An absolute FPS unit — the force to accelerate one pound-mass at one ft/s², about 0.1383 N. Largely historical.' },
  ],
  popularPairs: [
    ['n', 'lbf'], ['lbf', 'n'],
    ['n', 'kgf'], ['kgf', 'n'], ['n', 'kn'], ['lbf', 'kgf'],
  ],
  pairMeta: {
    'n-to-lbf': { slug: 'n-to-lbf', exampleValue: 100, note: 'Newtons to pound-force divides by about 4.4482: 100 N is about 22.5 lbf. This is the everyday force conversion — spring ratings, thrust and load cells are often given in one unit but needed in the other.', tableValues: [1, 5, 10, 20, 50, 100, 200, 500, 1000] },
    'lbf-to-n': { slug: 'lbf-to-n', exampleValue: 10, note: 'Pound-force to newtons multiplies by about 4.4482: 10 lbf is 44.48 N. Rocket and jet thrust quoted in "pounds" (lbf) converts to newtons this way — a 100 lbf actuator pushes with about 445 N.' , tableValues: [1, 5, 10, 25, 50, 100, 250, 500, 1000] },
    'n-to-kgf': { slug: 'n-to-kgf', exampleValue: 100, note: 'Newtons to kilogram-force divides by 9.80665 (standard gravity): 100 N is about 10.2 kgf. Kilogram-force expresses a force as "the weight of this many kilograms", which is intuitive for loads — 98.07 N is the weight of 10 kg.' },
    'kgf-to-n': { slug: 'kgf-to-n', exampleValue: 10, note: 'Kilogram-force to newtons multiplies by 9.80665: 10 kgf is 98.07 N. Use it to turn an older metric force spec (or a "weight" in kg treated as a force) into SI newtons.' },
    'n-to-kn': { slug: 'n-to-kn', exampleValue: 5000, note: 'Newtons to kilonewtons divides by 1,000: 5,000 N is 5 kN. Structural loads and press capacities are usually stated in kN because the numbers are more manageable.' },
    'lbf-to-kgf': { slug: 'lbf-to-kgf', exampleValue: 100, note: 'Pound-force to kilogram-force multiplies by about 0.4536 (the same number as pounds to kilograms, since both are gravity-based): 100 lbf is about 45.4 kgf. Handy for comparing US and metric load ratings.' },
  },
};
