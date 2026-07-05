/** Color-tools registry. */

export interface ColorToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  /** which widget the page renders */
  widget: 'converter' | 'contrast' | 'shades' | 'gradient' | 'mixer';
  /** preset input mode for the converter widget */
  presetInput?: 'hex' | 'rgb';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const COLOR_TOOLS: ColorToolDef[] = [
  {
    slug: 'color-converter',
    name: 'Color Converter',
    icon: '🎨',
    description:
      'Convert any color between HEX, RGB, HSL and CMYK with a live swatch — paste any format, get every format. Free and in-browser.',
    lead: 'Paste a color in any format — #1d87f1, rgb(29,135,241) or hsl(210,88%,53%) — and read it in every format at once.',
    widget: 'converter',
    how: 'The input is parsed from HEX (3 or 6 digits), RGB or HSL notation, then converted with the standard formulas: RGB↔HEX is base-16 notation of the same three 0–255 channels; HSL re-expresses them as hue (0–360°), saturation and lightness; CMYK approximates the ink mix for print (screen-to-print conversion is device-dependent — treat CMYK values as a starting point, not press-proof).',
    note: 'HEX and RGB are the same numbers in different clothes — #1d87f1 is just rgb(29, 135, 241) written in hexadecimal. HSL is the designer-friendly view: want a darker variant? Lower L. A less intense one? Lower S. Same color model, three dialects.',
    faqs: [
      { q: 'What is the difference between HEX and RGB?', a: 'Notation only — both express the same red/green/blue channels 0–255. #ff6600 is rgb(255, 102, 0): ff = 255, 66 = 102, 00 = 0.' },
      { q: 'When should I use HSL instead?', a: 'When adjusting colors: HSL separates hue from saturation and lightness, so "20% darker" is just L − 20. CSS supports hsl() everywhere modern browsers run.' },
      { q: 'Why does my CMYK print look different from screen?', a: 'Screens emit light (RGB); print reflects it through ink (CMYK) — the gamuts differ, and exact results depend on printer profiles. The formula conversion here is the standard approximation; for brand-critical print, use ICC profiles in design software.' },
      { q: 'What is a 3-digit HEX like #fa0?', a: 'Shorthand where each digit doubles: #fa0 = #ffaa00. The converter accepts both.' },
      { q: 'Is my color data private?', a: 'Yes — parsing and conversion run in your browser; nothing is transmitted.' },
    ],
    keywords: ['color converter', 'hex to rgb to hsl', 'color code converter', 'rgb to cmyk', 'css color formats'],
  },
  {
    slug: 'hex-to-rgb',
    name: 'HEX to RGB Converter',
    icon: '#️⃣',
    description:
      'Convert HEX color codes to RGB values instantly, with a live swatch and CSS-ready output. Free, in-browser.',
    lead: 'A HEX code is RGB in base-16: #1d87f1 converts to rgb(29, 135, 241) — paste any code and read the channels.',
    widget: 'converter',
    presetInput: 'hex',
    how: 'Each pair of HEX digits is one channel in base-16: the first pair red, the second green, the third blue. #1d87f1 → 1d = 29, 87 = 135, f1 = 241 → rgb(29, 135, 241). Three-digit shorthand doubles each digit (#fa0 = #ffaa00).',
    note: 'You need this conversion any time CSS or a design tool wants numeric channels — rgba() with transparency being the everyday case: take the RGB values and add your alpha, e.g. rgba(29, 135, 241, 0.5).',
    faqs: [
      { q: 'How do I convert HEX to RGB manually?', a: 'Split the six digits into three pairs and convert each from base-16: multiply the first digit by 16 and add the second (letters a–f are 10–15). f1 = 15×16 + 1 = 241.' },
      { q: 'How do I get rgba() transparency from a HEX code?', a: 'Convert to RGB here, then add the alpha: #1d87f1 at 50% = rgba(29, 135, 241, 0.5). (Modern CSS also accepts 8-digit HEX, where the last pair is alpha: #1d87f180.)' },
      { q: 'What if my code has only 3 digits?', a: 'It is shorthand — each digit doubles. #09c = #0099cc = rgb(0, 153, 204). The tool handles both.' },
      { q: 'Are HEX and RGB ever different colors?', a: 'Never — they are two notations for identical values. Any difference you see comes from color profiles or display settings, not the notation.' },
      { q: 'Does the tool upload my values?', a: 'No — conversion is local and instant.' },
    ],
    keywords: ['hex to rgb', 'hex color to rgb', 'convert hex to rgb', 'hex code converter', 'rgba from hex'],
  },
  {
    slug: 'rgb-to-hex',
    name: 'RGB to HEX Converter',
    icon: '🔢',
    description:
      'Convert RGB values to HEX color codes instantly, with a live swatch. Free, in-browser, CSS-ready output.',
    lead: 'rgb(29, 135, 241) converts to #1d87f1 — each 0–255 channel written as a two-digit base-16 pair.',
    widget: 'converter',
    presetInput: 'rgb',
    how: 'Each channel (0–255) becomes a two-digit hexadecimal number: 29 → 1d, 135 → 87, 241 → f1, concatenated as #1d87f1. Values below 16 get a leading zero (10 → 0a) — the most common manual-conversion mistake.',
    note: 'HEX is the compact form most tools, CSS codebases and brand guides standardize on — a single token that survives copy-paste. Converting from the RGB values a color picker or screenshot tool reports is a constant small task in design work.',
    faqs: [
      { q: 'How do I convert RGB to HEX manually?', a: 'Divide each channel by 16: the quotient is the first digit, the remainder the second (10–15 become a–f). 241 ÷ 16 = 15 r 1 → f1.' },
      { q: 'Why does my HEX code look wrong with small values?', a: 'Channels under 16 need a leading zero: rgb(0, 10, 200) is #000ac8, not #0ac8. The converter pads automatically.' },
      { q: 'Can HEX express transparency?', a: 'Yes — 8-digit HEX appends an alpha pair: #1d87f180 is 50% transparent. Support is universal in modern browsers.' },
      { q: 'Is uppercase or lowercase HEX correct?', a: 'Both are valid and identical (#1D87F1 = #1d87f1); most style guides prefer lowercase for consistency.' },
      { q: 'Is anything uploaded?', a: 'No — local, instant, works offline.' },
    ],
    keywords: ['rgb to hex', 'convert rgb to hex', 'rgb color to hex code', 'css hex color', 'color code from rgb'],
  },
  {
    slug: 'contrast-checker',
    name: 'Color Contrast Checker',
    icon: '♿',
    description:
      'Check WCAG color contrast between text and background: exact ratio, AA/AAA pass-fail for normal and large text, live preview. In-browser.',
    lead: 'WCAG requires 4.5:1 contrast for normal text (AA) — pick your text and background colors and get the exact ratio with pass/fail per level.',
    widget: 'contrast',
    how: 'The ratio uses the WCAG 2.x formula: each color\'s relative luminance is computed from linearized sRGB channels (L = 0.2126R + 0.7152G + 0.0722B), then ratio = (L₁ + 0.05) ÷ (L₂ + 0.05), ranging 1:1 (identical) to 21:1 (black on white). Thresholds: AA needs 4.5:1 for normal text and 3:1 for large text (18pt/24px, or 14pt/18.66px bold); AAA raises those to 7:1 and 4.5:1. Non-text UI components need 3:1 under WCAG 2.1.',
    note: 'Contrast is the accessibility check with legal teeth: WCAG AA is the reference standard in the EU Accessibility Act (applying to services since June 2025), the ADA context in the US, and most public-sector web law. It is also just good design — passing text is readable on a sunny phone screen.',
    faqs: [
      { q: 'What contrast ratio does WCAG require?', a: 'Level AA: 4.5:1 for normal text, 3:1 for large text (≥24px, or ≥18.66px bold) and UI components. Level AAA: 7:1 and 4.5:1. The checker reports all four verdicts.' },
      { q: 'What counts as "large text"?', a: 'At least 18pt (24px), or 14pt (18.66px) if bold — larger glyphs stay legible at lower contrast, hence the relaxed 3:1 threshold.' },
      { q: 'Is 21:1 the maximum?', a: 'Yes — pure black on pure white (or inverse). A ratio of 1:1 means identical colors.' },
      { q: 'Do I need AA or AAA?', a: 'AA is the standard cited by the EU Accessibility Act and most regulations; AAA is enhanced guidance worth meeting for body text where you can. Logos and decorative text are exempt.' },
      { q: 'My brand color fails — what now?', a: 'Usually darken it for text use while keeping the bright variant for graphics (this site does exactly that), or reserve the failing color for large headlines where 3:1 suffices.' },
      { q: 'Is the math here the official formula?', a: 'Yes — the WCAG 2.x relative-luminance and contrast-ratio equations, computed exactly, in your browser.' },
    ],
    keywords: ['color contrast checker', 'wcag contrast ratio', 'aa aaa contrast', 'accessibility color checker', '4.5:1 contrast', 'text contrast test'],
  },
  {
    slug: 'color-shades-generator',
    name: 'Shades & Tints Generator',
    icon: '🌗',
    description:
      'Generate tints (lighter) and shades (darker) of any color — a full ramp with HEX codes, click to copy. In-browser.',
    lead: 'One base color becomes a full palette: 9 tints toward white and 9 shades toward black, each with its HEX code.',
    widget: 'shades',
    how: 'Tints mix the base color with white in even steps; shades mix it with black — the classical definitions from color theory. Each swatch shows its HEX and copies on click, giving you a ready-made ramp for hover states, borders, backgrounds and dark-mode variants.',
    note: 'Design systems run on exactly these ramps (this site\'s brand blue is a 50–950 scale built the same way). A practical rule: buttons want a shade one or two steps darker for hover, and backgrounds want the palest tints — pairing distant steps keeps text readable.',
    faqs: [
      { q: 'What is the difference between a tint, a shade and a tone?', a: 'Tint = color + white, shade = color + black, tone = color + gray. This tool generates tints and shades; tones follow by mixing with a mid-gray in the color mixer.' },
      { q: 'How do I pick hover and active states from the ramp?', a: 'Convention: hover one step darker than the base, active two steps. Going lighter works for dark UIs — consistency matters more than direction.' },
      { q: 'Which steps work as text on white?', a: 'For a mid-brightness base, usually the two or three darkest shades reach WCAG\'s 4.5:1 — verify the exact pick in the contrast checker (linked below).' },
      { q: 'Why do very light tints look identical?', a: 'Near white, steps compress perceptually — 90% and 95% tints differ by a few RGB points. Ramps in design systems space more steps near the middle for this reason.' },
      { q: 'Is this processed locally?', a: 'Yes — generation is instant and offline-capable.' },
    ],
    keywords: ['color shades generator', 'tints and shades', 'color palette from one color', 'lighter and darker color', 'color ramp generator'],
  },
  {
    slug: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    icon: '🌈',
    description:
      'Build linear and radial CSS gradients visually — two colors, angle control, live preview, copy-ready CSS. In-browser.',
    lead: 'Pick two colors and an angle, watch the live preview, copy the CSS — linear-gradient() or radial-gradient() ready to paste.',
    widget: 'gradient',
    how: 'The output is standard CSS: linear-gradient(angle, color1, color2) sweeps in the direction of the angle (0° points up, 90° right); radial-gradient(circle, color1, color2) radiates from the center. Both are universally supported and render with no image files — a gradient is instructions, not pixels.',
    note: 'Gradients read best between related colors — two blues, a blue and a violet — while distant hues can pass through muddy gray in between. If that happens, nudge one endpoint\'s hue closer, or route through a chosen midpoint by adding a third stop to the copied CSS.',
    faqs: [
      { q: 'How do CSS gradient angles work?', a: '0° points up, 90° right, 180° down — the angle is the direction of travel. The default "to bottom" equals 180°.' },
      { q: 'Linear or radial — when?', a: 'Linear for backgrounds, buttons and headers (directional sweep); radial for glows, spotlights and vignettes (center-out).' },
      { q: 'Why does my gradient look gray in the middle?', a: 'Interpolating between distant hues passes through low-saturation territory. Pick endpoints closer in hue, or add an intermediate color stop to steer around the gray zone.' },
      { q: 'Can I use more than two colors?', a: 'CSS accepts any number of comma-separated stops — copy the generated CSS and insert more, optionally with positions: linear-gradient(90deg, #a 0%, #b 50%, #c 100%).' },
      { q: 'Do gradients hurt performance?', a: 'No — they are computed by the renderer, cost no downloads, and scale to any size losslessly, unlike image backgrounds.' },
    ],
    keywords: ['css gradient generator', 'linear gradient css', 'radial gradient', 'gradient background css', 'two color gradient'],
  },
  {
    slug: 'color-mixer',
    name: 'Color Mixer',
    icon: '🧪',
    description:
      'Blend two colors in any ratio and get the resulting HEX/RGB — with the full blend scale from one color to the other. In-browser.',
    lead: 'Mix two colors at any ratio — 50/50 or anywhere between — and read the resulting HEX instantly.',
    widget: 'mixer',
    how: 'Mixing interpolates each RGB channel between the two colors at your chosen ratio — the same math CSS uses in color-mix(in srgb, A, B). The slider sweeps the full scale, so intermediate swatches double as a mini-palette between any two brand colors.',
    note: 'Screen mixing is light math, not paint: blue + yellow gives gray on screen (channels average out), not the green your paintbox promised — pigment mixing is subtractive, RGB is additive. For usable in-between colors, mix neighbors (blue + cyan) rather than complements.',
    faqs: [
      { q: 'Why does blue + yellow make gray here, not green?', a: 'Screens mix light (additive RGB): blue rgb(0,0,255) + yellow rgb(255,255,0) averages to gray rgb(128,128,128). Paint mixes pigments (subtractive), where blue + yellow yields green. Both are correct in their medium.' },
      { q: 'What ratio should I use?', a: '50/50 for a true midpoint; push toward one end for a tinted variant of it. The scale strip shows every intermediate step to pick from.' },
      { q: 'Is this the same as CSS color-mix()?', a: 'Equivalent to color-mix(in srgb, …) — linear sRGB-channel interpolation. (CSS can also mix in other color spaces, which shift results slightly.)' },
      { q: 'How do I make a tone (color + gray)?', a: 'Mix your color with a mid-gray like #808080 — the classical definition of toning down a color without shifting its hue.' },
      { q: 'Local processing?', a: 'Yes — instant, offline-capable, nothing transmitted.' },
    ],
    keywords: ['color mixer online', 'blend two colors', 'mix hex colors', 'color interpolation', 'midpoint between colors'],
  },
];

export function getColorTool(slug: string): ColorToolDef | undefined {
  return COLOR_TOOLS.find((t) => t.slug === slug);
}
