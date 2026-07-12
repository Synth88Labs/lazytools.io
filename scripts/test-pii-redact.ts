/**
 * Node test for src/lib/pii-redact.ts — run:
 *   node --experimental-strip-types scripts/test-pii-redact.ts
 */
import { detectPii, redactPii, luhn, defaultEnabled, type PiiType } from '../src/lib/pii-redact.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${JSON.stringify(got)})` : '')); }
}
const all = defaultEnabled();
const types = (t: string) => detectPii(t, all).map((m) => m.type);

// --- Luhn
ok('luhn valid visa', luhn('4111111111111111'));
ok('luhn invalid', !luhn('4111111111111112'));

// --- Email
ok('detects email', types('contact me at jane.doe@example.com please').includes('email'));
ok('redacts email label', redactPii('email: a@b.com', all, 'label').text === 'email: [EMAIL]');

// --- Phone
ok('detects US phone', types('call (555) 123-4567 now').includes('phone'));
ok('detects intl phone', types('+1 415 555 2671').includes('phone'));

// --- SSN
ok('detects ssn', types('SSN 123-45-6789').includes('ssn'));

// --- Credit card (Luhn-valid only)
ok('detects valid card', types('card 4111 1111 1111 1111').includes('card'));
ok('rejects invalid card (fails Luhn)', !types('num 4111 1111 1111 1112').includes('card'));

// --- IPv4
ok('detects ipv4', types('server 192.168.1.1 down').includes('ipv4'));
ok('rejects bad ipv4 (>255)', !types('code 999.999.1.1').includes('ipv4'));

// --- IPv6
ok('detects ipv6', types('addr 2001:0db8:85a3:0000:0000:8a2e:0370:7334').includes('ipv6'));

// --- IBAN (mod-97 valid)
ok('detects valid iban', types('IBAN GB82WEST12345698765432').includes('iban'));
ok('rejects invalid iban', !types('IBAN GB00WEST12345698765432').includes('iban'));

// --- Full redaction with counts
const sample = 'Jane (jane@x.com), phone 555-123-4567, ssn 123-45-6789, card 4111111111111111.';
const r = redactPii(sample, all, 'label');
ok('redacts multiple types', r.text.includes('[EMAIL]') && r.text.includes('[PHONE]') && r.text.includes('[SSN]') && r.text.includes('[CARD]'), r.text);
ok('no raw email left', !r.text.includes('jane@x.com'));
ok('counts email=1', r.counts.email === 1);
ok('counts card=1', r.counts.card === 1);

// --- Partial style keeps last 4
const rp = redactPii('card 4111111111111111', all, 'partial');
ok('partial keeps last4', rp.text.includes('1111'), rp.text);
ok('partial masks the rest', !rp.text.includes('4111111111111111'));

// --- Block style
ok('block masks with block char', redactPii('a@b.com', all, 'block').text.includes('█'));

// --- Disabling a type
const noEmail = { ...all, email: false };
ok('disabled type not detected', !detectPii('a@b.com', noEmail).some((m) => m.type === 'email'));

// --- No false positive on plain text
ok('plain text untouched', redactPii('The quick brown fox jumps over 12 lazy dogs.', all, 'label').matches.length === 0);

// --- Overlap resolution: an email containing dots shouldn't also fire as something else weird
ok('email not double-counted', detectPii('x@example.com', all).filter((m) => m.start === 0).length === 1);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
