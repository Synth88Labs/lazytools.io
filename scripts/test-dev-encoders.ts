import { base32Encode, base32Decode, ibanValidate, isbnInfo, punycodeEncode, punycodeDecode, domainToAscii, domainToUnicode } from '../src/lib/dev-encoders.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }
const enc = (s: string) => new TextEncoder().encode(s);
const dec = (b: Uint8Array) => new TextDecoder().decode(b);

// ---- Base32 RFC 4648 test vectors ----
ok('b32 ""', base32Encode(enc('')) === '');
ok('b32 f', base32Encode(enc('f')) === 'MY======');
ok('b32 fo', base32Encode(enc('fo')) === 'MZXQ====');
ok('b32 foo', base32Encode(enc('foo')) === 'MZXW6===');
ok('b32 foob', base32Encode(enc('foob')) === 'MZXW6YQ=');
ok('b32 fooba', base32Encode(enc('fooba')) === 'MZXW6YTB');
ok('b32 foobar', base32Encode(enc('foobar')) === 'MZXW6YTBOI======');
ok('b32 decode foobar', dec(base32Decode('MZXW6YTBOI======')) === 'foobar');
ok('b32 decode no padding', dec(base32Decode('MZXW6YTBOI')) === 'foobar');
ok('b32 roundtrip unicode', dec(base32Decode(base32Encode(enc('héllo 世界')))) === 'héllo 世界');
ok('b32hex foobar', base32Encode(enc('foobar'), true) === 'CPNMUOJ1E8======');
let threw = false; try { base32Decode('MZXW1'); } catch { threw = true; }
ok('b32 invalid char throws', threw);

// ---- IBAN ISO 13616 (known-valid examples) ----
ok('IBAN GB valid', ibanValidate('GB82 WEST 1234 5698 7654 32').valid === true);
ok('IBAN DE valid', ibanValidate('DE89370400440532013000').valid === true);
ok('IBAN FR valid', ibanValidate('FR1420041010050500013M02606').valid === true);
ok('IBAN country parsed', ibanValidate('DE89370400440532013000').country === 'DE');
ok('IBAN formatted groups of 4', ibanValidate('DE89370400440532013000').formatted === 'DE89 3704 0044 0532 0130 00');
ok('IBAN bad checksum invalid', ibanValidate('GB82 WEST 1234 5698 7654 33').valid === false);
ok('IBAN wrong length for country', ibanValidate('DE8937040044053201300').valid === false); // 21, DE needs 22
ok('IBAN bad chars', ibanValidate('DE89 3704 0044 0532 0130 0!').valid === false);

// ---- ISBN ----
const a = isbnInfo('0-306-40615-2');
ok('ISBN-10 valid', a.valid && a.type === 'ISBN-10');
ok('ISBN-10 → 13', a.isbn13 === '9780306406157');
const b = isbnInfo('978-0-306-40615-7');
ok('ISBN-13 valid', b.valid && b.type === 'ISBN-13');
ok('ISBN-13 → 10', b.isbn10 === '0306406152');
ok('ISBN-10 with X check digit', isbnInfo('0-8044-2957-X').valid === true);
ok('ISBN-10 bad check invalid', isbnInfo('0-306-40615-3').valid === false);
ok('ISBN-13 bad check invalid', isbnInfo('9780306406158').valid === false);
ok('ISBN garbage', isbnInfo('hello').valid === false && isbnInfo('hello').type === 'unknown');

// ---- Punycode RFC 3492 (labels) ----
ok('puny encode münchen', punycodeEncode('münchen') === 'mnchen-3ya');
ok('puny decode münchen', punycodeDecode('mnchen-3ya') === 'münchen');
ok('puny encode bücher', punycodeEncode('bücher') === 'bcher-kva');
ok('puny roundtrip 世界', punycodeDecode(punycodeEncode('世界')) === '世界');
ok('puny encode ουτοπία', punycodeEncode('ουτοπία') === 'kxae4bafwg'); // RFC-style Greek "utopia"
// domain helpers
ok('domainToAscii münchen.de', domainToAscii('münchen.de') === 'xn--mnchen-3ya.de');
ok('domainToUnicode xn--mnchen-3ya.de', domainToUnicode('xn--mnchen-3ya.de') === 'münchen.de');
ok('domainToAscii ascii unchanged', domainToAscii('example.com') === 'example.com');
ok('domain roundtrip', domainToUnicode(domainToAscii('bücher.example')) === 'bücher.example');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
