/** Color-tools registry. */

export interface ColorToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  /** which widget the page renders */
  widget:
    | 'converter' | 'contrast' | 'shades' | 'gradient' | 'mixer' | 'brands'
    | 'oklch' | 'accessible' | 'apca' | 'grid' | 'cvd' | 'harmony'
    | 'imagepicker' | 'colorname' | 'oklchscale';
  /** preset input mode for the converter widget */
  presetInput?: 'hex' | 'rgb';
  /** default direction label for the OKLCH converter satellites */
  oklchDir?: 'hex-to-oklch' | 'oklch-to-hex' | 'rgb-to-oklch';
  /** default CVD type for the color-blindness simulator satellites */
  cvdType?: 'protanopia' | 'deuteranopia' | 'tritanopia';
  /** default scheme for the harmony generator satellites */
  harmonyPreset?: 'complementary' | 'triadic' | 'analogous';
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
  {
    slug: 'brand-colors',
    name: 'Brand Color Finder',
    icon: '🏷️',
    description:
      'Look up the official color palettes of 1,100+ famous brands — Google, Netflix, Coca-Cola, Spotify and more. Search by brand name or hex code, click any swatch to copy. Free, instant, in your browser.',
    lead: 'Need Netflix red or Spotify green? Search 1,100+ brand palettes by name — or reverse-search by hex to see which brands use a color — and click any swatch to copy it.',
    widget: 'brands',
    how: 'Every entry pairs a brand with the hex values of its documented palette, primary color first. Type a brand name for an instant filter, or type a hex fragment (with or without the #) to reverse-search — "#e50914" finds Netflix, "1db9" finds Spotify — and click any swatch to copy its code, with the hex revealed on hover. The dataset covers the brands designers actually reach for: tech and social platforms, finance and crypto, airlines and hotels, automotive, retail, food and beverage, media and streaming, telecoms, fashion and luxury, gaming, logistics and sport — over 1,100 in all, searchable entirely in your browser with no request leaving the page.',
    note: 'Two honest caveats built in. First, provenance: these values are compiled from publicly documented brand guidelines, press kits and long-standing community references — brand colors are facts, but brands do evolve them (rebrands happen), so treat the palette as a strong starting point and check the brand\'s own guidelines for contract work. Corrections are welcome via the contact page. Second, trademarks: brand names appear here only to identify whose colors are shown — the names and logos belong to their owners, and having a brand\'s hex codes does not license you to impersonate it.',
    faqs: [
      { q: 'How do I find a specific brand\'s colors?', a: 'Type the brand name in the search box — matching is instant and partial ("spoti" finds Spotify). Each card shows the palette with the primary color first; hover a swatch to see its hex, click to copy it.' },
      { q: 'Can I search by color instead of by brand?', a: 'Yes — type a hex code or fragment, with or without the #. Searching "#ff0000" lists every brand whose palette starts with that value; a fragment like "1db9" works too. It\'s a quick way to answer "who uses this exact red?"' },
      { q: 'Are these the official brand colors?', a: 'They are the widely documented values from brand guidelines, press kits and community references — for well-known brands these are stable and reliable. Brands do rebrand, though, so for contract or print work confirm against the brand\'s current style guide. Spot an outdated palette? Report it via the contact page.' },
      { q: 'Can I legally use these colors?', a: 'Colors themselves are not protected — anyone may paint in Coca-Cola red. What trademark law protects is using a brand\'s identity in ways that confuse consumers. Referencing palettes for inspiration, mood boards or matching an embed to a platform\'s UI is normal practice; impersonating the brand is not.' },
      { q: 'Why does a brand show several colors?', a: 'Most identity systems have a palette, not a single color: a primary plus secondary and accent colors (Google has four; Slack has five). The first swatch is always the primary — the one people mean by "the brand color".' },
      { q: 'Is my search sent anywhere?', a: 'No — the entire dataset ships with the page and searching filters it locally. The page works offline, and your search runs entirely on your device — the brand names you look up are never sent anywhere.' },
    ],
    keywords: ['brand colors', 'brand color finder', 'brand color palette', 'netflix red hex', 'spotify green hex', 'google colors', 'company brand colors', 'logo colors hex', 'brand color codes', 'official brand colors'],
  },

  // ---------- OKLCH / modern color-space converter (lead) ----------
  {
    slug: 'oklch-color-picker',
    name: 'OKLCH Color Picker & Converter',
    icon: '🎛️',
    description:
      'Convert any color to and from OKLCH, OKLAB, LAB, LCH, XYZ and HWB — with a guaranteed HEX/RGB fallback and an honest out-of-gamut flag. Exact Ottosson matrices, in your browser.',
    lead: 'Pick or paste a color and read it in OKLCH, OKLAB, LAB, LCH, HWB, HEX and RGB at once — with a safe HEX fallback and a warning when a color falls outside the sRGB gamut.',
    widget: 'oklch',
    how: 'Colors are decoded from sRGB, linearised, and passed through the exact published matrices: linear-sRGB → LMS → OKLab (Björn Ottosson), with OKLCH as its polar form (C = √(a²+b²), H = atan2(b, a)); and linear-sRGB → CIE XYZ (D65) → CIELAB → LCH. HWB comes from the HSV hue with whiteness and blackness. Going the other way, OKLCH → sRGB inverts every step; when the result lands outside the displayable sRGB gamut, the tool reduces chroma along constant lightness and hue (the CSS Color 4 gamut-mapping approach) and flags it, so you always get a usable HEX fallback.',
    note: 'OKLCH is now the authoring format and HEX the compatibility format — CSS Color 4 shipped oklch() in every evergreen browser (~93–95% coverage) and Tailwind CSS 4 uses OKLCH as its default color space. The everyday pain is round-tripping OKLCH↔HEX with a gamut check; this does exactly that with byte-exact matrix math a chatbot cannot reproduce.',
    faqs: [
      { q: 'What is OKLCH?', a: 'OKLCH is a perceptually uniform color space: L is lightness (0–100%), C is chroma (colorfulness), and H is hue (0–360°). Equal numeric steps look like equal visual steps, which is why it is better than HSL for building consistent palettes — and it is a first-class CSS color function, oklch().' },
      { q: 'How do I convert HEX to OKLCH?', a: 'Paste the HEX code and read the oklch() value. Internally the color is linearised from sRGB and passed through the OKLab matrices, then converted to polar form. For example #1d87f1 becomes oklch(62.3% 0.183 253.6).' },
      { q: 'Why is my OKLCH color "out of gamut"?', a: 'OKLCH can describe colors more saturated than an sRGB screen can show. When that happens the tool keeps your lightness and hue but lowers chroma until the color fits, and flags it — so the HEX fallback is always displayable. Wide-gamut (P3) displays can show more of these colors.' },
      { q: 'Is OKLCH better than HSL?', a: 'For perceptual work, yes. HSL lightness is not perceptually even — a "50% lightness" yellow looks far brighter than a 50% blue. OKLCH fixes this, so lightness ramps and hue rotations behave predictably, which is why design systems and Tailwind 4 adopted it.' },
      { q: 'What are OKLAB, LAB, LCH and HWB?', a: 'OKLAB is the rectangular form of OKLCH (lightness with a/b axes). CIELAB and LCH are the older CIE perceptual space and its polar form. HWB (hue-whiteness-blackness) is an intuitive CSS space. This one tool shows all of them for the same color.' },
      { q: 'Do OKLCH colors work in all browsers?', a: 'The oklch() function works in all current browsers (Chrome/Edge 111+, Safari 15.4+, Firefox 113+, ~93–95% of users). For older browsers, use the HEX or RGB fallback this tool provides alongside every OKLCH value.' },
    ],
    keywords: ['oklch color picker', 'oklch converter', 'oklch to hex', 'hex to oklch', 'oklab converter', 'lab lch color', 'css color 4', 'tailwind oklch'],
  },
  {
    slug: 'hex-to-oklch',
    name: 'HEX to OKLCH Converter',
    icon: '🎯',
    description: 'Convert HEX color codes to OKLCH (CSS Color 4) with exact Ottosson matrices, plus OKLAB, LAB and a P3-gamut note. Free, in your browser.',
    lead: 'Turn a HEX code into an oklch() value — the perceptually uniform CSS Color 4 format — with OKLAB and LAB shown too.',
    widget: 'oklch',
    oklchDir: 'hex-to-oklch',
    how: 'The HEX code is decoded to sRGB, linearised, and passed through the exact OKLab matrices (linear-sRGB → LMS → OKLab), then written in polar OKLCH form. The tool also shows OKLAB, LAB, LCH, HWB and the original RGB, so you can copy whichever your CSS needs.',
    note: 'Converting HEX to OKLCH is the first step teams take when migrating a color system to CSS Color 4 or Tailwind 4 — OKLCH lets you build even lightness ramps that HEX and HSL cannot.',
    faqs: [
      { q: 'How do I convert HEX to OKLCH?', a: 'Paste the HEX code; the tool linearises the sRGB channels and applies the OKLab transform, giving an oklch(L% C H) value. #1d87f1 becomes oklch(62.3% 0.183 253.6).' },
      { q: 'Is the conversion exact?', a: 'Yes — it uses Björn Ottosson\'s published OKLab matrices, the same math browsers use for the oklch() function, so the output matches what the browser renders.' },
      { q: 'Why convert HEX to OKLCH at all?', a: 'OKLCH is perceptually uniform, so adjusting lightness or hue behaves predictably. Teams convert their HEX palettes to OKLCH to build consistent shade scales and to author in the modern CSS format.' },
      { q: 'What if the HEX color has no exact OKLCH?', a: 'Every sRGB (HEX) color has an exact OKLCH value — the conversion is lossless in that direction. Gamut issues only arise going the other way, when an OKLCH color is too saturated for sRGB.' },
      { q: 'Does it also give OKLAB and LAB?', a: 'Yes — the same page shows OKLAB (rectangular OKLab), CIELAB, LCH and HWB for the color, so you do not need a separate converter.' },
    ],
    keywords: ['hex to oklch', 'hex to oklch converter', 'convert hex to oklch', 'hex to oklab', 'hex color to css color 4'],
  },
  {
    slug: 'oklch-to-hex',
    name: 'OKLCH to HEX Converter',
    icon: '🔁',
    description: 'Convert OKLCH (or OKLAB) colors to HEX and RGB with CSS Color 4 gamut mapping and an out-of-gamut warning. Exact, in your browser.',
    lead: 'Convert an oklch() value to a safe HEX and RGB fallback — with a clear flag when the color is too vivid for the sRGB screen.',
    widget: 'oklch',
    oklchDir: 'oklch-to-hex',
    how: 'The OKLCH value is converted to OKLab, then inverted through the OKLab matrices back to linear-sRGB and gamma-encoded to HEX/RGB. If the color falls outside sRGB, the tool reduces chroma while holding lightness and hue (the CSS Color 4 gamut-mapping method) so the HEX fallback is always displayable, and it tells you when this happened.',
    note: 'This is the conversion that makes OKLCH practical: you author in oklch() but still need a HEX fallback for older browsers and tools — and you need to know when a beautiful wide-gamut color will be dulled on an sRGB screen.',
    faqs: [
      { q: 'How do I convert OKLCH to HEX?', a: 'Enter the OKLCH lightness, chroma and hue; the tool inverts the OKLab matrices to sRGB and outputs the HEX and RGB. If the color is out of the sRGB gamut, it maps it to the nearest displayable HEX and flags it.' },
      { q: 'What does "out of gamut" mean here?', a: 'OKLCH can express colors more saturated than sRGB can display. When that happens the exact HEX does not exist, so the tool lowers chroma (keeping lightness and hue) until the color fits and shows a warning — giving you an honest, usable fallback.' },
      { q: 'Why do I need a HEX fallback if I use OKLCH?', a: 'A small share of browsers and many design or email tools still expect HEX. Providing a HEX fallback alongside oklch() keeps your colors correct everywhere while you author in the modern space.' },
      { q: 'Is the OKLCH→HEX conversion lossy?', a: 'Only when the OKLCH color is outside sRGB — then gamut mapping changes the chroma slightly. For in-gamut colors the conversion is exact and round-trips back to the same OKLCH.' },
      { q: 'Does it accept OKLAB too?', a: 'Yes — you can enter an OKLAB (L, a, b) color as well, and it converts through the same inverse matrices to HEX and RGB.' },
    ],
    keywords: ['oklch to hex', 'oklch to hex converter', 'convert oklch to hex', 'oklab to hex', 'oklch to rgb', 'oklch fallback hex'],
  },
  {
    slug: 'rgb-to-oklch',
    name: 'RGB to OKLCH Converter',
    icon: '📊',
    description: 'Convert RGB values to OKLCH, OKLAB and LAB with exact matrices — the perceptually uniform CSS Color 4 format. Free, in-browser.',
    lead: 'Convert rgb() values into oklch() — the perceptually uniform format — with OKLAB, LAB and HEX shown alongside.',
    widget: 'oklch',
    oklchDir: 'rgb-to-oklch',
    how: 'Each RGB channel is linearised from sRGB and passed through the exact OKLab matrices, then written as oklch(L% C H). The page also shows OKLAB, CIELAB, LCH, HWB and the HEX form of the same color.',
    note: 'RGB and OKLCH describe the same color, but OKLCH separates lightness from hue and chroma perceptually — so once in OKLCH you can lighten or shift hue without the muddiness that RGB and HSL edits produce.',
    faqs: [
      { q: 'How do I convert RGB to OKLCH?', a: 'Enter the red, green and blue values (0–255); the tool linearises them and applies the OKLab transform to give an oklch() value, plus OKLAB and LAB.' },
      { q: 'Is RGB to OKLCH exact?', a: 'Yes — it uses the published OKLab matrices, so the result matches the oklch() a browser computes from the same RGB color.' },
      { q: 'Why use OKLCH instead of RGB?', a: 'RGB is how screens emit color but is not intuitive to edit; OKLCH is perceptually uniform, so lightness and hue adjustments look even. It is the modern CSS authoring format.' },
      { q: 'Does it show a HEX version too?', a: 'Yes — the HEX equivalent is shown next to the OKLCH, OKLAB and LAB values.' },
      { q: 'Is my color uploaded?', a: 'No — every conversion runs in your browser.' },
    ],
    keywords: ['rgb to oklch', 'rgb to oklch converter', 'convert rgb to oklch', 'rgb to oklab', 'rgb to lab'],
  },

  // ---------- Accessibility cluster ----------
  {
    slug: 'accessible-color-generator',
    name: 'Accessible Color Generator (WCAG Fixer)',
    icon: '♿',
    description:
      'Find the nearest accessible color that passes WCAG AA or AAA against your background — hue preserved, contrast fixed. Exact WCAG 2 math, in your browser.',
    lead: 'Give a foreground and background color and a WCAG target, and get the nearest passing color — same hue, adjusted lightness — that meets the contrast ratio.',
    widget: 'accessible',
    how: 'The tool computes the exact WCAG 2 contrast ratio (using sRGB relative luminance) between your foreground and background. If it fails, it binary-searches the foreground lightness — holding hue and saturation in HSL — both lighter and darker until the ratio meets your target (AA 4.5, AA-large 3, or AAA 7), and returns the nearest passing color in each direction with a live preview.',
    note: 'This extends our contrast checker from "pass or fail" to "here is the fix". Because it holds hue and only moves lightness, the suggested color stays on-brand — the smallest change that makes text legible and WCAG-compliant.',
    faqs: [
      { q: 'How do I make a color WCAG accessible?', a: 'Keep the hue and adjust the lightness until the contrast ratio against the background meets the target — 4.5:1 for normal text (AA), 3:1 for large text, or 7:1 for AAA. This tool does that search automatically and shows the nearest passing color lighter and darker.' },
      { q: 'What contrast ratio do I need?', a: 'WCAG 2 AA requires 4.5:1 for normal text and 3:1 for large text (≥18.66px bold or ≥24px). AAA requires 7:1 (4.5:1 for large). Pick the target and the tool finds a color that meets it.' },
      { q: 'Will the fixed color still match my brand?', a: 'It preserves the hue and only changes lightness, so it stays the same "color" — just light or dark enough to be legible. That is usually the most brand-faithful accessible option.' },
      { q: 'Why adjust the text instead of the background?', a: 'Either works; this tool adjusts the foreground because text color is usually the freer choice. You can also swap the two inputs to hold the text and move the background.' },
      { q: 'Is this WCAG 2 or WCAG 3 (APCA)?', a: 'This uses the current WCAG 2 contrast-ratio method, which is the legally referenced standard. For the emerging WCAG 3 method, see the APCA contrast checker.' },
    ],
    keywords: ['accessible color generator', 'wcag color fixer', 'make color accessible', 'accessible color contrast', 'fix color contrast', 'wcag aa color'],
  },
  {
    slug: 'apca-contrast-checker',
    name: 'APCA Contrast Checker (WCAG 3)',
    icon: '🔬',
    description:
      'Check text contrast with APCA — the WCAG 3 method — reporting Lc (lightness contrast) and the minimum font size, alongside the WCAG 2 ratio. Pinned APCA-W3 0.1.9, in your browser.',
    lead: 'Measure text/background contrast the WCAG 3 way: APCA reports a signed Lc value (0–±106) that accounts for polarity and maps to a minimum readable font size.',
    widget: 'apca',
    how: 'APCA (Accessible Perceptual Contrast Algorithm) estimates the perceived lightness contrast between text and background. The tool computes screen luminance for each color with the APCA exponents, applies the soft black-clamp, and derives Lc — positive for dark-on-light, negative for light-on-dark — then looks up the minimum font size and weight that Lc supports. It shows the WCAG 2 ratio beside it so you can compare the two methods.',
    note: 'APCA is the contrast method in the draft WCAG 3 and behaves very differently from WCAG 2: it is polarity-aware (dark-on-light vs light-on-dark are not symmetric) and ties contrast to font size. This checker is pinned to APCA-W3 version 0.1.9 — stated on-page because APCA is still versioned.',
    faqs: [
      { q: 'What is APCA?', a: 'APCA (Accessible Perceptual Contrast Algorithm) is the contrast method proposed for WCAG 3. Instead of a ratio, it reports Lc — a lightness-contrast value from about 0 to ±106 — that better matches how humans perceive text readability, factoring in whether text is dark-on-light or light-on-dark.' },
      { q: 'What Lc value do I need?', a: 'As a guide: Lc 90+ for fine print and body text, Lc 75 for larger body text, Lc 60 for large/bold headings, Lc 45 for large display text, and Lc 30 as a non-text minimum. The tool shows the minimum font size each Lc supports.' },
      { q: 'How is APCA different from WCAG 2 contrast?', a: 'WCAG 2 uses a symmetric ratio (1–21) that ignores polarity and font size. APCA is polarity-aware and size-linked, so some pairs that pass WCAG 2 can be weak in APCA and vice-versa. This tool shows both numbers side by side.' },
      { q: 'Which APCA version does this use?', a: 'It is pinned to APCA-W3 0.1.9, the version referenced by the current WCAG 3 working draft. APCA has changed across releases, so the version is stated on the page for reproducibility.' },
      { q: 'Should I use APCA or WCAG 2 today?', a: 'WCAG 2 is the standard currently referenced by law (EAA, ADA, Section 508), so use it for compliance. APCA is worth checking as a forward-looking, often more realistic readability signal — many teams report both.' },
    ],
    keywords: ['apca contrast checker', 'apca calculator', 'wcag 3 contrast', 'lc contrast', 'perceptual contrast', 'apca vs wcag'],
  },
  {
    slug: 'contrast-grid',
    name: 'Contrast Grid Generator',
    icon: '🔲',
    description:
      'Check every foreground/background pair in a palette at once — a full WCAG 2 contrast matrix with AA/AAA pass badges. For design systems, in your browser.',
    lead: 'Paste a palette and get an N×N grid of WCAG 2 contrast ratios — every color against every other, with AA and AAA pass badges.',
    widget: 'grid',
    how: 'Enter one color per line (HEX, RGB or HSL, with an optional label). The tool computes the exact WCAG 2 contrast ratio for every ordered pair using sRGB relative luminance and renders a matrix: each cell shows the ratio and badges for AA (4.5:1), AA-large (3:1) and AAA (7:1), with the actual colors painted so you can see the combination.',
    note: 'A single-pair checker answers "do these two work?"; a contrast grid answers "which combinations in my whole palette are usable?" — the design-system question. It reuses the exact WCAG math from our contrast checker across the full matrix.',
    faqs: [
      { q: 'What is a contrast grid?', a: 'A matrix that pairs every color in a palette against every other and shows the contrast ratio and WCAG pass/fail for each combination — so you can see at a glance which foreground/background pairs are accessible.' },
      { q: 'How many colors can I check?', a: 'As many as you paste, one per line. The grid grows to N×N, so large palettes produce big grids; a design-system core palette of 6–12 colors is the typical use.' },
      { q: 'What do the badges mean?', a: 'Each cell shows whether the pair meets WCAG 2 AA (4.5:1 normal text), AA-large (3:1 for large text) and AAA (7:1). A pair can pass for large text but fail for body text — the badges make that explicit.' },
      { q: 'Can I label my colors?', a: 'Yes — add a label after the color on each line (e.g. "#1d87f1 Primary") and the grid uses it in the row and column headers.' },
      { q: 'Does this use APCA?', a: 'This grid uses WCAG 2 ratios, the current legal standard. The APCA (WCAG 3) checker is a separate tool for the emerging perceptual method.' },
    ],
    keywords: ['contrast grid', 'contrast grid generator', 'palette contrast checker', 'wcag palette', 'design system contrast', 'color matrix contrast'],
  },

  // ---------- Colour-vision-deficiency simulator ----------
  {
    slug: 'color-blindness-simulator',
    name: 'Color Blindness Simulator',
    icon: '👁️',
    description:
      'Simulate how your image or color palette looks with color blindness — deuteranopia, protanopia, tritanopia and achromatopsia — with a severity slider. On-device, in your browser.',
    lead: 'See how an uploaded image or a pasted palette appears to people with color-vision deficiency — the four main types, with an adjustable severity — all processed on your device.',
    widget: 'cvd',
    how: 'The tool converts each pixel or swatch to linear-sRGB and applies the published Machado, Oliveira & Fernandes (2009) transform matrices for protanopia, deuteranopia and tritanopia (and a luminance projection for achromatopsia), then converts back to sRGB. The severity slider interpolates between your original and the full-dichromat simulation to approximate anomalous trichromacy. Images are drawn to a canvas and never uploaded; palettes are simulated swatch-by-swatch.',
    note: 'About 1 in 12 men and 1 in 200 women have some color-vision deficiency. The palette mode is the differentiator — you can test the exact swatches in a design system, not just a screenshot — and everything runs on-device, so unreleased designs stay private.',
    faqs: [
      { q: 'What types of color blindness can I simulate?', a: 'The four main types: deuteranopia (green-weak, the most common), protanopia (red-weak), tritanopia (blue-weak), and achromatopsia (total, seeing only lightness). A severity slider approximates the milder "anomalous" forms of each.' },
      { q: 'How accurate is the simulation?', a: 'It uses the Machado, Oliveira & Fernandes (2009) matrices — the field-standard published constants also used by scientific tools — applied in linear-sRGB. Simulations are close approximations of average CVD perception, not a substitute for testing with real users.' },
      { q: 'Can I test a color palette, not just an image?', a: 'Yes. Paste a list of colors and the tool simulates each swatch under the selected deficiency, so you can check whether two palette colors become indistinguishable — the key design-system question.' },
      { q: 'Is my image uploaded anywhere?', a: 'No. The image is drawn to a canvas and processed pixel-by-pixel in your browser; it never leaves your device, which matters for unreleased work.' },
      { q: 'Why do some colors look the same after simulation?', a: 'That is the point — if two colors collapse to nearly the same appearance under, say, deuteranopia, a color-blind user cannot tell them apart. Add a non-color cue (text, icon, pattern) or increase their lightness difference.' },
    ],
    keywords: ['color blindness simulator', 'color blind simulator', 'cvd simulator', 'deuteranopia simulator', 'colorblind image', 'simulate color blindness', 'colorblind palette check'],
  },
  {
    slug: 'deuteranopia-simulator',
    name: 'Deuteranopia Simulator',
    icon: '🟢',
    description: 'Simulate deuteranopia (green-blind) — the most common color blindness — on an image or palette, on-device. Machado 2009 matrices, in your browser.',
    lead: 'See how an image or palette looks with deuteranopia, the most common red-green color-vision deficiency — processed entirely on your device.',
    widget: 'cvd',
    cvdType: 'deuteranopia',
    how: 'Each pixel or swatch is linearised and multiplied by the published Machado (2009) deuteranopia matrix, then converted back to sRGB; a severity slider interpolates toward milder deuteranomaly. Images run on a canvas and are never uploaded.',
    note: 'Deuteranopia (green-weak) is the most common form of color blindness — roughly 6% of men — so it is the first thing to test when red and green carry meaning in a UI or chart.',
    faqs: [
      { q: 'What is deuteranopia?', a: 'Deuteranopia is a red-green color-vision deficiency where the green-sensitive (M) cones are absent, making reds, greens, browns and oranges hard to tell apart. It is the most common type of color blindness.' },
      { q: 'How common is it?', a: 'Deuteranomaly and deuteranopia together affect roughly 6% of men (and far fewer women), making green-weakness the single most prevalent color-vision deficiency.' },
      { q: 'What should I check for?', a: 'That red/green status colors, chart series and success/error states remain distinguishable. If two collapse to the same look, add text, icons or a lightness difference.' },
      { q: 'Is the image uploaded?', a: 'No — it is processed in your browser on a canvas and never sent anywhere.' },
      { q: 'Can I simulate milder green-weakness?', a: 'Yes — the severity slider interpolates between your original and full deuteranopia to approximate deuteranomaly (partial green-weakness).' },
    ],
    keywords: ['deuteranopia simulator', 'deuteranomaly simulator', 'green color blindness', 'red green color blind test image', 'deuteranopia colors'],
  },
  {
    slug: 'protanopia-simulator',
    name: 'Protanopia Simulator',
    icon: '🔴',
    description: 'Simulate protanopia (red-blind) on an image or color palette, on-device, with a severity slider. Machado 2009 matrices, in your browser.',
    lead: 'See how an image or palette looks with protanopia, a red-weak color-vision deficiency — all processed on your device.',
    widget: 'cvd',
    cvdType: 'protanopia',
    how: 'Each pixel or swatch is linearised and multiplied by the published Machado (2009) protanopia matrix, then converted back to sRGB, with a severity slider for milder protanomaly. Images are processed on a canvas and never uploaded.',
    note: 'Protanopia (red-weak) darkens reds and confuses them with greens and browns. Because reds appear dimmer, red warning text on a dark background can nearly vanish — worth testing directly.',
    faqs: [
      { q: 'What is protanopia?', a: 'Protanopia is a red-green color-vision deficiency where the red-sensitive (L) cones are absent. Reds look darker and are easily confused with greens, browns and blacks.' },
      { q: 'How is it different from deuteranopia?', a: 'Both are red-green deficiencies, but protanopia specifically dims reds (red appears much darker), whereas deuteranopia affects greens more and keeps brightness closer to normal.' },
      { q: 'What should I check for?', a: 'Red text or icons on dark backgrounds (they can become very low-contrast) and any red/green distinction. Add non-color cues where meaning depends on red.' },
      { q: 'Is my image private?', a: 'Yes — it is processed on a canvas in your browser and never uploaded.' },
      { q: 'Can I adjust severity?', a: 'Yes — the slider interpolates toward full protanopia to approximate protanomaly (partial red-weakness).' },
    ],
    keywords: ['protanopia simulator', 'protanomaly simulator', 'red color blindness', 'red blind simulator', 'protanopia colors'],
  },
  {
    slug: 'tritanopia-simulator',
    name: 'Tritanopia Simulator',
    icon: '🔵',
    description: 'Simulate tritanopia (blue-yellow color blindness) on an image or palette, on-device, with a severity slider. Machado 2009 matrices, in your browser.',
    lead: 'See how an image or palette looks with tritanopia, a rare blue-yellow color-vision deficiency — processed entirely on your device.',
    widget: 'cvd',
    cvdType: 'tritanopia',
    how: 'Each pixel or swatch is linearised and multiplied by the published Machado (2009) tritanopia matrix, then converted back to sRGB, with a severity slider for milder tritanomaly. Everything runs on a canvas in your browser.',
    note: 'Tritanopia (blue-weak) is rare but affects blues and yellows — the colors many UIs use for links and highlights — so blue/teal or yellow/pink distinctions are the ones to verify.',
    faqs: [
      { q: 'What is tritanopia?', a: 'Tritanopia is a blue-yellow color-vision deficiency where the blue-sensitive (S) cones are absent. Blues and greens, and yellows and pinks, become hard to distinguish. It is much rarer than the red-green types and affects men and women about equally.' },
      { q: 'What should I check for?', a: 'Blue links versus teal, and yellow versus pink or light-green cues. If these collapse, add text or shape cues or widen the lightness gap.' },
      { q: 'How common is tritanopia?', a: 'Very rare — well under 1% of people — but simulating it still catches blue/yellow ambiguities that affect more common conditions and low-light viewing.' },
      { q: 'Is my image uploaded?', a: 'No — it is processed on a canvas in your browser and never sent anywhere.' },
      { q: 'Can I simulate partial blue-weakness?', a: 'Yes — the severity slider approximates tritanomaly by interpolating toward full tritanopia.' },
    ],
    keywords: ['tritanopia simulator', 'tritanomaly simulator', 'blue yellow color blindness', 'blue color blind', 'tritanopia colors'],
  },

  // ---------- Color harmony ----------
  {
    slug: 'color-harmony-generator',
    name: 'Color Harmony Generator',
    icon: '🎡',
    description:
      'Generate complementary, triadic, analogous, split-complementary, tetradic and monochromatic color schemes from any base color — exact hue geometry with HEX, HSL and OKLCH codes. In your browser.',
    lead: 'Enter a base color and get every classic harmony — complementary, triadic, analogous, split-complementary, tetradic and monochromatic — as exact swatches with copyable HEX, HSL and OKLCH codes.',
    widget: 'harmony',
    how: 'Color harmonies are exact rotations on the hue wheel: complementary is +180°, triadic ±120°, analogous ±30°, split-complementary +150°/210°, and tetradic/square +90°/180°/270°; monochromatic varies lightness at a fixed hue. The tool computes each partner hue precisely and shows the resulting colors with HEX, HSL and OKLCH codes to copy.',
    note: 'This computes exact partner hues — it is geometry, not a "suggest a nice palette" guess. Rotations can be taken in OKLCH hue for perceptually even spacing, which keeps a triad or tetrad looking balanced in a way HSL rotations do not.',
    faqs: [
      { q: 'What are color harmonies?', a: 'Harmonies are sets of colors placed at fixed angles on the color wheel: complementary (opposite, 180°), triadic (three colors 120° apart), analogous (neighbours ~30° apart), split-complementary, tetradic and monochromatic. They are the classic starting points for a balanced palette.' },
      { q: 'What is a complementary color?', a: 'The color directly opposite on the wheel — 180° from your base hue. It gives the strongest contrast; the tool computes it exactly and shows its HEX, HSL and OKLCH.' },
      { q: 'What is the difference between triadic and analogous?', a: 'Triadic uses three evenly spaced hues (120° apart) for a vibrant, balanced scheme; analogous uses neighbouring hues (~30° apart) for a calm, cohesive look. The generator shows both from your base color.' },
      { q: 'Why compute harmonies in OKLCH?', a: 'Rotating hue in OKLCH keeps perceived lightness even across the scheme, so a triad or tetrad looks balanced. HSL rotations can make some members look brighter or muddier than others.' },
      { q: 'Can I copy the codes?', a: 'Yes — every swatch shows copyable HEX, HSL and OKLCH values, so you can drop them straight into CSS or a design tool.' },
    ],
    keywords: ['color harmony generator', 'color scheme generator', 'complementary color', 'triadic colors', 'analogous colors', 'color wheel', 'color palette generator'],
  },
  {
    slug: 'complementary-color',
    name: 'Complementary Color Finder',
    icon: '🎨',
    description: 'Find the exact complementary color (180° opposite) of any color, with HEX, HSL and OKLCH codes and a live swatch. Free, in-browser.',
    lead: 'Enter a color and get its exact complementary — the hue directly opposite on the wheel — plus nearby split-complementary options.',
    widget: 'harmony',
    harmonyPreset: 'complementary',
    how: 'The complementary color is the base hue rotated 180° on the color wheel, keeping saturation and lightness. The tool computes it exactly and also shows the split-complementary pair (+150°/210°) for a softer high-contrast option, each with HEX, HSL and OKLCH.',
    note: 'Complementary pairs give the strongest color contrast, which is why they draw the eye — useful for a call-to-action against a base brand color. For a less intense version, the split-complementary neighbours are shown too.',
    faqs: [
      { q: 'What is a complementary color?', a: 'The color directly opposite on the color wheel — the base hue plus 180°. Blue\'s complement is orange; red\'s is cyan-green. Complementary pairs create the highest contrast.' },
      { q: 'How do I find a complementary color?', a: 'Add 180° to the hue. Enter your color and the tool does it exactly, returning the complement in HEX, HSL and OKLCH.' },
      { q: 'What is split-complementary?', a: 'Instead of the exact opposite, it uses the two hues either side of it (+150° and +210°). This keeps strong contrast but is less harsh — the tool shows these as well.' },
      { q: 'Do complementary colors always look good together?', a: 'They contrast strongly, which is powerful but can vibrate at full saturation. Muting one or using it only as an accent usually reads better — adjust lightness in the OKLCH value shown.' },
      { q: 'Is my color uploaded?', a: 'No — the computation is entirely in your browser.' },
    ],
    keywords: ['complementary color', 'complementary color finder', 'opposite color', 'complementary color calculator', 'split complementary'],
  },
  {
    slug: 'triadic-colors',
    name: 'Triadic Color Scheme Generator',
    icon: '🔺',
    description: 'Generate a triadic color scheme — three hues evenly spaced 120° apart — from any base color, with HEX, HSL and OKLCH. Free, in-browser.',
    lead: 'Enter a base color and get its triadic scheme — three vibrant, evenly balanced hues 120° apart — with copyable codes.',
    widget: 'harmony',
    harmonyPreset: 'triadic',
    how: 'A triadic scheme takes three hues spaced 120° apart on the wheel (base, base+120°, base+240°), keeping saturation and lightness. The tool computes the two partner hues exactly and shows all three with HEX, HSL and OKLCH.',
    note: 'Triadic schemes are vibrant yet balanced because the three hues are equidistant. A common approach is to let one dominate and use the other two as accents.',
    faqs: [
      { q: 'What is a triadic color scheme?', a: 'Three colors evenly spaced around the color wheel, 120° apart. It is balanced and vivid — think red, yellow, blue — and works well with one dominant color and two accents.' },
      { q: 'How do I make a triadic palette?', a: 'Take your base hue and add 120° and 240°. Enter a color and the tool returns the exact three-color set in HEX, HSL and OKLCH.' },
      { q: 'When should I use triadic over analogous?', a: 'Use triadic when you want contrast and energy with balance; use analogous (neighbouring hues) when you want a calmer, more unified look.' },
      { q: 'How do I keep a triad from looking garish?', a: 'Let one color lead and mute the other two (lower saturation or adjust lightness). The OKLCH codes make even lightness adjustments easy.' },
      { q: 'Is my color private?', a: 'Yes — everything is computed in your browser.' },
    ],
    keywords: ['triadic colors', 'triadic color scheme', 'triad color generator', 'three color palette', 'triadic color wheel'],
  },
  {
    slug: 'analogous-colors',
    name: 'Analogous Color Scheme Generator',
    icon: '🌈',
    description: 'Generate an analogous color scheme — neighbouring hues ~30° apart — from any base color, with HEX, HSL and OKLCH. Free, in-browser.',
    lead: 'Enter a base color and get its analogous scheme — neighbouring hues about 30° apart — for a calm, cohesive palette.',
    widget: 'harmony',
    harmonyPreset: 'analogous',
    how: 'An analogous scheme uses hues adjacent on the wheel — typically base−30°, base, base+30° (and optionally ±60°) — at the same saturation and lightness. The tool computes the neighbours exactly and shows them with HEX, HSL and OKLCH.',
    note: 'Analogous colors sit next to each other on the wheel, so they blend naturally — the look of a sunset or a forest. Pick one as the dominant color and use the neighbours for support.',
    faqs: [
      { q: 'What is an analogous color scheme?', a: 'A set of colors next to each other on the wheel, usually about 30° apart. Because the hues are close, the palette feels calm and cohesive — common in nature scenes.' },
      { q: 'How do I create an analogous palette?', a: 'Take your base hue and step ±30° (and optionally ±60°). Enter a color and the tool returns the neighbouring hues in HEX, HSL and OKLCH.' },
      { q: 'How is analogous different from triadic?', a: 'Analogous hues are close together for a unified, low-contrast look; triadic hues are 120° apart for a vivid, high-contrast balance.' },
      { q: 'How many analogous colors should I use?', a: 'Three to five works well: one dominant, the rest as support. Vary lightness (see the OKLCH values) to add depth without breaking the harmony.' },
      { q: 'Is my color uploaded?', a: 'No — the computation runs in your browser.' },
    ],
    keywords: ['analogous colors', 'analogous color scheme', 'analogous color generator', 'neighbouring colors', 'analogous palette'],
  },

  // ---------- Image picker + palette, name finder, OKLCH scale ----------
  {
    slug: 'image-color-picker',
    name: 'Image Color Picker & Palette Extractor',
    icon: '🖼️',
    description:
      'Pick any color from an image and extract its dominant palette — HEX, RGB, HSL — plus a screen eyedropper where supported. On-device, nothing uploaded.',
    lead: 'Upload an image, click any pixel to read its exact HEX/RGB/HSL, and get the dominant 6-color palette — all processed on your device.',
    widget: 'imagepicker',
    how: 'The image is drawn to a canvas in your browser. Clicking reads the exact pixel color; the dominant palette is found by median-cut quantization over sampled pixels (recursively splitting the color box with the widest channel range, then averaging each box). Where the browser supports the EyeDropper API, you can also sample any pixel on your whole screen, not just the image.',
    note: 'Two jobs in one page: pick a single color, or pull a whole palette. Because it runs on a canvas in your browser, the image — a screenshot, a mockup, a photo — is never uploaded.',
    faqs: [
      { q: 'How do I pick a color from an image?', a: 'Upload the image and click the pixel you want; the tool reads its exact color and shows the HEX, RGB and HSL, with one-click copy. Everything happens in your browser.' },
      { q: 'How does palette extraction work?', a: 'It uses median-cut quantization: the sampled pixels are repeatedly split along their widest color channel into boxes, and each final box is averaged into one representative color — giving the image\'s dominant palette (6 colors).' },
      { q: 'Can I pick a color from anywhere on my screen?', a: 'Yes, in browsers that support the EyeDropper API (Chrome and Edge). The "Pick from screen" button lets you sample any pixel on your display; other browsers can still pick from an uploaded image.' },
      { q: 'Is my image uploaded?', a: 'No — the image is processed on a canvas in your browser and never sent to a server, which matters for unreleased designs and private photos.' },
      { q: 'What formats work?', a: 'Any image your browser can display — JPG, PNG, WebP, GIF and usually AVIF. Very large images are scaled down for picking, which does not affect the colors.' },
    ],
    keywords: ['image color picker', 'color picker from image', 'palette from image', 'extract colors from image', 'eyedropper', 'get color from photo', 'dominant colors'],
  },
  {
    slug: 'color-name-finder',
    name: 'Color Name Finder',
    icon: '🏷️',
    description:
      'Find the nearest CSS color name for any HEX, RGB or HSL color — by exact CIEDE2000 perceptual distance, with the closest alternatives. Free, in-browser.',
    lead: 'Enter a color and get its nearest CSS color name — measured by CIEDE2000 perceptual distance — plus the next closest matches.',
    widget: 'colorname',
    how: 'Your color and each of the standard CSS Color 4 named colors are converted to CIELAB, then compared with the CIEDE2000 (ΔE00) formula — the industry-standard perceptual color-difference metric. The name with the smallest ΔE is the closest; a ΔE under 1 is an exact match and under ~2.3 is barely distinguishable to the eye.',
    note: 'This is a measurement, not a guess: nearest-of-N by CIEDE2000 is exactly the kind of thing a chatbot gets wrong (it will name a plausible-but-not-nearest color). The set is the frozen, canonical CSS named-color list — no drifting 30,000-name database to maintain.',
    faqs: [
      { q: 'How do I find the name of a color?', a: 'Enter the HEX, RGB or HSL value; the tool measures the perceptual distance (CIEDE2000) from your color to every CSS named color and returns the closest one, plus other near matches.' },
      { q: 'What is ΔE (CIEDE2000)?', a: 'ΔE is the perceptual distance between two colors in CIELAB space; CIEDE2000 is the refined, industry-standard formula. A ΔE of 0 is identical, under ~1 is indistinguishable, and under ~2.3 is a "just noticeable difference".' },
      { q: 'Which color names does it use?', a: 'The canonical CSS Color Module Level 4 named colors (the <named-color> keywords like "dodgerblue", "tomato", "rebeccapurple"), one entry per distinct name. It is a fixed, standard list, so results are stable.' },
      { q: 'Why not match against thousands of names?', a: 'Huge community name lists drift and disagree, which is a maintenance and accuracy liability. Matching the frozen, standard CSS set gives reproducible, citable results that map directly to what you can write in CSS.' },
      { q: 'Is the nearest name always exact?', a: 'Only if your color happens to equal a named color (ΔE 0). Otherwise it is the closest of the standard set — the ΔE shown tells you how close. Use the HEX for the exact color.' },
    ],
    keywords: ['color name finder', 'what color is this hex', 'nearest color name', 'hex to color name', 'name a color', 'css color name'],
  },
  {
    slug: 'tailwind-color-generator',
    name: 'Tailwind Color Scale Generator (OKLCH)',
    icon: '🪜',
    description:
      'Generate a Tailwind-style 50–950 color scale from any base color using a perceptual OKLCH lightness ramp, with @theme and JS-config export. Free, in-browser.',
    lead: 'Turn one base color into a full 50–950 shade scale with an even, perceptual OKLCH lightness ramp — copy it straight into Tailwind 4 @theme or a JS config.',
    widget: 'oklchscale',
    how: 'The base color is converted to OKLCH, then eleven steps (50–950) are generated by setting each step to a target perceptual lightness while keeping the hue and easing chroma down at the light and dark extremes (so the palest and darkest shades do not look garish). Each step is gamut-mapped back to an sRGB HEX. Because the ramp is even in OKLCH lightness, the steps look evenly spaced — which a naive white/black mix does not achieve.',
    note: 'Unlike a simple tint/shade tool that mixes toward white and black in sRGB, this ramps lightness in OKLCH, so a 500 reads as the same weight across every hue — the reason Tailwind CSS 4 uses OKLCH for its default palette. Exports both a Tailwind 4 @theme block (OKLCH) and a HEX JS config.',
    faqs: [
      { q: 'How do I make a Tailwind color scale?', a: 'Enter your brand color and a name; the tool produces the 50–950 steps by ramping perceptual lightness in OKLCH around your color, and gives you a @theme block and a JS config to paste into Tailwind.' },
      { q: 'Why OKLCH instead of lightening/darkening in HEX?', a: 'OKLCH lightness is perceptually uniform, so equal steps look equal and a "500" is the same visual weight across hues. Mixing toward white/black in sRGB produces uneven, sometimes muddy steps — which is why Tailwind 4 switched to OKLCH.' },
      { q: 'What are the 50–950 numbers?', a: 'They are Tailwind\'s shade steps, from the lightest (50) to the darkest (950), with 500 as the mid-tone. This tool maps your base color to that ladder so it drops into a Tailwind theme.' },
      { q: 'Can I export to Tailwind 4?', a: 'Yes — copy the @theme block, which defines --color-<name>-<step> custom properties in OKLCH (Tailwind 4\'s native format). A HEX JS-config object is also provided for older setups.' },
      { q: 'Are the colors always in gamut?', a: 'Yes — any step that would fall outside sRGB is chroma-mapped (keeping lightness and hue) to the nearest displayable HEX, so every swatch renders correctly.' },
    ],
    keywords: ['tailwind color generator', 'tailwind color scale', 'oklch color scale', 'color shades 50 950', 'tailwind palette generator', 'color scale generator'],
  },
];

export function getColorTool(slug: string): ColorToolDef | undefined {
  return COLOR_TOOLS.find((t) => t.slug === slug);
}
