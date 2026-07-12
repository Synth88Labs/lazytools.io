/**
 * Node test for the chord/scale helpers in src/lib/music.ts — run:
 *   node --experimental-strip-types scripts/test-music-extra.ts
 */
import {
  CHORD_TYPES, SCALE_TYPES, notesFromIntervals, identifyChord, pcSet,
} from '../src/lib/music.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${JSON.stringify(got)})` : '')); }
}
const eq = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const find = (id: string, arr: { id: string }[]) => arr.find((x) => x.id === id)!;

// ── chord notes (root C = pc 0) ──
ok('C major = C E G', eq(notesFromIntervals(0, find('maj', CHORD_TYPES).intervals), ['C', 'E', 'G']), notesFromIntervals(0, find('maj', CHORD_TYPES).intervals));
ok('A minor = A C E', eq(notesFromIntervals(9, find('min', CHORD_TYPES).intervals), ['A', 'C', 'E']), notesFromIntervals(9, find('min', CHORD_TYPES).intervals));
ok('G7 = G B D F', eq(notesFromIntervals(7, find('7', CHORD_TYPES).intervals), ['G', 'B', 'D', 'F']), notesFromIntervals(7, find('7', CHORD_TYPES).intervals));
ok('Cmaj7 = C E G B', eq(notesFromIntervals(0, find('maj7', CHORD_TYPES).intervals), ['C', 'E', 'G', 'B']));
ok('Ddim = D F A♭', eq(notesFromIntervals(2, find('dim', CHORD_TYPES).intervals), ['D', 'F', 'G♯']), notesFromIntervals(2, find('dim', CHORD_TYPES).intervals));
ok('Csus4 = C F G', eq(notesFromIntervals(0, find('sus4', CHORD_TYPES).intervals), ['C', 'F', 'G']));
ok('C9 has 5 notes', notesFromIntervals(0, find('9', CHORD_TYPES).intervals).length === 5);
ok('C9 includes D (the 9th)', notesFromIntervals(0, find('9', CHORD_TYPES).intervals).includes('D'));

// ── scale notes ──
ok('C major scale', eq(notesFromIntervals(0, find('major', SCALE_TYPES).intervals), ['C', 'D', 'E', 'F', 'G', 'A', 'B']));
ok('A natural minor', eq(notesFromIntervals(9, find('natural-minor', SCALE_TYPES).intervals), ['A', 'B', 'C', 'D', 'E', 'F', 'G']), notesFromIntervals(9, find('natural-minor', SCALE_TYPES).intervals));
ok('C minor pentatonic', eq(notesFromIntervals(0, find('minor-pentatonic', SCALE_TYPES).intervals), ['C', 'D♯', 'F', 'G', 'A♯']), notesFromIntervals(0, find('minor-pentatonic', SCALE_TYPES).intervals));
ok('G major has F♯', notesFromIntervals(7, find('major', SCALE_TYPES).intervals).includes('F♯'));
ok('chromatic has 12 notes', notesFromIntervals(0, find('chromatic', SCALE_TYPES).intervals).length === 12);

// ── flats ──
ok('F major with flats has B♭', notesFromIntervals(5, find('major', SCALE_TYPES).intervals, true).includes('B♭'), notesFromIntervals(5, find('major', SCALE_TYPES).intervals, true));

// ── pcSet dedup/sort ──
ok('pcSet dedups & sorts', eq(pcSet([0, 4, 7, 12, 4]), [0, 4, 7]), pcSet([0, 4, 7, 12, 4]));

// ── identify chord ──
ok('C E G → C Major', identifyChord([0, 4, 7]).some((m) => m.symbol === 'C'), identifyChord([0, 4, 7]));
ok('A C E → A Minor', identifyChord([9, 0, 4]).some((m) => m.symbol === 'Am'), identifyChord([9, 0, 4]));
ok('G B D F → G7', identifyChord([7, 11, 2, 5]).some((m) => m.symbol === 'G7'), identifyChord([7, 11, 2, 5]));
ok('inversion E G C → still C Major', identifyChord([4, 7, 0]).some((m) => m.symbol === 'C'));
// diminished 7th is symmetric → 4 enharmonic names
ok('dim7 symmetric → 4 matches', identifyChord([0, 3, 6, 9]).length === 4, identifyChord([0, 3, 6, 9]).length);
ok('single note → no chord', identifyChord([0]).length === 0);
ok('random cluster → maybe none', Array.isArray(identifyChord([0, 1, 2])));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
