import assert from 'node:assert';
import { nyquistFrequency, dynamicRangeDb, reverbRT60 } from '../src/lib/music.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-3) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// Nyquist: 44.1kHz → 22.05kHz, 48kHz → 24kHz
near(nyquistFrequency(44100), 22050);
near(nyquistFrequency(48000), 24000);
near(nyquistFrequency(96000), 48000);

// Dynamic range: 16-bit ≈ 96.3 dB, 24-bit ≈ 144.5 dB
rel(dynamicRangeDb(16), 96.33, 1e-3);
rel(dynamicRangeDb(24), 144.49, 1e-3);
near(dynamicRangeDb(1), 20 * Math.log10(2));

// Reverb RT60 (Sabine): 5×4×3 m room, absorption 0.2
// V = 60, S = 2(20+15+12) = 94, A = 94×0.2 = 18.8, RT60 = 0.161×60/18.8 = 0.5138
let r = reverbRT60(5, 4, 3, 0.2)!;
near(r.volumeM3, 60);
near(r.surfaceM2, 94);
near(r.sabins, 18.8);
rel(r.rt60, (0.161 * 60) / 18.8, 1e-9);
assert.ok(Math.abs(r.rt60 - 0.514) < 0.001);
// more absorption → shorter RT60
assert.ok(reverbRT60(5, 4, 3, 0.4)!.rt60 < reverbRT60(5, 4, 3, 0.2)!.rt60);
// bigger room → longer RT60
assert.ok(reverbRT60(10, 8, 6, 0.2)!.rt60 > reverbRT60(5, 4, 3, 0.2)!.rt60);
// guards
assert.strictEqual(reverbRT60(0, 4, 3, 0.2), null);
assert.strictEqual(reverbRT60(5, 4, 3, 0), null);
assert.strictEqual(reverbRT60(5, 4, 3, 1.5), null);

console.log('music-r3: all assertions passed');
