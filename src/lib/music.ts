/**
 * Music & Audio math. Everything here is a mathematical/definitional identity —
 * equal-temperament pitch (A4 = 440 Hz = MIDI 69, the ISO 16 standard), BPM
 * timing, intervals in cents, and PCM audio file size. No sourced lookup data.
 */

export const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
export const NOTE_NAMES_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const A4_MIDI = 69;

/* ---------------- Pitch ↔ frequency ↔ MIDI ---------------- */

/** Equal-temperament frequency of a MIDI note. f = aRef × 2^((midi−69)/12). */
export function midiToFreq(midi: number, aRef = 440): number {
  return aRef * Math.pow(2, (midi - A4_MIDI) / 12);
}
/** Nearest MIDI note (may be fractional) for a frequency. */
export function freqToMidi(freq: number, aRef = 440): number {
  return A4_MIDI + 12 * Math.log2(freq / aRef);
}
/** MIDI number → note name + octave (scientific pitch notation: middle C = C4 = 60). */
export function midiToName(midi: number, flat = false): { name: string; octave: number; full: string } {
  const idx = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const name = (flat ? NOTE_NAMES_FLAT : NOTE_NAMES)[idx];
  return { name, octave, full: `${name}${octave}` };
}
/** Note name + octave → MIDI number. */
export function nameToMidi(noteIdx: number, octave: number): number {
  return 12 * (octave + 1) + noteIdx;
}

/* ---------------- Intervals ---------------- */

/** Cents between two frequencies: 1200 × log2(f2/f1). */
export function cents(f1: number, f2: number): number { return 1200 * Math.log2(f2 / f1); }
/** Semitones between two frequencies. */
export function semitones(f1: number, f2: number): number { return 12 * Math.log2(f2 / f1); }
/** Frequency ratio of n semitones (equal temperament). */
export function semitoneRatio(n: number): number { return Math.pow(2, n / 12); }

export const INTERVAL_NAMES: Record<number, string> = {
  0: 'Unison', 1: 'Minor 2nd', 2: 'Major 2nd', 3: 'Minor 3rd', 4: 'Major 3rd',
  5: 'Perfect 4th', 6: 'Tritone', 7: 'Perfect 5th', 8: 'Minor 6th', 9: 'Major 6th',
  10: 'Minor 7th', 11: 'Major 7th', 12: 'Octave',
};
export function intervalName(semis: number): string {
  const s = Math.round(semis);
  const oct = Math.floor(s / 12), within = ((s % 12) + 12) % 12;
  const base = INTERVAL_NAMES[within] ?? `${within} semitones`;
  return oct > 0 && within !== 0 ? `${base} + ${oct} oct` : oct > 0 && within === 0 ? `${oct} octave${oct > 1 ? 's' : ''}` : base;
}

/* ---------------- BPM / delay timing ---------------- */

export interface NoteDivision { id: string; label: string; beats: number }
/** Note divisions as a fraction of a whole note (a beat = quarter note = 1). */
export const DIVISIONS: NoteDivision[] = [
  { id: '1', label: 'Whole (1/1)', beats: 4 },
  { id: '1-2', label: 'Half (1/2)', beats: 2 },
  { id: '1-4', label: 'Quarter (1/4)', beats: 1 },
  { id: '1-8', label: 'Eighth (1/8)', beats: 0.5 },
  { id: '1-16', label: 'Sixteenth (1/16)', beats: 0.25 },
  { id: '1-32', label: 'Thirty-second (1/32)', beats: 0.125 },
];
/** ms per quarter-note beat at a tempo. */
export function beatMs(bpm: number): number { return 60000 / bpm; }
/** Delay/echo timings (ms) for a note division: straight, dotted (×1.5), triplet (×2/3). */
export function delayTimes(bpm: number, beats: number) {
  const straight = beatMs(bpm) * beats;
  return { straight, dotted: straight * 1.5, triplet: straight * (2 / 3) };
}
/** LFO / delay frequency (Hz) from a period in ms. */
export function msToHz(ms: number): number { return 1000 / ms; }

/* ---------------- Transpose ---------------- */

/** Transpose a MIDI note by semitones. */
export function transpose(midi: number, semis: number): number { return midi + semis; }

/* ---------------- Audio file size ---------------- */

/** Uncompressed PCM size in bytes = sampleRate × (bitDepth/8) × channels × seconds. */
export function audioBytes(sampleRate: number, bitDepth: number, channels: number, seconds: number): number {
  return sampleRate * (bitDepth / 8) * channels * seconds;
}
/** Data rate (bits per second) of a PCM stream. */
export function audioBitrate(sampleRate: number, bitDepth: number, channels: number): number {
  return sampleRate * bitDepth * channels;
}

/* ---------------- Time signature ---------------- */

/**
 * Duration of one bar (seconds) at a tempo. A "beat" is the note value in the
 * denominator; BPM is quarter-notes per minute. bar = beatsPerBar × (4/denom) × (60/bpm).
 */
export function barSeconds(bpm: number, beatsPerBar: number, denom: number): number {
  return beatsPerBar * (4 / denom) * (60 / bpm);
}
