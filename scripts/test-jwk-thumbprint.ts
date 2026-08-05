import { createHash } from 'node:crypto';
import { canonicalJwk, jwkThumbprint, hasPrivateMembers } from '../src/lib/jwk-thumbprint.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

const b64url = (buf: Buffer) => buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const expectThumb = (canon: string) => b64url(createHash('sha256').update(canon, 'utf8').digest());

// ---- canonicalization KATs (exact string — verifies member selection + order + no whitespace) ----
ok('RSA canonical', canonicalJwk({ kty: 'RSA', n: 'abc', e: 'AQAB', alg: 'RS256', kid: '1', use: 'sig' }) === '{"e":"AQAB","kty":"RSA","n":"abc"}');
ok('EC canonical', canonicalJwk({ kty: 'EC', crv: 'P-256', x: 'XX', y: 'YY', use: 'enc' }) === '{"crv":"P-256","kty":"EC","x":"XX","y":"YY"}');
ok('OKP canonical (no y)', canonicalJwk({ kty: 'OKP', crv: 'Ed25519', x: 'abc' }) === '{"crv":"Ed25519","kty":"OKP","x":"abc"}');
ok('oct canonical', canonicalJwk({ kty: 'oct', k: 'secret', alg: 'HS256' }) === '{"k":"secret","kty":"oct"}');
ok('canonical escapes value', canonicalJwk({ kty: 'RSA', n: 'a"b', e: 'AQAB' }) === '{"e":"AQAB","kty":"RSA","n":"a\\"b"}');

// ---- thumbprint hash matches independent node:crypto over the canonical string ----
const rsa = { kty: 'RSA', n: 'sXchDaQebHnPiGvyDOAT4saGEUetSyo9MRipxnwOK6q3RdIdw', e: 'AQAB', kid: 'ignored' };
const canonRsa = canonicalJwk(rsa);
const r = await jwkThumbprint(rsa);
ok('canonical drops non-required', canonRsa === '{"e":"AQAB","kty":"RSA","n":"sXchDaQebHnPiGvyDOAT4saGEUetSyo9MRipxnwOK6q3RdIdw"}');
ok('thumbprint matches node:crypto sha256', r.thumbprint === expectThumb(canonRsa));
ok('thumbprint is base64url (no +/= )', /^[A-Za-z0-9_-]+$/.test(r.thumbprint));
ok('uri RFC 9278 format', r.uri === `urn:ietf:params:oauth:jwk-thumbprint:sha-256:${r.thumbprint}`);
ok('hash default SHA-256', r.hash === 'SHA-256');

// EC
const ec = { kty: 'EC', crv: 'P-256', x: 'f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU', y: 'x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0' };
ok('EC thumbprint matches node', (await jwkThumbprint(ec)).thumbprint === expectThumb(canonicalJwk(ec)));

// SHA-512 variant
const r512 = await jwkThumbprint(rsa, 'SHA-512');
ok('SHA-512 thumbprint matches node', r512.thumbprint === b64url(createHash('sha512').update(canonRsa, 'utf8').digest()));
ok('SHA-512 uri', r512.uri.startsWith('urn:ietf:params:oauth:jwk-thumbprint:sha-512:'));

// ---- private-member detection ----
ok('detects RSA private (d)', hasPrivateMembers({ kty: 'RSA', n: 'a', e: 'AQAB', d: 'secret', p: 'x', q: 'y' }));
ok('public RSA has no private', !hasPrivateMembers({ kty: 'RSA', n: 'a', e: 'AQAB' }));
ok('result flags private', (await jwkThumbprint({ kty: 'EC', crv: 'P-256', x: 'a', y: 'b', d: 'priv' })).hasPrivate === true);
// but private members do NOT change the thumbprint (only required public members hash)
ok('private members ignored in thumbprint', (await jwkThumbprint({ kty: 'RSA', n: 'a', e: 'AQAB', d: 'zzz' })).thumbprint === (await jwkThumbprint({ kty: 'RSA', n: 'a', e: 'AQAB' })).thumbprint);

// ---- rejections ----
const reject = (jwk: any, label: string) => { let t = false; try { canonicalJwk(jwk); } catch { t = true; } ok(label, t); };
reject({ kty: 'FOO' }, 'rejects unknown kty');
reject({ kty: 'RSA', n: 'a' }, 'rejects missing e');
reject({ kty: 'EC', crv: 'P-256', x: 'a' }, 'rejects EC missing y');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
