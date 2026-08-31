/**
 * Unicode "font" transforms, the pseudo-fonts behind fancy-text generators.
 *
 * These are NOT real fonts: they map A-Z, a-z and 0 to 9 onto look-alike Unicode
 * code points (mostly the Mathematical Alphanumeric Symbols block, U+1D400+),
 * so the styled text copies and pastes into places that don't allow font
 * changes, social bios, usernames, messages. The trade-off is accessibility:
 * screen readers announce 𝗯𝗼𝗹𝗱 as "mathematical bold b, o, l, d" (or skip it),
 * so this styling should never carry meaning a plain-text reader would miss.
 *
 * Several styles have GAPS: a handful of letters were encoded earlier in the
 * "Letterlike Symbols" block, so a naive offset lands on a reserved slot that
 * renders as a blank box. Those are patched with explicit exception maps.
 */

/** Map a single char via base code points for A/a/0, with per-char exceptions. */
function ranged(exceptions: Record<string, string> = {}, upper?: number, lower?: number, digit?: number) {
  return (ch: string): string => {
    if (exceptions[ch] !== undefined) return exceptions[ch];
    const code = ch.codePointAt(0)!;
    if (upper !== undefined && code >= 0x41 && code <= 0x5a) return String.fromCodePoint(upper + (code - 0x41));
    if (lower !== undefined && code >= 0x61 && code <= 0x7a) return String.fromCodePoint(lower + (code - 0x61));
    if (digit !== undefined && code >= 0x30 && code <= 0x39) return String.fromCodePoint(digit + (code - 0x30));
    return ch;
  };
}

// Gap patches for the styles that borrow from Letterlike Symbols.
const SCRIPT_EX: Record<string, string> = {
  B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
  e: 'ℯ', g: 'ℊ', o: 'ℴ',
};
const FRAKTUR_EX: Record<string, string> = { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' };
const DBL_EX: Record<string, string> = { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' };
const ITALIC_SERIF_EX: Record<string, string> = { h: 'ℎ' }; // U+1D455 is reserved → Planck constant ℎ

// Lookup-table styles (small caps, circled) — irregular code points.
const SMALLCAPS: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
  k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ',
  u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
};
const smallcaps = (ch: string): string => {
  const l = ch.toLowerCase();
  return SMALLCAPS[l] ?? ch;
};

const circled = (ch: string): string => {
  const code = ch.codePointAt(0)!;
  if (code >= 0x41 && code <= 0x5a) return String.fromCodePoint(0x24b6 + (code - 0x41)); // Ⓐ
  if (code >= 0x61 && code <= 0x7a) return String.fromCodePoint(0x24d0 + (code - 0x61)); // ⓐ
  if (code === 0x30) return '⓪';
  if (code >= 0x31 && code <= 0x39) return String.fromCodePoint(0x2460 + (code - 0x31)); // ①..⑨
  return ch;
};

const fullwidth = (ch: string): string => {
  const code = ch.codePointAt(0)!;
  if (ch === ' ') return '　';
  if (code >= 0x21 && code <= 0x7e) return String.fromCodePoint(0xff01 + (code - 0x21)); // ！..～ incl. A-z, 0 to 9
  return ch;
};

// Combining-mark overlays (applied to every non-space char).
const combining = (mark: string) => (ch: string): string => (ch === ' ' ? ch : ch + mark);

// Superscript, irregular code points; many letters exist, a few don't (fall back).
const SUPERSCRIPT: Record<string, string> = {
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ',
  k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: 'q', r: 'ʳ', s: 'ˢ', t: 'ᵗ',
  u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ꟳ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ',
  K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'Q', R: 'ᴿ', S: 'ˢ', T: 'ᵀ',
  U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', '.': '·',
};
const superscript = (ch: string): string => SUPERSCRIPT[ch] ?? ch;

// Subscript, Unicode only defines a limited set of letters; the rest fall back.
const SUBSCRIPT: Record<string, string> = {
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ', o: 'ₒ',
  p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
};
const subscript = (ch: string): string => {
  const l = ch.toLowerCase();
  return SUBSCRIPT[l] ?? ch;
};

// Emoji-style letters: regional indicators (🇦) and negative-squared Latin (🅰).
const regional = (ch: string): string => {
  const code = ch.toUpperCase().codePointAt(0)!;
  if (code >= 0x41 && code <= 0x5a) return String.fromCodePoint(0x1f1e6 + (code - 0x41)) + ' ';
  return ch;
};
const squared = (ch: string): string => {
  const code = ch.toUpperCase().codePointAt(0)!;
  if (code >= 0x41 && code <= 0x5a) return String.fromCodePoint(0x1f170 + (code - 0x41));
  return ch;
};

export interface FontStyle {
  id: string;
  /** menu / heading label */
  name: string;
  transform: (ch: string) => string;
}

/** Every style, keyed by id. Order here is the display order in the "all" view. */
export const FONT_STYLES: FontStyle[] = [
  { id: 'sans-bold', name: 'Bold', transform: ranged({}, 0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: 'sans-italic', name: 'Italic', transform: ranged({}, 0x1d608, 0x1d622) },
  { id: 'sans-bolditalic', name: 'Bold Italic', transform: ranged({}, 0x1d63c, 0x1d656) },
  { id: 'serif-bold', name: 'Serif Bold', transform: ranged({}, 0x1d400, 0x1d41a, 0x1d7ce) },
  { id: 'serif-italic', name: 'Serif Italic', transform: ranged(ITALIC_SERIF_EX, 0x1d434, 0x1d44e) },
  { id: 'script', name: 'Cursive (Script)', transform: ranged(SCRIPT_EX, 0x1d49c, 0x1d4b6) },
  { id: 'script-bold', name: 'Bold Cursive', transform: ranged({}, 0x1d4d0, 0x1d4ea) },
  { id: 'fraktur', name: 'Gothic (Fraktur)', transform: ranged(FRAKTUR_EX, 0x1d504, 0x1d51e) },
  { id: 'fraktur-bold', name: 'Bold Gothic', transform: ranged({}, 0x1d56c, 0x1d586) },
  { id: 'double', name: 'Outline (Double-struck)', transform: ranged(DBL_EX, 0x1d538, 0x1d552, 0x1d7d8) },
  { id: 'mono', name: 'Monospace', transform: ranged({}, 0x1d670, 0x1d68a, 0x1d7f6) },
  { id: 'sans', name: 'Sans-serif', transform: ranged({}, 0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { id: 'smallcaps', name: 'Small Caps', transform: smallcaps },
  { id: 'circled', name: 'Bubble (Circled)', transform: circled },
  { id: 'wide', name: 'Wide (Full-width)', transform: fullwidth },
  { id: 'strike', name: 'Strikethrough', transform: combining('̶') },
  { id: 'underline', name: 'Underline', transform: combining('̲') },
  { id: 'superscript', name: 'Superscript', transform: superscript },
  { id: 'subscript', name: 'Subscript', transform: subscript },
  { id: 'regional', name: 'Emoji Letters', transform: regional },
  { id: 'squared', name: 'Squared Emoji', transform: squared },
];

const BY_ID = new Map(FONT_STYLES.map((s) => [s.id, s]));

/** Apply a style to a whole string (grapheme-safe enough for ASCII input). */
export function styleText(text: string, styleId: string): string {
  const style = BY_ID.get(styleId);
  if (!style) return text;
  let out = '';
  for (const ch of text) out += style.transform(ch);
  return out;
}

export function getStyle(id: string): FontStyle | undefined {
  return BY_ID.get(id);
}
