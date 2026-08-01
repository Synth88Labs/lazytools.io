import { COMPUTE } from '../src/lib/calc-compute.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- cholesterol ----
// Total cholesterol 200 mg/dL ÷ 38.67 = 5.17 mmol/L
const c1 = COMPUTE.cholesterol({ value: '200', kind: 'chol', unit: 'mgdl' })!;
ok('chol 200 mg/dL → 5.17 mmol/L', c1[0].value === '5.17');
// 5 mmol/L × 38.67 = 193 mg/dL
const c2 = COMPUTE.cholesterol({ value: '5', kind: 'chol', unit: 'mmol' })!;
ok('chol 5 mmol/L → 193 mg/dL', c2[0].value === '193');
// Triglycerides 150 mg/dL ÷ 88.57 = 1.69 mmol/L
const c3 = COMPUTE.cholesterol({ value: '150', kind: 'trig', unit: 'mgdl' })!;
ok('trig 150 mg/dL → 1.69 mmol/L', c3[0].value === '1.69');
ok('chol rejects blank', COMPUTE.cholesterol({ value: '', kind: 'chol', unit: 'mgdl' }) === null);

// ---- creatinine ----
// 1 mg/dL × 88.42 = 88 µmol/L
const cr1 = COMPUTE.creatinine({ value: '1', unit: 'mgdl' })!;
ok('creat 1 mg/dL → 88 µmol/L', cr1[0].value === '88');
// 0.9 mg/dL × 88.42 = 79.6 → 80 µmol/L
const cr2 = COMPUTE.creatinine({ value: '0.9', unit: 'mgdl' })!;
ok('creat 0.9 mg/dL → 80 µmol/L', cr2[0].value === '80');
// 88.42 µmol/L ÷ 88.42 = 1.00 mg/dL
const cr3 = COMPUTE.creatinine({ value: '88.42', unit: 'umol' })!;
ok('creat 88.42 µmol/L → 1 mg/dL', cr3[0].value === '1');

// ---- IV drip rate ----
// 1000 mL over 480 min with 15 gtt/mL set = (1000×15)/480 = 31.25 → 31 gtt/min; 125 mL/hr
const iv1 = COMPUTE.ivDripRate({ volume: '1000', time: '480', drop: '15' })!;
ok('iv 1000mL/480min/15gtt → 31 gtt/min', iv1[0].value === '31 gtt/min');
ok('iv flow 125 mL/hr', iv1[2].value === '125 mL/hr');
// 100 mL over 30 min with 60 gtt/mL (microdrip) = (100×60)/30 = 200 gtt/min; 200 mL/hr
const iv2 = COMPUTE.ivDripRate({ volume: '100', time: '30', drop: '60' })!;
ok('iv microdrip → 200 gtt/min', iv2[0].value === '200 gtt/min');
ok('iv rejects zero time', COMPUTE.ivDripRate({ volume: '100', time: '0', drop: '20' }) === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
