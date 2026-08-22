/**
 * Small pure text statistics used by the Online Notepad (and reusable). Counts
 * words, characters (with and without spaces), lines and an estimated reading
 * time. Deterministic and unit-testable.
 */
export interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  lines: number;
  readingMinutes: number; // at ~200 wpm, rounded up (0 for empty)
}

export function textStats(text: string): TextStats {
  const words = (text.trim().match(/\S+/g) || []).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length;
  const readingMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
  return { words, chars, charsNoSpaces, lines, readingMinutes };
}
