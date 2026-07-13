import assert from 'node:assert';
import { bufferLatencyMs, keySignature, MAJOR_KEYS, MINOR_KEYS } from '../src/lib/music.ts';

const near = (a: number, b: number, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Buffer latency: 512 samples at 48 kHz = 10.6667 ms
near(bufferLatencyMs(512, 48000), 512 / 48000 * 1000);
near(bufferLatencyMs(128, 44100), 2.90249433106576);
near(bufferLatencyMs(256, 48000), 256 / 48000 * 1000);

// Key signatures — canonical facts
let k = keySignature('C', 'major')!;
assert.strictEqual(k.count, 0); assert.strictEqual(k.relative, 'A minor');
k = keySignature('G', 'major')!;
assert.strictEqual(k.count, 1); assert.strictEqual(k.type, 'sharp');
assert.deepStrictEqual(k.accidentals, ['F♯']); assert.strictEqual(k.relative, 'E minor');
k = keySignature('F', 'major')!;
assert.strictEqual(k.count, 1); assert.strictEqual(k.type, 'flat');
assert.deepStrictEqual(k.accidentals, ['B♭']);
k = keySignature('E♭', 'major')!;
assert.strictEqual(k.count, 3); assert.deepStrictEqual(k.accidentals, ['B♭', 'E♭', 'A♭']);

// Minor: A minor has no accidentals, relative C major
k = keySignature('A', 'minor')!;
assert.strictEqual(k.count, 0); assert.strictEqual(k.relative, 'C major');
k = keySignature('E', 'minor')!;
assert.strictEqual(k.count, 1); assert.strictEqual(k.type, 'sharp'); assert.strictEqual(k.relative, 'G major');

// Relative-key consistency: a major key's relative minor shares its accidental count
for (const [name, sig] of Object.entries(MAJOR_KEYS)) {
  const minorTonic = sig.relative.replace(' minor', '');
  const minorSig = MINOR_KEYS[minorTonic];
  assert.ok(minorSig, `missing relative minor ${minorTonic} of ${name} major`);
  assert.strictEqual(minorSig!.count, sig.count, `count mismatch for ${name} major / ${minorTonic} minor`);
}

// Unknown key → null
assert.strictEqual(keySignature('H', 'major'), null);

console.log('music-r2: all assertions passed');
