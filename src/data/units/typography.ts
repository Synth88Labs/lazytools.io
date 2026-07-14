import type { Quantity } from './types.ts';

/**
 * Base unit: PostScript/CSS point (pt), defined as exactly 1/72 inch.
 * 1 pica = 12 pt; 1 CSS pixel = 1/96 inch = 0.75 pt; 1 inch = 72 pt.
 * These are the modern desktop-publishing / CSS definitions (not the older
 * 72.27-pt "printer's point").
 */
export const typography: Quantity = {
  id: 'typography',
  name: 'Typography (Points & Pixels)',
  slug: 'typography',
  baseUnit: 'pt',
  icon: '🔠',
  description:
    'Convert typography and print units — points, picas, pixels, inches and millimetres. Based on the standard 1 pt = 1/72 inch and 1 CSS px = 1/96 inch (96 px = 72 pt).',
  units: [
    { id: 'pt', name: 'Point', plural: 'points', symbol: 'pt', slug: 'point', factor: 1, system: 'other', definition: 'The desktop-publishing and CSS point, defined as exactly 1/72 of an inch. Font sizes and leading are measured in points.' },
    { id: 'px', name: 'Pixel', plural: 'pixels', symbol: 'px', slug: 'pixel', factor: 0.75, system: 'other', definition: 'The CSS reference pixel, defined as 1/96 of an inch, so 96 px = 72 pt and 1 px = 0.75 pt. It is a fixed physical reference in CSS, independent of screen density.' },
    { id: 'pc', name: 'Pica', plural: 'picas', symbol: 'pc', slug: 'pica', factor: 12, system: 'other', definition: 'A typography unit equal to 12 points (1/6 of an inch). Column widths and layout measures are often given in picas.' },
    { id: 'in', name: 'Inch', plural: 'inches', symbol: 'in', slug: 'inch', factor: 72, system: 'imperial', definition: 'One inch equals exactly 72 points or 96 CSS pixels — the anchor that ties typographic units to physical length.' },
    { id: 'mm', name: 'Millimetre', plural: 'millimetres', symbol: 'mm', slug: 'millimeter', factor: 72 / 25.4, system: 'metric', definition: 'One millimetre is 1/25.4 inch, which is 72/25.4 ≈ 2.8346 points. Used for print margins and bleed in metric workflows.' },
    { id: 'cm', name: 'Centimetre', plural: 'centimetres', symbol: 'cm', slug: 'centimeter', factor: 720 / 25.4, system: 'metric', definition: 'One centimetre is 10 mm, or 720/25.4 ≈ 28.346 points.' },
  ],
  popularPairs: [
    ['pt', 'px'], ['px', 'pt'],
    ['pt', 'in'], ['pc', 'pt'], ['px', 'in'], ['mm', 'pt'],
  ],
  pairMeta: {
    'pt-to-px': { slug: 'pt-to-px', exampleValue: 12, note: 'Points to pixels multiplies by 4/3 (since 96 px = 72 pt): a 12 pt font is 12 × 96 ÷ 72 = 16 px. This is the everyday CSS conversion for turning a print font size into a web one.', tableValues: [6, 8, 9, 10, 11, 12, 14, 16, 18, 24, 36, 48, 72] },
    'px-to-pt': { slug: 'px-to-pt', exampleValue: 16, note: 'Pixels to points multiplies by 0.75 (72 ÷ 96): 16 px is 12 pt. Use it to turn a CSS pixel size into the points a print or word-processor document expects.', tableValues: [8, 10, 12, 14, 16, 18, 20, 24, 32, 48, 96] },
    'pt-to-in': { slug: 'pt-to-in', exampleValue: 72, note: 'Points to inches divides by 72: 72 pt is exactly 1 inch. A 36 pt heading is half an inch tall in em terms.' },
    'pc-to-pt': { slug: 'pc-to-pt', exampleValue: 1, note: 'Picas to points multiplies by 12: 1 pica is 12 points, and 6 picas make an inch. Picas are handy for column and gutter widths.' },
    'px-to-in': { slug: 'px-to-in', exampleValue: 96, note: 'Pixels to inches divides by 96 (the CSS reference resolution): 96 px is 1 inch. This is why a 1-inch element is 96 CSS pixels wide regardless of the display’s actual DPI.' },
    'mm-to-pt': { slug: 'mm-to-pt', exampleValue: 1, note: 'Millimetres to points multiplies by 72/25.4 ≈ 2.8346: 1 mm is about 2.83 pt. Useful for setting print margins and bleed in a metric layout.' },
  },
};
