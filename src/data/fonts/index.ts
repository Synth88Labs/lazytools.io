/** Fonts & Typography registry — Unicode text stylers + CSS/type calculators. */

export interface FontToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'fancy' | 'pxrem' | 'typescale' | 'lineheight' | 'zalgo' | 'blank' | 'symbols' | 'discord' | 'clamp' | 'repeater' | 'mirror' | 'lenny' | 'gradient' | 'measure' | 'ascii' | 'fontinspect';
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
  {
    slug: 'superscript-subscript-generator',
    name: 'Superscript & Subscript Generator',
    icon: 'ˣ',
    description:
      'Convert text and numbers to Unicode superscript (ˣ⁷) and subscript (ₓ₇) you can copy and paste anywhere — footnotes, x², H₂O, citations. Free, in your browser.',
    lead: 'Turn text into superscript (ᵗⁱⁿʸ ᵃᵇᵒᵛᵉ) and subscript (below the line) — copy and paste it into places with no formatting: footnotes, chemistry like H₂O, maths like x², references and social posts.',
    widget: 'fancy',
    styles: ['superscript', 'subscript'],
    placeholder: 'H2O x2 e=mc2',
    how: 'Unicode already contains small raised and lowered versions of most letters and all digits — designed for phonetics, maths and notation. This tool maps each character you type onto its superscript or subscript equivalent, so the result is plain, pasteable text rather than a font effect. It works in fields that offer no formatting at all.',
    note: 'The catch is coverage: Unicode has a superscript for nearly every letter and digit, but its subscript set is small — only a handful of letters (a, e, h, i, j, k, l, m, n, o, p, r, s, t, u, v, x) plus all digits and a few symbols. Characters with no small form are left unchanged so words never turn into boxes.',
    faqs: [
      { q: 'How do I make superscript or subscript text to copy and paste?', a: 'Type your text and copy the superscript or subscript version. Each character becomes a raised or lowered Unicode character, so the notation pastes into documents, chats and posts that have no formatting button.' },
      { q: 'Why are some subscript letters missing?', a: 'Unicode only defines subscript forms for a limited set of letters. Where no subscript character exists, the tool leaves the original letter as-is rather than substitute a wrong-looking one. Superscript coverage is much more complete.' },
      { q: 'Can I use this for chemical formulas and exponents?', a: 'Yes — subscript digits give you H₂O and CO₂, and superscript digits give you x², m³ or E=mc². Because they are real characters, they stay correct when pasted into email, forums or spreadsheets.' },
      NOT_A_FONT_FAQ,
      ACCESS_FAQ,
    ],
    keywords: ['superscript generator', 'subscript generator', 'superscript copy paste', 'subscript text', 'tiny text generator', 'x squared symbol', 'h2o subscript'],
  },
  {
    slug: 'glitch-text-generator',
    name: 'Glitch Text Generator (Zalgo)',
    icon: 'Z̸',
    description:
      'Create glitchy, cursed "Zalgo" text with an adjustable madness slider, then copy and paste it anywhere. Free Unicode glitch generator, in your browser.',
    lead: 'Turn plain words into glitchy, corrupted "Zalgo" text — drag the madness slider for more or less chaos, choose up/mid/down marks, and copy and paste the cursed result anywhere.',
    widget: 'zalgo',
    how: 'Zalgo text works by stacking Unicode "combining marks" — the accents and diacritics normally used to modify a letter — on top of each character, many at a time. Piling them above, through and below each letter creates the dripping, glitched look. The madness slider controls how many marks are added; the up/mid/down toggles choose where they stack. Everything is generated in your browser.',
    note: 'Because it is built from real combining characters, the glitch survives copy-and-paste — but some apps cap how many marks they render, so very intense settings can look calmer once pasted, and a few platforms strip combining marks entirely. It is decorative only: screen readers and search cannot make sense of it, so never use it for anything that must be read.',
    faqs: [
      { q: 'What is Zalgo or glitch text?', a: 'Text that has many Unicode combining marks stacked on each letter, giving a creepy, corrupted, "glitching" appearance. It is popular for horror aesthetics, edgy usernames and memes.' },
      { q: 'How do I make cursed text to copy and paste?', a: 'Type your text, set the madness slider, and copy the result. The glitch is made of real characters, so it pastes into bios, chats and posts — though some apps tone it down or strip the marks.' },
      { q: 'Why does my glitch text look less intense after pasting?', a: 'Some platforms limit how many combining marks they display per character for performance, so extreme settings render more calmly there. Lower the madness a little if you want a consistent look across apps.' },
      NOT_A_FONT_FAQ,
      ACCESS_FAQ,
    ],
    keywords: ['glitch text generator', 'zalgo text', 'cursed text generator', 'creepy text', 'corrupted text generator', 'glitchy text copy paste', 'scary text'],
  },
  {
    slug: 'invisible-name-generator',
    name: 'Invisible Text & Blank Name Generator',
    icon: '⬚',
    description:
      'Copy an invisible character for a blank username, bio or message — for Free Fire, WhatsApp, Discord and more. Free, in your browser, nothing uploaded.',
    lead: 'Copy an invisible / blank character to use as an empty username, bio or "silent" message in Free Fire, WhatsApp, Discord and other apps — pick a type and length, then copy.',
    widget: 'blank',
    how: 'Some Unicode characters take up a name slot but render as nothing — the Hangul filler (U+3164), the empty braille cell (U+2800), zero-width and no-break spaces. Apps that reject an ordinary blank space often still accept one of these, so you can set an "empty" name or send a blank message. Pick a character type and how many to string together, then copy.',
    note: 'This is the exact opposite of the invisible-character detector in the text-tools section — one hides these characters, the other finds them. Platform rules change often and some apps trim or block blank names, so if one type is rejected, try another; the Hangul filler is accepted most widely.',
    faqs: [
      { q: 'How do I get a blank or invisible name?', a: 'Copy an invisible character here (the Hangul filler works most widely) and paste it as your username or nickname. The app sees a valid character, but nothing is drawn — so the name looks empty.' },
      { q: 'Why doesn\'t a normal space work for a blank name?', a: 'Most apps trim leading and trailing spaces, so a plain space collapses to nothing and gets rejected. Invisible characters like the Hangul filler are not treated as whitespace, so they survive the trim.' },
      { q: 'Which app is this for — Free Fire, WhatsApp, Discord?', a: 'All of them and more. The technique is generic; support varies by app and changes over time. If one character type is blocked, try a different one from the list.' },
      { q: 'Is it really invisible?', a: 'It has no visible glyph, though some characters occupy a small width. The text is still there in the data — it just isn\'t drawn on screen.' },
    ],
    keywords: ['invisible name', 'blank name copy paste', 'invisible character', 'free fire invisible space', 'empty character copy paste', 'blank text', 'invisible text generator'],
  },
  {
    slug: 'symbols-copy-paste',
    name: 'Symbols & Special Characters (Copy Paste)',
    icon: '★',
    description:
      'Browse and copy cool text symbols — arrows, stars, hearts, currency, math, shapes, brackets and more. One click to copy any special character. Free, in your browser.',
    lead: 'Click any symbol to copy it — arrows, stars, hearts, currency, maths, shapes, brackets and more. A clean, searchable picker for the special characters your keyboard doesn\'t have.',
    widget: 'symbols',
    how: 'Every symbol here is a standard Unicode character, grouped into categories so you can find one fast. Click it and it goes to your clipboard, ready to paste into a document, bio, message or spreadsheet. Filter the categories with the search box if you know roughly what you want.',
    note: 'Unlike the Unicode inspector (which looks up a character you already have), this is a browse-and-copy palette for characters you don\'t. A few symbols render in colour or slightly differently depending on your device\'s fonts — pick one that displays cleanly for you before relying on it.',
    faqs: [
      { q: 'How do I copy and paste symbols?', a: 'Click any symbol in the grid and it\'s copied to your clipboard. Then paste it wherever you like — no keyboard shortcuts or character maps needed.' },
      { q: 'Are these symbols safe to use in usernames and bios?', a: 'Mostly yes — they\'re standard Unicode. Some platforms restrict certain characters, and rendering varies by device, so preview before you rely on a particular one.' },
      { q: 'Why does a symbol look different on my phone?', a: 'Each device draws Unicode with its own system fonts, so a symbol can appear bolder, thinner or in colour (for emoji-style characters). The underlying character is the same everywhere.' },
      { q: 'Do I need to install anything?', a: 'No. Everything is standard Unicode and runs in your browser — click, copy, paste. Nothing is uploaded.' },
    ],
    keywords: ['copy paste symbols', 'cool symbols', 'text symbols', 'special characters copy paste', 'heart symbol copy paste', 'star symbol', 'arrow symbols', 'symbols copy and paste'],
  },
  {
    slug: 'discord-colored-text-generator',
    name: 'Discord Colored Text Generator',
    icon: '🎨',
    description:
      'Make colored text for Discord using ANSI code blocks — pick text and background colours, bold and underline, then copy the block to paste. Free, in your browser.',
    lead: 'Give your Discord messages colour: pick a text colour, background, bold and underline, preview it, and copy a ready-made ANSI code block to paste straight into chat.',
    widget: 'discord',
    how: 'Discord has no colour button, but its desktop and web apps render a special "ansi" code block using terminal colour codes. This tool wraps your text in the right escape sequences and fenced code block, so pasting the copied output shows up coloured. Choose from Discord\'s eight text colours and backgrounds, plus bold and underline, and the preview mirrors how it will look.',
    note: 'The escape character that makes this work can\'t be typed on a normal keyboard, which is why a generator is needed — the copied block already includes it. One limitation is platform: ANSI colour only renders in the Discord desktop and browser apps; the mobile app shows the text without colour. It is deterministic — the same choices always produce the same code.',
    faqs: [
      { q: 'How do I make colored text in Discord?', a: 'Discord reads colour from an "ansi" code block. Pick your colours here, copy the generated block, and paste it into a Discord message — it renders coloured on desktop and web.' },
      { q: 'Why isn\'t my colored text showing on mobile?', a: 'The Discord mobile app doesn\'t render ANSI colour code blocks yet, so it shows the plain text instead. Colour appears on the desktop and browser apps.' },
      { q: 'Why can\'t I just type the colour codes myself?', a: 'The codes start with an invisible ESC (escape) character that isn\'t on your keyboard. The generator inserts it for you, which is the whole reason a tool is needed.' },
      { q: 'Is my message text sent anywhere?', a: 'No. The code block is built entirely in your browser; nothing you type is uploaded.' },
    ],
    keywords: ['discord colored text', 'discord text color generator', 'discord ansi color', 'colored text discord', 'discord color codes', 'how to color text in discord'],
  },
  {
    slug: 'css-clamp-generator',
    name: 'CSS clamp() Fluid Typography Generator',
    icon: '🔡',
    description:
      'Generate a responsive CSS clamp() font-size that scales smoothly between two viewport widths, with a live preview. Free developer tool, runs in your browser.',
    lead: 'Set a min and max font size and the viewport range they map to, and get a copy-ready CSS clamp() that scales type smoothly between them — with a live preview at any screen width.',
    widget: 'clamp',
    how: 'clamp(MIN, PREFERRED, MAX) returns the preferred value but never below MIN or above MAX. For fluid type, the preferred value is a straight line between your two (viewport, font-size) points, written as a vw term plus a rem offset. The tool solves that line — slope and intercept — from your inputs and formats the result, so the font grows with the screen and then locks at each end.',
    note: 'Including a rem in the preferred value (not just vw) matters for accessibility: a pure-vw font ignores the user\'s browser zoom, while the rem part keeps it responsive to their text-size setting. The maths is exact linear interpolation, so the output is deterministic. Pair this with the px-to-rem, type-scale and line-height tools for a complete CSS typography setup.',
    faqs: [
      { q: 'What does CSS clamp() do for font size?', a: 'It sets a fluid size that scales with the viewport between a minimum and maximum. Below your min viewport it stays at the min size; above your max viewport it stays at the max; in between it interpolates smoothly — no media queries needed.' },
      { q: 'Why does the clamp value include both vw and rem?', a: 'The vw part makes the font scale with screen width; the rem part is an offset that also keeps the size responsive to the user\'s zoom / default text size. A vw-only value would break that accessibility behaviour.' },
      { q: 'How is the middle (preferred) value calculated?', a: 'It\'s the equation of the line through your two points (min viewport, min size) and (max viewport, max size). The slope becomes the vw coefficient and the intercept becomes the rem offset.' },
      { q: 'Do I still need media queries?', a: 'Usually not for the font size itself — clamp() handles the smooth scaling. You might still use queries for layout changes, but the type resizes on its own.' },
    ],
    keywords: ['css clamp generator', 'fluid typography', 'clamp calculator', 'responsive font size css', 'clamp font size', 'css clamp font', 'fluid type scale'],
  },
  {
    slug: 'emoji-letters-generator',
    name: 'Emoji Letters Generator',
    icon: '🅰️',
    description:
      'Turn text into 🇦-style regional-indicator and 🅰-style squared emoji letters to copy and paste into Discord, Instagram and games. Free, in your browser.',
    lead: 'Spell words with emoji letters — 🇧🇮🇬 regional-indicator (flag-style) letters and 🅱🅾🆇 squared emoji letters — then copy and paste them into Discord, Instagram or a username.',
    widget: 'fancy',
    styles: ['regional', 'squared'],
    placeholder: 'BIG LETTERS',
    how: 'Two Unicode letter sets look like emoji: "regional indicators" (the A–Z symbols normally combined into flags) and "negative squared" letters (white letters on a coloured tile). This tool maps each letter of your text onto both, so you get big, blocky, emoji-style lettering as plain pasteable characters.',
    note: 'These only cover A–Z, so digits, spaces and punctuation pass through unchanged. A quirk of regional indicators: two that happen to form a real country code can merge into a flag in some apps — usually harmless, occasionally surprising. They render largest and most reliably on Discord and mobile.',
    faqs: [
      { q: 'How do I make big emoji letters for Discord?', a: 'Type your word and copy the squared or regional-indicator version — each letter becomes an emoji-style tile that shows up large in Discord and many chat apps.' },
      { q: 'What\'s the difference between the two styles?', a: 'Regional indicators are the flag-style letters (🇦 🇧 🇨); squared letters are white glyphs on a coloured square (🅰 🅱). Both spell out A–Z; pick whichever looks better where you\'re pasting.' },
      { q: 'Why did two of my letters turn into a flag?', a: 'Regional indicators are the same characters used to build flag emoji. If two adjacent letters form a valid country code, some apps merge them into that flag. It only affects certain letter pairs.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
    ],
    keywords: ['emoji letters', 'regional indicator generator', 'text to emoji', 'discord emoji letters', 'big letter emoji', 'squared letters copy paste', 'emoji text generator'],
  },
  {
    slug: 'text-repeater',
    name: 'Text Repeater',
    icon: '🔁',
    description:
      'Repeat any text or phrase as many times as you want, with a choice of separators and optional numbering. Copy the result instantly. Free, in your browser.',
    lead: 'Repeat a word or phrase as many times as you like — choose a separator (new line, space, comma or your own), optionally number each line, and copy the result in one click.',
    widget: 'repeater',
    how: 'Type your text, set a count, and the tool joins that many copies together with the separator you choose. It\'s handy for filling test data, padding a field, making a list, or the classic repeated-message joke. Everything is generated in your browser, up to 10,000 repeats.',
    note: 'Choosing "new line" gives you a vertical list; "nothing" concatenates the copies directly; "comma" builds a quick comma-separated list. The optional numbering prefixes each copy with its position, which is useful for generating ordered placeholder content.',
    faqs: [
      { q: 'How do I repeat text multiple times?', a: 'Enter your text, set how many times to repeat it, pick a separator, and copy the result. The tool builds the repeated string instantly — no spreadsheet formulas needed.' },
      { q: 'Can I put each repeat on its own line?', a: 'Yes — choose the "New line" separator and every copy goes on a separate line. Other options include space, comma, nothing, or a custom separator you type.' },
      { q: 'Is there a limit?', a: 'You can repeat up to 10,000 times, which is plenty for test data or lists while staying fast in the browser.' },
      { q: 'What is this useful for?', a: 'Generating placeholder or test data, filling a form field to a length, quickly building a delimited list, or sending a repeated message for fun.' },
    ],
    keywords: ['text repeater', 'repeat text', 'repeat text generator', 'repeat string online', 'duplicate text', 'repeat word multiple times'],
  },
  {
    slug: 'mirror-text-generator',
    name: 'Mirror & Backwards Text Generator',
    icon: 'ↄ',
    description:
      'Flip text into mirror writing (Ɔↄ) or simply reverse the letter order, then copy and paste it anywhere. Free Unicode mirror tool, in your browser.',
    lead: 'Turn text into mirror writing — reversed order with horizontally-flipped letters, like it\'s seen in a mirror — or just reverse the character order. Copy and paste either version anywhere.',
    widget: 'mirror',
    how: 'The mirror version reverses your text and swaps each letter for a Unicode look-alike that is flipped left-to-right, so the whole thing reads as if reflected. The backwards version only reverses the order of characters, keeping each letter normal. Both are generated in your browser and produced as plain, pasteable text.',
    note: 'Not every letter has a convincing horizontally-flipped twin in Unicode, so a few (like o, x, l) are left unchanged — the effect is strongest on words with letters that do mirror cleanly. This is distinct from upside-down text (rotated 180°) and from a plain reverse: mirror text specifically simulates a left-right reflection.',
    faqs: [
      { q: 'How do I write text backwards or in mirror writing?', a: 'Type your text and copy the mirror version (reversed with flipped letters) or the backwards version (reversed order only). Both are real Unicode text, so they paste into bios, chats and captions.' },
      { q: 'What is the difference between mirror and upside-down text?', a: 'Mirror text is flipped left-to-right, as if reflected in a mirror. Upside-down text is rotated 180°. They use different character sets — see the upside-down generator in the text tools for the rotated version.' },
      { q: 'Why are some letters not flipped?', a: 'Unicode doesn\'t have a good mirror-image glyph for every letter. Where none exists, the tool keeps the original so the word stays legible rather than showing a blank box.' },
      NOT_A_FONT_FAQ,
      PASTE_FAQ,
    ],
    keywords: ['mirror text', 'backwards text generator', 'reverse text generator', 'mirror writing', 'flip text', 'reversed text copy paste', 'mirrored text'],
  },
  {
    slug: 'lenny-face-generator',
    name: 'Lenny Face & Kaomoji Generator',
    icon: 'ʖ',
    description:
      'Copy ( ͡° ͜ʖ ͡°) Lenny faces and Japanese kaomoji — happy, shrug, table flip, angry, cute and more. One click to copy any text face. Free, in your browser.',
    lead: 'Browse and copy Lenny faces and kaomoji — ( ͡° ͜ʖ ͡°), ¯\\_(ツ)_/¯, (╯°□°）╯︵ ┻━┻ and dozens more — grouped by mood. Click any face to copy it instantly.',
    widget: 'lenny',
    how: 'Lenny faces and kaomoji are little faces built entirely from standard Unicode letters, punctuation and combining marks — no images or emoji required. This tool collects the popular ones into mood groups so you can find and copy one fast. Click a face and it goes straight to your clipboard, ready to paste.',
    note: 'Because they\'re assembled from ordinary characters, kaomoji paste into almost any text field — chats, forums, game names, bios. A few faces use combining marks (like the eyebrows in a Lenny face) that render slightly differently across fonts, so preview if precise alignment matters.',
    faqs: [
      { q: 'How do I make a Lenny face?', a: 'You don\'t have to type it — click ( ͡° ͜ʖ ͡°) or any face in the picker to copy it, then paste it into your message. Each one is plain Unicode text.' },
      { q: 'What is a kaomoji?', a: 'A kaomoji is a Japanese-style emoticon read upright (not sideways), built from Unicode characters — for example (◕‿◕) or ¯\\_(ツ)_/¯. Unlike emoji, they\'re just text.' },
      { q: 'Will the table-flip and shrug faces paste correctly?', a: 'In most apps, yes — they\'re standard characters including the backslash and Katakana ツ. A few platforms render combining marks a little differently, so check before relying on exact spacing.' },
      { q: 'Is it free and private?', a: 'Yes — everything runs in your browser, nothing is uploaded, and there\'s no sign-up.' },
    ],
    keywords: ['lenny face', 'kaomoji', 'text faces', 'shrug emoji text', 'table flip text', 'japanese emoticons', 'lenny face copy paste', '( ͡° ͜ʖ ͡°)'],
  },
  {
    slug: 'css-gradient-text-generator',
    name: 'CSS Gradient Text Generator',
    icon: '🌈',
    description:
      'Create gradient text with CSS background-clip — pick two colours and an angle, preview live, copy the CSS or download a transparent PNG. Free, in your browser.',
    lead: 'Give text a colour gradient: pick two colours and an angle, see it live, then copy the CSS (background-clip: text) or download a transparent PNG for anywhere that can\'t run CSS.',
    widget: 'gradient',
    how: 'The CSS approach paints a linear-gradient as the element\'s background, clips that background to the shape of the text with background-clip: text, and makes the text fill transparent so the gradient shows through. The tool builds that rule from your colours and angle and previews it. For places that can\'t run CSS — social posts, images — it also renders the same gradient text to a 2× PNG with a transparent background.',
    note: 'background-clip: text needs the -webkit- prefix to work across browsers, which the copied CSS includes. Because the visible colour comes from the background, always keep the underlying text real (not an image) so screen readers and search still read it — the gradient is purely decorative. The PNG export is for contexts where you can\'t use CSS at all.',
    faqs: [
      { q: 'How do I make gradient text in CSS?', a: 'Set a linear-gradient as the background, add background-clip: text (with the -webkit- prefix) and make the text fill transparent so the gradient shows through the letters. This tool generates that exact CSS from your colours and angle.' },
      { q: 'Why is my gradient text invisible?', a: 'Almost always a missing prefix or fill: you need -webkit-background-clip: text and -webkit-text-fill-color: transparent (plus the unprefixed versions). The copied CSS here includes all of them.' },
      { q: 'Can I use gradient text where CSS isn\'t allowed?', a: 'Yes — use the Download PNG button to export the styled text as a transparent image you can drop into a post, slide or design tool.' },
      { q: 'Is gradient text bad for accessibility?', a: 'Only if you replace real text with an image. Keep the actual text in the HTML and treat the gradient as decoration; screen readers then read it normally.' },
    ],
    keywords: ['css gradient text', 'gradient text generator', 'text gradient css', 'background clip text', 'gradient text maker', 'colorful text css'],
  },
  {
    slug: 'line-length-calculator',
    name: 'Line Length (Measure) Calculator',
    icon: '📖',
    description:
      'Find the ideal text column width for readability — 45–75 characters per line — from your font size, with a max-width in px, rem, em and ch. Free, in your browser.',
    lead: 'Work out the ideal reading width for your body text: set a font size and target characters per line, and get the max-width in px, rem, em and ch — with a live preview and a readability verdict.',
    widget: 'measure',
    how: 'Readability research recommends roughly 45–75 characters per line for body text, about 66 being ideal. The calculator estimates the average character width from your font size (proportional fonts average close to half the font size per character) and multiplies by your target characters-per-line to give the column width, expressed in px, rem, em and approximate ch units, with a live sample at that width.',
    note: 'Set your text container with max-width in em or ch rather than a fixed pixel value, so the measure stays correct if the font size changes. This is a typographic best practice tied to accessibility — the WCAG reading guidance and long-standing typography (Bringhurst) both point to keeping lines from running too long, which is where the eye gets lost jumping back to the next line.',
    faqs: [
      { q: 'What is the ideal line length for reading?', a: 'About 45–75 characters per line for body text, with roughly 66 as the sweet spot. Shorter lines feel choppy; longer lines make it hard to find the next line. This tool converts that target into a column width for your font size.' },
      { q: 'What CSS should I use to limit line length?', a: 'Set max-width on your text container. Using em or ch units (e.g. max-width: 66ch) keeps the measure correct even if the font size changes, which fixed pixels don\'t.' },
      { q: 'What is a ch unit?', a: '1ch is the width of the "0" glyph in the current font. It\'s a handy unit for line length because a max-width in ch maps almost directly to characters-per-line.' },
      { q: 'Does line length really affect readability?', a: 'Yes — overly long lines tire the eye and cause it to lose its place returning to the left margin; overly short lines break reading rhythm. Keeping within ~45–75 CPL measurably helps comprehension.' },
    ],
    keywords: ['line length calculator', 'characters per line', 'ideal line length', 'measure typography', 'reading width css', 'ch unit calculator', 'optimal line length'],
  },
  {
    slug: 'ascii-art-text-generator',
    name: 'ASCII Art Text Generator (Big Text)',
    icon: '🅰',
    description:
      'Turn words into big ASCII-art banners in 10 classic FIGlet fonts — Standard, Big, Slant, ANSI Shadow and more. Copy or download for READMEs, terminals and code. Free, in your browser.',
    lead: 'Type a word and get it as a big ASCII-art banner — choose from 10 classic FIGlet fonts (Standard, Big, Slant, ANSI Shadow, Doom…), then copy it or download a .txt for a README, terminal login or code comment.',
    widget: 'ascii',
    how: 'ASCII art spells each letter out of many smaller characters arranged into a large shape. This tool uses the classic FIGlet font format: every font defines a multi-line pattern for each character, and the generator lays your letters out side by side with tight kerning so they touch cleanly. It parses the fonts and renders everything in your browser — no server, no upload.',
    note: 'The output only lines up in a monospace (fixed-width) context — a code block, README, terminal, or a <pre> tag — because it relies on every column being the same width. Pasting it into a proportional-font field (like a normal chat message) will skew the shapes. Fonts like ANSI Shadow use block-drawing characters, so they look best where those glyphs are supported.',
    faqs: [
      { q: 'How do I make ASCII art text?', a: 'Type your word, pick a FIGlet font, and copy the big-text banner. Paste it into a monospace place — a README, code comment or terminal — so the characters line up correctly.' },
      { q: 'Where does ASCII art like this get used?', a: 'Classic uses are README headers on GitHub, banners in CLI tools and login messages (MOTD), figlet-style output in scripts, and decorative headers in code comments.' },
      { q: 'Why does my ASCII art look jumbled when I paste it?', a: 'It was pasted somewhere using a proportional font, so the columns no longer align. Paste it into a fixed-width/monospace context (code block, terminal, <pre>) and it will render correctly.' },
      { q: 'What are the fonts?', a: 'They\'re the standard FIGlet fonts — Standard, Big, Slant, Small, Banner, Shadow, ANSI Shadow, Doom, Block and Mini — the same classic set the figlet command-line tool ships with.' },
      { q: 'Is it private?', a: 'Yes — the fonts and renderer run entirely in your browser. Nothing you type is uploaded, and it works offline once loaded.' },
    ],
    keywords: ['ascii art generator', 'text to ascii', 'ascii art text', 'figlet', 'big text generator', 'ascii banner', 'ascii text art', 'text to ascii art'],
  },
  {
    slug: 'font-metadata-inspector',
    name: 'Font Metadata Inspector (TTF / OTF)',
    icon: '🔤',
    description:
      'Inspect a TTF or OTF font file to read its family and style names, version, designer, licence, glyph count and embedding permission — in your browser, never uploaded.',
    lead: 'Drop a .ttf or .otf font to read its embedded metadata: family, style, version, glyph count, weight and the embedding licence baked into the file.',
    widget: 'fontinspect',
    how: 'Every TrueType (.ttf) and OpenType (.otf) font is an "sfnt" file: a directory of named tables. The metadata you care about lives in a few of them — the name table holds the human-readable strings (family, subfamily, full name, version, designer, copyright and licence), head records the units-per-em and creation date, maxp counts the glyphs, and OS/2 stores the weight and width classes plus the fsType embedding permission. This tool reads those tables directly in your browser and lays the fields out for you, and detects whether the outlines are TrueType (a glyf table) or PostScript/CFF (OpenType).',
    note: 'Handy for identifying an unlabelled font file, checking a font\'s real family and version, or reading the embedding licence (fsType) before you bundle a font into a PDF, app or website — some fonts forbid embedding, and that flag is stored right in the file. It reads uncompressed TTF/OTF (and the first font of a .ttc collection); WOFF and WOFF2 web fonts are compressed and aren\'t parsed here, so convert them to TTF/OTF first. The font is read entirely on your device and never uploaded, which matters for licensed or unreleased fonts. This reports what the font declares — it isn\'t legal advice about how you may use it.',
    faqs: [
      { q: 'How do I find a font\'s name and version?', a: 'Drop the .ttf or .otf file in and the tool reads the font\'s name table, showing the family, style, full name and version exactly as the font author stored them. This is the reliable way to identify an unlabelled font file.' },
      { q: 'Can I check if a font allows embedding?', a: 'Yes — the OS/2 table\'s fsType field records the embedding permission, and the tool translates it into plain English (installable, print & preview only, editable, or restricted/no embedding). Check it before embedding a font in a PDF, app or site.' },
      { q: 'What is units-per-em and glyph count?', a: 'Units-per-em is the font\'s internal coordinate grid (commonly 1000 for OpenType/CFF or 2048 for TrueType) that all glyph measurements are relative to. The glyph count is how many glyphs the font contains — useful for gauging language and symbol coverage.' },
      { q: 'Does it work with WOFF or WOFF2 web fonts?', a: 'Not directly — WOFF and WOFF2 wrap the same sfnt tables but compress them (zlib and Brotli respectively), so they can\'t be read without decompression. Convert a web font back to TTF/OTF first, then inspect it here.' },
      { q: 'Is my font uploaded?', a: 'No — the file is parsed entirely in your browser and nothing is transmitted, so licensed, custom or unreleased fonts stay on your device. It works offline too.' },
    ],
    keywords: ['font metadata', 'ttf inspector', 'otf metadata', 'font file info', 'read font name', 'font version checker', 'font embedding permission', 'identify font file'],
  },
];

export const getFontTool = (slug: string) => FONT_TOOLS.find((t) => t.slug === slug);
