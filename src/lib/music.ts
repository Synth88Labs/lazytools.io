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

/* ---------------- Chords & scales ---------------- */

export interface ChordType { id: string; name: string; symbol: string; intervals: number[] }
/** Chord formulas as semitone intervals from the root (definitional, equal-temperament). */
export const CHORD_TYPES: ChordType[] = [
  { id: 'maj', name: 'Major', symbol: '', intervals: [0, 4, 7] },
  { id: 'min', name: 'Minor', symbol: 'm', intervals: [0, 3, 7] },
  { id: 'dim', name: 'Diminished', symbol: 'dim', intervals: [0, 3, 6] },
  { id: 'aug', name: 'Augmented', symbol: 'aug', intervals: [0, 4, 8] },
  { id: 'sus2', name: 'Suspended 2nd', symbol: 'sus2', intervals: [0, 2, 7] },
  { id: 'sus4', name: 'Suspended 4th', symbol: 'sus4', intervals: [0, 5, 7] },
  { id: '6', name: 'Major 6th', symbol: '6', intervals: [0, 4, 7, 9] },
  { id: 'm6', name: 'Minor 6th', symbol: 'm6', intervals: [0, 3, 7, 9] },
  { id: '7', name: 'Dominant 7th', symbol: '7', intervals: [0, 4, 7, 10] },
  { id: 'maj7', name: 'Major 7th', symbol: 'maj7', intervals: [0, 4, 7, 11] },
  { id: 'm7', name: 'Minor 7th', symbol: 'm7', intervals: [0, 3, 7, 10] },
  { id: 'm7b5', name: 'Half-diminished 7th', symbol: 'm7♭5', intervals: [0, 3, 6, 10] },
  { id: 'dim7', name: 'Diminished 7th', symbol: 'dim7', intervals: [0, 3, 6, 9] },
  { id: 'mMaj7', name: 'Minor-major 7th', symbol: 'mMaj7', intervals: [0, 3, 7, 11] },
  { id: 'add9', name: 'Add 9', symbol: 'add9', intervals: [0, 4, 7, 14] },
  { id: '9', name: 'Dominant 9th', symbol: '9', intervals: [0, 4, 7, 10, 14] },
  { id: 'maj9', name: 'Major 9th', symbol: 'maj9', intervals: [0, 4, 7, 11, 14] },
  { id: 'm9', name: 'Minor 9th', symbol: 'm9', intervals: [0, 3, 7, 10, 14] },
];

export interface ScaleType { id: string; name: string; intervals: number[] }
/** Scale/mode formulas as semitone intervals from the tonic. */
export const SCALE_TYPES: ScaleType[] = [
  { id: 'major', name: 'Major (Ionian)', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'natural-minor', name: 'Natural Minor (Aeolian)', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'harmonic-minor', name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11] },
  { id: 'melodic-minor', name: 'Melodic Minor (ascending)', intervals: [0, 2, 3, 5, 7, 9, 11] },
  { id: 'dorian', name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'phrygian', name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
  { id: 'lydian', name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { id: 'mixolydian', name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
  { id: 'locrian', name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] },
  { id: 'major-pentatonic', name: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9] },
  { id: 'minor-pentatonic', name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] },
  { id: 'blues', name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  { id: 'whole-tone', name: 'Whole Tone', intervals: [0, 2, 4, 6, 8, 10] },
  { id: 'chromatic', name: 'Chromatic', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
];

/** Note names for a chord/scale from a root pitch-class (0–11) and interval list. */
export function notesFromIntervals(rootPc: number, intervals: number[], flat = false): string[] {
  const names = flat ? NOTE_NAMES_FLAT : NOTE_NAMES;
  return intervals.map((i) => names[(((rootPc + i) % 12) + 12) % 12]);
}

/** Unique, sorted pitch-class set (0–11) from a list of pitch classes. */
export function pcSet(pcs: number[]): number[] {
  return [...new Set(pcs.map((p) => (((p % 12) + 12) % 12)))].sort((a, b) => a - b);
}

/** Identify every chord (any root) whose exact pitch-class set matches the given notes. */
export function identifyChord(pcs: number[]): { root: string; symbol: string; name: string }[] {
  const target = pcSet(pcs);
  if (target.length < 2) return [];
  const out: { root: string; symbol: string; name: string }[] = [];
  for (let root = 0; root < 12; root++) {
    for (const ct of CHORD_TYPES) {
      const set = pcSet(ct.intervals.map((i) => root + i));
      if (set.length === target.length && set.every((v, idx) => v === target[idx])) {
        out.push({ root: NOTE_NAMES[root], symbol: NOTE_NAMES[root] + ct.symbol, name: `${NOTE_NAMES[root]} ${ct.name}` });
      }
    }
  }
  return out;
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

/* ---------------- Audio buffer latency ---------------- */

/**
 * Latency of one audio buffer in milliseconds: buffer size (samples) ÷ sample
 * rate (Hz) × 1000. Round-trip latency (in + out) is about twice this, plus
 * converter/driver overhead the DAW adds on top.
 */
export function bufferLatencyMs(bufferSamples: number, sampleRate: number): number {
  return (bufferSamples / sampleRate) * 1000;
}

/* ---------------- Key signatures (circle of fifths) ---------------- */

export interface KeySig {
  /** Number of accidentals (0–7). */
  count: number;
  /** 'sharp', 'flat' or 'none'. */
  type: 'sharp' | 'flat' | 'none';
  /** The accidental note names, in order. */
  accidentals: string[];
  /** Relative minor (for a major key) or relative major (for a minor key). */
  relative: string;
}

const SHARP_ORDER = ['F♯', 'C♯', 'G♯', 'D♯', 'A♯', 'E♯', 'B♯'];
const FLAT_ORDER = ['B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭', 'F♭'];

/** Major keys around the circle of fifths → accidentals + relative minor. */
export const MAJOR_KEYS: Record<string, KeySig> = {
  'C': { count: 0, type: 'none', accidentals: [], relative: 'A minor' },
  'G': { count: 1, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 1), relative: 'E minor' },
  'D': { count: 2, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 2), relative: 'B minor' },
  'A': { count: 3, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 3), relative: 'F♯ minor' },
  'E': { count: 4, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 4), relative: 'C♯ minor' },
  'B': { count: 5, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 5), relative: 'G♯ minor' },
  'F♯': { count: 6, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 6), relative: 'D♯ minor' },
  'C♯': { count: 7, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 7), relative: 'A♯ minor' },
  'F': { count: 1, type: 'flat', accidentals: FLAT_ORDER.slice(0, 1), relative: 'D minor' },
  'B♭': { count: 2, type: 'flat', accidentals: FLAT_ORDER.slice(0, 2), relative: 'G minor' },
  'E♭': { count: 3, type: 'flat', accidentals: FLAT_ORDER.slice(0, 3), relative: 'C minor' },
  'A♭': { count: 4, type: 'flat', accidentals: FLAT_ORDER.slice(0, 4), relative: 'F minor' },
  'D♭': { count: 5, type: 'flat', accidentals: FLAT_ORDER.slice(0, 5), relative: 'B♭ minor' },
  'G♭': { count: 6, type: 'flat', accidentals: FLAT_ORDER.slice(0, 6), relative: 'E♭ minor' },
  'C♭': { count: 7, type: 'flat', accidentals: FLAT_ORDER.slice(0, 7), relative: 'A♭ minor' },
};

