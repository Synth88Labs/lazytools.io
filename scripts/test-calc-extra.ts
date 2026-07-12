/** Node test for new calc computes — run: node --experimental-strip-types scripts/test-calc-extra.ts */
import { COMPUTE } from '../src/lib/calc-compute.ts';

let pass = 0, fail = 0;
const ok = (n: string, c: boolean, g?: unknown) => { c ? pass++ : (fail++, console.error(`FAIL: ${n}` + (g !== undefined ? ` (${JSON.stringify(g)})` : ''))); };

// testGrade
{
  const r = COMPUTE.testGrade({ correct: '45', total: '50' })!;
  ok('45/50 = 90%', r[0].value === '90%', r[0].value);
  ok('45/50 letter A−', r[1].value === 'A−', r[1].value);
  ok('45/50 wrong = 5', r[2].value === '5', r[2].value);
  ok('0/10 = F', COMPUTE.testGrade({ correct: '0', total: '10' })![1].value === 'F');
  ok('10/10 = A+', COMPUTE.testGrade({ correct: '10', total: '10' })![1].value === 'A+');
  ok('total 0 → null', COMPUTE.testGrade({ correct: '5', total: '0' }) === null);
}
// unitPrice
{
  const r = COMPUTE.unitPrice({ priceA: '3', qtyA: '12', priceB: '5', qtyB: '24' })!;
  ok('A unit 0.25', r[0].value === '0.25', r[0].value);
  ok('B unit ~0.2083', r[1].value.startsWith('0.208'), r[1].value);
  ok('B better value', r[2].value === 'Item B', r[2].value);
  ok('single item (no B)', COMPUTE.unitPrice({ priceA: '3', qtyA: '12' })!.length === 1);
  ok('qtyA 0 → null', COMPUTE.unitPrice({ priceA: '3', qtyA: '0' }) === null);
}
// overtimePay
{
  const r = COMPUTE.overtimePay({ rate: '20', regHours: '40', otHours: '10' })!;
  ok('regular 40×20=800', r[0].value === '800', r[0].value);
  ok('OT 10×20×1.5=300', r[1].value === '300', r[1].value);
  ok('total 1100', r[2].value === '1,100', r[2].value);
  const r2 = COMPUTE.overtimePay({ rate: '20', regHours: '40', otHours: '10', multiplier: '2' })!;
  ok('OT 2x = 400', r2[1].value === '400', r2[1].value);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
