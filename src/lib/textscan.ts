/**
 * Text-hygiene scanners — reveal what's invisible or deceptive in text.
 * Everything runs in the browser; sensitive text is never uploaded. Node-tested.
 *
 * (1) Invisible / hidden character detection & removal — zero-width chars, bidi
 *     controls, non-breaking spaces, BOM, tag characters used for LLM watermarking.
 * (2) Homoglyph / confusable detection — non-ASCII characters that look like ASCII
 *     (Cyrillic а, Greek ο, fullwidth Ａ) used in spoofing and phishing.
 */

// ───────────────────────── invisible characters ─────────────────────────

interface CharInfo { name: string; kind: 'zero-width' | 'space' | 'control' | 'separator' | 'tag' | 'format' }

/** Problematic invisible/format characters keyed by codepoint. */
export const INVISIBLE: Record<number, CharInfo> = {
  0x00a0: { name: 'No-Break Space', kind: 'space' },
  0x00ad: { name: 'Soft Hyphen', kind: 'format' },
  0x180e: { name: 'Mongolian Vowel Separator', kind: 'zero-width' },
  0x200b: { name: 'Zero Width Space', kind: 'zero-width' },
  0x200c: { name: 'Zero Width Non-Joiner', kind: 'zero-width' },
  0x200d: { name: 'Zero Width Joiner', kind: 'zero-width' },
  0x200e: { name: 'Left-to-Right Mark', kind: 'control' },
  0x200f: { name: 'Right-to-Left Mark', kind: 'control' },
  0x2028: { name: 'Line Separator', kind: 'separator' },
  0x2029: { name: 'Paragraph Separator', kind: 'separator' },
  0x202a: { name: 'Left-to-Right Embedding', kind: 'control' },
  0x202b: { name: 'Right-to-Left Embedding', kind: 'control' },
  0x202c: { name: 'Pop Directional Formatting', kind: 'control' },
  0x202d: { name: 'Left-to-Right Override', kind: 'control' },
  0x202e: { name: 'Right-to-Left Override', kind: 'control' },
  0x202f: { name: 'Narrow No-Break Space', kind: 'space' },
  0x205f: { name: 'Medium Mathematical Space', kind: 'space' },
  0x2060: { name: 'Word Joiner', kind: 'zero-width' },
  0x2061: { name: 'Function Application', kind: 'zero-width' },
  0x2062: { name: 'Invisible Times', kind: 'zero-width' },
  0x2063: { name: 'Invisible Separator', kind: 'zero-width' },
  0x2064: { name: 'Invisible Plus', kind: 'zero-width' },
  0x3000: { name: 'Ideographic Space', kind: 'space' },
  0xfeff: { name: 'Zero Width No-Break Space (BOM)', kind: 'zero-width' },
};

export interface InvisibleHit { index: number; codepoint: number; hex: string; name: string; kind: string }

/** True for tag characters (U+E0000–E007F) and variation selectors used in LLM watermarking. */
function isWatermarkTag(cp: number): boolean {
  return (cp >= 0xe0000 && cp <= 0xe007f) || (cp >= 0xfe00 && cp <= 0xfe0f) || (cp >= 0xe0100 && cp <= 0xe01ef);
}

/** Scan text for invisible/hidden/format characters. Uses code points (handles surrogates). */
export function scanInvisible(text: string): InvisibleHit[] {
  const hits: InvisibleHit[] = [];
  let i = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (INVISIBLE[cp]) {
      hits.push({ index: i, codepoint: cp, hex: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'), name: INVISIBLE[cp].name, kind: INVISIBLE[cp].kind });
    } else if (isWatermarkTag(cp)) {
      hits.push({ index: i, codepoint: cp, hex: 'U+' + cp.toString(16).toUpperCase().padStart(4, '0'), name: 'Tag / Variation Selector (possible watermark)', kind: 'tag' });
    }
    i += ch.length;
  }
  return hits;
}

/** Remove all hidden/zero-width/tag characters; normalise exotic spaces to a normal space. */
export function cleanInvisible(text: string): string {
  let out = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    const info = INVISIBLE[cp];
    if (info) {
      if (info.kind === 'space') out += ' ';           // NBSP etc. → normal space
      else if (info.kind === 'separator') out += '\n';  // line/para separators → newline
      // zero-width, control, format, tag → dropped
    } else if (isWatermarkTag(cp)) {
      // dropped
    } else {
      out += ch;
    }
  }
  return out;
}

// ───────────────────────── homoglyphs / confusables ─────────────────────────

/** Common non-ASCII characters confusable with ASCII (curated from the Unicode confusables set). */
export const CONFUSABLES: Record<string, string> = {
  // Cyrillic
  'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x', 'ѕ': 's', 'і': 'i', 'ј': 'j', 'һ': 'h',
  'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O', 'Р': 'P', 'С': 'C', 'Т': 'T', 'У': 'Y', 'Х': 'X',
  // Greek
  'ο': 'o', 'ν': 'v', 'α': 'a', 'ρ': 'p', 'τ': 't', 'υ': 'u', 'Α': 'A', 'Β': 'B', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Ι': 'I', 'Κ': 'K', 'Μ': 'M', 'Ν': 'N', 'Ο': 'O', 'Ρ': 'P', 'Τ': 'T', 'Υ': 'Y', 'Χ': 'X',
  // fullwidth latin (sample)
  'ａ': 'a', 'ｅ': 'e', 'ｏ': 'o', 'Ａ': 'A', 'Ｅ': 'E', 'Ｏ': 'O',
  // misc lookalikes
  'ⅼ': 'l', 'Ɩ': 'l', 'ǀ': 'l', '𝗮': 'a',
};

export interface HomoglyphHit { index: number; char: string; codepoint: string; looksLike: string; script: string }

function scriptOf(ch: string): string {
  if (/\p{Script=Cyrillic}/u.test(ch)) return 'Cyrillic';
  if (/\p{Script=Greek}/u.test(ch)) return 'Greek';
  if (/[＀-￯]/.test(ch)) return 'Fullwidth';
  if (/\p{Script=Latin}/u.test(ch)) return 'Latin';
  return 'Other';
}

/** Find characters that look like ASCII letters but are actually from another script. */
export function scanHomoglyphs(text: string): { hits: HomoglyphHit[]; normalized: string; mixedScript: boolean } {
  const hits: HomoglyphHit[] = [];
  let normalized = '', i = 0;
  const scripts = new Set<string>();
  for (const ch of text) {
    if (CONFUSABLES[ch]) {
      hits.push({ index: i, char: ch, codepoint: 'U+' + ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0'), looksLike: CONFUSABLES[ch], script: scriptOf(ch) });
      normalized += CONFUSABLES[ch];
      scripts.add(scriptOf(ch));
    } else {
      normalized += ch;
      if (/\p{L}/u.test(ch)) scripts.add(scriptOf(ch));
    }
    i += ch.length;
  }
  // "mixed script" is suspicious when Latin coexists with Cyrillic/Greek in the same text
  const mixedScript = scripts.has('Latin') && (scripts.has('Cyrillic') || scripts.has('Greek') || scripts.has('Fullwidth'));
  return { hits, normalized, mixedScript };
}
