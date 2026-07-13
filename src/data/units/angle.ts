import type { Quantity } from './types.ts';

/**
 * Base unit: degree (°). Radian = 180/π degrees (exact by definition of π);
 * gradian = 0.9° (400 gon in a turn); 1° = 60 arcminutes = 3600 arcseconds;
 * 1 turn = 360°; 1 compass point = 11.25° (32 points in a circle).
 */
export const angle: Quantity = {
  id: 'angle',
  name: 'Angle',
  slug: 'angle',
  baseUnit: 'deg',
  icon: '📐',
  description:
    'Convert angle units — degrees, radians, gradians (gon), arcminutes, arcseconds, milliradians, full turns and compass points. π radians = 180°; 400 gon = 360°.',
  units: [
    { id: 'deg', name: 'Degree', plural: 'degrees', symbol: '°', slug: 'degree', factor: 1, system: 'metric', definition: 'The everyday angle unit — 360 degrees make a full circle, so a right angle is 90° and a straight line 180°. Divided into 60 arcminutes each of 60 arcseconds.' },
    { id: 'rad', name: 'Radian', plural: 'radians', symbol: 'rad', slug: 'radian', factor: 180 / Math.PI, system: 'si', definition: 'The SI angle unit — the angle subtended when the arc length equals the radius. A full circle is 2π radians, so 1 rad ≈ 57.2958°. Used throughout mathematics and physics.' },
    { id: 'grad', name: 'Gradian', plural: 'gradians', symbol: 'gon', slug: 'gradian', factor: 0.9, system: 'metric', definition: 'Also called the gon or grad — 400 gradians make a full circle, so a right angle is exactly 100 gon. Used in surveying and some European engineering.' },
    { id: 'arcmin', name: 'Arcminute', plural: 'arcminutes', symbol: '′', slug: 'arcminute', factor: 1 / 60, system: 'other', definition: 'One-sixtieth of a degree (also "minute of arc"). Used in astronomy, navigation and optics — the Moon spans about 30 arcminutes in the sky.' },
    { id: 'arcsec', name: 'Arcsecond', plural: 'arcseconds', symbol: '″', slug: 'arcsecond', factor: 1 / 3600, system: 'other', definition: 'One-sixtieth of an arcminute, or 1/3600 of a degree. Astronomers measure star positions and telescope resolution in arcseconds; a parsec is defined by one arcsecond of parallax.' },
    { id: 'mrad', name: 'Milliradian', plural: 'milliradians', symbol: 'mrad', slug: 'milliradian', factor: (180 / Math.PI) / 1000, system: 'other', definition: 'A thousandth of a radian, about 0.0573°. Used in optics, ballistics and rifle scopes ("mils"), where 1 mrad subtends roughly 10 cm at 100 m.' },
    { id: 'turn', name: 'Turn', plural: 'turns', symbol: 'tr', slug: 'turn', factor: 360, system: 'other', definition: 'One full revolution — 360°, 2π radians or 400 gon. Also called a revolution or cycle; rotational counts and phase are often given in turns.' },
    { id: 'point', name: 'Compass point', plural: 'compass points', symbol: 'pt', slug: 'compass-point', factor: 11.25, system: 'other', definition: 'A traditional navigation unit — the compass rose has 32 points of 11.25° each (N, NNE, NE…). Largely historical but still seen in wind and bearing descriptions.' },
  ],
  popularPairs: [
    ['deg', 'rad'], ['rad', 'deg'],
    ['deg', 'grad'], ['grad', 'deg'],
    ['rad', 'grad'], ['deg', 'arcmin'], ['deg', 'turn'], ['arcmin', 'arcsec'],
  ],
  pairMeta: {
    'deg-to-rad': { slug: 'deg-to-rad', exampleValue: 90, note: 'Degrees to radians multiplies by π/180: 90° is π/2 ≈ 1.5708 rad, and 180° is exactly π. Trigonometric functions in most programming languages and calculators expect radians, so this is the conversion you reach for when coding sin, cos and tan.', tableValues: [1, 30, 45, 60, 90, 120, 180, 270, 360] },
    'rad-to-deg': { slug: 'rad-to-deg', exampleValue: 1, note: 'Radians to degrees multiplies by 180/π: 1 rad ≈ 57.296°, and π rad = 180°. Use it to turn a radian result from a maths library back into a human-readable angle.', tableValues: [0.5, 1, 1.5708, 2, 3.1416, 4, 5, 6.2832] },
    'deg-to-grad': { slug: 'deg-to-grad', exampleValue: 90, note: 'Degrees to gradians multiplies by 10/9: a 90° right angle is exactly 100 gon, and 360° is 400 gon. Gradians make right angles and quarter-circles round numbers, which is why surveyors like them.' },
    'grad-to-deg': { slug: 'grad-to-deg', exampleValue: 100, note: 'Gradians to degrees multiplies by 0.9: 100 gon is 90°, and 200 gon is a straight 180°. Convert a surveying angle in gon back to familiar degrees this way.' },
    'rad-to-grad': { slug: 'rad-to-grad', exampleValue: 1, note: 'Radians to gradians multiplies by 200/π: π radians (a straight line) is 200 gon. A less common pairing, but useful moving between mathematical and surveying conventions.' },
    'deg-to-arcmin': { slug: 'deg-to-arcmin', exampleValue: 1, note: 'Degrees to arcminutes multiplies by 60: 1° is 60′, and 0.5° is 30′. Astronomy and navigation subdivide the degree into arcminutes — the full Moon is about 31 arcminutes across.' },
    'deg-to-turn': { slug: 'deg-to-turn', exampleValue: 360, note: 'Degrees to turns divides by 360: 360° is one full turn, 180° is half a turn. Turns (revolutions) are the natural unit for counting rotations and describing phase.' },
    'arcmin-to-arcsec': { slug: 'arcmin-to-arcsec', exampleValue: 1, note: 'Arcminutes to arcseconds multiplies by 60: 1′ is 60″. Telescope resolution and stellar parallax are quoted in arcseconds — the two finest traditional subdivisions of the degree.' },
  },
};
