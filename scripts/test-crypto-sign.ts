import { createHmac } from 'node:crypto';
import { hmac, signJwt } from '../src/lib/crypto-sign.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// ---- HMAC: compare Web Crypto impl against Node's crypto (independent oracle) ----
const cases: { msg: string; key: string; algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'; nodeAlgo: string }[] = [
  { msg: 'The quick brown fox jumps over the lazy dog', key: 'key', algo: 'SHA-256', nodeAlgo: 'sha256' },
  { msg: 'Hi There', key: 'Jefe', algo: 'SHA-1', nodeAlgo: 'sha1' },
  { msg: 'message', key: 'secret', algo: 'SHA-384', nodeAlgo: 'sha384' },
  { msg: 'héllo 世界', key: 'pä$$', algo: 'SHA-512', nodeAlgo: 'sha512' },
];
for (const c of cases) {
  const mineHex = await hmac(c.msg, c.key, c.algo, 'hex');
  const nodeHex = createHmac(c.nodeAlgo, c.key).update(c.msg, 'utf8').digest('hex');
  ok(`HMAC-${c.algo} hex matches Node`, mineHex === nodeHex);
  const mineB64 = await hmac(c.msg, c.key, c.algo, 'base64');
  const nodeB64 = createHmac(c.nodeAlgo, c.key).update(c.msg, 'utf8').digest('base64');
  ok(`HMAC-${c.algo} base64 matches Node`, mineB64 === nodeB64);
}
// Known vector: HMAC-SHA256("The quick brown fox…","key")
ok('HMAC-SHA256 known vector', (await hmac('The quick brown fox jumps over the lazy dog', 'key', 'SHA-256', 'hex')) === 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');

// ---- JWT: the canonical jwt.io HS256 example ----
const token = await signJwt({ sub: '1234567890', name: 'John Doe', iat: 1516239022 }, 'your-256-bit-secret', 'HS256');
const expected = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
ok('JWT HS256 matches jwt.io example token', token === expected);
ok('JWT has three segments', token.split('.').length === 3);
// Header decodes correctly
const headerJson = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8'));
ok('JWT header alg/typ', headerJson.alg === 'HS256' && headerJson.typ === 'JWT');
// HS384 / HS512 produce valid-shaped tokens with the right alg
const t384 = await signJwt({ a: 1 }, 's', 'HS384');
ok('HS384 header alg', JSON.parse(Buffer.from(t384.split('.')[0], 'base64url').toString()).alg === 'HS384');
const t512 = await signJwt({ a: 1 }, 's', 'HS512');
ok('HS512 header alg', JSON.parse(Buffer.from(t512.split('.')[0], 'base64url').toString()).alg === 'HS512');
// Signature is base64url (no +/=)
ok('JWT signature is base64url', !/[+/=]/.test(token.split('.')[2]));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
