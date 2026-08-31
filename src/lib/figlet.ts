/**
 * Minimal, self-contained FIGlet renderer, no runtime dependency.
 *
 * Parses the classic .flf font files (bundled in ../data/fonts/figlet) and
 * lays glyphs out with collision-safe kerning. Everything runs client-side;
 * the fonts are the freely-distributable standard FIGlet set.
 */
import Standard from '../data/fonts/figlet/Standard.flf?raw';
import Big from '../data/fonts/figlet/Big.flf?raw';
import Slant from '../data/fonts/figlet/Slant.flf?raw';
import Small from '../data/fonts/figlet/Small.flf?raw';
import Banner from '../data/fonts/figlet/Banner.flf?raw';
import Shadow from '../data/fonts/figlet/Shadow.flf?raw';
import AnsiShadow from '../data/fonts/figlet/ANSI-Shadow.flf?raw';
import Doom from '../data/fonts/figlet/Doom.flf?raw';
import Mini from '../data/fonts/figlet/Mini.flf?raw';
import Block from '../data/fonts/figlet/Block.flf?raw';

export interface FigFont {
  height: number;
  chars: Record<number, string[]>;
}

const RAW: { id: string; name: string; data: string }[] = [
  { id: 'standard', name: 'Standard', data: Standard },
  { id: 'big', name: 'Big', data: Big },
  { id: 'ansi-shadow', name: 'ANSI Shadow', data: AnsiShadow },
  { id: 'slant', name: 'Slant', data: Slant },
  { id: 'shadow', name: 'Shadow', data: Shadow },
  { id: 'doom', name: 'Doom', data: Doom },
  { id: 'block', name: 'Block', data: Block },
  { id: 'banner', name: 'Banner', data: Banner },
  { id: 'small', name: 'Small', data: Small },
  { id: 'mini', name: 'Mini', data: Mini },
];

export const FIGLET_FONTS = RAW.map((f) => ({ id: f.id, name: f.name }));

const cache = new Map<string, FigFont>();

function parse(data: string): FigFont {
  const lines = data.split('\n');
  const header = lines[0].split(' ');
  const signature = header[0]; // e.g. "flf2a$" — last char is the hardblank
  const hardblank = signature[signature.length - 1];
  const height = parseInt(header[1], 10);
  const commentLines = parseInt(header[5], 10) || 0;

  let idx = 1 + commentLines;
  const chars: Record<number, string[]> = {};

  const readGlyph = (): string[] => {
    const sub: string[] = [];
    for (let row = 0; row < height; row++) {
      let line = lines[idx++];
      if (line === undefined) { sub.push(''); continue; }
      line = line.replace(/\r$/, '');
      const endmark = line[line.length - 1];
      if (endmark !== undefined) {
        const esc = endmark.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        line = line.replace(new RegExp(esc + '+$'), '');
      }
      sub.push(line.split(hardblank).join(' '));
    }
    // Pad every row to the widest, so the glyph is rectangular.
    const w = Math.max(0, ...sub.map((s) => s.length));
    return sub.map((s) => s.padEnd(w, ' '));
  };

  for (let code = 32; code <= 126; code++) chars[code] = readGlyph();
  return { height, chars };
}

function getFont(id: string): FigFont {
  if (cache.has(id)) return cache.get(id)!;
  const raw = RAW.find((f) => f.id === id) ?? RAW[0];
  const font = parse(raw.data);
  cache.set(id, font);
  return font;
}

const trailing = (s: string): number => { let n = 0; for (let i = s.length - 1; i >= 0 && s[i] === ' '; i--) n++; return n; };
const leading = (s: string): number => { let n = 0; for (let i = 0; i < s.length && s[i] === ' '; i++) n++; return n; };

function appendGlyph(rows: string[], glyph: string[]): string[] {
  if (rows.length === 0 || rows[0] === '') return glyph.slice();
  const width = rows[0].length;
  // Start from the largest overlap the blank margins allow, then back off on collision.
  let overlap = Math.min(...rows.map((c, i) => trailing(c) + leading(glyph[i] ?? '')));
  overlap = Math.min(overlap, glyph[0].length);
  while (overlap > 0) {
    let hit = false;
    for (let r = 0; r < rows.length && !hit; r++) {
      for (let k = 0; k < overlap; k++) {
        const cChar = rows[r][width - overlap + k] ?? ' ';
        const gChar = (glyph[r] ?? '')[k] ?? ' ';
        if (cChar !== ' ' && gChar !== ' ') { hit = true; break; }
      }
    }
    if (!hit) break;
    overlap--;
  }
  return rows.map((c, r) => {
    const g = glyph[r] ?? '';
    let merged = '';
    for (let k = 0; k < overlap; k++) {
      const cChar = c[width - overlap + k] ?? ' ';
      const gChar = g[k] ?? ' ';
      merged += cChar !== ' ' ? cChar : gChar;
    }
    return c.slice(0, width - overlap) + merged + g.slice(overlap);
  });
}

/** Render one line of text (no embedded newlines) to ASCII art. */
function renderLine(text: string, font: FigFont): string[] {
  let rows: string[] = Array.from({ length: font.height }, () => '');
  let started = false;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    const glyph = font.chars[code] ?? font.chars[32];
    if (!glyph) continue;
    rows = started ? appendGlyph(rows, glyph) : glyph.slice();
    started = true;
  }
  return rows;
}

/** Render text (supporting newlines) to an ASCII-art string. */
export function renderFiglet(text: string, fontId: string): string {
  const font = getFont(fontId);
  const blocks = (text || '').split('\n').map((line) => renderLine(line, font));
  const out = blocks
    .map((rows) => rows.map((r) => r.replace(/\s+$/, '')).join('\n'))
    .join('\n');
  return out;
}
