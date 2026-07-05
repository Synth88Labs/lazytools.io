/** Generator helpers — cryptographic randomness with rejection sampling (no modulo bias). */

/** Unbiased random integer in [0, maxExclusive). */
export function randInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);
  let v: number;
  do {
    crypto.getRandomValues(buf);
    v = buf[0]!;
  } while (v >= limit);
  return v % maxExclusive;
}

export function randIntRange(min: number, max: number): number {
  return min + randInt(max - min + 1);
}

export const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/',
  ambiguous: 'l1IO0o',
};

export function generatePassword(
  length: number,
  sets: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean },
  excludeAmbiguous: boolean
): { password: string; entropyBits: number } {
  let alphabet = '';
  if (sets.lower) alphabet += CHARSETS.lower;
  if (sets.upper) alphabet += CHARSETS.upper;
  if (sets.digits) alphabet += CHARSETS.digits;
  if (sets.symbols) alphabet += CHARSETS.symbols;
  if (excludeAmbiguous) alphabet = [...alphabet].filter((c) => !CHARSETS.ambiguous.includes(c)).join('');
  if (!alphabet) return { password: '', entropyBits: 0 };
  let out = '';
  for (let i = 0; i < length; i++) out += alphabet[randInt(alphabet.length)];
  return { password: out, entropyBits: Math.round(length * Math.log2(alphabet.length) * 10) / 10 };
}

const LOREM_WORDS =
  ('lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ' +
    'enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in ' +
    'reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt ' +
    'culpa qui officia deserunt mollit anim id est laborum at vero eos accusamus iusto odio dignissimos ducimus blanditiis ' +
    'praesentium voluptatum deleniti atque corrupti quos dolores quas molestias excepturi occaecati rerum facilis expedita distinctio')
    .split(' ');

function loremSentence(): string {
  const len = 6 + randInt(9);
  const words = Array.from({ length: len }, () => LOREM_WORDS[randInt(LOREM_WORDS.length)]!);
  const s = words.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}

export function generateLorem(mode: 'paragraphs' | 'sentences' | 'words', count: number, classicStart: boolean): string {
  const clamp = Math.max(1, Math.min(count, mode === 'words' ? 5000 : 100));
  let out: string;
  if (mode === 'words') {
    const words = Array.from({ length: clamp }, () => LOREM_WORDS[randInt(LOREM_WORDS.length)]!);
    out = words.join(' ') + '.';
    out = out.charAt(0).toUpperCase() + out.slice(1);
  } else if (mode === 'sentences') {
    out = Array.from({ length: clamp }, loremSentence).join(' ');
  } else {
    out = Array.from({ length: clamp }, () => {
      const n = 3 + randInt(4);
      return Array.from({ length: n }, loremSentence).join(' ');
    }).join('\n\n');
  }
  if (classicStart) {
    out = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' + (out ? ', ' + out.charAt(0).toLowerCase() + out.slice(1) : '.');
  }
  return out;
}
