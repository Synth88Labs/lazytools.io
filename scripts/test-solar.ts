/**
 * Node test for src/lib/solar.ts — run:
 *   node --experimental-strip-types scripts/test-solar.ts
 */
import {
  solarProduction, panelsForTarget, dailyLoadWh, batteryBank, inverterSize,
  voltageDrop, currentForLoad, chargeTime, applianceCost, solarPayback,
  DOD_PRESETS, APPLIANCE_PRESETS, COPPER_RESISTIVITY,
} from '../src/lib/solar.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;

// --- Solar production: 400 W × 4.5 sun-hours × 0.8 derate = 1.44 kWh/day
const p = solarProduction(400, 4.5, 0.8)!;
ok('production 400W×4.5×0.8 = 1.44 kWh', near(p.dailyKwh, 1.44));
ok('monthly ≈ 43.8 kWh', near(p.monthlyKwh, 1.44 * 30.4368, 1e-6));
ok('annual ≈ 526 kWh', near(p.annualKwh, 1.44 * 365.25, 1e-6));
ok('production invalid derate', solarProduction(400, 4.5, 0) === null);

// panels for 2 kWh/day target, 400 W panels, 4.5 sh, 0.8: perPanel=1.44 → 1.39 panels
ok('panels for 2 kWh ≈ 1.39', near(panelsForTarget(2, 400, 4.5, 0.8)!, 2 / 1.44, 1e-9));

// --- Daily load: 2×10W bulbs 5h + 1×150W fridge 24h = 100 + 3600 = 3700 Wh
const load = dailyLoadWh([
  { name: 'bulb', watts: 10, hoursPerDay: 5, qty: 2 },
  { name: 'fridge', watts: 150, hoursPerDay: 24, qty: 1 },
]);
ok('daily load 3700 Wh', near(load, 3700));

// --- Battery bank: 3700 Wh load, 2 days, 50% DoD, 24V
// usable = 7400, nominal = 14800, Ah = 616.67
const bb = batteryBank(3700, 2, 0.5, 24)!;
ok('bank usable 7400 Wh', near(bb.usableWh, 7400));
ok('bank nominal 14800 Wh', near(bb.nominalWh, 14800));
ok('bank Ah ≈ 616.7', near(bb.ampHours, 14800 / 24, 1e-9));
// lithium 80% DoD gives smaller bank
const bbLi = batteryBank(3700, 2, 0.8, 24)!;
ok('lithium bank smaller than lead', bbLi.nominalWh < bb.nominalWh);
ok('bank invalid dod>1', batteryBank(3700, 2, 1.5, 24) === null);

// --- Inverter: 1500 W running, 4000 W surge, 1.25 headroom
// continuous = 1875, surge = max(4000, 1875) = 4000
const inv = inverterSize(1500, 4000, 1.25)!;
ok('inverter continuous 1875', near(inv.continuous, 1875));
ok('inverter surge 4000', near(inv.surge, 4000));
// when surge input small, uses headroom continuous
ok('inverter surge floor', inverterSize(1500, 0, 1.25)!.surge === 1875);

// --- Voltage drop: 10 m run, 20 A, 6 mm², 12 V, copper
// Vdrop = 2×10×20×1.68e-8 / 6e-6 = 6.72e-6/6e-6... compute: numerator=2*10*20*1.68e-8=6.72e-6; /6e-6=1.12 V
const vd = voltageDrop(10, 20, 6, 12)!;
ok('voltage drop ≈ 1.12 V', near(vd.drop, (2 * 10 * 20 * COPPER_RESISTIVITY) / 6e-6, 1e-9), vd.drop.toFixed(4));
ok('voltage drop % ≈ 9.3', near(vd.percent, (vd.drop / 12) * 100, 1e-9));
ok('end voltage = 12 - drop', near(vd.endVoltage, 12 - vd.drop));
ok('voltage drop invalid area', voltageDrop(10, 20, 0, 12) === null);

// currentForLoad: 1200 W at 24 V = 50 A
ok('current 1200W/24V = 50A', near(currentForLoad(1200, 24), 50));

// --- Charge time: 100 Ah, 20 A charger, 1.15 ineff → 5.75 h; C-rate 0.2
const ct = chargeTime(100, 20, 1.15)!;
ok('charge time 5.75 h', near(ct.hours, 5.75));
ok('C-rate 0.2', near(ct.cRate, 0.2));
ok('charge invalid', chargeTime(100, 0) === null);

// --- Appliance cost: 150 W fridge 24h at $0.30/kWh
// daily kWh = 3.6, cost = 1.08
const ac = applianceCost(150, 24, 0.30)!;
ok('appliance daily 3.6 kWh', near(ac.dailyKwh, 3.6));
ok('appliance daily cost 1.08', near(ac.dailyCost, 1.08));
ok('appliance annual kWh ≈ 1314.9', near(ac.annualKwh, 3.6 * 365.25, 1e-9));

// --- Payback: $10000 net, 5000 kWh/yr, $0.30 → savings 1500/yr, payback 6.67 yr
const pb = solarPayback(10000, 5000, 0.30)!;
ok('payback annual savings 1500', near(pb.annualSavings, 1500));
ok('payback 6.67 yr', near(pb.paybackYears, 10000 / 1500, 1e-9));
ok('payback 25yr savings', near(pb.savings25yr, 1500 * 25 - 10000));
ok('payback invalid zero production', solarPayback(10000, 0, 0.30) === null);

// --- Reference tables
ok('DoD presets = 3', DOD_PRESETS.length === 3);
ok('lithium DoD 0.8', DOD_PRESETS.find((d) => d.name.includes('LiFePO4'))!.dod === 0.8);
ok('appliance presets ≥ 10', APPLIANCE_PRESETS.length >= 10, APPLIANCE_PRESETS.length);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
