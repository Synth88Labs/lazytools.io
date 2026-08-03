import { encodeFloat, decodeBits } from '../src/lib/ieee754.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

const enc = (v: number) => { const [h, s, d] = encodeFloat(v); return { h: h!, s: s!, d: d! }; };

// ---- single-precision known bit patterns ----
ok('1.0 single', enc(1).s.hex === '0x3F800000');
ok('1.0 double', enc(1).d.hex === '0x3FF0000000000000');
ok('1.0 half', enc(1).h.hex === '0x3C00');
ok('-2.0 single', enc(-2).s.hex === '0xC0000000');
ok('0.15625 single', enc(0.15625).s.hex === '0x3E200000');
ok('0.0 single', enc(0).s.hex === '0x00000000');
ok('-0.0 single', enc(-0).s.hex === '0x80000000');
ok('0.0 category zero', enc(0).s.category === 'zero');

// ---- fields for 1.0 single: sign 0, exp 127, unbiased 0, mant 0 ----
const one = enc(1).s;
ok('1.0 sign 0', one.sign === 0);
ok('1.0 exponentRaw 127', one.exponentRaw === 127);
ok('1.0 exponentUnbiased 0', one.exponentUnbiased === 0);
ok('1.0 normal', one.category === 'normal');

// ---- rounding error: 0.1 is not exactly representable ----
const tenth = enc(0.1);
ok('0.1 double error ~0', Math.abs(tenth.d.error) < 1e-17);
ok('0.1 single has rounding error', tenth.s.error !== 0);
ok('0.1 single stored ≈ fround', tenth.s.stored === Math.fround(0.1));

// ---- special values ----
ok('Infinity single', enc(Infinity).s.hex === '0x7F800000' && enc(Infinity).s.category === 'infinity');
ok('-Infinity single', enc(-Infinity).s.hex === '0xFF800000');
ok('NaN single category', enc(NaN).s.category === 'nan');
ok('Infinity half', enc(Infinity).h.hex === '0x7C00');
ok('65504 is max half finite', enc(65504).h.hex === '0x7BFF' && enc(65504).h.category === 'normal');
ok('65520 overflows half to Inf', enc(65520).h.category === 'infinity');

// ---- half specials + subnormal ----
ok('half 1.5', enc(1.5).h.hex === '0x3E00');
ok('smallest half subnormal', enc(Math.pow(2, -24)).h.hex === '0x0001' && enc(Math.pow(2, -24)).h.category === 'subnormal');
ok('smallest normal single', enc(Math.pow(2, -126)).s.category === 'normal');
ok('subnormal single', enc(Math.pow(2, -140)).s.category === 'subnormal');

// ---- decode direction (bits → value) ----
ok('decode 0x3f800000 → 1', decodeBits('0x3f800000', 32).stored === 1);
ok('decode 3FF0…0 double → 1', decodeBits('3FF0000000000000', 64).stored === 1);
ok('decode 0x3c00 half → 1', decodeBits('0x3c00', 16).stored === 1);
ok('decode 0x7fc00000 → NaN', Number.isNaN(decodeBits('0x7fc00000', 32).stored));
ok('decode binary single', decodeBits('01000000010000000000000000000000', 32).stored === 3);
ok('decode fields exp', decodeBits('0x40490fdb', 32).exponentUnbiased === 1); // ~pi
ok('decode pi ≈ 3.14159', Math.abs(decodeBits('0x40490fdb', 32).stored - Math.PI) < 1e-6);

// ---- round-trip: encode then decode returns identical stored value ----
for (const v of [1, -2, 0.1, 3.14159, 1e10, -0.0005, 65504, Math.pow(2, -20)]) {
  const s = enc(v).s;
  const back = decodeBits(s.hex, 32).stored;
  ok(`single round-trip ${v}`, Object.is(back, Math.fround(v)));
  const h = enc(v).h;
  const hback = decodeBits(h.hex, 16).stored;
  ok(`half round-trip ${v}`, Object.is(hback, h.stored));
}

// ---- rejections ----
const reject = (s: string, w: 16 | 32 | 64, label: string) => { let t = false; try { decodeBits(s, w); } catch { t = true; } ok(label, t); };
reject('xyz', 32, 'rejects non-hex');
reject('0x1ffffffff', 32, 'rejects too many bits');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
