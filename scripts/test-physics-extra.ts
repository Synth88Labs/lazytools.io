/**
 * Node test for src/lib/physics-extra.ts — run:
 *   node --experimental-strip-types scripts/test-physics-extra.ts
 */
import {
  coulombForce, coulombDistance, electricField, collision1d, relativity,
  dilatedTime, contractedLength, relativisticKE, totalEnergy,
  harmonics, fundamental, COULOMB_K, SPEED_OF_LIGHT,
} from '../src/lib/physics-extra.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;
const rel = (a: number, b: number, tol = 1e-4) => Math.abs(a - b) <= tol * Math.abs(b);

// --- Coulomb: two +1 C charges 1 m apart → F = k ≈ 8.99e9 N, repulsive
const c1 = coulombForce(1, 1, 1)!;
ok('Coulomb 1C@1m = k', near(c1.force, COULOMB_K, 1e-3), c1.force);
ok('Coulomb +/+ repulsive', !c1.attractive);
// opposite charges attract (negative force)
const c2 = coulombForce(1, -1, 1)!;
ok('Coulomb +/- attractive', c2.attractive && c2.force < 0);
// 1 µC and 1 µC at 0.1 m → F = k·(1e-6)²/0.01 ≈ 0.899 N
const c3 = coulombForce(1e-6, 1e-6, 0.1)!;
ok('Coulomb 1µC@0.1m ≈ 0.899 N', rel(c3.magnitude, 0.8988, 1e-3), c3.magnitude);
ok('Coulomb invalid r', coulombForce(1, 1, 0) === null);
// distance solve round-trip
ok('Coulomb distance round-trip', rel(coulombDistance(1e-6, 1e-6, c3.magnitude)!, 0.1, 1e-6));
// field of 1 C at 1 m = k
ok('E field 1C@1m = k', near(electricField(1, 1)!, COULOMB_K, 1e-3));

// --- Elastic collision: m1=2 u1=3, m2=1 u2=0 → v1=1, v2=4 (momentum + KE conserved)
const el = collision1d(2, 3, 1, 0, 1)!;
ok('elastic v1 = 1', near(el.v1, 1, 1e-9), el.v1);
ok('elastic v2 = 4', near(el.v2, 4, 1e-9), el.v2);
ok('elastic momentum conserved', near(el.momentum, 6) && near(el.keAfter, el.keBefore, 1e-9));
ok('elastic no KE lost', near(el.keLost, 0, 1e-9));
// equal masses elastic → velocities swap
const sw = collision1d(1, 5, 1, -2, 1)!;
ok('equal-mass elastic swaps', near(sw.v1, -2) && near(sw.v2, 5));
// perfectly inelastic: stick together, common velocity = p/M
const inel = collision1d(2, 3, 1, 0, 0)!;
ok('inelastic v1 = v2 = 2', near(inel.v1, 2) && near(inel.v2, 2));
ok('inelastic loses KE', inel.keLost > 0);
ok('collision invalid mass', collision1d(0, 3, 1, 0) === null);

// --- Relativity: β = 0.8 → γ = 1.6667
const r = relativity(0.8 * SPEED_OF_LIGHT)!;
ok('gamma at 0.8c = 1.6667', rel(r.gamma, 5 / 3, 1e-9), r.gamma);
ok('beta = 0.8', near(r.beta, 0.8, 1e-12));
ok('time dilation ×gamma', near(dilatedTime(10, r.gamma), 10 * 5 / 3, 1e-9));
ok('length contraction /gamma', near(contractedLength(10, r.gamma), 10 * 3 / 5, 1e-9));
ok('relativity invalid v>=c', relativity(SPEED_OF_LIGHT) === null);
ok('gamma at rest = 1', near(relativity(0)!.gamma, 1));
// KE of 1 kg at 0.8c = (γ-1)mc² = (2/3)·c² ≈ 5.99e16 J
ok('rel KE 1kg@0.8c', rel(relativisticKE(1, r.gamma), (5 / 3 - 1) * SPEED_OF_LIGHT ** 2, 1e-9));
ok('total E > KE', totalEnergy(1, r.gamma) > relativisticKE(1, r.gamma));

// --- Harmonics: string L=0.65 m, v=400 m/s → f1 = 307.7 Hz, f2 = 615.4 …
const hs = harmonics('string', 400, 0.65, 5)!;
ok('string f1 ≈ 307.7', rel(hs[0].frequency, 400 / 1.3, 1e-9), hs[0].frequency);
ok('string f2 = 2·f1', near(hs[1].frequency, 2 * hs[0].frequency, 1e-9));
ok('string harmonics n=1..5', hs.map((h) => h.n).join(',') === '1,2,3,4,5');
ok('string wavelength λ1 = 2L', near(hs[0].wavelength, 1.3, 1e-9));
// closed pipe: only odd harmonics, f1 = v/4L
const hc = harmonics('closedPipe', 340, 0.5, 4)!;
ok('closed pipe f1 = v/4L = 170', near(hc[0].frequency, 340 / (4 * 0.5), 1e-9), hc[0].frequency);
ok('closed pipe odd harmonics', hc.map((h) => h.n).join(',') === '1,3,5,7');
ok('fundamental string = v/2L', near(fundamental('string', 400, 0.65)!, 400 / 1.3, 1e-9));
ok('fundamental closed = v/4L', near(fundamental('closedPipe', 340, 0.5)!, 170, 1e-9));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
