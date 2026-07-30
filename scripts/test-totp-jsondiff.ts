import { hotp, totp, secondsRemaining } from '../src/lib/totp.ts';
import { diffJson, formatDiff } from '../src/lib/json-diff.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// ---- RFC 4226 HOTP test vectors (secret "12345678901234567890" ASCII) ----
const hotpSecret = new TextEncoder().encode('12345678901234567890');
const HOTP_EXPECTED = ['755224', '287082', '359152', '969429', '338314', '254676', '287922', '162583', '399871', '520489'];
for (let c = 0; c < HOTP_EXPECTED.length; c++) {
  const code = await hotp(hotpSecret, c, 6, 'SHA-1');
  ok(`HOTP counter ${c} = ${HOTP_EXPECTED[c]}`, code === HOTP_EXPECTED[c]);
}

// ---- RFC 6238 TOTP test vectors (8 digits) ----
// SHA-1 secret = "12345678901234567890" (20 bytes)
const sha1 = new TextEncoder().encode('12345678901234567890');
ok('TOTP T=59 SHA-1 = 94287082', (await totp(sha1, 59, 30, 8, 'SHA-1')) === '94287082');
ok('TOTP T=1111111109 SHA-1 = 07081804', (await totp(sha1, 1111111109, 30, 8, 'SHA-1')) === '07081804');
ok('TOTP T=1234567890 SHA-1 = 89005924', (await totp(sha1, 1234567890, 30, 8, 'SHA-1')) === '89005924');
ok('TOTP T=2000000000 SHA-1 = 69279037', (await totp(sha1, 2000000000, 30, 8, 'SHA-1')) === '69279037');
// SHA-256 secret = "12345678901234567890123456789012" (32 bytes)
const sha256 = new TextEncoder().encode('12345678901234567890123456789012');
ok('TOTP T=59 SHA-256 = 46119246', (await totp(sha256, 59, 30, 8, 'SHA-256')) === '46119246');
// SHA-512 secret = 64 bytes
const sha512 = new TextEncoder().encode('1234567890123456789012345678901234567890123456789012345678901234');
ok('TOTP T=59 SHA-512 = 90693936', (await totp(sha512, 59, 30, 8, 'SHA-512')) === '90693936');

ok('secondsRemaining at t=0 = 30', secondsRemaining(0, 30) === 30);
ok('secondsRemaining at t=59 = 1', secondsRemaining(59, 30) === 1);

// ---- json-diff ----
ok('identical → no changes', diffJson({ a: 1, b: 2 }, { b: 2, a: 1 }).length === 0);
ok('key reorder is not a change', diffJson({ x: [1, 2], y: 3 }, { y: 3, x: [1, 2] }).length === 0);
const d1 = diffJson({ a: 1, b: 2 }, { a: 1, b: 5 });
ok('changed value detected', d1.length === 1 && d1[0].type === 'changed' && d1[0].path === 'b' && d1[0].oldValue === 2 && d1[0].newValue === 5);
const d2 = diffJson({ a: 1 }, { a: 1, c: 9 });
ok('added key detected', d2.length === 1 && d2[0].type === 'added' && d2[0].path === 'c' && d2[0].newValue === 9);
const d3 = diffJson({ a: 1, b: 2 }, { a: 1 });
ok('removed key detected', d3.length === 1 && d3[0].type === 'removed' && d3[0].path === 'b');
const d4 = diffJson({ u: { roles: ['a', 'b'] } }, { u: { roles: ['a', 'c', 'd'] } });
ok('nested array change path', d4.some((c) => c.path === 'u.roles[1]' && c.type === 'changed'));
ok('nested array addition path', d4.some((c) => c.path === 'u.roles[2]' && c.type === 'added'));
ok('formatDiff identical message', formatDiff([]).startsWith('No differences'));
ok('formatDiff renders change', formatDiff(d1).includes('~ b: 2 → 5'));
ok('type change (number→string)', diffJson({ a: 1 }, { a: '1' })[0].type === 'changed');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
