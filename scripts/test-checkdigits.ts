import { validateGtin, gtinCheckDigit, completeGtin, validateIsbn, validateIssn, luhnValid, luhnCheckDigit, validateImei } from '../src/lib/checkdigits.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- GTIN / EAN / UPC ----
// EAN-13 4006381333931 (classic valid example, check digit 1)
const e13 = validateGtin('4006381333931')!;
ok('EAN-13 valid', e13.valid && e13.format.includes('EAN-13') && e13.expectedCheckDigit === 1);
ok('EAN-13 wrong check → invalid', validateGtin('4006381333930')!.valid === false);
// UPC-A 036000291452 (valid)
ok('UPC-A valid', validateGtin('036000291452')!.valid && validateGtin('036000291452')!.format === 'UPC-A');
// EAN-8 96385074 (valid)
ok('EAN-8 valid', validateGtin('96385074')!.valid && validateGtin('96385074')!.format === 'EAN-8');
// GTIN-14 from EAN-13 with leading 0? use known: 00012345678905 (valid GTIN-14)
ok('GTIN-14 length recognized', validateGtin('00012345678905')!.length === 14);
ok('gtinCheckDigit for 400638133393 = 1', gtinCheckDigit('400638133393') === 1);
ok('completeGtin adds correct check', completeGtin('400638133393') === '4006381333931');
ok('GTIN rejects bad length', validateGtin('12345') === null);
ok('GTIN handles hyphens/spaces', validateGtin('4-006381 333931')!.valid === true);

// ---- ISBN ----
// ISBN-13 9780306406157 valid ; ISBN-10 0306406152 valid (same book)
ok('ISBN-13 valid', validateIsbn('978-0-306-40615-7')!.valid && validateIsbn('9780306406157')!.type === 'ISBN-13');
ok('ISBN-10 valid', validateIsbn('0-306-40615-2')!.valid && validateIsbn('0306406152')!.type === 'ISBN-10');
ok('ISBN-10 with X check', validateIsbn('080442957X')!.valid === true);
ok('ISBN-13 wrong check invalid', validateIsbn('9780306406158')!.valid === false);
ok('ISBN rejects junk', validateIsbn('12345') === null);

// ---- ISSN ----
// 0378-5955 valid (classic ISSN example, check 5)
ok('ISSN 0378-5955 valid', validateIssn('0378-5955')!.valid);
ok('ISSN with X check 2049-3630', validateIssn('2049-3630')!.valid);
ok('ISSN wrong invalid', validateIssn('0378-5954')!.valid === false);

// ---- Luhn ----
ok('Luhn credit test 4532015112830366', luhnValid('4532015112830366') === true);
ok('Luhn invalid 4532015112830367', luhnValid('4532015112830367') === false);
ok('Luhn ignores spaces', luhnValid('4539 1488 0343 6467') === true);
ok('luhnCheckDigit 7992739871 → 3', luhnCheckDigit('7992739871') === 3);

// ---- IMEI ----
// 490154203237518 valid (classic test IMEI, Luhn ok)
const imei = validateImei('49-015420-323751-8')!;
ok('IMEI valid', imei.valid);
ok('IMEI TAC = 49015420', imei.tac === '49015420');
ok('IMEI serial = 323751', imei.serial === '323751');
ok('IMEI expected check = 8', imei.expectedCheckDigit === 8);
ok('IMEI invalid check', validateImei('490154203237517')!.valid === false);
ok('IMEI rejects non-15-digit', validateImei('12345') === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
