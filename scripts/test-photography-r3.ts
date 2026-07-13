import assert from 'node:assert';
import { ndShutter, airyDiskUm, pixelPitchUm, diffractionApertureN } from '../src/lib/photography.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-4) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// ND filter: each stop doubles the time
near(ndShutter(1, 10)!, 1024);          // 10-stop ND: 1s → 1024s
near(ndShutter(1 / 60, 10)!, 1024 / 60); // ~17 s
near(ndShutter(0.5, 6)!, 32);           // 6-stop: 0.5s → 32s
near(ndShutter(2, 0)!, 2);              // 0 stops unchanged
// guards
assert.strictEqual(ndShutter(0, 5), null);
assert.strictEqual(ndShutter(1, -1), null);

// Airy disk: d = 2.44·λ·N. At f/8 with λ=0.55µm → 10.736 µm
near(airyDiskUm(8)!, 2.44 * 0.55 * 8);
rel(airyDiskUm(8)!, 10.736, 1e-3);
// larger f-number → bigger disk
assert.ok(airyDiskUm(16)! > airyDiskUm(8)!);
assert.strictEqual(airyDiskUm(0), null);

// Pixel pitch: full-frame 36mm wide, 6000px → 6 µm
near(pixelPitchUm(36, 6000)!, 6);
near(pixelPitchUm(23.5, 6000)!, (23.5 / 6000) * 1000);
assert.strictEqual(pixelPitchUm(36, 0), null);

// Diffraction aperture: N where Airy = pixel pitch. For 6 µm pixels → N = 6/(2.44·0.55) ≈ f/4.47
rel(diffractionApertureN(6)!, 6 / (2.44 * 0.55), 1e-9);
assert.ok(Math.abs(diffractionApertureN(6)! - 4.47) < 0.02);
// bigger pixels tolerate smaller apertures (higher N) before diffraction
assert.ok(diffractionApertureN(9)! > diffractionApertureN(6)!);
assert.strictEqual(diffractionApertureN(0), null);

console.log('photography-r3: all assertions passed');
