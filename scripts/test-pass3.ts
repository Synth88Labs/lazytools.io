import { compareLists } from '../src/lib/list-ops.ts';
import { parseIso8601Duration, secondsToIso8601, secondsToHms, secondsToHuman } from '../src/lib/iso-duration.ts';
import { COMPUTE } from '../src/lib/calc-compute.ts';
import { CONVERT } from '../src/lib/file-compute.ts';
import { DEV } from '../src/lib/dev-compute.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// ---- compareLists ----
const A = 'apple\nbanana\ncherry\nbanana';
const B = 'banana\ncherry\ndate';
const c1 = compareLists(A, B);
ok('common', JSON.stringify(c1.common) === JSON.stringify(['banana', 'cherry']));
ok('onlyA', JSON.stringify(c1.onlyA) === JSON.stringify(['apple']));
ok('onlyB', JSON.stringify(c1.onlyB) === JSON.stringify(['date']));
ok('union', JSON.stringify(c1.union) === JSON.stringify(['apple', 'banana', 'cherry', 'date']));
ok('dedupes within a list', compareLists('x\nx\ny', 'x').union.length === 2);
const cs = compareLists('Apple', 'apple', { caseSensitive: false });
ok('case-insensitive common', cs.common.length === 1);
const cS = compareLists('Apple', 'apple', { caseSensitive: true });
ok('case-sensitive not common', cS.common.length === 0);
ok('trim on by default', compareLists(' a ', 'a').common.length === 1);

// ---- iso-duration ----
ok('parse PT1H30M', parseIso8601Duration('PT1H30M') === 5400);
ok('parse PT45S', parseIso8601Duration('PT45S') === 45);
ok('parse P1DT2H', parseIso8601Duration('P1DT2H') === 93600);
ok('parse P1W', parseIso8601Duration('P1W') === 604800);
ok('months vs minutes (P1M vs PT1M)', parseIso8601Duration('P1M') === 2592000 && parseIso8601Duration('PT1M') === 60);
ok('invalid returns null', parseIso8601Duration('1h30m') === null && parseIso8601Duration('P') === null && parseIso8601Duration('PT') === null);
ok('secondsToIso 5400', secondsToIso8601(5400) === 'PT1H30M');
ok('secondsToIso 0', secondsToIso8601(0) === 'PT0S');
ok('secondsToIso 90061', secondsToIso8601(90061) === 'P1DT1H1M1S');
ok('secondsToHms 5400', secondsToHms(5400) === '01:30:00');
ok('secondsToHms with days', secondsToHms(93600) === '1:02:00:00');
ok('secondsToHuman', secondsToHuman(5400) === '1h 30m');
ok('iso round trip', secondsToIso8601(parseIso8601Duration('P1DT2H30M15S')!) === 'P1DT2H30M15S');

// ---- calc: bloodSugar ----
const bs1 = COMPUTE.bloodSugar({ value: '140', unit: 'mgdl' })!;
ok('140 mg/dL → 7.8 mmol/L', bs1[0].value === '7.8');
const bs2 = COMPUTE.bloodSugar({ value: '7', unit: 'mmol' })!;
ok('7 mmol/L → 126 mg/dL', bs2[0].value === '126');
ok('bloodSugar rejects blank', COMPUTE.bloodSugar({ value: '', unit: 'mgdl' }) === null);

// ---- calc: hba1c ----
const h1 = COMPUTE.hba1c({ value: '7', unit: 'ngsp' })!;
ok('hba1c 7% → IFCC 53', h1[1].value === '53 mmol/mol');
ok('hba1c 7% → eAG 154', h1[2].value.startsWith('154 mg/dL'));
const h2 = COMPUTE.hba1c({ value: '53', unit: 'ifcc' })!;
ok('hba1c 53 mmol/mol → ~7%', h2[0].value === '7%');

// ---- file: jsonl ----
ok('jsonlToJson defined', typeof CONVERT.jsonlToJson === 'function');
const jl = CONVERT.jsonlToJson('{"a":1}\n{"a":2}\n', {});
ok('jsonl → array', JSON.parse(jl.output).length === 2 && JSON.parse(jl.output)[1].a === 2);
const jj = CONVERT.jsonToJsonl('[{"a":1},{"b":2}]', {});
ok('array → jsonl', jj.output === '{"a":1}\n{"b":2}');
let threwJ = false; try { CONVERT.jsonToJsonl('{"a":1}', {}); } catch { threwJ = true; }
ok('jsonToJsonl rejects non-array', threwJ);
let threwL = false; try { CONVERT.jsonlToJson('{"a":1}\nnot json', {}); } catch { threwL = true; }
ok('jsonlToJson reports bad line', threwL);

// ---- dev: isoDuration transform ----
const d1 = DEV.isoDuration('PT2H', { mode: 'parse' });
ok('dev isoDuration parse', d1.output.startsWith('7200 seconds'));
const d2 = DEV.isoDuration('3661', { mode: 'build' });
ok('dev isoDuration build', d2.output === 'PT1H1M1S');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