/** Minor keys → same accidentals as their relative major. */
export const MINOR_KEYS: Record<string, KeySig> = {
  'A': { count: 0, type: 'none', accidentals: [], relative: 'C major' },
  'E': { count: 1, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 1), relative: 'G major' },
  'B': { count: 2, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 2), relative: 'D major' },
  'F♯': { count: 3, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 3), relative: 'A major' },
  'C♯': { count: 4, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 4), relative: 'E major' },
  'G♯': { count: 5, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 5), relative: 'B major' },
  'D♯': { count: 6, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 6), relative: 'F♯ major' },
  'A♯': { count: 7, type: 'sharp', accidentals: SHARP_ORDER.slice(0, 7), relative: 'C♯ major' },
  'D': { count: 1, type: 'flat', accidentals: FLAT_ORDER.slice(0, 1), relative: 'F major' },
  'G': { count: 2, type: 'flat', accidentals: FLAT_ORDER.slice(0, 2), relative: 'B♭ major' },
  'C': { count: 3, type: 'flat', accidentals: FLAT_ORDER.slice(0, 3), relative: 'E♭ major' },
  'F': { count: 4, type: 'flat', accidentals: FLAT_ORDER.slice(0, 4), relative: 'A♭ major' },
  'B♭': { count: 5, type: 'flat', accidentals: FLAT_ORDER.slice(0, 5), relative: 'D♭ major' },
  'E♭': { count: 6, type: 'flat', accidentals: FLAT_ORDER.slice(0, 6), relative: 'G♭ major' },
  'A♭': { count: 7, type: 'flat', accidentals: FLAT_ORDER.slice(0, 7), relative: 'C♭ major' },
};

/** Look up a key signature by tonic and mode. Returns null for an unknown key. */
export function keySignature(tonic: string, mode: 'major' | 'minor'): KeySig | null {
  const table = mode === 'major' ? MAJOR_KEYS : MINOR_KEYS;
  return table[tonic] ?? null;
}

/* ---------------- Digital audio: Nyquist & dynamic range ---------------- */

/** Nyquist frequency (Hz) — the highest frequency a sample rate can represent: sampleRate ÷ 2. */
export const nyquistFrequency = (sampleRate: number) => sampleRate / 2;
/** Theoretical dynamic range (dB) of PCM audio at a bit depth: bits × 20·log₁₀(2) ≈ 6.02 dB per bit. */
export const dynamicRangeDb = (bitDepth: number) => bitDepth * 20 * Math.log10(2);

/* ---------------- Room acoustics: reverberation time (Sabine) ---------------- */

export interface ReverbResult {
  volumeM3: number;
  surfaceM2: number;
  sabins: number;
  rt60: number; // seconds
}
/**
 * Reverberation time RT60 (s) by the Sabine equation: RT60 = 0.161 · V / A,
 * with V the room volume (m³) and A the total absorption (sabins) = surface
 * area × average absorption coefficient. Inputs are room length, width and
 * height in metres and an average absorption coefficient (0–1).
 */
export function reverbRT60(lengthM: number, widthM: number, heightM: number, absorption: number): ReverbResult | null {
  if (lengthM <= 0 || widthM <= 0 || heightM <= 0 || absorption <= 0 || absorption > 1) return null;
  const volumeM3 = lengthM * widthM * heightM;
  const surfaceM2 = 2 * (lengthM * widthM + lengthM * heightM + widthM * heightM);
  const sabins = surfaceM2 * absorption;
  return { volumeM3, surfaceM2, sabins, rt60: (0.161 * volumeM3) / sabins };
}
