/** CSS & Design generators — live-preview tools that output copyable CSS. Client-side only. */

export type CssWidget =
  | 'box-shadow'
  | 'border-radius'
  | 'text-shadow'
  | 'filter'
  | 'flexbox'
  | 'grid'
  | 'bezier'
  | 'glass'
  | 'clip-path'
  | 'transform';

export interface CssToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: CssWidget;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const CSS_TOOLS: CssToolDef[] = [
  {
    slug: 'box-shadow-generator',
    name: 'CSS Box Shadow Generator',
    icon: '🌫️',
    description: 'Visually build a CSS box-shadow — offset, blur, spread, color, inset — with a live preview and copyable code. Runs in your browser.',
    lead: 'Drag the sliders to design a box-shadow and copy the CSS. Offset, blur, spread, colour and inset update a live preview instantly.',
    widget: 'box-shadow',
    how: 'The CSS box-shadow property takes up to six values: horizontal offset, vertical offset, blur radius, spread radius, a colour, and the optional inset keyword. This generator exposes each as a control and rebuilds the shorthand live, so you can see exactly how X and Y move the shadow, how blur softens it, how spread grows or shrinks it, and how inset flips the shadow inside the box. It writes valid CSS you can paste straight into a stylesheet, and because everything is computed in your browser, nothing is uploaded.',
    note: 'You can stack multiple shadows by separating them with commas in CSS; this tool builds one layer at a time, which covers the vast majority of real use. For a crisp hairline border effect, use a 0 blur with a small spread; for soft elevation, use a larger blur with a low-opacity colour.',
    faqs: [
      { q: 'What do the box-shadow values mean?', a: 'In order: horizontal offset (right is positive), vertical offset (down is positive), blur radius (higher is softer), spread radius (positive grows the shadow, negative shrinks it), and the colour. Add the inset keyword to draw the shadow inside the element instead of outside.' },
      { q: 'How do I make a soft, realistic shadow?', a: 'Use a small vertical offset, a generous blur, little or no spread, and a semi-transparent black (for example rgba(0,0,0,0.15)). Soft, low-opacity shadows read as natural elevation; hard, dark shadows look artificial.' },
      { q: 'What is an inset box-shadow?', a: 'Inset draws the shadow inside the element\'s box, which is how you create pressed-button, inner-glow or inset-border effects. Toggle the inset option and the preview updates to show the shadow inside the shape.' },
      { q: 'Is the generated CSS cross-browser safe?', a: 'Yes. box-shadow is supported in every modern browser without a vendor prefix. You can paste the output directly; no -webkit- or -moz- prefix is needed for current browsers.' },
      { q: 'Is my design sent anywhere?', a: 'No. The CSS is generated in your browser with JavaScript and never uploaded. It works offline.' },
    ],
    keywords: ['css box shadow generator', 'box shadow generator', 'box-shadow css', 'css shadow generator', 'drop shadow css', 'inset box shadow'],
  },
  {
    slug: 'border-radius-generator',
    name: 'CSS Border Radius Generator',
    icon: '⬜',
    description: 'Round corners visually with per-corner CSS border-radius control and a live preview. Make pills, blobs and cards, then copy the code.',
    lead: 'Round each corner independently and copy the border-radius CSS. The preview updates live, including elliptical corners and organic blob shapes.',
    widget: 'border-radius',
    how: 'border-radius rounds the corners of a box, and it accepts a value per corner, and even two radii per corner (horizontal and vertical) to make elliptical curves. This generator gives you a slider for each corner plus a mode for elliptical radii, then writes the shorthand. Equal values on all corners make a uniform rounded box; a very large value (or 50%) makes a pill or circle; mismatched horizontal and vertical radii make the soft, asymmetric "blob" shapes popular in modern UI. The output is valid CSS generated locally in your browser.',
    note: 'Using percentages makes the radius scale with the element\'s size, which is how you turn any square into a perfect circle with border-radius: 50%. Using pixels keeps the corner the same regardless of size. Mix the two for responsive pills that keep a fixed corner.',
    faqs: [
      { q: 'How do I make a circle with border-radius?', a: 'Apply border-radius: 50% to a square element (equal width and height). The 50% radius on every corner merges into a full circle. For a pill shape on a rectangle, use a large pixel value or 9999px.' },
      { q: 'What are elliptical corners?', a: 'A corner can have two radii: one horizontal, one vertical, written as horizontal / vertical. When they differ, the corner curves as part of an ellipse rather than a circle, which creates softer, asymmetric shapes. This tool lets you set both.' },
      { q: 'How do I make a blob shape?', a: 'Give each corner a different horizontal and vertical radius (the 8-value border-radius form). The mismatched curves produce the organic, lava-lamp blob look. The generator can output this long-form shorthand for you.' },
      { q: 'Does border-radius clip the content inside?', a: 'The border and background are clipped to the rounded shape, but overflowing child content is not clipped unless you also set overflow: hidden on the element. Add that if an image or child needs rounded corners too.' },
      { q: 'Is anything uploaded?', a: 'No. The CSS is built in your browser and nothing is sent to a server.' },
    ],
    keywords: ['css border radius generator', 'border radius generator', 'rounded corners css', 'border-radius css', 'blob generator css', 'css circle border radius'],
  },
  {
    slug: 'text-shadow-generator',
    name: 'CSS Text Shadow Generator',
    icon: '🔤',
    description: 'Design a CSS text-shadow — offset, blur, colour — with a live text preview and copyable code. Make glows, outlines and 3D text.',
    lead: 'Style a text-shadow with offset, blur and colour and copy the CSS. The live preview shows the effect on real text as you adjust it.',
    widget: 'text-shadow',
    how: 'text-shadow works like box-shadow but applies to the glyphs of text: it takes a horizontal offset, a vertical offset, a blur radius, and a colour. This generator previews the effect on sample text and rebuilds the CSS as you change each value. A tight, dark shadow adds depth; a zero-offset coloured blur creates a neon glow; stacking several shadows (which you can do by comma-separating in CSS) can fake an outline or a layered 3D effect. The code is generated locally and never uploaded.',
    note: 'Keep text readable: heavy shadows hurt legibility, especially on small text. For a subtle lift, use a 1px vertical offset and a low-opacity colour. For a glow, set both offsets to 0 and raise the blur with a bright colour.',
    faqs: [
      { q: 'How do I create a neon text glow?', a: 'Set the horizontal and vertical offsets to 0, raise the blur, and use a bright colour. Stacking two or three of these with increasing blur (comma-separated in CSS) intensifies the neon effect.' },
      { q: 'How do I make a text outline with text-shadow?', a: 'Layer four shadows at small offsets (for example -1px -1px, 1px -1px, -1px 1px, 1px 1px) in the same colour, with 0 blur. That approximates an outline. For a true outline, CSS also offers -webkit-text-stroke.' },
      { q: 'What is the difference between text-shadow and box-shadow?', a: 'text-shadow applies to the text characters themselves; box-shadow applies to the element\'s rectangular box. text-shadow has no spread value and no inset keyword.' },
      { q: 'Does text-shadow affect layout?', a: 'No. Like box-shadow, text-shadow is painted and does not take up layout space or push other elements around, so you can add it without reflowing the page.' },
      { q: 'Is my text or CSS uploaded?', a: 'No. Everything is rendered and generated in your browser; nothing is sent anywhere.' },
    ],
    keywords: ['css text shadow generator', 'text shadow generator', 'text-shadow css', 'neon text css', 'glow text css', 'css text outline'],
  },
  {
    slug: 'css-filter-generator',
    name: 'CSS Filter Generator',
    icon: '🎚️',
    description: 'Apply CSS filters — blur, brightness, contrast, grayscale, sepia, hue-rotate, saturate, invert — with a live image preview and copyable code.',
    lead: 'Combine CSS filter functions with sliders and copy the code. Blur, brightness, contrast, grayscale, sepia, hue and more preview live on an image.',
    widget: 'filter',
    how: 'The CSS filter property applies graphical effects to an element: blur(), brightness(), contrast(), grayscale(), sepia(), hue-rotate(), saturate(), invert() and opacity(). This generator gives each a slider, previews them on a sample image, and chains the functions in the order you set them (order matters, since each filter operates on the result of the previous). The output is a ready-to-paste filter declaration, generated entirely in your browser.',
    note: 'Filters are applied in sequence, so grayscale() then sepia() looks different from sepia() then grayscale(). Blur can be expensive to animate; prefer transform and opacity for smooth animation. The same functions also work in the backdrop-filter property to blur whatever sits behind a translucent element.',
    faqs: [
      { q: 'What filter functions can I combine?', a: 'blur, brightness, contrast, grayscale, sepia, hue-rotate, saturate, invert and opacity. You can chain as many as you like in one filter declaration; they apply left to right.' },
      { q: 'How do I make an image black and white?', a: 'Use grayscale(100%). For a vintage look, combine sepia() with a slight contrast() and brightness() adjustment. The tool previews each on a sample image so you can dial it in.' },
      { q: 'What is the difference between filter and backdrop-filter?', a: 'filter affects the element itself; backdrop-filter affects whatever is visible behind the element (used for frosted-glass effects on translucent panels). The same functions work in both.' },
      { q: 'Does filter order matter?', a: 'Yes. Each function operates on the output of the previous one, so rearranging them changes the result. The generator applies them in the order shown.' },
      { q: 'Is my image uploaded?', a: 'No. The preview uses a built-in sample and the CSS is generated locally; nothing you do is sent to a server.' },
    ],
    keywords: ['css filter generator', 'css filter', 'css blur generator', 'css grayscale', 'backdrop filter css', 'css image filter'],
  },
  {
    slug: 'flexbox-generator',
    name: 'CSS Flexbox Generator',
    icon: '📏',
    description: 'Build a flex container visually — direction, justify-content, align-items, wrap, gap — with a live preview and copyable CSS. Learn flexbox by seeing it.',
    lead: 'Set flex-direction, justify-content, align-items, wrap and gap and watch items rearrange live. Copy the container CSS when it looks right.',
    widget: 'flexbox',
    how: 'Flexbox lays out items along a main axis and a cross axis. This generator exposes the container properties that do the work: flex-direction (which axis is the main one), justify-content (spacing along the main axis), align-items (alignment on the cross axis), flex-wrap (whether items wrap to new lines), and gap (space between items). Changing any control rearranges a set of sample items in the live preview and rewrites the CSS, so you can learn flexbox by watching rather than memorising. The generated code is standard CSS produced in your browser.',
    note: 'The single most common confusion in flexbox is that justify-content and align-items swap axes when you change flex-direction: with row, justify-content is horizontal; with column, it becomes vertical. The live preview makes this obvious. For per-item control (flex-grow, order) you add properties to the children, which you can do after copying the container CSS.',
    faqs: [
      { q: 'How do I centre something with flexbox?', a: 'On the container, set display: flex, justify-content: center and align-items: center. That centres the child on both axes. The generator produces exactly this when you pick centre for both.' },
      { q: 'What is the difference between justify-content and align-items?', a: 'justify-content positions items along the main axis; align-items positions them along the cross axis. Which direction each one controls depends on flex-direction, so they swap when you switch between row and column.' },
      { q: 'When should I use flexbox vs grid?', a: 'Flexbox is best for one-dimensional layouts (a row or a column of items), like navbars and toolbars. CSS Grid is best for two-dimensional layouts (rows and columns together), like page or card grids. Use the one that matches your layout.' },
      { q: 'What does flex-wrap do?', a: 'By default flex items stay on one line and shrink to fit (nowrap). flex-wrap: wrap lets them flow onto new lines when they run out of room, which is how responsive item grids are built with flexbox.' },
      { q: 'Is the CSS generated locally?', a: 'Yes. Everything runs in your browser; nothing is uploaded.' },
    ],
    keywords: ['css flexbox generator', 'flexbox generator', 'flexbox playground', 'flex css generator', 'justify content align items', 'css flex layout'],
  },
  {
    slug: 'css-grid-generator',
    name: 'CSS Grid Generator',
    icon: '🔲',
    description: 'Create a CSS Grid layout visually — set columns, rows and gaps — and copy grid-template code. Live preview of the tracks and cells.',
    lead: 'Choose the number of columns and rows, set their sizes and the gap, and copy the grid CSS. The preview shows the tracks and cells live.',
    widget: 'grid',
    how: 'CSS Grid builds two-dimensional layouts from columns and rows called tracks. This generator lets you set how many columns and rows you want, size each track (in fr units, pixels or auto), and set the gap between cells, then it writes the grid-template-columns, grid-template-rows and gap declarations. The fr unit is the key idea: it distributes leftover space in fractions, so 1fr 2fr makes the second column twice as wide as the first. The preview renders the grid so you can see the tracks before you copy the code, all in your browser.',
    note: 'For a responsive grid that fits as many columns as will fit, use repeat(auto-fit, minmax(200px, 1fr)) instead of a fixed count, a pattern this tool can produce. Grid handles the overall page or card structure; use flexbox inside individual cells for one-dimensional alignment.',
    faqs: [
      { q: 'What is the fr unit in CSS Grid?', a: 'fr means "fraction of the remaining space." A track of 1fr takes one share of the leftover space after fixed sizes are subtracted; 1fr 2fr splits remaining space one-third and two-thirds. It is the cleanest way to size flexible grid columns.' },
      { q: 'How do I make a responsive grid without media queries?', a: 'Use grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)). The grid fits as many 200px-minimum columns as the width allows and stretches them to fill, reflowing automatically as the screen changes.' },
      { q: 'What is the difference between CSS Grid and Flexbox?', a: 'Grid is two-dimensional (columns and rows at once), ideal for page layouts and card grids. Flexbox is one-dimensional (a single row or column), ideal for navbars and toolbars. They work well together.' },
      { q: 'How do I set the gap between grid items?', a: 'Use the gap property (formerly grid-gap), for example gap: 16px, or row-gap and column-gap separately. The generator includes a gap control and writes it into the output.' },
      { q: 'Is my layout uploaded?', a: 'No. The grid CSS is generated in your browser and never sent anywhere.' },
    ],
    keywords: ['css grid generator', 'grid generator', 'css grid layout', 'grid template columns', 'grid-template generator', 'responsive grid css'],
  },
  {
    slug: 'cubic-bezier-generator',
    name: 'CSS Cubic Bezier Generator',
    icon: '📈',
    description: 'Craft a CSS easing curve with cubic-bezier control points, preview the motion live, and copy the transition-timing-function. Includes common presets.',
    lead: 'Tune the four cubic-bezier control points or pick a preset, watch the motion preview, and copy the easing for your CSS transition.',
    widget: 'bezier',
    how: 'An easing function controls how an animation accelerates and decelerates over its duration. CSS defines custom easing with cubic-bezier(x1, y1, x2, y2), four numbers that place two control points shaping a curve from start to finish. This generator lets you set those points (or start from presets like ease, ease-in-out, or a springy overshoot), draws the curve, and runs a live motion preview so you can feel the difference. The output is a transition-timing-function value you can paste directly. Everything computes in your browser.',
    note: 'The x values must stay between 0 and 1 (time cannot run backwards), but y values can go below 0 or above 1 to create anticipation and overshoot, the bouncy, lifelike motion that flat easings lack. Good easing is often the difference between an interface that feels cheap and one that feels polished.',
    faqs: [
      { q: 'What is cubic-bezier in CSS?', a: 'cubic-bezier(x1, y1, x2, y2) defines a custom easing curve for transitions and animations using two control points. It lets you go beyond the named keywords (ease, linear, ease-in, ease-out, ease-in-out) to craft any acceleration profile you want.' },
      { q: 'How do I make a bouncy or springy easing?', a: 'Push a control point\'s y value above 1 (or below 0) so the curve overshoots its target and settles back. For example cubic-bezier(.68,-0.55,.27,1.55) overshoots at both ends. The preview shows the bounce.' },
      { q: 'What are the default CSS easing keywords?', a: 'linear (constant speed), ease (slow start and end, the default), ease-in (slow start), ease-out (slow end), and ease-in-out (slow start and end). Each maps to a specific cubic-bezier, which this tool can show and let you customise.' },
      { q: 'Where do I use the generated value?', a: 'In transition-timing-function or animation-timing-function, for example transition: transform 300ms cubic-bezier(.4,0,.2,1). The generator gives you the cubic-bezier() part to drop in.' },
      { q: 'Is anything sent to a server?', a: 'No. The curve and preview run entirely in your browser.' },
    ],
    keywords: ['cubic bezier generator', 'css easing generator', 'cubic-bezier css', 'transition timing function', 'css animation easing', 'ease in out curve'],
  },
  {
    slug: 'glassmorphism-generator',
    name: 'CSS Glassmorphism Generator',
    icon: '🧊',
    description: 'Create a frosted-glass card with CSS backdrop-filter blur, transparency and border, with a live preview and copyable code.',
    lead: 'Design a frosted-glass panel, blur, transparency, border and shadow, and copy the CSS. The preview shows the glass over a colourful background.',
    widget: 'glass',
    how: 'Glassmorphism is the frosted-glass look: a translucent panel that blurs whatever sits behind it. The effect comes from a semi-transparent background colour plus backdrop-filter: blur(), usually with a subtle light border and a soft shadow to lift the panel. This generator exposes the blur amount, background transparency, border and radius, previews the panel over a colourful backdrop so the blur is visible, and writes the CSS. It is generated in your browser and ready to paste.',
    note: 'backdrop-filter needs something behind the element to blur, so the effect only shows over content or a busy background, not over a plain flat colour that matches the panel. Some browsers historically needed the -webkit-backdrop-filter prefix; the generator can include it for wider support. Heavy blur can affect performance on large areas.',
    faqs: [
      { q: 'What is glassmorphism?', a: 'Glassmorphism is a UI style of frosted-glass panels: translucent backgrounds that blur the content behind them, with a thin light border and soft shadow. It creates depth and a premium, layered feel, popularised by modern operating systems.' },
      { q: 'How is the frosted-glass effect made in CSS?', a: 'With a semi-transparent background (for example rgba(255,255,255,0.15)) plus backdrop-filter: blur(10px). The blur frosts whatever is behind the panel; the transparency lets colour through; a 1px light border and soft shadow complete the look.' },
      { q: 'Why is my glass effect not showing?', a: 'backdrop-filter only blurs content behind the element. If the panel sits over a plain colour with nothing behind it, there is nothing to blur. Place it over an image or busy background, and make sure the background colour is actually semi-transparent.' },
      { q: 'Does backdrop-filter work in all browsers?', a: 'It is supported in all current major browsers, though some older versions needed the -webkit-backdrop-filter prefix. The generator can output both for maximum compatibility.' },
      { q: 'Is my design uploaded?', a: 'No. The CSS is generated locally in your browser.' },
    ],
    keywords: ['glassmorphism generator', 'css glassmorphism', 'frosted glass css', 'backdrop filter blur', 'glass effect css', 'glassmorphism css generator'],
  },
  {
    slug: 'clip-path-generator',
    name: 'CSS Clip Path Generator',
    icon: '✂️',
    description: 'Clip elements into shapes with CSS clip-path — polygons, circles, triangles and more — with a live preview and copyable code.',
    lead: 'Pick a shape or polygon and clip an element to it, then copy the clip-path CSS. The preview shows the clipped shape live.',
    widget: 'clip-path',
    how: 'clip-path hides everything outside a defined shape, so a rectangular element can appear as a triangle, hexagon, star, circle or custom polygon. This generator offers ready shapes plus adjustable polygon points, previews the clip on a sample element, and writes the clip-path value. Polygon shapes are defined as a list of X Y percentage points; circles and ellipses use a radius and position. The output is standard CSS produced in your browser, with the original box still taking its normal layout space.',
    note: 'clip-path changes what is painted, not the element\'s layout box, so surrounding content still flows around the original rectangle. Clipped edges are crisp and scale cleanly because they are vector-defined. For interactive hit areas, note that clicks still register on the clipped-away corners unless you also adjust pointer handling.',
    faqs: [
      { q: 'What is clip-path in CSS?', a: 'clip-path defines a region of an element to show; everything outside that region is hidden. With the polygon(), circle(), ellipse() and inset() functions you can clip an element into triangles, hexagons, stars, circles and custom shapes without images.' },
      { q: 'How do I make a triangle with clip-path?', a: 'Use polygon() with three points, for example clip-path: polygon(50% 0, 0 100%, 100% 100%) for an upward triangle. The generator lets you pick a triangle preset and copy the code.' },
      { q: 'Does clip-path affect the element\'s layout?', a: 'No. It changes what is painted, not the layout box, so other elements still flow around the original rectangle\'s dimensions. Add margins if you need spacing around the visible shape.' },
      { q: 'Can I animate clip-path?', a: 'Yes, between shapes with the same number of points (for polygons), which enables reveal and morph animations. Keep point counts equal for smooth transitions.' },
      { q: 'Is my shape uploaded?', a: 'No. The clip-path CSS is generated in your browser and never sent to a server.' },
    ],
    keywords: ['clip path generator', 'css clip-path generator', 'clip path css', 'css shapes generator', 'polygon clip path', 'css triangle clip path'],
  },
  {
    slug: 'css-transform-generator',
    name: 'CSS Transform Generator',
    icon: '🔄',
    description: 'Build a CSS transform — translate, rotate, scale, skew — with a live preview and copyable code, including 2D and basic 3D rotation.',
    lead: 'Combine translate, rotate, scale and skew and watch an element transform live, then copy the CSS transform declaration.',
    widget: 'transform',
    how: 'The CSS transform property moves, rotates, resizes and skews an element without affecting document flow. This generator exposes translateX/Y, rotate, scale and skew as controls, applies them in order to a sample element, and writes the combined transform value. Because transforms are composited by the browser, they are the smooth, GPU-friendly way to animate position and size, far better than animating top/left or width/height. The generated CSS runs in your browser and is ready to paste.',
    note: 'Transform order matters: rotate then translate moves along the rotated axes, while translate then rotate moves first and spins in place. The transform-origin property (default centre) sets the pivot point for rotate and scale. Transforms do not change layout, so neighbours do not move when an element scales or rotates.',
    faqs: [
      { q: 'In what order are CSS transforms applied?', a: 'Left to right, and order changes the result: transform: rotate(45deg) translateX(100px) moves along the rotated axis, whereas translateX(100px) rotate(45deg) moves first then spins in place. The generator applies functions in the order shown.' },
      { q: 'Why use transform instead of changing top/left?', a: 'Transforms are composited on the GPU and do not trigger layout, so animating them is smooth and cheap. Animating top, left, width or height forces the browser to recalculate layout every frame, which is slower and can jank.' },
      { q: 'What is transform-origin?', a: 'transform-origin sets the pivot point for rotate and scale, defaulting to the element\'s centre (50% 50%). Move it to a corner to rotate or scale around that corner instead.' },
      { q: 'Can I do 3D transforms?', a: 'Yes, with rotateX, rotateY, rotateZ and perspective. This generator focuses on common 2D transforms plus basic rotation; add perspective on the parent for a 3D effect.' },
      { q: 'Is anything uploaded?', a: 'No. The transform CSS is generated locally in your browser.' },
    ],
    keywords: ['css transform generator', 'transform generator', 'css rotate scale translate', 'css skew generator', 'transform css', 'css 2d transform'],
  },
];
