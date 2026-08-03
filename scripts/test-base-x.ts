import { ascii85Encode, ascii85Decode, base62Encode, base62Decode, base58Encode, base58Decode } from '../src/lib/base-x.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const enc = (s: string) => new TextEncoder().encode(s);
const dec = (b: Uint8Array) => new TextDecoder().decode(b);

// ---- Ascii85 known vectors ----
// The canonical example from Wikipedia / Adobe: "Man " → "9jqo^" etc.
// "Man " (4 bytes) encodes to "9jqo^"
ok('a85 "Man " = 9jqo^', ascii85Encode(enc('Man ')) === '9jqo^');
// Full famous sentence fragment
const leviathan = 'Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.';
const encoded = ascii85Encode(enc(leviathan));
ok('a85 leviathan starts 9jqo^', encoded.startsWith('9jqo^BlbD-BleB1DJ+*+F(f'));
ok('a85 leviathan round-trips', dec(ascii85Decode(encoded)) === leviathan);
// all-zero group → 'z'
ok('a85 zero group = z', ascii85Encode(new Uint8Array([0, 0, 0, 0])) === 'z');
ok('a85 z decodes to zeros', JSON.stringify([...ascii85Decode('z')]) === JSON.stringify([0, 0, 0, 0]));
// delimiters
ok('a85 delimiters wrap', ascii85Encode(enc('Man '), true) === '<~9jqo^~>');
ok('a85 delimiters decode', dec(ascii85Decode('<~9jqo^~>')) === 'Man ');
// partial groups round-trip (1,2,3 leftover bytes)
for (const s of ['A', 'AB', 'ABC', 'ABCD', 'ABCDE', 'hello', 'sure.']) {
  ok(`a85 round-trip "${s}"`, dec(ascii85Decode(ascii85Encode(enc(s)))) === s);
}
// invalid char
let threw = false; try { ascii85Decode('~~~vbad'); } catch { threw = true; }
ok('a85 rejects bad char', threw);

// ---- Base62 ----
// single bytes map to the alphabet directly for values < 62
ok('b62 [61] = z', base62Encode(new Uint8Array([61])) === 'z');
ok('b62 [0] = 0', base62Encode(new Uint8Array([0])) === '0');
ok('b62 [62] = 10', base62Encode(new Uint8Array([62])) === '10');
ok('b62 [1,0] = 48', base62Encode(new Uint8Array([1, 0])) === '48'); // 256 = 4*62 + 8
ok('b62 leading zeros preserved', base62Encode(new Uint8Array([0, 0, 5])) === '005');
ok('b62 empty', base62Encode(new Uint8Array(0)) === '');
// round-trips over text and pseudo-random bytes
for (const s of ['', 'A', 'hello world', 'Base62!', 'Ünïcödé ✓', '\x00\x00\xff\x01']) {
  ok(`b62 round-trip "${s}"`, dec(base62Decode(base62Encode(enc(s)))) === s);
}
// deterministic pseudo-random byte round-trip (LCG, no Math.random)
let seed = 123456789;
for (let t = 0; t < 200; t++) {
  const len = (seed % 40) + 1;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; arr[i] = seed & 0xff; }
  const rt = base62Decode(base62Encode(arr));
  ok(`b62 fuzz #${t}`, JSON.stringify([...rt]) === JSON.stringify([...arr]));
}
let bthrew = false; try { base62Decode('abc$'); } catch { bthrew = true; }
ok('b62 rejects bad char', bthrew);

// ---- Base58 (Bitcoin alphabet) ----
ok('b58 "Hello World!"', base58Encode(enc('Hello World!')) === '2NEpo7TZRRrLZSi2U');
ok('b58 leading zeros → 1s', base58Encode(new Uint8Array([0, 0, 0, 4, 5])) === '111' + base58Encode(new Uint8Array([4, 5])));
ok('b58 all zeros', base58Encode(new Uint8Array([0, 0, 0])) === '111');
ok('b58 empty', base58Encode(new Uint8Array(0)) === '');
ok('b58 excludes 0OIl', !/[0OIl]/.test(base58Encode(enc('The quick brown fox'))));
for (const s of ['', 'a', 'bitcoin', 'Ünïcödé ✓', '\x00\x01\x02\xff']) {
  ok(`b58 round-trip "${s}"`, dec(base58Decode(base58Encode(enc(s)))) === s);
}
// fuzz round-trips
let seed58 = 987654321;
for (let t = 0; t < 100; t++) {
  const len = (seed58 % 32) + 1;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) { seed58 = (seed58 * 1103515245 + 12345) & 0x7fffffff; arr[i] = seed58 & 0xff; }
  ok(`b58 fuzz #${t}`, JSON.stringify([...base58Decode(base58Encode(arr))]) === JSON.stringify([...arr]));
}
let b58threw = false; try { base58Decode('0OIl'); } catch { b58threw = true; }
ok('b58 rejects look-alikes', b58threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
