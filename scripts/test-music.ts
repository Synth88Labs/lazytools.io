import { midiToFreq, freqToMidi, midiToName, nameToMidi, cents, semitones, semitoneRatio, intervalName, beatMs, delayTimes, audioBytes, audioBitrate, barSeconds } from '../src/lib/music.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// A4 = MIDI 69 = 440 Hz
ok('A4 midi69 = 440Hz', approx(midiToFreq(69), 440, 0.001));
// Middle C = C4 = MIDI 60 = 261.626 Hz
ok('C4 midi60 = 261.63Hz', approx(midiToFreq(60), 261.6256, 0.001));
// A5 = 880 (octave up)
ok('A5 = 880Hz', approx(midiToFreq(81), 880, 0.001));
// A=432 tuning
ok('A4 at 432 ref = 432', approx(midiToFreq(69, 432), 432, 0.001));

// freqToMidi inverse
ok('440Hz -> midi 69', approx(freqToMidi(440), 69, 0.001));
ok('freq round trip', approx(freqToMidi(midiToFreq(72), 440), 72, 0.001));

// Note names: middle C = C4
ok('midi60 = C4', midiToName(60).full === 'C4');
ok('midi69 = A4', midiToName(69).full === 'A4');
ok('midi61 sharp = C♯4', midiToName(61).full === 'C♯4');
ok('midi61 flat = D♭4', midiToName(61, true).full === 'D♭4');
// nameToMidi: A(idx9) octave4 = 69
ok('A4 name -> midi 69', nameToMidi(9, 4) === 69);
ok('C4 name -> midi 60', nameToMidi(0, 4) === 60);

// Intervals: octave = 1200 cents = 12 semitones
ok('octave = 1200 cents', approx(cents(440, 880), 1200, 0.001));
ok('octave = 12 semitones', approx(semitones(440, 880), 12, 0.001));
ok('perfect 5th = 700 cents', approx(cents(440, midiToFreq(76)), 700, 0.01));
ok('semitone ratio 12 = 2x', approx(semitoneRatio(12), 2, 0.001));
ok('interval name 7 = Perfect 5th', intervalName(7) === 'Perfect 5th');
ok('interval name 12 = 1 octave', intervalName(12) === '1 octave');

// BPM timing: 120 BPM -> quarter = 500ms
ok('120bpm beat = 500ms', approx(beatMs(120), 500, 0.001));
const d = delayTimes(120, 1); // quarter at 120
ok('120bpm quarter straight = 500ms', approx(d.straight, 500, 0.001));
ok('dotted quarter = 750ms', approx(d.dotted, 750, 0.001));
ok('triplet quarter = 333.3ms', approx(d.triplet, 333.333, 0.01));

// Audio size: 44100 Hz, 16-bit, stereo, 60s = 44100*2*2*60 = 10,584,000 bytes
ok('CD 60s = 10.584 MB', approx(audioBytes(44100, 16, 2, 60), 10584000, 1));
ok('CD bitrate = 1411200', approx(audioBitrate(44100, 16, 2), 1411200, 1));

// Bar: 4/4 at 120bpm = 4 beats * 0.5s = 2s
ok('4/4 @120 = 2s bar', approx(barSeconds(120, 4, 4), 2, 0.001));
// 6/8 at 120bpm: 6*(4/8)*(0.5) = 6*0.5*0.5 = 1.5s
ok('6/8 @120 = 1.5s bar', approx(barSeconds(120, 6, 8), 1.5, 0.001));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
