/** Fonts & Typography registry — Unicode text stylers + CSS/type calculators. */

export interface FontToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'fancy' | 'pxrem' | 'typescale' | 'lineheight';
  /** For 'fancy' widgets — which Unicode styles to show (omit = all). */
  styles?: string[];
  placeholder?: string;
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

const ACCESS_FAQ = {
  q: 'Are these fonts accessible?',
  a: 'No — that is the one real drawback. Screen readers announce the underlying Unicode as "mathematical bold" letters or skip them entirely, and search and autocorrect can misread them. Use fancy text for decoration in a bio or name, never for information a reader needs to understand.',
};
const NOT_A_FONT_FAQ = {
  q: 'Is this an actual font?',
  a: 'No. Nothing is installed. The tool swaps each letter for a look-alike Unicode character (mostly from the Mathematical Alphanumeric Symbols block), so the styled text is really just text — which is exactly why it survives being pasted into places that don\'t allow font changes.',
};
const PASTE_FAQ = {
  q: 'Where can I paste it?',
  a: 'Anywhere that accepts Unicode text: Instagram, TikTok and X bios and captions, Discord names, YouTube, WhatsApp and most chat apps, spreadsheets, and document titles. A few older systems strip or box unsupported characters, so preview before you rely on it.',
};

export const FONT_TOOLS: FontToolDef[] = [
  {
    slug: 'font-generator',
    name: 'Fancy Font Generator',
    icon: '🅰️',
    description:
      'Turn plain text into 17 copy-and-paste Unicode font styles — bold, italic, cursive, gothic, bubble, small caps and more — for bios, usernames and captions. Free, in your browser.',
    lead: 'Type once and get every style at once — bold, italic, cursive, gothic, outline, bubble, small caps and more — each with a copy button. Paste them straight into any bio or caption.',
    widget: 'fancy',
    placeholder: 'Type something ✨',
    how: 'The generator maps each letter and digit of your text onto a look-alike Unicode character. Bold, italic and cursive come from the Mathematical Alphanumeric Symbols block; bubble letters, small caps and full-width characters come from their own blocks. Because the result is plain Unicode rather than a font file, it copies and pastes into places that normally strip formatting — social bios, usernames, chat. Everything is generated in your browser as you type.',
    note: 'A few letters in the cursive, gothic and outline styles live in a separate part of Unicode; the generator patches those so you never see an empty box. The honest limitation is accessibility — see the FAQ. If you want to turn styled text back into plain letters, use the fancy-text decoder in the text-tools section.',
    faqs: [
      { q: 'How do I make fancy text to copy and paste?', a: 'Type your text at the top and every style appears below with a Copy button. Click Copy on the one you like and paste it wherever you want — Instagram, Discord, a document title. No sign-up and nothing is uploaded.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
      { q: 'Why do some fancy fonts show boxes on my phone?', a: 'A box (tofu) means your device\'s system font has no glyph for that character. Most modern phones render the common styles fine; very decorative ones like gothic or outline are less widely supported. Pick a style that displays cleanly for you.' },
      ACCESS_FAQ,
      { q: 'Is it free and private?', a: 'Yes — free, no account, and the text never leaves your browser. It even works offline once the page has loaded.' },
    ],
    keywords: ['fancy text generator', 'font generator', 'font generator copy and paste', 'cool text generator', 'fancy fonts', 'stylish text', 'unicode font generator', 'instagram fonts'],
  },
  {
    slug: 'bold-text-generator',
    name: 'Bold Text Generator',
    icon: '𝗕',
    description:
      'Make 𝗯𝗼𝗹𝗱 text you can copy and paste into LinkedIn, Instagram, Facebook and other places that don\'t have a bold button. Unicode, free, in your browser.',
    lead: 'Get 𝗯𝗼𝗹𝗱 (and serif 𝐛𝐨𝐥𝐝) text that pastes anywhere — perfect for making a LinkedIn post or Instagram bio stand out where there\'s no formatting button.',
    widget: 'fancy',
    styles: ['sans-bold', 'serif-bold'],
    placeholder: 'Make this bold',
    how: 'Real bold is a font weight, which most social platforms don\'t let you set. This tool sidesteps that by mapping each letter to its Unicode "mathematical bold" equivalent — a distinct character that already looks bold in any font. The result is plain text, so it keeps its weight when pasted into a LinkedIn post, Instagram caption or Discord message that offers no bold option.',
    note: 'The sans-serif version is the one most people mean by "bold text"; the serif version is heavier and more formal. Because these are separate Unicode letters, a screen reader can\'t tell they\'re bold — good for a headline, not for emphasis that must be understood.',
    faqs: [
      { q: 'How do I make bold text on LinkedIn or Instagram?', a: 'Neither has a bold button, so paste Unicode bold instead: type your text here, copy the bold version, and paste it into your post or bio. It keeps its bold look because each character is a distinct bold glyph, not formatting.' },
      NOT_A_FONT_FAQ,
      { q: 'Why won\'t bold text work in some places?', a: 'A handful of systems normalise or strip these characters, and a few fonts lack the glyphs. It works in the vast majority of social apps and messengers; preview before posting somewhere critical.' },
      ACCESS_FAQ,
      PASTE_FAQ,
    ],
    keywords: ['bold text generator', 'bold text copy paste', 'bold font generator', 'how to make text bold on instagram', 'linkedin bold text', 'bold letters copy paste'],
  },
  {
    slug: 'italic-text-generator',
    name: 'Italic Text Generator',
    icon: '𝘐',
    description:
      'Create 𝘪𝘵𝘢𝘭𝘪𝘤 text to copy and paste into social bios, captions and messages that have no italic option. Unicode-based, free, in your browser.',
    lead: 'Get 𝘪𝘵𝘢𝘭𝘪𝘤 (and serif 𝑖𝑡𝑎𝑙𝑖𝑐) text that pastes into Instagram, X, Discord and anywhere else without an italics button.',
    widget: 'fancy',
    styles: ['sans-italic', 'serif-italic'],
    placeholder: 'Make this italic',
    how: 'Italics are a font style social platforms rarely expose. This tool maps your letters to Unicode "mathematical italic" characters that are slanted by design, so the tilt survives copy-and-paste into any text field. Choose the clean sans-serif italic or the more classic serif italic.',
    note: 'Note the serif italic reuses a couple of special characters where Unicode reserved a slot — the lowercase h becomes ℎ (the same character used for Planck\'s constant) — so it always renders rather than showing a box. As with all Unicode styling, screen readers can\'t detect the italics.',
    faqs: [
      { q: 'How do I write in italics on Instagram?', a: 'Instagram has no italic button, so use Unicode italics: type your text, copy the italic version, and paste it into your caption or bio. Each letter is a slanted Unicode character, so it stays italic.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
      ACCESS_FAQ,
    ],
    keywords: ['italic text generator', 'italic text copy paste', 'italic font generator', 'how to make italic text on instagram', 'slanted text', 'cursive italic copy paste'],
  },
  {
    slug: 'cursive-text-generator',
    name: 'Cursive Text Generator',
    icon: '𝓒',
    description:
      'Turn plain text into 𝓬𝓾𝓻𝓼𝓲𝓿𝓮 script letters to copy and paste into bios, names and captions. Elegant Unicode script, free, in your browser.',
    lead: 'Get elegant 𝒸𝓊𝓇𝓈𝒾𝓋ℯ and bold 𝓬𝓾𝓻𝓼𝓲𝓿𝓮 script text — copy and paste it into an Instagram bio, a wedding-style caption or a fancy username.',
    widget: 'fancy',
    styles: ['script', 'script-bold'],
    placeholder: 'Write in cursive',
    how: 'The generator maps your letters onto Unicode "script" characters — flowing, handwriting-style glyphs. Pick the lighter script or the bolder version. As with other fancy text these are real Unicode characters, so the cursive look pastes into places that offer no font choice at all.',
    note: 'Eleven letters of the plain script style (B, E, F, H, I, L, M, R and the lowercase e, g, o) live in a separate Unicode block; the tool substitutes the correct characters (ℬ, ℰ, ℱ, ℋ…) so words never break into boxes. The bold script has no such gaps.',
    faqs: [
      { q: 'How do I make cursive text to copy and paste?', a: 'Type your text and copy the cursive version — each letter becomes a Unicode script character that keeps its handwriting look when pasted into a bio, caption or username.' },
      { q: 'Is cursive text the same as an italic font?', a: 'No. Italic is an upright font slanted; cursive (script) mimics flowing handwriting with joined, decorative letterforms. This tool offers both — see the italic text generator for slanted text.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
      ACCESS_FAQ,
    ],
    keywords: ['cursive text generator', 'cursive font generator', 'cursive text copy paste', 'script text generator', 'fancy cursive letters', 'handwriting text copy paste'],
  },
  {
    slug: 'small-caps-generator',
    name: 'Small Caps Generator',
    icon: 'ꜱ',
    description:
      'Convert text to ꜱᴍᴀʟʟ ᴄᴀᴘꜱ — uppercase-shaped letters at lowercase height — to copy and paste into bios and captions. Unicode, free, in your browser.',
    lead: 'Turn your text into ꜱᴍᴀʟʟ ᴄᴀᴘꜱ — a refined, understated look where letters have capital shapes at lowercase size. Copy and paste anywhere.',
    widget: 'fancy',
    styles: ['smallcaps'],
    placeholder: 'small caps text',
    how: 'Small caps are capital letter shapes drawn at roughly lowercase height. True small caps are a font feature, but Unicode includes a set of "small capital" letters, so this tool maps your text onto those characters — giving the small-caps look as plain, pasteable text.',
    note: 'Unicode\'s small-capital set is nearly complete but not perfect: there is no true small-cap Q or X, so those two letters are left as-is (a lowercase q and x). Everything else converts cleanly. Screen readers read the result as ordinary letters, which is actually fine here since the shapes still map to the right sounds.',
    faqs: [
      { q: 'How do I make small caps text?', a: 'Type your text and copy the small-caps version. Each letter becomes a Unicode small-capital character, so the elegant uppercase-at-lowercase-height look pastes anywhere.' },
      { q: 'Why are Q and X not in small caps?', a: 'Unicode has no small-capital Q or X, so the tool leaves those two letters unchanged rather than substitute a wrong-looking glyph. Every other letter converts.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
      ACCESS_FAQ,
    ],
    keywords: ['small caps generator', 'small caps text', 'small capitals copy paste', 'small caps font', 'tiny caps text generator', 'smallcaps copy paste'],
  },
  {
    slug: 'bubble-text-generator',
    name: 'Bubble Text Generator',
    icon: 'Ⓑ',
    description:
      'Make Ⓑⓤⓑⓑⓛⓔ text — letters inside circles — to copy and paste into bios, names and captions. Circled Unicode characters, free, in your browser.',
    lead: 'Turn your text into Ⓑⓤⓑⓑⓛⓔ letters — each character inside its own circle — and copy and paste it into any bio, username or caption.',
    widget: 'fancy',
    styles: ['circled'],
    placeholder: 'bubble letters',
    how: 'Each letter and digit is mapped to its "circled" Unicode character — the letter enclosed in a ring. These are standard Unicode symbols, so the bubble look copies and pastes into text fields that don\'t allow any styling.',
    note: 'Circled letters and the digits 1–20 (plus a circled zero) all exist in Unicode, so most text converts cleanly. Punctuation and spaces stay as they are. Rendering varies a little between devices — some draw filled circles, some outlined.',
    faqs: [
      { q: 'How do I make bubble letters to copy and paste?', a: 'Type your text and copy the bubble version — each letter becomes a circled Unicode character that keeps its bubble look when pasted into a bio, name or caption.' },
      { q: 'Do bubble numbers work too?', a: 'Yes — digits become circled numbers (① ② ③ …). Unicode covers 0 through 20 as single circled characters.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
      ACCESS_FAQ,
    ],
    keywords: ['bubble text generator', 'bubble letters copy paste', 'circle text generator', 'circled letters', 'bubble font copy paste', 'letters in circles'],
  },
  {
    slug: 'wide-text-generator',
    name: 'Wide Text Generator (Vaporwave)',
    icon: 'Ｗ',
    description:
      'Create ｗｉｄｅ full-width "vaporwave" text with extra spacing between letters, to copy and paste into bios and captions. Unicode, free, in your browser.',
    lead: 'Turn text into ｗｉｄｅ full-width letters — the spaced-out "vaporwave" aesthetic — and copy and paste it anywhere.',
    widget: 'fancy',
    styles: ['wide'],
    placeholder: 'ａｅｓｔｈｅｔｉｃ',
    how: 'This maps each character to its "full-width" Unicode form — the wide versions originally designed to sit evenly alongside Chinese, Japanese and Korean characters. The extra built-in width gives the airy, retro "vaporwave" spacing, as pasteable plain text.',
    note: 'Full-width covers letters, digits, common punctuation and the space, so most text converts. The look is strongly associated with vaporwave and 80s-retro aesthetics. It takes up noticeably more room, so it suits short phrases better than long paragraphs.',
    faqs: [
      { q: 'How do I make aesthetic / vaporwave text?', a: 'Type your text and copy the wide version — each character becomes its full-width Unicode form, giving the spaced-out aesthetic look. Paste it into a bio, caption or username.' },
      { q: 'Why does wide text have big gaps?', a: 'The characters are "full-width" forms sized to match CJK characters, so each one occupies a wider cell than normal Latin letters. That built-in width is what creates the spacing — you\'re not adding spaces between letters.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
    ],
    keywords: ['wide text generator', 'vaporwave text generator', 'aesthetic text generator', 'full width text', 'spaced out text copy paste', 'ａｅｓｔｈｅｔｉｃ font'],
  },
  {
    slug: 'strikethrough-text-generator',
    name: 'Strikethrough Text Generator',
    icon: 'S̶',
    description:
      'Add a l̶i̶n̶e̶ through your text (or underline it) to copy and paste anywhere — using Unicode combining marks. Free, in your browser.',
    lead: 'Put a line t̶h̶r̶o̶u̶g̶h̶ your text, or u̲n̲d̲e̲r̲l̲i̲n̲e̲ it, and copy and paste it into places with no formatting — chat, bios, spreadsheets.',
    widget: 'fancy',
    styles: ['strike', 'underline'],
    placeholder: 'cross this out',
    how: 'Unlike the other generators, this doesn\'t swap letters — it adds a Unicode "combining" mark after each character: a long stroke overlay for strikethrough, or a low line for underline. The mark draws over or under the letter it follows, so your original text stays fully readable and copies with the line attached.',
    note: 'Because these are combining marks layered onto ordinary letters, the underlying text is unchanged — handy when you want the words to remain searchable and screen-readable while still showing a strike or underline visually. Rendering of the overlay can vary slightly between fonts and apps.',
    faqs: [
      { q: 'How do I make strikethrough text to copy and paste?', a: 'Type your text and copy the strikethrough version. A combining line character is added to each letter, so the crossed-out look pastes into chats, bios and spreadsheets that have no strikethrough button.' },
      { q: 'How is this different from the other fancy fonts?', a: 'The others replace each letter with a look-alike Unicode character. Strikethrough and underline instead keep your real letters and layer a combining mark on top, so the underlying words stay intact and readable.' },
      { q: 'Will strikethrough work everywhere?', a: 'In most apps, yes. A few strip combining marks or render them imperfectly, so preview before relying on it somewhere important.' },
      PASTE_FAQ,
    ],
    keywords: ['strikethrough text generator', 'strikethrough text copy paste', 'cross out text', 'underline text generator', 'line through text', 'crossed out text copy paste'],
  },
  {
    slug: 'px-to-rem-converter',
    name: 'PX to REM Converter',
    icon: '📏',
    description:
      'Convert pixels to rem and em (and back) for CSS, at any root font size, with a live reference table. Free developer tool, runs in your browser.',
    lead: 'Convert px ↔ rem / em for CSS at any root font size — type either value and the other updates, with a quick-reference table for common sizes.',
    widget: 'pxrem',
    how: 'rem and em are relative units: 1rem equals the root font size (16px by default), and 1em equals the current element\'s font size. The conversion is simply value ÷ base for px→rem and value × base for rem→px. Set your root size, type a pixel or rem value, and the converter fills in the other instantly, plus lists common pixel sizes as rem.',
    note: 'Use rem for font sizes and spacing so a user who increases their browser\'s default text size gets a proportionally larger layout — an important accessibility win that fixed pixels break. em behaves the same way but is relative to the element itself, which is useful for things like padding that should scale with a component\'s own font size. The maths is identical; only the reference point changes.',
    faqs: [
      { q: 'How do I convert px to rem?', a: 'Divide the pixel value by the root font size. At the default 16px root, 24px ÷ 16 = 1.5rem. This tool does it as you type and shows a table of common conversions.' },
      { q: 'What is the difference between rem and em?', a: 'rem is relative to the root (html) font size, so it\'s consistent everywhere. em is relative to the current element\'s font size, so it compounds through nested elements. Both convert with the same arithmetic; only the base differs.' },
      { q: 'Why use rem instead of px for fonts?', a: 'Because rem respects the user\'s chosen browser text size, so people who set a larger default get a larger, still-proportional layout. Fixed pixel fonts ignore that preference, which is an accessibility problem.' },
      { q: 'What if my root font size isn\'t 16px?', a: 'Change the root value in the tool and every conversion and the table update to match. Some sites set html { font-size: 62.5% } so 1rem = 10px for easier maths — set the root to 10 for that.' },
    ],
    keywords: ['px to rem', 'px to rem converter', 'rem to px', 'px to em converter', 'pixel to rem calculator', 'css rem calculator', 'font size converter css'],
  },
  {
    slug: 'type-scale-generator',
    name: 'Type Scale Generator',
    icon: '🎚️',
    description:
      'Generate a modular type scale from a base size and ratio — heading sizes in px and rem, with copy-ready CSS custom properties. Free, in your browser.',
    lead: 'Pick a base size and a ratio (major third, perfect fourth, golden ratio…) and get a harmonious set of heading sizes in px and rem, plus copy-ready CSS variables.',
    widget: 'typescale',
    how: 'A modular scale multiplies the base font size by a fixed ratio for each step up, and divides for each step down — so every size relates to the next by the same proportion, the way notes relate on a musical scale. Choose the base (usually your body size) and a ratio, and the tool computes the full set of steps in both px and rem, previews them, and outputs CSS custom properties you can paste into a stylesheet.',
    note: 'Smaller ratios like 1.125 (major second) or 1.25 (major third) keep headings close in size — good for dense UI and dashboards. Larger ratios like 1.333 (perfect fourth) or 1.618 (golden ratio) create dramatic contrast suited to editorial and marketing pages. There is no single right answer; the value of a scale is consistency, so pick one ratio and apply it everywhere.',
    faqs: [
      { q: 'What is a modular type scale?', a: 'A set of font sizes generated by repeatedly multiplying a base size by a fixed ratio. Because each size is proportionally related to the next, the result feels harmonious — like a musical scale for typography.' },
      { q: 'Which ratio should I use?', a: 'Smaller ratios (1.125–1.25) suit dense interfaces where headings shouldn\'t dwarf body text; larger ones (1.333–1.618) give bold editorial contrast. Start with 1.25 (major third) if unsure and adjust to taste.' },
      { q: 'How do I use the CSS output?', a: 'Copy the custom properties (--font-h1, --font-body, …) into your :root and reference them with var(--font-h1). Changing the base or ratio and re-copying updates your whole scale at once.' },
      { q: 'Should the scale use px or rem?', a: 'rem is usually the better choice for font sizes because it respects the user\'s browser text-size setting. The tool gives both; the CSS output uses rem, computed against the root size you set.' },
    ],
    keywords: ['type scale generator', 'modular scale calculator', 'font size scale', 'typography scale', 'heading size calculator', 'css type scale', 'font scale ratio'],
  },
  {
    slug: 'line-height-calculator',
    name: 'Line Height Calculator',
    icon: '📐',
    description:
      'Work out the right line height (leading) for a font size, with a recommended range and a live preview. Free typography tool, runs in your browser.',
    lead: 'Enter a font size and line-height and see the computed spacing in pixels, whether it sits in the comfortable reading range, and a live preview of real text.',
    widget: 'lineheight',
    how: 'Line height is the vertical space each line of text occupies. Set with a unitless number (like 1.5), it means "1.5 times the font size", so it scales automatically with the type. The calculator multiplies your font size by the line-height to show the result in pixels, compares it against the recommended range for that size, and previews a paragraph so you can judge it by eye.',
    note: 'Body text reads best with fairly generous line height — roughly 1.4 to 1.6 — because the eye needs to find the start of each new line without lines crowding together. Large headings can be tighter (around 1.1–1.25), since their few words don\'t need the same guidance and loose spacing looks disconnected. Always prefer a unitless value over a fixed pixel line-height so nested elements inherit sensibly.',
    faqs: [
      { q: 'What is a good line height for body text?', a: 'Around 1.4 to 1.6 (unitless) for paragraph text — generous enough that the eye finds each new line easily without lines feeling far apart. This tool flags whether your value is in range for the size you enter.' },
      { q: 'Should line height have units?', a: 'Prefer a unitless number like 1.5. It means "1.5 × the element\'s font size", so it scales with the type and nested elements inherit a sensible multiple. A fixed pixel line-height doesn\'t adapt when the font size changes.' },
      { q: 'What line height for headings?', a: 'Tighter than body — often 1.1 to 1.25. Large text with only a few words doesn\'t need wide spacing to guide the eye, and generous line height on a heading can look disconnected.' },
      { q: 'How is line height calculated in pixels?', a: 'Multiply the font size by the unitless line-height: 16px text at 1.5 gives a 24px line box. The calculator does this and shows the result alongside the recommended range.' },
    ],
    keywords: ['line height calculator', 'line height css', 'leading calculator', 'best line height for reading', 'line spacing calculator', 'line-height px calculator'],
  },
];

export const getFontTool = (slug: string) => FONT_TOOLS.find((t) => t.slug === slug);
