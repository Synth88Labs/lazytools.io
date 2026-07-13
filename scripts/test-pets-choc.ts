import assert from 'node:assert';
import { chocolateToxicity, THEOBROMINE_MG_PER_G } from '../src/lib/pets.ts';

const near = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

// Milk chocolate 2.06 mg/g: 100 g eaten by a 10 kg dog → 206 mg, 20.6 mg/kg → mild
let r = chocolateToxicity('milk', 100, 10)!;
near(r.theobromineMg, 206);
near(r.dosePerKg, 20.6);
assert.strictEqual(r.risk, 'mild');

// White chocolate is essentially harmless (theobromine)
r = chocolateToxicity('white', 500, 10)!;
assert.strictEqual(r.risk, 'none');

// Dark 5.36 mg/g: 100 g in a 10 kg dog → 53.6 mg/kg → moderate
r = chocolateToxicity('dark', 100, 10)!;
near(r.dosePerKg, 53.6);
assert.strictEqual(r.risk, 'moderate');

// Baking chocolate, large dose, small dog → lethal band
r = chocolateToxicity('baking', 100, 5)!;
assert.ok(r.dosePerKg >= 100);
assert.strictEqual(r.risk, 'lethal');

// Band boundaries (severe starts at 60)
assert.strictEqual(chocolateToxicity('dark', 112, 10)!.risk, 'severe'); // 60.0 mg/kg
assert.strictEqual(chocolateToxicity('dark', 111, 10)!.risk, 'moderate'); // 59.5 mg/kg

// Just under mild threshold stays none
assert.strictEqual(chocolateToxicity('cocoa', 15, 20)!.risk, 'none'); // 19.5 mg/kg

// Guards
assert.strictEqual(chocolateToxicity('nope', 100, 10), null);
assert.strictEqual(chocolateToxicity('milk', 0, 10), null);
assert.strictEqual(chocolateToxicity('milk', 100, 0), null);

// Data sanity: ordering white < milk < dark < baking < cocoa
const m = THEOBROMINE_MG_PER_G;
assert.ok(m.white.mg < m.milk.mg && m.milk.mg < m.dark.mg && m.dark.mg < m.baking.mg && m.baking.mg < m.cocoa.mg);

console.log('pets-choc: all assertions passed');
