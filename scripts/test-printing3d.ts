/**
 * Node test for src/lib/printing3d.ts — run:
 *   node --experimental-strip-types scripts/test-printing3d.ts
 */
import {
  filamentArea, filamentConvert, filamentCost, printEnergy, scaleModel,
  fitScalePercent, calibrateEsteps, calibrateFlow, volumetricFlow,
  maxSpeedForFlow, resinCost, materialByName, MATERIALS,
} from '../src/lib/printing3d.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// --- Filament area: 1.75 mm → π(0.875)² ≈ 2.405 mm²
ok('area 1.75mm ≈ 2.405', near(filamentArea(1.75), Math.PI * 0.875 ** 2, 1e-9));

// --- The classic sanity check: a 1 kg PLA (1.24) 1.75 mm spool ≈ 330 m.
// grams/m = area(2.405) × density(1.24) ≈ 2.983 g/m → 1000 g / 2.983 ≈ 335 m
const pla = filamentConvert({ weightG: 1000, density: 1.24, diameterMm: 1.75 })!;
ok('1kg PLA 1.75mm ≈ 330–340 m', pla.lengthM > 330 && pla.lengthM < 340, pla.lengthM.toFixed(1));
ok('1kg PLA volume ≈ 806 cm³', near(pla.volumeCm3, 1000 / 1.24, 1e-6), pla.volumeCm3.toFixed(1));

// Round-trip: length → weight → length
const byLen = filamentConvert({ lengthM: pla.lengthM, density: 1.24, diameterMm: 1.75 })!;
ok('round-trip weight ≈ 1000 g', near(byLen.weightG, 1000, 1e-6), byLen.weightG.toFixed(3));

// A 1 kg ABS (1.04) 1.75mm spool is LONGER (lower density) ≈ 400 m
const abs = filamentConvert({ weightG: 1000, density: 1.04, diameterMm: 1.75 })!;
ok('ABS spool longer than PLA', abs.lengthM > pla.lengthM);

// 2.85 mm filament: same weight → much shorter (bigger cross-section)
const pla285 = filamentConvert({ weightG: 1000, density: 1.24, diameterMm: 2.85 })!;
ok('2.85mm shorter than 1.75mm', pla285.lengthM < pla.lengthM * 0.4, pla285.lengthM.toFixed(1));

ok('convert invalid density', filamentConvert({ weightG: 1000, density: 0, diameterMm: 1.75 }) === null);
ok('convert needs one input', filamentConvert({ density: 1.24, diameterMm: 1.75 }) === null);

// --- Cost: 25 g of PLA at $20/kg = $0.50
ok('cost 25g @ $20/kg = 0.50', near(filamentCost(25, 20)!, 0.5));
ok('cost 1kg @ $20 = 20', near(filamentCost(1000, 20)!, 20));

// --- Electricity: 120 W for 5 h = 0.6 kWh; @ $0.30 = $0.18
const e = printEnergy(120, 5, 0.30)!;
ok('energy 0.6 kWh', near(e.kwh, 0.6));
ok('energy cost 0.18', near(e.cost, 0.18));

// --- Scaling: 200% → factor 2, volume ×8; 50 mm → 100 mm
const s = scaleModel(200, { x: 50, y: 20, z: 10 })!;
ok('scale factor 2', near(s.factor, 2));
ok('scale volume ×8', near(s.volumeFactor, 8));
ok('scale x 50→100', near(s.dims.x!, 100));
ok('scale invalid', scaleModel(0) === null);

// fit: original 250 mm into 220 mm bed = 88%
ok('fit 250→220 = 88%', near(fitScalePercent(250, 220)!, 88));

// --- E-steps: asked 100, got 95, current 93 → 93 × 100/95 ≈ 97.89
ok('esteps 93×100/95', near(calibrateEsteps(93, 100, 95)!, 93 * 100 / 95, 1e-9));
ok('esteps perfect = unchanged', near(calibrateEsteps(415, 100, 100)!, 415));

// --- Flow: current 100%, target 0.40, measured 0.42 → 100 × 0.40/0.42 ≈ 95.24
ok('flow 100×0.40/0.42', near(calibrateFlow(100, 0.40, 0.42)!, 100 * 0.40 / 0.42, 1e-9));

// --- Volumetric flow: 0.2 × 0.4 × 60 = 4.8 mm³/s
ok('vol flow 0.2×0.4×60 = 4.8', near(volumetricFlow(0.2, 0.4, 60)!, 4.8));
// max speed for 15 mm³/s at 0.2×0.4 line = 187.5 mm/s
ok('max speed 15/(0.2×0.4)=187.5', near(maxSpeedForFlow(15, 0.2, 0.4)!, 187.5));

// --- Resin: 30 mL at $50/L, density 1.12 → cost $1.50, weight 33.6 g
const r = resinCost(30, 50, 1.12)!;
ok('resin cost 30mL @ $50/L = 1.50', near(r.cost, 1.5));
ok('resin weight 33.6 g', near(r.weightG, 33.6, 1e-9));
// with 10% waste: 33 mL
const rw = resinCost(30, 50, 1.12, 10)!;
ok('resin +10% waste = 33 mL', near(rw.volumeMl, 33));

// --- Materials table
ok('materials ≥ 12', MATERIALS.length >= 12, MATERIALS.length);
ok('PLA density 1.24', materialByName('PLA')!.density === 1.24);
ok('PETG density 1.27', materialByName('PETG')!.density === 1.27);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
