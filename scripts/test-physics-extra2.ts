/** Node test for the new physics-extra fns — run: node --experimental-strip-types scripts/test-physics-extra2.ts */
import { pressureSolve, buoyancy, escapeVelocity, latentHeat } from '../src/lib/physics-extra.ts';

let pass = 0, fail = 0;
const ok = (n: string, c: boolean, g?: unknown) => { c ? pass++ : (fail++, console.error(`FAIL: ${n}` + (g !== undefined ? ` (${JSON.stringify(g)})` : ''))); };
const rel = (a: number, b: number, t = 1e-3) => Math.abs(a - b) <= t * Math.abs(b);

// Pressure
ok('P = F/A: 100N/2m² = 50Pa', pressureSolve(100, 2, null)!.value === 50);
ok('F = P·A: 50Pa·2m² = 100N', pressureSolve(null, 2, 50)!.value === 100);
ok('A = F/P: 100N/50Pa = 2m²', pressureSolve(100, null, 50)!.value === 2);
ok('pressure solved label', pressureSolve(100, 2, null)!.solved === 'P');

// Buoyancy: 1 m³ in water (1000 kg/m³) → 9806.65 N
{
  const b = buoyancy(1000, 1);
  ok('buoyant force 1m³ water ≈ 9806.65 N', rel(b.buoyantForce, 9806.65), b.buoyantForce);
  // object 500 kg in that 1 m³ → floats (weight 4903 < 9807)
  const b2 = buoyancy(1000, 1, 9.80665, 500);
  ok('500kg/1m³ floats', b2.floats === true);
  const b3 = buoyancy(1000, 1, 9.80665, 1500);
  ok('1500kg/1m³ sinks', b3.floats === false);
}

// Escape velocity: Earth M=5.972e24, r=6.371e6 → ~11.19 km/s
ok('Earth escape ≈ 11186 m/s', rel(escapeVelocity(5.972e24, 6.371e6)!, 11186, 2e-3), escapeVelocity(5.972e24, 6.371e6));
// Moon M=7.342e22, r=1.7374e6 → ~2.38 km/s
ok('Moon escape ≈ 2380 m/s', rel(escapeVelocity(7.342e22, 1.7374e6)!, 2380, 5e-3), escapeVelocity(7.342e22, 1.7374e6));
ok('escape r=0 → null', escapeVelocity(1e24, 0) === null);

// Latent heat: melt 2 kg ice, Lf=334000 → 668000 J
ok('latent heat 2kg × 334kJ/kg = 668000 J', latentHeat(2, 334000) === 668000);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
