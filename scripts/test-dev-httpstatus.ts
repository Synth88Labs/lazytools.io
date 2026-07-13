import assert from 'node:assert';
import { DEV, HTTP_STATUS } from '../src/lib/dev-compute.ts';

const hs = DEV.httpstatus;

// Single code
let r = hs('404', {});
assert.ok(r.output.includes('404 Not Found'));
assert.ok(r.output.includes('4xx Client Error'));

// Extract code from free text ("what does 500 mean")
r = hs('what does 500 mean', {});
assert.ok(r.output.includes('500 Internal Server Error'));
assert.ok(r.output.includes('5xx Server Error'));

// Multiple codes
r = hs('301 404 500', {});
assert.ok(r.output.includes('301 Moved Permanently'));
assert.ok(r.output.includes('404 Not Found'));
assert.ok(r.output.includes('500 Internal Server Error'));
assert.strictEqual(r.info, '3 codes looked up');

// Redirect class
assert.ok(hs('301', {}).output.includes('3xx Redirection'));
assert.ok(hs('200', {}).output.includes('2xx Success'));

// Non-standard but valid 3-digit → labelled by class, not an error
r = hs('499', {});
assert.ok(r.output.includes('4xx Client Error'));

// No code → throws
assert.throws(() => hs('hello', {}));

// Data integrity: every entry has name + desc, key is 3 digits
for (const [code, s] of Object.entries(HTTP_STATUS)) {
  assert.ok(/^\d{3}$/.test(code), `bad code ${code}`);
  assert.ok(s.name && s.desc, `missing fields for ${code}`);
}

console.log('dev-httpstatus: all assertions passed');
