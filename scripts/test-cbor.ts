import { decodeCbor } from '../src/lib/cbor.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const diag = (hex: string) => decodeCbor(hex).diagnostic;

// ---- RFC 8949 Appendix A test vectors (hex → diagnostic notation) ----
const vectors: [string, string][] = [
  ['00', '0'], ['01', '1'], ['0a', '10'], ['17', '23'], ['1818', '24'], ['1819', '25'],
  ['1864', '100'], ['1903e8', '1000'], ['1a000f4240', '1000000'], ['1b000000e8d4a51000', '1000000000000'],
  ['1bffffffffffffffff', '18446744073709551615'],
  ['20', '-1'], ['29', '-10'], ['3863', '-100'], ['3903e7', '-1000'],
  ['f90000', '0.0'], ['f98000', '-0.0'], ['f93c00', '1.0'], ['fb3ff199999999999a', '1.1'],
  ['f93e00', '1.5'], ['f97bff', '65504.0'], ['fa47c35000', '100000.0'],
  ['f97c00', 'Infinity'], ['f97e00', 'NaN'], ['f9fc00', '-Infinity'],
  ['f4', 'false'], ['f5', 'true'], ['f6', 'null'], ['f7', 'undefined'], ['f0', 'simple(16)'],
  ['40', "h''"], ['4401020304', "h'01020304'"],
  ['60', '""'], ['6161', '"a"'], ['6449455446', '"IETF"'], ['62225c', '"\\"\\\\"'],
  ['80', '[]'], ['83010203', '[1, 2, 3]'],
  ['8301820203820405', '[1, [2, 3], [4, 5]]'],
  ['98190102030405060708090a0b0c0d0e0f101112131415161718181819', '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]'],
  ['a0', '{}'], ['a201020304', '{1: 2, 3: 4}'],
  ['a26161016162820203', '{"a": 1, "b": [2, 3]}'],
  ['826161a161626163', '["a", {"b": "c"}]'],
  ['c074323031332d30332d32315432303a30343a30305a', '0("2013-03-21T20:04:00Z")'],
  ['c11a514b67b0', '1(1363896240)'],
  ['d74401020304', "23(h'01020304')"],
  ['9fff', '[]'],                                    // indefinite empty array
  ['9f018202039f0405ffff', '[1, [2, 3], [4, 5]]'],  // indefinite arrays
  ['bf61610161629f0203ffff', '{"a": 1, "b": [2, 3]}'], // indefinite map
  ['5f42010243030405ff', "h'0102030405'"],          // indefinite byte string
  ['7f657374726561646d696e67ff', '"streaming"'],    // indefinite text string
];
for (const [hex, expected] of vectors) ok(`${hex} → ${expected}`, diag(hex) === expected);

// ---- exact big-int + float values via tree ----
const big = decodeCbor('1bffffffffffffffff').tree as any;
ok('max uint64 exact', big.value === 18446744073709551615n);
const flt = decodeCbor('fb3ff199999999999a').tree as any;
ok('double 1.1 exact', flt.value === 1.1);
ok('bytesRead full', decodeCbor('83010203').bytesRead === 4);
ok('trailing detected', decodeCbor('0000').trailing === 1);

// ---- input formats + rejections ----
ok('0x hex input', diag('0x83,0x01,0x02,0x03') === '[1, 2, 3]');
const reject = (s: string, label: string) => { let t = false; try { decodeCbor(s); } catch { t = true; } ok(label, t); };
reject('', 'empty throws');
reject('18', 'truncated 1-byte uint throws');
reject('8305', 'truncated array throws');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
