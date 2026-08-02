import { decodeCertificate } from '../src/lib/x509.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// A self-signed RSA-2048 certificate generated with OpenSSL 3.5. Every asserted
// value below was cross-checked against `openssl x509 -text` output.
//   subject/issuer C=US, O=LazyTools Verify, CN=verify.lazytools.io
//   serial 3B57A003401E66445790161216B5FF24D709B945, SHA-256 w/ RSA, 2048-bit
//   SAN DNS:verify.lazytools.io, DNS:alt.lazytools.io ; CA:TRUE
const RSA_PEM = `-----BEGIN CERTIFICATE-----
MIIDoTCCAomgAwIBAgIUO1egA0AeZkRXkBYSFrX/JNcJuUUwDQYJKoZIhvcNAQEL
BQAwRjELMAkGA1UEBhMCVVMxGTAXBgNVBAoMEExhenlUb29scyBWZXJpZnkxHDAa
BgNVBAMME3ZlcmlmeS5sYXp5dG9vbHMuaW8wHhcNMjYwODAyMTg0MDM0WhcNMjcw
OTA2MTg0MDM0WjBGMQswCQYDVQQGEwJVUzEZMBcGA1UECgwQTGF6eVRvb2xzIFZl
cmlmeTEcMBoGA1UEAwwTdmVyaWZ5Lmxhenl0b29scy5pbzCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAL9Zt1NKzQ2opp2Vvev0qprCExZ+fTk5859zL0kp
ts5XefANLRTmyyDsniddd+1Gqwl/A85Ii2T1QT89AAf/QErDx59zL8pKH/k77pmx
zMzoU36v0JYblLRrJ7RtaPQu9ef8U8nZj4ntcTicTtcr7+K3gTrtNY4hP4/5HSWZ
SyNDa3/R0DCCfS0pAIy9EYWAYxfSh+8RjytmYP4T4LLiG5hxscp/NsdztBjEuhPA
+7ZbxdAVi26vFHY62Bd5nOgbADNapYUU4iK1YkWRvr5qQeoVHvi1jna5Sfpfrwew
xxVLlOsCamn2RTyl8MEq16JGgyBNkc1HvyWK/JwJHHorQIkCAwEAAaOBhjCBgzAd
BgNVHQ4EFgQUgHG9B+IX4Ij1dZXikjJ5vLYarlkwHwYDVR0jBBgwFoAUgHG9B+IX
4Ij1dZXikjJ5vLYarlkwDwYDVR0TAQH/BAUwAwEB/zAwBgNVHREEKTAnghN2ZXJp
ZnkubGF6eXRvb2xzLmlvghBhbHQubGF6eXRvb2xzLmlvMA0GCSqGSIb3DQEBCwUA
A4IBAQAPaJ+D/3nH076KO3L92Oh6r8aQq23BmBO11R3GmpUr7XT430M+LT7RT37M
xrEOk9d7cWxgp8//He8mmJ7VO62opLQ/ESv68uQkMFZ8pr0mHTUqtIUo8LfcHVa3
Xf151K62nd393YX6frDhx3i83AwRAcX79wM8BXZRMW61ya8019nyEtSRr3ELEHFX
sYf5H/bnEck5U+BAKWkjE4MaYLwQSytV099pX0bJldq5+0mFpvtOSzgJ36BIdnM/
OSSOdcIvu8C8jnhoi7Xk6oTPuWN7e2y/tocxY+xZcmSNanjE11ZvA0PaFSLoLHUy
/AUymwS2e0x7tvt+6/gZK6oSAu9A
-----END CERTIFICATE-----`;

const c = decodeCertificate(RSA_PEM);
ok('serial matches openssl', c.serialNumber === '3B57A003401E66445790161216B5FF24D709B945');
ok('version v3', c.version === 3);
ok('sig alg', c.signatureAlgorithm === 'SHA-256 with RSA');
ok('subject', c.subject === 'C=US, O=LazyTools Verify, CN=verify.lazytools.io');
ok('issuer', c.issuer === 'C=US, O=LazyTools Verify, CN=verify.lazytools.io');
ok('notBefore', c.notBefore === '2026-08-02T18:40:34Z');
ok('notAfter', c.notAfter === '2027-09-06T18:40:34Z');
ok('pk alg RSA', c.publicKeyAlgorithm === 'RSA');
ok('pk 2048 bit', c.publicKeyBits === 2048);
ok('SANs', JSON.stringify(c.sans) === JSON.stringify(['DNS:verify.lazytools.io', 'DNS:alt.lazytools.io']));
ok('basicConstraints CA:true', c.extensions.find((e) => e.name === 'basicConstraints')?.value.startsWith('CA: true') === true);
ok('basicConstraints critical', c.extensions.find((e) => e.name === 'basicConstraints')?.critical === true);
ok('has SKI', c.extensions.some((e) => e.name === 'subjectKeyIdentifier'));
ok('has AKI', c.extensions.some((e) => e.name === 'authorityKeyIdentifier'));

// Robustness: bare base64 (no PEM armor) decodes identically.
const bare = RSA_PEM.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
ok('parses bare base64', decodeCertificate(bare).serialNumber === c.serialNumber);

// Rejects non-certificate input cleanly.
let threw = false;
try { decodeCertificate('-----BEGIN CERTIFICATE-----\nAAAA\n-----END CERTIFICATE-----'); } catch { threw = true; }
ok('rejects garbage', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
