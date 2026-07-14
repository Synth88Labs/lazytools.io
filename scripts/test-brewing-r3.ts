import assert from 'node:assert';
import { mashEfficiency, sgToPlato, yeastCells } from '../src/lib/brewing.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);
const rel = (a: number, b: number, tol = 1e-3) => assert.ok(Math.abs(a - b) / b < tol, `${a} !~ ${b}`);

// Mash efficiency: OG 1.050, 10 lb grain, 36 PPG, 5 gal → 50 / (360/5=72) = 69.44%
rel(mashEfficiency(1.050, 10, 36, 5)!, (50 / 72) * 100, 1e-9);
assert.ok(Math.abs(mashEfficiency(1.050, 10, 36, 5)! - 69.44) < 0.01);
// more grain for same OG → lower efficiency
assert.ok(mashEfficiency(1.050, 12, 36, 5)! < mashEfficiency(1.050, 10, 36, 5)!);
// guards
assert.strictEqual(mashEfficiency(1.000, 10, 36, 5), null);
assert.strictEqual(mashEfficiency(1.050, 0, 36, 5), null);

// SG → Plato: 1.050 ≈ 12.4 °P, 1.000 ≈ 0
rel(sgToPlato(1.050), 12.39, 5e-3);
assert.ok(Math.abs(sgToPlato(1.000)) < 0.05);

// Yeast cells: 20 L, OG 1.050, rate 0.75 → ~186 billion
let y = yeastCells(20, 1.050, 0.75)!;
rel(y.plato, sgToPlato(1.050), 1e-9);
rel(y.cellsBillion, (0.75 * 20000 * sgToPlato(1.050)) / 1000, 1e-9);
assert.ok(Math.abs(y.cellsBillion - 185.8) < 1);
rel(y.liquidPacks, y.cellsBillion / 100, 1e-9);
rel(y.dryGrams, y.cellsBillion / 10, 1e-9);
// lager rate (1.5) needs double the ale rate (0.75)
rel(yeastCells(20, 1.050, 1.5)!.cellsBillion, 2 * yeastCells(20, 1.050, 0.75)!.cellsBillion, 1e-9);
// higher gravity → more cells
assert.ok(yeastCells(20, 1.080, 0.75)!.cellsBillion > yeastCells(20, 1.050, 0.75)!.cellsBillion);
// guards
assert.strictEqual(yeastCells(0, 1.050, 0.75), null);
assert.strictEqual(yeastCells(20, 1.000, 0.75), null);

console.log('brewing-r3: all assertions passed');
